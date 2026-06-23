use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::Emitter;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "lowercase")]
enum ChatRole {
  User,
  Assistant,
  System,
}

#[derive(Debug, Deserialize, Serialize)]
struct ChatMessage {
  role: ChatRole,
  content: String,
}

#[derive(Debug, Serialize)]
struct ChatReply {
  role: ChatRole,
  content: String,
  model: String,
}

#[derive(Debug, Serialize)]
struct QwenRequest {
  model: String,
  messages: Vec<ChatMessage>,
  enable_thinking: bool,
  stream: bool,
}

#[derive(Debug, Deserialize)]
struct QwenResponse {
  choices: Vec<QwenChoice>,
}

#[derive(Debug, Deserialize)]
struct QwenChoice {
  message: ChatMessage,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct QwenStreamChunk {
  request_id: String,
  content: String,
}

#[derive(Debug, Serialize)]
struct QwenStreamResult {
  role: ChatRole,
  content: String,
  model: String,
}

#[derive(Debug, Deserialize)]
struct QwenStreamResponse {
  #[serde(default)]
  choices: Vec<QwenStreamChoice>,
}

#[derive(Debug, Deserialize)]
struct QwenStreamChoice {
  #[serde(default)]
  delta: Option<QwenStreamDelta>,
}

#[derive(Debug, Deserialize)]
struct QwenStreamDelta {
  content: Option<String>,
}

fn load_local_env() {
  let mut directory = std::env::current_dir().ok();

  while let Some(path) = directory {
    let candidate = path.join(".env");

    if candidate.exists() {
      let _ = dotenvy::from_path(candidate);
      return;
    }

    directory = path.parent().map(PathBuf::from);
  }
}

fn qwen_api_key() -> Result<String, String> {
  std::env::var("QWEN_API_KEY")
    .map(|value| value.trim().to_string())
    .ok()
    .filter(|value| !value.is_empty())
    .ok_or_else(|| {
      "未检测到 QWEN_API_KEY，请在项目根目录 .env 中配置，或启动前设置环境变量。".to_string()
    })
}

fn qwen_base_url() -> String {
  std::env::var("QWEN_BASE_URL")
    .ok()
    .filter(|value| !value.trim().is_empty())
    .unwrap_or_else(|| "https://api.agentsyun.com/relay/v1".to_string())
    .trim_end_matches('/')
    .to_string()
}

fn qwen_model() -> String {
  std::env::var("QWEN_MODEL")
    .ok()
    .filter(|value| !value.trim().is_empty())
    .unwrap_or_else(|| "qwen3.7-plus".to_string())
}

fn qwen_enable_thinking() -> bool {
  matches!(
    std::env::var("QWEN_ENABLE_THINKING")
      .ok()
      .map(|value| value.trim().to_lowercase())
      .as_deref(),
    Some("true") | Some("1") | Some("yes") | Some("enabled")
  )
}

fn qwen_service_name() -> String {
  std::env::var("QWEN_SERVICE_NAME")
    .ok()
    .filter(|value| !value.trim().is_empty())
    .unwrap_or_else(|| "Qwen".to_string())
}

fn extract_error_message(response_text: &str) -> String {
  serde_json::from_str::<serde_json::Value>(response_text)
    .ok()
    .and_then(|value| {
      value
        .get("error")
        .and_then(|error| error.get("message"))
        .and_then(|message| message.as_str())
        .map(ToString::to_string)
    })
    .unwrap_or_else(|| response_text.to_string())
}

fn emit_stream_line(
  app: &tauri::AppHandle,
  request_id: &str,
  line: &str,
  service_name: &str,
) -> Result<Option<String>, String> {
  let payload = line
    .strip_prefix("data:")
    .map(str::trim)
    .unwrap_or(line.trim());

  if payload.is_empty() {
    return Ok(None);
  }

  if payload == "[DONE]" {
    return Ok(Some(String::new()));
  }

  let response: QwenStreamResponse = match serde_json::from_str(payload) {
    Ok(response) => response,
    Err(error) => {
      log::debug!("{} 跳过无法解析的流式响应片段：{}；{}", service_name, payload, error);
      return Ok(None);
    }
  };

  let mut streamed_content = String::new();

  for choice in response.choices {
    if let Some(content) = choice.delta.and_then(|delta| delta.content) {
      if !content.is_empty() {
        streamed_content.push_str(&content);
        app
          .emit(
            "qwen-message-chunk",
            QwenStreamChunk {
              request_id: request_id.to_string(),
              content,
            },
          )
          .map_err(|error| format!("{} 流式消息发送失败：{}", service_name, error))?;
      }
    }
  }

  Ok(Some(streamed_content))
}

#[tauri::command]
async fn send_qwen_message(messages: Vec<ChatMessage>) -> Result<ChatReply, String> {
  let api_key = qwen_api_key()?;
  let model = qwen_model();
  let service_name = qwen_service_name();
  let endpoint = format!("{}/chat/completions", qwen_base_url());
  let request = QwenRequest {
    model: model.clone(),
    messages,
    enable_thinking: qwen_enable_thinking(),
    stream: false,
  };

  let response = reqwest::Client::new()
    .post(endpoint)
    .bearer_auth(api_key)
    .json(&request)
    .send()
    .await
    .map_err(|error| format!("{} 请求发送失败：{}", service_name, error))?;

  let status = response.status();
  let response_text = response
    .text()
    .await
    .map_err(|error| format!("{} 响应读取失败：{}", service_name, error))?;

  if !status.is_success() {
    return Err(format!(
      "{} 请求失败（{}）：{}",
      service_name,
      status.as_u16(),
      extract_error_message(&response_text),
    ));
  }

  let payload: QwenResponse =
    serde_json::from_str(&response_text).map_err(|error| format!("{} 响应解析失败：{}", service_name, error))?;
  let message = payload
    .choices
    .into_iter()
    .next()
    .map(|choice| choice.message)
    .ok_or_else(|| format!("{} 没有返回可用回复。", service_name))?;

  Ok(ChatReply {
    role: message.role,
    content: message.content,
    model,
  })
}

#[tauri::command]
async fn send_qwen_message_stream(
  app: tauri::AppHandle,
  messages: Vec<ChatMessage>,
  request_id: String,
) -> Result<QwenStreamResult, String> {
  let api_key = qwen_api_key()?;
  let model = qwen_model();
  let service_name = qwen_service_name();
  let endpoint = format!("{}/chat/completions", qwen_base_url());
  let request = QwenRequest {
    model: model.clone(),
    messages,
    enable_thinking: qwen_enable_thinking(),
    stream: true,
  };

  let response = reqwest::Client::new()
    .post(endpoint)
    .bearer_auth(api_key)
    .json(&request)
    .send()
    .await
    .map_err(|error| format!("{} 请求发送失败：{}", service_name, error))?;

  let status = response.status();

  if !status.is_success() {
    let response_text = response
      .text()
      .await
      .map_err(|error| format!("{} 响应读取失败：{}", service_name, error))?;

    return Err(format!(
      "{} 请求失败（{}）：{}",
      service_name,
      status.as_u16(),
      extract_error_message(&response_text),
    ));
  }

  let mut stream = response.bytes_stream();
  let mut buffer = String::new();
  let mut full_content = String::new();

  while let Some(chunk) = stream.next().await {
    let chunk = chunk.map_err(|error| format!("{} 流式响应读取失败：{}", service_name, error))?;
    buffer.push_str(&String::from_utf8_lossy(&chunk));

    while let Some(line_end) = buffer.find('\n') {
      let mut line = buffer[..line_end].to_string();
      buffer = buffer[line_end + 1..].to_string();

      if line.ends_with('\r') {
        line.pop();
      }

      if let Some(content) = emit_stream_line(&app, &request_id, &line, &service_name)? {
        if content.is_empty() && line.trim().strip_prefix("data:").map(str::trim) == Some("[DONE]") {
          return Ok(QwenStreamResult {
            role: ChatRole::Assistant,
            content: full_content,
            model,
          });
        }

        full_content.push_str(&content);
      }
    }
  }

  if !buffer.trim().is_empty() {
    if let Some(content) = emit_stream_line(&app, &request_id, &buffer, &service_name)? {
      full_content.push_str(&content);
    }
  }

  Ok(QwenStreamResult {
    role: ChatRole::Assistant,
    content: full_content,
    model,
  })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  load_local_env();

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      send_qwen_message,
      send_qwen_message_stream
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{Emitter, Manager, Window};
use tauri_plugin_dialog::DialogExt;

const HERMES_FOLDER_NAME: &str = "Hz-Hermes";
const CONFIG_FOLDER_NAME: &str = "config";
const PROJECTS_INDEX_FILE_NAME: &str = "projects.json";

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "lowercase")]
enum ChatRole {
    User,
    Assistant,
    System,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct ChatMessage {
    role: ChatRole,
    content: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredConversation {
    id: String,
    title: String,
    created_at: u64,
    #[serde(default)]
    updated_at: u64,
    #[serde(default)]
    pinned: bool,
    messages: Vec<ChatMessage>,
    path: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredProjectConversation {
    id: String,
    title: String,
    created_at: u64,
    #[serde(default)]
    updated_at: u64,
    #[serde(default)]
    pinned: bool,
    messages: Vec<ChatMessage>,
    path: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredProject {
    id: String,
    title: String,
    path: String,
    created_at: u64,
    #[serde(default)]
    pinned: bool,
    conversations: Vec<StoredProjectConversation>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct HermesWorkspace {
    root_path: String,
    projects: Vec<StoredProject>,
    conversations: Vec<StoredConversation>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct ProjectIndex {
    projects: Vec<StoredProjectIndexItem>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredProjectIndexItem {
    id: String,
    title: String,
    path: String,
    created_at: u64,
    #[serde(default)]
    pinned: bool,
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

fn now_millis() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis() as u64)
        .unwrap_or(0)
}

fn current_date_folder_name() -> String {
    let chrono_date = chrono::Local::now().date_naive();
    chrono_date.format("%Y-%m-%d").to_string()
}

fn is_date_folder_name(name: &str) -> bool {
    let bytes = name.as_bytes();

    name.len() == 10
        && bytes[4] == b'-'
        && bytes[7] == b'-'
        && bytes
            .iter()
            .enumerate()
            .all(|(index, byte)| index == 4 || index == 7 || byte.is_ascii_digit())
}

fn slugify_id(prefix: &str) -> String {
    format!("{}-{}", prefix, now_millis())
}

fn sanitize_folder_name(name: &str) -> Result<String, String> {
    let sanitized = name
        .trim()
        .chars()
        .map(|character| match character {
            '/' | '\\' | ':' | '*' | '?' | '"' | '<' | '>' | '|' => '-',
            character => character,
        })
        .collect::<String>();

    if sanitized.is_empty() {
        Err("名称不能为空。".to_string())
    } else {
        Ok(sanitized)
    }
}

fn document_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    app.path()
        .document_dir()
        .map_err(|error| format!("无法获取文稿目录：{}", error))
}

fn hermes_root_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    Ok(document_dir(app)?.join(HERMES_FOLDER_NAME))
}

fn ensure_hermes_root_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let root = hermes_root_dir(app)?;
    fs::create_dir_all(root.join(CONFIG_FOLDER_NAME))
        .map_err(|error| format!("无法创建 Hz-Hermes 目录：{}", error))?;
    Ok(root)
}

fn projects_index_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    Ok(ensure_hermes_root_dir(app)?
        .join(CONFIG_FOLDER_NAME)
        .join(PROJECTS_INDEX_FILE_NAME))
}

fn read_project_index(app: &tauri::AppHandle) -> Result<ProjectIndex, String> {
    let path = projects_index_path(app)?;

    if !path.exists() {
        return Ok(ProjectIndex {
            projects: Vec::new(),
        });
    }

    let content =
        fs::read_to_string(&path).map_err(|error| format!("无法读取项目索引：{}", error))?;

    if content.trim().is_empty() {
        return Ok(ProjectIndex {
            projects: Vec::new(),
        });
    }

    serde_json::from_str(&content).map_err(|error| format!("项目索引解析失败：{}", error))
}

fn write_project_index(app: &tauri::AppHandle, index: &ProjectIndex) -> Result<(), String> {
    let path = projects_index_path(app)?;
    let content = serde_json::to_string_pretty(index)
        .map_err(|error| format!("项目索引序列化失败：{}", error))?;

    fs::write(&path, content).map_err(|error| format!("无法写入项目索引：{}", error))
}

fn open_path_in_file_manager(path: &Path) -> Result<(), String> {
    if !path.exists() {
        return Err("项目文件夹不存在。".to_string());
    }

    #[cfg(target_os = "macos")]
    let mut command = {
        let mut command = Command::new("open");
        command.arg(path);
        command
    };

    #[cfg(target_os = "windows")]
    let mut command = {
        let mut command = Command::new("explorer");
        command.arg(path);
        command
    };

    #[cfg(all(unix, not(target_os = "macos")))]
    let mut command = {
        let mut command = Command::new("xdg-open");
        command.arg(path);
        command
    };

    command
        .spawn()
        .map_err(|error| format!("无法打开项目文件夹：{}", error))?;

    Ok(())
}

fn read_conversation_file(path: &Path) -> Option<StoredConversation> {
    let content = fs::read_to_string(path).ok()?;
    let mut conversation = serde_json::from_str::<StoredConversation>(&content).ok()?;
    if conversation.updated_at == 0 {
        conversation.updated_at = conversation.created_at;
    }
    conversation.path = path.to_string_lossy().to_string();
    Some(conversation)
}

fn read_project_conversation_file(path: &Path) -> Option<StoredProjectConversation> {
    let content = fs::read_to_string(path).ok()?;
    let mut conversation = serde_json::from_str::<StoredProjectConversation>(&content).ok()?;
    if conversation.updated_at == 0 {
        conversation.updated_at = conversation.created_at;
    }
    conversation.path = path.to_string_lossy().to_string();
    Some(conversation)
}

fn load_regular_conversations(root: &Path) -> Vec<StoredConversation> {
    let mut conversations = Vec::new();
    let entries = match fs::read_dir(root) {
        Ok(entries) => entries,
        Err(_) => return conversations,
    };

    for entry in entries.flatten() {
        let path = entry.path();

        if !path.is_dir()
            || path.file_name().and_then(|name| name.to_str()) == Some(CONFIG_FOLDER_NAME)
        {
            continue;
        }

        let Ok(files) = fs::read_dir(path) else {
            continue;
        };

        for file in files.flatten() {
            let path = file.path();

            if path.extension().and_then(|extension| extension.to_str()) != Some("json") {
                continue;
            }

            if let Some(conversation) = read_conversation_file(&path) {
                conversations.push(conversation);
            }
        }
    }

    conversations.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    conversations
}

fn load_project_conversations(project_path: &Path) -> Vec<StoredProjectConversation> {
    let mut conversations = Vec::new();

    let mut collect_from_root = |root: PathBuf| {
        let Ok(entries) = fs::read_dir(root) else {
            return;
        };

        for entry in entries.flatten() {
            let path = entry.path();
            let Some(folder_name) = path.file_name().and_then(|name| name.to_str()) else {
                continue;
            };

            if !path.is_dir() || !is_date_folder_name(folder_name) {
                continue;
            }

            let Ok(files) = fs::read_dir(path) else {
                continue;
            };

            for file in files.flatten() {
                let path = file.path();

                if path.extension().and_then(|extension| extension.to_str()) != Some("json") {
                    continue;
                }

                if let Some(conversation) = read_project_conversation_file(&path) {
                    conversations.push(conversation);
                }
            }
        }
    };

    collect_from_root(project_path.to_path_buf());
    collect_from_root(project_path.join(HERMES_FOLDER_NAME).join("conversations"));

    conversations.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    conversations
}

fn load_projects(app: &tauri::AppHandle) -> Result<Vec<StoredProject>, String> {
    let index = read_project_index(app)?;
    let mut projects = index
        .projects
        .into_iter()
        .map(|project| {
            let project_path = PathBuf::from(&project.path);
            let conversations = load_project_conversations(&project_path);

            StoredProject {
                id: project.id,
                title: project.title,
                path: project.path,
                created_at: project.created_at,
                pinned: project.pinned,
                conversations,
            }
        })
        .collect::<Vec<_>>();

    projects.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    Ok(projects)
}

fn write_regular_conversation(
    app: &tauri::AppHandle,
    conversation: &StoredConversation,
) -> Result<StoredConversation, String> {
    let path = if conversation.path.trim().is_empty() {
        let root = ensure_hermes_root_dir(app)?;
        let date_dir = root.join(current_date_folder_name());
        fs::create_dir_all(&date_dir)
            .map_err(|error| format!("无法创建日期对话目录：{}", error))?;
        date_dir.join(format!("{}.json", conversation.id))
    } else {
        PathBuf::from(&conversation.path)
    };
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|error| format!("无法创建对话目录：{}", error))?;
    }
    let stored = StoredConversation {
        path: path.to_string_lossy().to_string(),
        updated_at: now_millis(),
        ..conversation.clone()
    };
    let content = serde_json::to_string_pretty(&stored)
        .map_err(|error| format!("对话序列化失败：{}", error))?;

    fs::write(&path, content).map_err(|error| format!("无法写入对话记录：{}", error))?;
    Ok(stored)
}

fn write_project_conversation(
    project_path: &Path,
    conversation: &StoredProjectConversation,
) -> Result<StoredProjectConversation, String> {
    let path = if conversation.path.trim().is_empty() {
        let date_dir = project_path.join(current_date_folder_name());
        fs::create_dir_all(&date_dir)
            .map_err(|error| format!("无法创建项目对话目录：{}", error))?;
        date_dir.join(format!("{}.json", conversation.id))
    } else {
        PathBuf::from(&conversation.path)
    };
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|error| format!("无法创建项目对话目录：{}", error))?;
    }
    let stored = StoredProjectConversation {
        path: path.to_string_lossy().to_string(),
        updated_at: now_millis(),
        ..conversation.clone()
    };
    let content = serde_json::to_string_pretty(&stored)
        .map_err(|error| format!("项目对话序列化失败：{}", error))?;

    fs::write(&path, content).map_err(|error| format!("无法写入项目对话记录：{}", error))?;
    Ok(stored)
}

#[tauri::command]
fn load_hermes_workspace(app: tauri::AppHandle) -> Result<HermesWorkspace, String> {
    let root = ensure_hermes_root_dir(&app)?;
    let conversations = load_regular_conversations(&root);
    let projects = load_projects(&app)?;

    Ok(HermesWorkspace {
        root_path: root.to_string_lossy().to_string(),
        projects,
        conversations,
    })
}

#[tauri::command]
fn create_hermes_project(app: tauri::AppHandle, title: String) -> Result<StoredProject, String> {
    let folder_name = sanitize_folder_name(&title)?;
    let path = document_dir(&app)?.join(&folder_name);

    if path.exists() {
        return Err(format!("文稿目录中已存在“{}”文件夹。", folder_name));
    }

    fs::create_dir_all(&path).map_err(|error| format!("无法创建项目文件夹：{}", error))?;

    let created_at = now_millis();
    let item = StoredProjectIndexItem {
        id: slugify_id("project"),
        title: folder_name,
        path: path.to_string_lossy().to_string(),
        created_at,
        pinned: false,
    };
    let mut index = read_project_index(&app)?;
    index.projects.insert(0, item.clone());
    write_project_index(&app, &index)?;

    Ok(StoredProject {
        id: item.id,
        title: item.title,
        path: item.path,
        created_at,
        pinned: item.pinned,
        conversations: Vec::new(),
    })
}

#[tauri::command]
fn open_project_folder(app: tauri::AppHandle, project_id: String) -> Result<(), String> {
    let index = read_project_index(&app)?;
    let project = index
        .projects
        .iter()
        .find(|project| project.id == project_id)
        .ok_or_else(|| "未找到对应项目。".to_string())?;

    open_path_in_file_manager(&PathBuf::from(&project.path))
}

#[tauri::command]
fn rename_hermes_project(
    app: tauri::AppHandle,
    project_id: String,
    title: String,
) -> Result<StoredProject, String> {
    let next_title = sanitize_folder_name(&title)?;
    let mut index = read_project_index(&app)?;

    if index
        .projects
        .iter()
        .any(|project| project.id != project_id && project.title == next_title)
    {
        return Err(format!("已存在名为“{}”的项目。", next_title));
    }

    let project = index
        .projects
        .iter_mut()
        .find(|project| project.id == project_id)
        .ok_or_else(|| "未找到对应项目。".to_string())?;
    project.title = next_title;

    let project_path = PathBuf::from(&project.path);
    let stored = StoredProject {
        id: project.id.clone(),
        title: project.title.clone(),
        path: project.path.clone(),
        created_at: project.created_at,
        pinned: project.pinned,
        conversations: load_project_conversations(&project_path),
    };

    write_project_index(&app, &index)?;
    Ok(stored)
}

#[tauri::command]
fn remove_hermes_project(app: tauri::AppHandle, project_id: String) -> Result<(), String> {
    let mut index = read_project_index(&app)?;
    let previous_len = index.projects.len();

    index.projects.retain(|project| project.id != project_id);

    if index.projects.len() == previous_len {
        return Err("未找到对应项目。".to_string());
    }

    write_project_index(&app, &index)
}

#[tauri::command]
async fn choose_existing_project_folder(
    app: tauri::AppHandle,
    window: Window,
) -> Result<Option<StoredProject>, String> {
    let (sender, receiver) = tokio::sync::oneshot::channel();
    app.dialog()
        .file()
        .set_title("选择项目文件夹")
        .set_directory(document_dir(&app)?)
        .set_parent(&window)
        .pick_folder(move |folder| {
            let _ = sender.send(folder);
        });
    let Some(file_path) = receiver
        .await
        .map_err(|error| format!("文件夹选择器返回失败：{}", error))?
    else {
        return Ok(None);
    };
    let path = file_path
        .into_path()
        .map_err(|error| format!("无法读取所选文件夹路径：{}", error))?;

    let title = path
        .file_name()
        .and_then(|name| name.to_str())
        .filter(|name| !name.trim().is_empty())
        .unwrap_or("未命名项目")
        .to_string();
    let path_string = path.to_string_lossy().to_string();
    let mut index = read_project_index(&app)?;

    if let Some(existing) = index
        .projects
        .iter()
        .find(|project| project.path == path_string)
    {
        return Ok(Some(StoredProject {
            id: existing.id.clone(),
            title: existing.title.clone(),
            path: existing.path.clone(),
            created_at: existing.created_at,
            pinned: existing.pinned,
            conversations: load_project_conversations(&path),
        }));
    }

    let item = StoredProjectIndexItem {
        id: slugify_id("project"),
        title,
        path: path_string,
        created_at: now_millis(),
        pinned: false,
    };
    index.projects.insert(0, item.clone());
    write_project_index(&app, &index)?;

    Ok(Some(StoredProject {
        id: item.id,
        title: item.title,
        path: item.path,
        created_at: item.created_at,
        pinned: item.pinned,
        conversations: load_project_conversations(&path),
    }))
}

#[tauri::command]
fn create_regular_conversation(app: tauri::AppHandle) -> Result<StoredConversation, String> {
    let created_at = now_millis();
    let conversation = StoredConversation {
        id: slugify_id("conversation"),
        title: "新对话".to_string(),
        created_at,
        updated_at: created_at,
        pinned: false,
        messages: Vec::new(),
        path: String::new(),
    };

    write_regular_conversation(&app, &conversation)
}

#[tauri::command]
fn save_regular_conversation(
    app: tauri::AppHandle,
    conversation: StoredConversation,
) -> Result<StoredConversation, String> {
    write_regular_conversation(&app, &conversation)
}

#[tauri::command]
fn delete_regular_conversation(path: String) -> Result<(), String> {
    if path.trim().is_empty() {
        return Err("对话路径为空，无法删除。".to_string());
    }

    let path = PathBuf::from(path);

    if path.exists() {
        fs::remove_file(&path).map_err(|error| format!("无法删除对话记录：{}", error))?;
    }

    Ok(())
}

#[tauri::command]
fn set_regular_conversation_pinned(
    path: String,
    pinned: bool,
) -> Result<StoredConversation, String> {
    if path.trim().is_empty() {
        return Err("对话路径为空，无法置顶。".to_string());
    }

    let path = PathBuf::from(path);
    let mut conversation =
        read_conversation_file(&path).ok_or_else(|| "未找到对应对话。".to_string())?;
    conversation.pinned = pinned;
    let content = serde_json::to_string_pretty(&conversation)
        .map_err(|error| format!("对话序列化失败：{}", error))?;
    fs::write(&path, content).map_err(|error| format!("无法写入对话记录：{}", error))?;
    Ok(conversation)
}

#[tauri::command]
fn create_project_conversation(
    app: tauri::AppHandle,
    project_id: String,
) -> Result<StoredProjectConversation, String> {
    let index = read_project_index(&app)?;
    let project = index
        .projects
        .iter()
        .find(|project| project.id == project_id)
        .ok_or_else(|| "未找到对应项目。".to_string())?;
    let created_at = now_millis();
    let conversation = StoredProjectConversation {
        id: slugify_id("conversation"),
        title: "新对话".to_string(),
        created_at,
        updated_at: created_at,
        pinned: false,
        messages: Vec::new(),
        path: String::new(),
    };

    write_project_conversation(&PathBuf::from(&project.path), &conversation)
}

#[tauri::command]
fn delete_project_conversation(
    app: tauri::AppHandle,
    project_id: String,
    path: String,
) -> Result<(), String> {
    let index = read_project_index(&app)?;
    index
        .projects
        .iter()
        .find(|project| project.id == project_id)
        .ok_or_else(|| "未找到对应项目。".to_string())?;

    if path.trim().is_empty() {
        return Err("对话路径为空，无法删除。".to_string());
    }

    let path = PathBuf::from(path);

    if path.exists() {
        fs::remove_file(&path).map_err(|error| format!("无法删除项目对话记录：{}", error))?;
    }

    Ok(())
}

#[tauri::command]
fn set_project_pinned(
    app: tauri::AppHandle,
    project_id: String,
    pinned: bool,
) -> Result<StoredProject, String> {
    let mut index = read_project_index(&app)?;
    let project = index
        .projects
        .iter_mut()
        .find(|project| project.id == project_id)
        .ok_or_else(|| "未找到对应项目。".to_string())?;
    project.pinned = pinned;
    let project_path = PathBuf::from(&project.path);
    let stored = StoredProject {
        id: project.id.clone(),
        title: project.title.clone(),
        path: project.path.clone(),
        created_at: project.created_at,
        pinned: project.pinned,
        conversations: load_project_conversations(&project_path),
    };

    write_project_index(&app, &index)?;
    Ok(stored)
}

#[tauri::command]
fn set_project_conversation_pinned(
    app: tauri::AppHandle,
    project_id: String,
    path: String,
    pinned: bool,
) -> Result<StoredProjectConversation, String> {
    let index = read_project_index(&app)?;
    index
        .projects
        .iter()
        .find(|project| project.id == project_id)
        .ok_or_else(|| "未找到对应项目。".to_string())?;

    if path.trim().is_empty() {
        return Err("对话路径为空，无法置顶。".to_string());
    }

    let path = PathBuf::from(path);
    let mut conversation =
        read_project_conversation_file(&path).ok_or_else(|| "未找到对应项目对话。".to_string())?;
    conversation.pinned = pinned;
    let content = serde_json::to_string_pretty(&conversation)
        .map_err(|error| format!("项目对话序列化失败：{}", error))?;
    fs::write(&path, content).map_err(|error| format!("无法写入项目对话记录：{}", error))?;
    Ok(conversation)
}

#[tauri::command]
fn save_project_conversation(
    app: tauri::AppHandle,
    project_id: String,
    conversation: StoredProjectConversation,
) -> Result<StoredProjectConversation, String> {
    let index = read_project_index(&app)?;
    let project = index
        .projects
        .iter()
        .find(|project| project.id == project_id)
        .ok_or_else(|| "未找到对应项目。".to_string())?;

    write_project_conversation(&PathBuf::from(&project.path), &conversation)
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
            log::debug!(
                "{} 跳过无法解析的流式响应片段：{}；{}",
                service_name,
                payload,
                error
            );
            return Ok(None);
        }
    };

    let mut streamed_content = String::new();

    for choice in response.choices {
        if let Some(content) = choice.delta.and_then(|delta| delta.content) {
            if !content.is_empty() {
                streamed_content.push_str(&content);
                app.emit(
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

    let payload: QwenResponse = serde_json::from_str(&response_text)
        .map_err(|error| format!("{} 响应解析失败：{}", service_name, error))?;
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
        let chunk =
            chunk.map_err(|error| format!("{} 流式响应读取失败：{}", service_name, error))?;
        buffer.push_str(&String::from_utf8_lossy(&chunk));

        while let Some(line_end) = buffer.find('\n') {
            let mut line = buffer[..line_end].to_string();
            buffer = buffer[line_end + 1..].to_string();

            if line.ends_with('\r') {
                line.pop();
            }

            if let Some(content) = emit_stream_line(&app, &request_id, &line, &service_name)? {
                if content.is_empty()
                    && line.trim().strip_prefix("data:").map(str::trim) == Some("[DONE]")
                {
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
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            load_hermes_workspace,
            create_hermes_project,
            open_project_folder,
            rename_hermes_project,
            remove_hermes_project,
            choose_existing_project_folder,
            create_regular_conversation,
            save_regular_conversation,
            delete_regular_conversation,
            set_regular_conversation_pinned,
            create_project_conversation,
            delete_project_conversation,
            set_project_pinned,
            set_project_conversation_pinned,
            save_project_conversation,
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

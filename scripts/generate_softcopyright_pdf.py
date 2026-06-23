#!/usr/bin/env python3
"""Generate HZ HERMES software copyright registration application PDF."""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF

FONT_PATH = "/Library/Fonts/Arial Unicode.ttf"
OUTPUT_PATH = Path("/Users/leo/Desktop/HZ-HERMES-软著登记申请表.pdf")


class SoftCopyrightPDF(FPDF):
    def __init__(self) -> None:
        super().__init__(orientation="P", unit="mm", format="A4")
        self.add_font("cn", "", FONT_PATH)
        self.add_font("cn", "B", FONT_PATH)
        self.set_auto_page_break(auto=True, margin=18)

    def set_cn(self, size: int = 10, bold: bool = False) -> None:
        style = "B" if bold else ""
        self.set_font("cn", style=style, size=size)

    def section_title(self, title: str) -> None:
        self.set_cn(12, bold=True)
        self.set_fill_color(245, 245, 245)
        self.cell(0, 8, title, border=1, ln=1, align="L", fill=True)
        self.ln(1)

    def field_row(self, label: str, value: str, height: float = 8) -> None:
        self.set_cn(10)
        label_w = 42
        value_w = 190 - label_w
        x, y = self.get_x(), self.get_y()
        self.set_xy(x, y)
        self.multi_cell(label_w, height, label, border=1)
        self.set_xy(x + label_w, y)
        self.multi_cell(value_w, height, value, border=1)
        self.set_xy(x, y + max(height, self.get_y() - y))
        self.ln(0)

    def checkbox_line(self, checked: str, unchecked: list[str]) -> None:
        self.set_cn(10)
        parts = [f"☑ {checked}"] + [f"☐ {item}" for item in unchecked]
        self.multi_cell(0, 6, "    ".join(parts))
        self.ln(1)

    def paragraph(self, text: str, size: int = 10) -> None:
        self.set_cn(size)
        self.multi_cell(0, 5.5, text)
        self.ln(2)

    def table_header(self, cols: list[tuple[str, float]]) -> None:
        self.set_cn(9, bold=True)
        for text, width in cols:
            self.cell(width, 7, text, border=1, align="C")
        self.ln()

    def table_row(self, cols: list[tuple[str, float]], height: float = 8) -> None:
        self.set_cn(9)
        x0, y0 = self.get_x(), self.get_y()
        max_h = height
        for text, width in cols:
            x, y = self.get_x(), self.get_y()
            self.set_xy(x, y)
            self.multi_cell(width, height, text, border=1, align="C")
            max_h = max(max_h, self.get_y() - y)
            self.set_xy(x + width, y)
        self.set_xy(x0, y0 + max_h)


def build_pdf() -> None:
    pdf = SoftCopyrightPDF()
    pdf.set_margins(10, 12, 10)

    # Page 1
    pdf.add_page()
    pdf.set_cn(11)
    pdf.cell(0, 6, "受理号：________________    受理签字：________________", ln=1)
    pdf.cell(0, 6, "登记号：________________    审查签字：________________", ln=1)
    pdf.ln(2)
    pdf.set_cn(16, bold=True)
    pdf.cell(0, 10, "计算机软件著作权登记申请表", ln=1, align="C")
    pdf.ln(2)

    pdf.section_title("软件基本信息")
    pdf.field_row("软件全称", "HZ HERMES智能对话与消息集成客户端软件")
    pdf.field_row("版本号", "V1.0")
    pdf.field_row("软件简称", "HZ HERMES客户端")
    pdf.field_row("分类号", "（留空，由登记机构填写）")
    pdf.checkbox_line("应用软件", ["嵌入式软件", "中间件", "操作系统"])
    pdf.ln(1)

    pdf.section_title("软件作品说明")
    pdf.checkbox_line("原创", ["修改（含翻译软件、合成软件）"])
    pdf.paragraph("修改软件须经原权利人授权；原有软件已经登记：不适用。")
    pdf.field_row("开发完成日期", "____年____月____日（请自行填写）")
    pdf.checkbox_line("未发表（不允许公众查询）", ["已发表"])
    pdf.paragraph("首次发表日期：____年____月____日    首次发表地点：____")
    pdf.checkbox_line("独立开发", ["合作开发", "委托开发", "下达任务开发"])

    pdf.section_title("著作权人（请自行填写公司信息）")
    pdf.table_header(
        [
            ("姓名或名称", 34),
            ("类别", 16),
            ("证件类型", 22),
            ("证件号码", 34),
            ("国籍", 14),
            ("省份/城市", 24),
            ("成立日期", 26),
        ]
    )
    pdf.table_row(
        [
            ("【著作权人公司全称】", 34),
            ("企业", 16),
            ("营业执照", 22),
            ("【统一社会信用代码】", 34),
            ("中国", 14),
            ("【省份/城市】", 24),
            ("【成立日期】", 26),
        ],
        height=10,
    )

    # Page 2
    pdf.add_page()
    pdf.section_title("权利说明")
    pdf.checkbox_line("原始取得", ["继受取得（受让 / 承受 / 继承）"])
    pdf.checkbox_line("全部权利", ["部分权利"])
    pdf.ln(2)

    pdf.section_title("软件鉴别材料")
    pdf.paragraph("程序鉴别材料：")
    pdf.checkbox_line(
        "一般交存：提交源程序前连续的30页和后连续的30页",
        [
            "例外交存：使用黑色宽斜线覆盖",
            "例外交存：前10页和任选连续的50页",
            "例外交存：目标程序连续前后各30页和源程序任选连续20页",
        ],
    )
    pdf.paragraph("文档鉴别材料：")
    pdf.checkbox_line(
        "一般交存：提交任何一种文档的前连续的30页和后连续的30页",
        [
            "例外交存：使用黑色宽斜线覆盖",
            "例外交存：前10页和任选连续的50页",
        ],
    )

    pdf.section_title("程序交存文件建议")
    pdf.table_header([("顺序", 16), ("文件路径", 90), ("行数", 24), ("说明", 50)])
    rows = [
        ("1", "src-tauri/src/main.rs", "6", "Rust入口"),
        ("2", "src-tauri/src/lib.rs", "353", "Rust后端核心"),
        ("3", "src/main.tsx", "10", "前端入口"),
        ("4", "src/vite-env.d.ts", "6", "类型声明"),
        ("5", "src/App.tsx", "2470", "前端主程序"),
        ("6", "src/App.css", "2566", "界面样式"),
    ]
    for row in rows:
        pdf.table_row(
            [(row[0], 16), (row[1], 90), (row[2], 24), (row[3], 50)],
            height=7,
        )
    pdf.paragraph(
        "页眉格式：HZ HERMES智能对话与消息集成客户端软件 V1.0；A4纸，每页不少于50行，"
        "前30页从main.rs起按顺序排版，后30页从App.tsx末段接续至App.css末段。"
    )
    pdf.paragraph("文档交存建议：编制《HZ HERMES用户操作手册》，打印前30页和后30页。")

    # Page 3 - environments
    pdf.add_page()
    pdf.section_title("软件功能和技术特点")
    env_fields = [
        ("开发的硬件环境（≤50字）", "Intel/Apple Silicon PC，内存8GB及以上，硬盘可用空间2GB以上"),
        ("运行的硬件环境（≤50字）", "Intel/Apple Silicon/AMD PC，内存4GB及以上，硬盘可用空间500MB以上"),
        ("开发该软件的操作系统（≤50字）", "macOS 13及以上、Windows 10及以上或Linux主流发行版"),
        ("软件开发环境/开发工具（≤50字）", "Tauri 2.x、Vite 8.x、Visual Studio Code、Rust 1.77+"),
        ("该软件的运行平台/操作系统（≤50字）", "macOS 11及以上、Windows 10及以上、Linux（x64/ARM64）"),
        (
            "软件运行支撑环境/支持软件（≤50字）",
            "Node.js 18+、Rust运行时、系统WebView（WebKit2/WebView2）",
        ),
    ]
    for label, value in env_fields:
        pdf.field_row(label, value, height=9)

    pdf.field_row("源程序量", "5445行")
    pdf.field_row(
        "开发目的（≤50字）",
        "为企业提供AI智能对话与多平台消息集成的本地化桌面客户端",
        height=9,
    )
    pdf.field_row("面向领域/行业", "企业服务、人工智能应用、企业信息化与协同办公", height=9)

    pdf.ln(1)
    pdf.set_cn(10, bold=True)
    pdf.cell(0, 7, "编程语言（勾选）", border=1, ln=1, align="L")
    pdf.set_cn(10)
    pdf.multi_cell(
        0,
        6,
        "☑ TypeScript    ☑ JavaScript    ☑ Rust    ☑ HTML\n"
        "☐ C    ☐ C++    ☐ C#    ☐ Go    ☐ Java    ☐ Python    ☐ 其他",
    )
    pdf.ln(2)

    # Page 4-5 - main functions
    pdf.add_page()
    pdf.set_cn(11, bold=True)
    pdf.cell(0, 8, "软件的主要功能（不少于500字）", border=1, ln=1, align="L")
    main_function = (
        "HZ HERMES智能对话与消息集成客户端软件，是一款面向企业与个人用户的跨平台桌面智能助手应用。"
        "随着大语言模型技术普及，用户需要在本地安全、稳定地使用AI对话能力，同时打通钉钉、飞书、"
        "企业微信、微信、QQ、Telegram、Discord等主流消息渠道，实现“一个客户端统一管理智能对话与"
        "消息触达”的需求。现有浏览器方案难以提供原生桌面体验，且跨平台消息凭证管理分散、配置繁琐。"
        "本软件基于Tauri 2跨平台框架与React 19前端技术栈，采用“Rust后端+Web前端”混合架构，后端负责"
        "大模型API调用、流式响应解析与环境变量管理，前端负责界面渲染与业务交互，兼顾性能、安全性与"
        "跨平台一致性。\n\n"
        "技术架构方面：前端使用React 19、TypeScript与Vite构建，采用组件化单页应用设计；桌面壳层使用"
        "Tauri 2，通过Rust实现与操作系统的原生集成；网络通信采用reqwest调用兼容OpenAI协议的大模型接口"
        "（默认对接通义千问Qwen系列），支持流式（SSE）与非流式两种对话模式；配置通过.env环境变量加载，"
        "支持API密钥、模型名称、服务地址等灵活配置；界面遵循Figma设计规范，支持侧边栏折叠、全屏自适应、"
        "自定义标题栏拖拽等原生桌面交互。\n\n"
        "核心功能模块包括：（1）智能对话模块：支持多轮对话、流式实时输出、对话历史管理、自动生成会话"
        "标题、消息发送状态与耗时展示，用户可通过底部输入框发起对话，系统调用后端Rust命令完成模型请求"
        "并通过事件机制将流式片段实时推送至前端渲染。（2）会话管理模块：提供侧边栏对话列表、新建对话、"
        "切换会话、保存滚动位置、近期对话时间格式化显示等功能；内置搜索对话框，支持按标题与消息内容全文"
        "检索历史会话。（3）消息平台集成模块：统一管理钉钉、飞书/Lark、企业微信（群机器人）、微信（扫码"
        "绑定）、QQ机器人，以及API服务、Webhook、腾讯元宝、Telegram、Discord等扩展平台；各平台提供独立"
        "配置面板，支持开关启用、凭证录入与校验、扫码获取凭证、配置保存与应用、操作结果Toast提示等；"
        "钉钉平台支持二维码扫码绑定流程及过期刷新机制。（4）技能市场模块：提供可扩展技能目录，涵盖ACUI"
        "桌面悬浮窗、Airtable数据管理、架构图生成、arXiv论文检索、ComfyUI图像视频生成、Claude/Codex编程"
        "助手等十余类技能；支持网格/列表视图切换、关键词搜索、分类筛选、技能启用/禁用、GitHub导入等能力，"
        "为后续AI Agent能力扩展预留统一入口。（5）系统交互模块：支持窗口全屏检测、侧边栏收起/展开、多视图"
        "路由切换（对话/消息平台/技能）、模态弹窗动画、表单校验与错误提示，提供接近原生应用的桌面使用体验。"
    )
    pdf.set_cn(10)
    pdf.multi_cell(0, 5.5, main_function, border=1)
    pdf.ln(2)

    pdf.add_page()
    pdf.set_cn(11, bold=True)
    pdf.cell(0, 8, "软件的主要功能（续）", border=1, ln=1, align="L")
    main_function_cont = (
        "与现有同类软件相比，本软件的创新点在于：将大模型流式对话、多会话本地状态管理、十余种消息平台"
        "凭证配置统一集成于单一轻量级跨平台桌面客户端；采用Tauri替代Electron，安装包更小、内存占用更低；"
        "Rust后端封装模型调用与流式解析逻辑，避免前端直接暴露API密钥；消息平台与技能市场采用可插拔面板"
        "架构，便于持续扩展新渠道与Agent能力，形成“对话+触达+技能”一体化的智能工作入口。"
    )
    pdf.set_cn(10)
    pdf.multi_cell(0, 5.5, main_function_cont, border=1)
    pdf.ln(2)

    pdf.field_row(
        "软件的技术特点（≤100字）",
        "基于Tauri+React跨平台架构，Rust后端封装大模型流式调用，统一集成多消息平台凭证管理与可扩展技能市场。",
        height=10,
    )
    pdf.ln(1)
    pdf.set_cn(10, bold=True)
    pdf.cell(0, 7, "软件类型（勾选）", border=1, ln=1, align="L")
    pdf.set_cn(10)
    pdf.multi_cell(
        0,
        6,
        "☑ 人工智能软件    ☐ APP    ☐ 教育软件    ☐ 金融软件    ☐ 医疗软件\n"
        "☐ 地理信息软件    ☐ 云计算软件    ☐ 信息安全软件    ☐ 大数据软件\n"
        "☐ 小程序    ☐ 物联网软件    ☐ 智慧城市软件",
    )

    # Page 6 - certificate and materials
    pdf.add_page()
    pdf.section_title("证书份数")
    pdf.field_row("正本", "1 份")
    pdf.field_row("副本", "0 份（按需填写，正本与副本总数不得超过著作权人数量）")
    pdf.ln(2)

    pdf.section_title("提交申请材料清单")
    pdf.table_header([("申请材料类型", 42), ("申请材料名称", 88), ("页数", 50)])
    materials = [
        ("申请表", "打印签字或盖章的登记申请表", "6 页"),
        ("软件鉴别材料", "程序鉴别材料（前30页+后30页）", "60 页"),
        ("软件鉴别材料", "文档鉴别材料（用户操作手册）", "60 页"),
        ("身份证明文件", "申请人营业执照副本复印件", "1 页"),
        ("代理人身份证明复印件", "无", "0 页"),
        ("权利归属证明文件", "无", "0 页"),
        ("其他材料", "无", "0 页"),
    ]
    for mtype, mname, pages in materials:
        pdf.table_row([(mtype, 42), (mname, 88), (pages, 50)], height=8)

    pdf.ln(3)
    pdf.set_cn(10, bold=True)
    pdf.cell(0, 7, "提交前核对清单", ln=1)
    pdf.set_cn(10)
    checklist = [
        "□ 著作权人公司全称、统一社会信用代码、成立日期、开发完成日期已填写",
        "□ 申请表末页已加盖公章",
        "□ 程序鉴别材料60页，页眉含软件全称与版本号",
        "□ 文档鉴别材料60页（用户手册需单独编写）",
        "□ 营业执照副本复印件已准备",
    ]
    for item in checklist:
        pdf.cell(0, 6, item, ln=1)

    pdf.ln(4)
    pdf.set_cn(9)
    pdf.multi_cell(
        0,
        5,
        "填写说明：请按照提示要求提交有关申请材料，并在提交申请材料清单中准确填写实际交存材料页数。"
        "标有【】的栏位为申请人自行填写项。该申请表与鉴别材料一并打印提交。",
    )

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUTPUT_PATH))
    print(f"Generated: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()

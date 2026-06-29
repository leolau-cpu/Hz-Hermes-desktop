import {
  Fragment,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type UIEventHandler,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { LogicalSize } from '@tauri-apps/api/dpi'
import arrowUpIcon from './assets/figma-icons/arrow-up.svg?raw'
import chatPanelArrowLeftIcon from './assets/chat-panel/arrow-left.svg?raw'
import chatPanelArrowRightIcon from './assets/chat-panel/arrow-right.svg?raw'
import chatPanelGlobeIcon from './assets/chat-panel/globe.svg?raw'
import chatPanelRefreshIcon from './assets/chat-panel/refresh-cw.svg?raw'
import chatPanelSiteFileIcon from './assets/chat-panel/site-file-icon.svg?raw'
import botMessageSquareIcon from './assets/figma-icons/bot-message-square.svg?raw'
import chevronDownIcon from './assets/figma-icons/chevron-down.svg?raw'
import circleGaugeIcon from './assets/figma-icons/circle-gauge.svg?raw'
import composerEmployeeIcon from './assets/composer/composer-employee.svg?raw'
import composerAddFileIcon from './assets/composer-popover/add-file.svg?raw'
import composerAddFolderIcon from './assets/composer-popover/add-folder.svg?raw'
import composerAddImageIcon from './assets/composer-popover/add-image.svg?raw'
import composerPermissionDefaultIcon from './assets/composer-popover/permission-default.svg?raw'
import composerPermissionFullIcon from './assets/composer-popover/permission-full.svg?raw'
import composerPermissionReviewIcon from './assets/composer-popover/permission-review.svg?raw'
import composerSnippetIcon from './assets/composer-popover/snippet.svg?raw'
import composerSnippetCodeReviewIcon from './assets/composer-popover/snippet-code-review.svg?raw'
import composerSnippetExplainIcon from './assets/composer-popover/snippet-explain.svg?raw'
import composerSnippetPlanIcon from './assets/composer-popover/snippet-plan.svg?raw'
import composerSkillIcon from './assets/composer/composer-skill.svg?raw'
import ellipsisIcon from './assets/figma-icons/ellipsis.svg?raw'
import layoutGridIcon from './assets/figma-icons/layout-grid.svg?raw'
import libraryBigIcon from './assets/figma-icons/library-big.svg?raw'
import messageCirclePlusIcon from './assets/figma-icons/message-circle-plus.svg?raw'
import micIcon from './assets/figma-icons/mic.svg?raw'
import panelBottomIcon from './assets/figma-icons/panel-bottom.svg?raw'
import panelLeftIcon from './assets/figma-icons/panel-left.svg?raw'
import panelRightIcon from './assets/figma-icons/panel-right.svg?raw'
import plusIcon from './assets/figma-icons/plus.svg?raw'
import searchIcon from './assets/figma-icons/search.svg?raw'
import settingsIcon from './assets/figma-icons/settings.svg?raw'
import arrowUpRightIcon from './assets/platform/arrow-up-right.svg?raw'
import closeIcon from './assets/platform/x.svg?raw'
import dingtalkQr from './assets/platform/dingtalk-qr.png'
import dingtalkQrExpired from './assets/platform/dingtalk-qr-expired.png'
import refreshCwIcon from './assets/platform/refresh-cw.svg?raw'
import scanLineIcon from './assets/platform/scan-line.svg?raw'
import toastCloseIcon from './assets/platform/toast-close.svg?raw'
import wechatQrDisplay from './assets/platform/wechat-qr-display.png'
import checkIcon from './assets/skills/check.svg?raw'
import chevronLeftIcon from './assets/skills/chevron-left.svg?raw'
import chevronRightIcon from './assets/skills/chevron-right.svg?raw'
import githubMarkIcon from './assets/skills/github-mark.svg?raw'
import banIcon from './assets/skills/ban.svg?raw'
import layoutListIcon from './assets/skills/layout-list.svg?raw'
import listFilterIcon from './assets/skills/list-filter.svg?raw'
import messageSquarePlusIcon from './assets/skills/message-square-plus.svg?raw'
import modalXIcon from './assets/skills/modal-x.svg?raw'
import searchSlashIcon from './assets/skills/search-slash.svg?raw'
import xIcon from './assets/skills/x.svg?raw'
import scheduledChevronDownIcon from './assets/scheduled-icons/chevron-down.svg?raw'
import scheduledEmptyAlarmClockCheckIcon from './assets/scheduled-icons/empty-alarm-clock-check.svg?raw'
import scheduledFolderClosedIcon from './assets/scheduled-icons/folder-closed.svg?raw'
import scheduledLaptopIcon from './assets/scheduled-icons/laptop.svg?raw'
import scheduledModalChevronDownIcon from './assets/scheduled-icons/modal-chevron-down.svg?raw'
import scheduledModalLayoutGridIcon from './assets/scheduled-icons/modal-layout-grid.svg?raw'
import scheduledModalXIcon from './assets/scheduled-icons/modal-x.svg?raw'
import scheduledMessageCircleIcon from './assets/scheduled-icons/message-circle.svg?raw'
import scheduledNavAlarmClockCheckIcon from './assets/scheduled-icons/nav-alarm-clock-check.svg?raw'
import scheduledPackageIcon from './assets/scheduled-icons/package.svg?raw'
import scheduledPenIcon from './assets/scheduled-icons/pen.svg?raw'
import scheduledPlayIcon from './assets/scheduled-icons/play.svg?raw'
import scheduledTimerIcon from './assets/scheduled-icons/timer.svg?raw'
import scheduledEllipsisIcon from './assets/scheduled-icons/ellipsis.svg?raw'
import scheduledSquarePenIcon from './assets/scheduled-icons/square-pen.svg?raw'
import scheduledTrashIcon from './assets/scheduled-icons/trash.svg?raw'
import scheduledDeleteModalXIcon from './assets/scheduled-icons/delete-modal-x.svg?raw'
import fileLibraryCircleEllipsisIcon from './assets/file-library-icons/circle-ellipsis.svg?raw'
import fileLibraryDownloadIcon from './assets/file-library-icons/download.svg?raw'
import fileLibraryEllipsisIcon from './assets/file-library-icons/ellipsis.svg?raw'
import fileLibraryFileChartColumnIcon from './assets/file-library-icons/file-chart-column.svg?raw'
import fileLibraryFileImageIcon from './assets/file-library-icons/file-image.svg?raw'
import fileLibraryFilePdfIcon from './assets/file-library-icons/file-pdf.svg?raw'
import fileLibraryFilePptIcon from './assets/file-library-icons/file-ppt.svg?raw'
import fileLibraryFolderMinusIcon from './assets/file-library-icons/folder-minus.svg?raw'
import fileLibraryFolderOpenIcon from './assets/file-library-icons/folder-open.svg?raw'
import fileLibraryFolderSearchIcon from './assets/file-library-icons/folder-search-2.svg?raw'
import fileLibraryLayoutGridIcon from './assets/file-library-icons/layout-grid.svg?raw'
import fileLibraryLayoutListIcon from './assets/file-library-icons/layout-list.svg?raw'
import fileLibraryMenuFolderOpenIcon from './assets/file-library-icons/menu-folder-open.svg?raw'
import fileLibraryModalCloseIcon from './assets/file-library-icons/modal-close.svg?raw'
import fileLibraryPdfIcon from './assets/file-library-icons/pdf.svg?raw'
import fileLibraryPngIcon from './assets/file-library-icons/png.svg?raw'
import fileLibraryPptIcon from './assets/file-library-icons/ppt.svg?raw'
import fileLibrarySearchIcon from './assets/file-library-icons/search.svg?raw'
import fileLibrarySheetIcon from './assets/file-library-icons/sheet.svg?raw'
import fileLibraryTrashIcon from './assets/file-library-icons/trash.svg?raw'
import fileLibraryUnknownIcon from './assets/file-library-icons/unknown.svg?raw'
import fileLibraryWordIcon from './assets/file-library-icons/word.svg?raw'
import fileLibraryXlsxIcon from './assets/file-library-icons/xlsx.svg?raw'
import fileLibraryEmptyFolderOpenIcon from './assets/file-library-icons/empty-folder-open.svg?raw'
import settingsArchiveIcon from './assets/settings/archive.svg?raw'
import settingsArchiveDeleteXIcon from './assets/settings/archive-delete-x.svg?raw'
import settingsArchiveEmptyIcon from './assets/settings/archive-empty.svg?raw'
import settingsArchiveToastBadgeIcon from './assets/settings/archive-toast-badge.svg?raw'
import settingsArchiveTrashIcon from './assets/settings/archive-trash.svg?raw'
import settingsArrowLeftIcon from './assets/settings/arrow-left.svg?raw'
import settingsBrainIcon from './assets/settings/brain.svg?raw'
import settingsCheckIcon from './assets/settings/check.svg?raw'
import settingsChevronDownIcon from './assets/settings/chevron-down.svg?raw'
import settingsChevronRightIcon from './assets/settings/chevron-right.svg?raw'
import settingsCircleUserRoundIcon from './assets/settings/circle-user-round.svg?raw'
import settingsHermesLogoIcon from './assets/settings/hermes-logo.svg?raw'
import settingsInfoIcon from './assets/settings/info.svg?raw'
import settingsGatewayLaptopIcon from './assets/settings/gateway-laptop-minimal.svg?raw'
import settingsKeyRoundIcon from './assets/settings/key-round.svg?raw'
import settingsLaptopMinimalIcon from './assets/settings/laptop-minimal.svg?raw'
import settingsLoaderCircleIcon from './assets/settings/loader-circle.svg?raw'
import settingsMessageCircleIcon from './assets/settings/message-circle.svg?raw'
import settingsMoonIcon from './assets/settings/moon.svg?raw'
import settingsPackageIcon from './assets/settings/package.svg?raw'
import settingsPaletteIcon from './assets/settings/palette.svg?raw'
import settingsRouterIcon from './assets/settings/router.svg?raw'
import settingsServerIcon from './assets/settings/server.svg?raw'
import settingsSunIcon from './assets/settings/sun.svg?raw'
import settingsAccountArrowRightLeftIcon from './assets/settings-account/arrow-right-left.svg?raw'
import settingsAccountExitIcon from './assets/settings-account/square-arrow-right-exit.svg?raw'
import settingsAccountUserIcon from './assets/settings-account/user.svg?raw'
import loginErrorBadgeIcon from './assets/login/error-badge.svg?raw'
import loginHermesLogoIcon from './assets/login/hermes-logo.svg?raw'
import loginCheckIcon from './assets/login/check.svg?raw'
import loginShieldCheckIcon from './assets/login/shield-check.svg?raw'
import loginUserRoundIcon from './assets/login/user-round.svg?raw'
import loginXIcon from './assets/login/x.svg?raw'
import privacyAgreementText from './assets/legal/privacy-agreement.txt?raw'
import userAgreementText from './assets/legal/user-agreement.txt?raw'
import './App.css'

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown
  }
}

type NavAction = {
  label: string
  icon: string
  tone?: 'brand' | 'default'
  action?: 'new-chat' | 'search-chat' | 'message-platform' | 'skills' | 'scheduled-tasks' | 'file-library' | 'settings'
}

type ChatRole = 'user' | 'assistant'

type AppView = 'chat' | 'message-platform' | 'skills' | 'scheduled-tasks' | 'file-library' | 'settings'
type SettingsSection = 'model' | 'chat' | 'appearance' | 'memory' | 'gateway' | 'api-key' | 'archive' | 'about' | 'account'
type AboutUpdateStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'completed'
type LegalAgreementType = 'user' | 'privacy'

const FLOATING_POPOVER_VIEWPORT_MARGIN = 24
const FLOATING_POPOVER_GAP = 4
const FLOATING_POPOVER_MIN_HEIGHT = 36

function useFloatingPopoverPlacement(
  isOpen: boolean,
  anchorRef: { current: HTMLElement | null },
  popoverRef: { current: HTMLElement | null },
  deps: unknown[] = [],
) {
  const [style, setStyle] = useState<CSSProperties>({})

  useLayoutEffect(() => {
    if (!isOpen) {
      setStyle({})
      return undefined
    }

    let frame = 0
    const updatePlacement = () => {
      const anchor = anchorRef.current
      const popover = popoverRef.current

      if (!anchor || !popover) {
        return
      }

      const anchorRect = anchor.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const desiredHeight = Math.ceil(popover.scrollHeight || popover.getBoundingClientRect().height)
      const availableBelow = Math.max(
        FLOATING_POPOVER_MIN_HEIGHT,
        viewportHeight - anchorRect.bottom - FLOATING_POPOVER_GAP - FLOATING_POPOVER_VIEWPORT_MARGIN,
      )
      const availableAbove = Math.max(
        FLOATING_POPOVER_MIN_HEIGHT,
        anchorRect.top - FLOATING_POPOVER_GAP - FLOATING_POPOVER_VIEWPORT_MARGIN,
      )
      const shouldOpenDown = desiredHeight <= availableBelow || availableBelow >= availableAbove
      const maxHeight = Math.floor(shouldOpenDown ? availableBelow : availableAbove)

      setStyle({
        top: shouldOpenDown ? `calc(100% + ${FLOATING_POPOVER_GAP}px)` : 'auto',
        bottom: shouldOpenDown ? 'auto' : `calc(100% + ${FLOATING_POPOVER_GAP}px)`,
        maxHeight: `${Math.max(FLOATING_POPOVER_MIN_HEIGHT, maxHeight)}px`,
        overflowY: desiredHeight > maxHeight ? 'auto' : undefined,
      })
    }
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updatePlacement)
    }

    updatePlacement()
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('scroll', scheduleUpdate, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate, true)
    }
  }, [isOpen, anchorRef, popoverRef, ...deps])

  return style
}

function useFixedFloatingPopoverPlacement(
  isOpen: boolean,
  anchorRef: { current: HTMLElement | null },
  popoverRef: { current: HTMLElement | null },
  align: 'left' | 'right' = 'right',
  deps: unknown[] = [],
) {
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' })

  useLayoutEffect(() => {
    if (!isOpen) {
      setStyle({ visibility: 'hidden' })
      return undefined
    }

    let frame = 0
    const updatePlacement = () => {
      const anchor = anchorRef.current
      const popover = popoverRef.current

      if (!anchor || !popover) {
        return
      }

      const anchorRect = anchor.getBoundingClientRect()
      const popoverRect = popover.getBoundingClientRect()
      const desiredHeight = Math.ceil(popover.scrollHeight || popoverRect.height)
      const desiredWidth = Math.ceil(popover.scrollWidth || popoverRect.width || anchorRect.width)
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const availableBelow = Math.max(
        FLOATING_POPOVER_MIN_HEIGHT,
        viewportHeight - anchorRect.bottom - FLOATING_POPOVER_GAP - FLOATING_POPOVER_VIEWPORT_MARGIN,
      )
      const availableAbove = Math.max(
        FLOATING_POPOVER_MIN_HEIGHT,
        anchorRect.top - FLOATING_POPOVER_GAP - FLOATING_POPOVER_VIEWPORT_MARGIN,
      )
      const shouldOpenDown = desiredHeight <= availableBelow || availableBelow >= availableAbove
      const maxHeight = Math.floor(shouldOpenDown ? availableBelow : availableAbove)
      const renderedHeight = Math.min(desiredHeight, maxHeight)
      const maxLeft = Math.max(
        FLOATING_POPOVER_VIEWPORT_MARGIN,
        viewportWidth - FLOATING_POPOVER_VIEWPORT_MARGIN - desiredWidth,
      )
      const desiredLeft = align === 'left' ? anchorRect.left : anchorRect.right - desiredWidth
      const left = Math.min(maxLeft, Math.max(FLOATING_POPOVER_VIEWPORT_MARGIN, desiredLeft))
      const top = shouldOpenDown
        ? Math.min(
            anchorRect.bottom + FLOATING_POPOVER_GAP,
            viewportHeight - FLOATING_POPOVER_VIEWPORT_MARGIN - renderedHeight,
          )
        : Math.max(
            FLOATING_POPOVER_VIEWPORT_MARGIN,
            anchorRect.top - FLOATING_POPOVER_GAP - renderedHeight,
          )

      setStyle({
        position: 'fixed',
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        maxHeight: `${Math.max(FLOATING_POPOVER_MIN_HEIGHT, maxHeight)}px`,
        overflowY: desiredHeight > maxHeight ? 'auto' : undefined,
        visibility: 'visible',
      })
    }
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updatePlacement)
    }

    updatePlacement()
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('scroll', scheduleUpdate, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate, true)
    }
  }, [isOpen, anchorRef, popoverRef, align, ...deps])

  return style
}

function useFixedSidePopoverPlacement(
  isOpen: boolean,
  anchorRef: { current: HTMLElement | null },
  popoverRef: { current: HTMLElement | null },
  deps: unknown[] = [],
) {
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' })

  useLayoutEffect(() => {
    if (!isOpen) {
      setStyle({ visibility: 'hidden' })
      return undefined
    }

    let frame = 0
    const updatePlacement = () => {
      const anchor = anchorRef.current
      const popover = popoverRef.current

      if (!anchor || !popover) {
        return
      }

      const anchorRect = anchor.getBoundingClientRect()
      const popoverRect = popover.getBoundingClientRect()
      const desiredHeight = Math.ceil(popover.scrollHeight || popoverRect.height)
      const desiredWidth = Math.ceil(popover.scrollWidth || popoverRect.width || anchorRect.width)
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const sideGap = 0
      const availableRight =
        viewportWidth - anchorRect.right - sideGap - FLOATING_POPOVER_VIEWPORT_MARGIN
      const availableLeft = anchorRect.left - sideGap - FLOATING_POPOVER_VIEWPORT_MARGIN
      const shouldOpenRight = desiredWidth <= availableRight || availableRight >= availableLeft
      const left = shouldOpenRight
        ? Math.min(
            viewportWidth - FLOATING_POPOVER_VIEWPORT_MARGIN - desiredWidth,
            anchorRect.right + sideGap,
          )
        : Math.max(
            FLOATING_POPOVER_VIEWPORT_MARGIN,
            anchorRect.left - sideGap - desiredWidth,
          )
      const maxHeight = Math.max(
        FLOATING_POPOVER_MIN_HEIGHT,
        viewportHeight - FLOATING_POPOVER_VIEWPORT_MARGIN * 2,
      )
      const renderedHeight = Math.min(desiredHeight, maxHeight)
      const top = Math.min(
        viewportHeight - FLOATING_POPOVER_VIEWPORT_MARGIN - renderedHeight,
        Math.max(FLOATING_POPOVER_VIEWPORT_MARGIN, anchorRect.bottom - renderedHeight),
      )

      setStyle({
        position: 'fixed',
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        maxHeight: `${Math.max(FLOATING_POPOVER_MIN_HEIGHT, maxHeight)}px`,
        overflowY: desiredHeight > maxHeight ? 'auto' : undefined,
        visibility: 'visible',
      })
    }
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updatePlacement)
    }

    updatePlacement()
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('scroll', scheduleUpdate, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate, true)
    }
  }, [isOpen, anchorRef, popoverRef, ...deps])

  return style
}

type ScheduledTask = {
  id: string
  title: string
  prompt: string
  schedule: string
  model: string
  enabled: boolean
}

const scheduledTaskDefaults: ScheduledTask[] = [
  {
    id: 'news-briefing',
    title: '每日新闻简报',
    prompt:
      '每周一至周五 上午8:00：请为用户生成今日新闻简报。 要求： 1. 搜索今日（2026年5月28日）国内外重要新闻，选取3-5条最有价值的资讯 2. 每条新闻包含标题和1-2句话简述 3. 涵盖科技、财经、社会、国际等类别 4. 风格简洁、专业、有观点 5. 控制在300字以内 6.',
    schedule: '工作日8:00',
    model: '默认模型',
    enabled: false,
  },
  {
    id: 'daily-fortune',
    title: '每日运势解读',
    prompt:
      '为用户生成一份当日运势解读。内容用中文，语气温暖、清醒、不过度迷信，包含：整体运势、事业/学习、财运、人际/感情、健康与状态、今日提醒。保持简洁实用。',
    schedule: '工作日8:00',
    model: 'Minimax',
    enabled: false,
  },
  {
    id: 'defect-scan',
    title: '每日缺陷扫描',
    prompt:
      '扫描最近的 commit（自上次运行以来，或过去 24 小时内），查找可能的 bug 并提出最小修复方案。依据规则：- 只使用仓库中的具体证据（commit SHA、PR、文件路径、diff、失败的测试、CI 信号）。- 不要臆造 bug；如果证据不足，请说明并跳过。- 优先选择最小且安全的修复；避免重构和无关清理。',
    schedule: '工作日8:00',
    model: 'Qwen3.6-Plus',
    enabled: false,
  },
  {
    id: 'weekly-report',
    title: '每周项目周报',
    prompt: '每周五下午6:00 汇总本周项目进展、风险、待办和下周计划，输出一份结构清晰的中文周报。',
    schedule: '工作日8:00',
    model: '默认模型',
    enabled: false,
  },
  {
    id: 'monthly-review',
    title: '月度复盘提醒',
    prompt: '每月最后一个工作日提醒用户复盘本月目标完成情况，并整理关键成果、问题原因和下月重点行动。',
    schedule: '工作日8:00',
    model: 'Qwen3.6-Plus',
    enabled: false,
  },
]

type ChatMessage = {
  role: ChatRole
  content: string
  processedSeconds?: number
}

type ConversationRecord = {
  id: string
  title: string
  active: boolean
  createdAt: number
  messages: ChatMessage[]
}

type QwenStreamResult = {
  role: 'assistant'
  content: string
  model: string
}

type QwenStreamChunk = {
  requestId: string
  content: string
}

type PlatformStatus = 'off' | 'pending' | 'complete'
type PlatformToastTone = 'warning' | 'error' | 'success'

type PlatformTitlebarState = {
  isDocked: boolean
  isListDocked: boolean
  isDetailDocked: boolean
  title: string
  icon: string
  isEnabled: boolean
  actions?: ReactNode
}

type SettingsTitlebarState = {
  isDocked: boolean
  title: string
}

type PlatformToastState = {
  tone: PlatformToastTone
  message: string
  id: number
  actionLabel?: string
  onAction?: () => void
}

type PlatformToastPayload = {
  tone: PlatformToastTone
  message: string
  actionLabel?: string
  onAction?: () => void
}

const primaryActions: NavAction[] = [
  { label: '新对话', icon: messageCirclePlusIcon, action: 'new-chat' },
  { label: '搜索对话', icon: searchIcon, action: 'search-chat' },
  { label: '消息平台', icon: botMessageSquareIcon, action: 'message-platform' },
  { label: '技能', icon: layoutGridIcon, action: 'skills' },
  { label: '定时任务', icon: scheduledNavAlarmClockCheckIcon, action: 'scheduled-tasks' },
  { label: '文件库', icon: libraryBigIcon, action: 'file-library' },
]

type SkillItem = {
  title: string
  description: string
  enabled: boolean
}

const skillImageColors = ['#ff5c4d', '#ff922b', '#27b66a', '#0088ff', '#7080ff', '#966cff', '#e64d92']

const getSkillImageText = (title: string) => {
  const firstCharacter = Array.from(title.trim())[0] ?? ''

  return /^[a-z]$/i.test(firstCharacter) ? firstCharacter.toUpperCase() : firstCharacter
}

type EmployeeItem = {
  title: string
  description: string
  action?: 'more' | 'plus'
  image?: string
}

type FileLibraryCategory = {
  id: string
  label: string
  count: number
  icon: string
}

type FileLibraryItem = {
  id: string
  name: string
  size: string
  updatedAt: string
  icon: string
  category: Exclude<FileLibraryCategory['id'], 'all'>
}

const fileLibraryCategories: FileLibraryCategory[] = [
  { id: 'all', label: '全部', count: 12, icon: fileLibraryFolderOpenIcon },
  { id: 'document', label: '文档', count: 0, icon: fileLibraryFileChartColumnIcon },
  { id: 'sheet', label: '表格', count: 0, icon: fileLibrarySheetIcon },
  { id: 'image', label: '图片', count: 0, icon: fileLibraryFileImageIcon },
  { id: 'ppt', label: 'PPT', count: 0, icon: fileLibraryFilePptIcon },
  { id: 'pdf', label: 'PDF', count: 0, icon: fileLibraryFilePdfIcon },
  { id: 'other', label: '其他', count: 0, icon: fileLibraryCircleEllipsisIcon },
]

const fileLibraryMockFiles: FileLibraryItem[] = [
  {
    id: 'product-word',
    name: '产品文档.word',
    size: '3.2 KB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryWordIcon,
    category: 'document',
  },
  {
    id: 'finance-xlsx',
    name: '财务报表.xlsx',
    size: '4.2 KB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryXlsxIcon,
    category: 'sheet',
  },
  {
    id: 'dog-png',
    name: '小狗图片.png',
    size: '1.2 MB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryPngIcon,
    category: 'image',
  },
  {
    id: 'company-ppt',
    name: '公司简介.ppt',
    size: '3.2 KB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryPptIcon,
    category: 'ppt',
  },
  {
    id: 'product-pdf',
    name: '产品文档.pdf',
    size: '168.2 KB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryPdfIcon,
    category: 'pdf',
  },
  {
    id: 'unknown-js',
    name: '未知文件.js',
    size: '1.2 KB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryUnknownIcon,
    category: 'other',
  },
  {
    id: 'product-word-copy',
    name: '产品文档-副本.word',
    size: '3.2 KB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryWordIcon,
    category: 'document',
  },
  {
    id: 'finance-xlsx-copy',
    name: '财务报表-副本.xlsx',
    size: '4.2 KB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryXlsxIcon,
    category: 'sheet',
  },
  {
    id: 'dog-png-copy',
    name: '小狗图片-副本.png',
    size: '1.2 MB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryPngIcon,
    category: 'image',
  },
  {
    id: 'company-ppt-copy',
    name: '公司简介-副本.ppt',
    size: '3.2 KB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryPptIcon,
    category: 'ppt',
  },
  {
    id: 'product-pdf-copy',
    name: '产品文档-副本.pdf',
    size: '168.2 KB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryPdfIcon,
    category: 'pdf',
  },
  {
    id: 'unknown-js-copy',
    name: '未知文件-副本.js',
    size: '1.2 KB',
    updatedAt: '2026/05/26 11:45',
    icon: fileLibraryUnknownIcon,
    category: 'other',
  },
]

const skillItems: SkillItem[] = [
  {
    title: 'ACUI桌面悬浮窗',
    description: '轻量级桌面展示技能，把客户的产品、数据或品牌内容悬浮在用户桌面右下角。',
    enabled: false,
  },
  {
    title: 'Airtable数据管理',
    description: '用 RESTAPI 操作 Airtable: 增删改查、筛选、更新插入。',
    enabled: false,
  },
  {
    title: 'Apple备忘录',
    description: '用 memoCLI 管理 Apple 备忘录:创建、搜索、编辑。',
    enabled: false,
  },
  {
    title: 'Apple提醒事项',
    description: '用 remindctl 管理提醒事项:添加、列出、完成。',
    enabled: false,
  },
  {
    title: '架构图生成',
    description: '生成深色 SVG 架构/云/基础设施图 (HTML)0',
    enabled: false,
  },
  {
    title: 'arXiv 论文检索',
    description: '按关键词/作者/分类/ ID 检索 arXiv 论文。',
    enabled: false,
  },
  {
    title: '字符画生成',
    description: '字符画: pyfiglet、cowsay、boxes、图片转字符。',
    enabled: false,
  },
  {
    title: '字符视频生成',
    description: '字符视频:视频/音频转彩色字符 MP4/GIF。',
    enabled: false,
  },
  {
    title: 'AudioCraft音频生成',
    description: 'AudioCraft:MusicGen 文生音乐、AudioGen 文生音效。',
    enabled: false,
  },
  {
    title: '信息图生成',
    description: '信息图:21种风格x21种布局(可视化)。',
    enabled: false,
  },
  {
    title: '博客与RSS监控',
    description: '监控博客与RSS/Atom订阅源。',
    enabled: false,
  },
  {
    title: 'Claude Code编程助手',
    description: '委托 Claude Code CLI编程(开发功能、提PR)。',
    enabled: false,
  },
  {
    title: 'HTML设计原型',
    description: '设计一次性HTML作品(落地页、幻灯、原型)。',
    enabled: false,
  },
  {
    title: '代码库检查用',
    description: 'pygount检查代码库:行数、语言、占比。',
    enabled: false,
  },
  {
    title: 'Codex编程助手',
    description: '委托OpenAI Codex CLI编程(开发功能、提PR)。',
    enabled: false,
  },
]

const skillTabs = ['全部', '三方服务', '创意', '数据科学', '运维', '邮件', '游戏']

const employeeTabs = ['全部', 'GEO', '内容创作', '营销增长', '技术工程', '生活娱乐']

const employeeItems: EmployeeItem[] = [
  {
    title: 'GEO快捷入口',
    description: '快速启动GEO检测，支持表单快速检测或5路并行专业审计，完成后生成可视化仪表盘。',
    image: '/员工图标/GEO 快捷入口2.png',
  },
  {
    title: 'GEO全站审计',
    description: '一键扫描整个网站，给出AI搜索综合评分和按优先级排列的改进清单。',
    image: '/员工图标/GEO 全站审计.png',
  },
  {
    title: 'AI可引用度评分',
    description: '逐段分析网页内容，评估被AI引用摘录的概率，并给出具体改写建议。',
    image: '/员工图标/AI 可引用度评分.png',
  },
  {
    title: 'GEO内容质量评估',
    description: '从经验、专业度、权威性、可信度四个维度深度评估内容质量，并对比竞品找出差距。',
    image: '/员工图标/GEO 内容质量评估.png',
  },
  {
    title: 'GEO 技术审计',
    description: '深度检查网站的爬取、索引、安全、性能、服务端渲染等9大技术维度，找出影响AI可见度的技术障碍。',
    image: '/员工图标/GEO 技术审计.png',
  },
  {
    title: 'Schema结构化数据',
    description: '检测、验证并生成Schema.org结构化数据，帮助AI系统正确识别你的品牌实体和跨平台身份。',
    action: 'plus',
    image: '/员工图标/Schema 结构化数据.png',
  },
  {
    title: 'AI爬虫访问分析',
    description: '检查网站是否无意中屏蔽了AI爬虫，并提供修复建议。',
    image: '/员工图标/AI 爬虫访问分析2.png',
  },
  {
    title: 'llms.txt生成校验',
    description: '创建或校验llms.txt文件，主动告诉AI系统你的网站是做什么的、哪些页面最重要。',
    image: '/员工图标/llms.txt 生成校验.png',
  },
  {
    title: 'AI平台优化',
    description: '针对 DeepSeek、豆包、通义千问、Kimi等平台逐一评估并给出定制优化方案。',
    image: '/员工图标/AI 平台优化.png',
  },
  {
    title: '品牌提及扫描',
    description: '检测你的品牌在AI信任的平台上的存在度和权威性。',
    image: '/员工图标/品牌提及扫描2.png',
  },
  {
    title: 'GEO客户报告',
    description: '将所有审计结果汇总为一份面向企业决策者的专业综合报告，技术发现翻译成商业语言。',
    image: '/员工图标/GEO 客户报告.png',
  },
  {
    title: 'GEO 报告 PDF',
    description: '将审计报告转换为带封面、彩色评分表和严重性标签的精美PDF，适合直接发送给客户。',
    image: '/员工图标/GEO 报告 PDF.png',
  },
  {
    title: 'GEO月度对比报告',
    description: '对比两次审计结果，生成带进度条和趋势箭头的月度改进报告，方便向客户展示成果。',
    image: '/员工图标/GEO 月度对比报告2.png',
  },
  {
    title: 'GEO 服务提案',
    description: '根据审计数据自动生成面向客户的三档服务报价方案，包含ROI预估和6个月路线图。',
    image: '/员工图标/GEO 服务提案.png',
  },
  {
    title: 'GEO客户管理',
    description: '轻量级CRM，跟踪GEO业务客户从线索到签约的完整销售管道，管理审计历史和沟通记录。',
    image: '/员工图标/GEO 客户管理.png',
  },
  {
    title: '地图与路线查询',
    description: '基于OpenStreetMap的免费工具，支持地理编码、周边设施搜索、距离计算、路线导航和时区查询。',
    image: '/员工图标/地图与路线查询.png',
  },
  {
    title: 'ACUI桌面悬浮窗',
    description: '轻量级桌面展示技能，把客户的产品、数据或品牌内容悬浮在用户桌面右下角。',
  },
]

const platformGroups = [
  {
    title: '常用',
    items: [
      { key: 'dingding', label: '钉钉', icon: '/消息平台/dingding-round.svg' },
      { key: 'feishu', label: '飞书/Lark', icon: '/消息平台/feishu-round.svg' },
      { key: 'qiyeweixin', label: '企业微信（群机器人）', icon: '/消息平台/qiyeweixin-round.svg' },
      { key: 'weixin', label: '微信（个人·ClawBot扫码）', icon: '/消息平台/weixin-round.svg' },
      { key: 'qq', label: 'QQ机器人', icon: '/消息平台/qq-round.svg' },
    ],
  },
  {
    title: '更多',
    items: [
      { key: 'api', label: 'API服务', icon: '/消息平台/api-round.svg' },
      { key: 'webhook', label: 'WebhooK', icon: '/消息平台/webhook-round.svg' },
      { key: 'yuanbao', label: '腾讯元宝', icon: '/消息平台/yuanbao-round.svg' },
      { key: 'telegram', label: 'Telegram', icon: '/消息平台/telegram-round.svg' },
      { key: 'discord', label: 'Discord', icon: '/消息平台/discord-round.svg' },
    ],
  },
]

const platformScrollTestGroups = Array.from({ length: 4 }, (_, groupIndex) => ({
  title: '更多',
  items: platformGroups[1].items.map((item) => ({
    ...item,
    key: `${item.key}-scroll-test-${groupIndex}`,
  })),
}))

const dingTalkScrollTestSections = Array.from({ length: 6 }, (_, sectionIndex) => sectionIndex)

function getPlatformTitleIcon(icon: string | undefined) {
  return icon?.replace('-round.svg', '-square.svg') ?? ''
}

const footerActions: NavAction[] = [
  { label: '充值额度', icon: circleGaugeIcon, tone: 'brand' },
  { label: '设置', icon: settingsIcon, action: 'settings' },
]

type SettingsNavItem = {
  id: SettingsSection
  label: string
  icon: string
  dividerBefore?: boolean
}

const settingsNavItems: SettingsNavItem[] = [
  { id: 'model', label: '模型', icon: settingsPackageIcon },
  { id: 'chat', label: '聊天', icon: settingsMessageCircleIcon },
  { id: 'appearance', label: '外观', icon: settingsPaletteIcon },
  { id: 'memory', label: '记忆与上下文', icon: settingsBrainIcon },
  { id: 'gateway', label: '网关', icon: settingsServerIcon, dividerBefore: true },
  { id: 'api-key', label: 'API Key 配置', icon: settingsKeyRoundIcon },
  { id: 'archive', label: '已归档对话', icon: settingsArchiveIcon },
  { id: 'about', label: '关于我们', icon: settingsInfoIcon },
  { id: 'account', label: '账号设置', icon: settingsCircleUserRoundIcon },
]

const settingsModelOptions = [
  'Qwen3.6-Plus',
  'Qwen3-VL-Flash',
  'deepseek-v4-pro',
  'Deepseek-v4-flash',
  'GLM-5.1',
  'Kimi-K2.6',
  'Qwen3.5-Plus',
]
const settingsModelDefaults = {
  主模型: 'Qwen3.6-Plus',
  子模型: 'Qwen3.6-Plus',
  视觉模型: 'Qwen3-VL-Flash',
  图片模型: 'Doubao-Seedream-4.5',
  语音模型: 'Qwen3-tts-flash',
} as const
const settingsModelSelectRows = [
  { label: '主模型', options: settingsModelOptions },
  { label: '子模型', options: settingsModelOptions },
  { label: '视觉模型', options: ['Qwen3-VL-Flash'] },
  { label: '图片模型', options: ['Doubao-Seedream-4.5'] },
  { label: '语音模型', options: ['Qwen3-tts-flash'] },
]

type SettingsSelectRow = {
  label: string
  options: string[]
  mutedValue?: string
}

type SettingsToggleRow = {
  label: string
  description?: string
  enabled: boolean
}

type SettingsTimeRow = {
  label: string
  description: string
  values: [string, string, string]
}

type SettingsTimeValues = [string, string, string]

const defaultChatPersona = '萌系'
const defaultTimezoneValues: SettingsTimeValues = ['12', '00', '00']

type SettingsSegmentRow = {
  label: string
  options: Array<{
    label: string
    icon: string
  }>
  selected: string
}

type SettingsPageConfig = {
  title: string
  description: string
  selectRows?: SettingsSelectRow[]
  toggleRows?: SettingsToggleRow[]
  timeRows?: SettingsTimeRow[]
  segmentRows?: SettingsSegmentRow[]
  actions?: boolean
}

type VisibleSettingsSection =
  | 'model'
  | 'chat'
  | 'appearance'
  | 'memory'
  | 'gateway'
  | 'api-key'
  | 'archive'
  | 'about'
  | 'account'

const settingsGatewayCards = [
  {
    id: 'local',
    label: '本地网关',
    icon: settingsGatewayLaptopIcon,
    description: '在localhost上启动一个私有的Hermes仪表盘后端。这是默认设置，可离线运行。',
  },
  {
    id: 'remote',
    label: '远程网关',
    icon: settingsRouterIcon,
    description: '使用会话令牌将此桌面壳连接到远程Hermes仪表盘后端。',
  },
] as const

type SettingsGatewayMode = (typeof settingsGatewayCards)[number]['id']

const settingsApiKeyOptions = [
  { label: '集散中心展厅专用', key: 'sk-huizhi-1rw2****elDz' },
  { label: '品宣部门专用', key: 'sk-huizhi-1rw2****elDz' },
  { label: 'Gnomic专用', key: 'sk-huizhi-1rw2****elDz' },
  { label: '软件谷镜界小程序', key: 'sk-huizhi-1rw2****elDz' },
] as const

type SettingsApiKeyLabel = (typeof settingsApiKeyOptions)[number]['label']

const initialArchivedConversations = [
  {
    id: 'weekly-summary',
    title: '帮我写一份周报总结',
    meta: '2026年5月28日，11:35 • Token官网',
  },
  {
    id: 'dog-photo',
    title: '生成一张小狗照片',
    meta: '2026年5月28日，11:35 • Token官网',
  },
  {
    id: 'daily-brief-email',
    title: '整理今天的简讯，并且发送到我的邮箱里',
    meta: '2026年5月28日，11:35 • 对话',
  },
] as const

type ArchivedConversation = (typeof initialArchivedConversations)[number]

const settingsPageConfigs: Record<VisibleSettingsSection, SettingsPageConfig> = {
  model: {
    title: '模型',
    description: '用于选择爱马仕使用哪些 AI 模型，包括主模型、子模型、视觉模型、图片模型和语音模型。',
    selectRows: settingsModelSelectRows,
  },
  chat: {
    title: '聊天',
    description: '用于调整爱马仕的对话体验，例如助手人格、时区等。',
    selectRows: [
      {
        label: '助手人格',
        options: [
          '乐于助人',
          '简洁',
          '技术',
          '创意',
          '老师',
          '萌系',
          '猫娘',
          '海盗',
          '莎士比亚',
          '冲浪手',
          '黑色电影',
          'UwU',
          '哲学家',
          '热血',
        ],
      },
    ],
    timeRows: [
      {
        label: '时区',
        description: 'Hermes需要本地时间时使用，留空则跟随系统时区',
        values: defaultTimezoneValues,
      },
    ],
    actions: true,
  },
  appearance: {
    title: '外观',
    description: '用于设置界面显示效果，例如语言、主题样式等。',
    selectRows: [
      {
        label: '语言',
        options: ['中文', 'English'],
      },
    ],
    segmentRows: [
      {
        label: '主题',
        selected: '浅色',
        options: [
          { label: '浅色', icon: settingsSunIcon },
          { label: '深色', icon: settingsMoonIcon },
          { label: '系统', icon: settingsLaptopMinimalIcon },
        ],
      },
    ],
  },
  memory: {
    title: '记忆与上下文',
    description: '用于设置爱马仕是否记住用户偏好，以及长对话时如何保留重点内容。',
    selectRows: [
      {
        label: '记忆服务商',
        options: ['内置', 'Honcho(外部记忆)'],
      },
      {
        label: '上下文引擎',
        options: ['压缩器', '默认', '自定义'],
      },
    ],
    toggleRows: [
      { label: '持久记忆', enabled: true },
      { label: '自动压缩', enabled: true },
      { label: '用户档案', enabled: true },
    ],
  },
  gateway: {
    title: '网关连接',
    description:
      '爱马仕默认启动自己的本地网关。当你希望本应用控制另一台机器上或可信代理后已经运行的Hermes仪表盘后端时，请使用远程网关。',
  },
  'api-key': {
    title: 'API Key 配置',
    description: '用于填写和管理各类模型或第三方服务所需的 API Key。目前仅支持使用词元工场的API Key。',
  },
  archive: {
    title: '已归档对话',
    description: '恢复或永久删除已归档的对话',
  },
  about: {
    title: '关于我们',
    description: '版本信息与更新管理',
  },
  account: {
    title: '账号设置',
    description: '管理你的账号，可切换其他账号使用。',
  },
}

const englishTextEntries = [
  ['新对话', 'New Chat'],
  ['搜索对话', 'Search Chats'],
  ['近期对话', 'Recent chats'],
  ['近期无对话', 'No recent chats'],
  ['无搜索结果', 'No results'],
  ['消息平台', 'Messaging Platforms'],
  ['技能', 'Skills'],
  ['员工', 'Employees'],
  ['定时任务', 'Scheduled Tasks'],
  ['文件库', 'File Library'],
  ['充值额度', 'Credits'],
  ['设置', 'Settings'],
  ['项目', 'Projects'],
  ['暂无项目', 'No projects'],
  ['对话', 'Chats'],
  ['暂无对话', 'No chats'],
  ['今天想做点什么？', 'What would you like to do today?'],
  ['输入消息', 'Type a message'],
  ['输入消息，继续提问', 'Type a message to continue'],
  ['用/skill-creator 创建一个技能，你先问我技能应该做什么吧。', 'Use /skill-creator to create a skill. Ask me what it should do first.'],
  ['默认权限', 'Default permission'],
  ['正在思考…', 'Thinking...'],
  ['底部面板', 'Bottom panel'],
  ['右侧面板', 'Right panel'],
  ['更多对话操作', 'More chat actions'],
  ['展开侧边栏', 'Expand sidebar'],
  ['收起侧边栏', 'Collapse sidebar'],
  ['常用', 'Common'],
  ['更多', 'More'],
  ['钉钉', 'DingTalk'],
  ['飞书/Lark', 'Feishu/Lark'],
  ['企业微信（群机器人）', 'WeCom Group Bot'],
  ['微信（个人·ClawBot扫码）', 'WeChat Personal ClawBot'],
  ['QQ机器人', 'QQ Bot'],
  ['API服务', 'API Service'],
  ['腾讯元宝', 'Tencent Yuanbao'],
  ['获取你的凭证', 'Get your credentials'],
  ['扫码获取', 'Scan to get'],
  ['设置指南', 'Setup guide'],
  ['应用', 'Apply'],
  ['保存', 'Save'],
  ['保存成功', 'Saved'],
  ['重置成功', 'Reset successfully'],
  ['你还未输入凭证', 'Credentials are required'],
  ['凭证错误', 'Invalid credentials'],
  ['在钉钉开发者后台创建一个应用，将ClientID (App key) 和 Client Secret 复制到这里。', 'Create an app in the DingTalk developer console, then paste the ClientID (App key) and Client Secret here.'],
  ['创建一个飞书/Lark应用，将App ID 和 App Secret 复制到这里。', 'Create a Feishu/Lark app, then paste the App ID and App Secret here.'],
  ['在企业微信中添加机器人，将 Bot ID 和 Secret 复制到这里。', 'Add a bot in WeCom, then paste the Bot ID and Secret here.'],
  ['在 QQ 开放平台注册一个应用，将 App ID 和 App Secret 复制到这里。', 'Register an app on the QQ Open Platform, then paste the App ID and App Secret here.'],
  ['创建一个API服务应用，将App ID 和 App Secret 复制到这里。', 'Create an API Service app, then paste the App ID and App Secret here.'],
  ['创建一个WebhooK应用，将App ID 和 App Secret 复制到这里。', 'Create a Webhook app, then paste the App ID and App Secret here.'],
  ['创建一个腾讯元宝应用，将App ID 和 App Secret 复制到这里。', 'Create a Tencent Yuanbao app, then paste the App ID and App Secret here.'],
  ['创建一个Telegram应用，将App ID 和 App Secret 复制到这里。', 'Create a Telegram app, then paste the App ID and App Secret here.'],
  ['创建一个Discord应用，将App ID 和 App Secret 复制到这里。', 'Create a Discord app, then paste the App ID and App Secret here.'],
  ['输入钉钉客户端ID', 'Enter DingTalk client ID'],
  ['输入钉钉客户端密钥', 'Enter DingTalk client secret'],
  ['输入企业微信客户端ID', 'Enter WeCom client ID'],
  ['输入企业微信客户端Secret', 'Enter WeCom client secret'],
  ['输入QQ客户端ID', 'Enter QQ client ID'],
  ['输入QQ机器人客户端Secret', 'Enter QQ bot client secret'],
  ['输入API服务客户端ID', 'Enter API Service client ID'],
  ['输入API服务客户端Secret', 'Enter API Service client secret'],
  ['输入WebhooK客户端ID', 'Enter Webhook client ID'],
  ['输入WebhooK客户端Secret', 'Enter Webhook client secret'],
  ['输入腾讯元宝客户端ID', 'Enter Tencent Yuanbao client ID'],
  ['输入腾讯元宝客户端Secret', 'Enter Tencent Yuanbao client secret'],
  ['输入Telegram客户端ID', 'Enter Telegram client ID'],
  ['输入Telegram客户端Secret', 'Enter Telegram client secret'],
  ['输入Discord客户端ID', 'Enter Discord client ID'],
  ['输入Discord客户端Secret', 'Enter Discord client secret'],
  ['已保存:sk-h...slAz', 'Saved: sk-h...slAz'],
  ['已保存:ww-sec...9xK2', 'Saved: ww-sec...9xK2'],
  ['已保存:qq-sec...7bQp', 'Saved: qq-sec...7bQp'],
  ['已保存:api-sec...4kY8', 'Saved: api-sec...4kY8'],
  ['已保存:webhook-sec...6mC2', 'Saved: webhook-sec...6mC2'],
  ['已保存:yuanbao-sec...8pR1', 'Saved: yuanbao-sec...8pR1'],
  ['已保存:telegram-sec...5nT7', 'Saved: telegram-sec...5nT7'],
  ['已保存:discord-sec...3dL9', 'Saved: discord-sec...3dL9'],
  ['关闭钉钉', 'Disable DingTalk'],
  ['开启钉钉', 'Enable DingTalk'],
  ['扫码获取凭证', 'Scan to get credentials'],
  ['点击刷新二维码', 'Click to refresh QR code'],
  ['模拟二维码过期', 'Simulate QR code expiration'],
  ['点击刷新', 'Refresh'],
  ['使用钉钉扫码，并在手机上确认', 'Scan with DingTalk and confirm on your phone'],
  ['登录成功后自动写入WECHAT_CLAW_ACCOUNT_ID与WECHAT_CLAW_TOKEN，无需手动配置。', 'After login succeeds, WECHAT_CLAW_ACCOUNT_ID and WECHAT_CLAW_TOKEN will be written automatically. No manual setup is required.'],
  ['这是iLink分配给你本次扫码的BotID，不是你的真实微信号(iLink设计上不暴露昵称)。切换账号请点上方[扫码登录」用另一个微信重扫即可覆盖。', 'This is the BotID iLink assigned for this scan, not your real WeChat ID. iLink does not expose nicknames by design. To switch accounts, scan again with another WeChat account to overwrite it.'],
  ['当前先完成钉钉功能，其他平台后续按设计稿继续补齐。', 'DingTalk is implemented first. Other platforms will be completed according to the design later.'],
  ['打开微信 扫码连接', 'WeChat Scan Connect'],
  ['断开连接', 'Disconnect'],
  ['已连接微信', 'WeChat connected'],
  ['登录成功', 'Login successful'],
  ['全部', 'All'],
  ['三方服务', 'Third-party Services'],
  ['创意', 'Creative'],
  ['数据科学', 'Data Science'],
  ['运维', 'Operations'],
  ['邮件', 'Email'],
  ['游戏', 'Games'],
  ['内容创作', 'Content Creation'],
  ['营销增长', 'Marketing Growth'],
  ['技术工程', 'Engineering'],
  ['生活娱乐', 'Lifestyle'],
  ['搜索技能', 'Search skills'],
  ['搜索员工', 'Search employees'],
  ['添加技能', 'Add Skill'],
  ['通过对话创建', 'Create via Chat'],
  ['描述你的需求，AI帮你生成', 'Describe your needs and AI will generate it'],
  ['从GitHub导入', 'Import from GitHub'],
  ['粘贴一个仓库连接进行开始', 'Paste a repository link to start'],
  ['来源筛选', 'Source filter'],
  ['全部来源', 'All sources'],
  ['内置技能', 'Built-in skills'],
  ['自定义', 'Custom'],
  ['未找到技能', 'No skills found'],
  ['未找到员工', 'No employees found'],
  ['更替关键词再试试', 'Try a different keyword'],
  ['去对话', 'Chat'],
  ['去使用', 'Use'],
  ['停用技能', 'Disable skill'],
  ['技能更多操作', 'More skill actions'],
  ['员工更多操作', 'More employee actions'],
  ['技能列表', 'Skill list'],
  ['员工列表', 'Employee list'],
  ['技能筛选工具栏', 'Skill filter toolbar'],
  ['卡片视图', 'Card view'],
  ['列表视图', 'List view'],
  ['ACUI桌面悬浮窗', 'ACUI Desktop Floating Window'],
  ['轻量级桌面展示技能，把客户的产品、数据或品牌内容悬浮在用户桌面右下角。', 'A lightweight desktop display skill that floats customer product, data, or brand content in the lower-right corner.'],
  ['Airtable数据管理', 'Airtable Data Management'],
  ['用 RESTAPI 操作 Airtable: 增删改查、筛选、更新插入。', 'Use REST APIs to operate Airtable: create, read, update, delete, filter, and upsert records.'],
  ['Apple备忘录', 'Apple Notes'],
  ['用 memoCLI 管理 Apple 备忘录:创建、搜索、编辑。', 'Use memoCLI to manage Apple Notes: create, search, and edit notes.'],
  ['Apple提醒事项', 'Apple Reminders'],
  ['用 remindctl 管理提醒事项:添加、列出、完成。', 'Use remindctl to manage reminders: add, list, and complete items.'],
  ['架构图生成', 'Architecture Diagram Generator'],
  ['生成深色 SVG 架构/云/基础设施图 (HTML)0', 'Generate dark SVG architecture, cloud, or infrastructure diagrams (HTML).'],
  ['arXiv 论文检索', 'arXiv Paper Search'],
  ['按关键词/作者/分类/ ID 检索 arXiv 论文。', 'Search arXiv papers by keyword, author, category, or ID.'],
  ['字符画生成', 'ASCII Art Generator'],
  ['字符画: pyfiglet、cowsay、boxes、图片转字符。', 'ASCII art: pyfiglet, cowsay, boxes, and image-to-text conversion.'],
  ['字符视频生成', 'ASCII Video Generator'],
  ['字符视频:视频/音频转彩色字符 MP4/GIF。', 'ASCII video: convert video or audio into colored character MP4/GIF output.'],
  ['AudioCraft音频生成', 'AudioCraft Audio Generator'],
  ['AudioCraft:MusicGen 文生音乐、AudioGen 文生音效。', 'AudioCraft: MusicGen text-to-music and AudioGen text-to-sound effects.'],
  ['信息图生成', 'Infographic Generator'],
  ['信息图:21种风格x21种布局(可视化)。', 'Infographics: 21 styles by 21 visual layouts.'],
  ['博客与RSS监控', 'Blog and RSS Monitor'],
  ['监控博客与RSS/Atom订阅源。', 'Monitor blogs and RSS/Atom feeds.'],
  ['Claude Code编程助手', 'Claude Code Programming Assistant'],
  ['委托 Claude Code CLI编程(开发功能、提PR)。', 'Delegate programming to Claude Code CLI for feature development and PRs.'],
  ['HTML设计原型', 'HTML Design Prototype'],
  ['设计一次性HTML作品(落地页、幻灯、原型)。', 'Design one-off HTML works such as landing pages, slides, and prototypes.'],
  ['代码库检查用', 'Codebase Inspection'],
  ['pygount检查代码库:行数、语言、占比。', 'Use pygount to inspect codebases: line counts, languages, and proportions.'],
  ['Codex编程助手', 'Codex Programming Assistant'],
  ['委托OpenAI Codex CLI编程(开发功能、提PR)。', 'Delegate programming to OpenAI Codex CLI for feature development and PRs.'],
  ['GEO快捷入口', 'GEO Quick Launch'],
  ['快速启动GEO检测，支持表单快速检测或5路并行专业审计，完成后生成可视化仪表盘。', 'Quickly start GEO checks with form-based quick tests or five parallel professional audits, then generate a visual dashboard.'],
  ['GEO全站审计', 'GEO Full-site Audit'],
  ['一键扫描整个网站，给出AI搜索综合评分和按优先级排列的改进清单。', 'Scan an entire website in one click, then provide an AI search score and prioritized improvement list.'],
  ['AI可引用度评分', 'AI Citation Score'],
  ['逐段分析网页内容，评估被AI引用摘录的概率，并给出具体改写建议。', 'Analyze page content paragraph by paragraph, estimate AI citation likelihood, and provide rewrite suggestions.'],
  ['GEO内容质量评估', 'GEO Content Quality Evaluation'],
  ['从经验、专业度、权威性、可信度四个维度深度评估内容质量，并对比竞品找出差距。', 'Evaluate content quality across experience, expertise, authority, and trust, then compare competitors to find gaps.'],
  ['GEO 技术审计', 'GEO Technical Audit'],
  ['深度检查网站的爬取、索引、安全、性能、服务端渲染等9大技术维度，找出影响AI可见度的技术障碍。', 'Deeply inspect nine technical dimensions such as crawling, indexing, security, performance, and SSR to find AI visibility blockers.'],
  ['Schema结构化数据', 'Schema Structured Data'],
  ['检测、验证并生成Schema.org结构化数据，帮助AI系统正确识别你的品牌实体和跨平台身份。', 'Detect, validate, and generate Schema.org structured data so AI systems can identify your brand entity and cross-platform identity.'],
  ['AI爬虫访问分析', 'AI Crawler Access Analysis'],
  ['检查网站是否无意中屏蔽了AI爬虫，并提供修复建议。', 'Check whether the site accidentally blocks AI crawlers and provide fixes.'],
  ['llms.txt生成校验', 'llms.txt Generator and Validator'],
  ['创建或校验llms.txt文件，主动告诉AI系统你的网站是做什么的、哪些页面最重要。', 'Create or validate llms.txt files to tell AI systems what your site does and which pages matter most.'],
  ['AI平台优化', 'AI Platform Optimization'],
  ['针对 DeepSeek、豆包、通义千问、Kimi等平台逐一评估并给出定制优化方案。', 'Evaluate platforms such as DeepSeek, Doubao, Tongyi Qianwen, and Kimi, then provide tailored optimization plans.'],
  ['品牌提及扫描', 'Brand Mention Scan'],
  ['检测你的品牌在AI信任的平台上的存在度和权威性。', 'Check your brand presence and authority on AI-trusted platforms.'],
  ['GEO客户报告', 'GEO Client Report'],
  ['将所有审计结果汇总为一份面向企业决策者的专业综合报告，技术发现翻译成商业语言。', 'Summarize all audit findings into a professional report for business decision-makers, translating technical findings into business language.'],
  ['GEO 报告 PDF', 'GEO Report PDF'],
  ['将审计报告转换为带封面、彩色评分表和严重性标签的精美PDF，适合直接发送给客户。', 'Convert audit reports into polished PDFs with covers, color scorecards, and severity labels, ready to send to clients.'],
  ['GEO月度对比报告', 'GEO Monthly Comparison Report'],
  ['对比两次审计结果，生成带进度条和趋势箭头的月度改进报告，方便向客户展示成果。', 'Compare two audits and generate a monthly improvement report with progress bars and trend arrows for client updates.'],
  ['GEO 服务提案', 'GEO Service Proposal'],
  ['根据审计数据自动生成面向客户的三档服务报价方案，包含ROI预估和6个月路线图。', 'Generate three-tier client service proposals from audit data, including ROI estimates and a six-month roadmap.'],
  ['GEO客户管理', 'GEO Client Management'],
  ['轻量级CRM，跟踪GEO业务客户从线索到签约的完整销售管道，管理审计历史和沟通记录。', 'A lightweight CRM for tracking GEO clients from lead to contract while managing audit history and communications.'],
  ['地图与路线查询', 'Map and Route Lookup'],
  ['基于OpenStreetMap的免费工具，支持地理编码、周边设施搜索、距离计算、路线导航和时区查询。', 'A free OpenStreetMap-based tool for geocoding, nearby search, distance calculation, routing, and time zone lookup.'],
  ['停用员工', 'Disable employee'],
  ['停用员工？', 'Disable employee?'],
  ['若停用，相关的历史对话、远程连接等信息都将被删除，该操作不可逆', 'Disabling will delete related chat history and remote connections. This cannot be undone.'],
  ['停用', 'Disable'],
  ['定时任务', 'Scheduled Tasks'],
  ['创建', 'Create'],
  ['暂无定时任务', 'No scheduled tasks'],
  ['暂无定时任务，可点击右侧按钮创建', 'No scheduled tasks. Use the button on the right to create one.'],
  ['暂无定时任务，可点击右上方按钮创建', 'No scheduled tasks. Use the top-right button to create one.'],
  ['通过聊天创建', 'Create via Chat'],
  ['手动创建', 'Create Manually'],
  ['运行', 'Run'],
  ['任务更多操作', 'More task actions'],
  ['编辑', 'Edit'],
  ['删除', 'Delete'],
  ['确认删除？', 'Confirm deletion?'],
  ['删除后，该任务将无法恢复', 'This task cannot be restored after deletion.'],
  ['请输入定时任务标题', 'Enter a scheduled task title'],
  ['请输入定时任务指令，例如：设定每日热点简报', 'Enter task instructions, e.g. set a daily briefing'],
  ['本地', 'Local'],
  ['Token官网', 'Token Website'],
  ['工作日8:00', 'Weekdays 8:00'],
  ['默认模型', 'Default model'],
  ['已设2项', '2 configured'],
  ['取消', 'Cancel'],
  ['确定', 'Confirm'],
  ['返回', 'Back'],
  ['模型', 'Models'],
  ['聊天', 'Chat'],
  ['外观', 'Appearance'],
  ['记忆与上下文', 'Memory & Context'],
  ['网关', 'Gateway'],
  ['API Key 配置', 'API Key Configuration'],
  ['已归档对话', 'Archived Chats'],
  ['关于我们', 'About Us'],
  ['账号设置', 'Account Settings'],
  ['用于选择爱马仕使用哪些 AI 模型，包括主模型、子模型、视觉模型、图片模型和语音模型。', 'Choose which AI models Hermes uses, including primary, sub, vision, image, and speech models.'],
  ['用于调整爱马仕的对话体验，例如助手人格、时区等。', 'Adjust the Hermes chat experience, such as assistant persona and time zone.'],
  ['用于设置界面显示效果，例如语言、主题样式等。', 'Configure display options such as language and theme.'],
  ['用于设置爱马仕是否记住用户偏好，以及长对话时如何保留重点内容。', 'Configure whether Hermes remembers preferences and how long conversations preserve key context.'],
  ['爱马仕默认启动自己的本地网关。当你希望本应用控制另一台机器上或可信代理后已经运行的Hermes仪表盘后端时，请使用远程网关。', 'Hermes starts its own local gateway by default. Use a remote gateway when this desktop shell should connect to a trusted Hermes dashboard backend on another machine or proxy.'],
  ['用于填写和管理各类模型或第三方服务所需的 API Key。目前仅支持使用词元工场的API Key。', 'Manage API keys for models and third-party services. Currently only Token Workshop keys are supported.'],
  ['恢复或永久删除已归档的对话', 'Restore or permanently delete archived chats.'],
  ['版本信息与更新管理', 'Version info and update management.'],
  ['管理你的账号，可切换其他账号使用。', 'Manage your account and switch accounts.'],
  ['主模型', 'Primary Model'],
  ['子模型', 'Sub Model'],
  ['视觉模型', 'Vision Model'],
  ['图片模型', 'Image Model'],
  ['语音模型', 'Speech Model'],
  ['助手人格', 'Assistant Persona'],
  ['乐于助人', 'Helpful'],
  ['简洁', 'Concise'],
  ['技术', 'Technical'],
  ['老师', 'Teacher'],
  ['萌系', 'Cute'],
  ['猫娘', 'Catgirl'],
  ['海盗', 'Pirate'],
  ['莎士比亚', 'Shakespeare'],
  ['冲浪手', 'Surfer'],
  ['黑色电影', 'Film Noir'],
  ['哲学家', 'Philosopher'],
  ['热血', 'Passionate'],
  ['时区', 'Time Zone'],
  ['Hermes需要本地时间时使用，留空则跟随系统时区', 'Used when Hermes needs local time. Leave blank to follow the system time zone.'],
  ['语言', 'Language'],
  ['中文', 'Chinese'],
  ['主题', 'Theme'],
  ['浅色', 'Light'],
  ['深色', 'Dark'],
  ['系统', 'System'],
  ['记忆服务商', 'Memory Provider'],
  ['内置', 'Built-in'],
  ['Honcho(外部记忆)', 'Honcho (External Memory)'],
  ['上下文引擎', 'Context Engine'],
  ['压缩器', 'Compressor'],
  ['默认', 'Default'],
  ['持久记忆', 'Persistent Memory'],
  ['自动压缩', 'Auto Compression'],
  ['用户档案', 'User Profile'],
  ['本地网关', 'Local Gateway'],
  ['远程网关', 'Remote Gateway'],
  ['在线', 'Online'],
  ['在localhost上启动一个私有的Hermes仪表盘后端。这是默认设置，可离线运行。', 'Start a private Hermes dashboard backend on localhost. This is the default and works offline.'],
  ['使用会话令牌将此桌面壳连接到远程Hermes仪表盘后端。', 'Use a session token to connect this desktop shell to a remote Hermes dashboard backend.'],
  ['远程URL', 'Remote URL'],
  ['远程仪表盘后端的基础 URL，支持路径前缀(如/hermes)', 'Base URL of the remote dashboard backend. Path prefixes are supported, e.g. /hermes.'],
  ['会话令牌', 'Session Token'],
  ['用于REST和WebSocket访问的仪表盘会话令牌。留空可保留已保存的令牌。', 'Dashboard session token for REST and WebSocket access. Leave blank to keep the saved token.'],
  ['粘贴会话令牌', 'Paste session token'],
  ['测试', 'Test'],
  ['保存下次重启', 'Save for Restart'],
  ['保存并重连', 'Save & Reconnect'],
  ['模型厂商', 'Model Vendor'],
  ['词元工场', 'Token Workshop'],
  ['当前 Key 来自词元工场', 'Current key comes from Token Workshop'],
  ['去词元工场管理 Key >', 'Manage key in Token Workshop >'],
  ['对话已取消归档', 'Chat unarchived'],
  ['查看', 'View'],
  ['没有归档对话', 'No archived chats'],
  ['在侧栏对话上点击[...]，即可归档', 'Click [...] on a sidebar chat to archive it.'],
  ['取消归档', 'Unarchive'],
  ['删除已归档对话？', 'Delete archived chat?'],
  ['这将永久删除已归档对话并不可恢复。', 'This will permanently delete the archived chat and cannot be undone.'],
  ['版本信息', 'Version Info'],
  ['检查更新', 'Check for Updates'],
  ['更新中', 'Updating'],
  ['立即更新', 'Update Now'],
  ['可更新v1.1', 'Update available v1.1'],
  ['用户协议', 'User Agreement'],
  ['隐私协议', 'Privacy Agreement'],
  ['检查更新', 'Check for Updates'],
  ['正在下载', 'Downloading'],
  ['关闭当前窗口不会中断下载，会继续保持后台更新。', 'Closing this window will not interrupt the download. It will continue in the background.'],
  ['后台更新', 'Update in Background'],
  ['下载完成', 'Download Complete'],
  ['v1.1 已下载完成，重启应用即可使用新版本。', 'v1.1 has been downloaded. Restart the app to use the new version.'],
  ['稍后重启', 'Restart Later'],
  ['重启更新', 'Restart to Update'],
  ['有新版本可升级', 'A new version is available'],
  ['最新版本v1.1', 'Latest version v1.1'],
  ['立即升级', 'Upgrade Now'],
  ['管理账号', 'Manage Account'],
  ['切换账号', 'Switch Account'],
  ['退出账号', 'Log Out'],
  ['退出登录？', 'Log out?'],
  ['退出后仍可继续使用 HZ-HERMES，充值额度时需要重新登录词元工场。', 'You can continue using HZ-HERMES after logging out. You will need to log in to Token Workshop again to top up credits.'],
  ['有未保存内容！', 'Unsaved changes!'],
  ['聊天设置已做修改但未保存。', 'Chat settings have been changed but not saved.'],
  ['不保存', "Don't Save"],
  ['全部文件', 'All Files'],
  ['文档', 'Documents'],
  ['表格', 'Sheets'],
  ['图片', 'Images'],
  ['其他', 'Other'],
  ['搜索文件名', 'Search file name'],
  ['暂无文件', 'No files'],
  ['更换关键词再试试', 'Try a different keyword'],
  ['当会话生成图片或文件输出时，会显示在这里。', 'Images or files generated in chats will appear here.'],
  ['打开文件', 'Open File'],
  ['打开文件位置', 'Reveal in Finder'],
  ['删除文件？', 'Delete file?'],
  ['文件删除后将不可找回，请谨慎操作！', 'Deleted files cannot be recovered. Please proceed carefully.'],
  ['欢迎使用HZ-HERMES', 'Welcome to HZ-HERMES'],
  ['不只是工具而是共创伙伴', 'More than a tool, a co-creation partner'],
  ['正在等待后台仪表盘就绪…', 'Waiting for the dashboard backend...'],
  ['请输入手机号', 'Enter phone number'],
  ['请输入正确手机号', 'Enter a valid phone number'],
  ['请输入6位验证码', 'Enter the 6-digit code'],
  ['请勾选《隐私政策》及《服务条款》', 'Please agree to the Privacy Policy and Terms of Service'],
  ['请输入验证码', 'Enter verification code'],
  ['获取验证码', 'Get Code'],
  ['阅读并同意《隐私政策》和《服务条款》，未注册绑定的手机号验证成功后将自动注册', 'I have read and agree to the Privacy Policy and Terms of Service. Unregistered verified phone numbers will be registered automatically.'],
  ['登 录', 'Log In'],
] as const

const englishTextMap = new Map<string, string>(englishTextEntries)

function translateToEnglish(value: string) {
  const trimmedValue = value.trim()
  const translatedValue = englishTextMap.get(trimmedValue)

  if (translatedValue) {
    return value.replace(trimmedValue, translatedValue)
  }

  const secondsMatch = trimmedValue.match(/^(\d+)秒后获取$/)
  if (secondsMatch) {
    return value.replace(trimmedValue, `Get in ${secondsMatch[1]}s`)
  }

  return value
}

function useGlobalEnglishTranslation(isEnglish: boolean) {
  const textOriginalsRef = useRef(new WeakMap<Text, string>())
  const attributeOriginalsRef = useRef(new WeakMap<Element, Partial<Record<'placeholder' | 'aria-label' | 'title', string>>>() )

  useEffect(() => {
    const root = document.getElementById('root')

    if (!root) {
      return undefined
    }

    const translateNode = (node: Node) => {
      const translationBoundary =
        node instanceof Element ? node : node.parentElement

      if (translationBoundary?.closest('[data-translation-skip="true"]')) {
        return
      }

      if (node.nodeType === Node.TEXT_NODE) {
        const textNode = node as Text
        const originalValue = textOriginalsRef.current.get(textNode) ?? textNode.nodeValue ?? ''

        if (!isEnglish) {
          if (textOriginalsRef.current.has(textNode)) {
            textNode.nodeValue = originalValue
          }
          return
        }

        const translatedValue = translateToEnglish(originalValue)

        if (translatedValue !== originalValue) {
          textOriginalsRef.current.set(textNode, originalValue)
          textNode.nodeValue = translatedValue
        }
        return
      }

      if (!(node instanceof Element)) {
        return
      }

      if (node.matches('script, style, svg, svg *')) {
        return
      }

      const attributeOriginals = attributeOriginalsRef.current.get(node) ?? {}

      ;(['placeholder', 'aria-label', 'title'] as const).forEach((attributeName) => {
        const currentValue = node.getAttribute(attributeName)
        const originalValue = attributeOriginals[attributeName] ?? currentValue

        if (!originalValue) {
          return
        }

        if (!isEnglish) {
          if (attributeOriginals[attributeName]) {
            node.setAttribute(attributeName, attributeOriginals[attributeName] ?? '')
          }
          return
        }

        const translatedValue = translateToEnglish(originalValue)

        if (translatedValue !== originalValue) {
          attributeOriginals[attributeName] = originalValue
          attributeOriginalsRef.current.set(node, attributeOriginals)
          node.setAttribute(attributeName, translatedValue)
        }
      })
    }

    const translateTree = () => {
      translateNode(root)

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const translationBoundary =
              node instanceof Element ? node : node.parentElement

            if (translationBoundary?.closest('[data-translation-skip="true"]')) {
              return NodeFilter.FILTER_REJECT
            }

            if (node instanceof Element && node.matches('script, style, svg, svg *')) {
              return NodeFilter.FILTER_REJECT
            }

            return NodeFilter.FILTER_ACCEPT
          },
        },
      )

      let currentNode = walker.nextNode()
      while (currentNode) {
        translateNode(currentNode)
        currentNode = walker.nextNode()
      }
    }

    let frameId = 0
    let observer: MutationObserver | null = null
    let isApplyingTranslation = false

    const observerOptions: MutationObserverInit = {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'aria-label', 'title'],
    }

    const runTranslation = () => {
      frameId = 0

      if (isApplyingTranslation) {
        return
      }

      isApplyingTranslation = true
      observer?.disconnect()
      translateTree()
      isApplyingTranslation = false

      if (isEnglish) {
        observer?.observe(root, observerOptions)
      }
    }

    const scheduleTranslation = () => {
      if (isApplyingTranslation || frameId) {
        return
      }

      frameId = window.requestAnimationFrame(runTranslation)
    }

    observer = new MutationObserver(scheduleTranslation)
    scheduleTranslation()

    if (isEnglish) {
      observer.observe(root, observerOptions)
    }

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      observer?.disconnect()
    }
  }, [isEnglish])
}

const COMPOSER_MIN_HEIGHT = 112
const COMPOSER_MAX_HEIGHT = 260
const COMPOSER_TOOLBAR_HEIGHT = 56
const COMPOSER_INPUT_TOP_INSET = 16
const COMPOSER_BOTTOM_SAFE_SPACE = 48
const TITLE_DOCK_SCROLL_THRESHOLD = 48

const hasReachedTitleDockThreshold = (scrollTop: number) =>
  scrollTop >= TITLE_DOCK_SCROLL_THRESHOLD

const isElementCoveredByTitlebar = (scrollContainer: HTMLElement, selector: string) => {
  const element = scrollContainer.querySelector<HTMLElement>(selector)

  if (!element) {
    return false
  }

  const titlebarHeight =
    document.querySelector<HTMLElement>('.global-titlebar')?.getBoundingClientRect().height ??
    TITLE_DOCK_SCROLL_THRESHOLD

  return element.offsetTop - scrollContainer.scrollTop < titlebarHeight
}

const LOGIN_WINDOW_SIZE = {
  width: 560,
  height: 560,
}
const AUTH_STORAGE_KEY = 'hz-hermes-authenticated'
const MAIN_WINDOW_SIZE = {
  width: 1280,
  height: 800,
  minWidth: 1024,
  minHeight: 640,
}

async function configureAppWindowForAuthState(isAuthenticated: boolean) {
  if (!window.__TAURI_INTERNALS__) {
    return
  }

  const appWindow = getCurrentWindow()

  try {
    if (isAuthenticated) {
      await appWindow.setResizable(true)
      await appWindow.setMinSize(new LogicalSize(MAIN_WINDOW_SIZE.minWidth, MAIN_WINDOW_SIZE.minHeight))
      await appWindow.setSize(new LogicalSize(MAIN_WINDOW_SIZE.width, MAIN_WINDOW_SIZE.height))
    } else {
      await appWindow.setResizable(false)
      await appWindow.setMinSize(new LogicalSize(LOGIN_WINDOW_SIZE.width, LOGIN_WINDOW_SIZE.height))
      await appWindow.setSize(new LogicalSize(LOGIN_WINDOW_SIZE.width, LOGIN_WINDOW_SIZE.height))
    }

    await appWindow.center()
  } catch {
    // Browser preview and older dev windows may not support every window command.
  }
}

function formatConversationTime(createdAt: number, now: number) {
  const elapsedSeconds = Math.max(0, Math.floor((now - createdAt) / 1000))
  const elapsedMinutes = Math.floor(elapsedSeconds / 60)

  if (elapsedMinutes < 1) {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(createdAt)
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}分钟前`
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60)

  if (elapsedHours < 24) {
    return `${elapsedHours}小时前`
  }

  const elapsedDays = Math.floor(elapsedHours / 24)

  if (elapsedDays < 7) {
    return `${elapsedDays}天前`
  }

  const elapsedWeeks = Math.floor(elapsedDays / 7)

  if (elapsedWeeks < 52) {
    return `${elapsedWeeks}周前`
  }

  return `${Math.floor(elapsedWeeks / 52)}年前`
}

function resolveCurrentColorIcon(icon: string) {
  return icon
    .replace(
      /\b(stroke|fill)=["'](?:black|#000|#000000|var\(--(?:stroke|fill)-\d+,\s*#[0-9a-fA-F]{3,6}\))["']/gi,
      '$1="currentColor"',
    )
    .replace(
      /\b(stroke|fill)=["']var\(--(?:stroke|fill)-\d+,\s*currentColor\)["']/gi,
      '$1="currentColor"',
    )
}

function FigmaIcon({ icon, inheritColor = false }: { icon: string; inheritColor?: boolean }) {
  return (
    <i
      className="figma-icon"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: inheritColor ? resolveCurrentColorIcon(icon) : icon }}
    />
  )
}

function DangerConfirmDialog({
  title,
  description,
  closeIcon,
  cancelLabel = '取消',
  confirmLabel = '确定',
  confirmTone = 'danger',
  hideCancel = false,
  onCancel,
  onConfirm,
  ariaLabel,
}: {
  title: string
  description: ReactNode
  closeIcon: string
  cancelLabel?: string
  confirmLabel?: string
  confirmTone?: 'danger' | 'primary'
  hideCancel?: boolean
  onCancel: () => void
  onConfirm: () => void
  ariaLabel: string
}) {
  return (
    <div className="danger-confirm-overlay modal-fade-layer" role="presentation">
      <section className="danger-confirm-dialog modal-pop-surface" role="dialog" aria-modal="true" aria-label={ariaLabel}>
        <header className="danger-confirm-heading">
          <h2>{title}</h2>
          <button
            className="danger-confirm-close"
            type="button"
            aria-label="关闭"
            onClick={onCancel}
          >
            <FigmaIcon icon={closeIcon} />
          </button>
        </header>
        <div className="danger-confirm-content">{description}</div>
        <footer className="danger-confirm-actions">
          {hideCancel ? null : (
            <button className="danger-confirm-cancel" type="button" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
          <button className={`danger-confirm-${confirmTone}`} type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  )
}

function LegalAgreementDialog({
  title,
  content,
  closeIcon,
  onClose,
}: {
  title: string
  content: string
  closeIcon: string
  onClose: () => void
}) {
  return (
    <div className="settings-legal-overlay modal-fade-layer" role="presentation">
      <section className="settings-legal-dialog modal-pop-surface" role="dialog" aria-modal="true" aria-label={title}>
        <header className="settings-legal-heading">
          <h2>{title}</h2>
          <button className="settings-legal-close" type="button" aria-label="关闭" onClick={onClose}>
            <FigmaIcon icon={closeIcon} />
          </button>
        </header>
        <div className="settings-legal-content">
          {content.split(/\n{2,}/).map((paragraph, index) => (
            <p key={`${title}-${index}`}>{paragraph.trim()}</p>
          ))}
        </div>
      </section>
    </div>
  )
}

function startWindowDrag(event: ReactPointerEvent<HTMLElement>) {
  if (event.button !== 0) {
    return
  }

  const target = event.target

  if (
    target instanceof Element &&
    target.closest('button, input, textarea, select, a, [role="button"], [data-no-window-drag]')
  ) {
    return
  }

  if (!window.__TAURI_INTERNALS__) {
    return
  }

  void getCurrentWindow().startDragging().catch(() => undefined)
}

function toggleWindowMaximize(event: ReactMouseEvent<HTMLElement>) {
  const target = event.target

  if (
    target instanceof Element &&
    target.closest('button, input, textarea, select, a, [role="button"], [data-no-window-drag]')
  ) {
    return
  }

  if (!window.__TAURI_INTERNALS__) {
    return
  }

  void getCurrentWindow().toggleMaximize().catch(() => undefined)
}

function LoginShell({ onLogin }: { onLogin: () => void }) {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [hasAgreed, setHasAgreed] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [errorField, setErrorField] = useState<'phone' | 'code' | null>(null)
  const [codeCooldown, setCodeCooldown] = useState(0)
  const [hasRequestedCode, setHasRequestedCode] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginProgress, setLoginProgress] = useState(0)

  const normalizedPhone = phone.trim()
  const normalizedCode = code.trim()
  const isPhoneValid = /^\d{11}$/.test(normalizedPhone)
  const isCodeValid = /^\d{6}$/.test(normalizedCode)
  const canRequestCode = isPhoneValid && codeCooldown === 0 && !isLoggingIn
  const canEnterCode = isPhoneValid && hasRequestedCode && !isLoggingIn
  const loginToast = loginError
    ? {
        tone: 'error' as const,
        message: loginError,
        id: 1,
      }
    : null

  useEffect(() => {
    if (codeCooldown <= 0) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setCodeCooldown((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [codeCooldown])

  useEffect(() => {
    if (!isLoggingIn) {
      return undefined
    }

    const startedAt = window.performance.now()
    const timer = window.setInterval(() => {
      const progress = Math.min(100, ((window.performance.now() - startedAt) / 5000) * 100)
      setLoginProgress(progress)

      if (progress >= 100) {
        window.clearInterval(timer)
        onLogin()
      }
    }, 50)

    return () => window.clearInterval(timer)
  }, [isLoggingIn, onLogin])

  const showLoginError = (message: string, field: 'phone' | 'code' | null = null) => {
    setLoginError(message)
    setErrorField(field)
  }

  const requestCode = () => {
    if (!canRequestCode) {
      return
    }

    setLoginError('')
    setErrorField(null)
    setHasRequestedCode(true)
    setCodeCooldown(60)
  }

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isLoggingIn) {
      return
    }

    if (!normalizedPhone && !normalizedCode) {
      showLoginError('请输入手机号', 'phone')
      return
    }

    if (!isPhoneValid) {
      showLoginError('请输入正确手机号', 'phone')
      return
    }

    if (!isCodeValid) {
      showLoginError('请输入6位验证码', 'code')
      return
    }

    if (!hasAgreed) {
      showLoginError('请勾选《隐私政策》及《服务条款》')
      return
    }

    setLoginError('')
    setErrorField(null)
    setLoginProgress(0)
    setIsLoggingIn(true)
  }

  return (
    <div className="login-shell">
      {loginError && !isLoggingIn ? (
        <AppToast
          toast={loginToast}
          onClose={() => {
            setLoginError('')
            setErrorField(null)
          }}
        />
      ) : null}
      <header
        className="login-titlebar"
        data-tauri-drag-region
        onPointerDown={startWindowDrag}
        onDoubleClick={toggleWindowMaximize}
      />
      <main className={`login-content ${isLoggingIn ? 'loading' : ''}`}>
        <section className="login-hero" aria-label="登录">
          <div className="login-brand">
            <span className="login-logo" aria-hidden="true">
              <FigmaIcon icon={loginHermesLogoIcon} />
            </span>
            <div className="login-title">
              <h1>欢迎使用HZ-HERMES</h1>
              <p>不只是工具而是共创伙伴</p>
            </div>
          </div>

          {isLoggingIn ? (
            <div className="login-loading" aria-label="登录中">
              <div className="login-progress-track">
                <span className="login-progress-bar" style={{ width: `${loginProgress}%` }} />
              </div>
              <span>正在等待后台仪表盘就绪…</span>
            </div>
          ) : (
          <form className="login-form" onSubmit={submitLogin}>
            <div className="login-nav-items">
              <label className={`login-input-field ${errorField === 'phone' ? 'error' : ''}`}>
                <FigmaIcon icon={loginUserRoundIcon} />
                <input
                  value={phone}
                  onChange={(event) => {
                    const nextPhone = event.currentTarget.value.replace(/\D/g, '').slice(0, 11)
                    setPhone(nextPhone)
                    setCode('')
                    setHasRequestedCode(false)
                    if (errorField === 'phone') {
                      setLoginError('')
                      setErrorField(null)
                    }
                  }}
                  placeholder="请输入手机号"
                  inputMode="tel"
                  spellCheck={false}
                />
                {phone ? (
                  <button
                    className="login-field-clear"
                    type="button"
                    aria-label="清空手机号"
                    onClick={() => {
                      setPhone('')
                      setCode('')
                      setHasRequestedCode(false)
                      setLoginError('')
                      setErrorField(null)
                    }}
                  >
                    <FigmaIcon icon={loginXIcon} />
                  </button>
                ) : null}
              </label>

              <div className="login-code-row">
                <label
                  className={`login-input-field login-code-field ${errorField === 'code' ? 'error' : ''} ${
                    canEnterCode ? '' : 'disabled'
                  }`}
                >
                  <FigmaIcon icon={loginShieldCheckIcon} />
                  <input
                    value={code}
                    onChange={(event) => {
                      setCode(event.currentTarget.value.replace(/\D/g, '').slice(0, 6))
                      if (errorField === 'code') {
                        setLoginError('')
                        setErrorField(null)
                      }
                    }}
                    placeholder="请输入验证码"
                    inputMode="numeric"
                    spellCheck={false}
                    disabled={!canEnterCode}
                  />
                </label>
                <button
                  className="login-code-button"
                  type="button"
                  disabled={!canRequestCode}
                  onClick={requestCode}
                >
                  {codeCooldown > 0 ? `${codeCooldown}秒后获取` : '获取验证码'}
                </button>
              </div>
            </div>

            <label className="login-policy">
              <span className="login-checkbox-wrap">
                <input
                  type="checkbox"
                  checked={hasAgreed}
                  onChange={(event) => setHasAgreed(event.currentTarget.checked)}
                />
                <span className="login-checkbox" aria-hidden="true">
                  {hasAgreed ? <FigmaIcon icon={loginCheckIcon} /> : null}
                </span>
              </span>
              <span>
                阅读并同意《隐私政策》和《服务条款》，未注册绑定的手机号验证成功后将自动注册
              </span>
            </label>

            <button className="login-submit" type="submit">
              登 录
            </button>
          </form>
          )}
        </section>
      </main>
    </div>
  )
}

function IconButton({
  label,
  icon,
  onClick,
  variant = 'ghost',
  type = 'button',
  disabled = false,
  active = false,
}: {
  label: string
  icon: string
  onClick?: () => void
  variant?: 'ghost' | 'send'
  type?: 'button' | 'submit'
  disabled?: boolean
  active?: boolean
}) {
  return (
    <button
      className={`icon-button ${variant}${active ? ' active' : ''}`}
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      onClick={onClick}
      disabled={disabled}
    >
      <FigmaIcon icon={icon} />
    </button>
  )
}

function ChatPanelTabBar({ title }: { title: string }) {
  const [activeTab, setActiveTab] = useState<'page' | 'asset'>('page')

  return (
    <div className="chat-panel-tabbar" aria-label="右侧面板标签栏">
      <div className="chat-panel-tab-list" role="tablist">
        <button
          className={`chat-panel-tab${activeTab === 'page' ? ' active' : ''}`}
          type="button"
          title={title}
          role="tab"
          aria-selected={activeTab === 'page'}
          onClick={() => setActiveTab('page')}
        >
          <FigmaIcon icon={chatPanelGlobeIcon} />
          <span>{title}</span>
        </button>
        <button
          className={`chat-panel-tab${activeTab === 'asset' ? ' active' : ''}`}
          type="button"
          title="网站logo.svg"
          role="tab"
          aria-selected={activeTab === 'asset'}
          onClick={() => setActiveTab('asset')}
        >
          <FigmaIcon icon={chatPanelSiteFileIcon} />
          <span>网站logo.svg</span>
        </button>
      </div>
      <div className="chat-panel-tab-add-group">
        <button className="icon-button chat-panel-tab-add" type="button" aria-label="新建标签页">
          <FigmaIcon icon={plusIcon} />
        </button>
      </div>
    </div>
  )
}

function NavItem({
  label,
  icon,
  tone = 'default',
  active = false,
  onClick,
}: NavAction & { active?: boolean; onClick?: () => void }) {
  return (
    <button
      className={`nav-item ${tone} ${active ? 'active' : ''}`}
      type="button"
      onClick={onClick}
    >
      <FigmaIcon icon={icon} />
      <span>{label}</span>
    </button>
  )
}

function EmptySection({ title, emptyText }: { title: string; emptyText: string }) {
  return (
    <section className="nav-section" aria-label={title}>
      <h2>{title}</h2>
      <div className="empty-nav-row">{emptyText}</div>
    </section>
  )
}

function ConversationSection({
  conversations,
  now,
  showActive,
  onSelectConversation,
}: {
  conversations: ConversationRecord[]
  now: number
  showActive: boolean
  onSelectConversation: (conversationId: string) => void
}) {
  return (
    <section className="nav-section conversation-section" aria-label="对话">
      <h2>对话</h2>
      {conversations.length > 0 ? (
        <div className="conversation-list">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`conversation-row ${showActive && conversation.active ? 'active' : ''}`}
              type="button"
              title={conversation.title}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <span>{conversation.title}</span>
              <time dateTime={new Date(conversation.createdAt ?? now).toISOString()}>
                {formatConversationTime(conversation.createdAt ?? now, now)}
              </time>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-nav-row">暂无对话</div>
      )}
    </section>
  )
}

function SettingsSidebar({
  activeSection,
  onSectionChange,
  onBack,
}: {
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
  onBack: () => void
}) {
  return (
    <aside className="settings-side-nav" aria-label="设置导航">
      <button className="settings-back-button" type="button" onClick={onBack}>
        <FigmaIcon icon={settingsArrowLeftIcon} />
        <span>返回</span>
      </button>
      <nav className="settings-nav-list">
        {settingsNavItems.map((item) => (
          <Fragment key={item.id}>
            {item.dividerBefore ? <div className="settings-nav-divider" aria-hidden="true" /> : null}
            <button
              className={`settings-nav-item ${item.id === activeSection ? 'active' : ''}`}
              type="button"
              onClick={() => onSectionChange(item.id)}
            >
              <FigmaIcon icon={item.icon} />
              <span>{item.label}</span>
            </button>
          </Fragment>
        ))}
      </nav>
    </aside>
  )
}

function SearchDialog({
  conversations,
  query,
  isClosing,
  onQueryChange,
  onClose,
  onExitComplete,
  onSelectConversation,
}: {
  conversations: ConversationRecord[]
  query: string
  isClosing: boolean
  onQueryChange: (query: string) => void
  onClose: () => void
  onExitComplete: () => void
  onSelectConversation: (conversationId: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const normalizedQuery = query.trim().toLowerCase()
  const visibleConversations = useMemo(() => {
    if (!normalizedQuery) {
      return conversations
    }

    return conversations.filter((conversation) => {
      const searchableText = [
        conversation.title,
        ...conversation.messages.map((message) => message.content),
      ]
        .join('\n')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [conversations, normalizedQuery])
  const hasQuery = normalizedQuery.length > 0
  const hasResults = visibleConversations.length > 0
  const placeholderText = hasQuery ? '无搜索结果' : '近期无对话'

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  return (
    <div
      className={`search-overlay modal-fade-layer ${isClosing ? 'closing' : ''}`}
      role="presentation"
      onClick={onClose}
      onAnimationEnd={(event) => {
        if (isClosing && event.currentTarget === event.target) {
          onExitComplete()
        }
      }}
    >
      <div
        className="search-overlay-drag-strip"
        data-tauri-drag-region
        onPointerDown={startWindowDrag}
        onDoubleClick={toggleWindowMaximize}
        onClick={(event) => event.stopPropagation()}
      />
      <section
        className="search-dialog modal-pop-surface"
        role="dialog"
        aria-modal="true"
        aria-label="搜索对话"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="search-bar">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => onQueryChange(event.currentTarget.value)}
            placeholder="搜索对话"
            spellCheck={false}
          />
        </div>

        {hasResults ? (
          <>
            <div className="search-section-title">近期对话</div>
            <div className="search-result-list">
              {visibleConversations.map((conversation, index) => (
                <button
                  key={conversation.id}
                  className={`search-result-item ${hasQuery && index === 0 ? 'highlighted' : ''}`}
                  type="button"
                  title={conversation.title}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <span>{conversation.title}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="search-result-list">
            <div className="search-empty-item">{placeholderText}</div>
          </div>
        )}
      </section>
    </div>
  )
}

function PlatformAction({
  icon,
  label,
  iconPosition = 'start',
  onClick,
}: {
  icon: string
  label: string
  iconPosition?: 'start' | 'end'
  onClick?: () => void
}) {
  return (
    <button className="platform-section-action" type="button" onClick={onClick}>
      {iconPosition === 'start' ? <FigmaIcon icon={icon} /> : null}
      <span>{label}</span>
      {iconPosition === 'end' ? <FigmaIcon icon={icon} /> : null}
    </button>
  )
}

function PlatformTextField({
  label,
  value,
  onValueChange,
  placeholder,
}: {
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="platform-field">
      <span>{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.currentTarget.value)}
        spellCheck={false}
      />
    </label>
  )
}

function PlatformSwitch({
  checked,
  onClick,
}: {
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`platform-switch ${checked ? 'checked' : ''}`}
      type="button"
      aria-pressed={checked}
      aria-label={checked ? '关闭钉钉' : '开启钉钉'}
      onClick={onClick}
    >
      <span />
    </button>
  )
}

function PlatformQrModal({
  state,
  onClose,
  onExpire,
  onRefresh,
}: {
  state: 'active' | 'expired'
  onClose: () => void
  onExpire: () => void
  onRefresh: () => void
}) {
  const isExpired = state === 'expired'
  const [isClosing, setIsClosing] = useState(false)
  const closeWithAnimation = () => {
    if (isClosing) {
      return
    }

    setIsClosing(true)
  }

  useEffect(() => {
    if (!isClosing) {
      return undefined
    }

    const timer = window.setTimeout(onClose, 160)

    return () => window.clearTimeout(timer)
  }, [isClosing, onClose])

  return (
    <div
      className={`platform-modal-overlay modal-fade-layer ${isClosing ? 'closing' : ''}`}
      role="presentation"
      onClick={closeWithAnimation}
    >
      <section
        className="platform-qr-dialog modal-pop-surface"
        role="dialog"
        aria-modal="true"
        aria-label="扫码获取凭证"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="platform-modal-close"
          type="button"
          aria-label="关闭"
          onClick={closeWithAnimation}
        >
          <FigmaIcon icon={closeIcon} />
        </button>
        <h2>扫码获取凭证</h2>
        <button
          className={`platform-qr-frame ${isExpired ? 'expired' : ''}`}
          type="button"
          aria-label={isExpired ? '点击刷新二维码' : '模拟二维码过期'}
          onClick={isExpired ? onRefresh : onExpire}
        >
          <img src={isExpired ? dingtalkQrExpired : dingtalkQr} alt="" />
          {isExpired ? (
            <span className="platform-qr-refresh">
              <FigmaIcon icon={refreshCwIcon} />
              <span>点击刷新</span>
            </span>
          ) : null}
        </button>
        <p>使用钉钉扫码，并在手机上确认</p>
      </section>
    </div>
  )
}

function AppToast({
  toast,
  onClose,
}: {
  toast: PlatformToastState | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timer = window.setTimeout(onClose, 3000)

    return () => window.clearTimeout(timer)
  }, [onClose, toast])

  if (!toast) {
    return null
  }

  const handleActionClick = () => {
    toast.onAction?.()
    onClose()
  }

  const toastElement = (
    <div className={`platform-toast ${toast.tone}`} role="status" aria-live="polite">
      <div className="platform-toast-left">
        <span className="platform-toast-icon" aria-hidden="true">
          {toast.tone === 'success' ? <FigmaIcon icon={settingsArchiveToastBadgeIcon} /> : null}
          {toast.tone === 'error' ? <FigmaIcon icon={loginErrorBadgeIcon} /> : null}
        </span>
        <div className="platform-toast-text">
          <span>{toast.message}</span>
        </div>
      </div>
      <div className="platform-toast-actions">
        {toast.actionLabel ? (
          <button className="platform-toast-action" type="button" onClick={handleActionClick}>
            {toast.actionLabel}
          </button>
        ) : null}
        <button className="platform-toast-close" type="button" aria-label="关闭提示" onClick={onClose}>
          <FigmaIcon icon={toastCloseIcon} />
        </button>
      </div>
    </div>
  )

  const contentPanel = document.querySelector('.content-panel')

  return contentPanel ? createPortal(toastElement, contentPanel) : toastElement
}

function getCredentialValidationToast(values: string[]): PlatformToastPayload | null {
  if (values.some((value) => value.trim() === '')) {
    return { tone: 'warning', message: '你还未输入凭证' }
  }

  if (values.some((value) => value.trim().length < 5)) {
    return { tone: 'error', message: '凭证错误' }
  }

  return null
}

function DingTalkPanel({
  isEnabled,
  onEnabledChange,
  onComplete,
  onToast,
  onDetailScroll,
}: {
  isEnabled: boolean
  onEnabledChange: (isEnabled: boolean) => void
  onComplete: () => void
  onToast: (toast: PlatformToastPayload) => void
  onDetailScroll: UIEventHandler<HTMLElement>
}) {
  const [qrModal, setQrModal] = useState<'active' | 'expired' | null>(null)
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [hasQrCredential, setHasQrCredential] = useState(false)
  const headerDescription =
    '在钉钉开发者后台创建一个应用，将ClientID (App key) 和 Client Secret 复制到这里。'
  const completeDingTalk = () => {
    if (!hasQrCredential) {
      const validationToast = getCredentialValidationToast([clientId, clientSecret])

      if (validationToast) {
        onToast(validationToast)
        return
      }
    }

    onComplete()
    onToast({ tone: 'success', message: '保存成功' })
  }

  return (
    <>
      <section className="platform-detail" onScroll={onDetailScroll}>
        <header className="platform-header">
          <img className="platform-heading-icon" src="/消息平台/dingding-square.svg" alt="" />
          <div className="platform-heading">
            <div className="platform-heading-copy">
              <h1>钉钉</h1>
              <p>{headerDescription}</p>
            </div>
            <PlatformSwitch checked={isEnabled} onClick={() => onEnabledChange(!isEnabled)} />
          </div>
        </header>

        <div className="platform-scroll">
          <div className="platform-section-title">
            <h2>获取你的凭证</h2>
            <div className="platform-section-actions">
              <PlatformAction
                icon={scanLineIcon}
                label="扫码获取"
                onClick={() => {
                  setQrModal('active')
                  setHasQrCredential(true)
                }}
              />
              <PlatformAction icon={arrowUpRightIcon} label="设置指南" iconPosition="end" />
            </div>
          </div>

          <PlatformTextField
            label="Client ID"
            value={clientId}
            onValueChange={setClientId}
            placeholder="输入钉钉客户端ID"
          />
          <PlatformTextField
            label="Client Secret"
            value={clientSecret}
            onValueChange={setClientSecret}
            placeholder="输入钉钉客户端密钥"
          />

          {dingTalkScrollTestSections.map((sectionIndex) => (
            <Fragment key={`dingtalk-scroll-test-${sectionIndex}`}>
              <div className="platform-section-title">
                <h2>获取你的凭证</h2>
                <div className="platform-section-actions">
                  <PlatformAction icon={scanLineIcon} label="扫码获取" />
                  <PlatformAction icon={arrowUpRightIcon} label="设置指南" iconPosition="end" />
                </div>
              </div>

              <PlatformTextField
                label="Client ID"
                value=""
                onValueChange={() => undefined}
                placeholder="输入钉钉客户端ID"
              />
              <PlatformTextField
                label="Client Secret"
                value=""
                onValueChange={() => undefined}
                placeholder="输入钉钉客户端密钥"
              />
            </Fragment>
          ))}
        </div>

        <footer className="platform-footer">
          <button className="platform-button secondary" type="button" onClick={completeDingTalk}>
            应用
          </button>
          <button className="platform-button primary" type="button" onClick={completeDingTalk}>
            保存
          </button>
        </footer>
      </section>

      {qrModal ? (
        <PlatformQrModal
          state={qrModal}
          onClose={() => setQrModal(null)}
          onExpire={() => setQrModal('expired')}
          onRefresh={() => setQrModal('active')}
        />
      ) : null}
    </>
  )
}

function FeishuPanel({
  isEnabled,
  onEnabledChange,
  onComplete,
  onToast,
  onDetailScroll,
}: {
  isEnabled: boolean
  onEnabledChange: (isEnabled: boolean) => void
  onComplete: () => void
  onToast: (toast: PlatformToastPayload) => void
  onDetailScroll: UIEventHandler<HTMLElement>
}) {
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const headerDescription = '创建一个飞书/Lark应用，将App ID 和 App Secret 复制到这里。'
  const completeFeishu = () => {
    const validationToast = getCredentialValidationToast([clientId, clientSecret])

    if (validationToast) {
      onToast(validationToast)
      return
    }

    onComplete()
    onToast({ tone: 'success', message: '保存成功' })
  }

  return (
    <section className="platform-detail" onScroll={onDetailScroll}>
      <header className="platform-header">
        <img className="platform-heading-icon" src="/消息平台/feishu-square.svg" alt="" />
        <div className="platform-heading">
          <div className="platform-heading-copy">
            <h1>飞书/Lark</h1>
            <p>{headerDescription}</p>
          </div>
          <PlatformSwitch checked={isEnabled} onClick={() => onEnabledChange(!isEnabled)} />
        </div>
      </header>

      <div className="platform-scroll">
        <div className="platform-section-title">
          <h2>获取你的凭证</h2>
          <div className="platform-section-actions">
            <PlatformAction icon={arrowUpRightIcon} label="设置指南" iconPosition="end" />
          </div>
        </div>

        <PlatformTextField
          label="Client ID"
          value={clientId}
          onValueChange={setClientId}
          placeholder="输入钉钉客户端ID"
        />
        <PlatformTextField
          label="Client Secret"
          value={clientSecret}
          onValueChange={setClientSecret}
          placeholder="已保存:sk-h...slAz"
        />
      </div>

      <footer className="platform-footer">
        <button className="platform-button secondary" type="button" onClick={completeFeishu}>
          应用
        </button>
        <button className="platform-button primary" type="button" onClick={completeFeishu}>
          保存
        </button>
      </footer>
    </section>
  )
}

type CredentialPanelConfig = {
  icon: string
  title: string
  description: string
  fields: Array<{
    label: string
    placeholder: string
    savedValue: string
  }>
}

function CredentialPanel({
  config,
  isEnabled,
  onEnabledChange,
  onComplete,
  onToast,
  onDetailScroll,
}: {
  config: CredentialPanelConfig
  isEnabled: boolean
  onEnabledChange: (isEnabled: boolean) => void
  onComplete: () => void
  onToast: (toast: PlatformToastPayload) => void
  onDetailScroll: UIEventHandler<HTMLElement>
}) {
  const [fieldValues, setFieldValues] = useState(() => config.fields.map(() => ''))
  const completeCredentials = () => {
    const validationToast = getCredentialValidationToast(fieldValues)

    if (validationToast) {
      onToast(validationToast)
      return
    }

    onComplete()
    onToast({ tone: 'success', message: '保存成功' })
  }

  return (
    <section className="platform-detail" onScroll={onDetailScroll}>
      <header className="platform-header">
        <img className="platform-heading-icon" src={config.icon} alt="" />
        <div className="platform-heading">
          <div className="platform-heading-copy">
            <h1>{config.title}</h1>
            <p>{config.description}</p>
          </div>
          <PlatformSwitch checked={isEnabled} onClick={() => onEnabledChange(!isEnabled)} />
        </div>
      </header>

      <div className="platform-scroll">
        <div className="platform-section-title">
          <h2>获取你的凭证</h2>
          <div className="platform-section-actions">
            <PlatformAction icon={arrowUpRightIcon} label="设置指南" iconPosition="end" />
          </div>
        </div>

        {config.fields.map((field, fieldIndex) => (
          <PlatformTextField
            key={field.label}
            label={field.label}
            value={fieldValues[fieldIndex]}
            onValueChange={(nextValue) => {
              setFieldValues((currentValues) =>
                currentValues.map((currentValue, currentIndex) =>
                  currentIndex === fieldIndex ? nextValue : currentValue,
                ),
              )
            }}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      <footer className="platform-footer">
        <button className="platform-button secondary" type="button" onClick={completeCredentials}>
          应用
        </button>
        <button className="platform-button primary" type="button" onClick={completeCredentials}>
          保存
        </button>
      </footer>
    </section>
  )
}

function EnterpriseWeChatPanel({
  isEnabled,
  onEnabledChange,
  onComplete,
  onToast,
  onDetailScroll,
}: {
  isEnabled: boolean
  onEnabledChange: (isEnabled: boolean) => void
  onComplete: () => void
  onToast: (toast: PlatformToastPayload) => void
  onDetailScroll: UIEventHandler<HTMLElement>
}) {
  return (
    <CredentialPanel
      isEnabled={isEnabled}
      onEnabledChange={onEnabledChange}
      onComplete={onComplete}
      onToast={onToast}
      onDetailScroll={onDetailScroll}
      config={{
        icon: '/消息平台/qiyeweixin-square.svg',
        title: '企业微信（群机器人）',
        description: '在企业微信中添加机器人，将 Bot ID 和 Secret 复制到这里。',
        fields: [
          {
            label: 'Bot ID',
            placeholder: '输入企业微信客户端ID',
            savedValue: 'ww-bot-id...',
          },
          {
            label: 'App Secret',
            placeholder: '输入企业微信客户端Secret',
            savedValue: '已保存:ww-sec...9xK2',
          },
        ],
      }}
    />
  )
}

function WeChatPanel({
  isEnabled,
  isBound,
  onEnabledChange,
  onComplete,
  onToast,
  onBind,
  onDisconnect,
  onDetailScroll,
}: {
  isEnabled: boolean
  isBound: boolean
  onEnabledChange: (isEnabled: boolean) => void
  onComplete: () => void
  onToast: (toast: PlatformToastPayload) => void
  onBind: () => void
  onDisconnect: () => void
  onDetailScroll: UIEventHandler<HTMLElement>
}) {
  const completeWeChat = () => {
    if (!isBound) {
      onToast({ tone: 'warning', message: '你还未输入凭证' })
      return
    }

    onComplete()
    onToast({ tone: 'success', message: '保存成功' })
  }

  return (
    <section className="platform-detail platform-detail-compact" onScroll={onDetailScroll}>
      <header className="platform-header">
        <img className="platform-heading-icon" src="/消息平台/weixin-square.svg" alt="" />
        <div className="platform-heading">
          <div className="platform-heading-copy">
            <h1>微信（个人·ClawBot扫码）</h1>
            <p>
              {isBound
                ? '登录成功'
                : '登录成功后自动写入WECHAT_CLAW_ACCOUNT_ID与WECHAT_CLAW_TOKEN，无需手动配置。'}
            </p>
          </div>
          <PlatformSwitch checked={isEnabled} onClick={() => onEnabledChange(!isEnabled)} />
        </div>
      </header>

      {isBound ? (
        <>
          <div className="platform-scroll wechat-bound-scroll">
            <section className="wechat-bound-card">
              <div className="wechat-bound-copy">
                <h2>已连接微信</h2>
                <p>
                  这是iLink分配给你本次扫码的BotID，不是你的真实微信号(iLink设计上不暴露昵称)。切换账号请点上方[扫码登录」用另一个微信重扫即可覆盖。
                </p>
              </div>
              <button className="wechat-disconnect-button" type="button" onClick={onDisconnect}>
                断开连接
              </button>
            </section>
          </div>

          <footer className="platform-footer">
            <button
              className="platform-button secondary"
              type="button"
              onClick={completeWeChat}
            >
              应用
            </button>
            <button className="platform-button primary" type="button" onClick={completeWeChat}>
              保存
            </button>
          </footer>
        </>
      ) : (
        <>
          <div className="platform-scroll wechat-qr-scroll">
            <button className="wechat-qr-card" type="button" onClick={onBind}>
              <img src={wechatQrDisplay} alt="" />
              <span>打开微信 扫码连接</span>
            </button>
          </div>

          <footer className="platform-footer">
            <button className="platform-button secondary" type="button" onClick={completeWeChat}>
              应用
            </button>
            <button className="platform-button primary" type="button" onClick={completeWeChat}>
              保存
            </button>
          </footer>
        </>
      )}
    </section>
  )
}

function QqRobotPanel({
  isEnabled,
  onEnabledChange,
  onComplete,
  onToast,
  onDetailScroll,
}: {
  isEnabled: boolean
  onEnabledChange: (isEnabled: boolean) => void
  onComplete: () => void
  onToast: (toast: PlatformToastPayload) => void
  onDetailScroll: UIEventHandler<HTMLElement>
}) {
  return (
    <CredentialPanel
      isEnabled={isEnabled}
      onEnabledChange={onEnabledChange}
      onComplete={onComplete}
      onToast={onToast}
      onDetailScroll={onDetailScroll}
      config={{
        icon: '/消息平台/qq-square.svg',
        title: 'QQ机器人',
        description: '在 QQ 开放平台注册一个应用，将 App ID 和 App Secret 复制到这里。',
        fields: [
          {
            label: 'App ID',
            placeholder: '输入QQ客户端ID',
            savedValue: 'qq-app-id...',
          },
          {
            label: 'Client Secret',
            placeholder: '输入QQ机器人客户端Secret',
            savedValue: '已保存:qq-sec...7bQp',
          },
        ],
      }}
    />
  )
}

const morePlatformConfigs: Record<string, CredentialPanelConfig> = {
  api: {
    icon: '/消息平台/api-square.svg',
    title: 'API服务',
    description: '创建一个API服务应用，将App ID 和 App Secret 复制到这里。',
    fields: [
      {
        label: 'Client ID',
        placeholder: '输入API服务客户端ID',
        savedValue: 'api-client-id...',
      },
      {
        label: 'Client Secret',
        placeholder: '输入API服务客户端Secret',
        savedValue: '已保存:api-sec...4kY8',
      },
    ],
  },
  webhook: {
    icon: '/消息平台/webhook-square.svg',
    title: 'WebhooK',
    description: '创建一个WebhooK应用，将App ID 和 App Secret 复制到这里。',
    fields: [
      {
        label: 'Client ID',
        placeholder: '输入WebhooK客户端ID',
        savedValue: 'webhook-client-id...',
      },
      {
        label: 'Client Secret',
        placeholder: '输入WebhooK客户端Secret',
        savedValue: '已保存:webhook-sec...6mC2',
      },
    ],
  },
  yuanbao: {
    icon: '/消息平台/yuanbao-square.svg',
    title: '腾讯元宝',
    description: '创建一个腾讯元宝应用，将App ID 和 App Secret 复制到这里。',
    fields: [
      {
        label: 'Client ID',
        placeholder: '输入腾讯元宝客户端ID',
        savedValue: 'yuanbao-client-id...',
      },
      {
        label: 'Client Secret',
        placeholder: '输入腾讯元宝客户端Secret',
        savedValue: '已保存:yuanbao-sec...8pR1',
      },
    ],
  },
  telegram: {
    icon: '/消息平台/telegram-square.svg',
    title: 'Telegram',
    description: '创建一个Telegram应用，将App ID 和 App Secret 复制到这里。',
    fields: [
      {
        label: 'Client ID',
        placeholder: '输入Telegram客户端ID',
        savedValue: 'telegram-client-id...',
      },
      {
        label: 'Client Secret',
        placeholder: '输入Telegram客户端Secret',
        savedValue: '已保存:telegram-sec...5nT7',
      },
    ],
  },
  discord: {
    icon: '/消息平台/discord-square.svg',
    title: 'Discord',
    description: '创建一个Discord应用，将App ID 和 App Secret 复制到这里。',
    fields: [
      {
        label: 'Client ID',
        placeholder: '输入Discord客户端ID',
        savedValue: 'discord-client-id...',
      },
      {
        label: 'Client Secret',
        placeholder: '输入Discord客户端Secret',
        savedValue: '已保存:discord-sec...3dL9',
      },
    ],
  },
}

function MorePlatformPanel({
  platformKey,
  isEnabled,
  onEnabledChange,
  onComplete,
  onToast,
  onDetailScroll,
}: {
  platformKey: string
  isEnabled: boolean
  onEnabledChange: (isEnabled: boolean) => void
  onComplete: () => void
  onToast: (toast: PlatformToastPayload) => void
  onDetailScroll: UIEventHandler<HTMLElement>
}) {
  const config = morePlatformConfigs[platformKey]

  if (!config) {
    return null
  }

  return (
    <CredentialPanel
      config={config}
      isEnabled={isEnabled}
      onEnabledChange={onEnabledChange}
      onComplete={onComplete}
      onToast={onToast}
      onDetailScroll={onDetailScroll}
    />
  )
}

function MessagePlatformPage({
  onTitlebarChange,
}: {
  onTitlebarChange: (state: PlatformTitlebarState) => void
}) {
  const [selectedPlatform, setSelectedPlatform] = useState('dingding')
  const [platformStatuses, setPlatformStatuses] = useState<Record<string, PlatformStatus>>({})
  const [isWeChatBound, setIsWeChatBound] = useState(false)
  const [platformToast, setPlatformToast] = useState<PlatformToastState | null>(null)
  const [isPlatformNavScrolled, setIsPlatformNavScrolled] = useState(false)
  const [isPlatformDetailScrolled, setIsPlatformDetailScrolled] = useState(false)
  const selectedPlatformItem = platformGroups
    .flatMap((group) => group.items)
    .find((item) => item.key === selectedPlatform)
  const selectedPlatformStatus = platformStatuses[selectedPlatform] ?? 'off'
  const isSelectedPlatformEnabled = selectedPlatformStatus !== 'off'
  const setPlatformEnabled = useCallback((platformKey: string, isEnabled: boolean) => {
    setPlatformStatuses((currentStatuses) => ({
      ...currentStatuses,
      [platformKey]: isEnabled
        ? currentStatuses[platformKey] === 'complete'
          ? 'complete'
          : 'pending'
        : 'off',
    }))
  }, [])
  const completePlatform = useCallback((platformKey: string) => {
    setPlatformStatuses((currentStatuses) => ({
      ...currentStatuses,
      [platformKey]: 'complete',
    }))
  }, [])
  const showPlatformToast = useCallback((toast: PlatformToastPayload) => {
    setPlatformToast({
      ...toast,
      id: Date.now(),
    })
  }, [])
  const closePlatformToast = useCallback(() => {
    setPlatformToast(null)
  }, [])
  const handlePlatformNavScroll = useCallback<UIEventHandler<HTMLDivElement>>((event) => {
    setIsPlatformNavScrolled(event.currentTarget.scrollTop > 0)
  }, [])
  const handlePlatformDetailScroll = useCallback<UIEventHandler<HTMLElement>>((event) => {
    setIsPlatformDetailScrolled(
      isElementCoveredByTitlebar(event.currentTarget, '.platform-heading'),
    )
  }, [])

  useEffect(() => {
    onTitlebarChange({
      isDocked: isPlatformNavScrolled || isPlatformDetailScrolled,
      isListDocked: isPlatformNavScrolled,
      isDetailDocked: isPlatformDetailScrolled,
      title: selectedPlatformItem?.label ?? '消息平台',
      icon: getPlatformTitleIcon(selectedPlatformItem?.icon),
      isEnabled: isSelectedPlatformEnabled,
    })
  }, [
    isPlatformNavScrolled,
    isPlatformDetailScrolled,
    isSelectedPlatformEnabled,
    onTitlebarChange,
    selectedPlatformItem?.icon,
    selectedPlatformItem?.label,
  ])

  useEffect(() => {
    const togglePlatformFromTitlebar = () => {
      setPlatformEnabled(selectedPlatform, !isSelectedPlatformEnabled)
    }

    window.addEventListener('message-platform-title-switch-toggle', togglePlatformFromTitlebar)

    return () => {
      window.removeEventListener('message-platform-title-switch-toggle', togglePlatformFromTitlebar)
    }
  }, [isSelectedPlatformEnabled, selectedPlatform, setPlatformEnabled])

  useEffect(() => {
    setIsPlatformDetailScrolled(false)
  }, [selectedPlatform])

  return (
    <section
      className={`message-platform-page ${isPlatformNavScrolled ? 'nav-scrolled' : ''} ${
        isPlatformDetailScrolled ? 'detail-scrolled' : ''
      }`}
      aria-label="消息平台"
    >
      <AppToast toast={platformToast} onClose={closePlatformToast} />
      <aside className="platform-side-nav" aria-label="消息平台列表">
        <div className="platform-side-scroll" onScroll={handlePlatformNavScroll}>
          {platformGroups.map((group) => (
            <div className="platform-nav-group" key={group.title}>
              <div className="platform-nav-label">{group.title}</div>
              {group.items.map((item) => {
                const isActive = selectedPlatform === item.key
                const platformStatus = platformStatuses[item.key] ?? 'off'
                const isEnabled = platformStatus !== 'off'

                return (
                  <button
                    key={item.key}
                    className={`platform-nav-item ${isActive ? 'active' : ''} ${
                      isEnabled ? `enabled ${platformStatus}` : ''
                    }`}
                    type="button"
                    title={item.label}
                    onClick={() => setSelectedPlatform(item.key)}
                  >
                    <img src={item.icon} alt="" />
                    <span>{item.label}</span>
                    {isEnabled ? <i aria-hidden="true" /> : null}
                  </button>
                )
              })}
            </div>
          ))}
          {platformScrollTestGroups.map((group, groupIndex) => (
            <div className="platform-nav-group" key={`${group.title}-scroll-test-${groupIndex}`}>
              <div className="platform-nav-label">{group.title}</div>
              {group.items.map((item) => (
                <button
                  key={item.key}
                  className="platform-nav-item"
                  type="button"
                  title={item.label}
                  onClick={() => setSelectedPlatform(item.key.replace(/-scroll-test-\d+$/, ''))}
                >
                  <img src={item.icon} alt="" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {selectedPlatform === 'dingding' ? (
        <DingTalkPanel
          isEnabled={(platformStatuses.dingding ?? 'off') !== 'off'}
          onEnabledChange={(isEnabled) => setPlatformEnabled('dingding', isEnabled)}
          onComplete={() => completePlatform('dingding')}
          onToast={showPlatformToast}
          onDetailScroll={handlePlatformDetailScroll}
        />
      ) : selectedPlatform === 'feishu' ? (
        <FeishuPanel
          isEnabled={(platformStatuses.feishu ?? 'off') !== 'off'}
          onEnabledChange={(isEnabled) => setPlatformEnabled('feishu', isEnabled)}
          onComplete={() => completePlatform('feishu')}
          onToast={showPlatformToast}
          onDetailScroll={handlePlatformDetailScroll}
        />
      ) : selectedPlatform === 'qiyeweixin' ? (
        <EnterpriseWeChatPanel
          isEnabled={(platformStatuses.qiyeweixin ?? 'off') !== 'off'}
          onEnabledChange={(isEnabled) => setPlatformEnabled('qiyeweixin', isEnabled)}
          onComplete={() => completePlatform('qiyeweixin')}
          onToast={showPlatformToast}
          onDetailScroll={handlePlatformDetailScroll}
        />
      ) : selectedPlatform === 'weixin' ? (
        <WeChatPanel
          isEnabled={(platformStatuses.weixin ?? 'off') !== 'off'}
          isBound={isWeChatBound}
          onEnabledChange={(isEnabled) => setPlatformEnabled('weixin', isEnabled)}
          onComplete={() => completePlatform('weixin')}
          onToast={showPlatformToast}
          onBind={() => {
            setIsWeChatBound(true)
            setPlatformEnabled('weixin', true)
          }}
          onDisconnect={() => {
            setIsWeChatBound(false)
            setPlatformEnabled('weixin', false)
          }}
          onDetailScroll={handlePlatformDetailScroll}
        />
      ) : selectedPlatform === 'qq' ? (
        <QqRobotPanel
          isEnabled={(platformStatuses.qq ?? 'off') !== 'off'}
          onEnabledChange={(isEnabled) => setPlatformEnabled('qq', isEnabled)}
          onComplete={() => completePlatform('qq')}
          onToast={showPlatformToast}
          onDetailScroll={handlePlatformDetailScroll}
        />
      ) : morePlatformConfigs[selectedPlatform] ? (
        <MorePlatformPanel
          platformKey={selectedPlatform}
          isEnabled={(platformStatuses[selectedPlatform] ?? 'off') !== 'off'}
          onEnabledChange={(isEnabled) => setPlatformEnabled(selectedPlatform, isEnabled)}
          onComplete={() => completePlatform(selectedPlatform)}
          onToast={showPlatformToast}
          onDetailScroll={handlePlatformDetailScroll}
        />
      ) : (
        <section className="platform-detail platform-placeholder" onScroll={handlePlatformDetailScroll}>
          <header className="platform-header">
            <img
              className="platform-heading-icon"
              src={
                platformGroups
                  .flatMap((group) => group.items)
                  .find((item) => item.key === selectedPlatform)?.icon ?? ''
              }
              alt=""
            />
            <div className="platform-heading">
              <div className="platform-heading-copy">
                <h1>
                  {platformGroups
                    .flatMap((group) => group.items)
                    .find((item) => item.key === selectedPlatform)?.label ?? '消息平台'}
                </h1>
                <p>当前先完成钉钉功能，其他平台后续按设计稿继续补齐。</p>
              </div>
            </div>
          </header>
        </section>
      )}
    </section>
  )
}

function SkillsPage({
  onStartChat,
  onTitleDockedChange,
  activeSkillsSection,
  onActiveSkillsSectionChange,
  language,
}: {
  onStartChat: () => void
  onTitleDockedChange: (isDocked: boolean) => void
  activeSkillsSection: 'skills' | 'employees'
  onActiveSkillsSectionChange: (section: 'skills' | 'employees') => void
  language: '中文' | 'English'
}) {
  const [searchValue, setSearchValue] = useState('')
  const [skillsViewMode, setSkillsViewMode] = useState<'grid' | 'list'>('grid')
  const [employeesViewMode, setEmployeesViewMode] = useState<'grid' | 'list'>('grid')
  const [activeSkillTab, setActiveSkillTab] = useState(skillTabs[0])
  const [activeEmployeeTab, setActiveEmployeeTab] = useState(employeeTabs[0])
  const [selectedSource, setSelectedSource] = useState('全部来源')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isGithubDialogOpen, setIsGithubDialogOpen] = useState(false)
  const [openEmployeeMenuTitle, setOpenEmployeeMenuTitle] = useState<string | null>(null)
  const [openSkillMenuTitle, setOpenSkillMenuTitle] = useState<string | null>(null)
  const [pendingDisableEmployee, setPendingDisableEmployee] = useState<EmployeeItem | null>(null)
  const [disabledEmployees, setDisabledEmployees] = useState<Record<string, boolean>>({})
  const [disabledSkills, setDisabledSkills] = useState<Record<string, boolean>>({})
  const [isTitleDocked, setIsTitleDocked] = useState(false)
  const [isToolbarDocked, setIsToolbarDocked] = useState(false)
  const [tabOverflow, setTabOverflow] = useState({ left: false, right: false })
  const skillsScrollRef = useRef<HTMLElement | null>(null)
  const skillsReserveRef = useRef<HTMLDivElement | null>(null)
  const pendingSkillsAnchorRef = useRef<number | null>(null)
  const skillsScrollFrameRef = useRef(0)
  const skillsOuterOffsetRef = useRef(0)
  const skillsTitleDockedRef = useRef(false)
  const skillsToolbarDockedRef = useRef(false)
  const tabsViewportRef = useRef<HTMLDivElement | null>(null)
  const tabsOverflowFrameRef = useRef(0)
  const tabOverflowRef = useRef({ left: false, right: false })
  const addMenuRef = useRef<HTMLDivElement | null>(null)
  const filterMenuRef = useRef<HTMLDivElement | null>(null)
  const employeeMenuRef = useRef<HTMLDivElement | null>(null)
  const skillMenuRef = useRef<HTMLDivElement | null>(null)
  const addPopoverRef = useRef<HTMLDivElement | null>(null)
  const filterPopoverRef = useRef<HTMLDivElement | null>(null)
  const employeePopoverRef = useRef<HTMLDivElement | null>(null)
  const skillPopoverRef = useRef<HTMLDivElement | null>(null)
  const addPopoverStyle = useFloatingPopoverPlacement(isAddMenuOpen, addMenuRef, addPopoverRef)
  const filterPopoverStyle = useFloatingPopoverPlacement(isFilterOpen, filterMenuRef, filterPopoverRef)
  const employeePopoverStyle = useFloatingPopoverPlacement(
    Boolean(openEmployeeMenuTitle),
    employeeMenuRef,
    employeePopoverRef,
    [openEmployeeMenuTitle],
  )
  const skillPopoverStyle = useFloatingPopoverPlacement(
    Boolean(openSkillMenuTitle),
    skillMenuRef,
    skillPopoverRef,
    [openSkillMenuTitle],
  )
  const normalizedSearch = searchValue.trim().toLowerCase()
  const filteredSkills = normalizedSearch
    ? skillItems.filter(
        (skill) =>
          skill.title.toLowerCase().includes(normalizedSearch) ||
          skill.description.toLowerCase().includes(normalizedSearch),
      )
    : skillItems
  const filteredEmployees = normalizedSearch
    ? employeeItems.filter(
        (employee) =>
          employee.title.toLowerCase().includes(normalizedSearch) ||
          employee.description.toLowerCase().includes(normalizedSearch),
      )
    : employeeItems
  const isEmployeesSection = activeSkillsSection === 'employees'
  const viewMode = isEmployeesSection ? employeesViewMode : skillsViewMode
  const setActiveViewMode = isEmployeesSection ? setEmployeesViewMode : setSkillsViewMode
  const activeTabs = isEmployeesSection ? employeeTabs : skillTabs
  const enabledCount = skillItems.filter((skill) => !disabledSkills[skill.title]).length
  const enabledEmployeeCount = employeeItems.filter((employee) => !disabledEmployees[employee.title]).length
  const isEmpty =
    normalizedSearch.length > 0 && (isEmployeesSection ? filteredEmployees.length === 0 : filteredSkills.length === 0)
  const applySkillsOuterOffset = useCallback(
    (nextOffset: number) => {
      const scrollTop = Math.max(0, nextOffset)
      const offset = Math.min(72, scrollTop)
      const toolbarCollapse = Math.max(0, Math.min(1, (scrollTop - 72) / 16))
      const toolbarHeight = 80 - toolbarCollapse * 16
      const toolbarPadding = 24 - toolbarCollapse * 8
      const page = skillsScrollRef.current
      const visibleResultsTop = Math.max(0, 72 - offset) + toolbarHeight
      const nextTitleDocked = scrollTop >= 48
      const nextToolbarDocked = scrollTop >= 72

      skillsOuterOffsetRef.current = scrollTop
      page?.style.setProperty('--skills-page-offset', `${offset}px`)
      page?.style.setProperty('--skills-toolbar-height', `${toolbarHeight}px`)
      page?.style.setProperty('--skills-toolbar-padding', `${toolbarPadding}px`)
      page?.style.setProperty(
        '--skills-results-min-height',
        `${Math.max(0, (page?.clientHeight ?? 0) - visibleResultsTop)}px`,
      )
      if (skillsTitleDockedRef.current !== nextTitleDocked) {
        skillsTitleDockedRef.current = nextTitleDocked
        onTitleDockedChange(nextTitleDocked)
        setIsTitleDocked(nextTitleDocked)
      }
      if (skillsToolbarDockedRef.current !== nextToolbarDocked) {
        skillsToolbarDockedRef.current = nextToolbarDocked
        setIsToolbarDocked(nextToolbarDocked)
      }
    },
    [onTitleDockedChange],
  )
  const handleSkillsOuterScroll: UIEventHandler<HTMLElement> = useCallback(
    () => {
      if (skillsScrollFrameRef.current) {
        return
      }
      skillsScrollFrameRef.current = window.requestAnimationFrame(() => {
        skillsScrollFrameRef.current = 0
        applySkillsOuterOffset(skillsScrollRef.current?.scrollTop ?? 0)
      })
    },
    [applySkillsOuterOffset],
  )
  const prepareSkillsResultsChange = useCallback(() => {
    const page = skillsScrollRef.current
    const reserve = skillsReserveRef.current

    if (!page || !reserve) {
      return
    }

    const anchor = Math.min(page.scrollTop, 88)
    reserve.style.height = `${page.clientHeight + page.scrollTop}px`
    page.scrollTop = anchor
    pendingSkillsAnchorRef.current = anchor
    applySkillsOuterOffset(anchor)
  }, [applySkillsOuterOffset])
  const switchSkillsSection = useCallback(
    (section: 'skills' | 'employees') => {
      prepareSkillsResultsChange()
      onActiveSkillsSectionChange(section)
      setSearchValue('')
      setIsAddMenuOpen(false)
      setIsFilterOpen(false)
      setOpenEmployeeMenuTitle(null)
      setOpenSkillMenuTitle(null)
    },
    [onActiveSkillsSectionChange, prepareSkillsResultsChange],
  )
  const updateSkillsSearch = useCallback(
    (nextValue: string) => {
      prepareSkillsResultsChange()
      setSearchValue(nextValue)
    },
    [prepareSkillsResultsChange],
  )
  const clearSkillsSearch = () => updateSkillsSearch('')
  const updateTabOverflow = useCallback(() => {
    if (tabsOverflowFrameRef.current) {
      return
    }
    tabsOverflowFrameRef.current = window.requestAnimationFrame(() => {
      tabsOverflowFrameRef.current = 0
      const tabsViewport = tabsViewportRef.current
      const nextOverflow = tabsViewport
        ? {
            left: tabsViewport.scrollLeft > 1,
            right:
              tabsViewport.scrollLeft <
              Math.max(0, tabsViewport.scrollWidth - tabsViewport.clientWidth) - 1,
          }
        : { left: false, right: false }

      if (
        tabOverflowRef.current.left === nextOverflow.left &&
        tabOverflowRef.current.right === nextOverflow.right
      ) {
        return
      }
      tabOverflowRef.current = nextOverflow
      setTabOverflow(nextOverflow)
    })
  }, [])
  const scrollTabs = useCallback(
    (direction: -1 | 1) => {
      const tabsViewport = tabsViewportRef.current

      if (!tabsViewport) {
        return
      }

      tabsViewport.scrollBy({
        left: direction * Math.max(96, Math.round(tabsViewport.clientWidth * 0.6)),
        behavior: 'smooth',
      })
      window.requestAnimationFrame(updateTabOverflow)
      window.setTimeout(updateTabOverflow, 260)
    },
    [updateTabOverflow],
  )
  const handleTabsWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      const tabsViewport = tabsViewportRef.current

      if (!tabsViewport) {
        return
      }

      const maxScrollLeft = Math.max(0, tabsViewport.scrollWidth - tabsViewport.clientWidth)

      if (maxScrollLeft <= 0) {
        return
      }

      if (Math.abs(event.deltaX) > 0 || !event.shiftKey || event.deltaY === 0) {
        return
      }

      const scrollDelta = event.deltaY

      const isMovingLeftPastStart = scrollDelta < 0 && tabsViewport.scrollLeft <= 0
      const isMovingRightPastEnd = scrollDelta > 0 && tabsViewport.scrollLeft >= maxScrollLeft

      if (isMovingLeftPastStart || isMovingRightPastEnd) {
        return
      }

      event.preventDefault()
      tabsViewport.scrollBy({ left: scrollDelta, behavior: 'auto' })
    },
    [updateTabOverflow],
  )

  useEffect(() => () => onTitleDockedChange(false), [onTitleDockedChange])
  useEffect(() => {
    const page = skillsScrollRef.current

    if (!page) {
      return undefined
    }

    const scheduleSync = () => {
      if (skillsScrollFrameRef.current) {
        return
      }
      skillsScrollFrameRef.current = window.requestAnimationFrame(() => {
        skillsScrollFrameRef.current = 0
        applySkillsOuterOffset(page.scrollTop)
      })
    }

    page.addEventListener('scroll', scheduleSync, { passive: true })
    page.addEventListener('wheel', scheduleSync, { passive: true })

    return () => {
      page.removeEventListener('scroll', scheduleSync)
      page.removeEventListener('wheel', scheduleSync)
      if (skillsScrollFrameRef.current) {
        window.cancelAnimationFrame(skillsScrollFrameRef.current)
        skillsScrollFrameRef.current = 0
      }
    }
  }, [applySkillsOuterOffset])
  useLayoutEffect(() => {
    const page = skillsScrollRef.current
    const reserve = skillsReserveRef.current
    const anchor = pendingSkillsAnchorRef.current

    if (!page || !reserve || anchor === null) {
      return
    }

    const requiredBottom = anchor + page.clientHeight
    const contentBottom = reserve.offsetTop
    reserve.style.height = `${Math.max(0, requiredBottom - contentBottom)}px`
    page.scrollTop = anchor
    pendingSkillsAnchorRef.current = null
    applySkillsOuterOffset(anchor)
  }, [activeSkillsSection, applySkillsOuterOffset, searchValue])
  useLayoutEffect(() => {
    const tabsViewport = tabsViewportRef.current

    if (!tabsViewport) {
      return undefined
    }

    tabsViewport.scrollLeft = 0
    updateTabOverflow()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateTabOverflow)
      return () => window.removeEventListener('resize', updateTabOverflow)
    }

    const resizeObserver = new ResizeObserver(updateTabOverflow)
    resizeObserver.observe(tabsViewport)

    if (tabsViewport.firstElementChild) {
      resizeObserver.observe(tabsViewport.firstElementChild)
    }

    return () => {
      resizeObserver.disconnect()
      if (tabsOverflowFrameRef.current) {
        window.cancelAnimationFrame(tabsOverflowFrameRef.current)
        tabsOverflowFrameRef.current = 0
      }
    }
  }, [activeTabs, updateTabOverflow])
  useEffect(() => {
    if (!isAddMenuOpen && !isFilterOpen) {
      return undefined
    }

    let isDismissReady = false
    const readyTimer = window.setTimeout(() => {
      isDismissReady = true
    }, 0)
    const closeFloatingMenus = (event: MouseEvent) => {
      if (!isDismissReady) {
        return
      }
      const target = event.target

      if (!(target instanceof Node)) {
        return
      }

      if (addMenuRef.current?.contains(target) || filterMenuRef.current?.contains(target)) {
        return
      }

      setIsAddMenuOpen(false)
      setIsFilterOpen(false)
    }

    document.addEventListener('click', closeFloatingMenus)

    return () => {
      window.clearTimeout(readyTimer)
      document.removeEventListener('click', closeFloatingMenus)
    }
  }, [isAddMenuOpen, isFilterOpen])
  useEffect(() => {
    if (!openEmployeeMenuTitle && !openSkillMenuTitle) {
      return undefined
    }

    const openedEmployeeMenuTitle = openEmployeeMenuTitle
    const openedSkillMenuTitle = openSkillMenuTitle
    let isDismissReady = false
    const readyTimer = window.setTimeout(() => {
      isDismissReady = true
    }, 0)
    const closeCardMenu = (event: MouseEvent) => {
      if (!isDismissReady) {
        return
      }
      const target = event.target

      if (!(target instanceof Node)) {
        return
      }

      if (employeeMenuRef.current?.contains(target) || skillMenuRef.current?.contains(target)) {
        return
      }

      setOpenEmployeeMenuTitle((currentTitle) =>
        currentTitle === openedEmployeeMenuTitle ? null : currentTitle,
      )
      setOpenSkillMenuTitle((currentTitle) =>
        currentTitle === openedSkillMenuTitle ? null : currentTitle,
      )
    }

    document.addEventListener('click', closeCardMenu)

    return () => {
      window.clearTimeout(readyTimer)
      document.removeEventListener('click', closeCardMenu)
    }
  }, [openEmployeeMenuTitle, openSkillMenuTitle])

  return (
    <section
      className={`skills-page ${isEmployeesSection ? 'employees-view' : 'skills-view'} ${
        isTitleDocked ? 'title-docked' : ''
      } ${isToolbarDocked ? 'toolbar-docked' : ''} ${
        normalizedSearch.length > 0 ? 'searching' : ''
      }`}
      aria-label="技能"
      ref={skillsScrollRef}
      onScroll={handleSkillsOuterScroll}
    >
      <div className="skills-page-viewport">
        <header className="skills-header">
        <div className="skills-shell">
          <div className="skills-heading">
            <div className="skills-title-row">
              <button
                className={activeSkillsSection === 'skills' ? 'active' : ''}
                type="button"
                onClick={() => switchSkillsSection('skills')}
              >
                技能
              </button>
              <button
                className={activeSkillsSection === 'employees' ? 'active' : ''}
                type="button"
                onClick={() => switchSkillsSection('employees')}
              >
                员工
              </button>
            </div>
            <p>
              {isEmployeesSection
                ? language === 'English'
                  ? `${enabledEmployeeCount} employees enabled, ${employeeItems.length} total`
                  : `已启用员工${enabledEmployeeCount}个，共${employeeItems.length}个`
                : language === 'English'
                  ? `${enabledCount} skills enabled, ${skillItems.length} total`
                  : `已启用技能${enabledCount}个，共${skillItems.length}个`}
            </p>
          </div>
        </div>
        </header>

        <div className="skills-scroll">
        <div className="skills-shell skills-scroll-content">
          <section className="skills-toolbar" aria-label="技能筛选工具栏">
            <div className="skills-tabs">
              {tabOverflow.left ? (
                <div className="skills-tabs-edge left" aria-hidden="false">
                  <button
                    className="skills-tabs-arrow"
                    type="button"
                    aria-label="向左滚动分类"
                    onClick={() => scrollTabs(-1)}
                  >
                    <FigmaIcon icon={chevronLeftIcon} />
                  </button>
                </div>
              ) : null}
              <div
                className="skills-tabs-viewport"
                ref={tabsViewportRef}
                onScroll={updateTabOverflow}
                onWheel={handleTabsWheel}
              >
                <div className="skills-tabs-track">
                  {activeTabs.map((tab) => (
                    <button
                      className={`skills-tab ${
                        (isEmployeesSection ? activeEmployeeTab : activeSkillTab) === tab ? 'active' : ''
                      }`}
                      type="button"
                      key={tab}
                      onClick={() => {
                        if (isEmployeesSection) {
                          setActiveEmployeeTab(tab)
                          setOpenEmployeeMenuTitle(null)
                          return
                        }
                        setOpenSkillMenuTitle(null)
                        setActiveSkillTab(tab)
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              {tabOverflow.right ? (
                <div className="skills-tabs-edge right" aria-hidden="false">
                  <button
                    className="skills-tabs-arrow"
                    type="button"
                    aria-label="向右滚动分类"
                    onClick={() => scrollTabs(1)}
                  >
                    <FigmaIcon icon={chevronRightIcon} />
                  </button>
                </div>
              ) : null}
            </div>
            <div className="skills-toolbar-actions">
              <div className="skills-view-controls" aria-label="视图切换">
                {!isEmployeesSection ? (
                  <>
                    <div className="skills-filter-button-wrap" ref={filterMenuRef}>
                      <button
                        className={`skills-icon-button ${isFilterOpen ? 'active' : ''}`}
                        type="button"
                        aria-label="筛选"
                        onClick={() => {
                          setIsFilterOpen((isOpen) => !isOpen)
                          setIsAddMenuOpen(false)
                        }}
                      >
                        <FigmaIcon icon={listFilterIcon} />
                      </button>
                      {isFilterOpen ? (
                        <div
                          className="skills-filter-popover"
                          ref={filterPopoverRef}
                          role="menu"
                          aria-label="来源筛选"
                          style={filterPopoverStyle}
                        >
                          <div className="skills-popover-label">来源筛选</div>
                          {['全部来源', '内置技能', '自定义'].map((source) => (
                            <button
                              className="skills-popover-item"
                              type="button"
                              role="menuitem"
                              key={source}
                              onClick={() => {
                                setSelectedSource(source)
                                setIsFilterOpen(false)
                              }}
                            >
                              <span className="skills-popover-item-surface">
                                <span>{source}</span>
                                {selectedSource === source ? <FigmaIcon icon={checkIcon} /> : null}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <span className="skills-control-divider" />
                  </>
                ) : null}
                <div className="skills-layout-buttons">
                  <button
                    className={`skills-icon-button ${viewMode === 'list' ? 'active' : ''}`}
                    type="button"
                    aria-label="列表视图"
                    onClick={() => setActiveViewMode('list')}
                  >
                    <FigmaIcon icon={layoutListIcon} />
                  </button>
                  <button
                    className={`skills-icon-button ${viewMode === 'grid' ? 'active' : ''}`}
                    type="button"
                    aria-label="卡片视图"
                    onClick={() => setActiveViewMode('grid')}
                  >
                    <FigmaIcon icon={layoutGridIcon} />
                  </button>
                </div>
              </div>
              <div className="skills-tool-actions">
                <label className="skills-search">
                  <FigmaIcon icon={searchIcon} />
                  <input
                    value={searchValue}
                    onChange={(event) => updateSkillsSearch(event.currentTarget.value)}
                    placeholder={isEmployeesSection ? '搜索员工' : '搜索技能'}
                    aria-label={isEmployeesSection ? '搜索员工' : '搜索技能'}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="none"
                  />
                  {searchValue ? (
                    <button
                      className="skills-search-clear"
                      type="button"
                      aria-label="清空搜索"
                      onClick={clearSkillsSearch}
                    >
                      <FigmaIcon icon={xIcon} />
                    </button>
                  ) : null}
                </label>
                {!isEmployeesSection ? (
                  <div className="skills-add-button-wrap" ref={addMenuRef}>
                    <button
                      className={`skills-add-button ${isAddMenuOpen ? 'active' : ''}`}
                      type="button"
                      aria-label="添加技能"
                      onClick={() => {
                        setIsAddMenuOpen((isOpen) => !isOpen)
                        setIsFilterOpen(false)
                      }}
                    >
                      <FigmaIcon icon={plusIcon} />
                    </button>
                    {isAddMenuOpen ? (
                      <div
                        className="skills-add-popover"
                        ref={addPopoverRef}
                        role="menu"
                        aria-label="添加技能"
                        style={addPopoverStyle}
                      >
                        <div className="skills-add-popover-items">
                          <button
                            className="skills-add-option"
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setIsAddMenuOpen(false)
                              onStartChat()
                            }}
                          >
                            <span className="skills-add-option-surface">
                              <span className="skills-add-option-icon">
                                <FigmaIcon icon={messageSquarePlusIcon} />
                              </span>
                              <span className="skills-add-option-copy">
                                <span>通过对话创建</span>
                                <span>描述你的需求，AI帮你生成</span>
                              </span>
                            </span>
                          </button>
                          <div className="skills-add-option-divider" />
                          <button
                            className="skills-add-option"
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setIsAddMenuOpen(false)
                              setIsGithubDialogOpen(true)
                            }}
                          >
                            <span className="skills-add-option-surface">
                              <span className="skills-add-option-icon">
                                <FigmaIcon icon={githubMarkIcon} />
                              </span>
                              <span className="skills-add-option-copy">
                                <span>从GitHub导入</span>
                                <span>粘贴一个仓库连接进行开始</span>
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>

        <div className="skills-results-scroll">
          <div className="skills-shell skills-results-content">
          {isEmpty ? (
            <section className="skills-empty-state" aria-live="polite">
              <div className="skills-empty-box">
                <FigmaIcon icon={searchSlashIcon} />
                <div>
                  <h2>{isEmployeesSection ? '未找到员工' : '未找到技能'}</h2>
                  <p>更替关键词再试试</p>
                </div>
              </div>
            </section>
          ) : isEmployeesSection ? (
            <section
              className={viewMode === 'grid' ? 'employees-grid' : 'employees-list'}
              aria-label="员工列表"
            >
              {filteredEmployees.map((employee) => {
                const isEmployeeDisabled = Boolean(disabledEmployees[employee.title])

                return (
                  <article
                    className={viewMode === 'grid' ? 'employee-card' : 'employee-list-item'}
                    key={employee.title}
                  >
                    <div className="employee-card-top">
                      <span className="employee-card-image" aria-hidden="true">
                        {employee.image ? <img src={employee.image} alt="" /> : null}
                      </span>
                      <div className="employee-card-actions">
                        {!isEmployeeDisabled ? (
                          <button
                            className="employee-card-chat"
                            type="button"
                            aria-label={`打开${employee.title}对话`}
                            onClick={onStartChat}
                          >
                            <span>去对话</span>
                          </button>
                        ) : null}
                        {isEmployeeDisabled ? (
                          <button
                            className="employee-card-action employee-card-action-add"
                            type="button"
                            aria-label={`添加${employee.title}`}
                            onClick={() =>
                              setDisabledEmployees((currentEmployees) => ({
                                ...currentEmployees,
                                [employee.title]: false,
                              }))
                            }
                          >
                            <FigmaIcon icon={plusIcon} />
                          </button>
                        ) : (
                          <div
                            className="employee-card-menu-anchor"
                            ref={openEmployeeMenuTitle === employee.title ? employeeMenuRef : null}
                          >
                            <button
                              className={`employee-card-action ${
                                openEmployeeMenuTitle === employee.title ? 'active' : ''
                              }`}
                              type="button"
                              aria-label={`${employee.title}更多操作`}
                              onClick={() => {
                                setOpenEmployeeMenuTitle((currentTitle) =>
                                  currentTitle === employee.title ? null : employee.title,
                                )
                              }}
                            >
                              <FigmaIcon icon={ellipsisIcon} />
                            </button>
                            {openEmployeeMenuTitle === employee.title ? (
                              <div
                                className="scheduled-task-menu employee-card-menu"
                                ref={employeePopoverRef}
                                role="menu"
                                aria-label="员工更多操作"
                                style={employeePopoverStyle}
                              >
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setOpenEmployeeMenuTitle(null)
                                    setPendingDisableEmployee(employee)
                                  }}
                                >
                                  <span className="employee-card-menu-surface">
                                    <FigmaIcon icon={banIcon} />
                                    停用员工
                                  </span>
                                </button>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="employee-card-copy">
                      <h2>{employee.title}</h2>
                      <p>{employee.description}</p>
                    </div>
                  </article>
                )
              })}
            </section>
          ) : (
            <section
              className={viewMode === 'grid' ? 'skills-grid' : 'skills-list'}
              aria-label="技能列表"
            >
              {filteredSkills.map((skill, skillIndex) => {
                const isSkillDisabled = Boolean(disabledSkills[skill.title])

                return (
                  <article className={viewMode === 'grid' ? 'skill-card' : 'skill-list-item'} key={skill.title}>
                    <div className="skill-card-top">
                      <span
                        className="skill-card-image"
                        style={
                          {
                            '--skill-image-color': skillImageColors[skillIndex % skillImageColors.length],
                          } as CSSProperties
                        }
                        aria-hidden="true"
                      >
                        {getSkillImageText(skill.title)}
                      </span>
                      <div className="skill-card-actions">
                        {!isSkillDisabled ? (
                          <button
                            className="employee-card-chat skill-card-use"
                            type="button"
                            aria-label={`使用${skill.title}`}
                            onClick={onStartChat}
                          >
                            <span>去使用</span>
                          </button>
                        ) : null}
                        {isSkillDisabled ? (
                          <button
                            className="employee-card-action employee-card-action-add"
                            type="button"
                            aria-label={`添加${skill.title}`}
                            onClick={() =>
                              setDisabledSkills((currentSkills) => ({
                                ...currentSkills,
                                [skill.title]: false,
                              }))
                            }
                          >
                            <FigmaIcon icon={plusIcon} />
                          </button>
                        ) : (
                          <div
                            className="employee-card-menu-anchor"
                            ref={openSkillMenuTitle === skill.title ? skillMenuRef : null}
                          >
                            <button
                              className={`employee-card-action skill-card-more ${
                                openSkillMenuTitle === skill.title ? 'active' : ''
                              }`}
                              type="button"
                              aria-label={`${skill.title}更多操作`}
                              onClick={() => {
                                setOpenSkillMenuTitle((currentTitle) =>
                                  currentTitle === skill.title ? null : skill.title,
                                )
                              }}
                            >
                              <FigmaIcon icon={ellipsisIcon} />
                            </button>
                            {openSkillMenuTitle === skill.title ? (
                              <div
                                className="scheduled-task-menu employee-card-menu"
                                ref={skillPopoverRef}
                                role="menu"
                                aria-label="技能更多操作"
                                style={skillPopoverStyle}
                              >
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={() => {
                                    setOpenSkillMenuTitle(null)
                                    setDisabledSkills((currentSkills) => ({
                                      ...currentSkills,
                                      [skill.title]: true,
                                    }))
                                  }}
                                >
                                  <span className="employee-card-menu-surface">
                                    <FigmaIcon icon={banIcon} />
                                    停用技能
                                  </span>
                                </button>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="skill-card-copy">
                      <h2>{skill.title}</h2>
                      <p>{skill.description}</p>
                    </div>
                  </article>
                )
              })}
            </section>
          )}
          </div>
        </div>
      </div>
      <div className="skills-native-scroll-track" ref={skillsReserveRef} aria-hidden="true" />
      {isGithubDialogOpen ? (
        <div className="skills-modal-overlay modal-fade-layer" onClick={() => setIsGithubDialogOpen(false)}>
          <section
            className="skills-github-dialog modal-pop-surface"
            aria-label="从GitHub导入"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="skills-github-heading">
              <h2>从GitHub导入</h2>
              <button type="button" aria-label="关闭" onClick={() => setIsGithubDialogOpen(false)}>
                <FigmaIcon icon={modalXIcon} />
              </button>
            </header>
            <div className="skills-github-content">
              <input placeholder="粘贴仓库连接(如https://github.com/xxx/yyy)" />
            </div>
            <footer className="skills-github-actions">
              <button type="button" onClick={() => setIsGithubDialogOpen(false)}>
                取消
              </button>
              <button type="button">确定</button>
            </footer>
          </section>
        </div>
      ) : null}
      {pendingDisableEmployee ? (
        <DangerConfirmDialog
          title="停用员工？"
          description="若停用，相关的历史对话、远程连接等信息都将被删除，该操作不可逆"
          closeIcon={scheduledDeleteModalXIcon}
          cancelLabel="取消"
          confirmLabel="停用"
          confirmTone="danger"
          ariaLabel="停用员工"
          onCancel={() => setPendingDisableEmployee(null)}
          onConfirm={() => {
            setDisabledEmployees((currentEmployees) => ({
              ...currentEmployees,
              [pendingDisableEmployee.title]: true,
            }))
            setPendingDisableEmployee(null)
          }}
        />
      ) : null}
    </section>
  )
}

function ScheduledTasksPage({
  onStartChat,
  onTitleDockedChange,
}: {
  onStartChat: () => void
  onTitleDockedChange: (isDocked: boolean) => void
}) {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false)
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false)
  const [scheduledTitle, setScheduledTitle] = useState('')
  const [scheduledPrompt, setScheduledPrompt] = useState('')
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>(() => scheduledTaskDefaults)
  const [openTaskMenuId, setOpenTaskMenuId] = useState<string | null>(null)
  const [pendingDeleteTask, setPendingDeleteTask] = useState<ScheduledTask | null>(null)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [isTitleDocked, setIsTitleDocked] = useState(false)
  const scheduledPageRef = useRef<HTMLElement | null>(null)
  const createMenuRef = useRef<HTMLDivElement | null>(null)
  const taskMenuRef = useRef<HTMLDivElement | null>(null)
  const createPopoverRef = useRef<HTMLDivElement | null>(null)
  const taskPopoverRef = useRef<HTMLDivElement | null>(null)
  const createPopoverStyle = useFloatingPopoverPlacement(isCreateMenuOpen, createMenuRef, createPopoverRef)
  const taskPopoverStyle = useFloatingPopoverPlacement(
    Boolean(openTaskMenuId),
    taskMenuRef,
    taskPopoverRef,
    [openTaskMenuId],
  )
  const canCreateScheduledTask = scheduledTitle.trim().length > 0 && scheduledPrompt.trim().length > 0
  const enabledScheduledTaskCount = scheduledTasks.filter((task) => task.enabled).length

  const updateTitleDocked = useCallback(() => {
    const scrollTop = scheduledPageRef.current?.scrollTop ?? 0
    const nextDocked = hasReachedTitleDockThreshold(scrollTop)

    onTitleDockedChange(nextDocked)
    setIsTitleDocked((currentDocked) => (currentDocked === nextDocked ? currentDocked : nextDocked))
  }, [onTitleDockedChange])

  const closeManualDialog = () => {
    setIsManualDialogOpen(false)
    setScheduledTitle('')
    setScheduledPrompt('')
    setEditingTaskId(null)
  }

  const createScheduledTask = () => {
    if (!canCreateScheduledTask) {
      return
    }

    if (editingTaskId) {
      setScheduledTasks((tasks) =>
        tasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, title: scheduledTitle.trim(), prompt: scheduledPrompt.trim() }
            : task,
        ),
      )
    } else {
      setScheduledTasks((tasks) => [
        {
          id: `${Date.now()}`,
          title: scheduledTitle.trim(),
          prompt: scheduledPrompt.trim(),
          schedule: '工作日8:00',
          model: '默认模型',
          enabled: false,
        },
        ...tasks,
      ])
    }
    closeManualDialog()
  }

  const openEditDialog = (task: ScheduledTask) => {
    setOpenTaskMenuId(null)
    setEditingTaskId(task.id)
    setScheduledTitle(task.title)
    setScheduledPrompt(task.prompt)
    setIsManualDialogOpen(true)
  }

  const confirmDeleteScheduledTask = () => {
    if (!pendingDeleteTask) {
      return
    }

    setScheduledTasks((tasks) => tasks.filter((task) => task.id !== pendingDeleteTask.id))
    setPendingDeleteTask(null)
  }

  useEffect(() => {
    const openManualCreateDialog = () => {
      setIsCreateMenuOpen(false)
      setEditingTaskId(null)
      setScheduledTitle('')
      setScheduledPrompt('')
      setIsManualDialogOpen(true)
    }

    window.addEventListener('scheduled-manual-create-request', openManualCreateDialog)

    return () => {
      window.removeEventListener('scheduled-manual-create-request', openManualCreateDialog)
    }
  }, [])

  useEffect(() => {
    if (!isCreateMenuOpen) {
      return undefined
    }

    let isDismissReady = false
    const readyTimer = window.setTimeout(() => {
      isDismissReady = true
    }, 0)
    const closeCreateMenu = (event: MouseEvent) => {
      if (!isDismissReady) {
        return
      }
      const target = event.target

      if (!(target instanceof Node) || createMenuRef.current?.contains(target)) {
        return
      }

      setIsCreateMenuOpen(false)
    }

    document.addEventListener('click', closeCreateMenu)

    return () => {
      window.clearTimeout(readyTimer)
      document.removeEventListener('click', closeCreateMenu)
    }
  }, [isCreateMenuOpen])

  useEffect(() => {
    if (!openTaskMenuId) {
      return undefined
    }

    const openedTaskMenuId = openTaskMenuId
    let isDismissReady = false
    const readyTimer = window.setTimeout(() => {
      isDismissReady = true
    }, 0)
    const closeTaskMenu = (event: MouseEvent) => {
      if (!isDismissReady) {
        return
      }
      const target = event.target

      if (!(target instanceof Node) || taskMenuRef.current?.contains(target)) {
        return
      }

      setOpenTaskMenuId((currentId) => (currentId === openedTaskMenuId ? null : currentId))
    }

    document.addEventListener('click', closeTaskMenu)

    return () => {
      window.clearTimeout(readyTimer)
      document.removeEventListener('click', closeTaskMenu)
    }
  }, [openTaskMenuId])

  useEffect(() => () => onTitleDockedChange(false), [onTitleDockedChange])

  return (
    <section
      className={`scheduled-page ${isTitleDocked ? 'title-docked' : ''}`}
      aria-label="定时任务"
      ref={scheduledPageRef}
      onScroll={updateTitleDocked}
    >
      <header className="scheduled-header">
        <div className="skills-shell">
          <div className="scheduled-heading">
            <div className="scheduled-title">
              <h1>定时任务</h1>
              <p>
                {scheduledTasks.length > 0
                  ? `已启用${enabledScheduledTaskCount}个定时任务，共${scheduledTasks.length}个`
                  : '暂无定时任务，可点击右侧按钮创建'}
              </p>
            </div>
            <div className="scheduled-tools" ref={createMenuRef}>
              <button
                className={`scheduled-create-button ${isCreateMenuOpen ? 'active' : ''}`}
                type="button"
                onClick={() => setIsCreateMenuOpen((isOpen) => !isOpen)}
              >
                <span>创建</span>
                <FigmaIcon icon={scheduledChevronDownIcon} />
              </button>
              {isCreateMenuOpen ? (
                <div
                  className="scheduled-create-popover"
                  ref={createPopoverRef}
                  role="menu"
                  aria-label="创建定时任务"
                  style={createPopoverStyle}
                >
                  <button
                    className="scheduled-create-option"
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsCreateMenuOpen(false)
                      onStartChat()
                    }}
                  >
                    <span className="scheduled-create-option-surface">
                      <FigmaIcon icon={scheduledMessageCircleIcon} />
                      <span>通过聊天创建</span>
                    </span>
                  </button>
                  <button
                    className="scheduled-create-option"
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsCreateMenuOpen(false)
                      setEditingTaskId(null)
                      setScheduledTitle('')
                      setScheduledPrompt('')
                      setIsManualDialogOpen(true)
                    }}
                  >
                    <span className="scheduled-create-option-surface">
                      <FigmaIcon icon={scheduledPenIcon} />
                      <span>手动创建</span>
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {scheduledTasks.length > 0 ? (
        <div className="scheduled-list-area">
          <div className="scheduled-list">
            {scheduledTasks.map((task) => (
              <article className="scheduled-task-card" key={task.id}>
                <div className="scheduled-task-copy">
                  <h2>{task.title}</h2>
                  <p>{task.prompt}</p>
                  <div className="scheduled-task-meta">
                    <span>
                      <FigmaIcon icon={scheduledTimerIcon} />
                      {task.schedule}
                    </span>
                    <span>
                      <FigmaIcon icon={scheduledPackageIcon} />
                      {task.model}
                    </span>
                  </div>
                </div>
                <div className="scheduled-task-toolbar">
                  <button type="button" aria-label="运行">
                    <FigmaIcon icon={scheduledPlayIcon} />
                  </button>
                  <div className="scheduled-task-menu-anchor" ref={openTaskMenuId === task.id ? taskMenuRef : null}>
                    <button
                      className={openTaskMenuId === task.id ? 'active' : ''}
                      type="button"
                      aria-label="更多"
                      aria-expanded={openTaskMenuId === task.id}
                      onClick={() => setOpenTaskMenuId((currentId) => (currentId === task.id ? null : task.id))}
                    >
                      <FigmaIcon icon={scheduledEllipsisIcon} />
                    </button>
                    {openTaskMenuId === task.id ? (
                      <div
                        className="scheduled-task-menu"
                        ref={taskPopoverRef}
                        role="menu"
                        aria-label="任务更多操作"
                        style={taskPopoverStyle}
                      >
                        <button type="button" role="menuitem" onClick={() => openEditDialog(task)}>
                          <span>
                            <FigmaIcon icon={scheduledSquarePenIcon} />
                            编辑
                          </span>
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setOpenTaskMenuId(null)
                            setPendingDeleteTask(task)
                          }}
                        >
                          <span>
                            <FigmaIcon icon={scheduledTrashIcon} />
                            删除
                          </span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                <button
                  className={`scheduled-task-switch ${task.enabled ? 'active' : ''}`}
                  type="button"
                  aria-label={task.enabled ? '关闭任务' : '启用任务'}
                  aria-pressed={task.enabled}
                  onClick={() =>
                    setScheduledTasks((tasks) =>
                      tasks.map((currentTask) =>
                        currentTask.id === task.id
                          ? { ...currentTask, enabled: !currentTask.enabled }
                          : currentTask,
                      ),
                    )
                  }
                >
                  <span />
                </button>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="scheduled-empty-area">
          <div className="scheduled-empty-state">
            <FigmaIcon icon={scheduledEmptyAlarmClockCheckIcon} />
            <div className="scheduled-empty-copy">
              <h2>暂无定时任务</h2>
              <p>暂无定时任务，可点击右上方按钮创建</p>
            </div>
          </div>
        </div>
      )}

      {isManualDialogOpen ? (
        <div className="scheduled-manual-overlay modal-fade-layer" role="presentation">
          <section className="scheduled-manual-dialog modal-pop-surface" role="dialog" aria-modal="true" aria-label="创建定时任务">
            <header className="scheduled-manual-heading">
              <input
                aria-label="定时任务标题"
                placeholder="请输入定时任务标题"
                value={scheduledTitle}
                onChange={(event) => setScheduledTitle(event.target.value)}
              />
              <button
                className="scheduled-manual-close"
                type="button"
                aria-label="关闭"
                onClick={closeManualDialog}
              >
                <FigmaIcon icon={scheduledModalXIcon} />
              </button>
            </header>
            <div className="scheduled-manual-content">
              <textarea
                aria-label="定时任务指令"
                placeholder="请输入定时任务指令，例如：设定每日热点简报"
                value={scheduledPrompt}
                onChange={(event) => setScheduledPrompt(event.target.value)}
              />
            </div>
            <footer className="scheduled-manual-actions-wrapper">
              <div className="scheduled-manual-toolbar">
                {[
                  { icon: scheduledLaptopIcon, label: '本地' },
                  { icon: scheduledFolderClosedIcon, label: 'Token官网' },
                  { icon: scheduledTimerIcon, label: '工作日8:00' },
                  { icon: scheduledPackageIcon, label: '默认模型' },
                  { icon: scheduledModalLayoutGridIcon, label: '已设2项' },
                ].map((item) => (
                  <button className="scheduled-manual-pill" type="button" key={item.label}>
                    <FigmaIcon icon={item.icon} />
                    <span>{item.label}</span>
                    <FigmaIcon icon={scheduledModalChevronDownIcon} />
                  </button>
                ))}
              </div>
              <div className="scheduled-manual-actions">
                <button type="button" onClick={closeManualDialog}>
                  取消
                </button>
                <button
                  className={canCreateScheduledTask ? 'ready' : ''}
                  type="button"
                  disabled={!canCreateScheduledTask}
                  onClick={createScheduledTask}
                >
                  {editingTaskId ? '保存' : '创建'}
                </button>
              </div>
            </footer>
          </section>
        </div>
      ) : null}

      {pendingDeleteTask ? (
        <DangerConfirmDialog
          title="确认删除？"
          description="删除后，该任务将无法恢复"
          closeIcon={scheduledDeleteModalXIcon}
          ariaLabel="确认删除"
          onCancel={() => setPendingDeleteTask(null)}
          onConfirm={confirmDeleteScheduledTask}
        />
      ) : null}
    </section>
  )
}

function SettingsPage({
  activeSection,
  language,
  onLogout,
  onLanguageChange,
  onTitleDockedChange,
  onChatDirtyChange,
  isChatLeaveConfirmOpen,
  onResolveChatLeave,
}: {
  activeSection: SettingsSection
  language: '中文' | 'English'
  onLogout: () => void
  onLanguageChange: (language: '中文' | 'English') => void
  onTitleDockedChange: (state: SettingsTitlebarState) => void
  onChatDirtyChange: (isDirty: boolean) => void
  isChatLeaveConfirmOpen: boolean
  onResolveChatLeave: () => void
}) {
  const visibleSection =
    activeSection === 'chat' ||
    activeSection === 'appearance' ||
    activeSection === 'memory' ||
    activeSection === 'gateway' ||
    activeSection === 'api-key' ||
    activeSection === 'archive' ||
    activeSection === 'about' ||
    activeSection === 'account'
      ? activeSection
      : 'model'
  const config = settingsPageConfigs[visibleSection]
  const selectRows = config.selectRows ?? []
  const [openSelectMenu, setOpenSelectMenu] = useState<string | null>(null)
  const [gatewayMode, setGatewayMode] = useState<SettingsGatewayMode>('local')
  const [gatewayRemoteUrl, setGatewayRemoteUrl] = useState('')
  const [gatewayToken, setGatewayToken] = useState('')
  const [isGatewayTesting, setIsGatewayTesting] = useState(false)
  const [isApiKeyMenuOpen, setIsApiKeyMenuOpen] = useState(false)
  const [selectedApiKeyLabel, setSelectedApiKeyLabel] = useState<SettingsApiKeyLabel>(
    settingsApiKeyOptions[0].label,
  )
  const [archivedConversations, setArchivedConversations] = useState<ArchivedConversation[]>(() => [
    ...initialArchivedConversations,
  ])
  const [pendingArchiveDelete, setPendingArchiveDelete] = useState<ArchivedConversation | null>(null)
  const [settingsToast, setSettingsToast] = useState<PlatformToastState | null>(null)
  const [aboutUpdateStatus, setAboutUpdateStatus] = useState<AboutUpdateStatus>('idle')
  const [aboutUpdateProgress, setAboutUpdateProgress] = useState(0)
  const [isAboutUpdateDialogOpen, setIsAboutUpdateDialogOpen] = useState(false)
  const [isAboutUpdateReady, setIsAboutUpdateReady] = useState(false)
  const [activeLegalAgreement, setActiveLegalAgreement] = useState<LegalAgreementType | null>(null)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const [savedChatPersona, setSavedChatPersona] = useState(defaultChatPersona)
  const [savedTimezoneValues, setSavedTimezoneValues] = useState<SettingsTimeValues>(defaultTimezoneValues)
  const [timezoneValues, setTimezoneValues] = useState<SettingsTimeValues>(defaultTimezoneValues)
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(() => ({
    ...settingsModelDefaults,
    助手人格: defaultChatPersona,
    语言: language,
    记忆服务商: '内置',
    上下文引擎: '压缩器',
  }))
  const [segmentValues, setSegmentValues] = useState<Record<string, string>>(() => ({
    主题: '浅色',
  }))
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>(() => {
    const entries = Object.values(settingsPageConfigs)
      .flatMap((page) => page.toggleRows ?? [])
      .map((row) => [row.label, row.enabled] as const)

    return Object.fromEntries(entries)
  })
  const selectMenuRef = useRef<HTMLDivElement | null>(null)
  const apiKeyMenuRef = useRef<HTMLDivElement | null>(null)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const selectPopoverRef = useRef<HTMLDivElement | null>(null)
  const apiKeyPopoverRef = useRef<HTMLDivElement | null>(null)
  const accountPopoverRef = useRef<HTMLDivElement | null>(null)
  const settingsPageRef = useRef<HTMLElement | null>(null)
  const selectPopoverStyle = useFloatingPopoverPlacement(
    Boolean(openSelectMenu),
    selectMenuRef,
    selectPopoverRef,
    [openSelectMenu],
  )
  const apiKeyPopoverStyle = useFloatingPopoverPlacement(isApiKeyMenuOpen, apiKeyMenuRef, apiKeyPopoverRef)
  const accountPopoverStyle = useFloatingPopoverPlacement(isAccountMenuOpen, accountMenuRef, accountPopoverRef)
  const selectedApiKey =
    settingsApiKeyOptions.find((option) => option.label === selectedApiKeyLabel) ??
    settingsApiKeyOptions[0]
  const isGatewayTestEnabled =
    gatewayRemoteUrl.trim().length > 0 && gatewayToken.trim().length > 0
  const isTimezoneDirty = timezoneValues.join(':') !== savedTimezoneValues.join(':')
  const isChatDirty = isTimezoneDirty || (selectedValues.助手人格 ?? defaultChatPersona) !== savedChatPersona
  const closeSettingsToast = useCallback(() => {
    setSettingsToast(null)
  }, [])
  const updateTitleDocked = useCallback(() => {
    const scrollTop = settingsPageRef.current?.scrollTop ?? 0

    onTitleDockedChange({
      isDocked: hasReachedTitleDockThreshold(scrollTop),
      title: config.title,
    })
  }, [config.title, onTitleDockedChange])

  useLayoutEffect(() => {
    const settingsPage = settingsPageRef.current

    if (settingsPage) {
      settingsPage.scrollTop = 0
    }

    onTitleDockedChange({
      isDocked: false,
      title: config.title,
    })
  }, [config.title, onTitleDockedChange, visibleSection])

  useEffect(() => {
    updateTitleDocked()
  }, [updateTitleDocked, visibleSection])

  useEffect(
    () => () => {
      onTitleDockedChange({ isDocked: false, title: '' })
    },
    [onTitleDockedChange],
  )

  useEffect(() => {
    if (!isGatewayTesting) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setIsGatewayTesting(false)
    }, 2000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [isGatewayTesting])

  useEffect(() => {
    if (!openSelectMenu) {
      return undefined
    }

    const openedSelectMenu = openSelectMenu
    let isDismissReady = false
    const readyTimer = window.setTimeout(() => {
      isDismissReady = true
    }, 0)
    const closeSelectMenu = (event: MouseEvent) => {
      if (!isDismissReady) {
        return
      }
      const target = event.target

      if (!(target instanceof Node) || selectMenuRef.current?.contains(target)) {
        return
      }

      setOpenSelectMenu((currentMenu) => (currentMenu === openedSelectMenu ? null : currentMenu))
    }

    document.addEventListener('click', closeSelectMenu)

    return () => {
      window.clearTimeout(readyTimer)
      document.removeEventListener('click', closeSelectMenu)
    }
  }, [openSelectMenu])

  useEffect(() => {
    if (!isApiKeyMenuOpen) {
      return undefined
    }

    let isDismissReady = false
    const readyTimer = window.setTimeout(() => {
      isDismissReady = true
    }, 0)
    const closeApiKeyMenu = (event: MouseEvent) => {
      if (!isDismissReady) {
        return
      }
      const target = event.target

      if (!(target instanceof Node) || apiKeyMenuRef.current?.contains(target)) {
        return
      }

      setIsApiKeyMenuOpen(false)
    }

    document.addEventListener('click', closeApiKeyMenu)

    return () => {
      window.clearTimeout(readyTimer)
      document.removeEventListener('click', closeApiKeyMenu)
    }
  }, [isApiKeyMenuOpen])

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return undefined
    }

    let isDismissReady = false
    const readyTimer = window.setTimeout(() => {
      isDismissReady = true
    }, 0)
    const closeAccountMenu = (event: MouseEvent) => {
      if (!isDismissReady) {
        return
      }
      const target = event.target

      if (!(target instanceof Node) || accountMenuRef.current?.contains(target)) {
        return
      }

      setIsAccountMenuOpen(false)
    }

    document.addEventListener('click', closeAccountMenu)

    return () => {
      window.clearTimeout(readyTimer)
      document.removeEventListener('click', closeAccountMenu)
    }
  }, [isAccountMenuOpen])

  useEffect(() => {
    setOpenSelectMenu(null)
    setIsApiKeyMenuOpen(false)
    setIsAccountMenuOpen(false)
  }, [visibleSection])

  useEffect(() => {
    setSelectedValues((values) => (
      values.语言 === language ? values : { ...values, 语言: language }
    ))
  }, [language])

  useEffect(() => {
    onChatDirtyChange(visibleSection === 'chat' && isChatDirty)
  }, [isChatDirty, onChatDirtyChange, visibleSection])

  useEffect(
    () => () => {
      onChatDirtyChange(false)
    },
    [onChatDirtyChange],
  )

  useEffect(() => {
    if (aboutUpdateStatus !== 'checking') {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setAboutUpdateStatus('available')
      setIsAboutUpdateDialogOpen(true)
    }, 2000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [aboutUpdateStatus])

  useEffect(() => {
    if (aboutUpdateStatus !== 'downloading') {
      return undefined
    }

    const downloadStartedAt = window.performance.now()
    setAboutUpdateProgress(0)

    const timer = window.setInterval(() => {
      const elapsed = window.performance.now() - downloadStartedAt
      const nextProgress = Math.min(100, (elapsed / 10000) * 100)

      setAboutUpdateProgress(nextProgress)

      if (nextProgress >= 100) {
        window.clearInterval(timer)
        setAboutUpdateProgress(100)
        setAboutUpdateStatus('completed')
      }
    }, 100)

    return () => {
      window.clearInterval(timer)
    }
  }, [aboutUpdateStatus])

  const toggleSelectMenu = (label: string) => {
    setOpenSelectMenu((currentLabel) => (currentLabel === label ? null : label))
  }

  const normalizeTimePart = (value: string, index: number) => {
    const digits = value.replace(/\D/g, '').slice(0, 2)

    if (!digits) {
      return ''
    }

    const maxValue = index === 0 ? 23 : 59
    const numericValue = Math.min(Number(digits), maxValue)

    return String(numericValue).padStart(digits.length === 1 ? 1 : 2, '0')
  }

  const commitTimePart = (index: number) => {
    setTimezoneValues((values) => {
      const nextValues = [...values] as SettingsTimeValues
      const fallbackValue = savedTimezoneValues[index] ?? '00'
      const normalizedValue = normalizeTimePart(nextValues[index] || fallbackValue, index)

      nextValues[index] = (normalizedValue || '00').padStart(2, '0')

      return nextValues
    })
  }

  const updateTimePart = (index: number, value: string) => {
    setTimezoneValues((values) => {
      const nextValues = [...values] as SettingsTimeValues
      nextValues[index] = normalizeTimePart(value, index)

      return nextValues
    })
  }

  const saveTimezoneValues = () => {
    const nextValues = timezoneValues.map((value, index) =>
      (normalizeTimePart(value, index) || '00').padStart(2, '0'),
    ) as SettingsTimeValues

    setTimezoneValues(nextValues)
    setSavedTimezoneValues(nextValues)
    setSavedChatPersona(selectedValues.助手人格 ?? defaultChatPersona)
    setSettingsToast({
      tone: 'success',
      message: '保存成功',
      id: Date.now(),
    })
  }

  const resetTimezoneValues = () => {
    setTimezoneValues(defaultTimezoneValues)
    setSelectedValues((values) => ({
      ...values,
      助手人格: defaultChatPersona,
    }))
    setSettingsToast({
      tone: 'success',
      message: '重置成功',
      id: Date.now(),
    })
  }

  const discardChatChanges = () => {
    setTimezoneValues(savedTimezoneValues)
    setSelectedValues((values) => ({
      ...values,
      助手人格: savedChatPersona,
    }))
  }

  const renderSelectRow = (row: SettingsSelectRow) => {
    const selectedValue = selectedValues[row.label] ?? row.options[0]
    const isMuted = row.mutedValue !== undefined && selectedValue === row.mutedValue
    const isOpen = openSelectMenu === row.label

    return (
      <div className="settings-row" key={row.label}>
        <span>{row.label}</span>
        <div
          className="settings-select-picker"
          ref={isOpen ? selectMenuRef : null}
        >
          <button
            className={[isOpen ? 'active' : '', visibleSection === 'model' ? '' : 'pill']
              .filter(Boolean)
              .join(' ')}
            type="button"
            aria-expanded={isOpen}
            onClick={() => toggleSelectMenu(row.label)}
          >
            <span className={isMuted ? 'muted' : ''}>{selectedValue}</span>
            <FigmaIcon icon={settingsChevronDownIcon} />
          </button>
          {isOpen ? (
            <div
              className="settings-select-menu"
              ref={selectPopoverRef}
              role="menu"
              aria-label={`${row.label}选择`}
              data-translation-skip={row.label === '语言' ? 'true' : undefined}
              style={selectPopoverStyle}
            >
              {row.options.map((option) => (
                <button
                  className="settings-select-option"
                  type="button"
                  role="menuitemradio"
                  aria-checked={selectedValue === option}
                  key={option}
                  onClick={() => {
                    setSelectedValues((values) => ({ ...values, [row.label]: option }))
                    if (row.label === '语言' && (option === '中文' || option === 'English')) {
                      onLanguageChange(option)
                    }
                    setOpenSelectMenu(null)
                  }}
                >
                  <span>
                    <span>{option}</span>
                    {selectedValue === option ? <FigmaIcon icon={settingsCheckIcon} /> : null}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  const renderToggleRow = (row: SettingsToggleRow) => (
    <div className="settings-row" key={row.label}>
      <span>{row.label}</span>
      <button
        className={`settings-switch ${toggleValues[row.label] ? 'active' : ''}`}
        type="button"
        aria-pressed={toggleValues[row.label]}
        onClick={() =>
          setToggleValues((values) => ({
            ...values,
            [row.label]: !values[row.label],
          }))
        }
      >
        <span />
      </button>
    </div>
  )

  const selectGatewayMode = (mode: SettingsGatewayMode) => {
    setGatewayMode(mode)
    setIsGatewayTesting(false)

    if (mode === 'remote') {
      setGatewayRemoteUrl('')
      setGatewayToken('')
    }
  }

  const startGatewayTest = () => {
    if (!isGatewayTestEnabled || isGatewayTesting) {
      return
    }

    setIsGatewayTesting(true)
  }

  const validateGatewayRemoteFields = () => {
    const hasRemoteUrl = gatewayRemoteUrl.trim().length > 0
    const hasGatewayToken = gatewayToken.trim().length > 0

    if (!hasRemoteUrl && !hasGatewayToken) {
      setSettingsToast({
        tone: 'error',
        message: '还未填写远程URL和会话令牌。',
        id: Date.now(),
      })
      return false
    }

    if (!hasRemoteUrl) {
      setSettingsToast({
        tone: 'error',
        message: '还未输入远程URL',
        id: Date.now(),
      })
      return false
    }

    if (!hasGatewayToken) {
      setSettingsToast({
        tone: 'error',
        message: '还未输入会话令牌',
        id: Date.now(),
      })
      return false
    }

    return true
  }

  const renderGatewayContent = () => (
    <div className="settings-gateway">
      <div className="settings-gateway-card-row">
        {settingsGatewayCards.map((card) => {
          const isSelected = gatewayMode === card.id

          return (
            <button
              className={`settings-gateway-card ${isSelected ? 'selected' : ''}`}
              type="button"
              aria-pressed={isSelected}
              key={card.id}
              onClick={() => selectGatewayMode(card.id)}
            >
              <span className="settings-gateway-card-icon">
                <FigmaIcon icon={card.icon} />
              </span>
              <span className="settings-gateway-card-copy">
                <span className="settings-gateway-card-title">
                  <strong>{card.label}</strong>
                  {card.id === 'local' ? (
                    <span className="settings-gateway-status-badge">
                      <span aria-hidden="true" />
                      <span>在线</span>
                    </span>
                  ) : null}
                </span>
                <small>{card.description}</small>
              </span>
              <span className={`settings-gateway-radio ${isSelected ? 'selected' : ''}`} />
            </button>
          )
        })}
      </div>

      {gatewayMode === 'remote' ? (
        <div className="settings-gateway-fields">
          <div className="settings-gateway-field-row">
            <span>
              <strong>远程URL</strong>
              <small>远程仪表盘后端的基础 URL，支持路径前缀(如/hermes)</small>
            </span>
            <input
              value={gatewayRemoteUrl}
              placeholder="https://gateway.example.com"
              onChange={(event) => setGatewayRemoteUrl(event.target.value)}
            />
          </div>
          <div className="settings-gateway-field-row">
            <span>
              <strong>会话令牌</strong>
              <small>用于REST和WebSocket访问的仪表盘会话令牌。留空可保留已保存的令牌。</small>
            </span>
            <input
              value={gatewayToken}
              placeholder="粘贴会话令牌"
              onChange={(event) => setGatewayToken(event.target.value)}
            />
          </div>
        </div>
      ) : null}
    </div>
  )

  const renderApiKeyContent = () => (
    <div className="settings-api-key">
      <div className="settings-api-key-row">
        <span>模型厂商</span>
        <span className="settings-api-key-static">词元工场</span>
      </div>
      <div className="settings-api-key-row">
        <span>API端点</span>
        <span className="settings-api-key-static">https:// api.agentsyun.com/relay/v1</span>
      </div>
      <div className="settings-api-key-row settings-api-key-row-expanded">
        <span className="settings-api-key-summary">
          <span>
            <span>AGENTSYUN_API_KEY：</span>
            <span>{selectedApiKey.key}</span>
          </span>
          <small>
            <span>当前 Key 来自词元工场</span>
            <a href="#" onClick={(event) => event.preventDefault()}>
              去词元工场管理 Key &gt;
            </a>
          </small>
        </span>
        <span className="settings-api-key-select" ref={apiKeyMenuRef}>
          <button
            className={isApiKeyMenuOpen ? 'active' : ''}
            type="button"
            aria-expanded={isApiKeyMenuOpen}
            onClick={() => setIsApiKeyMenuOpen((isOpen) => !isOpen)}
          >
            <span>{selectedApiKey.label}</span>
            <FigmaIcon icon={settingsChevronDownIcon} />
          </button>
          {isApiKeyMenuOpen ? (
            <div
              className="settings-api-key-menu"
              ref={apiKeyPopoverRef}
              role="menu"
              aria-label="API Key 选择"
              style={apiKeyPopoverStyle}
            >
              {settingsApiKeyOptions.map((option) => {
                const isSelected = option.label === selectedApiKey.label

                return (
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    key={option.label}
                    onClick={() => {
                      setSelectedApiKeyLabel(option.label)
                      setIsApiKeyMenuOpen(false)
                    }}
                  >
                    <span className="settings-api-key-menu-item-inner">
                      <span>
                        <strong>{option.label}</strong>
                        <small>{option.key}</small>
                      </span>
                      {isSelected ? <FigmaIcon icon={settingsCheckIcon} /> : null}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : null}
        </span>
      </div>
    </div>
  )

  const restoreArchivedConversation = (conversationId: string) => {
    setArchivedConversations((conversations) =>
      conversations.filter((conversation) => conversation.id !== conversationId),
    )
    setSettingsToast({
      tone: 'success',
      message: '对话已取消归档',
      actionLabel: '查看',
      onAction: () => setSettingsToast(null),
      id: Date.now(),
    })
  }

  const confirmArchiveDelete = () => {
    if (!pendingArchiveDelete) {
      return
    }

    setArchivedConversations((conversations) =>
      conversations.filter((conversation) => conversation.id !== pendingArchiveDelete.id),
    )
    setPendingArchiveDelete(null)
  }

  const startAboutUpdateCheck = () => {
    if (aboutUpdateStatus === 'checking') {
      return
    }

    if (aboutUpdateStatus === 'downloading' || aboutUpdateStatus === 'completed') {
      setIsAboutUpdateDialogOpen(true)
      return
    }

    setAboutUpdateProgress(0)
    setIsAboutUpdateDialogOpen(false)
    setAboutUpdateStatus('checking')
  }

  const startAboutUpdateDownload = () => {
    setAboutUpdateProgress(0)
    setAboutUpdateStatus('downloading')
    setIsAboutUpdateDialogOpen(true)
  }

  const closeAboutUpdateDialog = () => {
    setIsAboutUpdateDialogOpen(false)
  }

  const finishAboutUpdateDialog = () => {
    setIsAboutUpdateDialogOpen(false)
  }

  const closeCompletedAboutUpdateDialog = () => {
    setIsAboutUpdateReady(true)
    setIsAboutUpdateDialogOpen(false)
  }

  const renderArchiveContent = () => (
    <div className="settings-archive">
      {archivedConversations.length > 0 ? (
        <div className="settings-archive-list">
          {archivedConversations.map((conversation) => (
            <article className="settings-archive-row" key={conversation.id}>
              <div className="settings-archive-copy">
                <strong>{conversation.title}</strong>
                <small>{conversation.meta}</small>
              </div>
              <button
                className="settings-archive-trash"
                type="button"
                aria-label={`删除${conversation.title}`}
                onClick={() => setPendingArchiveDelete(conversation)}
              >
                <FigmaIcon icon={settingsArchiveTrashIcon} />
              </button>
              <button
                className="settings-archive-restore"
                type="button"
                onClick={() => restoreArchivedConversation(conversation.id)}
              >
                取消归档
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="settings-archive-empty">
          <FigmaIcon icon={settingsArchiveEmptyIcon} />
          <span>
            <strong>没有归档对话</strong>
            <small>在侧栏对话上点击[...]，即可归档</small>
          </span>
        </div>
      )}
    </div>
  )

  const isAboutUpdateButtonLoading =
    aboutUpdateStatus === 'checking' || aboutUpdateStatus === 'downloading'
  const isAboutUpdateButtonReady = isAboutUpdateReady && !isAboutUpdateButtonLoading
  const aboutUpdateButtonLabel =
    aboutUpdateStatus === 'downloading'
      ? '更新中'
      : isAboutUpdateButtonReady
        ? '立即更新'
        : '检查更新'

  const renderAboutContent = () => (
    <div className="settings-about">
      <div className="settings-about-version">
        <div className="settings-about-product">
          <span className="settings-about-logo">
            <FigmaIcon icon={settingsHermesLogoIcon} />
          </span>
          <span className="settings-about-version-copy">
            <strong>版本信息</strong>
            {isAboutUpdateReady ? (
              <small className="settings-about-version-inline">
                <span>v1.0</span>
                <span>可更新v1.1</span>
              </small>
            ) : (
              <small>v1.0</small>
            )}
          </span>
        </div>
        <button
          className={`settings-about-update ${isAboutUpdateButtonLoading ? 'loading' : ''} ${
            isAboutUpdateButtonReady ? 'ready' : ''
          }`}
          type="button"
          disabled={aboutUpdateStatus === 'checking'}
          onClick={startAboutUpdateCheck}
        >
          {isAboutUpdateButtonLoading ? <FigmaIcon icon={settingsLoaderCircleIcon} /> : null}
          {aboutUpdateButtonLabel}
        </button>
      </div>

      {[
        { label: '用户协议', type: 'user' },
        { label: '隐私协议', type: 'privacy' },
      ].map((item) => (
        <button
          className="settings-about-link-row"
          type="button"
          key={item.type}
          onClick={() => setActiveLegalAgreement(item.type as LegalAgreementType)}
        >
          <span>{item.label}</span>
          <span className="settings-about-link-icon">
            <FigmaIcon icon={settingsChevronRightIcon} />
          </span>
        </button>
      ))}
    </div>
  )

  const renderAccountContent = () => (
    <div className="settings-account">
      <div className="settings-account-row">
        <div className="settings-account-profile">
          <span className="settings-account-avatar">
            <FigmaIcon icon={settingsAccountUserIcon} />
          </span>
          <span className="settings-account-copy">
            <strong>user_9212_1fa73f</strong>
            <small>131****0002</small>
          </span>
        </div>
        <div className="settings-account-menu-anchor" ref={accountMenuRef}>
          <button
            className={`settings-account-manage ${isAccountMenuOpen ? 'active' : ''}`}
            type="button"
            aria-expanded={isAccountMenuOpen}
            onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
          >
            <span>管理账号</span>
            <FigmaIcon icon={settingsChevronDownIcon} />
          </button>
          {isAccountMenuOpen ? (
            <div
              className="settings-account-menu"
              ref={accountPopoverRef}
              role="menu"
              aria-label="管理账号"
              style={accountPopoverStyle}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => setIsAccountMenuOpen(false)}
              >
                <FigmaIcon icon={settingsAccountArrowRightLeftIcon} />
                <span>切换账号</span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsAccountMenuOpen(false)
                  setIsLogoutConfirmOpen(true)
                }}
              >
                <FigmaIcon icon={settingsAccountExitIcon} />
                <span>退出账号</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )

  return (
    <section
      className="settings-page"
      aria-label="设置"
      ref={settingsPageRef}
      onScroll={updateTitleDocked}
    >
      <header className="settings-header">
        <div className="settings-shell">
          <div className="settings-heading">
            <h1>{config.title}</h1>
            <p>{config.description}</p>
          </div>
        </div>
      </header>

      <div className="settings-content">
        <div className="settings-shell">
          <div className="settings-list">
            {visibleSection === 'gateway' ? renderGatewayContent() : null}
            {visibleSection === 'api-key' ? renderApiKeyContent() : null}
            {visibleSection === 'archive' ? renderArchiveContent() : null}
            {visibleSection === 'about' ? renderAboutContent() : null}
            {visibleSection === 'account' ? renderAccountContent() : null}

            {visibleSection !== 'gateway' &&
            visibleSection !== 'api-key' &&
            visibleSection !== 'archive' &&
            visibleSection !== 'about' &&
            visibleSection !== 'account' ? (
              <>
            {visibleSection === 'memory' ? config.toggleRows?.map(renderToggleRow) : null}

            {selectRows.map(renderSelectRow)}

            {config.timeRows?.map((row) => (
              <div className="settings-row settings-row-with-copy" key={row.label}>
                <span>
                  <span>{row.label}</span>
                  <small>{row.description}</small>
                </span>
                <div className="settings-time-fields" aria-label={row.label}>
                  {(row.label === '时区' ? timezoneValues : row.values).map((value, index) => (
                    <Fragment key={`${row.label}-${index}`}>
                      {index > 0 ? <span className="settings-time-separator">:</span> : null}
                      <input
                        aria-label={`${row.label}${index + 1}`}
                        inputMode="numeric"
                        maxLength={2}
                        value={value}
                        onBlur={() => {
                          if (row.label === '时区') {
                            commitTimePart(index)
                          }
                        }}
                        onChange={(event) => {
                          if (row.label === '时区') {
                            updateTimePart(index, event.currentTarget.value)
                          }
                        }}
                      />
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}

            {config.segmentRows?.map((row) => (
              <div className="settings-row" key={row.label}>
                <span>{row.label}</span>
                <div className="settings-segment-group" aria-label={row.label}>
                  {row.options.map((option) => {
                    const isSelected = (segmentValues[row.label] ?? row.selected) === option.label

                    return (
                      <button
                        className={isSelected ? 'active' : ''}
                        type="button"
                        key={option.label}
                        onClick={() =>
                          setSegmentValues((values) => ({
                            ...values,
                            [row.label]: option.label,
                          }))
                        }
                      >
                        <span>{option.label}</span>
                        <FigmaIcon icon={option.icon} />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {visibleSection !== 'memory' ? config.toggleRows?.map(renderToggleRow) : null}

            {selectRows.length === 0 &&
            !config.toggleRows?.length &&
            !config.timeRows?.length &&
            !config.segmentRows?.length ? (
              <div className="settings-row">
                <span>{config.title}</span>
                <span>暂未开放</span>
              </div>
            ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>

      {visibleSection === 'gateway' && gatewayMode === 'remote' ? (
        <footer className="settings-actions settings-gateway-actions">
          <div className="settings-shell">
            <div className="settings-action-buttons">
              <button
                className={isGatewayTesting ? 'loading' : ''}
                type="button"
                disabled={!isGatewayTestEnabled || isGatewayTesting}
                onClick={startGatewayTest}
              >
                {isGatewayTesting ? <FigmaIcon icon={settingsLoaderCircleIcon} /> : null}
                测试
              </button>
              <button type="button" onClick={validateGatewayRemoteFields}>
                保存下次重启
              </button>
              <button type="button" onClick={validateGatewayRemoteFields}>
                保存并重连
              </button>
            </div>
          </div>
        </footer>
      ) : config.actions ? (
        <footer className="settings-actions">
          <div className="settings-shell">
            <div className="settings-action-buttons">
              <button type="button" onClick={visibleSection === 'chat' ? resetTimezoneValues : undefined}>
                重置
              </button>
              <button type="button" onClick={visibleSection === 'chat' ? saveTimezoneValues : undefined}>
                保存
              </button>
            </div>
          </div>
        </footer>
      ) : null}

      {pendingArchiveDelete ? (
        <DangerConfirmDialog
          title="删除已归档对话？"
          description="这将永久删除已归档对话并不可恢复。"
          closeIcon={settingsArchiveDeleteXIcon}
          ariaLabel="删除已归档对话"
          onCancel={() => setPendingArchiveDelete(null)}
          onConfirm={confirmArchiveDelete}
        />
      ) : null}

      {isLogoutConfirmOpen ? (
        <DangerConfirmDialog
          title="退出登录？"
          description="退出后仍可继续使用 HZ-HERMES，充值额度时需要重新登录词元工场。"
          closeIcon={settingsArchiveDeleteXIcon}
          ariaLabel="退出登录"
          onCancel={() => setIsLogoutConfirmOpen(false)}
          onConfirm={() => {
            setIsLogoutConfirmOpen(false)
            onLogout()
          }}
        />
      ) : null}

      {isChatLeaveConfirmOpen ? (
        <DangerConfirmDialog
          title="有未保存内容！"
          description="聊天设置已做修改但未保存。"
          closeIcon={settingsArchiveDeleteXIcon}
          cancelLabel="不保存"
          confirmLabel="保存"
          confirmTone="primary"
          ariaLabel="聊天设置未保存"
          onCancel={() => {
            discardChatChanges()
            onResolveChatLeave()
          }}
          onConfirm={() => {
            saveTimezoneValues()
            onResolveChatLeave()
          }}
        />
      ) : null}

      <AppToast toast={settingsToast} onClose={closeSettingsToast} />

      {isAboutUpdateDialogOpen ? (
        aboutUpdateStatus === 'downloading' ? (
          <DangerConfirmDialog
            title="检查更新"
            description={
              <div className="settings-about-download-dialog-content">
                <strong>正在下载</strong>
                <span className="settings-about-update-progress" aria-hidden="true">
                  <span style={{ width: `${aboutUpdateProgress}%` }} />
                </span>
                <small>关闭当前窗口不会中断下载，会继续保持后台更新。</small>
              </div>
            }
            closeIcon={settingsArchiveDeleteXIcon}
            hideCancel
            confirmLabel="后台更新"
            confirmTone="primary"
            ariaLabel="正在下载"
            onCancel={closeAboutUpdateDialog}
            onConfirm={closeAboutUpdateDialog}
          />
        ) : aboutUpdateStatus === 'completed' ? (
          <DangerConfirmDialog
            title="检查更新"
            description={
              <div className="settings-about-download-dialog-content completed">
                <strong>下载完成</strong>
                <span className="settings-about-update-progress" aria-hidden="true">
                  <span style={{ width: '100%' }} />
                </span>
                <small>v1.1 已下载完成，重启应用即可使用新版本。</small>
              </div>
            }
            closeIcon={settingsArchiveDeleteXIcon}
            cancelLabel="稍后重启"
            confirmLabel="重启更新"
            confirmTone="primary"
            ariaLabel="下载完成"
            onCancel={closeCompletedAboutUpdateDialog}
            onConfirm={finishAboutUpdateDialog}
          />
        ) : (
          <DangerConfirmDialog
            title="检查更新"
            description={
              <div className="settings-about-update-dialog-content">
                <span className="settings-about-logo">
                  <FigmaIcon icon={settingsHermesLogoIcon} />
                </span>
                <span className="settings-about-update-dialog-copy">
                  <strong>有新版本可升级</strong>
                  <small>最新版本v1.1</small>
                </span>
              </div>
            }
            closeIcon={settingsArchiveDeleteXIcon}
            cancelLabel="取消"
            confirmLabel="立即升级"
            confirmTone="primary"
            ariaLabel="检查更新"
            onCancel={() => setIsAboutUpdateDialogOpen(false)}
            onConfirm={startAboutUpdateDownload}
          />
        )
      ) : null}

      {activeLegalAgreement ? (
        <LegalAgreementDialog
          title={activeLegalAgreement === 'user' ? '用户协议' : '隐私协议'}
          content={activeLegalAgreement === 'user' ? userAgreementText : privacyAgreementText}
          closeIcon={settingsArchiveDeleteXIcon}
          onClose={() => setActiveLegalAgreement(null)}
        />
      ) : null}
    </section>
  )
}

function FileLibraryPage({
  onTitlebarChange,
}: {
  onTitlebarChange: (state: PlatformTitlebarState) => void
}) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchValue, setSearchValue] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [files, setFiles] = useState<FileLibraryItem[]>(() => fileLibraryMockFiles)
  const [openMenuFileId, setOpenMenuFileId] = useState<string | null>(null)
  const [pendingDeleteFile, setPendingDeleteFile] = useState<FileLibraryItem | null>(null)
  const [isFileNavScrolled, setIsFileNavScrolled] = useState(false)
  const [isFileMainScrolled, setIsFileMainScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuPopoverRef = useRef<HTMLDivElement | null>(null)
  const fileMainRef = useRef<HTMLElement | null>(null)
  const fileReserveRef = useRef<HTMLDivElement | null>(null)
  const menuPopoverStyle = useFloatingPopoverPlacement(
    Boolean(openMenuFileId),
    menuRef,
    menuPopoverRef,
    [openMenuFileId],
  )
  const pendingFileAnchorRef = useRef<number | null>(null)

  const handleFileNavScroll = useCallback<UIEventHandler<HTMLElement>>((event) => {
    setIsFileNavScrolled(event.currentTarget.scrollTop > 0)
  }, [])

  useEffect(() => {
    if (!openMenuFileId) {
      return undefined
    }

    const openedMenuFileId = openMenuFileId
    let isDismissReady = false
    const readyTimer = window.setTimeout(() => {
      isDismissReady = true
    }, 0)
    const closeMenu = (event: MouseEvent) => {
      if (!isDismissReady) {
        return
      }
      const target = event.target

      if (!(target instanceof Node) || menuRef.current?.contains(target)) {
        return
      }

      setOpenMenuFileId((currentId) => (currentId === openedMenuFileId ? null : currentId))
    }

    document.addEventListener('click', closeMenu)

    return () => {
      window.clearTimeout(readyTimer)
      document.removeEventListener('click', closeMenu)
    }
  }, [openMenuFileId])

  const pageSearchQuery = searchValue.trim().toLowerCase()
  const activeCategoryItem =
    fileLibraryCategories.find((category) => category.id === activeCategory) ?? fileLibraryCategories[0]
  const activeCategoryFiles = files.filter(
    (file) => activeCategory === 'all' || file.category === activeCategory,
  )
  const visibleFiles = activeCategoryFiles.filter((file) =>
    file.name.toLowerCase().includes(pageSearchQuery),
  )
  const categoryCounts = files.reduce<Record<string, number>>(
    (counts, file) => ({ ...counts, [file.category]: (counts[file.category] ?? 0) + 1 }),
    {},
  )
  const hasSearchQuery = pageSearchQuery.length > 0
  const isEmpty = activeCategoryFiles.length === 0
  const isSearchEmpty = !isEmpty && hasSearchQuery && visibleFiles.length === 0
  const shouldKeepFileDocked = isFileMainScrolled

  const handleFileMainScroll = useCallback<UIEventHandler<HTMLElement>>((event) => {
    setIsFileMainScrolled(event.currentTarget.scrollTop >= 28)
  }, [])

  const deleteFile = useCallback((fileId: string) => {
    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== fileId))
    setOpenMenuFileId(null)
    setPendingDeleteFile(null)
  }, [])

  const openDeleteDialog = useCallback((file: FileLibraryItem) => {
    setOpenMenuFileId(null)
    setPendingDeleteFile(file)
  }, [])

  const prepareFileResultsChange = useCallback(() => {
    const page = fileMainRef.current
    const reserve = fileReserveRef.current

    if (!page || !reserve) {
      return
    }

    const anchor = Math.min(page.scrollTop, 28)
    reserve.style.height = `${page.clientHeight + page.scrollTop}px`
    page.scrollTop = anchor
    pendingFileAnchorRef.current = anchor
    setIsFileMainScrolled(anchor >= 28)
  }, [])

  const updateFileLibrarySearch = useCallback(
    (nextValue: string) => {
      prepareFileResultsChange()
      setSearchValue(nextValue)
    },
    [prepareFileResultsChange],
  )

  const clearFileLibrarySearch = () => updateFileLibrarySearch('')
  const updateFileLibraryViewMode = (nextMode: 'list' | 'grid') => {
    prepareFileResultsChange()
    setViewMode(nextMode)
  }

  const updateFileLibraryCategory = (nextCategory: string) => {
    if (nextCategory === activeCategory) {
      return
    }

    prepareFileResultsChange()
    setActiveCategory(nextCategory)
  }

  const renderFileLibraryControls = () => {
    const hasControlSearchQuery = searchValue.trim().length > 0

    return (
      <div
        className="file-library-actions"
        onPointerDown={(event) => event.stopPropagation()}
        onDoubleClick={(event) => event.stopPropagation()}
      >
        <label className="file-library-search">
          <FigmaIcon icon={fileLibrarySearchIcon} />
          <input
            value={searchValue}
            placeholder="搜索文件名"
            onChange={(event) => updateFileLibrarySearch(event.currentTarget.value)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
          />
          {hasControlSearchQuery ? (
            <button
              className="file-library-search-clear"
              type="button"
              aria-label="清空搜索"
              onClick={clearFileLibrarySearch}
            >
              <FigmaIcon icon={xIcon} />
            </button>
          ) : null}
        </label>
        <div className="file-library-view-tools" aria-label="文件视图">
          <button
            className={`file-library-view-button ${viewMode === 'list' ? 'active' : ''}`}
            type="button"
            aria-label="列表视图"
            onClick={() => updateFileLibraryViewMode('list')}
          >
            <FigmaIcon icon={fileLibraryLayoutListIcon} />
          </button>
          <button
            className={`file-library-view-button ${viewMode === 'grid' ? 'active' : ''}`}
            type="button"
            aria-label="网格视图"
            onClick={() => updateFileLibraryViewMode('grid')}
          >
            <FigmaIcon icon={fileLibraryLayoutGridIcon} />
          </button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    onTitlebarChange({
      isDocked: isFileNavScrolled || shouldKeepFileDocked,
      isListDocked: isFileNavScrolled,
      isDetailDocked: shouldKeepFileDocked,
      title: activeCategoryItem.id === 'all' ? '全部文件' : activeCategoryItem.label,
      icon: '',
      isEnabled: false,
      actions: undefined,
    })
  }, [activeCategoryItem, isFileNavScrolled, onTitlebarChange, shouldKeepFileDocked])

  useLayoutEffect(() => {
    const page = fileMainRef.current
    const reserve = fileReserveRef.current
    const anchor = pendingFileAnchorRef.current

    if (!page || !reserve || anchor === null) {
      return
    }

    const requiredBottom = anchor + page.clientHeight
    const contentBottom = reserve.offsetTop
    reserve.style.height = `${Math.max(0, requiredBottom - contentBottom)}px`
    page.scrollTop = anchor
    pendingFileAnchorRef.current = null
    setIsFileMainScrolled(anchor >= 28)
  }, [activeCategory, searchValue, visibleFiles.length, viewMode])

  useEffect(
    () => () => {
      onTitlebarChange({
        isDocked: false,
        isListDocked: false,
        isDetailDocked: false,
        title: '全部文件',
        icon: '',
        isEnabled: false,
        actions: undefined,
      })
    },
    [onTitlebarChange],
  )

  const renderFileActions = (file: FileLibraryItem) => (
    <>
      <button className="file-library-icon-button" type="button" aria-label={`下载${file.name}`}>
        <FigmaIcon icon={fileLibraryDownloadIcon} />
      </button>
      <div className="file-library-more-wrap" ref={openMenuFileId === file.id ? menuRef : null}>
        <button
          className={`file-library-icon-button ${openMenuFileId === file.id ? 'active' : ''}`}
          type="button"
          aria-label={`${file.name}更多操作`}
          onClick={() => setOpenMenuFileId((currentId) => (currentId === file.id ? null : file.id))}
        >
          <FigmaIcon icon={fileLibraryEllipsisIcon} />
        </button>
        {openMenuFileId === file.id ? (
          <div
            className="file-library-menu"
            ref={menuPopoverRef}
            role="menu"
            aria-label={`${file.name}操作`}
            style={menuPopoverStyle}
          >
            <button className="file-library-menu-item" type="button" role="menuitem">
              <span className="file-library-menu-surface">
                <FigmaIcon icon={fileLibraryFolderMinusIcon} />
                <span>打开文件</span>
              </span>
            </button>
            <button className="file-library-menu-item" type="button" role="menuitem">
              <span className="file-library-menu-surface">
                <FigmaIcon icon={fileLibraryMenuFolderOpenIcon} />
                <span>打开文件位置</span>
              </span>
            </button>
            <div className="file-library-menu-divider" aria-hidden="true" />
            <button
              className="file-library-menu-item"
              type="button"
              role="menuitem"
              onClick={() => openDeleteDialog(file)}
            >
              <span className="file-library-menu-surface">
                <FigmaIcon icon={fileLibraryTrashIcon} />
                <span>删除</span>
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </>
  )

  const renderFileCollection = (
    collectionFiles: FileLibraryItem[],
    isCollectionEmpty: boolean,
    isCollectionSearchEmpty: boolean,
  ) => {
    if (isCollectionEmpty || isCollectionSearchEmpty) {
      return (
        <div className="file-library-empty-area">
          <div className="file-library-empty-state">
            <FigmaIcon
              icon={
                isCollectionSearchEmpty
                  ? fileLibraryFolderSearchIcon
                  : fileLibraryEmptyFolderOpenIcon
              }
            />
            <div className="file-library-empty-copy">
              <h2>暂无文件</h2>
              <p>
                {isCollectionSearchEmpty
                  ? '更换关键词再试试'
                  : '当会话生成图片或文件输出时，会显示在这里。'}
              </p>
            </div>
          </div>
        </div>
      )
    }

    if (viewMode === 'grid') {
      return (
        <div className="file-library-card-grid" aria-label="文件卡片">
          {collectionFiles.map((file) => (
            <article key={file.id} className="file-library-card">
              <FigmaIcon icon={file.icon} />
              <div className="file-library-card-copy">
                <div className="file-library-card-name">{file.name}</div>
                <div className="file-library-card-meta">
                  {file.size} | {file.updatedAt}
                </div>
              </div>
              <div className="file-library-card-actions">{renderFileActions(file)}</div>
            </article>
          ))}
        </div>
      )
    }

    return (
      <div className="file-library-list" aria-label="文件列表">
        {collectionFiles.map((file) => (
          <article key={file.id} className="file-library-row">
            <FigmaIcon icon={file.icon} />
            <div className="file-library-file-name">{file.name}</div>
            <div className="file-library-row-toolbar">
              <div className="file-library-row-meta">
                <span>{file.size}</span>
                <span>{file.updatedAt}</span>
              </div>
              <div className="file-library-row-actions">{renderFileActions(file)}</div>
            </div>
          </article>
        ))}
      </div>
    )
  }

  return (
    <section className="file-library-page" aria-label="文件库">
      <aside className="file-library-side" aria-label="文件类型">
        <nav className="file-library-category-list" onScroll={handleFileNavScroll}>
          {fileLibraryCategories.map((category) => (
            <button
              key={category.id}
              className={`file-library-category ${activeCategory === category.id ? 'active' : ''}`}
              type="button"
              onClick={() => updateFileLibraryCategory(category.id)}
            >
                <span className="file-library-category-surface">
                  <FigmaIcon icon={category.icon} />
                  <span className="file-library-category-label">{category.label}</span>
                <span className="file-library-category-count">
                  {category.id === 'all' ? files.length : (categoryCounts[category.id] ?? 0)}
                </span>
                </span>
              </button>
            ))}
        </nav>
      </aside>

      <section
        className={`file-library-main ${shouldKeepFileDocked ? 'toolbar-docked' : ''} ${
          hasSearchQuery ? 'searching' : ''
        }`}
        ref={fileMainRef}
        onScroll={handleFileMainScroll}
      >
        <header className="file-library-header">
          <div className="file-library-heading">
            <h1>{activeCategoryItem.id === 'all' ? '全部文件' : activeCategoryItem.label}</h1>
          </div>
        </header>
        <div className="file-library-toolbar">{renderFileLibraryControls()}</div>

        {renderFileCollection(visibleFiles, isEmpty, isSearchEmpty)}
        <div className="file-library-scroll-reserve" ref={fileReserveRef} aria-hidden="true" />
      </section>
      {pendingDeleteFile ? (
        <DangerConfirmDialog
          title="删除文件？"
          description="文件删除后将不可找回，请谨慎操作！"
          closeIcon={fileLibraryModalCloseIcon}
          ariaLabel="删除文件"
          onCancel={() => setPendingDeleteFile(null)}
          onConfirm={() => deleteFile(pendingDeleteFile.id)}
        />
      ) : null}
    </section>
  )
}

function Sidebar({
  conversations,
  now,
  activeView,
  activeSettingsSection,
  onNewChat,
  onSearch,
  onOpenMessagePlatform,
  onOpenSkills,
  onOpenScheduledTasks,
  onOpenFileLibrary,
  onOpenSettings,
  onSettingsSectionChange,
  onBackFromSettings,
  onSelectConversation,
}: {
  conversations: ConversationRecord[]
  now: number
  activeView: AppView
  activeSettingsSection: SettingsSection
  onNewChat: () => void
  onSearch: () => void
  onOpenMessagePlatform: () => void
  onOpenSkills: () => void
  onOpenScheduledTasks: () => void
  onOpenFileLibrary: () => void
  onOpenSettings: () => void
  onSettingsSectionChange: (section: SettingsSection) => void
  onBackFromSettings: () => void
  onSelectConversation: (conversationId: string) => void
}) {
  if (activeView === 'settings') {
    return (
      <SettingsSidebar
        activeSection={activeSettingsSection}
        onSectionChange={onSettingsSectionChange}
        onBack={onBackFromSettings}
      />
    )
  }

  return (
    <aside className="side-nav">
      <nav className="primary-nav" aria-label="主导航">
        {primaryActions.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            onClick={
              item.action === 'new-chat'
                ? onNewChat
                : item.action === 'search-chat'
                  ? onSearch
                  : item.action === 'message-platform'
                    ? onOpenMessagePlatform
                    : item.action === 'skills'
                      ? onOpenSkills
                      : item.action === 'scheduled-tasks'
                        ? onOpenScheduledTasks
                        : item.action === 'file-library'
                          ? onOpenFileLibrary
                          : undefined
            }
            active={Boolean(item.action && item.action === activeView)}
          />
        ))}
      </nav>

      <div className="side-scroll">
        <EmptySection title="项目" emptyText="暂无项目" />
        <ConversationSection
          conversations={conversations}
          now={now}
          showActive={activeView === 'chat'}
          onSelectConversation={onSelectConversation}
        />
      </div>

      <footer className="side-footer">
        {footerActions.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            active={item.action === activeView}
            onClick={item.action === 'settings' ? onOpenSettings : undefined}
          />
        ))}
      </footer>
    </aside>
  )
}

function GlobalTitleBar({
  activeView,
  isSidebarCollapsed,
  activeConversationId,
  activeConversationTitle,
  activeConversationMessages,
  hasChat,
  isSkillsTitleDocked,
  activeSkillsSection,
  onActiveSkillsSectionChange,
  isScheduledTitleDocked,
  onScheduledCreateChat,
  platformTitlebar,
  fileLibraryTitlebar,
  settingsTitlebar,
  isChatRightPanelOpen,
  onPlatformTitleSwitchToggle,
  onConversationTitleRename,
  onConversationTitleToast,
  onToggleChatRightPanel,
  onToggleSidebar,
}: {
  activeView: AppView
  isSidebarCollapsed: boolean
  activeConversationId: string
  activeConversationTitle: string
  activeConversationMessages: ChatMessage[]
  hasChat: boolean
  isSkillsTitleDocked: boolean
  activeSkillsSection: 'skills' | 'employees'
  onActiveSkillsSectionChange: (section: 'skills' | 'employees') => void
  isScheduledTitleDocked: boolean
  onScheduledCreateChat: () => void
  platformTitlebar: PlatformTitlebarState
  fileLibraryTitlebar: PlatformTitlebarState
  settingsTitlebar: SettingsTitlebarState
  isChatRightPanelOpen: boolean
  onPlatformTitleSwitchToggle: () => void
  onConversationTitleRename: (title: string) => void
  onConversationTitleToast: (message: string) => void
  onToggleChatRightPanel: () => void
  onToggleSidebar: () => void
}) {
  const [isScheduledTitleCreateOpen, setIsScheduledTitleCreateOpen] = useState(false)
  const [isConversationMenuOpen, setIsConversationMenuOpen] = useState(false)
  const [isConversationRenameOpen, setIsConversationRenameOpen] = useState(false)
  const [conversationRenameTitle, setConversationRenameTitle] = useState(activeConversationTitle)
  const scheduledTitleCreateRef = useRef<HTMLDivElement | null>(null)
  const scheduledTitleCreatePopoverRef = useRef<HTMLDivElement | null>(null)
  const conversationTitleMoreRef = useRef<HTMLButtonElement | null>(null)
  const conversationTitlePopoverRef = useRef<HTMLDivElement | null>(null)
  const scheduledTitleCreatePopoverStyle = useFloatingPopoverPlacement(
    isScheduledTitleCreateOpen,
    scheduledTitleCreateRef,
    scheduledTitleCreatePopoverRef,
  )
  const conversationTitlePopoverStyle = useFixedFloatingPopoverPlacement(
    isConversationMenuOpen,
    conversationTitleMoreRef,
    conversationTitlePopoverRef,
    'left',
    [activeConversationId, activeConversationTitle],
  )
  const shouldShowSkillsTitleTabs = activeView === 'skills' && isSkillsTitleDocked
  const shouldShowScheduledTitleCreate = activeView === 'scheduled-tasks' && isScheduledTitleDocked
  const panelTitlebar = activeView === 'file-library' ? fileLibraryTitlebar : platformTitlebar
  const shouldShowPanelTitlebar =
    (activeView === 'message-platform' || activeView === 'file-library') && panelTitlebar.isDocked
  const shouldShowSettingsTitlebar = activeView === 'settings' && settingsTitlebar.isDocked
  const shouldShowChatRightPanel = activeView === 'chat' && isChatRightPanelOpen
  const panelListTitle = activeView === 'file-library' ? '文件库' : '消息平台'
  const skillsTitle = shouldShowSkillsTitleTabs ? (activeSkillsSection === 'skills' ? '技能' : '员工') : ''
  const skillsSubtitle = shouldShowSkillsTitleTabs ? (activeSkillsSection === 'skills' ? '员工' : '技能') : ''
  const title =
    activeView === 'chat' && hasChat
      ? activeConversationTitle
      : activeView === 'message-platform' && !isSidebarCollapsed
        ? '消息平台'
        : activeView === 'file-library' && !isSidebarCollapsed
          ? '文件库'
        : shouldShowSkillsTitleTabs
          ? skillsTitle
          : activeView === 'scheduled-tasks' && isScheduledTitleDocked
            ? '定时任务'
            : shouldShowSettingsTitlebar
              ? settingsTitlebar.title
              : ''
  const shouldShowTitle = Boolean(title)
  const shouldShowDivider =
    (activeView === 'chat' && shouldShowTitle) ||
    (activeView === 'skills' && isSkillsTitleDocked) ||
    (activeView === 'scheduled-tasks' && isScheduledTitleDocked) ||
    shouldShowSettingsTitlebar ||
    shouldShowPanelTitlebar
  const globalTitlebarClassName = [
    'global-titlebar',
    shouldShowDivider ? 'has-divider' : '',
    shouldShowPanelTitlebar ? 'has-platform-titlebar' : '',
  ]
    .filter(Boolean)
    .join(' ')
  const titlebarClassName = [
    'global-titlebar-main',
    shouldShowTitle ? 'has-title' : '',
    shouldShowDivider ? 'has-divider' : '',
    shouldShowPanelTitlebar ? 'has-platform-titlebar' : '',
    shouldShowPanelTitlebar && panelTitlebar.isListDocked ? 'has-platform-list-title' : '',
    shouldShowPanelTitlebar && panelTitlebar.isDetailDocked ? 'has-platform-detail-title' : '',
    activeView === 'skills' && isSkillsTitleDocked ? 'has-mask' : '',
    shouldShowChatRightPanel ? 'chat-right-panel-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    if (!shouldShowScheduledTitleCreate) {
      setIsScheduledTitleCreateOpen(false)
    }
  }, [shouldShowScheduledTitleCreate])

  useEffect(() => {
    if (activeView !== 'chat' || !hasChat) {
      setIsConversationMenuOpen(false)
      setIsConversationRenameOpen(false)
    }
  }, [activeView, hasChat])

  useEffect(() => {
    if (!isConversationMenuOpen) {
      return undefined
    }

    const closeConversationMenu = (event: PointerEvent) => {
      const target = event.target

      if (!(target instanceof Node)) {
        return
      }

      if (
        conversationTitleMoreRef.current?.contains(target) ||
        conversationTitlePopoverRef.current?.contains(target)
      ) {
        return
      }

      setIsConversationMenuOpen(false)
    }

    document.addEventListener('pointerdown', closeConversationMenu)

    return () => {
      document.removeEventListener('pointerdown', closeConversationMenu)
    }
  }, [isConversationMenuOpen])

  useEffect(() => {
    if (!isScheduledTitleCreateOpen) {
      return undefined
    }

    let isDismissReady = false
    const readyTimer = window.setTimeout(() => {
      isDismissReady = true
    }, 0)
    const closeScheduledTitleCreate = (event: MouseEvent) => {
      if (!isDismissReady) {
        return
      }
      const target = event.target

      if (!(target instanceof Node) || scheduledTitleCreateRef.current?.contains(target)) {
        return
      }

      setIsScheduledTitleCreateOpen(false)
    }

    document.addEventListener('click', closeScheduledTitleCreate)

    return () => {
      window.clearTimeout(readyTimer)
      document.removeEventListener('click', closeScheduledTitleCreate)
    }
  }, [isScheduledTitleCreateOpen])

  const closeConversationMenuWithToast = useCallback(
    (message: string) => {
      setIsConversationMenuOpen(false)
      onConversationTitleToast(message)
    },
    [onConversationTitleToast],
  )

  const copyConversationText = useCallback((value: string) => {
    if (!value) {
      return
    }

    void navigator.clipboard?.writeText(value).catch(() => undefined)
  }, [])

  const conversationMarkdown = useMemo(
    () =>
      activeConversationMessages
        .map((message) => {
          const roleLabel = message.role === 'user' ? '用户' : '助手'
          return `### ${roleLabel}\n\n${message.content}`
        })
        .join('\n\n'),
    [activeConversationMessages],
  )

  const openConversationRenameDialog = useCallback(() => {
    setConversationRenameTitle(activeConversationTitle)
    setIsConversationMenuOpen(false)
    setIsConversationRenameOpen(true)
  }, [activeConversationTitle])

  const submitConversationRename = useCallback(() => {
    const nextTitle = conversationRenameTitle.trim()

    if (!nextTitle) {
      return
    }

    onConversationTitleRename(nextTitle)
    setIsConversationRenameOpen(false)
  }, [conversationRenameTitle, onConversationTitleRename])

  return (
    <>
      <header
        className={globalTitlebarClassName}
        data-tauri-drag-region
        onPointerDown={startWindowDrag}
      >
        <div className="global-titlebar-left" data-tauri-drag-region>
          {activeView === 'settings' ? null : (
            <div className="global-titlebar-toggle-slot">
              <SidebarToggleControl
                label={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
                icon={isSidebarCollapsed ? panelRightIcon : panelLeftIcon}
                onClick={onToggleSidebar}
              />
            </div>
          )}
        </div>
        <div
          className={titlebarClassName}
          data-tauri-drag-region
          onDoubleClick={toggleWindowMaximize}
        >
          <div className="global-titlebar-content">
            <div className="global-titlebar-primary-group">
              {shouldShowPanelTitlebar ? (
                <div className="global-titlebar-platform-title-group">
                  <div className="global-titlebar-platform-list-title">
                    {!isSidebarCollapsed ? <h2>{panelListTitle}</h2> : null}
                  </div>
                  <div className="global-titlebar-platform-detail-title">
                    {panelTitlebar.isDetailDocked ? (
                      <>
                        {panelTitlebar.icon ? (
                          <img className="global-titlebar-platform-detail-icon" src={panelTitlebar.icon} alt="" />
                        ) : null}
                        <h2>{panelTitlebar.title}</h2>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : shouldShowTitle ? (
                <div className="global-titlebar-title-group">
                  <div className="global-titlebar-title-box">
                    <div className="global-titlebar-title">
                      {shouldShowSkillsTitleTabs ? (
                        <>
                          <button
                            className={`global-titlebar-title-tab ${
                              activeSkillsSection === 'skills' ? 'active' : ''
                            }`}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              onActiveSkillsSectionChange('skills')
                            }}
                          >
                            技能
                          </button>
                          <button
                            className={`global-titlebar-title-tab ${
                              activeSkillsSection === 'employees' ? 'active' : ''
                            }`}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              onActiveSkillsSectionChange('employees')
                            }}
                          >
                            员工
                          </button>
                        </>
                      ) : (
                        <>
                          <h2>{title}</h2>
                          {skillsSubtitle ? <span className="global-titlebar-subtitle">{skillsSubtitle}</span> : null}
                        </>
                      )}
                    </div>
                  </div>
                  {activeView === 'chat' ? (
                    <div className="global-titlebar-title-actions">
                      <button
                        className={`title-more-button ${isConversationMenuOpen ? 'active' : ''}`}
                        type="button"
                        aria-label="更多对话操作"
                        ref={conversationTitleMoreRef}
                        onClick={(event) => {
                          event.stopPropagation()
                          setIsConversationMenuOpen((isOpen) => !isOpen)
                        }}
                      >
                        <FigmaIcon icon={ellipsisIcon} />
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
            {activeView === 'chat' ? (
              <div
                className={`global-titlebar-secondary-group${
                  shouldShowChatRightPanel ? ' chat-panel-titlebar-group' : ''
                }`}
              >
                {shouldShowChatRightPanel ? (
                  <ChatPanelTabBar
                    title={activeConversationTitle || '帮我设计一个关于AI介绍的宣传网站'}
                  />
                ) : null}
                <div className="global-titlebar-actions">
                  <IconButton label="底部面板" icon={panelBottomIcon} />
                  <IconButton
                    label="右侧面板"
                    icon={panelRightIcon}
                    active={isChatRightPanelOpen}
                    onClick={onToggleChatRightPanel}
                  />
                </div>
              </div>
            ) : activeView === 'message-platform' && shouldShowPanelTitlebar && panelTitlebar.isDetailDocked ? (
              <div className="global-titlebar-platform-switch">
                <PlatformSwitch
                  checked={panelTitlebar.isEnabled}
                  onClick={onPlatformTitleSwitchToggle}
                />
              </div>
            ) : activeView === 'file-library' && shouldShowPanelTitlebar && panelTitlebar.isDetailDocked ? (
              <div className="global-titlebar-file-library-actions">
                {panelTitlebar.actions}
              </div>
            ) : shouldShowScheduledTitleCreate ? (
              <div className="global-titlebar-scheduled-create">
                <div className="scheduled-titlebar-create-anchor" ref={scheduledTitleCreateRef}>
                  <button
                    className={`scheduled-create-button scheduled-titlebar-create-button ${
                      isScheduledTitleCreateOpen ? 'active' : ''
                    }`}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setIsScheduledTitleCreateOpen((isOpen) => !isOpen)
                    }}
                  >
                    <span>创建</span>
                    <FigmaIcon icon={scheduledChevronDownIcon} />
                  </button>
                  {isScheduledTitleCreateOpen ? (
                    <div
                      className="scheduled-create-popover scheduled-titlebar-create-popover"
                      ref={scheduledTitleCreatePopoverRef}
                      role="menu"
                      aria-label="创建定时任务"
                      style={scheduledTitleCreatePopoverStyle}
                    >
                      <button
                        className="scheduled-create-option"
                        type="button"
                        role="menuitem"
                        onClick={(event) => {
                          event.stopPropagation()
                          setIsScheduledTitleCreateOpen(false)
                          onScheduledCreateChat()
                        }}
                      >
                        <span className="scheduled-create-option-surface">
                          <FigmaIcon icon={scheduledMessageCircleIcon} />
                          <span>通过聊天创建</span>
                        </span>
                      </button>
                      <button
                        className="scheduled-create-option"
                        type="button"
                        role="menuitem"
                        onClick={(event) => {
                          event.stopPropagation()
                          setIsScheduledTitleCreateOpen(false)
                          window.dispatchEvent(new Event('scheduled-manual-create-request'))
                        }}
                      >
                        <span className="scheduled-create-option-surface">
                          <FigmaIcon icon={scheduledPenIcon} />
                          <span>手动创建</span>
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      {isConversationMenuOpen
        ? createPortal(
            <div
              className="composer-popover conversation-title-popover"
              ref={conversationTitlePopoverRef}
              role="menu"
              aria-label="对话操作"
              style={conversationTitlePopoverStyle}
            >
              <button
                className="composer-popover-option"
                type="button"
                role="menuitem"
                onClick={() => closeConversationMenuWithToast('已置顶对话')}
              >
                <span className="composer-popover-option-surface">
                  <span className="composer-popover-option-label">置顶对话</span>
                </span>
              </button>
              <button
                className="composer-popover-option"
                type="button"
                role="menuitem"
                onClick={openConversationRenameDialog}
              >
                <span className="composer-popover-option-surface">
                  <span className="composer-popover-option-label">重命名对话</span>
                </span>
              </button>
              <button
                className="composer-popover-option"
                type="button"
                role="menuitem"
                onClick={() => closeConversationMenuWithToast('已归档对话')}
              >
                <span className="composer-popover-option-surface">
                  <span className="composer-popover-option-label">归档对话</span>
                </span>
              </button>
              <div className="composer-popover-separator" role="separator" />
              <button
                className="composer-popover-option"
                type="button"
                role="menuitem"
                onClick={() => {
                  copyConversationText(activeConversationId)
                  closeConversationMenuWithToast('已复制对话ID')
                }}
              >
                <span className="composer-popover-option-surface">
                  <span className="composer-popover-option-label">复制对话ID</span>
                </span>
              </button>
              <button
                className="composer-popover-option"
                type="button"
                role="menuitem"
                onClick={() => {
                  copyConversationText(conversationMarkdown)
                  closeConversationMenuWithToast('已复制为 Markdown')
                }}
              >
                <span className="composer-popover-option-surface">
                  <span className="composer-popover-option-label">复制为 Markdown</span>
                </span>
              </button>
            </div>,
            document.body,
          )
        : null}
      {isConversationRenameOpen
        ? createPortal(
            <div className="skills-modal-overlay modal-fade-layer" role="presentation">
              <section className="skills-github-dialog conversation-rename-dialog modal-pop-surface" role="dialog" aria-modal="true" aria-label="重命名对话">
                <header className="skills-github-heading">
                  <h2>重命名对话</h2>
                  <button type="button" aria-label="关闭" onClick={() => setIsConversationRenameOpen(false)}>
                    <FigmaIcon icon={modalXIcon} />
                  </button>
                </header>
                <div className="skills-github-content">
                  <input
                    value={conversationRenameTitle}
                    autoFocus
                    placeholder="请输入对话标题"
                    onChange={(event) => setConversationRenameTitle(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        submitConversationRename()
                      }
                    }}
                  />
                </div>
                <footer className="skills-github-actions">
                  <button type="button" onClick={() => setIsConversationRenameOpen(false)}>
                    取消
                  </button>
                  <button type="button" onClick={submitConversationRename} disabled={!conversationRenameTitle.trim()}>
                    确定
                  </button>
                </footer>
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

function SidebarToggleControl({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: string
  onClick: () => void
}) {
  return <IconButton label={label} icon={icon} onClick={onClick} />
}

type ComposerToolbarAction = 'add' | 'permission' | 'skills' | 'employees' | 'model'
type ComposerPermissionMode = 'default' | 'review' | 'full'

const SKILL_ACCENT_COLORS = [
  '#FF5C4D',
  '#FF922B',
  '#27B66A',
  '#0088FF',
  '#7080FF',
  '#966CFF',
  '#E64D92',
]

const composerPermissionOptions: Array<{
  value: ComposerPermissionMode
  label: string
  buttonLabel: string
  icon: string
}> = [
  {
    value: 'default',
    label: '默认权限',
    buttonLabel: '默认权限',
    icon: composerPermissionDefaultIcon,
  },
  {
    value: 'review',
    label: '自动审查',
    buttonLabel: '自动审查',
    icon: composerPermissionReviewIcon,
  },
  {
    value: 'full',
    label: '完全访问权限',
    buttonLabel: '完全访问',
    icon: composerPermissionFullIcon,
  },
]

const composerModelOptions = [
  'Qwen3.7-Plus',
  'Qwen3.6-Plus',
  'Qwen3-VL-Flash',
  'deepseek-v4-pro',
  'Deepseek-v4-flash',
  'GLM-5.1',
  'Kimi-K2.6',
]

function PromptComposer({
  hasChat,
  onSendMessage,
  isSending,
  onHeightChange,
}: {
  hasChat: boolean
  onSendMessage: (message: string) => Promise<void>
  isSending: boolean
  onHeightChange?: (height: number) => void
}) {
  const composerRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const addMenuRef = useRef<HTMLDivElement>(null)
  const addPopoverRef = useRef<HTMLDivElement>(null)
  const addSnippetMenuRef = useRef<HTMLButtonElement>(null)
  const addSnippetPopoverRef = useRef<HTMLDivElement>(null)
  const permissionMenuRef = useRef<HTMLDivElement>(null)
  const permissionPopoverRef = useRef<HTMLDivElement>(null)
  const skillsMenuRef = useRef<HTMLDivElement>(null)
  const skillsPopoverRef = useRef<HTMLDivElement>(null)
  const employeesMenuRef = useRef<HTMLDivElement>(null)
  const employeesPopoverRef = useRef<HTMLDivElement>(null)
  const modelMenuRef = useRef<HTMLDivElement>(null)
  const modelPopoverRef = useRef<HTMLDivElement>(null)
  const [prompt, setPrompt] = useState('')
  const [composerHeight, setComposerHeight] = useState(COMPOSER_MIN_HEIGHT)
  const [activeToolbarAction, setActiveToolbarAction] = useState<ComposerToolbarAction | null>(null)
  const [isAddSnippetOpen, setIsAddSnippetOpen] = useState(false)
  const [permissionMode, setPermissionMode] = useState<ComposerPermissionMode>('default')
  const [, setSelectedComposerSkill] = useState<string | null>(null)
  const [, setSelectedComposerEmployee] = useState<string | null>(null)
  const [composerModel, setComposerModel] = useState('Qwen3.7-Plus')

  const addPopoverStyle = useFixedFloatingPopoverPlacement(
    activeToolbarAction === 'add',
    addMenuRef,
    addPopoverRef,
    'left',
  )
  const addSnippetPopoverStyle = useFixedSidePopoverPlacement(
    activeToolbarAction === 'add' && isAddSnippetOpen,
    addPopoverRef,
    addSnippetPopoverRef,
  )
  const permissionPopoverStyle = useFixedFloatingPopoverPlacement(
    activeToolbarAction === 'permission',
    permissionMenuRef,
    permissionPopoverRef,
    'left',
  )
  const skillsPopoverStyle = useFixedFloatingPopoverPlacement(
    activeToolbarAction === 'skills',
    skillsMenuRef,
    skillsPopoverRef,
    'left',
  )
  const employeesPopoverStyle = useFixedFloatingPopoverPlacement(
    activeToolbarAction === 'employees',
    employeesMenuRef,
    employeesPopoverRef,
    'left',
  )
  const modelPopoverStyle = useFixedFloatingPopoverPlacement(
    activeToolbarAction === 'model',
    modelMenuRef,
    modelPopoverRef,
  )

  const syncComposerHeight = useCallback(() => {
    const composer = composerRef.current
    const textarea = textareaRef.current

    if (!composer || !textarea) {
      return
    }

    const composerRect = composer.getBoundingClientRect()
    const availableComposerHeight = hasChat
      ? composerRect.bottom - COMPOSER_BOTTOM_SAFE_SPACE
      : window.innerHeight - composerRect.top - COMPOSER_BOTTOM_SAFE_SPACE
    const maxComposerHeight = Math.min(
      COMPOSER_MAX_HEIGHT,
      Math.max(COMPOSER_MIN_HEIGHT, availableComposerHeight),
    )
    const previousTextareaHeight = textarea.style.height
    textarea.style.height = `${
      COMPOSER_MIN_HEIGHT - COMPOSER_TOOLBAR_HEIGHT - COMPOSER_INPUT_TOP_INSET
    }px`
    const desiredComposerHeight =
      textarea.scrollHeight + COMPOSER_INPUT_TOP_INSET + COMPOSER_TOOLBAR_HEIGHT
    textarea.style.height = previousTextareaHeight
    const nextComposerHeight = Math.min(
      maxComposerHeight,
      Math.max(COMPOSER_MIN_HEIGHT, desiredComposerHeight),
    )

    setComposerHeight(Math.round(nextComposerHeight))
  }, [hasChat])

  useEffect(() => {
    syncComposerHeight()
    window.addEventListener('resize', syncComposerHeight)

    return () => {
      window.removeEventListener('resize', syncComposerHeight)
    }
  }, [syncComposerHeight])

  useEffect(() => {
    syncComposerHeight()
  }, [prompt, syncComposerHeight])

  useEffect(() => {
    if (hasChat) {
      onHeightChange?.(composerHeight)
    }
  }, [composerHeight, hasChat, onHeightChange])

  useEffect(() => {
    if (!activeToolbarAction) {
      return undefined
    }

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target
      const activePopover =
        activeToolbarAction === 'add'
          ? addPopoverRef.current
          : activeToolbarAction === 'permission'
            ? permissionPopoverRef.current
            : activeToolbarAction === 'skills'
              ? skillsPopoverRef.current
              : activeToolbarAction === 'employees'
                ? employeesPopoverRef.current
                : activeToolbarAction === 'model'
                  ? modelPopoverRef.current
                  : null
      const activeAnchor =
        activeToolbarAction === 'add'
          ? addMenuRef.current
          : activeToolbarAction === 'permission'
            ? permissionMenuRef.current
            : activeToolbarAction === 'skills'
              ? skillsMenuRef.current
              : activeToolbarAction === 'employees'
                ? employeesMenuRef.current
                : activeToolbarAction === 'model'
                  ? modelMenuRef.current
                  : null

      const isInsideAddSnippet =
        target instanceof Node &&
        activeToolbarAction === 'add' &&
        (addSnippetMenuRef.current?.contains(target) ||
          addSnippetPopoverRef.current?.contains(target))

      if (
        target instanceof Node &&
        (activeAnchor?.contains(target) || activePopover?.contains(target) || isInsideAddSnippet)
      ) {
        return
      }

      setActiveToolbarAction(null)
      setIsAddSnippetOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePointerDown)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointerDown)
    }
  }, [activeToolbarAction])

  const submitMessage = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const message = prompt.trim()

      if (!message || isSending) {
        return
      }

      setPrompt('')
      await onSendMessage(message)
      requestAnimationFrame(syncComposerHeight)
    },
    [isSending, onSendMessage, prompt, syncComposerHeight],
  )

  const submitOnEnter = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return
    }

    event.preventDefault()
    event.currentTarget.form?.requestSubmit()
  }, [])

  const toggleToolbarAction = useCallback((action: ComposerToolbarAction) => {
    setIsAddSnippetOpen(false)
    setActiveToolbarAction((currentAction) => (currentAction === action ? null : action))
  }, [])

  const keepToolbarPopoverSwitch = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }, [])

  const openNativeFilePicker = useCallback((kind: 'file' | 'folder' | 'image') => {
    const input = document.createElement('input')
    input.type = 'file'

    if (kind === 'folder') {
      input.setAttribute('webkitdirectory', '')
      input.setAttribute('directory', '')
    } else {
      input.multiple = true
    }

    if (kind === 'image') {
      input.accept = 'image/*'
    }

    input.style.position = 'fixed'
    input.style.left = '-9999px'
    input.style.top = '0'
    input.addEventListener('change', () => input.remove(), { once: true })
    document.body.appendChild(input)
    input.click()
  }, [])

  const closeToolbarPopover = useCallback(() => {
    setIsAddSnippetOpen(false)
    setActiveToolbarAction(null)
  }, [])

  const composerSnippetOptions = [
    { label: '代码审查', icon: composerSnippetCodeReviewIcon },
    { label: '实现计划', icon: composerSnippetPlanIcon },
    { label: '解释这段', icon: composerSnippetExplainIcon },
  ]

  const insertPromptSnippet = useCallback(
    (snippet: string) => {
      setPrompt((currentPrompt) => {
        const nextSnippet = `${snippet}：`
        return currentPrompt.trim() ? `${currentPrompt}\n${nextSnippet}` : nextSnippet
      })
      closeToolbarPopover()
      requestAnimationFrame(() => {
        textareaRef.current?.focus()
        syncComposerHeight()
      })
    },
    [closeToolbarPopover, syncComposerHeight],
  )

  const selectedPermission = composerPermissionOptions.find(
    (option) => option.value === permissionMode,
  )

  const composerStyle = {
    '--composer-height': `${composerHeight}px`,
  } as CSSProperties
  const portalRoot = typeof document === 'undefined' ? null : document.body

  return (
    <div className={`composer-stage${hasChat ? ' has-chat' : ''}`} style={composerStyle}>
      <form
        ref={composerRef}
        className="composer"
        aria-label="新对话输入框"
        onSubmit={submitMessage}
      >
      <label className="sr-only" htmlFor="prompt">
        输入消息
      </label>
      <div className="composer-input-wrap">
        <textarea
          ref={textareaRef}
          id="prompt"
          rows={2}
          placeholder={
            hasChat
              ? '输入消息，继续提问'
              : '用/skill-creator 创建一个技能，你先问我技能应该做什么吧。'
          }
          value={prompt}
          onChange={(event) => setPrompt(event.currentTarget.value)}
          onKeyDown={submitOnEnter}
        />
      </div>

      <div className="composer-toolbar">
        <div className="toolbar-group">
          <div className="composer-toolbar-popover-anchor" ref={addMenuRef}>
            <button
              className={`icon-button ghost composer-toolbar-icon-action${
                activeToolbarAction === 'add' ? ' active' : ''
              }`}
              type="button"
              aria-label="添加"
              aria-pressed={activeToolbarAction === 'add'}
              onPointerDown={keepToolbarPopoverSwitch}
              onClick={() => toggleToolbarAction('add')}
            >
              <FigmaIcon icon={plusIcon} />
            </button>
            {portalRoot && activeToolbarAction === 'add'
              ? createPortal(
              <div
                ref={addPopoverRef}
                className="composer-popover composer-add-popover"
                style={addPopoverStyle}
              >
                {[
                  { label: '添加文件', icon: composerAddFileIcon, kind: 'file' as const },
                  { label: '添加文件夹', icon: composerAddFolderIcon, kind: 'folder' as const },
                  { label: '添加图片', icon: composerAddImageIcon, kind: 'image' as const },
                ].map((option) => (
                  <button
                    key={option.label}
                    className="composer-popover-option"
                    type="button"
                    onPointerEnter={() => setIsAddSnippetOpen(false)}
                    onFocus={() => setIsAddSnippetOpen(false)}
                    onClick={() => {
                      closeToolbarPopover()
                      openNativeFilePicker(option.kind)
                    }}
                  >
                    <span className="composer-popover-option-surface">
                      <FigmaIcon icon={option.icon} />
                      <span className="composer-popover-option-label">{option.label}</span>
                    </span>
                  </button>
                ))}
                <div className="composer-popover-separator" aria-hidden="true" />
                <button
                  ref={addSnippetMenuRef}
                  className={`composer-popover-option${isAddSnippetOpen ? ' selected' : ''}`}
                  type="button"
                  onPointerEnter={() => setIsAddSnippetOpen(true)}
                  onFocus={() => setIsAddSnippetOpen(true)}
                  onClick={(event) => {
                    event.stopPropagation()
                    setIsAddSnippetOpen(true)
                  }}
                >
                  <span className="composer-popover-option-surface">
                    <FigmaIcon icon={composerSnippetIcon} />
                    <span className="composer-popover-option-label">提示片段</span>
                    <span className="composer-popover-option-chevron">
                      <FigmaIcon icon={chevronRightIcon} />
                    </span>
                  </span>
                </button>
              </div>,
                portalRoot,
              )
              : null}
            {portalRoot && activeToolbarAction === 'add' && isAddSnippetOpen
              ? createPortal(
              <div
                ref={addSnippetPopoverRef}
                className="composer-popover composer-add-snippet-popover"
                style={addSnippetPopoverStyle}
              >
                {composerSnippetOptions.map((snippet) => (
                  <button
                    key={snippet.label}
                    className="composer-popover-option"
                    type="button"
                    onClick={() => insertPromptSnippet(snippet.label)}
                  >
                    <span className="composer-popover-option-surface">
                      <FigmaIcon icon={snippet.icon} />
                      <span className="composer-popover-option-label">{snippet.label}</span>
                    </span>
                  </button>
                ))}
              </div>,
                portalRoot,
              )
              : null}
          </div>
          <div className="composer-toolbar-popover-anchor" ref={permissionMenuRef}>
            <button
              className={`pill-button permission-select permission-${permissionMode}${
                activeToolbarAction === 'permission' ? ' active' : ''
              }`}
              type="button"
              aria-pressed={activeToolbarAction === 'permission'}
              onPointerDown={keepToolbarPopoverSwitch}
              onClick={() => toggleToolbarAction('permission')}
            >
              <FigmaIcon icon={selectedPermission?.icon ?? composerPermissionDefaultIcon} inheritColor />
              <span>{selectedPermission?.buttonLabel ?? '默认权限'}</span>
              <FigmaIcon icon={chevronDownIcon} inheritColor />
            </button>
            {portalRoot && activeToolbarAction === 'permission'
              ? createPortal(
              <div
                ref={permissionPopoverRef}
                className="composer-popover composer-permission-popover"
                style={permissionPopoverStyle}
              >
                {composerPermissionOptions.map((option) => {
                  const isSelected = permissionMode === option.value

                  return (
                    <button
                      key={option.value}
                      className={`composer-popover-option${isSelected ? ' selected' : ''}`}
                      type="button"
                      onClick={() => {
                        setPermissionMode(option.value)
                        closeToolbarPopover()
                      }}
                    >
                      <span className="composer-popover-option-surface">
                        <FigmaIcon icon={option.icon} />
                        <span className="composer-popover-option-label">{option.label}</span>
                        {isSelected ? (
                          <span className="composer-popover-check">
                            <FigmaIcon icon={settingsCheckIcon} />
                          </span>
                        ) : null}
                      </span>
                    </button>
                  )
                })}
              </div>,
                portalRoot,
              )
              : null}
          </div>
          <div className="composer-toolbar-popover-anchor" ref={skillsMenuRef}>
            <button
              className={`pill-button composer-toolbar-action${
                activeToolbarAction === 'skills' ? ' active' : ''
              }`}
              type="button"
              aria-pressed={activeToolbarAction === 'skills'}
              onPointerDown={keepToolbarPopoverSwitch}
              onClick={() => toggleToolbarAction('skills')}
            >
              <FigmaIcon icon={composerSkillIcon} />
              <span>技能</span>
              <FigmaIcon icon={chevronDownIcon} />
            </button>
            {portalRoot && activeToolbarAction === 'skills'
              ? createPortal(
              <div
                ref={skillsPopoverRef}
                className="composer-popover composer-skill-popover"
                style={skillsPopoverStyle}
              >
                {skillItems.map((skill, index) => {
                  const initial = skill.title.trim().charAt(0).toUpperCase()

                  return (
                    <button
                      key={skill.title}
                      className="composer-popover-option"
                      type="button"
                      onClick={() => {
                        setSelectedComposerSkill(skill.title)
                        closeToolbarPopover()
                      }}
                    >
                      <span className="composer-popover-option-surface">
                        <span
                          className="composer-skill-chip"
                          style={{
                            backgroundColor: SKILL_ACCENT_COLORS[index % SKILL_ACCENT_COLORS.length],
                          }}
                        >
                          {initial}
                        </span>
                        <span className="composer-popover-option-label">{skill.title}</span>
                      </span>
                    </button>
                  )
                })}
              </div>,
                portalRoot,
              )
              : null}
          </div>
          <div className="composer-toolbar-popover-anchor" ref={employeesMenuRef}>
            <button
              className={`pill-button composer-toolbar-action${
                activeToolbarAction === 'employees' ? ' active' : ''
              }`}
              type="button"
              aria-pressed={activeToolbarAction === 'employees'}
              onPointerDown={keepToolbarPopoverSwitch}
              onClick={() => toggleToolbarAction('employees')}
            >
              <FigmaIcon icon={composerEmployeeIcon} />
              <span>员工</span>
              <FigmaIcon icon={chevronDownIcon} />
            </button>
            {portalRoot && activeToolbarAction === 'employees'
              ? createPortal(
              <div
                ref={employeesPopoverRef}
                className="composer-popover composer-employee-popover"
                style={employeesPopoverStyle}
              >
                {employeeItems.map((employee) => (
                  <button
                    key={employee.title}
                    className="composer-popover-option"
                    type="button"
                    onClick={() => {
                      setSelectedComposerEmployee(employee.title)
                      closeToolbarPopover()
                    }}
                  >
                    <span className="composer-popover-option-surface">
                      <img
                        className="composer-employee-avatar"
                        src={employee.image}
                        alt=""
                        aria-hidden="true"
                      />
                      <span className="composer-popover-option-label">{employee.title}</span>
                    </span>
                  </button>
                ))}
              </div>,
                portalRoot,
              )
              : null}
          </div>
        </div>

        <div className="toolbar-group">
          <div className="composer-toolbar-popover-anchor composer-model-anchor" ref={modelMenuRef}>
            <button
              className={`pill-button model-select${
                activeToolbarAction === 'model' ? ' active' : ''
              }`}
              type="button"
              aria-pressed={activeToolbarAction === 'model'}
              onPointerDown={keepToolbarPopoverSwitch}
              onClick={() => toggleToolbarAction('model')}
            >
              <span>{composerModel}</span>
              <FigmaIcon icon={chevronDownIcon} />
            </button>
            {portalRoot && activeToolbarAction === 'model'
              ? createPortal(
              <div
                ref={modelPopoverRef}
                className="composer-popover composer-model-popover"
                style={modelPopoverStyle}
              >
                {composerModelOptions.map((model) => {
                  const isSelected = composerModel === model

                  return (
                    <button
                      key={model}
                      className={`composer-popover-option${isSelected ? ' selected' : ''}`}
                      type="button"
                      onClick={() => {
                        setComposerModel(model)
                        closeToolbarPopover()
                      }}
                    >
                      <span className="composer-popover-option-surface">
                        <span className="composer-popover-option-label">{model}</span>
                        {isSelected ? (
                          <span className="composer-popover-check">
                            <FigmaIcon icon={settingsCheckIcon} />
                          </span>
                        ) : null}
                      </span>
                    </button>
                  )
                })}
              </div>,
                portalRoot,
              )
              : null}
          </div>
          <IconButton label="语音输入" icon={micIcon} />
          <IconButton
            label={isSending ? '发送中' : '发送'}
            icon={arrowUpIcon}
            variant="send"
            type="submit"
            disabled={isSending || !prompt.trim()}
          />
        </div>
      </div>
      </form>
    </div>
  )
}

function ChatThread({
  conversationId,
  messages,
  isSending,
  error,
  scrollTop,
  onScrollPositionChange,
}: {
  conversationId: string
  messages: ChatMessage[]
  isSending: boolean
  error: string | null
  scrollTop: number
  onScrollPositionChange?: (conversationId: string, scrollTop: number) => void
}) {
  const threadRef = useRef<HTMLDivElement>(null)
  const savedScrollTopRef = useRef(scrollTop)
  const suppressNextAutoScrollRef = useRef(true)
  const latestMessageSignature = messages
    .map((message) => `${message.role}:${message.content.length}:${message.processedSeconds ?? ''}`)
    .join('|')

  useEffect(() => {
    savedScrollTopRef.current = scrollTop
  }, [scrollTop])

  useLayoutEffect(() => {
    const thread = threadRef.current

    if (!thread) {
      return
    }

    suppressNextAutoScrollRef.current = true
    thread.scrollTop = savedScrollTopRef.current
  }, [conversationId])

  useEffect(() => {
    const thread = threadRef.current

    if (!thread) {
      return
    }

    if (suppressNextAutoScrollRef.current) {
      suppressNextAutoScrollRef.current = false
      return
    }

    thread.scrollTo({
      top: thread.scrollHeight,
      behavior: 'smooth',
    })
  }, [latestMessageSignature, isSending, error, conversationId])

  const saveScrollPosition = useCallback(() => {
    const thread = threadRef.current

    if (!thread) {
      return
    }

    onScrollPositionChange?.(conversationId, thread.scrollTop)
  }, [conversationId, onScrollPositionChange])

  if (messages.length === 0 && !isSending && !error) {
    return null
  }

  return (
    <div className="chat-thread-shell">
      <div ref={threadRef} className="chat-thread" aria-live="polite" onScroll={saveScrollPosition}>
        <div className="chat-thread-content">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-row ${message.role}`}>
              {message.role === 'assistant' && message.processedSeconds !== undefined ? (
                <article className="assistant-response">
                  <div className="assistant-status">已处理{message.processedSeconds}s</div>
                  <div className="assistant-divider" aria-hidden="true" />
                  <div className="chat-message assistant">{message.content}</div>
                </article>
              ) : (
                <article className={`chat-message ${message.role}`}>{message.content}</article>
              )}
            </div>
          ))}
          {isSending ? (
            <div className="chat-row assistant">
              <div className="chat-message assistant pending">正在思考…</div>
            </div>
          ) : null}
          {error ? <div className="chat-error">{error}</div> : null}
        </div>
      </div>
    </div>
  )
}

function ChatRightPanel() {
  return (
    <section className="chat-right-panel" aria-label="右侧面板">
      <div className="chat-right-panel-browser-toolbar">
        <div className="chat-right-panel-navigation" aria-label="页面导航">
          <button className="icon-button" type="button" aria-label="后退">
            <FigmaIcon icon={chatPanelArrowLeftIcon} />
          </button>
          <button className="icon-button" type="button" aria-label="前进">
            <FigmaIcon icon={chatPanelArrowRightIcon} />
          </button>
          <button className="icon-button" type="button" aria-label="刷新">
            <FigmaIcon icon={chatPanelRefreshIcon} />
          </button>
        </div>
        <div className="chat-right-panel-url" title="http://127.0.0.1:8080/?brand=1779689290173">
          http://127.0.0.1:8080/?brand=1779689290173
        </div>
        <div className="chat-right-panel-menu-group">
          <button className="icon-button" type="button" aria-label="更多页面操作">
            <FigmaIcon icon={ellipsisIcon} />
          </button>
        </div>
      </div>
      <div className="chat-right-panel-viewport" />
    </section>
  )
}

function Content({
  activeView,
  activeSettingsSection,
  activeSkillsSection,
  onActiveSkillsSectionChange,
  onStartNewChat,
  onSkillsTitleDockedChange,
  onScheduledTitleDockedChange,
  onSettingsTitlebarChange,
  onPlatformTitlebarChange,
  onFileLibraryTitlebarChange,
  onLogout,
  onLanguageChange,
  language,
  onSettingsChatDirtyChange,
  isSettingsChatLeaveConfirmOpen,
  onResolveSettingsChatLeave,
  activeConversationId,
  messages,
  isSending,
  error,
  chatScrollTop,
  onChatScrollPositionChange,
  onSendMessage,
  isChatRightPanelOpen,
}: {
  activeView: AppView
  activeSettingsSection: SettingsSection
  activeSkillsSection: 'skills' | 'employees'
  onActiveSkillsSectionChange: (section: 'skills' | 'employees') => void
  onStartNewChat: () => void
  onSkillsTitleDockedChange: (isDocked: boolean) => void
  onScheduledTitleDockedChange: (isDocked: boolean) => void
  onSettingsTitlebarChange: (state: SettingsTitlebarState) => void
  onPlatformTitlebarChange: (state: PlatformTitlebarState) => void
  onFileLibraryTitlebarChange: (state: PlatformTitlebarState) => void
  onLogout: () => void
  onLanguageChange: (language: '中文' | 'English') => void
  language: '中文' | 'English'
  onSettingsChatDirtyChange: (isDirty: boolean) => void
  isSettingsChatLeaveConfirmOpen: boolean
  onResolveSettingsChatLeave: () => void
  activeConversationId: string
  messages: ChatMessage[]
  isSending: boolean
  error: string | null
  chatScrollTop: number
  onChatScrollPositionChange: (conversationId: string, scrollTop: number) => void
  onSendMessage: (message: string) => Promise<void>
  isChatRightPanelOpen: boolean
}) {
  const hasChat = messages.length > 0 || isSending || error
  const [chatComposerHeight, setChatComposerHeight] = useState(COMPOSER_MIN_HEIGHT)

  if (activeView === 'message-platform') {
    return (
      <main className="content-panel content-panel-platform">
        <MessagePlatformPage onTitlebarChange={onPlatformTitlebarChange} />
      </main>
    )
  }

  if (activeView === 'skills') {
    return (
      <main className="content-panel content-panel-feature">
        <SkillsPage
          onStartChat={onStartNewChat}
          onTitleDockedChange={onSkillsTitleDockedChange}
          activeSkillsSection={activeSkillsSection}
          onActiveSkillsSectionChange={onActiveSkillsSectionChange}
          language={language}
        />
      </main>
    )
  }

  if (activeView === 'scheduled-tasks') {
    return (
      <main className="content-panel content-panel-feature">
        <ScheduledTasksPage
          onStartChat={onStartNewChat}
          onTitleDockedChange={onScheduledTitleDockedChange}
        />
      </main>
    )
  }

  if (activeView === 'settings') {
    return (
      <main className="content-panel content-panel-feature">
        <SettingsPage
          activeSection={activeSettingsSection}
          language={language}
          onLogout={onLogout}
          onLanguageChange={onLanguageChange}
          onTitleDockedChange={onSettingsTitlebarChange}
          onChatDirtyChange={onSettingsChatDirtyChange}
          isChatLeaveConfirmOpen={isSettingsChatLeaveConfirmOpen}
          onResolveChatLeave={onResolveSettingsChatLeave}
        />
      </main>
    )
  }

  if (activeView === 'file-library') {
    return (
      <main className="content-panel content-panel-platform">
        <FileLibraryPage onTitlebarChange={onFileLibraryTitlebarChange} />
      </main>
    )
  }

  return (
    <main className={`content-panel content-panel-chat${isChatRightPanelOpen ? ' has-right-panel' : ''}`}>
      <div className={`chat-primary-pane${isChatRightPanelOpen ? ' panel-open' : ''}`}>
        <section
          className={`welcome-panel ${hasChat ? 'has-chat' : ''}`}
          style={{ '--chat-composer-height': `${chatComposerHeight}px` } as CSSProperties}
        >
          {hasChat ? (
            <ChatThread
              conversationId={activeConversationId}
              messages={messages}
              isSending={isSending}
              error={error}
              scrollTop={chatScrollTop}
              onScrollPositionChange={onChatScrollPositionChange}
            />
          ) : (
            <h1>今天想做点什么？</h1>
          )}
          <PromptComposer
            hasChat={Boolean(hasChat)}
            onSendMessage={onSendMessage}
            isSending={isSending}
            onHeightChange={setChatComposerHeight}
          />
        </section>
      </div>
      {isChatRightPanelOpen ? <ChatRightPanel /> : null}
    </main>
  )
}

function useWindowFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!window.__TAURI_INTERNALS__) {
      return undefined
    }

    const appWindow = getCurrentWindow()
    let cancelled = false
    let unlistenResize: (() => void) | undefined
    let unlistenFocus: (() => void) | undefined

    const syncFullscreen = () => {
      void appWindow
        .isFullscreen()
        .then((value) => {
          if (!cancelled) {
            setIsFullscreen(value)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setIsFullscreen(false)
          }
        })
    }

    syncFullscreen()
    window.addEventListener('resize', syncFullscreen)
    void appWindow.onResized(syncFullscreen).then((unlisten) => {
      unlistenResize = unlisten
    })
    void appWindow.onFocusChanged(syncFullscreen).then((unlisten) => {
      unlistenFocus = unlisten
    })

    return () => {
      cancelled = true
      window.removeEventListener('resize', syncFullscreen)
      unlistenResize?.()
      unlistenFocus?.()
    }
  }, [])

  return isFullscreen
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  })
  const [language, setLanguage] = useState<'中文' | 'English'>('中文')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isChatRightPanelOpen, setIsChatRightPanelOpen] = useState(false)
  const [activeView, setActiveView] = useState<AppView>('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversations, setConversations] = useState<ConversationRecord[]>([])
  const [pendingConversationIds, setPendingConversationIds] = useState<string[]>([])
  const [chatScrollPositions, setChatScrollPositions] = useState<Record<string, number>>({})
  const [now, setNow] = useState(() => Date.now())
  const [chatError, setChatError] = useState<string | null>(null)
  const [appToast, setAppToast] = useState<PlatformToastState | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearchClosing, setIsSearchClosing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSkillsSection, setActiveSkillsSection] = useState<'skills' | 'employees'>('skills')
  const [isSkillsTitleDocked, setIsSkillsTitleDocked] = useState(false)
  const [isScheduledTitleDocked, setIsScheduledTitleDocked] = useState(false)
  const [platformTitlebar, setPlatformTitlebar] = useState<PlatformTitlebarState>({
    isDocked: false,
    isListDocked: false,
    isDetailDocked: false,
    title: '消息平台',
    icon: '',
    isEnabled: false,
  })
  const [fileLibraryTitlebar, setFileLibraryTitlebar] = useState<PlatformTitlebarState>({
    isDocked: false,
    isListDocked: false,
    isDetailDocked: false,
    title: '全部文件',
    icon: '',
    isEnabled: false,
  })
  const [settingsTitlebar, setSettingsTitlebar] = useState<SettingsTitlebarState>({
    isDocked: false,
    title: '',
  })
  const [settingsReturnView, setSettingsReturnView] = useState<AppView>('chat')
  const [activeSettingsSection, setActiveSettingsSection] = useState<SettingsSection>('model')
  const [isSettingsChatDirty, setIsSettingsChatDirty] = useState(false)
  const [pendingSettingsNavigation, setPendingSettingsNavigation] = useState<
    { type: 'section'; section: SettingsSection } | { type: 'back' } | null
  >(null)
  const activeConversationIdRef = useRef<string | null>(null)
  const isWindowFullscreen = useWindowFullscreen()
  const workspaceClassName = [
    'workspace',
    isSidebarCollapsed ? 'sidebar-collapsed' : '',
    isWindowFullscreen ? 'window-fullscreen' : '',
    activeView === 'chat' && isChatRightPanelOpen ? 'chat-right-panel-open' : '',
  ]
    .filter(Boolean)
    .join(' ')
  const activeConversation = conversations.find((conversation) => conversation.active)
  const activeConversationId = activeConversation?.id ?? ''
  const isActiveConversationSending = activeConversation
    ? pendingConversationIds.includes(activeConversation.id)
    : false
  const activeChatScrollTop = activeConversationId
    ? (chatScrollPositions[activeConversationId] ?? 0)
    : 0

  useGlobalEnglishTranslation(language === 'English')

  useEffect(() => {
    void configureAppWindowForAuthState(isAuthenticated)
  }, [isAuthenticated])

  const createConversationTitle = useCallback((content: string) => {
    const normalized = content.replace(/\s+/g, ' ').trim()
    const title = normalized.length > 18 ? `${normalized.slice(0, 18)}...` : normalized

    return title || '新对话'
  }, [])

  const showAppToast = useCallback((message: string) => {
    setAppToast({
      id: Date.now(),
      tone: 'success',
      message,
    })
  }, [])

  const closeAppToast = useCallback(() => {
    setAppToast(null)
  }, [])

  const renameActiveConversation = useCallback((nextTitle: string) => {
    const title = nextTitle.trim()

    if (!title) {
      return
    }

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.active
          ? {
              ...conversation,
              title,
            }
          : conversation,
      ),
    )
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 60_000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    activeConversationIdRef.current = activeConversation?.id ?? null
  }, [activeConversation?.id])

  useEffect(() => {
    if (activeView !== 'skills') {
      setIsSkillsTitleDocked(false)
    }
  }, [activeView])

  useEffect(() => {
    if (activeView !== 'message-platform') {
      setPlatformTitlebar((currentState) => ({
        ...currentState,
        isDocked: false,
      }))
    }
  }, [activeView])

  useEffect(() => {
    if (activeView !== 'file-library') {
      setFileLibraryTitlebar((currentState) => ({
        ...currentState,
        isDocked: false,
      }))
    }
  }, [activeView])

  useEffect(() => {
    if (activeView !== 'settings') {
      setSettingsTitlebar({ isDocked: false, title: '' })
    }
  }, [activeView])

  const togglePlatformFromTitlebar = useCallback(() => {
    window.dispatchEvent(new Event('message-platform-title-switch-toggle'))
  }, [])

  const startNewChat = useCallback(() => {
    setActiveView('chat')
    activeConversationIdRef.current = null
    setMessages([])
    setChatError(null)
    setConversations((currentConversations) =>
      currentConversations.map((conversation) => ({
        ...conversation,
        active: false,
      })),
    )
  }, [])

  const openSettings = useCallback(() => {
    setSettingsReturnView((activeView === 'settings' ? settingsReturnView : activeView) || 'chat')
    setActiveView('settings')
  }, [activeView, settingsReturnView])

  const requestSettingsSectionChange = useCallback(
    (section: SettingsSection) => {
      if (activeSettingsSection === 'chat' && section !== 'chat' && isSettingsChatDirty) {
        setPendingSettingsNavigation({ type: 'section', section })
        return
      }

      setActiveSettingsSection(section)
    },
    [activeSettingsSection, isSettingsChatDirty],
  )

  const backFromSettings = useCallback(() => {
    if (activeSettingsSection === 'chat' && isSettingsChatDirty) {
      setPendingSettingsNavigation({ type: 'back' })
      return
    }

    setActiveView(settingsReturnView === 'settings' ? 'chat' : settingsReturnView)
  }, [activeSettingsSection, isSettingsChatDirty, settingsReturnView])

  const resolveSettingsChatLeave = useCallback(() => {
    if (!pendingSettingsNavigation) {
      return
    }

    if (pendingSettingsNavigation.type === 'section') {
      setActiveSettingsSection(pendingSettingsNavigation.section)
    } else {
      setActiveView(settingsReturnView === 'settings' ? 'chat' : settingsReturnView)
    }

    setPendingSettingsNavigation(null)
  }, [pendingSettingsNavigation, settingsReturnView])

  const login = useCallback(() => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true')
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
    setIsSidebarCollapsed(false)
    setActiveView('chat')
    setActiveSettingsSection('model')
    setIsSearchOpen(false)
    setIsSearchClosing(false)
    setSearchQuery('')
    setMessages([])
    setChatError(null)
    setPendingConversationIds([])
    activeConversationIdRef.current = null
    setConversations((currentConversations) =>
      currentConversations.map((conversation) => ({
        ...conversation,
        active: false,
      })),
    )
  }, [])

  const openSearch = useCallback(() => {
    setSearchQuery('')
    setIsSearchClosing(false)
    setIsSearchOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    if (!isSearchOpen || isSearchClosing) {
      return
    }

    setIsSearchClosing(true)
  }, [isSearchClosing, isSearchOpen])

  const completeSearchClose = useCallback(() => {
    setIsSearchOpen(false)
    setIsSearchClosing(false)
    setSearchQuery('')
  }, [])

  const selectConversation = useCallback(
    (conversationId: string) => {
      const selectedConversation = conversations.find(
        (conversation) => conversation.id === conversationId,
      )

      if (!selectedConversation) {
        return
      }

      setActiveView('chat')
      setMessages(selectedConversation.messages)
      activeConversationIdRef.current = selectedConversation.id
      setChatError(null)
      setConversations((currentConversations) =>
        currentConversations.map((conversation) => ({
          ...conversation,
          active: conversation.id === conversationId,
        })),
      )
    },
    [conversations],
  )

  const selectConversationFromSearch = useCallback(
    (conversationId: string) => {
      selectConversation(conversationId)
      closeSearch()
    },
    [closeSearch, selectConversation],
  )

  const saveChatScrollPosition = useCallback((conversationId: string, scrollTop: number) => {
    if (!conversationId) {
      return
    }

    setChatScrollPositions((currentPositions) => {
      const nextScrollTop = Math.round(scrollTop)

      if (currentPositions[conversationId] === nextScrollTop) {
        return currentPositions
      }

      return {
        ...currentPositions,
        [conversationId]: nextScrollTop,
      }
    })
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      setActiveView('chat')
      if (!window.__TAURI_INTERNALS__) {
        setChatError('请在桌面端运行，本地浏览器预览无法调用 Tauri 后端。')
        return
      }

      const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }]
      const activeConversation = conversations.find((conversation) => conversation.active)
      const currentConversationId = activeConversation?.id ?? `conversation-${Date.now()}`
      activeConversationIdRef.current = currentConversationId

      setConversations((currentConversations) => {
        if (activeConversation) {
          return currentConversations.map((conversation) =>
            conversation.id === activeConversation.id
              ? {
                  ...conversation,
                  messages: nextMessages,
                }
              : conversation,
          )
        }

        return [
          {
            id: currentConversationId,
            title: createConversationTitle(content),
            active: true,
            createdAt: Date.now(),
            messages: nextMessages,
          },
          ...currentConversations,
        ]
      })
      setMessages(nextMessages)
      setChatError(null)
      setPendingConversationIds((currentIds) =>
        currentIds.includes(currentConversationId) ? currentIds : [...currentIds, currentConversationId],
      )
      const replyStartedAt = Date.now()
      const requestId = `qwen-${replyStartedAt}-${Math.random().toString(36).slice(2)}`
      let unlistenChunk: (() => void) | undefined
      let elapsedTimer: number | undefined
      let replyContent = ''
      let replyMessages = nextMessages

      const syncReplyMessage = () => {
        if (!replyContent) {
          return
        }

        const processedSeconds = Math.max(1, Math.ceil((Date.now() - replyStartedAt) / 1000))
        replyMessages = [
          ...nextMessages,
          {
            role: 'assistant',
            content: replyContent,
            processedSeconds,
          },
        ]

        if (activeConversationIdRef.current === currentConversationId) {
          setMessages(replyMessages)
        }
        setConversations((currentConversations) =>
          currentConversations.map((conversation) =>
            conversation.id === currentConversationId
              ? {
                  ...conversation,
                  messages: replyMessages,
                }
              : conversation,
          ),
        )
      }

      try {
        unlistenChunk = await listen<QwenStreamChunk>('qwen-message-chunk', (event) => {
          if (event.payload.requestId !== requestId) {
            return
          }

          replyContent += event.payload.content
          syncReplyMessage()
        })

        elapsedTimer = window.setInterval(syncReplyMessage, 500)

        const reply = await invoke<QwenStreamResult>('send_qwen_message_stream', {
          messages: nextMessages,
          requestId,
        })
        if (reply.content.length > replyContent.length) {
          replyContent = reply.content
        }
        syncReplyMessage()
      } catch (error) {
        if (activeConversationIdRef.current === currentConversationId) {
          setChatError(error instanceof Error ? error.message : String(error))
        }
      } finally {
        unlistenChunk?.()
        if (elapsedTimer !== undefined) {
          window.clearInterval(elapsedTimer)
        }
        setPendingConversationIds((currentIds) =>
          currentIds.filter((conversationId) => conversationId !== currentConversationId),
        )
      }
    },
    [conversations, createConversationTitle, messages],
  )

  if (!isAuthenticated) {
    return <LoginShell onLogin={login} />
  }

  return (
    <div className={workspaceClassName}>
      <Sidebar
        conversations={conversations}
        now={now}
        activeView={activeView}
        activeSettingsSection={activeSettingsSection}
        onNewChat={startNewChat}
        onSearch={openSearch}
        onOpenMessagePlatform={() => setActiveView('message-platform')}
        onOpenSkills={() => setActiveView('skills')}
        onOpenScheduledTasks={() => setActiveView('scheduled-tasks')}
        onOpenFileLibrary={() => setActiveView('file-library')}
        onOpenSettings={openSettings}
        onSettingsSectionChange={requestSettingsSectionChange}
        onBackFromSettings={backFromSettings}
        onSelectConversation={selectConversation}
      />
      <GlobalTitleBar
        activeView={activeView}
        isSidebarCollapsed={isSidebarCollapsed}
        activeConversationId={activeConversationId}
        activeConversationTitle={activeConversation?.title ?? ''}
        activeConversationMessages={messages}
        hasChat={Boolean(activeConversation && (messages.length > 0 || isActiveConversationSending || chatError))}
        isSkillsTitleDocked={isSkillsTitleDocked}
        activeSkillsSection={activeSkillsSection}
        onActiveSkillsSectionChange={setActiveSkillsSection}
        isScheduledTitleDocked={isScheduledTitleDocked}
        onScheduledCreateChat={startNewChat}
        platformTitlebar={platformTitlebar}
        fileLibraryTitlebar={fileLibraryTitlebar}
        settingsTitlebar={settingsTitlebar}
        isChatRightPanelOpen={isChatRightPanelOpen}
        onPlatformTitleSwitchToggle={togglePlatformFromTitlebar}
        onConversationTitleRename={renameActiveConversation}
        onConversationTitleToast={showAppToast}
        onToggleChatRightPanel={() => setIsChatRightPanelOpen((isOpen) => !isOpen)}
        onToggleSidebar={() => setIsSidebarCollapsed((isCollapsed) => !isCollapsed)}
      />
      <Content
        activeView={activeView}
        activeSettingsSection={activeSettingsSection}
        activeSkillsSection={activeSkillsSection}
        onActiveSkillsSectionChange={setActiveSkillsSection}
        onStartNewChat={startNewChat}
        onSkillsTitleDockedChange={setIsSkillsTitleDocked}
        onScheduledTitleDockedChange={setIsScheduledTitleDocked}
        onSettingsTitlebarChange={setSettingsTitlebar}
        onPlatformTitlebarChange={setPlatformTitlebar}
        onFileLibraryTitlebarChange={setFileLibraryTitlebar}
        onLogout={logout}
        onLanguageChange={setLanguage}
        language={language}
        onSettingsChatDirtyChange={setIsSettingsChatDirty}
        isSettingsChatLeaveConfirmOpen={pendingSettingsNavigation !== null}
        onResolveSettingsChatLeave={resolveSettingsChatLeave}
        activeConversationId={activeConversationId}
        messages={messages}
        isSending={isActiveConversationSending}
        error={chatError}
        chatScrollTop={activeChatScrollTop}
        onChatScrollPositionChange={saveChatScrollPosition}
        onSendMessage={sendMessage}
        isChatRightPanelOpen={isChatRightPanelOpen}
      />
      {isSearchOpen ? (
        <SearchDialog
          conversations={conversations}
          query={searchQuery}
          isClosing={isSearchClosing}
          onQueryChange={setSearchQuery}
          onClose={closeSearch}
          onExitComplete={completeSearchClose}
          onSelectConversation={selectConversationFromSearch}
        />
      ) : null}
      <AppToast toast={appToast} onClose={closeAppToast} />
    </div>
  )
}

export default App

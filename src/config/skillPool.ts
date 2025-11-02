/**
 * 技能配置檔案
 *
 * 注意：此檔案已重構，不再包含預設技能池
 * - 技能標籤現在完全由 AI 動態生成（API: POST /api/tasks/generate-skill-tags）
 * - 僅保留屬性定義
 * - 所有技能統一使用預設 icon ⭐
 */

/**
 * 獲取所有屬性列表
 * icon 使用 Lucide 圖示名稱
 */
export const ATTRIBUTES = [
  { key: 'intelligence', label: '智力', icon: 'Brain', color: 'blue' },
  { key: 'endurance', label: '毅力', icon: 'Dumbbell', color: 'red' },
  { key: 'creativity', label: '創造力', icon: 'Palette', color: 'purple' },
  { key: 'social', label: '社交力', icon: 'Users', color: 'green' },
  { key: 'focus', label: '專注力', icon: 'Target', color: 'yellow' },
  { key: 'adaptability', label: '適應力', icon: 'RefreshCw', color: 'indigo' },
  { key: 'general', label: '日常技能包', icon: 'Star', color: 'gray' }
] as const

/**
 * 預設技能圖示（Lucide 圖示名稱）
 */
export const DEFAULT_SKILL_ICON = 'Star'

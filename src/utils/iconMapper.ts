/**
 * 圖示映射工具
 * 將圖示名稱字串映射到 Lucide Vue 圖示元件
 */

import {
  Star,
  Code2,
  Palette,
  MessageSquare,
  Clock,
  Crown,
  Brain,
  Dumbbell,
  Users,
  Target,
  RefreshCw,
  type LucideIcon
} from 'lucide-vue-next'

// 圖示映射表
const iconMap: Record<string, LucideIcon> = {
  // 技能類型圖示
  'Star': Star,
  'Code2': Code2,
  'Palette': Palette,
  'MessageSquare': MessageSquare,
  'Clock': Clock,
  'Crown': Crown,

  // 屬性圖示
  'Brain': Brain,
  'Dumbbell': Dumbbell,
  'Users': Users,
  'Target': Target,
  'RefreshCw': RefreshCw,

  // 向後相容：保留 emoji 作為 fallback
  '⭐': Star,
  '🐍': Code2,
  '🟨': Code2,
  '💻': Code2,
  '🎨': Palette,
  '💬': MessageSquare,
  '⏰': Clock,
  '👑': Crown,
  '🧠': Brain,
  '💪': Dumbbell,
  '👥': Users,
  '🎯': Target,
  '🔄': RefreshCw,
}

/**
 * 根據圖示名稱獲取對應的 Lucide 圖示元件
 * @param iconName - 圖示名稱（如 'Star', 'Code2'）或 emoji
 * @returns Lucide 圖示元件
 */
export function getIconComponent(iconName?: string): LucideIcon {
  if (!iconName) return Star // 預設圖示

  // 如果映射表中有對應的圖示，返回它
  if (iconMap[iconName]) {
    return iconMap[iconName]
  }

  // 否則返回預設圖示
  return Star
}

/**
 * 檢查圖示名稱是否有效
 * @param iconName - 圖示名稱
 * @returns 是否為有效圖示
 */
export function isValidIcon(iconName: string): boolean {
  return iconName in iconMap
}

/**
 * 獲取所有可用的圖示名稱
 * @returns 圖示名稱陣列
 */
export function getAvailableIcons(): string[] {
  return Object.keys(iconMap).filter(key => !key.match(/[\u{1F300}-\u{1F9FF}]/u)) // 排除 emoji
}

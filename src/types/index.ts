// 用戶相關類型
export interface User {
  id: string;
  name: string;
  level: number;
  experience: number;
  maxExperience: number;
  title: string;
  adventureDays: number;
  consecutiveLoginDays: number;
  attributes: UserAttributes;
  personaType: 'internal' | 'external';
}

// 六大核心屬性
export interface UserAttributes {
  intelligence: number;    // 智力
  endurance: number;      // 毅力  
  creativity: number;     // 創造力
  social: number;         // 社交力
  focus: number;          // 專注力
  adaptability: number;   // 適應力
}

// 技能相關類型
export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft';
  level: number;
  experience: number;
  maxExperience: number;
  icon: string;
  description?: string;
}

// 任務相關類型
export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'main' | 'side' | 'challenge' | 'daily' | 'subtask';
  difficulty: 1 | 2 | 3 | 4 | 5;
  experience: number;
  estimatedTime?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'paused' | 'cancelled' | 'daily_in_progress' | 'daily_completed';
  deadline?: Date;
  scheduled_time?: string; // 預定時間
  attributes?: Partial<UserAttributes>;
  // 任務層級相關
  parent_task_id?: string;
  parent_task_title?: string; // 父任務標題
  is_parent_task?: boolean;
  task_order?: number;
  // 取消計數相關
  cancel_count?: number;
  last_cancelled_at?: string;
  // 父任務狀態（用於子任務）
  parentTaskStatus?: 'pending' | 'in_progress' | 'completed' | 'paused' | 'cancelled' | 'daily_in_progress' | 'daily_completed';
  // 任務進度相關
  progress?: TaskProgress;
}

// 任務進度類型
export interface TaskProgress {
  task_id: string;
  total_days: number;
  completed_days: number;
  missed_days: number;
  completion_rate: number;
  target_rate: number;
  is_daily_completed: boolean;
  remaining_days: number;
}

// AI教練相關類型
export interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

export interface CoachStyle {
  type: 'gentle' | 'challenging' | 'creative';
  name: string;
  description: string;
}
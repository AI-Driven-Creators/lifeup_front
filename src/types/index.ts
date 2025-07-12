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
  type: 'main' | 'side' | 'challenge' | 'daily';
  difficulty: 1 | 2 | 3 | 4 | 5;
  experience: number;
  estimatedTime?: string;
  status: 'pending' | 'in_progress' | 'completed';
  deadline?: Date;
  attributes?: Partial<UserAttributes>;
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
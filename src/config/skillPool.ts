/**
 * 預設技能池配置
 * 按六大核心屬性分類，每個技能對應到特定屬性
 */

export interface SkillTemplate {
  id: string
  name: string
  category: 'technical' | 'soft'
  attribute: 'intelligence' | 'endurance' | 'creativity' | 'social' | 'focus' | 'adaptability'
  icon: string
  description: string
  keywords: string[] // 用於任務匹配的關鍵字
}

export const SKILL_POOL: SkillTemplate[] = [
  // ==================== 智力 (Intelligence) ====================
  {
    id: 'skill_python',
    name: 'Python 程式設計',
    category: 'technical',
    attribute: 'intelligence',
    icon: '🐍',
    description: '學習 Python 程式語言及其應用',
    keywords: ['python', 'py', '程式', '編程', '開發', 'code', 'coding']
  },
  {
    id: 'skill_javascript',
    name: 'JavaScript 開發',
    category: 'technical',
    attribute: 'intelligence',
    icon: '🟨',
    description: '掌握 JavaScript 與前端開發技術',
    keywords: ['javascript', 'js', 'typescript', 'ts', '前端', 'frontend', 'web']
  },
  {
    id: 'skill_backend',
    name: '後端開發',
    category: 'technical',
    attribute: 'intelligence',
    icon: '⚙️',
    description: '後端架構設計與 API 開發',
    keywords: ['後端', 'backend', 'api', 'server', '伺服器', 'database', '資料庫']
  },
  {
    id: 'skill_data_analysis',
    name: '資料分析',
    category: 'technical',
    attribute: 'intelligence',
    icon: '📊',
    description: '數據分析與視覺化技能',
    keywords: ['資料', '數據', 'data', '分析', 'analysis', '統計', 'statistics']
  },
  {
    id: 'skill_machine_learning',
    name: '機器學習',
    category: 'technical',
    attribute: 'intelligence',
    icon: '🤖',
    description: 'AI 與機器學習技術',
    keywords: ['機器學習', 'machine learning', 'ml', 'ai', '人工智慧', 'deep learning']
  },
  {
    id: 'skill_english',
    name: '英語能力',
    category: 'soft',
    attribute: 'intelligence',
    icon: '🇬🇧',
    description: '英語聽說讀寫能力提升',
    keywords: ['英語', '英文', 'english', 'toeic', 'ielts', 'toefl']
  },
  {
    id: 'skill_academic_writing',
    name: '學術寫作',
    category: 'soft',
    attribute: 'intelligence',
    icon: '📝',
    description: '論文與學術文章撰寫',
    keywords: ['論文', '學術', 'paper', 'research', '研究', '寫作']
  },

  // ==================== 毅力 (Endurance) ====================
  {
    id: 'skill_running',
    name: '跑步訓練',
    category: 'soft',
    attribute: 'endurance',
    icon: '🏃',
    description: '提升跑步耐力與體能',
    keywords: ['跑步', 'running', '慢跑', '路跑', '馬拉松', 'marathon']
  },
  {
    id: 'skill_gym',
    name: '重量訓練',
    category: 'soft',
    attribute: 'endurance',
    icon: '💪',
    description: '肌力與體能訓練',
    keywords: ['重訓', '健身', 'gym', '肌力', '體能', 'workout']
  },
  {
    id: 'skill_yoga',
    name: '瑜伽練習',
    category: 'soft',
    attribute: 'endurance',
    icon: '🧘',
    description: '身心平衡與柔軟度訓練',
    keywords: ['瑜伽', 'yoga', '伸展', '柔軟度']
  },
  {
    id: 'skill_reading',
    name: '閱讀習慣',
    category: 'soft',
    attribute: 'endurance',
    icon: '📚',
    description: '培養持續閱讀的習慣',
    keywords: ['閱讀', 'reading', '看書', '書籍']
  },
  {
    id: 'skill_meditation',
    name: '冥想練習',
    category: 'soft',
    attribute: 'endurance',
    icon: '🧘‍♀️',
    description: '正念冥想與心靈訓練',
    keywords: ['冥想', 'meditation', '正念', 'mindfulness']
  },
  {
    id: 'skill_early_rising',
    name: '早起習慣',
    category: 'soft',
    attribute: 'endurance',
    icon: '🌅',
    description: '養成早起的生活作息',
    keywords: ['早起', '早睡', '作息', '睡眠']
  },
  {
    id: 'skill_diet',
    name: '飲食管理',
    category: 'soft',
    attribute: 'endurance',
    icon: '🥗',
    description: '健康飲食習慣養成',
    keywords: ['飲食', '營養', 'diet', '健康', '減重', '減肥']
  },

  // ==================== 創造力 (Creativity) ====================
  {
    id: 'skill_ui_design',
    name: 'UI/UX 設計',
    category: 'technical',
    attribute: 'creativity',
    icon: '🎨',
    description: '使用者介面與體驗設計',
    keywords: ['ui', 'ux', '設計', 'design', 'figma', 'sketch']
  },
  {
    id: 'skill_graphic_design',
    name: '平面設計',
    category: 'technical',
    attribute: 'creativity',
    icon: '🖼️',
    description: '視覺設計與平面創作',
    keywords: ['平面', 'graphic', '視覺', 'photoshop', 'illustrator']
  },
  {
    id: 'skill_illustration',
    name: '插畫繪製',
    category: 'technical',
    attribute: 'creativity',
    icon: '✏️',
    description: '數位與手繪插畫技巧',
    keywords: ['插畫', 'illustration', '繪畫', '畫畫', 'drawing']
  },
  {
    id: 'skill_photography',
    name: '攝影技巧',
    category: 'technical',
    attribute: 'creativity',
    icon: '📷',
    description: '攝影構圖與後製技術',
    keywords: ['攝影', 'photography', '拍照', '相機']
  },
  {
    id: 'skill_music',
    name: '音樂創作',
    category: 'soft',
    attribute: 'creativity',
    icon: '🎵',
    description: '樂器演奏與音樂創作',
    keywords: ['音樂', 'music', '樂器', '吉他', '鋼琴', '唱歌']
  },
  {
    id: 'skill_writing',
    name: '創意寫作',
    category: 'soft',
    attribute: 'creativity',
    icon: '✍️',
    description: '小說、散文與創作文字',
    keywords: ['寫作', 'writing', '創作', '小說', '文章', '部落格']
  },
  {
    id: 'skill_video_editing',
    name: '影片剪輯',
    category: 'technical',
    attribute: 'creativity',
    icon: '🎬',
    description: '影片製作與剪輯技術',
    keywords: ['剪輯', 'video', '影片', '剪片', 'premiere', 'editing']
  },

  // ==================== 社交力 (Social) ====================
  {
    id: 'skill_presentation',
    name: '簡報技巧',
    category: 'soft',
    attribute: 'social',
    icon: '📊',
    description: '有效溝通與簡報表達',
    keywords: ['簡報', 'presentation', 'ppt', '演講', '報告']
  },
  {
    id: 'skill_public_speaking',
    name: '公開演講',
    category: 'soft',
    attribute: 'social',
    icon: '🎤',
    description: '公開場合演說能力',
    keywords: ['演講', 'speaking', '演說', '上台']
  },
  {
    id: 'skill_negotiation',
    name: '談判協商',
    category: 'soft',
    attribute: 'social',
    icon: '🤝',
    description: '商務談判與協調技巧',
    keywords: ['談判', 'negotiation', '協商', '溝通']
  },
  {
    id: 'skill_teamwork',
    name: '團隊協作',
    category: 'soft',
    attribute: 'social',
    icon: '👥',
    description: '團隊合作與協調能力',
    keywords: ['團隊', 'team', '協作', 'collaboration', '合作']
  },
  {
    id: 'skill_leadership',
    name: '領導能力',
    category: 'soft',
    attribute: 'social',
    icon: '👑',
    description: '團隊領導與管理技能',
    keywords: ['領導', 'leadership', '管理', 'management']
  },
  {
    id: 'skill_social_media',
    name: '社群經營',
    category: 'technical',
    attribute: 'social',
    icon: '📱',
    description: '社群媒體內容經營',
    keywords: ['社群', 'social media', 'ig', 'facebook', '小紅書', '經營']
  },
  {
    id: 'skill_networking',
    name: '人際網絡',
    category: 'soft',
    attribute: 'social',
    icon: '🌐',
    description: '建立與維護人際關係',
    keywords: ['人際', 'networking', '社交', '交友']
  },

  // ==================== 專注力 (Focus) ====================
  {
    id: 'skill_time_management',
    name: '時間管理',
    category: 'soft',
    attribute: 'focus',
    icon: '⏰',
    description: '有效規劃與管理時間',
    keywords: ['時間', 'time', '管理', 'management', 'gtd', '番茄']
  },
  {
    id: 'skill_deep_work',
    name: '深度工作',
    category: 'soft',
    attribute: 'focus',
    icon: '🎯',
    description: '培養專注力與深度思考',
    keywords: ['專注', 'focus', '深度', 'deep work', '心流']
  },
  {
    id: 'skill_note_taking',
    name: '筆記整理',
    category: 'soft',
    attribute: 'focus',
    icon: '📓',
    description: '有效的筆記與知識管理',
    keywords: ['筆記', 'note', '整理', 'notion', 'obsidian']
  },
  {
    id: 'skill_prioritization',
    name: '優先順序管理',
    category: 'soft',
    attribute: 'focus',
    icon: '📋',
    description: '任務優先順序判斷',
    keywords: ['優先', 'priority', '重要', 'urgent']
  },
  {
    id: 'skill_pomodoro',
    name: '番茄工作法',
    category: 'soft',
    attribute: 'focus',
    icon: '🍅',
    description: '運用番茄鐘提升效率',
    keywords: ['番茄', 'pomodoro', '工作法', '時間塊']
  },
  {
    id: 'skill_distraction_management',
    name: '干擾管理',
    category: 'soft',
    attribute: 'focus',
    icon: '🔕',
    description: '減少干擾，保持專注',
    keywords: ['干擾', 'distraction', '專心', '分心']
  },

  // ==================== 適應力 (Adaptability) ====================
  {
    id: 'skill_problem_solving',
    name: '問題解決',
    category: 'soft',
    attribute: 'adaptability',
    icon: '🧩',
    description: '系統化分析與解決問題',
    keywords: ['問題', 'problem', '解決', 'solving', '思考']
  },
  {
    id: 'skill_critical_thinking',
    name: '批判性思考',
    category: 'soft',
    attribute: 'adaptability',
    icon: '🤔',
    description: '邏輯分析與批判思維',
    keywords: ['批判', 'critical', '思考', 'thinking', '邏輯']
  },
  {
    id: 'skill_stress_management',
    name: '壓力調適',
    category: 'soft',
    attribute: 'adaptability',
    icon: '😌',
    description: '情緒管理與壓力釋放',
    keywords: ['壓力', 'stress', '情緒', '調適', '管理']
  },
  {
    id: 'skill_learning_agility',
    name: '學習敏捷度',
    category: 'soft',
    attribute: 'adaptability',
    icon: '🚀',
    description: '快速學習新知識與技能',
    keywords: ['學習', 'learning', '快速', '敏捷']
  },
  {
    id: 'skill_decision_making',
    name: '決策能力',
    category: 'soft',
    attribute: 'adaptability',
    icon: '⚖️',
    description: '有效做出明智決策',
    keywords: ['決策', 'decision', '判斷', '選擇']
  },
  {
    id: 'skill_innovation',
    name: '創新思維',
    category: 'soft',
    attribute: 'adaptability',
    icon: '💡',
    description: '跨領域整合與創新',
    keywords: ['創新', 'innovation', '創意', '突破']
  },
  {
    id: 'skill_change_management',
    name: '變革適應',
    category: 'soft',
    attribute: 'adaptability',
    icon: '🔄',
    description: '適應環境變化的能力',
    keywords: ['變革', 'change', '適應', '轉變']
  }
]

/**
 * 根據任務標題和描述，推薦相關技能
 * @param taskTitle 任務標題
 * @param taskDescription 任務描述
 * @returns 推薦的技能ID列表
 */
export function suggestSkillsForTask(taskTitle: string, taskDescription: string = ''): string[] {
  const text = `${taskTitle} ${taskDescription}`.toLowerCase()
  const matchedSkills: { skillId: string; matchCount: number }[] = []

  SKILL_POOL.forEach(skill => {
    let matchCount = 0
    skill.keywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        matchCount++
      }
    })
    if (matchCount > 0) {
      matchedSkills.push({ skillId: skill.id, matchCount })
    }
  })

  // 按匹配數排序，返回前3個最相關的技能
  return matchedSkills
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 3)
    .map(item => item.skillId)
}

/**
 * 根據技能ID獲取技能模板
 */
export function getSkillTemplate(skillId: string): SkillTemplate | undefined {
  return SKILL_POOL.find(skill => skill.id === skillId)
}

/**
 * 根據技能名稱獲取技能模板
 */
export function getSkillTemplateByName(skillName: string): SkillTemplate | undefined {
  return SKILL_POOL.find(skill => skill.name === skillName)
}

/**
 * 按屬性分組技能
 */
export function getSkillsByAttribute(attribute: string): SkillTemplate[] {
  return SKILL_POOL.filter(skill => skill.attribute === attribute)
}

/**
 * 獲取所有屬性列表
 */
export const ATTRIBUTES = [
  { key: 'intelligence', label: '智力', icon: '🧠', color: 'blue' },
  { key: 'endurance', label: '毅力', icon: '💪', color: 'red' },
  { key: 'creativity', label: '創造力', icon: '🎨', color: 'purple' },
  { key: 'social', label: '社交力', icon: '👥', color: 'green' },
  { key: 'focus', label: '專注力', icon: '🎯', color: 'yellow' },
  { key: 'adaptability', label: '適應力', icon: '🔄', color: 'indigo' }
] as const

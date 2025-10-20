/**
 * 預設技能池配置
 * 按六大核心屬性 + 第七屬性（通用）分類
 */

export interface SkillTemplate {
  id: string
  name: string
  category: 'technical' | 'soft'
  attribute: 'intelligence' | 'endurance' | 'creativity' | 'social' | 'focus' | 'adaptability' | 'general'
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
    name: '簡報演講',
    category: 'soft',
    attribute: 'social',
    icon: '🎤',
    description: '簡報製作與公開演說能力',
    keywords: ['簡報', 'presentation', 'ppt', '演講', 'speaking', '演說', '上台', '報告']
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

  // ==================== 專注力 (Focus) ====================
  {
    id: 'skill_time_management',
    name: '時間管理',
    category: 'soft',
    attribute: 'focus',
    icon: '⏰',
    description: '有效規劃與管理時間',
    keywords: ['時間', 'time', '管理', 'management', 'gtd', '番茄', 'pomodoro', '工作法', '時間塊']
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
    id: 'skill_distraction_management',
    name: '干擾管理',
    category: 'soft',
    attribute: 'focus',
    icon: '🔕',
    description: '減少干擾，保持專注',
    keywords: ['干擾', 'distraction', '專心', '分心']
  },
  {
    id: 'skill_goal_setting',
    name: '目標設定',
    category: 'soft',
    attribute: 'focus',
    icon: '🎯',
    description: '設定清晰目標與追蹤進度',
    keywords: ['目標', 'goal', '設定', 'setting', '追蹤', 'tracking', 'okr', 'kpi']
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
  },
  {
    id: 'skill_meditation',
    name: '冥想練習',
    category: 'soft',
    attribute: 'adaptability',
    icon: '🧘‍♀️',
    description: '正念冥想與心靈訓練',
    keywords: ['冥想', 'meditation', '正念', 'mindfulness']
  },

  // ==================== 通用技能（第七屬性 - 生活日常） ====================
  // 涵蓋更廣泛的生活層面，當任務無法匹配到具體技能時使用
  {
    id: 'skill_general_learning',
    name: '學習成長',
    category: 'soft',
    attribute: 'general',
    icon: '📚',
    description: '學習、閱讀、進修等知識獲取活動',
    keywords: ['學習', '閱讀', '看書', '進修', '課程', '讀書', '自學', '學', '書']
  },
  {
    id: 'skill_general_work',
    name: '工作事務',
    category: 'soft',
    attribute: 'general',
    icon: '💼',
    description: '工作相關任務、專案、會議等',
    keywords: ['工作', '任務', '會議', 'meeting', '上班', '專案', 'project', '職場', '業務']
  },
  {
    id: 'skill_general_exercise',
    name: '運動健身',
    category: 'soft',
    attribute: 'general',
    icon: '🏃',
    description: '各種運動、健身、體能訓練',
    keywords: ['運動', '健身', '體能', '鍛鍊', '訓練', '活動', '散步', '爬山', '游泳', '球']
  },
  {
    id: 'skill_general_hobby',
    name: '創作娛樂',
    category: 'soft',
    attribute: 'general',
    icon: '🎨',
    description: '藝術創作、興趣愛好、娛樂活動',
    keywords: ['娛樂', '興趣', '愛好', '休閒', '玩', '看電影', '追劇', '遊戲', '旅行', '旅遊']
  },
  {
    id: 'skill_general_housework',
    name: '生活家務',
    category: 'soft',
    attribute: 'general',
    icon: '🏠',
    description: '打掃、整理、採購、煮飯等日常家務',
    keywords: ['打掃', '掃除', '整理', '清潔', '洗衣', '晾衣', '買菜', '採購', '煮飯', '做飯', '烹飪', '料理', '家務', '家事']
  },
  {
    id: 'skill_general_social',
    name: '社交互動',
    category: 'soft',
    attribute: 'general',
    icon: '👥',
    description: '聚會、交友、維繫關係',
    keywords: ['聚會', '聚餐', '約會', '見面', '拜訪', '探訪', '關係', '朋友', '家人', '聯絡', '問候']
  },
  {
    id: 'skill_general_health',
    name: '健康保養',
    category: 'soft',
    attribute: 'general',
    icon: '💆',
    description: '身心健康、休息、保養、醫療',
    keywords: ['健康', '保養', '休息', '睡眠', '看醫生', '看診', '就醫', '體檢', '檢查', '治療', '按摩', '放鬆']
  },
  {
    id: 'skill_general_finance',
    name: '理財規劃',
    category: 'soft',
    attribute: 'general',
    icon: '💰',
    description: '記帳、投資、財務管理',
    keywords: ['理財', '財務', '金錢', '記帳', '帳單', '繳費', '投資', '存錢', '儲蓄', '預算', '開銷', '花費', '錢']
  },
  {
    id: 'skill_general_personal',
    name: '個人發展',
    category: 'soft',
    attribute: 'general',
    icon: '🌱',
    description: '自我探索、習慣養成、目標規劃',
    keywords: ['目標', '計畫', '規劃', '習慣', '成長', '發展', '自我', '反思', '檢討', '改善']
  },
  {
    id: 'skill_general_project',
    name: '專案計畫',
    category: 'soft',
    attribute: 'general',
    icon: '🎯',
    description: '需要長期執行的專案或計畫',
    keywords: ['專案', 'project', '計畫', 'plan', '企劃', '方案', '提案']
  },
  {
    id: 'skill_general_admin',
    name: '行政事務',
    category: 'soft',
    attribute: 'general',
    icon: '📝',
    description: '文書處理、申請手續、繳費等',
    keywords: ['申請', '手續', '文件', '資料', '表格', '填寫', '辦理', '證件', '行政']
  }
]

/**
 * 根據任務標題和描述，推薦相關技能
 * 使用加權評分系統，提升匹配準確度
 * 包含所有技能（六大屬性 + 通用技能）的關鍵字匹配
 * 如果無法匹配到任何技能，會自動返回預設的通用技能作為後備
 * @param taskTitle 任務標題
 * @param taskDescription 任務描述
 * @returns 推薦的技能ID列表（至少返回一個）
 */
export function suggestSkillsForTask(
  taskTitle: string,
  taskDescription: string = ''
): string[] {
  const title = taskTitle.toLowerCase().trim()
  const description = taskDescription.toLowerCase().trim()

  // 如果標題為空，返回預設的通用技能
  if (!title) {
    return ['skill_general_personal']
  }

  const matchedSkills: { skillId: string; score: number }[] = []

  SKILL_POOL.forEach(skill => {
    let score = 0

    // 先檢查技能名稱是否直接出現在任務中（最高優先級）
    const skillNameLower = skill.name.toLowerCase()
    if (title.includes(skillNameLower)) {
      score += 5.0  // 標題包含技能名稱，給予最高分
    }
    if (description && description.includes(skillNameLower)) {
      score += 2.5  // 描述包含技能名稱
    }

    // 關鍵字匹配（加權評分）
    skill.keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase()

      // === 標題匹配（權重較高） ===

      // 完全匹配（整個標題 = 關鍵字）
      if (title === lowerKeyword) {
        score += 4.0
      }
      // 標題包含關鍵字（完整匹配）
      else if (title.includes(lowerKeyword)) {
        score += 2.5
      }
      // 標題的部分匹配（模糊匹配）
      else if (containsPartialMatch(title, lowerKeyword)) {
        score += 1.0
      }

      // === 描述匹配（權重較低） ===

      if (description) {
        // 描述完全匹配
        if (description === lowerKeyword) {
          score += 2.0
        }
        // 描述包含關鍵字
        else if (description.includes(lowerKeyword)) {
          score += 1.2
        }
        // 描述的部分匹配
        else if (containsPartialMatch(description, lowerKeyword)) {
          score += 0.6
        }
      }
    })

    // 只保留有分數的技能
    if (score > 0) {
      matchedSkills.push({ skillId: skill.id, score })
    }
  })

  // 按分數排序（由高到低）
  matchedSkills.sort((a, b) => b.score - a.score)

  // 動態決定返回數量：
  // - 如果最高分 >= 5.0：高度相關，返回前3個
  // - 如果最高分 >= 3.0：中度相關，返回前2個
  // - 如果最高分 >= 1.5：低度相關，返回前1個
  // - 分數 < 1.0：過濾掉太弱的匹配
  let returnCount = 1
  if (matchedSkills.length > 0) {
    const topScore = matchedSkills[0].score
    if (topScore >= 5.0) {
      returnCount = 3
    } else if (topScore >= 3.0) {
      returnCount = 2
    }
  }

  // 過濾掉分數過低的技能並限制返回數量
  const filteredSkills = matchedSkills
    .filter(item => item.score >= 1.0)
    .slice(0, Math.min(returnCount, 5))
    .map(item => item.skillId)

  // 如果沒有匹配到任何技能，使用通用技能作為後備
  if (filteredSkills.length === 0) {
    return ['skill_general_personal'] // 預設返回「個人發展」
  }

  return filteredSkills
}

/**
 * 檢查是否包含部分匹配（模糊匹配）
 * 支援詞根匹配和前綴匹配
 * @param text 要搜尋的文本
 * @param keyword 關鍵字
 * @returns 是否匹配
 */
function containsPartialMatch(text: string, keyword: string): boolean {
  // 如果關鍵字太短，不進行部分匹配
  if (keyword.length < 3) {
    return false
  }

  // 1. 前綴匹配：檢查是否包含關鍵字的前幾個字符
  const prefix = keyword.substring(0, Math.min(keyword.length, 4))
  if (text.includes(prefix)) {
    return true
  }

  // 2. 詞根匹配：去除常見英文後綴
  const root = keyword.replace(/(ing|ed|s|er|ion|tion|ness|ment)$/i, '')
  if (root.length >= 3 && root !== keyword && text.includes(root)) {
    return true
  }

  // 3. 中文詞組部分匹配：支援2字以上的中文關鍵字
  if (/[\u4e00-\u9fa5]/.test(keyword) && keyword.length >= 2) {
    // 嘗試匹配關鍵字的前2個字
    const chinesePrefix = keyword.substring(0, 2)
    if (text.includes(chinesePrefix)) {
      return true
    }
  }

  return false
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
 * 獲取所有屬性列表（包含通用屬性）
 */
export const ATTRIBUTES = [
  { key: 'intelligence', label: '智力', icon: '🧠', color: 'blue' },
  { key: 'endurance', label: '毅力', icon: '💪', color: 'red' },
  { key: 'creativity', label: '創造力', icon: '🎨', color: 'purple' },
  { key: 'social', label: '社交力', icon: '👥', color: 'green' },
  { key: 'focus', label: '專注力', icon: '🎯', color: 'yellow' },
  { key: 'adaptability', label: '適應力', icon: '🔄', color: 'indigo' },
  { key: 'general', label: '日常技能包', icon: '⭐', color: 'gray' }
] as const


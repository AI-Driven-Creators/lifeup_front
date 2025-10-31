/**
 * 情境式工作風格測驗數據
 * 基於真實工作場景的選擇題設計
 * 透過具體情境來準確評估工作風格特質
 */

// 工作風格維度定義
export const scenarioWorkStyleDimensions = {
  COGNITIVE_STYLE: '認知風格',
  SOCIAL_ENERGY: '社交能量',
  WORK_ENVIRONMENT: '工作環境',
  COLLABORATION: '協作模式',
  FEEDBACK_NEED: '回饋需求',
  STRESS_RESPONSE: '壓力反應',
  DECISION_MAKING: '決策風格',
  COMMUNICATION: '溝通偏好',
  LEARNING_STYLE: '學習方式',
  TIME_MANAGEMENT: '時間管理'
};

// 風格特質權重定義
export const scenarioStyleTraits = {
  // 認知風格
  analytical_thinking: { name: '分析思維', category: 'COGNITIVE_STYLE' },
  intuitive_thinking: { name: '直覺思維', category: 'COGNITIVE_STYLE' },
  detail_oriented: { name: '細節導向', category: 'COGNITIVE_STYLE' },
  big_picture: { name: '整體思維', category: 'COGNITIVE_STYLE' },
  creative_thinking: { name: '創意思維', category: 'COGNITIVE_STYLE' },
  
  // 社交能量
  extraversion: { name: '外向性', category: 'SOCIAL_ENERGY' },
  introversion: { name: '內向性', category: 'SOCIAL_ENERGY' },
  team_interaction: { name: '團隊互動', category: 'SOCIAL_ENERGY' },
  independent_work: { name: '獨立工作', category: 'SOCIAL_ENERGY' },
  
  // 工作環境
  structured_environment: { name: '結構化環境', category: 'WORK_ENVIRONMENT' },
  flexible_environment: { name: '彈性環境', category: 'WORK_ENVIRONMENT' },
  fast_paced: { name: '快節奏', category: 'WORK_ENVIRONMENT' },
  steady_pace: { name: '穩定節奏', category: 'WORK_ENVIRONMENT' },
  challenge_seeking: { name: '挑戰尋求', category: 'WORK_ENVIRONMENT' },
  
  // 協作模式
  leadership: { name: '領導特質', category: 'COLLABORATION' },
  supportive: { name: '支援角色', category: 'COLLABORATION' },
  collaborative: { name: '協作導向', category: 'COLLABORATION' },
  autonomous: { name: '自主工作', category: 'COLLABORATION' },
  
  // 回饋需求
  frequent_feedback: { name: '頻繁回饋', category: 'FEEDBACK_NEED' },
  periodic_feedback: { name: '定期回饋', category: 'FEEDBACK_NEED' },
  minimal_feedback: { name: '最少回饋', category: 'FEEDBACK_NEED' },
  
  // 壓力反應
  stress_thriving: { name: '壓力激發', category: 'STRESS_RESPONSE' },
  stress_managing: { name: '壓力管理', category: 'STRESS_RESPONSE' },
  stress_avoiding: { name: '壓力規避', category: 'STRESS_RESPONSE' },
  
  // 決策風格
  quick_decision: { name: '快速決策', category: 'DECISION_MAKING' },
  deliberate_decision: { name: '深思決策', category: 'DECISION_MAKING' },
  data_driven: { name: '數據導向', category: 'DECISION_MAKING' },
  experience_based: { name: '經驗導向', category: 'DECISION_MAKING' },
  
  // 溝通偏好
  verbal_communication: { name: '口語溝通', category: 'COMMUNICATION' },
  written_communication: { name: '書面溝通', category: 'COMMUNICATION' },
  visual_communication: { name: '視覺溝通', category: 'COMMUNICATION' },
  
  // 學習方式
  hands_on_learning: { name: '實作學習', category: 'LEARNING_STYLE' },
  theoretical_learning: { name: '理論學習', category: 'LEARNING_STYLE' },
  collaborative_learning: { name: '協作學習', category: 'LEARNING_STYLE' },
  
  // 時間管理
  deadline_driven: { name: '截止導向', category: 'TIME_MANAGEMENT' },
  steady_progress: { name: '穩步推進', category: 'TIME_MANAGEMENT' },
  flexible_scheduling: { name: '彈性排程', category: 'TIME_MANAGEMENT' }
};

// 情境式工作風格測驗題目 (30題)
export const scenarioWorkStyleQuestions = [
  // 認知風格 - 問題解決情境 (5題)
  {
    id: 1,
    category: scenarioWorkStyleDimensions.COGNITIVE_STYLE,
    subcategory: '問題解決',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "系統當機緊急處理",
      context: "你負責的重要系統突然當機，影響了整個公司的運作",
      situation: "距離重要客戶展示只有2小時，系統必須儘快恢復運作。"
    },
    
    question: "在這種緊急情況下，你的第一反應是什麼？",
    
    options: [
      {
        text: "立即檢查系統日誌，分析可能的錯誤原因",
        description: "透過數據分析找出問題根源",
        traits: {
          analytical_thinking: 3,
          detail_oriented: 2,
          data_driven: 2
        }
      },
      {
        text: "根據經驗快速嘗試幾個最可能的解決方案",
        description: "憑藉過往經驗快速行動",
        traits: {
          intuitive_thinking: 3,
          experience_based: 2,
          quick_decision: 2
        }
      },
      {
        text: "先評估整體影響範圍，制定系統性的修復計畫",
        description: "從大局角度思考解決策略",
        traits: {
          big_picture: 3,
          analytical_thinking: 1,
          deliberate_decision: 2
        }
      },
      {
        text: "立即聯繫技術團隊，集思廣益尋找創新解法",
        description: "結合團隊智慧找出最佳方案",
        traits: {
          creative_thinking: 2,
          team_interaction: 3,
          collaborative: 2
        }
      }
    ]
  },
  
  {
    id: 2,
    category: scenarioWorkStyleDimensions.COGNITIVE_STYLE,
    subcategory: '學習新技術',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "新技術導入專案",
      context: "公司決定導入一項全新的AI技術來提升工作效率",
      situation: "你被指派負責學習這項技術並培訓團隊，但相關資料很少。"
    },
    
    question: "面對這個學習挑戰，你會採取什麼策略？",
    
    options: [
      {
        text: "深入研究技術文檔和學術論文，建立完整的理論基礎",
        description: "從理論層面深度理解技術原理",
        traits: {
          theoretical_learning: 3,
          analytical_thinking: 2,
          detail_oriented: 2
        }
      },
      {
        text: "直接開始實作小型項目，在做中學習",
        description: "透過實際操作掌握技術要點",
        traits: {
          hands_on_learning: 3,
          intuitive_thinking: 2,
          challenge_seeking: 1
        }
      },
      {
        text: "尋找業界專家和社群，透過交流學習經驗",
        description: "利用人際網絡獲取實戰經驗",
        traits: {
          collaborative_learning: 3,
          extraversion: 2,
          verbal_communication: 2
        }
      },
      {
        text: "設計系統化的學習計畫，結合理論與實作",
        description: "制定完整的學習策略和時程",
        traits: {
          structured_environment: 2,
          big_picture: 2,
          steady_progress: 3
        }
      }
    ]
  },
  
  {
    id: 3,
    category: scenarioWorkStyleDimensions.COGNITIVE_STYLE,
    subcategory: '創新思維',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "產品功能創新會議",
      context: "你正在參加產品改版的腦力激盪會議",
      situation: "目前的產品功能已經趨於飽和，需要找出突破性的創新點。"
    },
    
    question: "在這次創新討論中，你最可能提出什麼類型的想法？",
    
    options: [
      {
        text: "分析競品的功能缺口，提出差異化改進方案",
        description: "基於市場分析的理性創新",
        traits: {
          analytical_thinking: 3,
          data_driven: 2,
          detail_oriented: 1
        }
      },
      {
        text: "從用戶痛點出發，設計完全不同的使用體驗",
        description: "以使用者為中心的創新思維",
        traits: {
          creative_thinking: 3,
          big_picture: 2,
          intuitive_thinking: 2
        }
      },
      {
        text: "結合其他領域的成功案例，跨界應用到我們的產品",
        description: "跨領域整合的創新模式",
        traits: {
          creative_thinking: 2,
          big_picture: 3,
          experience_based: 1
        }
      },
      {
        text: "先確認技術可行性，再提出實際可執行的方案",
        description: "務實導向的穩健創新",
        traits: {
          deliberate_decision: 3,
          detail_oriented: 2,
          structured_environment: 1
        }
      }
    ]
  },
  
  {
    id: 4,
    category: scenarioWorkStyleDimensions.COGNITIVE_STYLE,
    subcategory: '資訊處理',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "市場調研報告分析",
      context: "你收到一份包含大量數據和圖表的市場調研報告",
      situation: "需要在明天的董事會上報告關鍵發現和建議。"
    },
    
    question: "面對這份複雜的報告，你會如何處理？",
    
    options: [
      {
        text: "仔細閱讀每個數據點，確保沒有遺漏任何重要資訊",
        description: "詳細分析每個細節",
        traits: {
          detail_oriented: 3,
          analytical_thinking: 2,
          deliberate_decision: 1
        }
      },
      {
        text: "先瀏覽摘要和結論，快速掌握整體趨勢",
        description: "從大局角度理解重點",
        traits: {
          big_picture: 3,
          intuitive_thinking: 2,
          quick_decision: 1
        }
      },
      {
        text: "重點關注與公司策略最相關的部分進行深入分析",
        description: "聚焦於最重要的資訊",
        traits: {
          analytical_thinking: 2,
          big_picture: 2,
          data_driven: 2
        }
      },
      {
        text: "將報告分享給團隊，集體討論和解讀",
        description: "透過團隊協作理解報告",
        traits: {
          collaborative: 3,
          team_interaction: 2,
          collaborative_learning: 2
        }
      }
    ]
  },
  
  {
    id: 5,
    category: scenarioWorkStyleDimensions.COGNITIVE_STYLE,
    subcategory: '決策制定',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "供應商選擇決策",
      context: "你需要為重要專案選擇技術供應商",
      situation: "有三家供應商各有優缺點，價格、技術、服務都不同，必須在一週內決定。"
    },
    
    question: "在這個決策過程中，你最重視什麼因素？",
    
    options: [
      {
        text: "建立詳細的評估矩陣，量化比較各項指標",
        description: "透過系統化分析做決策",
        traits: {
          analytical_thinking: 3,
          data_driven: 3,
          structured_environment: 2
        }
      },
      {
        text: "考慮長期合作的戰略意義和發展潛力",
        description: "從戰略高度思考合作關係",
        traits: {
          big_picture: 3,
          deliberate_decision: 2,
          experience_based: 1
        }
      },
      {
        text: "直接與各供應商深度溝通，感受合作默契",
        description: "重視人際互動和合作感受",
        traits: {
          intuitive_thinking: 2,
          verbal_communication: 3,
          team_interaction: 2
        }
      },
      {
        text: "參考業界同行的選擇和推薦",
        description: "借鑑他人經驗降低風險",
        traits: {
          experience_based: 3,
          collaborative_learning: 2,
          stress_managing: 1
        }
      }
    ]
  },

  // 社交能量 - 團隊互動情境 (4題)
  {
    id: 6,
    category: scenarioWorkStyleDimensions.SOCIAL_ENERGY,
    subcategory: '團隊會議',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "週會討論新專案",
      context: "你正在參加部門週會，討論下季度的重點專案",
      situation: "主管希望大家積極參與討論，提出想法和意見。"
    },
    
    question: "在這個會議中，你通常的表現是？",
    
    options: [
      {
        text: "積極發言，主動提出想法和建議",
        description: "主動參與並引導討論",
        traits: {
          extraversion: 3,
          leadership: 2,
          verbal_communication: 2
        }
      },
      {
        text: "仔細聆聽大家的想法，在關鍵時刻發表見解",
        description: "深思熟慮後再表達意見",
        traits: {
          introversion: 2,
          analytical_thinking: 2,
          deliberate_decision: 3
        }
      },
      {
        text: "幫助整合不同同事的想法，促進共識",
        description: "扮演協調和整合的角色",
        traits: {
          collaborative: 3,
          supportive: 2,
          team_interaction: 2
        }
      },
      {
        text: "會後私下與主管或同事詳細討論",
        description: "偏好一對一的深度交流",
        traits: {
          introversion: 3,
          independent_work: 2,
          written_communication: 1
        }
      }
    ]
  },
  
  {
    id: 7,
    category: scenarioWorkStyleDimensions.SOCIAL_ENERGY,
    subcategory: '工作協作',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "跨部門合作專案",
      context: "你需要與行銷、技術、財務三個部門合作執行專案",
      situation: "各部門都有不同的優先順序和工作節奏，需要協調合作。"
    },
    
    question: "在這種跨部門合作中，你會如何發揮作用？",
    
    options: [
      {
        text: "主動召集會議，建立清楚的溝通機制",
        description: "擔任專案協調和領導角色",
        traits: {
          leadership: 3,
          extraversion: 2,
          structured_environment: 2
        }
      },
      {
        text: "專注做好自己部分，定期更新進度給其他人",
        description: "發揮專業能力，維持良好溝通",
        traits: {
          independent_work: 2,
          autonomous: 3,
          written_communication: 2
        }
      },
      {
        text: "積極了解各部門需求，尋找合作的最佳平衡點",
        description: "促進部門間的理解和合作",
        traits: {
          collaborative: 3,
          team_interaction: 2,
          supportive: 2
        }
      },
      {
        text: "建立詳細的專案管理系統，確保資訊透明",
        description: "透過系統化管理促進協作",
        traits: {
          structured_environment: 3,
          written_communication: 2,
          detail_oriented: 2
        }
      }
    ]
  },
  
  {
    id: 8,
    category: scenarioWorkStyleDimensions.SOCIAL_ENERGY,
    subcategory: '工作環境',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "開放辦公室 vs 獨立空間",
      context: "公司正在重新規劃辦公空間配置",
      situation: "你可以選擇在開放式辦公區工作，或申請獨立的小辦公室。"
    },
    
    question: "考慮到工作效率和舒適度，你會選擇哪種辦公環境？",
    
    options: [
      {
        text: "開放辦公區，方便與同事隨時交流討論",
        description: "重視即時溝通和團隊互動",
        traits: {
          extraversion: 3,
          team_interaction: 3,
          collaborative: 2
        }
      },
      {
        text: "獨立辦公室，可以專心思考和處理複雜工作",
        description: "需要安靜環境進行深度工作",
        traits: {
          introversion: 3,
          independent_work: 3,
          detail_oriented: 1
        }
      },
      {
        text: "彈性工作空間，依據任務性質選擇不同區域",
        description: "根據工作需要靈活調整環境",
        traits: {
          flexible_environment: 3,
          autonomous: 2,
          big_picture: 1
        }
      },
      {
        text: "小型團隊工作區，與核心團隊成員緊密合作",
        description: "偏好小規模的深度協作",
        traits: {
          team_interaction: 2,
          collaborative: 3,
          supportive: 2
        }
      }
    ]
  },
  
  {
    id: 9,
    category: scenarioWorkStyleDimensions.SOCIAL_ENERGY,
    subcategory: '能量恢復',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "高強度工作週結束",
      context: "你剛結束一週密集的會議和高壓專案工作",
      situation: "週五晚上，你感到有些疲憊，需要恢復精力準備下週的工作。"
    },
    
    question: "在這種情況下，你最可能選擇什麼方式來恢復精力？",
    
    options: [
      {
        text: "與同事朋友聚餐聊天，分享這週的工作心得",
        description: "透過社交互動充電恢復",
        traits: {
          extraversion: 3,
          team_interaction: 2,
          verbal_communication: 2
        }
      },
      {
        text: "在家安靜休息，整理思緒或做些個人興趣",
        description: "透過獨處時間恢復能量",
        traits: {
          introversion: 3,
          independent_work: 2,
          stress_managing: 1
        }
      },
      {
        text: "參加團體運動或社交活動，轉換工作心境",
        description: "透過群體活動紓解壓力",
        traits: {
          extraversion: 2,
          team_interaction: 3,
          stress_thriving: 1
        }
      },
      {
        text: "提前規劃下週工作，讓心情更踏實",
        description: "透過準備和計畫獲得安全感",
        traits: {
          structured_environment: 2,
          steady_progress: 3,
          stress_managing: 2
        }
      }
    ]
  },

  // 工作環境 - 環境偏好情境 (4題)
  {
    id: 10,
    category: scenarioWorkStyleDimensions.WORK_ENVIRONMENT,
    subcategory: '工作節奏',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "專案時程規劃",
      context: "你負責規劃一個為期三個月的重要專案",
      situation: "客戶希望盡快看到成果，但品質不能妥協，團隊資源有限。"
    },
    
    question: "在這種情況下，你會如何安排專案進度？",
    
    options: [
      {
        text: "設定緊湊的時程，透過高效率執行快速交付",
        description: "偏好高強度快節奏的工作方式",
        traits: {
          fast_paced: 3,
          stress_thriving: 2,
          deadline_driven: 2
        }
      },
      {
        text: "制定穩健的計畫，確保每個階段都有充分時間",
        description: "重視品質和穩定的推進節奏",
        traits: {
          steady_pace: 3,
          structured_environment: 2,
          stress_managing: 2
        }
      },
      {
        text: "採用敏捷開發模式，快速疊代並適時調整",
        description: "結合速度與彈性的工作方式",
        traits: {
          flexible_environment: 3,
          challenge_seeking: 2,
          quick_decision: 1
        }
      },
      {
        text: "分階段交付，讓客戶及早參與回饋和調整",
        description: "重視溝通回饋的漸進式推進",
        traits: {
          collaborative: 2,
          frequent_feedback: 3,
          steady_progress: 2
        }
      }
    ]
  },
  
  {
    id: 11,
    category: scenarioWorkStyleDimensions.WORK_ENVIRONMENT,
    subcategory: '變化適應',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "臨時需求變更",
      context: "專案進行到一半，客戶突然提出重大需求變更",
      situation: "這個變更會影響原本的設計和時程，需要重新調整策略。"
    },
    
    question: "面對這個突發變化，你的反應是？",
    
    options: [
      {
        text: "興奮地看待這個新挑戰，立即開始規劃調整方案",
        description: "將變化視為成長和創新的機會",
        traits: {
          challenge_seeking: 3,
          flexible_environment: 2,
          stress_thriving: 2
        }
      },
      {
        text: "仔細評估變更的影響，制定詳細的應對計畫",
        description: "透過周詳規劃管理變化風險",
        traits: {
          analytical_thinking: 2,
          structured_environment: 2,
          stress_managing: 3
        }
      },
      {
        text: "與團隊討論如何在變更中維持專案品質",
        description: "透過團隊協作應對挑戰",
        traits: {
          collaborative: 3,
          team_interaction: 2,
          supportive: 2
        }
      },
      {
        text: "希望能維持原計畫，與客戶溝通變更的代價",
        description: "偏好穩定性和可預測性",
        traits: {
          steady_pace: 2,
          structured_environment: 3,
          stress_avoiding: 2
        }
      }
    ]
  },
  
  {
    id: 12,
    category: scenarioWorkStyleDimensions.WORK_ENVIRONMENT,
    subcategory: '挑戰承受',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "高難度技術挑戰",
      context: "你接到一個技術難度很高的專案任務",
      situation: "這個任務超出你目前的能力範圍，需要學習新技術，而且時間有限。"
    },
    
    question: "面對這個挑戰，你的想法是？",
    
    options: [
      {
        text: "太好了！這正是提升自己能力的絕佳機會",
        description: "積極擁抱挑戰，視困難為成長機會",
        traits: {
          challenge_seeking: 3,
          stress_thriving: 2,
          hands_on_learning: 2
        }
      },
      {
        text: "制定詳細的學習計畫，系統性地掌握新技術",
        description: "透過有序規劃應對技術挑戰",
        traits: {
          structured_environment: 3,
          theoretical_learning: 2,
          steady_progress: 2
        }
      },
      {
        text: "尋求有經驗的同事協助，加速學習過程",
        description: "善用團隊資源解決難題",
        traits: {
          collaborative_learning: 3,
          team_interaction: 2,
          supportive: 1
        }
      },
      {
        text: "評估是否能調整任務範圍，聚焦於可行的部分",
        description: "務實地管理挑戰的複雜度",
        traits: {
          deliberate_decision: 3,
          stress_managing: 2,
          analytical_thinking: 1
        }
      }
    ]
  },
  
  {
    id: 13,
    category: scenarioWorkStyleDimensions.WORK_ENVIRONMENT,
    subcategory: '工作彈性',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "遠距工作安排",
      context: "公司開始實施彈性工作制度",
      situation: "你可以選擇完全遠距、混合模式，或繼續在辦公室工作。"
    },
    
    question: "考慮到工作效率和生活平衡，你會選擇哪種模式？",
    
    options: [
      {
        text: "完全遠距工作，享受最大的時間和空間彈性",
        description: "重視自主性和工作彈性",
        traits: {
          flexible_environment: 3,
          independent_work: 3,
          autonomous: 2
        }
      },
      {
        text: "混合模式，在家專注工作，進辦公室協作討論",
        description: "平衡獨立工作和團隊互動",
        traits: {
          flexible_environment: 2,
          team_interaction: 2,
          collaborative: 2
        }
      },
      {
        text: "繼續在辦公室，維持穩定的工作節奏和環境",
        description: "偏好穩定和規律的工作環境",
        traits: {
          structured_environment: 3,
          steady_pace: 2,
          team_interaction: 1
        }
      },
      {
        text: "根據專案需求靈活調整，沒有固定模式",
        description: "完全依據工作需要決定地點",
        traits: {
          flexible_environment: 3,
          autonomous: 2,
          big_picture: 1
        }
      }
    ]
  },

  // 協作模式 - 團隊合作情境 (3題)
  {
    id: 14,
    category: scenarioWorkStyleDimensions.COLLABORATION,
    subcategory: '團隊角色',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "新專案團隊組建",
      context: "你加入一個全新的專案團隊",
      situation: "團隊成員來自不同部門，大家還在磨合階段，需要建立合作模式。"
    },
    
    question: "在這個新團隊中，你最可能扮演什麼角色？",
    
    options: [
      {
        text: "主動提出工作分配建議，協調團隊運作",
        description: "承擔團隊協調和領導責任",
        traits: {
          leadership: 3,
          structured_environment: 2,
          extraversion: 2
        }
      },
      {
        text: "專注發揮自己的專業能力，貢獻高品質成果",
        description: "透過專業表現支持團隊",
        traits: {
          autonomous: 3,
          detail_oriented: 2,
          independent_work: 2
        }
      },
      {
        text: "積極了解每位成員的強項，促進團隊合作",
        description: "扮演團隊整合和支援角色",
        traits: {
          supportive: 3,
          collaborative: 2,
          team_interaction: 2
        }
      },
      {
        text: "觀察團隊動態，在需要時提供意見和協助",
        description: "採取適應性的支援策略",
        traits: {
          supportive: 2,
          analytical_thinking: 2,
          deliberate_decision: 3
        }
      }
    ]
  },
  
  {
    id: 15,
    category: scenarioWorkStyleDimensions.COLLABORATION,
    subcategory: '衝突處理',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "團隊意見分歧",
      context: "團隊在重要決策上出現嚴重分歧",
      situation: "兩派意見都有道理，但必須盡快達成共識才能推進專案。"
    },
    
    question: "面對這種團隊衝突，你會如何處理？",
    
    options: [
      {
        text: "召集會議讓各方充分表達意見，尋找最佳解決方案",
        description: "透過開放討論化解分歧",
        traits: {
          leadership: 3,
          collaborative: 2,
          verbal_communication: 2
        }
      },
      {
        text: "分析兩種方案的利弊，提供客觀的評估建議",
        description: "用理性分析協助決策",
        traits: {
          analytical_thinking: 3,
          data_driven: 2,
          supportive: 1
        }
      },
      {
        text: "私下與各方溝通，了解真正的關注點和底線",
        description: "透過一對一溝通了解深層原因",
        traits: {
          supportive: 3,
          collaborative: 2,
          verbal_communication: 1
        }
      },
      {
        text: "建議先擱置爭議，專注於大家都同意的部分",
        description: "聚焦共識，暫時擱置分歧",
        traits: {
          stress_managing: 2,
          collaborative: 2,
          deliberate_decision: 3
        }
      }
    ]
  },
  
  {
    id: 16,
    category: scenarioWorkStyleDimensions.COLLABORATION,
    subcategory: '知識分享',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "技術知識傳承",
      context: "你在某個技術領域有豐富經驗",
      situation: "新加入的同事需要快速上手，而你的工作也很繁重。"
    },
    
    question: "在這種情況下，你會如何分享你的知識？",
    
    options: [
      {
        text: "安排定期的教學時間，系統性地培訓新同事",
        description: "透過正式培訓進行知識傳承",
        traits: {
          structured_environment: 3,
          supportive: 2,
          theoretical_learning: 2
        }
      },
      {
        text: "讓新同事參與實際專案，在工作中學習",
        description: "透過實作指導進行傳承",
        traits: {
          hands_on_learning: 3,
          collaborative: 2,
          supportive: 2
        }
      },
      {
        text: "建立詳細的文檔和知識庫，供隨時查閱",
        description: "透過文檔化進行知識管理",
        traits: {
          written_communication: 3,
          detail_oriented: 2,
          independent_work: 1
        }
      },
      {
        text: "建立學習小組，讓大家互相學習交流",
        description: "透過群體學習促進知識分享",
        traits: {
          collaborative_learning: 3,
          team_interaction: 2,
          collaborative: 2
        }
      }
    ]
  },

  // 回饋需求 - 績效管理情境 (3題)
  {
    id: 17,
    category: scenarioWorkStyleDimensions.FEEDBACK_NEED,
    subcategory: '工作指導',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "新職務適應期",
      context: "你剛轉調到新部門，承擔不同的職責",
      situation: "工作內容和方式都與過去有很大差異，需要時間適應。"
    },
    
    question: "在這個適應期，你希望主管如何指導你？",
    
    options: [
      {
        text: "每天簡短check-in，隨時指正方向和提供建議",
        description: "需要頻繁的即時指導",
        traits: {
          frequent_feedback: 3,
          supportive: 1,
          structured_environment: 2
        }
      },
      {
        text: "每週定期檢討進度，討論遇到的挑戰和解決方案",
        description: "偏好規律的檢討和反饋",
        traits: {
          periodic_feedback: 3,
          analytical_thinking: 1,
          collaborative: 2
        }
      },
      {
        text: "設定明確目標後，讓我自主學習，有問題時主動求助",
        description: "偏好自主學習，最少指導",
        traits: {
          minimal_feedback: 3,
          autonomous: 2,
          independent_work: 2
        }
      },
      {
        text: "安排有經驗的同事作為導師，提供實務指導",
        description: "透過同儕指導進行學習",
        traits: {
          collaborative_learning: 2,
          hands_on_learning: 2,
          supportive: 3
        }
      }
    ]
  },
  
  {
    id: 18,
    category: scenarioWorkStyleDimensions.FEEDBACK_NEED,
    subcategory: '績效評估',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "年度績效考核",
      context: "即將進行年度績效考核面談",
      situation: "你今年的工作表現有好有壞，希望從考核中獲得有價值的反饋。"
    },
    
    question: "在績效面談中，你最希望得到什麼類型的反饋？",
    
    options: [
      {
        text: "詳細討論每個專案的表現，包括優點和改進空間",
        description: "要求全面且詳細的績效分析",
        traits: {
          frequent_feedback: 2,
          analytical_thinking: 2,
          detail_oriented: 3
        }
      },
      {
        text: "重點討論未來發展方向和能力提升建議",
        description: "聚焦於未來發展和成長",
        traits: {
          periodic_feedback: 2,
          big_picture: 3,
          challenge_seeking: 1
        }
      },
      {
        text: "簡要確認達成目標的情況，討論下年度規劃",
        description: "重視目標達成和未來規劃",
        traits: {
          minimal_feedback: 2,
          autonomous: 2,
          structured_environment: 3
        }
      },
      {
        text: "了解團隊協作和人際關係方面的表現",
        description: "關注團隊合作和人際互動",
        traits: {
          collaborative: 2,
          team_interaction: 3,
          supportive: 2
        }
      }
    ]
  },
  
  {
    id: 19,
    category: scenarioWorkStyleDimensions.FEEDBACK_NEED,
    subcategory: '同儕回饋',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "跨部門專案檢討",
      context: "完成一個重要的跨部門合作專案",
      situation: "你希望了解合作夥伴對你工作表現的真實看法。"
    },
    
    question: "你會如何收集同事的回饋意見？",
    
    options: [
      {
        text: "主動約談各部門夥伴，面對面討論合作心得",
        description: "透過直接溝通獲得深度回饋",
        traits: {
          frequent_feedback: 2,
          verbal_communication: 3,
          extraversion: 2
        }
      },
      {
        text: "設計回饋問卷，系統性地收集意見和建議",
        description: "透過結構化方式收集回饋",
        traits: {
          structured_environment: 3,
          written_communication: 2,
          analytical_thinking: 2
        }
      },
      {
        text: "在專案結束會議上，邀請大家分享合作經驗",
        description: "在團隊環境中公開討論",
        traits: {
          team_interaction: 3,
          collaborative: 2,
          periodic_feedback: 2
        }
      },
      {
        text: "觀察專案成果和後續合作邀請，自我評估表現",
        description: "透過結果和行為推測表現",
        traits: {
          minimal_feedback: 3,
          analytical_thinking: 1,
          independent_work: 2
        }
      }
    ]
  },

  // 壓力反應 - 壓力管理情境 (3題)
  {
    id: 20,
    category: scenarioWorkStyleDimensions.STRESS_RESPONSE,
    subcategory: '時間壓力',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "多專案同時進行",
      context: "你同時負責三個重要專案",
      situation: "每個專案都有緊迫的截止日期，工作量已經接近極限。"
    },
    
    question: "面對這種高壓情況，你的反應是？",
    
    options: [
      {
        text: "更加專注投入，壓力讓我發揮更好的表現",
        description: "壓力激發更高的工作效能",
        traits: {
          stress_thriving: 3,
          fast_paced: 2,
          challenge_seeking: 2
        }
      },
      {
        text: "重新評估優先順序，系統性地管理時間和任務",
        description: "透過規劃和管理應對壓力",
        traits: {
          stress_managing: 3,
          structured_environment: 2,
          analytical_thinking: 2
        }
      },
      {
        text: "與主管討論，尋求資源支援或調整期程",
        description: "透過溝通和協作分散壓力",
        traits: {
          collaborative: 2,
          supportive: 1,
          verbal_communication: 3
        }
      },
      {
        text: "希望能減少一些任務，專注做好最重要的專案",
        description: "偏好降低壓力，確保品質",
        traits: {
          stress_avoiding: 3,
          steady_pace: 2,
          detail_oriented: 1
        }
      }
    ]
  },
  
  {
    id: 21,
    category: scenarioWorkStyleDimensions.STRESS_RESPONSE,
    subcategory: '績效壓力',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "重要客戶簡報",
      context: "你需要向公司最重要的客戶做產品簡報",
      situation: "這次簡報關係到大型合約的簽訂，公司高層都很關注結果。"
    },
    
    question: "面對這種高關注度的任務，你會如何準備？",
    
    options: [
      {
        text: "把壓力轉化為動力，準備一個驚艷的簡報表現",
        description: "將挑戰視為表現機會",
        traits: {
          stress_thriving: 3,
          challenge_seeking: 2,
          extraversion: 1
        }
      },
      {
        text: "制定詳細的準備計畫，確保每個細節都完美",
        description: "透過周詳準備降低風險",
        traits: {
          stress_managing: 3,
          detail_oriented: 2,
          structured_environment: 2
        }
      },
      {
        text: "與團隊一起準備，集體智慧讓簡報更完整",
        description: "透過團隊協作分擔壓力",
        traits: {
          collaborative: 3,
          team_interaction: 2,
          supportive: 1
        }
      },
      {
        text: "專注於產品本身的價值，不被壓力影響表現",
        description: "保持冷靜專注於核心內容",
        traits: {
          stress_managing: 2,
          analytical_thinking: 2,
          autonomous: 3
        }
      }
    ]
  },
  
  {
    id: 22,
    category: scenarioWorkStyleDimensions.STRESS_RESPONSE,
    subcategory: '變化壓力',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "組織重組變革",
      context: "公司進行大規模組織重組",
      situation: "你的部門可能被合併，工作內容和同事都會改變，未來充滿不確定性。"
    },
    
    question: "面對這種組織變革，你的心態是？",
    
    options: [
      {
        text: "積極擁抱變化，期待新的發展機會和挑戰",
        description: "將變革視為成長機會",
        traits: {
          challenge_seeking: 3,
          flexible_environment: 2,
          stress_thriving: 2
        }
      },
      {
        text: "仔細分析變革影響，制定個人應對策略",
        description: "透過理性規劃應對變化",
        traits: {
          analytical_thinking: 3,
          stress_managing: 2,
          deliberate_decision: 2
        }
      },
      {
        text: "與同事密切溝通，一起面對變革挑戰",
        description: "透過團隊支持度過變革",
        traits: {
          collaborative: 3,
          team_interaction: 2,
          supportive: 2
        }
      },
      {
        text: "希望變革影響能降到最小，維持工作穩定性",
        description: "偏好穩定，避免過大變化",
        traits: {
          stress_avoiding: 3,
          structured_environment: 2,
          steady_pace: 2
        }
      }
    ]
  },

  // 決策風格 - 決策情境 (3題)
  {
    id: 23,
    category: scenarioWorkStyleDimensions.DECISION_MAKING,
    subcategory: '投資決策',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "新技術投資評估",
      context: "公司考慮投資一項新興技術",
      situation: "這項技術很有前景但風險也高，需要大量資金投入，你負責提供決策建議。"
    },
    
    question: "在這個投資決策中，你會如何進行評估？",
    
    options: [
      {
        text: "建立詳細的財務模型，量化分析投資報酬率",
        description: "透過數據分析支持決策",
        traits: {
          data_driven: 3,
          analytical_thinking: 3,
          deliberate_decision: 2
        }
      },
      {
        text: "研究市場趨勢和競爭對手動向，評估戰略價值",
        description: "從戰略高度思考投資意義",
        traits: {
          big_picture: 3,
          analytical_thinking: 2,
          deliberate_decision: 2
        }
      },
      {
        text: "參考業界專家意見和成功案例，降低決策風險",
        description: "借鑑外部智慧和經驗",
        traits: {
          experience_based: 3,
          collaborative_learning: 2,
          stress_managing: 1
        }
      },
      {
        text: "基於對技術發展的直覺判斷，快速做出決定",
        description: "依據直覺和經驗快速決策",
        traits: {
          intuitive_thinking: 2,
          quick_decision: 3,
          experience_based: 2
        }
      }
    ]
  },
  
  {
    id: 24,
    category: scenarioWorkStyleDimensions.DECISION_MAKING,
    subcategory: '人員決策',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "團隊成員招募",
      context: "你需要為團隊招募一位重要成員",
      situation: "有幾位候選人各有優缺點，技能、經驗、文化適配度都不同。"
    },
    
    question: "在選擇團隊成員時，你最重視什麼因素？",
    
    options: [
      {
        text: "客觀評估技能水準和過往績效表現",
        description: "基於能力和表現做判斷",
        traits: {
          data_driven: 3,
          analytical_thinking: 2,
          detail_oriented: 2
        }
      },
      {
        text: "考慮候選人的學習潛力和發展空間",
        description: "著重未來發展和成長性",
        traits: {
          big_picture: 3,
          intuitive_thinking: 2,
          challenge_seeking: 1
        }
      },
      {
        text: "深度面談了解個性和團隊合作能力",
        description: "重視人際互動和團隊契合",
        traits: {
          team_interaction: 2,
          collaborative: 3,
          verbal_communication: 2
        }
      },
      {
        text: "綜合考量多項因素，相信直覺的最終判斷",
        description: "整合分析後依據直覺決定",
        traits: {
          intuitive_thinking: 3,
          experience_based: 2,
          quick_decision: 1
        }
      }
    ]
  },
  
  {
    id: 25,
    category: scenarioWorkStyleDimensions.DECISION_MAKING,
    subcategory: '緊急決策',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "產品安全漏洞",
      context: "發現產品存在嚴重安全漏洞",
      situation: "必須立即決定是否暫停服務進行修復，但這會影響大量用戶和業務收入。"
    },
    
    question: "在這種緊急情況下，你會如何做決定？",
    
    options: [
      {
        text: "立即暫停服務，用戶安全是最高優先級",
        description: "基於原則快速做出決定",
        traits: {
          quick_decision: 3,
          big_picture: 2,
          stress_thriving: 1
        }
      },
      {
        text: "快速評估風險等級，制定分階段應對方案",
        description: "在時間壓力下保持理性分析",
        traits: {
          analytical_thinking: 2,
          stress_managing: 3,
          data_driven: 2
        }
      },
      {
        text: "緊急召集關鍵團隊成員，集體決策應對",
        description: "透過團隊智慧處理危機",
        traits: {
          collaborative: 3,
          leadership: 2,
          team_interaction: 2
        }
      },
      {
        text: "先實施緊急防護措施，爭取時間深入分析",
        description: "採取漸進式風險管理策略",
        traits: {
          deliberate_decision: 3,
          stress_managing: 2,
          analytical_thinking: 1
        }
      }
    ]
  },

  // 溝通偏好 - 溝通情境 (3題)
  {
    id: 26,
    category: scenarioWorkStyleDimensions.COMMUNICATION,
    subcategory: '資訊傳達',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "專案進度報告",
      context: "你需要向各利害關係人報告專案進度",
      situation: "專案有些延遲和問題，需要清楚說明現況並爭取支持。"
    },
    
    question: "在這種情況下，你偏好使用哪種溝通方式？",
    
    options: [
      {
        text: "召開會議，當面報告並即時回答問題",
        description: "透過面對面溝通建立信任",
        traits: {
          verbal_communication: 3,
          extraversion: 2,
          team_interaction: 2
        }
      },
      {
        text: "製作詳細報告文件，提供完整資訊",
        description: "透過書面資料傳達詳細內容",
        traits: {
          written_communication: 3,
          detail_oriented: 2,
          analytical_thinking: 2
        }
      },
      {
        text: "設計視覺化圖表和簡報，清楚呈現現況",
        description: "透過視覺化工具增進理解",
        traits: {
          visual_communication: 3,
          big_picture: 2,
          creative_thinking: 1
        }
      },
      {
        text: "先個別溝通了解關注點，再統一回應",
        description: "透過一對一溝通了解需求",
        traits: {
          verbal_communication: 2,
          supportive: 3,
          collaborative: 2
        }
      }
    ]
  },
  
  {
    id: 27,
    category: scenarioWorkStyleDimensions.COMMUNICATION,
    subcategory: '意見表達',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "策略討論會議",
      context: "參加公司年度策略規劃會議",
      situation: "你對某個策略方向有不同看法，但與會者多數都支持原方案。"
    },
    
    question: "在這種情況下，你會如何表達你的意見？",
    
    options: [
      {
        text: "在會議中直接提出不同觀點，公開討論",
        description: "直接在群體中表達異議",
        traits: {
          verbal_communication: 3,
          leadership: 2,
          extraversion: 2
        }
      },
      {
        text: "會後整理書面分析，提供詳細的替代方案",
        description: "透過書面方式提供深度分析",
        traits: {
          written_communication: 3,
          analytical_thinking: 3,
          deliberate_decision: 2
        }
      },
      {
        text: "會後與決策者私下討論，深入交換意見",
        description: "透過一對一溝通表達關切",
        traits: {
          verbal_communication: 2,
          introversion: 1,
          supportive: 3
        }
      },
      {
        text: "製作比較分析圖表，視覺化呈現不同方案",
        description: "透過視覺化工具支持論點",
        traits: {
          visual_communication: 3,
          analytical_thinking: 2,
          data_driven: 2
        }
      }
    ]
  },
  
  {
    id: 28,
    category: scenarioWorkStyleDimensions.COMMUNICATION,
    subcategory: '跨文化溝通',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "國際團隊合作",
      context: "你需要與來自不同國家的團隊成員合作",
      situation: "語言、文化、時區都有差異，需要建立有效的溝通機制。"
    },
    
    question: "在跨文化合作中，你會採用什麼溝通策略？",
    
    options: [
      {
        text: "定期視訊會議，直接交流建立關係",
        description: "透過定期面對面交流建立互信",
        traits: {
          verbal_communication: 3,
          team_interaction: 3,
          collaborative: 2
        }
      },
      {
        text: "建立清晰的書面溝通規範和文檔",
        description: "透過標準化文檔確保理解",
        traits: {
          written_communication: 3,
          structured_environment: 3,
          detail_oriented: 2
        }
      },
      {
        text: "使用共同的專案管理工具和視覺化看板",
        description: "透過視覺化工具減少語言障礙",
        traits: {
          visual_communication: 3,
          structured_environment: 2,
          collaborative: 2
        }
      },
      {
        text: "指定各地區聯絡人，建立多層級溝通網絡",
        description: "透過代表制建立溝通橋樑",
        traits: {
          collaborative: 3,
          supportive: 2,
          structured_environment: 2
        }
      }
    ]
  },

  // 時間管理 - 時間安排情境 (2題)
  {
    id: 29,
    category: scenarioWorkStyleDimensions.TIME_MANAGEMENT,
    subcategory: '工作計畫',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "季度工作規劃",
      context: "你需要規劃下季度的工作重點",
      situation: "有多個重要專案需要推進，時間和資源都有限制。"
    },
    
    question: "在制定工作計畫時，你會採用什麼策略？",
    
    options: [
      {
        text: "設定清楚的里程碑和截止日期，嚴格執行",
        description: "透過明確時程推動工作進展",
        traits: {
          deadline_driven: 3,
          structured_environment: 2,
          fast_paced: 2
        }
      },
      {
        text: "制定週期性的工作節奏，穩定推進各項任務",
        description: "維持穩定持續的工作步調",
        traits: {
          steady_progress: 3,
          structured_environment: 2,
          stress_managing: 1
        }
      },
      {
        text: "保持彈性安排，依據優先級動態調整",
        description: "根據情況靈活調整工作安排",
        traits: {
          flexible_scheduling: 3,
          flexible_environment: 2,
          autonomous: 2
        }
      },
      {
        text: "先處理最困難的任務，留簡單的工作緩衝",
        description: "優先解決複雜問題的策略",
        traits: {
          challenge_seeking: 2,
          analytical_thinking: 2,
          deadline_driven: 3
        }
      }
    ]
  },
  
  {
    id: 30,
    category: scenarioWorkStyleDimensions.TIME_MANAGEMENT,
    subcategory: '工作優先級',
    questionType: 'scenario_choice',
    
    scenario: {
      title: "多任務衝突處理",
      context: "同時有三個緊急任務需要處理",
      situation: "客戶投訴、系統故障、重要會議準備，都需要立即關注。"
    },
    
    question: "面對這種多任務衝突，你會如何安排？",
    
    options: [
      {
        text: "快速評估各任務緊急程度，按優先級依序處理",
        description: "透過理性分析排定優先順序",
        traits: {
          analytical_thinking: 2,
          quick_decision: 3,
          stress_thriving: 2
        }
      },
      {
        text: "分配時間片段，同時推進多個任務",
        description: "採用時間分割的並行策略",
        traits: {
          flexible_scheduling: 3,
          fast_paced: 2,
          stress_thriving: 1
        }
      },
      {
        text: "委派部分任務給團隊，專注最重要的問題",
        description: "透過團隊協作分散任務壓力",
        traits: {
          collaborative: 3,
          leadership: 2,
          big_picture: 2
        }
      },
      {
        text: "先完成最確定能解決的任務，再處理複雜問題",
        description: "採用穩健漸進的處理策略",
        traits: {
          steady_progress: 3,
          stress_managing: 2,
          deliberate_decision: 2
        }
      }
    ]
  }
];

/**
 * 計算情境式工作風格測驗結果
 * @param {Array} answers - 用戶的答案數組 [{questionId, optionIndex}]
 * @returns {Object} 工作風格分析結果
 */
export function calculateScenarioWorkStyleResults(answers) {
  const traitScores = {};
  const dimensionScores = {};
  const responsePatterns = [];
  
  // 初始化特質分數
  Object.keys(scenarioStyleTraits).forEach(trait => {
    traitScores[trait] = 0;
  });
  
  // 計算每個答案的特質分數
  answers.forEach(answer => {
    const question = scenarioWorkStyleQuestions.find(q => q.id === answer.questionId);
    if (!question) return;
    
    const selectedOption = question.options[answer.optionIndex];
    if (!selectedOption) return;
    
    // 記錄回答模式
    responsePatterns.push({
      scenario: question.scenario.title,
      choice: selectedOption.text,
      traits: selectedOption.traits
    });
    
    // 累積特質分數
    Object.entries(selectedOption.traits).forEach(([trait, score]) => {
      if (traitScores[trait] !== undefined) {
        traitScores[trait] += score;
      }
    });
  });
  
  // 計算維度分數
  Object.entries(scenarioWorkStyleDimensions).forEach(([key, dimensionName]) => {
    const relevantTraits = Object.entries(scenarioStyleTraits)
      .filter(([trait, info]) => info.category === key);
    
    if (relevantTraits.length > 0) {
      const totalScore = relevantTraits.reduce((sum, [trait]) => {
        return sum + (traitScores[trait] || 0);
      }, 0);
      
      dimensionScores[key] = {
        name: dimensionName,
        score: Math.round(totalScore / relevantTraits.length * 10), // 轉換為0-100分
        traits: relevantTraits.map(([trait, info]) => ({
          name: info.name,
          score: traitScores[trait] || 0
        }))
      };
    }
  });
  
  // 生成個人工作風格類型
  const workingStyleType = determineScenarioWorkingStyleType(dimensionScores, traitScores);
  
  // 生成職業匹配
  const careerMatches = calculateScenarioCareerMatches(dimensionScores, traitScores);
  
  // 生成發展建議
  const developmentSuggestions = generateScenarioSuggestions(dimensionScores, traitScores);
  
  return {
    dimensionScores,
    traitScores,
    responsePatterns,
    workingStyleType,
    careerMatches,
    developmentSuggestions,
    reliability: {
      isReliable: true, // 情境式測驗一般較可靠
      consistency: calculateResponseConsistency(responsePatterns)
    }
  };
}

/**
 * 決定工作風格類型
 */
function determineScenarioWorkingStyleType(dimensionScores, traitScores) {
  // 找出最強的三個維度
  const topDimensions = Object.entries(dimensionScores)
    .sort(([,a], [,b]) => b.score - a.score)
    .slice(0, 3)
    .map(([key]) => key);
  
  // 基於主要維度組合決定類型
  if (topDimensions.includes('COGNITIVE_STYLE') && topDimensions.includes('COLLABORATION')) {
    if (traitScores.leadership > traitScores.supportive) {
      return '策略領導型';
    } else {
      return '協作創新型';
    }
  }
  
  if (topDimensions.includes('COGNITIVE_STYLE') && topDimensions.includes('WORK_ENVIRONMENT')) {
    if (traitScores.analytical_thinking > traitScores.creative_thinking) {
      return '分析專家型';
    } else {
      return '創意解決型';
    }
  }
  
  if (topDimensions.includes('SOCIAL_ENERGY') && topDimensions.includes('COLLABORATION')) {
    return '團隊驅動型';
  }
  
  if (topDimensions.includes('WORK_ENVIRONMENT') && topDimensions.includes('STRESS_RESPONSE')) {
    if (traitScores.stress_thriving > traitScores.stress_managing) {
      return '挑戰征服型';
    } else {
      return '穩健執行型';
    }
  }
  
  return '平衡適應型';
}

/**
 * 計算職業匹配度
 */
function calculateScenarioCareerMatches(dimensionScores, traitScores) {
  // 簡化的職業匹配邏輯
  const careers = [
    {
      name: '專案經理',
      requiredTraits: ['leadership', 'collaborative', 'structured_environment'],
      requiredDimensions: ['COLLABORATION', 'TIME_MANAGEMENT']
    },
    {
      name: '軟體工程師',
      requiredTraits: ['analytical_thinking', 'detail_oriented', 'independent_work'],
      requiredDimensions: ['COGNITIVE_STYLE', 'WORK_ENVIRONMENT']
    },
    {
      name: '產品經理',
      requiredTraits: ['big_picture', 'creative_thinking', 'team_interaction'],
      requiredDimensions: ['COGNITIVE_STYLE', 'COLLABORATION', 'COMMUNICATION']
    },
    {
      name: '營運專員',
      requiredTraits: ['structured_environment', 'steady_progress', 'detail_oriented'],
      requiredDimensions: ['WORK_ENVIRONMENT', 'TIME_MANAGEMENT']
    },
    {
      name: '業務代表',
      requiredTraits: ['extraversion', 'verbal_communication', 'stress_thriving'],
      requiredDimensions: ['SOCIAL_ENERGY', 'COMMUNICATION', 'STRESS_RESPONSE']
    }
  ];
  
  return careers.map(career => {
    let matchScore = 0;
    let factors = 0;
    
    // 評估特質匹配
    career.requiredTraits.forEach(trait => {
      if (traitScores[trait]) {
        matchScore += Math.min(traitScores[trait] * 10, 100);
        factors++;
      }
    });
    
    // 評估維度匹配
    career.requiredDimensions.forEach(dimension => {
      if (dimensionScores[dimension]) {
        matchScore += dimensionScores[dimension].score;
        factors++;
      }
    });
    
    return {
      career: career.name,
      matchScore: factors > 0 ? Math.round(matchScore / factors) : 0,
      reasoning: `符合 ${career.requiredTraits.length + career.requiredDimensions.length} 項關鍵要求`
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * 生成發展建議
 */
function generateScenarioSuggestions(dimensionScores, traitScores) {
  const suggestions = {
    strengths: [],
    developmentAreas: [],
    actionPlans: []
  };
  
  // 找出優勢領域（分數>70）
  Object.entries(dimensionScores).forEach(([key, data]) => {
    if (data.score > 70) {
      suggestions.strengths.push(`${data.name}是你的核心優勢`);
    } else if (data.score < 40) {
      suggestions.developmentAreas.push(`可加強${data.name}相關技能`);
    }
  });
  
  // 基於特質生成行動建議
  if (traitScores.leadership > 6) {
    suggestions.actionPlans.push('考慮承擔更多領導責任或管理角色');
  }
  if (traitScores.analytical_thinking > 6) {
    suggestions.actionPlans.push('發展數據分析和策略思考能力');
  }
  if (traitScores.collaborative > 6) {
    suggestions.actionPlans.push('在跨功能團隊中發揮協調整合作用');
  }
  
  return suggestions;
}

/**
 * 計算回答一致性
 */
function calculateResponseConsistency(responsePatterns) {
  // 簡化的一致性檢查
  const traitFrequency = {};
  
  responsePatterns.forEach(pattern => {
    Object.keys(pattern.traits).forEach(trait => {
      traitFrequency[trait] = (traitFrequency[trait] || 0) + 1;
    });
  });
  
  const maxFrequency = Math.max(...Object.values(traitFrequency));
  const consistency = maxFrequency / responsePatterns.length;
  
  return {
    score: Math.round(consistency * 100),
    isConsistent: consistency > 0.3
  };
}

export default {
  scenarioWorkStyleQuestions,
  calculateScenarioWorkStyleResults,
  scenarioWorkStyleDimensions,
  scenarioStyleTraits
};
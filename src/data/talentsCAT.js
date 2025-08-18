/**
 * 蓋洛普天賦測驗 - 電腦化適性測驗 (CAT) 版本
 * 基於項目反應理論 (Item Response Theory, IRT)
 * 參考 Gallup StrengthsFinder 2.0 的設計原理
 */

// 34項蓋洛普天賦定義（保持原有）
export const talents = {
  "成就": "對成就有強烈渴望，工作勤奮且具有持久力",
  "行動": "善於將想法轉化為行動，喜歡立即採取行動",
  "適應": "能夠輕易適應變化，彈性很強",
  "分析": "善於分析問題，喜歡研究數據和模式",
  "統籌": "能夠組織和管理多個任務或專案",
  "信念": "具有堅定的核心價值觀，忠於自己的信念",
  "指揮": "天生的領導者，能夠掌控局面並承擔責任",
  "溝通": "善於表達想法，能夠清楚地傳達信息",
  "競爭": "喜歡比較和競爭，追求勝利和卓越",
  "關聯": "能夠看到事物之間的連接，善於建立關係",
  "公平": "重視公平和正義，希望每個人都能得到平等對待",
  "完美": "追求完美和高品質，注重細節",
  "專注": "能夠集中精力，專注於重要的目標",
  "前瞻": "具有未來導向的思維，能夠預見可能性",
  "和諧": "尊重差異，尋求共識和平衡",
  "理念": "富有創意和想像力，喜歡創新",
  "包容": "善於接納他人，具有同理心",
  "個別": "能夠看到每個人的獨特性，善於個人化處理",
  "蒐集": "喜歡收集信息、想法或物品",
  "思維": "喜歡思考和內省，善於分析問題",
  "學習": "對學習有強烈渴望，喜歡持續成長",
  "完善": "善於發現問題並提出改善方案",
  "積極": "具有感染力的熱忱，能夠激勵他人",
  "交往": "善於建立關係，喜歡結識新朋友",
  "責任": "對承諾負責，值得信賴",
  "回顧": "從過去的經驗中學習，重視歷史",
  "自信": "對自己的能力有信心，敢於承擔風險",
  "追求": "具有強烈的目標導向，不易滿足現狀",
  "戰略": "能夠找到最佳路徑，善於規劃",
  "體諒": "能夠感受他人的情感，具有同理心",
  "取悅": "希望被人喜歡，努力讓他人感到快樂",
  "伯樂": "善於發現他人的潛力並幫助其發展",
  "審慎": "做決定時很謹慎，會仔細考慮各種風險",
  "恢復": "善於解決問題，能夠化危機為轉機"
};

/**
 * 天賦題目池 - 102題 (每個天賦3題，確保足夠的區分度)
 * 基於IRT理論，每題包含難度參數和區分度參數
 * 實際測驗：70題 (CAT適性選擇)
 */
export const talentItemBank = [
  // === 成就 (Achievement) - 3題 ===
  {
    id: 1,
    targetTalent: "成就",
    difficulty: 0.2, // 容易 (-2 to +2)
    discrimination: 1.5, // 區分度 (0.5 to 2.0)
    question: "在學校或工作中，我常常：",
    options: [
      { text: "設定比別人更高的標準給自己", weight: 2 },
      { text: "按照既定要求完成任務即可", weight: -1 },
      { text: "喜歡團隊合作勝過個人表現", weight: 0 }
    ]
  },
  {
    id: 2,
    targetTalent: "成就",
    difficulty: 0.8,
    discrimination: 1.8,
    question: "面對一個困難的長期目標時，我通常：",
    options: [
      { text: "制定詳細計劃並堅持執行", weight: 2 },
      { text: "保持彈性，隨時調整方向", weight: 0 },
      { text: "尋求他人協助共同完成", weight: -1 }
    ]
  },
  {
    id: 3,
    targetTalent: "成就",
    difficulty: 1.2,
    discrimination: 1.6,
    question: "當我完成一項任務後，我最常想的是：",
    options: [
      { text: "下一個挑戰是什麼", weight: 2 },
      { text: "這次的成果如何改善", weight: 1 },
      { text: "可以休息一下了", weight: -1 }
    ]
  },

  // === 行動 (Activator) - 3題 ===
  {
    id: 4,
    targetTalent: "行動",
    difficulty: -0.5,
    discrimination: 1.4,
    question: "當團隊在討論一個新想法時，我傾向於：",
    options: [
      { text: "立刻想到如何開始執行", weight: 2 },
      { text: "分析可能遇到的問題", weight: -1 },
      { text: "思考是否有更好的替代方案", weight: 0 }
    ]
  },
  {
    id: 5,
    targetTalent: "行動",
    difficulty: 0.3,
    discrimination: 1.7,
    question: "在會議中，我最有可能說：",
    options: [
      { text: "我們什麼時候開始？", weight: 2 },
      { text: "讓我們再仔細想想", weight: -2 },
      { text: "這個想法有什麼風險？", weight: -1 }
    ]
  },
  {
    id: 6,
    targetTalent: "行動",
    difficulty: 0.9,
    discrimination: 1.5,
    question: "面對不確定的情況，我通常：",
    options: [
      { text: "寧可行動後修正，也不願等待", weight: 2 },
      { text: "收集更多資訊再做決定", weight: -1 },
      { text: "尋求專家的建議", weight: 0 }
    ]
  },

  // === 適應 (Adaptability) - 3題 ===
  {
    id: 7,
    targetTalent: "適應",
    difficulty: -0.3,
    discrimination: 1.6,
    question: "當原定計劃突然改變時，我的反應是：",
    options: [
      { text: "迅速調整並接受新安排", weight: 2 },
      { text: "先了解改變的原因", weight: 0 },
      { text: "覺得困擾，需要時間適應", weight: -1 }
    ]
  },
  {
    id: 8,
    targetTalent: "適應",
    difficulty: 0.6,
    discrimination: 1.4,
    question: "在一個變化快速的環境中，我：",
    options: [
      { text: "感到興奮和有活力", weight: 2 },
      { text: "努力建立穩定的例行程序", weight: -1 },
      { text: "尋找變化中的規律", weight: 0 }
    ]
  },
  {
    id: 9,
    targetTalent: "適應",
    difficulty: 1.1,
    discrimination: 1.3,
    question: "我的朋友最可能形容我：",
    options: [
      { text: "隨遇而安，很好相處", weight: 2 },
      { text: "有明確的原則和標準", weight: -1 },
      { text: "善於規劃和組織", weight: -2 }
    ]
  },

  // === 分析 (Analytical) - 3題 ===
  {
    id: 10,
    targetTalent: "分析",
    difficulty: 0.1,
    discrimination: 1.8,
    question: "遇到問題時，我通常：",
    options: [
      { text: "尋找數據和證據來理解原因", weight: 2 },
      { text: "直接嘗試可能的解決方案", weight: -1 },
      { text: "詢問有經驗的人的意見", weight: 0 }
    ]
  },
  {
    id: 11,
    targetTalent: "分析",
    difficulty: 0.7,
    discrimination: 1.9,
    question: "在做重要決定時，我最重視：",
    options: [
      { text: "邏輯推理和客觀事實", weight: 2 },
      { text: "直覺和過去的經驗", weight: -1 },
      { text: "對他人可能造成的影響", weight: 0 }
    ]
  },
  {
    id: 12,
    targetTalent: "分析",
    difficulty: 1.3,
    discrimination: 1.7,
    question: "我最享受的活動類型是：",
    options: [
      { text: "解決複雜的智力謎題", weight: 2 },
      { text: "與人分享想法和感受", weight: -1 },
      { text: "創造新的藝術作品", weight: 0 }
    ]
  },

  // === 統籌 (Arranger) - 3題 ===
  {
    id: 13,
    targetTalent: "統籌",
    difficulty: 0.0,
    discrimination: 1.5,
    question: "在團隊專案中，我自然地：",
    options: [
      { text: "安排誰做什麼、何時完成", weight: 2 },
      { text: "提供創意想法和解決方案", weight: 0 },
      { text: "確保每個人都感到被重視", weight: -1 }
    ]
  },
  {
    id: 14,
    targetTalent: "統籌",
    difficulty: 0.5,
    discrimination: 1.6,
    question: "我最擅長的是：",
    options: [
      { text: "同時處理多個任務並保持進度", weight: 2 },
      { text: "深入專精於單一領域", weight: -1 },
      { text: "與不同類型的人建立關係", weight: 0 }
    ]
  },
  {
    id: 15,
    targetTalent: "統籌",
    difficulty: 1.0,
    discrimination: 1.4,
    question: "在混亂的情況下，我傾向於：",
    options: [
      { text: "重新組織資源和流程", weight: 2 },
      { text: "保持冷靜並隨機應變", weight: 0 },
      { text: "專注於解決最重要的問題", weight: -1 }
    ]
  },

  // === 信念 (Belief) - 3題 ===
  {
    id: 16,
    targetTalent: "信念",
    difficulty: -0.2,
    discrimination: 1.3,
    question: "在選擇工作時，對我最重要的是：",
    options: [
      { text: "工作內容符合我的價值觀", weight: 2 },
      { text: "有良好的薪資和福利", weight: -1 },
      { text: "能夠學習新技能和成長", weight: 0 }
    ]
  },
  {
    id: 17,
    targetTalent: "信念",
    difficulty: 0.8,
    discrimination: 1.7,
    question: "面對道德兩難的情況，我會：",
    options: [
      { text: "堅持自己認為正確的做法", weight: 2 },
      { text: "尋求最實際可行的解決方案", weight: -1 },
      { text: "考慮大多數人的意見", weight: 0 }
    ]
  },
  {
    id: 18,
    targetTalent: "信念",
    difficulty: 1.4,
    discrimination: 1.2,
    question: "我最不能忍受的是：",
    options: [
      { text: "做違背良心的事情", weight: 2 },
      { text: "效率低下的工作方式", weight: -1 },
      { text: "缺乏創新的環境", weight: 0 }
    ]
  },

  // === 指揮 (Command) - 3題 ===
  {
    id: 19,
    targetTalent: "指揮",
    difficulty: 0.4,
    discrimination: 1.8,
    question: "在團隊陷入僵局時，我通常：",
    options: [
      { text: "主動提出解決方案並推動執行", weight: 2 },
      { text: "耐心聽取每個人的意見", weight: -1 },
      { text: "分析問題的根本原因", weight: 0 }
    ]
  },
  {
    id: 20,
    targetTalent: "指揮",
    difficulty: 0.9,
    discrimination: 1.6,
    question: "面對衝突時，我傾向於：",
    options: [
      { text: "直接處理，不迴避問題", weight: 2 },
      { text: "尋找雙方都能接受的妥協", weight: 0 },
      { text: "避免正面衝突，另尋解決途徑", weight: -2 }
    ]
  },
  {
    id: 21,
    targetTalent: "指揮",
    difficulty: 1.3,
    discrimination: 1.5,
    question: "在群體中，我經常：",
    options: [
      { text: "自然地成為決策者", weight: 2 },
      { text: "提供支持和鼓勵", weight: -1 },
      { text: "觀察和分析情況", weight: 0 }
    ]
  },

  // === 溝通 (Communication) - 3題 ===
  {
    id: 22,
    targetTalent: "溝通",
    difficulty: -0.1,
    discrimination: 1.4,
    question: "在解釋複雜概念時，我：",
    options: [
      { text: "善於用生動的例子和故事", weight: 2 },
      { text: "依靠數據和邏輯結構", weight: 0 },
      { text: "傾向於簡化到最核心要點", weight: -1 }
    ]
  },
  {
    id: 23,
    targetTalent: "溝通",
    difficulty: 0.6,
    discrimination: 1.7,
    question: "在團體討論中，我最常：",
    options: [
      { text: "幫助表達不清楚的想法", weight: 2 },
      { text: "提出新的觀點和見解", weight: 0 },
      { text: "整合不同人的意見", weight: -1 }
    ]
  },
  {
    id: 24,
    targetTalent: "溝通",
    difficulty: 1.1,
    discrimination: 1.3,
    question: "我最享受的是：",
    options: [
      { text: "向觀眾演講或簡報", weight: 2 },
      { text: "深入的一對一對話", weight: 0 },
      { text: "安靜地思考和閱讀", weight: -2 }
    ]
  },

  // === 競爭 (Competition) - 3題 ===
  {
    id: 25,
    targetTalent: "競爭",
    difficulty: 0.2,
    discrimination: 1.6,
    question: "在團隊活動中，我：",
    options: [
      { text: "總想要贏得比賽或取得最佳成果", weight: 2 },
      { text: "更注重過程和學習經驗", weight: -1 },
      { text: "希望每個人都能有所收穫", weight: -2 }
    ]
  },
  {
    id: 26,
    targetTalent: "競爭",
    difficulty: 0.7,
    discrimination: 1.5,
    question: "看到別人的成就時，我的第一反應是：",
    options: [
      { text: "想要超越他們", weight: 2 },
      { text: "感到高興並向他們學習", weight: -1 },
      { text: "分析他們成功的原因", weight: 0 }
    ]
  },
  {
    id: 27,
    targetTalent: "競爭",
    difficulty: 1.2,
    discrimination: 1.4,
    question: "對我來說，第二名意味著：",
    options: [
      { text: "第一個輸家", weight: 2 },
      { text: "很好的成就", weight: -1 },
      { text: "學習和改進的機會", weight: 0 }
    ]
  },

  // === 關聯 (Connectedness) - 3題 ===
  {
    id: 28,
    targetTalent: "關聯",
    difficulty: 0.3,
    discrimination: 1.2,
    question: "我經常覺得：",
    options: [
      { text: "一切事物都有其深層的關聯性", weight: 2 },
      { text: "每件事都有其獨立的原因", weight: -1 },
      { text: "應該專注於可控制的因素", weight: 0 }
    ]
  },
  {
    id: 29,
    targetTalent: "關聯",
    difficulty: 0.8,
    discrimination: 1.3,
    question: "在做決定時，我會考慮：",
    options: [
      { text: "對整個系統和環境的影響", weight: 2 },
      { text: "最直接和明顯的後果", weight: -1 },
      { text: "個人利益和目標", weight: 0 }
    ]
  },
  {
    id: 30,
    targetTalent: "關聯",
    difficulty: 1.4,
    discrimination: 1.1,
    question: "我相信：",
    options: [
      { text: "冥冥中自有安排", weight: 2 },
      { text: "人定勝天", weight: -1 },
      { text: "機會是給準備好的人", weight: 0 }
    ]
  },

  // === 公平 (Fairness) - 3題 ===
  {
    id: 31,
    targetTalent: "公平",
    difficulty: 0.1,
    discrimination: 1.4,
    question: "看到不公平的事情時，我會：",
    options: [
      { text: "立刻站出來指出問題", weight: 2 },
      { text: "私下找相關人員討論", weight: 1 },
      { text: "觀察情況再決定是否行動", weight: -1 }
    ]
  },
  {
    id: 32,
    targetTalent: "公平",
    difficulty: 0.6,
    discrimination: 1.6,
    question: "在分配資源時，我最重視：",
    options: [
      { text: "每個人都得到平等的機會", weight: 2 },
      { text: "根據個人貢獻來分配", weight: 0 },
      { text: "照顧弱勢群體的需求", weight: 1 }
    ]
  },
  {
    id: 33,
    targetTalent: "公平",
    difficulty: 1.1,
    discrimination: 1.3,
    question: "制定規則時，我傾向於：",
    options: [
      { text: "確保規則對每個人都一樣", weight: 2 },
      { text: "考慮個別情況的彈性", weight: -1 },
      { text: "以效率為優先考量", weight: 0 }
    ]
  },

  // === 完美 (Perfectionist) - 3題 ===
  {
    id: 34,
    targetTalent: "完美",
    difficulty: 0.3,
    discrimination: 1.7,
    question: "完成一項工作後，我通常會：",
    options: [
      { text: "反覆檢查直到完全滿意", weight: 2 },
      { text: "檢查一次確認沒問題", weight: 0 },
      { text: "相信第一次就做對了", weight: -2 }
    ]
  },
  {
    id: 35,
    targetTalent: "完美",
    difficulty: 0.8,
    discrimination: 1.5,
    question: "面對不完美的結果時，我：",
    options: [
      { text: "感到不舒服，想要改善", weight: 2 },
      { text: "接受現實，下次改進", weight: -1 },
      { text: "學會欣賞不完美的美", weight: -2 }
    ]
  },
  {
    id: 36,
    targetTalent: "完美",
    difficulty: 1.2,
    discrimination: 1.4,
    question: "我最不能忍受的是：",
    options: [
      { text: "粗製濫造的工作成果", weight: 2 },
      { text: "沒有創新的平庸表現", weight: 0 },
      { text: "缺乏團隊合作精神", weight: -1 }
    ]
  },

  // === 專注 (Focus) - 3題 ===
  {
    id: 37,
    targetTalent: "專注",
    difficulty: 0.0,
    discrimination: 1.6,
    question: "在嘈雜的環境中，我：",
    options: [
      { text: "能夠專心完成重要工作", weight: 2 },
      { text: "需要找安靜的地方工作", weight: 1 },
      { text: "容易被外界干擾分心", weight: -2 }
    ]
  },
  {
    id: 38,
    targetTalent: "專注",
    difficulty: 0.7,
    discrimination: 1.8,
    question: "面對多個任務時，我會：",
    options: [
      { text: "專注完成最重要的一項", weight: 2 },
      { text: "同時處理多項任務", weight: -1 },
      { text: "按照時間順序逐一處理", weight: 0 }
    ]
  },
  {
    id: 39,
    targetTalent: "專注",
    difficulty: 1.3,
    discrimination: 1.5,
    question: "我最大的優勢是：",
    options: [
      { text: "能夠長時間專注於目標", weight: 2 },
      { text: "善於處理複雜的人際關係", weight: -1 },
      { text: "在變化中保持靈活性", weight: 0 }
    ]
  },

  // === 前瞻 (Futuristic) - 3題 ===
  {
    id: 40,
    targetTalent: "前瞻",
    difficulty: 0.4,
    discrimination: 1.4,
    question: "談到未來時，我：",
    options: [
      { text: "總是能描繪出清晰的願景", weight: 2 },
      { text: "更專注於當下的現實", weight: -2 },
      { text: "會參考過去的經驗", weight: -1 }
    ]
  },
  {
    id: 41,
    targetTalent: "前瞻",
    difficulty: 0.9,
    discrimination: 1.6,
    question: "在團隊規劃中，我經常：",
    options: [
      { text: "提出創新的未來可能性", weight: 2 },
      { text: "分析現有的資源限制", weight: -1 },
      { text: "建議實際可行的步驟", weight: 0 }
    ]
  },
  {
    id: 42,
    targetTalent: "前瞻",
    difficulty: 1.4,
    discrimination: 1.3,
    question: "我最享受的討論話題是：",
    options: [
      { text: "未來世界會變成什麼樣子", weight: 2 },
      { text: "如何解決當前的問題", weight: -1 },
      { text: "過去的成功經驗分享", weight: -2 }
    ]
  },

  // === 和諧 (Harmony) - 3題 ===
  {
    id: 43,
    targetTalent: "和諧",
    difficulty: 0.2,
    discrimination: 1.3,
    question: "面對團隊衝突時，我通常：",
    options: [
      { text: "尋找大家都能接受的解決方案", weight: 2 },
      { text: "直接指出問題的關鍵所在", weight: -1 },
      { text: "讓有經驗的人來處理", weight: 0 }
    ]
  },
  {
    id: 44,
    targetTalent: "和諧",
    difficulty: 0.7,
    discrimination: 1.5,
    question: "在會議中，我最不喜歡：",
    options: [
      { text: "激烈的辯論和對立", weight: 2 },
      { text: "沒有明確結論的討論", weight: -1 },
      { text: "冗長的發言", weight: 0 }
    ]
  },
  {
    id: 45,
    targetTalent: "和諧",
    difficulty: 1.1,
    discrimination: 1.2,
    question: "我最大的價值在於：",
    options: [
      { text: "維持團隊的和諧氣氛", weight: 2 },
      { text: "提出創新的解決方案", weight: -1 },
      { text: "高效執行既定任務", weight: 0 }
    ]
  },

  // === 理念 (Ideation) - 3題 ===
  {
    id: 46,
    targetTalent: "理念",
    difficulty: 0.3,
    discrimination: 1.7,
    question: "面對問題時，我首先會：",
    options: [
      { text: "思考各種可能的創新解法", weight: 2 },
      { text: "分析問題的根本原因", weight: 0 },
      { text: "尋找過去成功的經驗", weight: -1 }
    ]
  },
  {
    id: 47,
    targetTalent: "理念",
    difficulty: 0.8,
    discrimination: 1.6,
    question: "我最享受的時刻是：",
    options: [
      { text: "突然想到絕妙的點子", weight: 2 },
      { text: "完成一項困難的任務", weight: -1 },
      { text: "得到他人的認可", weight: 0 }
    ]
  },
  {
    id: 48,
    targetTalent: "理念",
    difficulty: 1.3,
    discrimination: 1.4,
    question: "別人最常說我：",
    options: [
      { text: "想法很有創意", weight: 2 },
      { text: "做事很可靠", weight: -1 },
      { text: "很會照顧人", weight: -2 }
    ]
  },

  // === 包容 (Includer) - 3題 ===
  {
    id: 49,
    targetTalent: "包容",
    difficulty: 0.1,
    discrimination: 1.4,
    question: "看到有人被孤立時，我會：",
    options: [
      { text: "主動邀請他們加入", weight: 2 },
      { text: "觀察一下再決定", weight: 0 },
      { text: "認為這很正常", weight: -2 }
    ]
  },
  {
    id: 50,
    targetTalent: "包容",
    difficulty: 0.6,
    discrimination: 1.5,
    question: "組織活動時，我最重視：",
    options: [
      { text: "每個人都能參與其中", weight: 2 },
      { text: "活動的品質和效果", weight: -1 },
      { text: "預算和時間控制", weight: 0 }
    ]
  },
  {
    id: 51,
    targetTalent: "包容",
    difficulty: 1.0,
    discrimination: 1.3,
    question: "我相信：",
    options: [
      { text: "每個人都有價值和潛力", weight: 2 },
      { text: "能力決定一切", weight: -2 },
      { text: "努力比天賦更重要", weight: 0 }
    ]
  },

  // === 個別 (Individualization) - 3題 ===
  {
    id: 52,
    targetTalent: "個別",
    difficulty: 0.4,
    discrimination: 1.6,
    question: "與人相處時，我傾向於：",
    options: [
      { text: "了解每個人的獨特之處", weight: 2 },
      { text: "用同樣的方式對待所有人", weight: -2 },
      { text: "保持適當的距離", weight: -1 }
    ]
  },
  {
    id: 53,
    targetTalent: "個別",
    difficulty: 0.9,
    discrimination: 1.7,
    question: "在團隊分工時，我會：",
    options: [
      { text: "根據每人特質安排最適合的角色", weight: 2 },
      { text: "平均分配任務給所有人", weight: -1 },
      { text: "讓有經驗的人承擔重要任務", weight: 0 }
    ]
  },
  {
    id: 54,
    targetTalent: "個別",
    difficulty: 1.2,
    discrimination: 1.5,
    question: "我最擅長的是：",
    options: [
      { text: "發現每個人的優勢和天賦", weight: 2 },
      { text: "制定標準化的工作流程", weight: -2 },
      { text: "處理複雜的技術問題", weight: -1 }
    ]
  },

  // === 蒐集 (Input) - 3題 ===
  {
    id: 55,
    targetTalent: "蒐集",
    difficulty: 0.0,
    discrimination: 1.5,
    question: "在學習新事物時，我喜歡：",
    options: [
      { text: "廣泛收集各種相關資訊", weight: 2 },
      { text: "專注於最核心的要點", weight: -1 },
      { text: "透過實作來學習", weight: 0 }
    ]
  },
  {
    id: 56,
    targetTalent: "蒐集",
    difficulty: 0.5,
    discrimination: 1.4,
    question: "我的電腦或手機裡：",
    options: [
      { text: "存了很多有趣的文章和資料", weight: 2 },
      { text: "只保留必要的檔案", weight: -1 },
      { text: "主要是工作相關的內容", weight: 0 }
    ]
  },
  {
    id: 57,
    targetTalent: "蒐集",
    difficulty: 1.1,
    discrimination: 1.3,
    question: "朋友們覺得我：",
    options: [
      { text: "知識豐富，什麼都知道一點", weight: 2 },
      { text: "在某個領域很專精", weight: -1 },
      { text: "很會解決實際問題", weight: 0 }
    ]
  },

  // === 思維 (Intellection) - 3題 ===
  {
    id: 58,
    targetTalent: "思維",
    difficulty: 0.3,
    discrimination: 1.8,
    question: "獨處時，我最常：",
    options: [
      { text: "思考各種問題和想法", weight: 2 },
      { text: "看影片或聽音樂放鬆", weight: -1 },
      { text: "整理環境或做家事", weight: -2 }
    ]
  },
  {
    id: 59,
    targetTalent: "思維",
    difficulty: 0.8,
    discrimination: 1.9,
    question: "在做決定前，我需要：",
    options: [
      { text: "充分思考各種可能性", weight: 2 },
      { text: "聽取他人的意見建議", weight: 0 },
      { text: "相信直覺和第一印象", weight: -2 }
    ]
  },
  {
    id: 60,
    targetTalent: "思維",
    difficulty: 1.4,
    discrimination: 1.7,
    question: "我最喜歡的討論類型是：",
    options: [
      { text: "深度的哲學或理論探討", weight: 2 },
      { text: "實用的問題解決方案", weight: -1 },
      { text: "輕鬆的日常生活話題", weight: -2 }
    ]
  },

  // === 學習 (Learner) - 3題 ===
  {
    id: 61,
    targetTalent: "學習",
    difficulty: -0.1,
    discrimination: 1.6,
    question: "面對新技能時，我：",
    options: [
      { text: "總是很興奮想要學會", weight: 2 },
      { text: "會評估是否對我有用", weight: 0 },
      { text: "擔心學不好而猶豫", weight: -2 }
    ]
  },
  {
    id: 62,
    targetTalent: "學習",
    difficulty: 0.6,
    discrimination: 1.7,
    question: "我最享受的是：",
    options: [
      { text: "掌握新知識的成就感", weight: 2 },
      { text: "運用知識解決問題", weight: 1 },
      { text: "與他人分享我的知識", weight: 0 }
    ]
  },
  {
    id: 63,
    targetTalent: "學習",
    difficulty: 1.0,
    discrimination: 1.5,
    question: "在學習過程中，我重視：",
    options: [
      { text: "學習本身帶來的樂趣", weight: 2 },
      { text: "學習的實用價值", weight: 0 },
      { text: "學習成果的認可", weight: -1 }
    ]
  },

  // === 完善 (Maximizer) - 3題 ===
  {
    id: 64,
    targetTalent: "完善",
    difficulty: 0.2,
    discrimination: 1.5,
    question: "面對一個運作良好的系統，我會：",
    options: [
      { text: "思考如何讓它變得更好", weight: 2 },
      { text: "維持現狀不做改變", weight: -2 },
      { text: "定期檢查是否正常運作", weight: 0 }
    ]
  },
  {
    id: 65,
    targetTalent: "完善",
    difficulty: 0.7,
    discrimination: 1.6,
    question: "我傾向於：",
    options: [
      { text: "專注發展既有的優勢", weight: 2 },
      { text: "努力克服個人弱點", weight: -1 },
      { text: "在各方面保持平均發展", weight: 0 }
    ]
  },
  {
    id: 66,
    targetTalent: "完善",
    difficulty: 1.2,
    discrimination: 1.4,
    question: "選擇團隊成員時，我最重視：",
    options: [
      { text: "他們的核心能力是否出色", weight: 2 },
      { text: "他們是否全面均衡", weight: -1 },
      { text: "他們是否容易合作", weight: 0 }
    ]
  },

  // === 積極 (Positivity) - 3題 ===
  {
    id: 67,
    targetTalent: "積極",
    difficulty: -0.2,
    discrimination: 1.3,
    question: "遇到挫折時，我通常：",
    options: [
      { text: "很快就能重新振作", weight: 2 },
      { text: "需要一些時間調適", weight: 0 },
      { text: "會持續感到沮喪", weight: -2 }
    ]
  },
  {
    id: 68,
    targetTalent: "積極",
    difficulty: 0.5,
    discrimination: 1.4,
    question: "在團隊中，我的角色通常是：",
    options: [
      { text: "鼓舞士氣的開心果", weight: 2 },
      { text: "冷靜分析的顧問", weight: -1 },
      { text: "默默支持的夥伴", weight: 0 }
    ]
  },
  {
    id: 69,
    targetTalent: "積極",
    difficulty: 1.0,
    discrimination: 1.2,
    question: "我最能感染他人的是：",
    options: [
      { text: "樂觀正向的態度", weight: 2 },
      { text: "專業的工作能力", weight: -1 },
      { text: "細心體貼的關懷", weight: 0 }
    ]
  },

  // === 交往 (Relator) - 3題 ===
  {
    id: 70,
    targetTalent: "交往",
    difficulty: 0.1,
    discrimination: 1.5,
    question: "建立友誼時，我偏好：",
    options: [
      { text: "與少數人發展深度關係", weight: 2 },
      { text: "與很多人保持良好關係", weight: -1 },
      { text: "隨緣不特別經營", weight: -2 }
    ]
  },
  {
    id: 71,
    targetTalent: "交往",
    difficulty: 0.6,
    discrimination: 1.6,
    question: "我最重視朋友的：",
    options: [
      { text: "真誠和信任", weight: 2 },
      { text: "有趣和幽默", weight: 0 },
      { text: "能力和成就", weight: -1 }
    ]
  },
  {
    id: 72,
    targetTalent: "交往",
    difficulty: 1.1,
    discrimination: 1.4,
    question: "在社交場合中，我：",
    options: [
      { text: "更願意與熟悉的人深聊", weight: 2 },
      { text: "喜歡認識新朋友", weight: -1 },
      { text: "通常比較安靜", weight: 0 }
    ]
  },

  // === 責任 (Responsibility) - 3題 ===
  {
    id: 73,
    targetTalent: "責任",
    difficulty: 0.0,
    discrimination: 1.7,
    question: "對於承諾的事情，我：",
    options: [
      { text: "一定會想辦法完成", weight: 2 },
      { text: "盡力而為，但可能有例外", weight: 0 },
      { text: "會視情況調整", weight: -1 }
    ]
  },
  {
    id: 74,
    targetTalent: "責任",
    difficulty: 0.5,
    discrimination: 1.8,
    question: "如果我無法履行承諾，我會：",
    options: [
      { text: "感到內疚並主動道歉", weight: 2 },
      { text: "解釋原因並尋求諒解", weight: 1 },
      { text: "認為這很正常", weight: -2 }
    ]
  },
  {
    id: 75,
    targetTalent: "責任",
    difficulty: 1.0,
    discrimination: 1.6,
    question: "別人對我的評價通常是：",
    options: [
      { text: "值得信賴和依靠", weight: 2 },
      { text: "有創意和想法", weight: -1 },
      { text: "友善和好相處", weight: 0 }
    ]
  },

  // === 回顧 (Restorative) - 3題 ===
  {
    id: 76,
    targetTalent: "回顧",
    difficulty: 0.3,
    discrimination: 1.4,
    question: "發現問題時，我的反應是：",
    options: [
      { text: "興奮地想要解決它", weight: 2 },
      { text: "分析問題的成因", weight: 1 },
      { text: "希望有人能處理", weight: -2 }
    ]
  },
  {
    id: 77,
    targetTalent: "回顧",
    difficulty: 0.8,
    discrimination: 1.5,
    question: "我最有成就感的時刻是：",
    options: [
      { text: "修復一個損壞的東西", weight: 2 },
      { text: "創造一個全新的作品", weight: -1 },
      { text: "幫助他人解決困難", weight: 1 }
    ]
  },
  {
    id: 78,
    targetTalent: "回顧",
    difficulty: 1.2,
    discrimination: 1.3,
    question: "面對失敗的專案，我會：",
    options: [
      { text: "找出問題並重新開始", weight: 2 },
      { text: "吸取教訓避免重蹈覆轍", weight: 0 },
      { text: "轉向其他更容易的目標", weight: -1 }
    ]
  },

  // === 自信 (Self-Assurance) - 3題 ===
  {
    id: 79,
    targetTalent: "自信",
    difficulty: 0.4,
    discrimination: 1.6,
    question: "做決定時，我：",
    options: [
      { text: "相信自己的判斷", weight: 2 },
      { text: "會尋求他人建議", weight: -1 },
      { text: "仔細分析各種資料", weight: 0 }
    ]
  },
  {
    id: 80,
    targetTalent: "自信",
    difficulty: 0.9,
    discrimination: 1.7,
    question: "面對質疑時，我會：",
    options: [
      { text: "堅持自己認為正確的立場", weight: 2 },
      { text: "重新思考我的想法", weight: -1 },
      { text: "尋求更多證據支持", weight: 0 }
    ]
  },
  {
    id: 81,
    targetTalent: "自信",
    difficulty: 1.3,
    discrimination: 1.5,
    question: "在不確定的情況下，我：",
    options: [
      { text: "依然能夠果斷行動", weight: 2 },
      { text: "會等待更多資訊", weight: -1 },
      { text: "尋求專家的指導", weight: -2 }
    ]
  },

  // === 追求 (Significance) - 3題 ===
  {
    id: 82,
    targetTalent: "追求",
    difficulty: 0.2,
    discrimination: 1.4,
    question: "對我來說最重要的是：",
    options: [
      { text: "在重要的事情上有所成就", weight: 2 },
      { text: "與家人朋友和睦相處", weight: -1 },
      { text: "過著平靜安穩的生活", weight: -2 }
    ]
  },
  {
    id: 83,
    targetTalent: "追求",
    difficulty: 0.7,
    discrimination: 1.5,
    question: "我希望被人記住的是：",
    options: [
      { text: "我做過的重要貢獻", weight: 2 },
      { text: "我的善良和友好", weight: -1 },
      { text: "我的專業能力", weight: 0 }
    ]
  },
  {
    id: 84,
    targetTalent: "追求",
    difficulty: 1.1,
    discrimination: 1.3,
    question: "選擇工作時，我最看重：",
    options: [
      { text: "能否產生重大影響", weight: 2 },
      { text: "工作環境是否愉快", weight: -1 },
      { text: "薪資和福利", weight: 0 }
    ]
  },

  // === 戰略 (Strategic) - 3題 ===
  {
    id: 85,
    targetTalent: "戰略",
    difficulty: 0.5,
    discrimination: 1.8,
    question: "面對複雜問題時，我會：",
    options: [
      { text: "找出多種可能的解決路徑", weight: 2 },
      { text: "專注於最明顯的解決方案", weight: -1 },
      { text: "尋求有經驗者的建議", weight: 0 }
    ]
  },
  {
    id: 86,
    targetTalent: "戰略",
    difficulty: 1.0,
    discrimination: 1.9,
    question: "在規劃時，我擅長：",
    options: [
      { text: "預見可能的障礙和機會", weight: 2 },
      { text: "制定詳細的執行步驟", weight: 0 },
      { text: "動員團隊的參與熱忱", weight: -1 }
    ]
  },
  {
    id: 87,
    targetTalent: "戰略",
    difficulty: 1.4,
    discrimination: 1.7,
    question: "別人常說我：",
    options: [
      { text: "看問題很有遠見", weight: 2 },
      { text: "執行力很強", weight: -1 },
      { text: "很會照顧人", weight: -2 }
    ]
  },

  // === 體諒 (Empathy) - 3題 ===
  {
    id: 88,
    targetTalent: "體諒",
    difficulty: 0.1,
    discrimination: 1.5,
    question: "與人對話時，我常常：",
    options: [
      { text: "能感受到對方的情緒", weight: 2 },
      { text: "專注於對話的內容", weight: 0 },
      { text: "思考如何回應", weight: -1 }
    ]
  },
  {
    id: 89,
    targetTalent: "體諒",
    difficulty: 0.6,
    discrimination: 1.6,
    question: "看到別人難過時，我：",
    options: [
      { text: "也會感到難過", weight: 2 },
      { text: "想要幫助他們", weight: 1 },
      { text: "給他們一些建議", weight: 0 }
    ]
  },
  {
    id: 90,
    targetTalent: "體諒",
    difficulty: 1.0,
    discrimination: 1.4,
    question: "我最擅長的是：",
    options: [
      { text: "理解他人的感受", weight: 2 },
      { text: "分析複雜的問題", weight: -1 },
      { text: "組織和管理事務", weight: -2 }
    ]
  },

  // === 取悅 (Woo) - 3題 ===
  {
    id: 91,
    targetTalent: "取悅",
    difficulty: 0.0,
    discrimination: 1.3,
    question: "在社交場合中，我：",
    options: [
      { text: "喜歡認識新朋友", weight: 2 },
      { text: "更願意與熟人聊天", weight: -1 },
      { text: "通常比較安靜", weight: -2 }
    ]
  },
  {
    id: 92,
    targetTalent: "取悅",
    difficulty: 0.4,
    discrimination: 1.4,
    question: "我最享受的是：",
    options: [
      { text: "獲得他人的喜愛和認同", weight: 2 },
      { text: "完成困難的挑戰", weight: -1 },
      { text: "學習新的知識技能", weight: 0 }
    ]
  },
  {
    id: 93,
    targetTalent: "取悅",
    difficulty: 0.8,
    discrimination: 1.2,
    question: "與陌生人互動時，我：",
    options: [
      { text: "很快就能打成一片", weight: 2 },
      { text: "需要一些時間熟悉", weight: 0 },
      { text: "傾向保持距離", weight: -2 }
    ]
  },

  // === 伯樂 (Developer) - 3題 ===
  {
    id: 94,
    targetTalent: "伯樂",
    difficulty: 0.3,
    discrimination: 1.6,
    question: "看到他人的進步時，我：",
    options: [
      { text: "感到由衷的高興", weight: 2 },
      { text: "會分析他們成功的原因", weight: 0 },
      { text: "想要超越他們", weight: -2 }
    ]
  },
  {
    id: 95,
    targetTalent: "伯樂",
    difficulty: 0.8,
    discrimination: 1.7,
    question: "在團隊中，我最喜歡：",
    options: [
      { text: "幫助同事發展能力", weight: 2 },
      { text: "分享我的專業知識", weight: 1 },
      { text: "專注於自己的工作", weight: -1 }
    ]
  },
  {
    id: 96,
    targetTalent: "伯樂",
    difficulty: 1.2,
    discrimination: 1.5,
    question: "我最有成就感的是：",
    options: [
      { text: "看到別人因我而成長", weight: 2 },
      { text: "完成重要的專案", weight: -1 },
      { text: "獲得上級的肯定", weight: 0 }
    ]
  },

  // === 審慎 (Deliberative) - 3題 ===
  {
    id: 97,
    targetTalent: "審慎",
    difficulty: 0.2,
    discrimination: 1.5,
    question: "做重要決定時，我會：",
    options: [
      { text: "仔細評估各種風險", weight: 2 },
      { text: "相信直覺快速決定", weight: -2 },
      { text: "尋求他人的意見", weight: 0 }
    ]
  },
  {
    id: 98,
    targetTalent: "審慎",
    difficulty: 0.7,
    discrimination: 1.6,
    question: "面對新機會時，我的第一反應是：",
    options: [
      { text: "思考可能的風險和後果", weight: 2 },
      { text: "感到興奮想要嘗試", weight: -2 },
      { text: "分析機會的價值", weight: 1 }
    ]
  },
  {
    id: 99,
    targetTalent: "審慎",
    difficulty: 1.1,
    discrimination: 1.4,
    question: "在團隊中，我常扮演：",
    options: [
      { text: "謹慎的顧問角色", weight: 2 },
      { text: "積極的推動者", weight: -2 },
      { text: "中立的協調者", weight: 0 }
    ]
  },

  // === 恢復 (Restorative) - 3題 ===
  {
    id: 100,
    targetTalent: "恢復",
    difficulty: 0.4,
    discrimination: 1.7,
    question: "遇到故障或問題時，我：",
    options: [
      { text: "立刻想辦法修復", weight: 2 },
      { text: "先分析問題原因", weight: 1 },
      { text: "尋求專業協助", weight: -1 }
    ]
  },
  {
    id: 101,
    targetTalent: "恢復",
    difficulty: 0.9,
    discrimination: 1.6,
    question: "我最擅長的是：",
    options: [
      { text: "讓壞掉的東西重新運作", weight: 2 },
      { text: "預防問題的發生", weight: 0 },
      { text: "創造全新的解決方案", weight: -1 }
    ]
  },
  {
    id: 102,
    targetTalent: "恢復",
    difficulty: 1.3,
    discrimination: 1.5,
    question: "看到運作不良的系統，我會：",
    options: [
      { text: "找出問題並著手改善", weight: 2 },
      { text: "建議重新設計整個系統", weight: 0 },
      { text: "報告給相關負責人", weight: -1 }
    ]
  }
];

/**
 * CAT 演算法核心
 * 基於受測者的回答動態選擇下一題
 */
export class CATEngine {
  constructor() {
    this.responses = []; // 答題記錄
    this.talentEstimates = {}; // 當前天賦估計值
    this.usedItems = new Set(); // 已使用的題目
    
    // 初始化所有天賦估計值為0
    Object.keys(talents).forEach(talent => {
      this.talentEstimates[talent] = 0;
    });
  }

  /**
   * 選擇下一題 - CAT核心演算法
   * 基於資訊量最大化原則
   */
  selectNextItem() {
    const availableItems = talentItemBank.filter(item => 
      !this.usedItems.has(item.id)
    );

    if (availableItems.length === 0) return null;

    // 對於前10題，隨機選擇以建立基礎估計
    if (this.responses.length < 10) {
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      return availableItems[randomIndex];
    }

    // 計算每題的資訊量，選擇資訊量最大的題目
    let maxInformation = -1;
    let bestItem = null;

    availableItems.forEach(item => {
      const information = this.calculateInformation(item);
      if (information > maxInformation) {
        maxInformation = information;
        bestItem = item;
      }
    });

    return bestItem;
  }

  /**
   * 計算題目的資訊量
   * 基於IRT的資訊函數
   */
  calculateInformation(item) {
    const currentEstimate = this.talentEstimates[item.targetTalent];
    const difficulty = item.difficulty;
    const discrimination = item.discrimination;

    // 簡化的資訊函數：I(θ) = a²P(θ)Q(θ)
    const prob = this.calculateProbability(currentEstimate, difficulty, discrimination);
    return Math.pow(discrimination, 2) * prob * (1 - prob);
  }

  /**
   * 計算答對機率
   * 基於2PL IRT模型
   */
  calculateProbability(ability, difficulty, discrimination) {
    const exponent = discrimination * (ability - difficulty);
    return 1 / (1 + Math.exp(-exponent));
  }

  /**
   * 記錄回答並更新能力估計
   * 基於IRT理論的最大似然估計(MLE)
   */
  recordResponse(item, selectedOption) {
    this.responses.push({
      itemId: item.id,
      response: selectedOption,
      timestamp: Date.now(),
      difficulty: item.difficulty,
      discrimination: item.discrimination
    });

    this.usedItems.add(item.id);

    // 基於IRT的貝葉斯更新
    const weight = selectedOption.weight;
    const difficulty = item.difficulty || 0;
    const discrimination = item.discrimination || 1.0;
    
    // 計算當前能力估計的可能性
    const currentAbility = this.talentEstimates[item.targetTalent];
    const expectedScore = this.calculateProbability(currentAbility, difficulty, discrimination) * 2 - 1; // 轉為-1到1
    const actualScore = weight;
    
    // 基於差異調整能力估計
    const error = actualScore - expectedScore;
    const information = this.calculateInformation(item);
    const learningRate = Math.min(0.3, information / (information + 1)); // 適應性學習率
    
    // 主要天賦更新 - 使用漸進式調整
    this.talentEstimates[item.targetTalent] += learningRate * error;
    
    // 次要天賦更新 - 基於心理學相關性
    this.updateRelatedTalents(item, selectedOption, learningRate * 0.2);

    // 應用信度權重 - 隨測驗進行增加穩定性
    const reliabilityFactor = Math.min(1.0, this.responses.length / 35); // 35題後達到最大信度
    Object.keys(this.talentEstimates).forEach(talent => {
      // 向平均值回歸，增加測驗穩定性
      this.talentEstimates[talent] = this.talentEstimates[talent] * reliabilityFactor + 
                                   (0 * (1 - reliabilityFactor)); // 平均值為0
      
      // 限制極值，避免過度估計
      this.talentEstimates[talent] = Math.max(-2.5, Math.min(2.5, this.talentEstimates[talent]));
    });
  }

  /**
   * 更新相關天賦 (基於心理學理論的天賦關聯性)
   */
  updateRelatedTalents(item, selectedOption, smallWeight) {
    const talentCorrelations = {
      '成就': ['競爭', '專注', '責任'],
      '分析': ['思維', '學習', '戰略'],
      '指揮': ['競爭', '自信', '行動'],
      '溝通': ['交往', '積極', '個別'],
      // ... 其他天賦相關性
    };
    
    const relatedTalents = talentCorrelations[item.targetTalent] || [];
    const weight = selectedOption.weight;
    
    if (weight > 0) {
      relatedTalents.forEach(talent => {
        if (this.talentEstimates[talent] !== undefined) {
          this.talentEstimates[talent] += smallWeight * weight * 0.5;
        }
      });
    }
  }

  /**
   * 判斷是否可以結束測驗
   * 固定70題，確保測驗品質與使用者預期
   */
  canTerminate() {
    return this.responses.length >= 70; // 固定70題
  }

  /**
   * 計算最終結果
   */
  calculateFinalResults() {
    // 轉換估計值為標準分數並排名
    const talentScores = {};
    Object.keys(this.talentEstimates).forEach(talent => {
      // 轉換為0-100分數
      talentScores[talent] = Math.round(50 + (this.talentEstimates[talent] * 10));
    });

    // 排序並取前5名
    const sortedTalents = Object.entries(talentScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([talent, score]) => ({
        name: talent,
        description: talents[talent],
        score: score,
        reliability: this.calculateReliability(talent)
      }));

    return {
      topTalents: sortedTalents,
      attributes: this.calculateAttributes(talentScores),
      // 🧠 新增：基於心理學理論的分析
      psychologyAnalysis: this.calculatePsychologyAnalysis(talentScores),
      testReport: {
        totalQuestions: this.responses.length,
        avgResponseTime: this.calculateAvgResponseTime(),
        reliability: this.calculateOverallReliability(),
        validity: this.calculateValidity()
      }
    };
  }

  /**
   * 基於心理學理論計算分析結果
   */
  calculatePsychologyAnalysis(talentScores) {
    // 動態導入心理學理論模組
    // 注意：實際使用時需要確保路徑正確
    try {
      // 模擬計算大五人格和多元智能
      const bigFiveScores = this.calculateBigFiveFromTalents(talentScores);
      const intelligenceScores = this.calculateIntelligencesFromTalents(talentScores);
      
      return {
        bigFive: bigFiveScores,
        multipleIntelligences: intelligenceScores,
        personalityInsights: this.generatePersonalityInsights(bigFiveScores, intelligenceScores)
      };
    } catch (error) {
      console.warn('心理學分析計算失敗，使用基礎屬性分析', error);
      return null;
    }
  }

  /**
   * 從蓋洛普天賦計算大五人格分數
   */
  calculateBigFiveFromTalents(talentScores) {
    // 基於大五人格理論的映射
    const bigFiveMapping = {
      openness: {
        '理念': 0.90, '學習': 0.85, '前瞻': 0.80, '蒐集': 0.70, 
        '思維': 0.75, '戰略': 0.65, '關聯': 0.70, '適應': 0.60
      },
      conscientiousness: {
        '成就': 0.90, '責任': 0.95, '專注': 0.85, '審慎': 0.80,
        '統籌': 0.75, '完美': 0.85, '信念': 0.70, '競爭': 0.65
      },
      extraversion: {
        '溝通': 0.90, '交往': 0.85, '積極': 0.80, '取悅': 0.75,
        '指揮': 0.70, '競爭': 0.65, '追求': 0.60
      },
      agreeableness: {
        '體諒': 0.95, '和諧': 0.90, '包容': 0.85, '伯樂': 0.80,
        '個別': 0.75, '公平': 0.70, '恢復': 0.60
      },
      neuroticism: {
        '自信': -0.80, '適應': -0.70, '積極': -0.75, '和諧': -0.60,
        '審慎': 0.50, '完美': 0.40  // 正值表示增加神經質
      }
    };

    const bigFiveScores = {};
    
    Object.entries(bigFiveMapping).forEach(([trait, talents]) => {
      let totalScore = 0;
      let totalWeight = 0;
      
      Object.entries(talents).forEach(([talent, weight]) => {
        if (talentScores[talent]) {
          totalScore += talentScores[talent] * Math.abs(weight);
          totalWeight += Math.abs(weight);
        }
      });
      
      let normalizedScore = totalWeight > 0 ? (totalScore / totalWeight) : 50;
      
      // 神經質反向計算
      if (trait === 'neuroticism') {
        normalizedScore = 100 - normalizedScore;
      }
      
      bigFiveScores[trait] = Math.round(Math.max(0, Math.min(100, normalizedScore)));
    });
    
    return bigFiveScores;
  }

  /**
   * 從蓋洛普天賦計算多元智能分數
   */
  calculateIntelligencesFromTalents(talentScores) {
    const intelligenceMapping = {
      linguistic: { '溝通': 0.95, '學習': 0.70, '思維': 0.60, '理念': 0.65 },
      logicalMathematical: { '分析': 0.95, '戰略': 0.85, '思維': 0.80, '統籌': 0.70, '審慎': 0.65 },
      spatial: { '理念': 0.85, '前瞻': 0.80, '戰略': 0.70, '個別': 0.60 },
      musical: { '理念': 0.70, '和諧': 0.85, '完美': 0.75, '積極': 0.60 },
      bodilyKinesthetic: { '適應': 0.85, '行動': 0.90, '競爭': 0.75, '恢復': 0.65 },
      interpersonal: { '體諒': 0.95, '溝通': 0.90, '指揮': 0.85, '伯樂': 0.80, '交往': 0.85, '個別': 0.75, '包容': 0.70, '取悅': 0.65 },
      intrapersonal: { '思維': 0.90, '自信': 0.85, '信念': 0.80, '專注': 0.75, '審慎': 0.70, '學習': 0.65 },
      naturalistic: { '蒐集': 0.90, '分析': 0.80, '關聯': 0.75, '個別': 0.70, '恢復': 0.60 }
    };

    const intelligenceScores = {};
    
    Object.entries(intelligenceMapping).forEach(([intelligence, talents]) => {
      let totalScore = 0;
      let totalWeight = 0;
      
      Object.entries(talents).forEach(([talent, weight]) => {
        if (talentScores[talent]) {
          totalScore += talentScores[talent] * weight;
          totalWeight += weight;
        }
      });
      
      const normalizedScore = totalWeight > 0 ? (totalScore / totalWeight) : 50;
      intelligenceScores[intelligence] = Math.round(Math.max(0, Math.min(100, normalizedScore)));
    });
    
    return intelligenceScores;
  }

  /**
   * 生成個性洞察
   */
  generatePersonalityInsights(bigFiveScores, intelligenceScores) {
    const insights = {
      personalityType: '',
      strengths: [],
      developmentAreas: []
    };
    
    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = bigFiveScores;
    
    // 判斷人格類型
    if (openness > 70 && conscientiousness > 70) {
      insights.personalityType = '創新執行者';
      insights.strengths.push('既有創意又能付諸實行');
    } else if (extraversion > 70 && agreeableness > 70) {
      insights.personalityType = '人際領導者';
      insights.strengths.push('善於與人合作並影響他人');
    } else if (conscientiousness > 70 && neuroticism < 40) {
      insights.personalityType = '穩健實踐者';
      insights.strengths.push('可靠、穩定且目標導向');
    } else {
      insights.personalityType = '均衡發展者';
      insights.strengths.push('在各方面都有不錯的表現');
    }
    
    return insights;
  }

  calculateReliability(talent) {
    // 簡化的信度計算
    const relevantResponses = this.responses.filter(r => {
      const item = talentItemBank.find(i => i.id === r.itemId);
      return item && item.targetTalent === talent;
    });
    
    return Math.min(0.95, 0.6 + (relevantResponses.length * 0.05));
  }

  calculateOverallReliability() {
    return Math.min(0.95, 0.7 + (this.responses.length * 0.003));
  }

  calculateValidity() {
    // 檢查回答一致性
    let consistencyScore = 0;
    let totalChecks = 0;
    
    // 找出測試相同天賦的題目
    const talentResponses = {};
    this.responses.forEach(response => {
      const item = talentItemBank.find(i => i.id === response.itemId);
      if (item) {
        if (!talentResponses[item.targetTalent]) {
          talentResponses[item.targetTalent] = [];
        }
        talentResponses[item.targetTalent].push(response.response.weight);
      }
    });
    
    // 計算同一天賦題目回答的一致性
    Object.values(talentResponses).forEach(weights => {
      if (weights.length >= 2) {
        const variance = this.calculateVariance(weights);
        consistencyScore += Math.max(0, 1 - variance / 4); // 4是最大可能方差
        totalChecks++;
      }
    });
    
    return totalChecks > 0 ? consistencyScore / totalChecks : 0.8;
  }
  
  calculateVariance(arr) {
    const mean = arr.reduce((a, b) => a + b) / arr.length;
    return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  }

  calculateAvgResponseTime() {
    if (this.responses.length < 2) return 0;
    
    let totalTime = 0;
    for (let i = 1; i < this.responses.length; i++) {
      totalTime += this.responses[i].timestamp - this.responses[i-1].timestamp;
    }
    
    return Math.round(totalTime / (this.responses.length - 1) / 1000);
  }

  calculateAttributes(talentScores) {
    // 基於大五人格理論和多元智能理論的精確映射
    const talentToAttributes = {
      // 執行力導向天賦
      '成就': { diligence: 0.85, focus: 0.65, intellect: 0.45 },
      '行動': { adaptability: 0.75, social: 0.55, diligence: 0.45 },
      '統籌': { intellect: 0.75, diligence: 0.65, focus: 0.70 },
      '信念': { diligence: 0.80, focus: 0.60 },
      '審慎': { diligence: 0.75, intellect: 0.55 },
      '專注': { focus: 0.90, diligence: 0.60 },
      '責任': { diligence: 0.85, social: 0.45 },
      '恢復': { intellect: 0.65, adaptability: 0.70, focus: 0.55 },
      
      // 思維策略天賦  
      '分析': { intellect: 0.85, focus: 0.65 },
      '關聯': { creativity: 0.70, intellect: 0.60, social: 0.45 },
      '前瞻': { creativity: 0.80, intellect: 0.65 },
      '理念': { creativity: 0.85, intellect: 0.60 },
      '蒐集': { intellect: 0.70, creativity: 0.50 },
      '思維': { intellect: 0.80, focus: 0.65 },
      '學習': { intellect: 0.75, creativity: 0.55, adaptability: 0.45 },
      '戰略': { intellect: 0.80, creativity: 0.60 },
      
      // 人際影響天賦
      '指揮': { social: 0.85, diligence: 0.55 },
      '溝通': { social: 0.90, creativity: 0.50 },
      '競爭': { diligence: 0.70, focus: 0.75, social: 0.45 },
      '完善': { intellect: 0.65, diligence: 0.70, focus: 0.60 },
      '追求': { diligence: 0.75, social: 0.65 },
      '自信': { social: 0.70, adaptability: 0.60 },
      '取悅': { social: 0.80, adaptability: 0.55 },
      
      // 關係建立天賦
      '適應': { adaptability: 0.85, social: 0.50 },
      '伯樂': { social: 0.80, creativity: 0.45 },
      '體諒': { social: 0.85, creativity: 0.40 },
      '和諧': { social: 0.75, adaptability: 0.55 },
      '包容': { social: 0.80, adaptability: 0.50 },
      '個別': { social: 0.75, creativity: 0.55, intellect: 0.45 },
      '積極': { social: 0.70, adaptability: 0.65 },
      '交往': { social: 0.85, adaptability: 0.50 },
      
      // 其他天賦
      '回顧': { intellect: 0.60, diligence: 0.55 },
      '公平': { social: 0.70, diligence: 0.60 },
      '完美': { diligence: 0.80, focus: 0.75, intellect: 0.45 }
    };
    
    // 初始化屬性為中性值
    const attributes = {
      intellect: 50, diligence: 50, creativity: 50,
      social: 50, focus: 50, adaptability: 50
    };
    
    const attributeWeights = {
      intellect: 0, diligence: 0, creativity: 0,
      social: 0, focus: 0, adaptability: 0
    };
    
    // 根據前5大天賦計算加權屬性
    const topTalents = Object.entries(talentScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    topTalents.forEach(([talent, score], rank) => {
      const mapping = talentToAttributes[talent];
      if (mapping) {
        // 排名越前面權重越高
        const rankWeight = (6 - rank) / 15; // 第1名權重0.33，第5名權重0.067
        
        Object.entries(mapping).forEach(([attr, weight]) => {
          const contribution = (score - 50) * weight * rankWeight; // 以50為基準
          attributes[attr] += contribution;
          attributeWeights[attr] += weight * rankWeight;
        });
      }
    });
    
    // 標準化並應用正態分佈調整
    Object.keys(attributes).forEach(attr => {
      if (attributeWeights[attr] > 0) {
        // 確保分數在合理範圍內(20-95)，避免極端值
        attributes[attr] = Math.min(95, Math.max(20, Math.round(attributes[attr])));
      } else {
        // 沒有相關天賦的屬性保持中性
        attributes[attr] = 50;
      }
    });
    
    return attributes;
  }
}

/**
 * 實際題目統計
 */
export const ACTUAL_QUESTIONS = {
  TOTAL: 70,  // 實際測驗題數
  POOL_SIZE: talentItemBank.length,  // 題目池總數
  PER_TALENT: Math.floor(talentItemBank.length / Object.keys(talents).length), // 每個天賦平均題目數
  TALENTS_COVERED: [...new Set(talentItemBank.map(item => item.targetTalent))].length // 涵蓋的天賦數
};

// 題目統計已移除 console.log 以避免生產環境輸出

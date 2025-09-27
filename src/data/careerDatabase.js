/**
 * 職業資料庫 - 職業匹配與建議
 * 基於主專案 ResultsPage.tsx 的完整職業資料庫 (134 種職業)
 * 從主專案同步過來
 */

// 超大型職業資料庫 - 134種職業
export const CAREER_DATABASE = {
  // ===========================================
  // 科技創新類 (Technology & Innovation)
  // ===========================================
  'product_designer': {
    name: '產品設計師',
    description: '設計用戶體驗優秀的數位產品',
    matchValues: ['creativity', 'achievement', 'growth'],
    matchInterests: ['technology', 'art_design'],
    matchTalents: ['理念', '戰略', '個別'],
    matchWorkStyles: ['視覺型學習', '創意思維', '小團隊協作', '定期回饋', '彈性節奏'],
    requirements: '需要創意思維、用戶同理心和技術理解',
    nextSteps: ['學習UI/UX設計工具', '建立作品集', '關注用戶體驗趨勢']
  },
  'ui_ux_designer': {
    name: 'UI/UX設計師',
    description: '專精於用戶介面與體驗設計',
    matchValues: ['creativity', 'helping', 'achievement'],
    matchInterests: ['art_design', 'technology'],
    matchTalents: ['理念', '個別', '體諒'],
    matchWorkStyles: ['視覺型學習', '創意思維', '小團隊協作', '定期回饋', '用戶導向'],
    requirements: '需要設計美感、用戶研究能力和工具熟練度',
    nextSteps: ['學習設計工具', '研究用戶行為', '建立設計作品集']
  },
  'software_engineer': {
    name: '軟體工程師',
    description: '開發和維護軟體系統',
    matchValues: ['achievement', 'knowledge', 'growth'],
    matchInterests: ['technology', 'science'],
    matchTalents: ['分析', '學習', '專注'],
    matchWorkStyles: ['邏輯分析', '獨立工作', '專注執行', '階段回饋', '低結構化'],
    requirements: '需要邏輯思維、持續學習能力和問題解決技能',
    nextSteps: ['精進程式語言技能', '參與開源專案', '建立技術作品集']
  },
  'frontend_developer': {
    name: '前端開發工程師',
    description: '專責網頁前端開發與優化',
    matchValues: ['creativity', 'achievement', 'growth'],
    matchInterests: ['technology', 'art_design'],
    matchTalents: ['理念', '完美', '學習'],
    matchWorkStyles: ['視覺型學習', '創意思維', '獨立工作', '定期回饋', '快節奏'],
    requirements: '需要HTML/CSS/JS技能、設計美感和用戶體驗思維',
    nextSteps: ['學習前端框架', '練習響應式設計', '關注前端趨勢']
  },
  'backend_developer': {
    name: '後端開發工程師',
    description: '負責伺服器端邏輯與資料庫設計',
    matchValues: ['knowledge', 'security', 'achievement'],
    matchInterests: ['technology', 'engineering'],
    matchTalents: ['分析', '戰略', '審慎'],
    matchWorkStyles: ['邏輯分析', '獨立工作', '系統思維', '階段回饋', '穩定節奏'],
    requirements: '需要系統架構思維、資料庫設計和API開發技能',
    nextSteps: ['學習後端框架', '研究系統架構', '練習資料庫設計']
  },
  'fullstack_developer': {
    name: '全端開發工程師',
    description: '同時負責前端與後端開發',
    matchValues: ['growth', 'adventure', 'achievement'],
    matchInterests: ['technology', 'engineering'],
    matchTalents: ['學習', '適應', '統籌'],
    matchWorkStyles: ['整合思維', '彈性適應', '快速學習', '多任務處理', '彈性節奏'],
    requirements: '需要全棧技術能力、快速學習和問題解決技能',
    nextSteps: ['掌握前後端技術', '練習全棧專案', '學習DevOps']
  },
  'mobile_developer': {
    name: '行動應用開發師',
    description: '開發手機與平板應用程式',
    matchValues: ['creativity', 'helping', 'growth'],
    matchInterests: ['technology', 'art_design'],
    matchTalents: ['理念', '個別', '學習'],
    matchWorkStyles: ['動覺型學習', '用戶導向', '小團隊協作', '即時回饋', '快節奏'],
    requirements: '需要行動平台技術、使用者介面設計和效能優化',
    nextSteps: ['學習iOS/Android開發', '研究行動UX', '發布應用程式']
  },
  'devops_engineer': {
    name: 'DevOps工程師',
    description: '負責開發與營運流程整合自動化',
    matchValues: ['achievement', 'growth', 'responsibility'],
    matchInterests: ['technology', 'engineering'],
    matchTalents: ['統籌', '戰略', '完善'],
    matchWorkStyles: ['系統思維', '流程導向', '跨團隊協作', '監控反饋', '自動化偏好'],
    requirements: '需要雲端技術、自動化工具和系統管理經驗',
    nextSteps: ['學習雲端平台', '掌握容器技術', '練習CI/CD流程']
  },
  'cybersecurity_specialist': {
    name: '資訊安全專家',
    description: '保護組織的資訊系統與數據安全',
    matchValues: ['security', 'responsibility', 'honesty'],
    matchInterests: ['technology', 'science'],
    matchTalents: ['審慎', '分析', '責任'],
    matchWorkStyles: ['分析型決策', '高結構化', '獨立工作', '監控導向', '警覺性高'],
    requirements: '需要安全技術知識、風險評估和事件應對能力',
    nextSteps: ['考取資安證照', '學習滲透測試', '關注資安威脅']
  },
  'blockchain_developer': {
    name: '區塊鏈開發師',
    description: '開發基於區塊鏈技術的應用',
    matchValues: ['creativity', 'independence', 'growth'],
    matchInterests: ['technology', 'finance'],
    matchTalents: ['學習', '前瞻', '理念'],
    matchWorkStyles: ['前瞻思維', '創新導向', '獨立研究', '社群協作', '去中心化'],
    requirements: '需要區塊鏈技術、智能合約和分散式系統知識',
    nextSteps: ['學習區塊鏈平台', '練習智能合約', '參與DeFi專案']
  },
  'cloud_architect': {
    name: '雲端架構師',
    description: '設計和實施雲端基礎架構',
    matchValues: ['achievement', 'knowledge', 'creativity'],
    matchInterests: ['technology', 'engineering'],
    matchTalents: ['戰略', '前瞻', '統籌'],
    matchWorkStyles: ['系統思維', '戰略規劃', '跨團隊領導', '長期規劃', '技術前瞻'],
    requirements: '需要雲端平台專精、架構設計和成本優化能力',
    nextSteps: ['取得雲端認證', '設計架構方案', '學習多雲策略']
  },
  'game_developer': {
    name: '遊戲開發師',
    description: '設計和開發電子遊戲',
    matchValues: ['creativity', 'fun', 'adventure'],
    matchInterests: ['technology', 'art_design', 'gaming'],
    matchTalents: ['理念', '專注', '學習'],
    matchWorkStyles: ['創意思維', '整合思維', '小團隊協作', '快速迭代', '玩家導向'],
    requirements: '需要程式設計、遊戲引擎和創意思維',
    nextSteps: ['學習遊戲引擎', '練習遊戲設計', '參加Game Jam']
  },
  'robotics_engineer': {
    name: '機器人工程師',
    description: '設計和開發機器人系統',
    matchValues: ['creativity', 'achievement', 'growth'],
    matchInterests: ['engineering', 'technology'],
    matchTalents: ['理念', '戰略', '完美'],
    matchWorkStyles: ['動覺型學習', '精密型思維', '跨領域整合', '實驗導向', '機器交互'],
    requirements: '需要機械工程、電子技術和程式設計能力',
    nextSteps: ['學習機器人學', '練習硬體整合', '研究AI演算法']
  },
  'iot_developer': {
    name: '物聯網開發師',
    description: '開發連接實體世界的智慧裝置',
    matchValues: ['helping', 'creativity', 'growth'],
    matchInterests: ['technology', 'engineering'],
    matchTalents: ['關聯', '理念', '統籌'],
    matchWorkStyles: ['關聯思維', '跨平台整合', '系統交互', '實作導向', '物理世界'],
    requirements: '需要嵌入式系統、無線通訊和雲端整合技術',
    nextSteps: ['學習嵌入式開發', '研究感測器技術', '練習IoT平台']
  },
  'data_scientist': {
    name: '數據科學家',
    description: '分析大數據並提供商業洞察',
    matchValues: ['knowledge', 'achievement', 'adventure'],
    matchInterests: ['technology', 'science'],
    matchTalents: ['分析', '思維', '蒐集'],
    matchWorkStyles: ['分析型決策', '邏輯分析', '獨立工作', '數據導向', '深度思考'],
    requirements: '需要統計學知識、程式能力和商業思維',
    nextSteps: ['學習機器學習', '累積數據分析經驗', '考取相關證照']
  },
  'data_analyst': {
    name: '數據分析師',
    description: '收集和分析數據以支持決策',
    matchValues: ['achievement', 'insight', 'helping'],
    matchInterests: ['science', 'business'],
    matchTalents: ['分析', '蒐集', '思維'],
    matchWorkStyles: ['細節思維', '邏輯分析', '數據可視化', '定期回饋', '商業導向'],
    requirements: '需要統計知識、分析工具熟練度和報告能力',
    nextSteps: ['學習分析工具', '練習數據視覺化', '累積業界經驗']
  },
  'machine_learning_engineer': {
    name: '機器學習工程師',
    description: '開發和部署AI機器學習模型',
    matchValues: ['creativity', 'growth', 'achievement'],
    matchInterests: ['technology', 'science'],
    matchTalents: ['學習', '分析', '戰略'],
    matchWorkStyles: ['抽象思維', '算法設計', '實驗導向', '快速學習', '技術前瞻'],
    requirements: '需要ML演算法、程式設計和數學統計基礎',
    nextSteps: ['深入學習ML框架', '練習模型部署', '參與AI競賽']
  },
  'database_administrator': {
    name: '資料庫管理員',
    description: '管理和維護組織的資料庫系統',
    matchValues: ['responsibility', 'security', 'achievement'],
    matchInterests: ['technology', 'science'],
    matchTalents: ['審慎', '責任', '統籌'],
    matchWorkStyles: ['高結構化', '謹慎決策', '獨立工作', '監控導向', '穩定環境'],
    requirements: '需要資料庫技術、效能調校和備份恢復技能',
    nextSteps: ['考取資料庫證照', '學習資料庫調校', '練習災難恢復']
  },
  
  // ===========================================
  // 設計創意類 (Design & Creative)
  // ===========================================
  'ai_engineer': {
    name: 'AI工程師',
    description: '開發人工智慧解決方案',
    matchValues: ['creativity', 'knowledge', 'growth'],
    matchInterests: ['technology', 'science'],
    matchTalents: ['學習', '前瞻', '理念'],
    matchWorkStyles: ['前瞻思維', '創新導向', '抽象思維', '實驗導向', '未來導向'],
    requirements: '需要深度學習知識、數學能力和創新思維',
    nextSteps: ['學習深度學習框架', '參與AI專案', '關注AI發展趨勢']
  },
  'startup_founder': {
    name: '創業家',
    description: '創立和經營自己的事業',
    matchValues: ['freedom', 'achievement', 'independence'],
    matchInterests: ['business', 'marketing'],
    matchTalents: ['指揮', '戰略', '行動'],
    matchWorkStyles: ['領導角色', '變化擁抱型', '直覺型決策', '快節奏', '風險承擔'],
    requirements: '需要領導力、風險承擔精神和商業洞察',
    nextSteps: ['累積行業經驗', '建立人脈網絡', '學習商業管理知識']
  },
  'product_manager': {
    name: '產品經理',
    description: '規劃和管理產品開發流程',
    matchValues: ['achievement', 'leadership', 'strategy'],
    matchInterests: ['technology', 'business'],
    matchTalents: ['戰略', '統籌', '溝通'],
    matchWorkStyles: ['統籌規劃', '跨團隊協作', '用戶導向', '數據驅動', '敏捷思維'],
    requirements: '需要產品思維、溝通協調和數據分析能力',
    nextSteps: ['學習產品管理方法', '累積跨部門協作經驗', '關注用戶需求']
  },
  
  // ===========================================
  // 教育培訓類 (Education & Training)
  // ===========================================
  'teacher': {
    name: '教師/講師',
    description: '教育和啟發學生成長',
    matchValues: ['helping', 'growth', 'knowledge'],
    matchInterests: ['education', 'psychology'],
    matchTalents: ['伯樂', '溝通', '體諒'],
    matchWorkStyles: ['個別化教學', '主動溝通', '耐心引導', '即時回饋', '學習型成長'],
    requirements: '需要溝通能力、耐心和專業知識',
    nextSteps: ['取得教學資格', '專精特定學科', '學習教學方法']
  },
  'counselor': {
    name: '心理諮商師',
    description: '協助他人解決心理和情感問題',
    matchValues: ['helping', 'growth', 'balance'],
    matchInterests: ['psychology', 'healthcare'],
    matchTalents: ['體諒', '包容', '伯樂'],
    matchWorkStyles: ['聆聽導向', '深度同理', '一對一諮詢', '情感支持', '安全環境'],
    requirements: '需要同理心、傾聽技巧和專業訓練',
    nextSteps: ['取得心理學學位', '完成實習訓練', '考取專業證照']
  },
  'trainer': {
    name: '企業培訓師',
    description: '為企業員工提供專業培訓',
    matchValues: ['helping', 'knowledge', 'achievement'],
    matchInterests: ['education', 'business'],
    matchTalents: ['溝通', '伯樂', '積極'],
    matchWorkStyles: ['主動表達', '互動教學', '成果導向', '即時回饋', '商業應用'],
    requirements: '需要專業知識、表達能力和課程設計技巧',
    nextSteps: ['累積特定領域專業', '學習培訓技巧', '取得培訓師證照']
  },
  'social_worker': {
    name: '社會工作師',
    description: '協助弱勢群體解決社會問題',
    matchValues: ['helping', 'justice', 'compassion'],
    matchInterests: ['social_work', 'psychology'],
    matchTalents: ['體諒', '包容', '恢復'],
    matchWorkStyles: ['社區導向', '資源整合', '倡議行動', '危機處理', '多元包容'],
    requirements: '需要同理心、溝通技巧和社會工作專業知識',
    nextSteps: ['取得社工學位', '累積實務經驗', '考取社工師證照']
  },
  'university_professor': {
    name: '大學教授',
    description: '進行高等教育教學與學術研究',
    matchValues: ['knowledge', 'research', 'mentoring'],
    matchInterests: ['education', 'science'],
    matchTalents: ['學習', '伯樂', '思維'],
    matchWorkStyles: ['研究導向', '深度學習', '獨立工作', '學術交流', '知識經濟'],
    requirements: '需要博士學位、研究能力和學術發表經驗',
    nextSteps: ['完成博士學位', '發表學術論文', '累積教學經驗']
  },
  'kindergarten_teacher': {
    name: '幼兒園教師',
    description: '教育和照顧學齡前兒童',
    matchValues: ['helping', 'growth', 'family'],
    matchInterests: ['education', 'social_work'],
    matchTalents: ['體諒', '包容', '積極'],
    matchWorkStyles: ['遊戲式學習', '耐心引導', '愛心照顧', '創意教學', '多元活動'],
    requirements: '需要幼教專業、耐心愛心和創意教學技巧',
    nextSteps: ['取得幼教學位', '考取教師證', '累積實習經驗']
  },
  'special_education_teacher': {
    name: '特殊教育教師',
    description: '為身心障礙學生提供專業教育',
    matchValues: ['helping', 'justice', 'growth'],
    matchInterests: ['education', 'healthcare'],
    matchTalents: ['體諒', '個別', '恢復'],
    matchWorkStyles: ['個別化教學', '耐心引導', '無障礙環境', '專業支持', '行為管理'],
    requirements: '需要特教專業、個別化教學和行為管理技能',
    nextSteps: ['取得特教資格', '學習輔助技術', '累積特教經驗']
  },
  'language_teacher': {
    name: '語言教師',
    description: '教授外語或母語課程',
    matchValues: ['helping', 'knowledge', 'growth'],
    matchInterests: ['education', 'language'],
    matchTalents: ['溝通', '包容', '個別'],
    matchWorkStyles: ['語言浸潤', '文化交流', '互動學習', '溝通導向', '多元表達'],
    requirements: '需要語言能力、文化知識和教學方法',
    nextSteps: ['考取語言證照', '學習教學法', '累積教學經驗']
  },
  'vocational_trainer': {
    name: '職業訓練師',
    description: '提供職業技能培訓和就業輔導',
    matchValues: ['helping', 'growth', 'achievement'],
    matchInterests: ['education', 'consulting'],
    matchTalents: ['伯樂', '溝通', '責任'],
    matchWorkStyles: ['實作導向', '技能培養', '就業導向', '動手學習', '就業市場'],
    requirements: '需要專業技能、教學能力和就業市場了解',
    nextSteps: ['累積專業經驗', '學習培訓技巧', '考取訓練師證照']
  },
  'educational_consultant': {
    name: '教育顧問',
    description: '為學生和家長提供教育規劃建議',
    matchValues: ['guidance', 'growth', 'personalized'],
    matchInterests: ['education', 'consulting'],
    matchTalents: ['個別', '前瞻', '戰略'],
    matchWorkStyles: ['個別化諮詢', '教育規劃', '未來導向', '資訊整合', '家庭服務'],
    requirements: '需要教育專業、諮詢技巧和升學資訊',
    nextSteps: ['累積教育經驗', '學習諮詢技巧', '建立專業網絡']
  },
  'librarian': {
    name: '圖書館員',
    description: '管理圖書資源並提供資訊服務',
    matchValues: ['knowledge', 'organization', 'service'],
    matchInterests: ['education', 'writing'],
    matchTalents: ['蒐集', '統籌', '幫助'],
    matchWorkStyles: ['資訊管理', '組織保存', '安靜環境', '服務導向', '數位化'],
    requirements: '需要資訊管理、分類整理和讀者服務技能',
    nextSteps: ['取得圖書資訊學位', '學習數位資源管理', '累積服務經驗']
  },
  'curriculum_designer': {
    name: '課程設計師',
    description: '設計和開發教育課程內容',
    matchValues: ['knowledge', 'achievement', 'helping'],
    matchInterests: ['education', 'writing'],
    matchTalents: ['戰略', '統籌', '理念'],
    matchWorkStyles: ['系統思維', '結構化設計', '學習理論', '需求分析', '教育導向'],
    requirements: '需要教育理論、課程設計和教材開發能力',
    nextSteps: ['學習課程理論', '分析教學需求', '累積設計經驗']
  },
  'educational_technology_specialist': {
    name: '教育科技專家',
    description: '將科技應用於教育環境中',
    matchValues: ['creativity', 'education', 'achievement'],
    matchInterests: ['education', 'technology'],
    matchTalents: ['理念', '學習', '統籌'],
    matchWorkStyles: ['教育技術', '數位化學習', '创新應用', '跨領域整合', '效率提升'],
    requirements: '需要教育背景、科技應用和數位教學設計能力',
    nextSteps: ['學習教育科技', '練習數位教學', '累積整合經驗']
  },
  
  // ===========================================
  // 醫療健康類 (Healthcare & Medical)
  // ===========================================
  
  // 藝術創作類
  'graphic_designer': {
    name: '平面設計師',
    description: '創作視覺傳達設計作品',
    matchValues: ['creativity', 'creativity', 'achievement'],
    matchInterests: ['art_design', 'media'],
    matchTalents: ['理念', '個別', '完美'],
    matchWorkStyles: ['視覺型學習', '美學思維', '創意表達', '獨立創作', '設計精密'],
    requirements: '需要美感、創意思維和設計技能',
    nextSteps: ['學習設計軟體', '建立設計作品集', '關注設計趨勢']
  },
  'brand_designer': {
    name: '品牌設計師',
    description: '創建和發展品牌視覺識別系統',
    matchValues: ['creativity', 'identity', 'influence'],
    matchInterests: ['art_design', 'marketing'],
    matchTalents: ['理念', '戰略', '溝通'],
    matchWorkStyles: ['品牌思維', '戰略設計', '市場敏感', '視覺傳達', '商業創意'],
    requirements: '需要品牌思維、設計能力和市場敏感度',
    nextSteps: ['研究品牌案例', '學習品牌策略', '建立品牌作品集']
  },
  'web_designer': {
    name: '網頁設計師',
    description: '設計網站的視覺介面和使用體驗',
    matchValues: ['creativity', 'functionality', 'user_focus'],
    matchInterests: ['art_design', 'technology'],
    matchTalents: ['理念', '個別', '適應'],
    matchWorkStyles: ['用戶導向', '視覺設計', '技術理解', '響應式思維', '數位化設計'],
    requirements: '需要網頁設計技能、用戶體驗思維和技術理解',
    nextSteps: ['學習網頁設計工具', '研究網頁趨勢', '練習響應式設計']
  },
  'motion_designer': {
    name: '動態設計師',
    description: '創作動畫和動態視覺效果',
    matchValues: ['creativity', 'movement', 'storytelling'],
    matchInterests: ['art_design', 'media'],
    matchTalents: ['理念', '專注', '完美'],
    matchWorkStyles: ['動態視覺', '時間設計', '故事表達', '技術精練', '創意動畫'],
    requirements: '需要動畫技能、創意思維和軟體熟練度',
    nextSteps: ['學習動畫軟體', '練習動態設計', '研究動畫趨勢']
  },
  'packaging_designer': {
    name: '包裝設計師',
    description: '設計產品包裝的外觀和結構',
    matchValues: ['creativity', 'practicality', 'sustainability'],
    matchInterests: ['art_design', 'engineering'],
    matchTalents: ['理念', '戰略', '完美'],
    matchWorkStyles: ['實用設計', '材料研究', '結構思維', '環保意識', '生產導向'],
    requirements: '需要設計美感、材料知識和生產工藝理解',
    nextSteps: ['學習包裝設計', '研究材料特性', '關注永續包裝']
  },
  'industrial_designer': {
    name: '工業設計師',
    description: '設計產品的外觀、功能和使用體驗',
    matchValues: ['creativity', 'functionality', 'creativity'],
    matchInterests: ['art_design', 'engineering'],
    matchTalents: ['理念', '戰略', '個別'],
    matchWorkStyles: ['產品思維', '功能設計', '人因工程', '工程理解', '用戶中心'],
    requirements: '需要設計思維、工程知識和使用者研究能力',
    nextSteps: ['學習3D建模', '研究人因工程', '累積設計專案']
  },
  'fashion_designer': {
    name: '服裝設計師',
    description: '創作服裝和時尚配件',
    matchValues: ['creativity', 'style', 'expression'],
    matchInterests: ['fashion', 'art_design'],
    matchTalents: ['理念', '個別', '前瞻'],
    matchWorkStyles: ['時尚敏感', '風格表達', '潮流預測', '手工製作', '美學獨特'],
    requirements: '需要時尚敏感度、製衣技術和市場觀察力',
    nextSteps: ['學習服裝設計', '研究時尚趨勢', '建立作品集']
  },
  'jewelry_designer': {
    name: '珠寶設計師',
    description: '設計和製作珠寶首飾',
    matchValues: ['creativity', 'craftsmanship', 'luxury'],
    matchInterests: ['art_design', 'crafts'],
    matchTalents: ['理念', '完美', '個別'],
    matchWorkStyles: ['精工細作', '貴重材料', '手工藝術', '美學追求', '個人化定製'],
    requirements: '需要設計美感、工藝技術和材料知識',
    nextSteps: ['學習珠寶工藝', '研究寶石知識', '練習金工技術']
  },
  'tattoo_artist': {
    name: '刺青藝術師',
    description: '在人體上創作永久性藝術作品',
    matchValues: ['creativity', 'artistry', 'expression'],
    matchInterests: ['art_design', 'crafts'],
    matchTalents: ['理念', '專注', '個別'],
    matchWorkStyles: ['藝術創作', '精細手工', '個人化表達', '衛生謹慎', '一對一服務'],
    requirements: '需要繪畫技能、藝術美感和衛生安全知識',
    nextSteps: ['學習繪畫技巧', '練習刺青技術', '建立藝術作品集']
  },
  'writer': {
    name: '作家/內容創作者',
    description: '創作文字內容和故事',
    matchValues: ['creativity', 'freedom', 'expression'],
    matchInterests: ['writing', 'media'],
    matchTalents: ['理念', '溝通', '蒐集'],
    matchWorkStyles: ['文字創作', '獨立工作', '靈感捕捉', '故事表達', '自由创作'],
    requirements: '需要文字能力、創意思維和持續創作',
    nextSteps: ['持續寫作練習', '建立個人品牌', '投稿或自媒體']
  },
  'copywriter': {
    name: '文案寫手',
    description: '為廣告和行銷創作吸引人的文案',
    matchValues: ['creativity', 'persuasion', 'impact'],
    matchInterests: ['writing', 'marketing'],
    matchTalents: ['溝通', '理念', '個別'],
    matchWorkStyles: ['說服寫作', '市場敏感', '創意表達', '目標導向', '消費心理'],
    requirements: '需要創意寫作、市場洞察和說服技巧',
    nextSteps: ['練習廣告文案', '研究消費心理', '建立文案作品集']
  },
  'technical_writer': {
    name: '技術文件撰寫師',
    description: '撰寫技術說明和操作手冊',
    matchValues: ['clarity', 'helping', 'achievement'],
    matchInterests: ['writing', 'technology'],
    matchTalents: ['溝通', '統籌', '個別'],
    matchWorkStyles: ['技術文案', '結構化寫作', '清晰表達', '用戶導向', '文件組織'],
    requirements: '需要技術理解、清晰表達和文件組織能力',
    nextSteps: ['學習技術寫作', '熟悉技術工具', '練習文件設計']
  },
  'screenwriter': {
    name: '劇本作家',
    description: '為電影、電視劇創作劇本',
    matchValues: ['storytelling', 'creativity', 'emotion'],
    matchInterests: ['writing', 'media'],
    matchTalents: ['理念', '溝通', '體諒'],
    matchWorkStyles: ['故事結構', '角色塑造', '情感表達', '劇情設計', '影視語言'],
    requirements: '需要故事創作、角色塑造和劇本格式技能',
    nextSteps: ['學習劇本寫作', '研究敘事結構', '參加編劇課程']
  },
  'content_strategist': {
    name: '內容策略師',
    description: '規劃和管理品牌內容策略',
    matchValues: ['achievement', 'creativity', 'helping'],
    matchInterests: ['writing', 'marketing'],
    matchTalents: ['戰略', '溝通', '前瞻'],
    matchWorkStyles: ['內容策略', '品牌思維', '數據分析', '跨媒體', '目標受眾'],
    requirements: '需要內容企劃、數據分析和品牌思維',
    nextSteps: ['學習內容策略', '分析成功案例', '累積企劃經驗']
  },
  'photographer': {
    name: '攝影師',
    description: '透過影像記錄和創作藝術',
    matchValues: ['creativity', 'adventure', 'achievement'],
    matchInterests: ['art_design', 'media'],
    matchTalents: ['理念', '個別', '專注'],
    matchWorkStyles: ['視覺藝術', '光影捕捉', '美學感官', '瞬間捕捉', '創意角度'],
    requirements: '需要美感、技術能力和商業頭腦',
    nextSteps: ['精進攝影技術', '建立作品集', '發展專精領域']
  },
  'wedding_photographer': {
    name: '婚禮攝影師',
    description: '專門拍攝婚禮和重要慶典',
    matchValues: ['fun', 'helping', 'creativity'],
    matchInterests: ['art_design', 'hospitality'],
    matchTalents: ['個別', '體諒', '積極'],
    matchWorkStyles: ['情感捕捉', '人際互動', '壓力應對', '服務導向', '記錄珍貴'],
    requirements: '需要人際技巧、壓力管理和攝影技術',
    nextSteps: ['練習人像攝影', '學習婚禮流程', '建立客戶網絡']
  },
  'food_photographer': {
    name: '美食攝影師',
    description: '專精於食物和餐廳攝影',
    matchValues: ['creativity', 'achievement', 'growth'],
    matchInterests: ['art_design', 'food'],
    matchTalents: ['完美', '個別', '專注'],
    matchWorkStyles: ['美食造型', '細節完美', '色彩配置', '光影技巧', '食欲誘發'],
    requirements: '需要食物造型、燈光技術和後製能力',
    nextSteps: ['學習食物造型', '練習光線控制', '與餐廳合作']
  },
  'commercial_photographer': {
    name: '商業攝影師',
    description: '為企業和品牌提供攝影服務',
    matchValues: ['responsibility', 'achievement', 'helping'],
    matchInterests: ['art_design', 'business'],
    matchTalents: ['責任', '個別', '溝通'],
    matchWorkStyles: ['商業思維', '品牌導向', '客戶服務', '品質保證', '多元風格'],
    requirements: '需要商業思維、客戶溝通和多元攝影技能',
    nextSteps: ['建立商業作品集', '學習商業攝影', '發展客戶關係']
  },
  'video_editor': {
    name: '影片剪輯師',
    description: '製作和編輯影音內容',
    matchValues: ['creativity', 'achievement', 'growth'],
    matchInterests: ['media', 'art_design'],
    matchTalents: ['專注', '完美', '理念'],
    matchWorkStyles: ['時間線編輯', '故事節奏', '視覺特效', '細節打磨', '影視語言'],
    requirements: '需要剪輯技術、故事敘述能力和耐心',
    nextSteps: ['學習剪輯軟體', '累積作品經驗', '關注影視趨勢']
  },
  'musician': {
    name: '音樂家/作曲家',
    description: '創作和演奏音樂作品',
    matchValues: ['creativity', 'passion', 'expression'],
    matchInterests: ['music', 'art_design'],
    matchTalents: ['理念', '專注', '個別'],
    matchWorkStyles: ['音樂創作', '情感表達', '聽覺感官', '節奏掌握', '藝術獨特'],
    requirements: '需要音樂天賦、技術能力和持續練習',
    nextSteps: ['精進演奏技巧', '創作原創作品', '參與音樂活動']
  },
  'interior_designer': {
    name: '室內設計師',
    description: '設計室內空間和環境',
    matchValues: ['creativity', 'creativity', 'practicality'],
    matchInterests: ['art_design', 'architecture'],
    matchTalents: ['理念', '個別', '戰略'],
    matchWorkStyles: ['空間設計', '美學配置', '客戶需求', '實用性考量', '空間規劃'],
    requirements: '需要空間感、美感和客戶溝通能力',
    nextSteps: ['學習設計軟體', '累積設計案例', '考取相關證照']
  },
  
  // 商業管理類
  'marketing_manager': {
    name: '行銷企劃',
    description: '規劃和執行品牌行銷策略',
    matchValues: ['achievement', 'recognition', 'creativity'],
    matchInterests: ['marketing', 'business'],
    matchTalents: ['戰略', '溝通', '行動'],
    matchWorkStyles: ['市場策略', '創意企劃', '品牌思維', '數據分析', '跨媒體整合'],
    requirements: '需要策略思維、溝通技巧和市場敏感度',
    nextSteps: ['學習數位行銷', '累積案例經驗', '考取相關證照']
  },
  'consultant': {
    name: '管理顧問',
    description: '為企業提供專業建議和解決方案',
    matchValues: ['knowledge', 'achievement', 'helping'],
    matchInterests: ['consulting', 'business'],
    matchTalents: ['分析', '戰略', '指揮'],
    matchWorkStyles: ['策略思維', '問題解決', '分析導向', '客戶服務', '跨產業專業'],
    requirements: '需要分析能力、商業知識和溝通技巧',
    nextSteps: ['累積特定領域專業', '發展簡報技能', '建立專業網絡']
  },
  'sales_manager': {
    name: '業務經理',
    description: '管理銷售團隊和客戶關係',
    matchValues: ['achievement', 'relationship', 'leadership'],
    matchInterests: ['business', 'marketing'],
    matchTalents: ['交往', '競爭', '指揮'],
    matchWorkStyles: ['關係建立', '談判技巧', '目標導向', '團隊領導', '客戶服務'],
    requirements: '需要溝通技巧、談判能力和團隊管理經驗',
    nextSteps: ['累積銷售經驗', '學習談判技巧', '發展客戶關係']
  },
  'hr_manager': {
    name: '人資經理',
    description: '管理企業人力資源和組織發展',
    matchValues: ['helping', 'fairness', 'development'],
    matchInterests: ['business', 'psychology'],
    matchTalents: ['伯樂', '和諧', '個別'],
    matchWorkStyles: ['人才管理', '組織發展', '沟通協調', '法規遵循', '績效管理'],
    requirements: '需要人際技巧、法規知識和組織能力',
    nextSteps: ['學習人資管理', '累積招募經驗', '考取人資證照']
  },
  'financial_analyst': {
    name: '財務分析師',
    description: '分析財務數據並提供投資建議',
    matchValues: ['achievement', 'achievement', 'knowledge'],
    matchInterests: ['finance', 'business'],
    matchTalents: ['分析', '審慎', '蒐集'],
    matchWorkStyles: ['數據分析', '財務模型', '風險評估', '市場研究', '投資策略'],
    requirements: '需要數學能力、分析技能和市場知識',
    nextSteps: ['學習財務分析', '考取金融證照', '關注市場趨勢']
  },
  'project_manager': {
    name: '專案經理',
    description: '規劃和執行各種專案',
    matchValues: ['achievement', 'organization', 'leadership'],
    matchInterests: ['business', 'consulting'],
    matchTalents: ['統籌', '責任', '戰略'],
    matchWorkStyles: ['專案管理', '跨部門協作', '時程控制', '風險管理', '成果導向'],
    requirements: '需要組織能力、溝通技巧和時間管理',
    nextSteps: ['學習專案管理方法', '考取PMP證照', '累積跨部門協作經驗']
  },
  'business_analyst': {
    name: '商業分析師',
    description: '分析業務流程並提出改善建議',
    matchValues: ['achievement', 'analysis', 'improvement'],
    matchInterests: ['business', 'consulting'],
    matchTalents: ['分析', '戰略', '完善'],
    matchWorkStyles: ['流程分析', '效率優化', '數據驅動', '溝通協調', '問題解決'],
    requirements: '需要分析思維、商業知識和流程優化技能',
    nextSteps: ['學習商業分析方法', '累積案例經驗', '考取BA證照']
  },
  'investment_banker': {
    name: '投資銀行家',
    description: '提供企業融資和併購服務',
    matchValues: ['wealth', 'achievement', 'growth'],
    matchInterests: ['finance', 'business'],
    matchTalents: ['分析', '競爭', '溝通'],
    matchWorkStyles: ['金融分析', '交易導向', '高壓適應', '客戶服務', '競爭環境'],
    requirements: '需要金融知識、分析能力和高壓工作適應力',
    nextSteps: ['取得金融學位', '考取金融證照', '累積投行經驗']
  },
  'venture_capitalist': {
    name: '創業投資人',
    description: '投資有潛力的新創公司',
    matchValues: ['creativity', 'adventure', 'growth'],
    matchInterests: ['business', 'technology'],
    matchTalents: ['前瞻', '戰略', '自信'],
    matchWorkStyles: ['投資眼光', '風險評估', '編性互動', '未來導向', '創新識別'],
    requirements: '需要投資眼光、市場分析和風險評估能力',
    nextSteps: ['累積投資經驗', '建立業界網絡', '學習估值方法']
  },
  'real_estate_agent': {
    name: '房地產經紀人',
    description: '協助買賣和租賃房地產',
    matchValues: ['helping', 'wealth', 'achievement'],
    matchInterests: ['real_estate', 'business'],
    matchTalents: ['交往', '溝通', '競爭'],
    matchWorkStyles: ['客戶服務', '談判技巧', '市場敏感', '關係建立', '物業管理'],
    requirements: '需要市場知識、談判技巧和客戶服務能力',
    nextSteps: ['考取不動產執照', '學習市場分析', '建立客戶網絡']
  },
  'insurance_agent': {
    name: '保險業務員',
    description: '銷售保險產品並提供保障規劃',
    matchValues: ['helping', 'security', 'responsibility'],
    matchInterests: ['finance', 'business'],
    matchTalents: ['溝通', '交往', '責任'],
    matchWorkStyles: ['保障規劃', '信任建立', '風險評估', '關懷服務', '長期關係'],
    requirements: '需要保險知識、銷售技巧和風險評估能力',
    nextSteps: ['考取保險執照', '學習理財規劃', '建立客戶關係']
  },
  'bank_manager': {
    name: '銀行經理',
    description: '管理銀行分行營運和客戶服務',
    matchValues: ['responsibility', 'service', 'trust'],
    matchInterests: ['finance', 'business'],
    matchTalents: ['統籌', '責任', '公平'],
    matchWorkStyles: ['金融管理', '風險控制', '遵循法規', '客戶服務', '績效管理'],
    requirements: '需要金融專業、管理能力和法規遵循知識',
    nextSteps: ['累積銀行經驗', '學習風險管理', '考取金融證照']
  },
  'tax_consultant': {
    name: '稅務顧問',
    description: '提供稅務規劃和申報服務',
    matchValues: ['achievement', 'responsibility', 'helping'],
    matchInterests: ['finance', 'consulting'],
    matchTalents: ['審慎', '分析', '責任'],
    matchWorkStyles: ['稅法專業', '細節處理', '遵法遵規', '節稅規劃', '客戶咨詢'],
    requirements: '需要稅法知識、細心態度和客戶服務技能',
    nextSteps: ['學習稅務法規', '考取稅務證照', '累積申報經驗']
  },
  'supply_chain_manager': {
    name: '供應鏈經理',
    description: '管理產品從生產到配送的整個流程',
    matchValues: ['achievement', 'coordination', 'optimization'],
    matchInterests: ['business', 'engineering'],
    matchTalents: ['統籌', '戰略', '關聯'],
    matchWorkStyles: ['供應鏈管理', '物流協調', '成本控制', '風險管理', '效率優化'],
    requirements: '需要物流知識、協調能力和成本控制技能',
    nextSteps: ['學習供應鏈管理', '累積物流經驗', '考取相關證照']
  },
  'quality_assurance_manager': {
    name: '品質保證經理',
    description: '確保產品和服務符合品質標準',
    matchValues: ['achievement', 'responsibility', 'growth'],
    matchInterests: ['engineering', 'business'],
    matchTalents: ['完美', '審慎', '責任'],
    matchWorkStyles: ['品質管控', '標準制定', '流程優化', '檢驗驗證', '持續改善'],
    requirements: '需要品質管理知識、檢驗技能和流程優化能力',
    nextSteps: ['學習品質管理系統', '考取品質證照', '累積管理經驗']
  },
  
  // ===========================================
  // 工程技術類 (Engineering & Technical)
  // ===========================================
  
  // 健康醫療類
  'doctor': {
    name: '醫師',
    description: '診斷和治療疾病，維護人類健康',
    matchValues: ['helping', 'responsibility', 'knowledge'],
    matchInterests: ['healthcare', 'science'],
    matchTalents: ['學習', '責任', '體諒'],
    matchWorkStyles: ['醫學專業', '診斷思維', '患者照護', '證據醫學', '結晶感情'],
    requirements: '需要專業知識、責任感和人際技巧',
    nextSteps: ['完成醫學教育', '通過專業考試', '選擇專科領域']
  },
  'nurse': {
    name: '護理師',
    description: '提供病患照護和健康支持',
    matchValues: ['helping', 'responsibility', 'balance'],
    matchInterests: ['healthcare', 'social_work'],
    matchTalents: ['體諒', '責任', '包容'],
    matchWorkStyles: ['患者照護', '同理關懷', '團隊協作', '細心觀察', '體力耐力'],
    requirements: '需要同理心、專業技能和體力',
    nextSteps: ['取得護理學位', '通過護理師考試', '選擇專科領域']
  },
  'pharmacist': {
    name: '藥師',
    description: '調配藥物並提供用藥諮詢',
    matchValues: ['helping', 'achievement', 'responsibility'],
    matchInterests: ['healthcare', 'science'],
    matchTalents: ['審慎', '責任', '學習'],
    matchWorkStyles: ['藥學專業', '細心調配', '用藥安全', '患者諮詢', '法規遵循'],
    requirements: '需要藥學知識、細心態度和溝通能力',
    nextSteps: ['取得藥學學位', '通過藥師考試', '累積臨床經驗']
  },
  'therapist': {
    name: '物理治療師',
    description: '協助患者恢復身體機能',
    matchValues: ['helping', 'healing', 'patience'],
    matchInterests: ['healthcare', 'sports'],
    matchTalents: ['體諒', '恢復', '伯樂'],
    matchWorkStyles: ['復健導向', '動作評估', '耐心指導', '一對一治療', '進步追蹤'],
    requirements: '需要醫學知識、耐心和人際技巧',
    nextSteps: ['取得物理治療學位', '累積臨床經驗', '專精特定領域']
  },
  'nutritionist': {
    name: '營養師',
    description: '提供營養諮詢和飲食規劃',
    matchValues: ['helping', 'health', 'knowledge'],
    matchInterests: ['healthcare', 'food'],
    matchTalents: ['個別', '學習', '體諒'],
    matchWorkStyles: ['營養評估', '飲食規劃', '健康教育', '個別化諮詢', '生活型態指導'],
    requirements: '需要營養學知識、溝通技巧和同理心',
    nextSteps: ['取得營養學位', '考取營養師證照', '累積諮詢經驗']
  },
  'dentist': {
    name: '牙醫師',
    description: '診斷和治療口腔疾病',
    matchValues: ['achievement', 'health', 'service'],
    matchInterests: ['healthcare', 'science'],
    matchTalents: ['完美', '專注', '責任'],
    matchWorkStyles: ['精細操作', '牙科專業', '患者照護', '預防醫學', '美容考量'],
    requirements: '需要牙醫專業、精細操作和病患溝通技巧',
    nextSteps: ['完成牙醫學位', '通過國家考試', '累積臨床經驗']
  },
  'veterinarian': {
    name: '獸醫師',
    description: '診斷和治療動物疾病',
    matchValues: ['helping', 'health', 'responsibility'],
    matchInterests: ['healthcare', 'animals'],
    matchTalents: ['體諒', '學習', '恢復'],
    matchWorkStyles: ['動物醫學', '行為觀察', '動物關懷', '多種類治療', '主人溝通'],
    requirements: '需要獸醫專業、動物行為了解和醫療技能',
    nextSteps: ['完成獸醫學位', '通過獸醫考試', '選擇專科領域']
  },
  'psychiatrist': {
    name: '精神科醫師',
    description: '診斷和治療精神疾病',
    matchValues: ['health', 'helping', 'knowledge'],
    matchInterests: ['healthcare', 'psychology'],
    matchTalents: ['體諒', '分析', '恢復'],
    matchWorkStyles: ['心理評估', '治療關係', '藥物治療', '危機介入', '心理教育'],
    requirements: '需要醫學背景、精神病理學和治療技巧',
    nextSteps: ['完成醫學訓練', '專精精神科', '學習心理治療']
  },
  'occupational_therapist': {
    name: '職能治療師',
    description: '協助患者恢復日常生活能力',
    matchValues: ['rehabilitation', 'independence', 'function'],
    matchInterests: ['healthcare', 'psychology'],
    matchTalents: ['恢復', '個別', '伯樂'],
    matchWorkStyles: ['功能評估', '日常生活訓練', '適應性輔具', '個別化治療', '復能目標'],
    requirements: '需要治療專業、評估技能和創意適應方法',
    nextSteps: ['取得職能治療學位', '累積臨床經驗', '專精特定領域']
  },
  'speech_therapist': {
    name: '語言治療師',
    description: '治療語言和溝通障礙',
    matchValues: ['helping', 'growth', 'health'],
    matchInterests: ['healthcare', 'education'],
    matchTalents: ['體諒', '溝通', '個別'],
    matchWorkStyles: ['語言評估', '溝通訓練', '耐心指導', '個別化治療', '進步追蹤'],
    requirements: '需要語言病理學、治療技術和耐心',
    nextSteps: ['取得語言治療學位', '累積治療經驗', '學習評估工具']
  },
  'radiologic_technologist': {
    name: '放射師',
    description: '操作醫學影像設備進行檢查',
    matchValues: ['achievement', 'technology', 'safety'],
    matchInterests: ['healthcare', 'technology'],
    matchTalents: ['專注', '責任', '審慎'],
    matchWorkStyles: ['影像技術', '輻射安全', '精確操作', '患者安全', '技術更新'],
    requirements: '需要醫學影像技術、輻射安全和設備操作技能',
    nextSteps: ['取得放射技術學位', '考取執照', '學習新影像技術']
  },
  'medical_laboratory_technician': {
    name: '醫檢師',
    description: '進行醫學檢驗和實驗室分析',
    matchValues: ['achievement', 'knowledge', 'helping'],
    matchInterests: ['healthcare', 'science'],
    matchTalents: ['分析', '專注', '審慎'],
    matchWorkStyles: ['實驗室分析', '品質控制', '細節精準', '檢驗技術', '數據分析'],
    requirements: '需要檢驗技術、實驗室操作和品質控制技能',
    nextSteps: ['取得醫檢學位', '考取檢驗師執照', '累積檢驗經驗']
  },
  'paramedic': {
    name: '緊急救護員',
    description: '提供緊急醫療救護服務',
    matchValues: ['helping', 'health', 'adventure'],
    matchInterests: ['healthcare', 'sports'],
    matchTalents: ['行動', '恢復', '自信'],
    matchWorkStyles: ['緊急應變', '救命優先', '壓力應對', '快速決策', '團隊協作'],
    requirements: '需要急救技能、壓力管理和快速決策能力',
    nextSteps: ['取得救護證照', '累積急救經驗', '學習高級救護技術']
  },
  'public_health_specialist': {
    name: '公共衛生專家',
    description: '研究和改善社區健康問題',
    matchValues: ['health', 'helping', 'knowledge'],
    matchInterests: ['healthcare', 'science'],
    matchTalents: ['分析', '戰略', '幫助'],
    matchWorkStyles: ['流行病學', '社區健康', '預防醫學', '數據分析', '政策制定'],
    requirements: '需要流行病學、統計分析和政策制定能力',
    nextSteps: ['取得公衛學位', '累積研究經驗', '參與政策制定']
  },
  
  // 科學研究類
  'researcher': {
    name: '科學研究員',
    description: '進行科學研究和知識探索',
    matchValues: ['knowledge', 'growth', 'achievement'],
    matchInterests: ['science', 'technology'],
    matchTalents: ['學習', '分析', '蒐集'],
    matchWorkStyles: ['研究方法', '學術探索', '數據分析', '實驗設計', '知識創新'],
    requirements: '需要研究能力、好奇心和耐心',
    nextSteps: ['取得相關學位', '參與研究專案', '發表研究成果']
  },
  'lab_technician': {
    name: '實驗室技術員',
    description: '執行實驗和維護實驗設備',
    matchValues: ['achievement', 'knowledge', 'procedure'],
    matchInterests: ['science', 'technology'],
    matchTalents: ['專注', '完美', '審慎'],
    matchWorkStyles: ['實驗操作', '細節精準', '程序遵循', '安全意識', '品質控制'],
    requirements: '需要技術能力、細心態度和安全意識',
    nextSteps: ['學習實驗技術', '累積實務經驗', '考取相關證照']
  },
  'environmental_scientist': {
    name: '環境科學家',
    description: '研究環境問題並提出解決方案',
    matchValues: ['knowledge', 'responsibility', 'growth'],
    matchInterests: ['science', 'environment'],
    matchTalents: ['分析', '關聯', '前瞻'],
    matchWorkStyles: ['環境研究', '數據分析', '系統思維', '長期規劃', '跨域整合'],
    requirements: '需要科學知識、分析能力和環保意識',
    nextSteps: ['取得環境科學學位', '參與環保專案', '關注環境議題']
  },
  
  // 服務業類
  'chef': {
    name: '主廚',
    description: '創作美食和管理廚房',
    matchValues: ['creativity', 'achievement', 'fun'],
    matchInterests: ['food', 'hospitality'],
    matchTalents: ['成就', '專注', '個別'],
    matchWorkStyles: ['美食創作', '廚房管理', '壓力應對', '團隊協作', '品質精進'],
    requirements: '需要創意、技術精進和管理能力',
    nextSteps: ['學習烹飪技術', '累積餐廳經驗', '發展個人風格']
  },
  'hotel_manager': {
    name: '飯店經理',
    description: '管理飯店營運和客戶服務',
    matchValues: ['helping', 'achievement', 'responsibility'],
    matchInterests: ['hospitality', 'business'],
    matchTalents: ['統籌', '取悅', '責任'],
    matchWorkStyles: ['飯店管理', '客戶服務', '品質保證', '團隊管理', '多元文化'],
    requirements: '需要管理能力、服務精神和多語言能力',
    nextSteps: ['累積飯店經驗', '學習飯店管理', '考取相關證照']
  },
  'tour_guide': {
    name: '導遊',
    description: '帶領遊客探索景點和文化',
    matchValues: ['sharing', 'culture', 'adventure'],
    matchInterests: ['travel', 'culture'],
    matchTalents: ['溝通', '積極', '交往'],
    matchWorkStyles: ['文化導覽', '人際互動', '當地知識', '語言溝通', '旅遊服務'],
    requirements: '需要口語表達、文化知識和服務熱忱',
    nextSteps: ['考取導遊證照', '學習外語', '累積文化知識']
  },
  'event_planner': {
    name: '活動企劃',
    description: '規劃和執行各種活動',
    matchValues: ['creativity', 'achievement', 'excitement'],
    matchInterests: ['event', 'marketing'],
    matchTalents: ['統籌', '理念', '行動'],
    matchWorkStyles: ['活動企劃', '創意發想', '組織協調', '時間管理', '多元合作'],
    requirements: '需要創意思維、組織能力和溝通技巧',
    nextSteps: ['累積活動經驗', '學習專案管理', '建立供應商網絡']
  },
  
  // 工程技術類
  'engineer': {
    name: '工程師',
    description: '設計和開發技術解決方案',
    matchValues: ['problem_solving', 'achievement', 'creativity'],
    matchInterests: ['engineering', 'technology'],
    matchTalents: ['分析', '戰略', '完善'],
    matchWorkStyles: ['工程思維', '技術解決', '精確設計', '系統整合', '創新研發'],
    requirements: '需要技術能力、邏輯思維和創新精神',
    nextSteps: ['取得工程學位', '累積實務經驗', '考取技師證照']
  },
  'architect': {
    name: '建築師',
    description: '設計建築物和空間規劃',
    matchValues: ['creativity', 'functionality', 'aesthetics'],
    matchInterests: ['engineering', 'art_design'],
    matchTalents: ['理念', '戰略', '前瞻'],
    matchWorkStyles: ['創意設計', '空間規劃', '美學獨特', '技術整合', '長期願景'],
    requirements: '需要設計能力、空間概念和技術知識',
    nextSteps: ['取得建築學位', '累積設計經驗', '考取建築師證照']
  },
  'civil_engineer': {
    name: '土木工程師',
    description: '設計和建造基礎設施',
    matchValues: ['achievement', 'security', 'responsibility'],
    matchInterests: ['engineering', 'science'],
    matchTalents: ['戰略', '責任', '完美'],
    matchWorkStyles: ['結構設計', '安全至上', '精確計算', '專案管理', '品質保證'],
    requirements: '需要工程知識、結構分析和專案管理能力',
    nextSteps: ['取得工程學位', '考取技師執照', '累積工程經驗']
  },
  'mechanical_engineer': {
    name: '機械工程師',
    description: '設計和開發機械系統',
    matchValues: ['creativity', 'achievement', 'achievement'],
    matchInterests: ['engineering', 'technology'],
    matchTalents: ['理念', '分析', '完美'],
    matchWorkStyles: ['機械設計', '創新思維', '精密計算', '系統整合', '效率優化'],
    requirements: '需要機械原理、設計軟體和製造工藝知識',
    nextSteps: ['學習CAD軟體', '累積設計經驗', '考取工程師執照']
  },
  'electrical_engineer': {
    name: '電機工程師',
    description: '設計和維護電氣系統',
    matchValues: ['achievement', 'security', 'creativity'],
    matchInterests: ['engineering', 'technology'],
    matchTalents: ['分析', '審慎', '學習'],
    matchWorkStyles: ['電路設計', '安全第一', '精確分析', '穩定性考量', '系統整合'],
    requirements: '需要電路設計、電力系統和控制理論知識',
    nextSteps: ['學習電路設計', '累積實務經驗', '考取電機技師']
  },
  'chemical_engineer': {
    name: '化學工程師',
    description: '設計化學製程和設備',
    matchValues: ['creativity', 'achievement', 'security'],
    matchInterests: ['engineering', 'science'],
    matchTalents: ['分析', '戰略', '審慎'],
    matchWorkStyles: ['製程設計', '安全管理', '效率優化', '系統思維', '風險控制'],
    requirements: '需要化學原理、製程設計和安全管理知識',
    nextSteps: ['學習製程設計', '累積工廠經驗', '考取化工技師']
  },
  'environmental_engineer': {
    name: '環境工程師',
    description: '解決環境污染和保護問題',
    matchValues: ['knowledge', 'responsibility', 'growth'],
    matchInterests: ['engineering', 'environment'],
    matchTalents: ['關聯', '責任', '前瞻'],
    matchWorkStyles: ['環境設計', '永續思維', '系統整合', '未來規劃', '社會責任'],
    requirements: '需要環境科學、污染控制和法規知識',
    nextSteps: ['學習環境技術', '累積環保經驗', '考取環工技師']
  },
  'aerospace_engineer': {
    name: '航太工程師',
    description: '設計和開發航空器和太空載具',
    matchValues: ['exploration', 'achievement', 'creativity'],
    matchInterests: ['engineering', 'science'],
    matchTalents: ['理念', '分析', '專注'],
    matchWorkStyles: ['高精度設計', '系統整合', '創新探索', '極致精確', '長期項目'],
    requirements: '需要航太知識、系統設計和高精度工程技能',
    nextSteps: ['取得航太學位', '參與航太專案', '累積設計經驗']
  },
  'biomedical_engineer': {
    name: '生醫工程師',
    description: '開發醫療設備和生物技術',
    matchValues: ['healing', 'creativity', 'achievement'],
    matchInterests: ['engineering', 'healthcare'],
    matchTalents: ['理念', '學習', '完美'],
    matchWorkStyles: ['醫工結合', '精密設計', '法規遵循', '创新研發', '跨域整合'],
    requirements: '需要生物醫學、工程設計和法規認證知識',
    nextSteps: ['學習生醫工程', '累積醫材經驗', '了解法規要求']
  },
  'network_engineer': {
    name: '網路工程師',
    description: '設計和維護電腦網路系統',
    matchValues: ['connectivity', 'reliability', 'security'],
    matchInterests: ['technology', 'engineering'],
    matchTalents: ['分析', '審慎', '統籌'],
    matchWorkStyles: ['網路架構', '安全第一', '故障排除', '系統維護', '技術更新'],
    requirements: '需要網路協定、資安技術和故障排除能力',
    nextSteps: ['考取網路證照', '學習新技術', '累積維護經驗']
  },
  'manufacturing_engineer': {
    name: '製造工程師',
    description: '優化生產流程和製造系統',
    matchValues: ['achievement', 'responsibility', 'creativity'],
    matchInterests: ['engineering', 'business'],
    matchTalents: ['完善', '統籌', '分析'],
    matchWorkStyles: ['流程優化', '品質控制', '效率提升', '成本控制', '持續改善'],
    requirements: '需要製造技術、流程改善和自動化知識',
    nextSteps: ['學習精實生產', '累積工廠經驗', '研究自動化技術']
  },
  
  // ===========================================
  // 法律政治類 (Law & Politics)
  // ===========================================
  
  // 法律政治類
  'lawyer': {
    name: '律師',
    description: '提供法律諮詢和代理訴訟',
    matchValues: ['justice', 'advocacy', 'knowledge'],
    matchInterests: ['law', 'helping'],
    matchTalents: ['分析', '溝通', '公平'],
    matchWorkStyles: ['法律分析', '邏輯推理', '口語表達', '案件研究', '客戶服務'],
    requirements: '需要法律知識、邏輯思維和口語表達',
    nextSteps: ['取得法律學位', '通過律師考試', '選擇專業領域']
  },
  'judge': {
    name: '法官',
    description: '主持法庭審理和判決',
    matchValues: ['justice', 'fairness', 'wisdom'],
    matchInterests: ['law', 'social_work'],
    matchTalents: ['公平', '審慎', '分析'],
    matchWorkStyles: ['公正審理', '中立客觀', '深度思考', '權威判斷', '程序嚴謹'],
    requirements: '需要深厚法學素養、公正態度和豐富經驗',
    nextSteps: ['累積法律實務經驗', '通過司法考試', '持續進修法學']
  },
  'prosecutor': {
    name: '檢察官',
    description: '代表國家進行刑事起訴',
    matchValues: ['justice', 'honesty', 'responsibility'],
    matchInterests: ['law', 'social_work'],
    matchTalents: ['分析', '溝通', '責任'],
    matchWorkStyles: ['證據分析', '正義執行', '法庭論辯', '案件調查', '公正起訴'],
    requirements: '需要刑法知識、證據分析和法庭技巧',
    nextSteps: ['通過司法考試', '累積訴訟經驗', '學習偵查技巧']
  },
  'public_defender': {
    name: '公設辯護人',
    description: '為無力聘請律師的被告提供辯護',
    matchValues: ['justice', 'helping', 'responsibility'],
    matchInterests: ['law', 'social_work'],
    matchTalents: ['公平', '溝通', '體諒'],
    matchWorkStyles: ['辯護技巧', '權益保障', '弱勢關懷', '法庭策略', '公正代理'],
    requirements: '需要刑事辯護技巧、同理心和抗壓能力',
    nextSteps: ['通過律師考試', '學習辯護技巧', '累積案件經驗']
  },
  'corporate_lawyer': {
    name: '企業法務',
    description: '為企業提供法律諮詢和合規服務',
    matchValues: ['responsibility', 'security', 'knowledge'],
    matchInterests: ['law', 'business'],
    matchTalents: ['分析', '審慎', '溝通'],
    matchWorkStyles: ['商法專精', '合規管理', '風險評估', '合約審查', '企業顧問'],
    requirements: '需要商事法知識、合約審查和風險管理技能',
    nextSteps: ['累積商法經驗', '了解企業營運', '學習國際法規']
  },
  'patent_attorney': {
    name: '專利律師',
    description: '處理智慧財產權申請和訴訟',
    matchValues: ['creativity', 'protection', 'technical'],
    matchInterests: ['law', 'technology'],
    matchTalents: ['分析', '學習', '完美'],
    matchWorkStyles: ['專業深度', '細節導向', '獨立作業', '技術理解', '程序嚴謹'],
    requirements: '需要專利法知識、技術背景和申請實務經驗',
    nextSteps: ['取得專利師資格', '學習技術領域', '累積申請經驗']
  },
  'family_lawyer': {
    name: '家事律師',
    description: '處理婚姻、離婚和親子關係案件',
    matchValues: ['family', 'mediation', 'emotion'],
    matchInterests: ['law', 'psychology'],
    matchTalents: ['體諒', '和諧', '溝通'],
    matchWorkStyles: ['情感支持', '調解協商', '同理傾聽', '耐心溝通', '保密專業'],
    requirements: '需要家事法知識、調解技巧和同理心',
    nextSteps: ['學習家事法', '練習調解技巧', '累積家事案件經驗']
  },
  'immigration_lawyer': {
    name: '移民律師',
    description: '協助處理移民和國籍相關法律事務',
    matchValues: ['helping', 'freedom', 'justice'],
    matchInterests: ['law', 'travel'],
    matchTalents: ['包容', '溝通', '責任'],
    matchWorkStyles: ['跨文化溝通', '程序專精', '案件追蹤', '文件管理', '希望傳遞'],
    requirements: '需要移民法知識、跨文化溝通和程序熟悉度',
    nextSteps: ['學習移民法規', '了解各國制度', '累積移民案件']
  },
  'legal_consultant': {
    name: '法律顧問',
    description: '為個人或企業提供法律建議',
    matchValues: ['knowledge', 'security', 'responsibility'],
    matchInterests: ['law', 'consulting'],
    matchTalents: ['分析', '溝通', '戰略'],
    matchWorkStyles: ['策略思考', '風險評估', '客戶導向', '預防觀念', '專業諮詢'],
    requirements: '需要廣泛法律知識、諮詢技巧和商業思維',
    nextSteps: ['累積多元法律經驗', '建立專業網絡', '發展諮詢技能']
  },
  'paralegal': {
    name: '法務助理',
    description: '協助律師進行法律研究和文件準備',
    matchValues: ['helping', 'responsibility', 'knowledge'],
    matchInterests: ['law', 'writing'],
    matchTalents: ['蒐集', '統籌', '審慎'],
    matchWorkStyles: ['支援協作', '文件整理', '研究分析', '程序遵循', '細節把控'],
    requirements: '需要法律基礎知識、文件處理和研究技能',
    nextSteps: ['取得法務助理證照', '學習法律研究', '累積實務經驗']
  },
  'politician': {
    name: '政治人物',
    description: '參與政府決策和民意代表工作',
    matchValues: ['helping', 'responsibility', 'growth'],
    matchInterests: ['law', 'social_work'],
    matchTalents: ['溝通', '指揮', '積極'],
    matchWorkStyles: ['公眾演說', '社交網絡', '危機處理', '政策制定', '長期眼光'],
    requirements: '需要政治敏感度、公眾演說和政策制定能力',
    nextSteps: ['參與政治活動', '建立支持網絡', '學習政策制定']
  },
  
  // ===========================================
  // 服務娛樂類 (Service & Entertainment)
  // ===========================================
  
  // 傳媒娛樂類
  'journalist': {
    name: '記者',
    description: '採訪新聞和撰寫報導',
    matchValues: ['honesty', 'knowledge', 'creativity'],
    matchInterests: ['media', 'writing'],
    matchTalents: ['蒐集', '溝通', '學習'],
    matchWorkStyles: ['真相探究', '時間壓力', '獨立採訪', '多元接觸', '公正客觀'],
    requirements: '需要寫作能力、好奇心和職業道德',
    nextSteps: ['學習新聞寫作', '累積採訪經驗', '關注時事議題']
  },
  'broadcaster': {
    name: '主播/播音員',
    description: '主持節目和播報新聞',
    matchValues: ['creativity', 'fun', 'helping'],
    matchInterests: ['media', 'fun'],
    matchTalents: ['溝通', '積極', '取悅'],
    matchWorkStyles: ['鎧頭表現', '即時反應', '感染力', '台風穩健', '觀眾互動'],
    requirements: '需要口語表達、台風穩健和媒體素養',
    nextSteps: ['訓練口語表達', '累積主持經驗', '學習媒體技巧']
  },
  'flight_attendant': {
    name: '空服員',
    description: '在飛機上提供客艙服務和安全管理',
    matchValues: ['helping', 'security', 'adventure'],
    matchInterests: ['travel', 'hospitality'],
    matchTalents: ['取悅', '體諒', '恢復'],
    matchWorkStyles: ['客戶服務', '應變能力', '安全意識', '團隊合作', '空間適應'],
    requirements: '需要服務精神、應變能力和多語言溝通',
    nextSteps: ['考取空服員執照', '學習外語', '練習服務技巧']
  },
  'personal_trainer': {
    name: '健身教練',
    description: '指導個人運動訓練和健康管理',
    matchValues: ['health', 'motivation', 'achievement'],
    matchInterests: ['sports', 'healthcare'],
    matchTalents: ['伯樂', '積極', '體諒'],
    matchWorkStyles: ['激勵指導', '個別關注', '目標導向', '身體接觸', '成果反饋'],
    requirements: '需要運動科學知識、指導技巧和激勵能力',
    nextSteps: ['考取教練證照', '學習運動科學', '累積指導經驗']
  },
  'massage_therapist': {
    name: '按摩治療師',
    description: '提供按摩和身體放鬆治療服務',
    matchValues: ['healing', 'relaxation', 'touch'],
    matchInterests: ['healthcare', 'sports'],
    matchTalents: ['體諒', '專注', '恢復'],
    matchWorkStyles: ['療癒觸覺', '輕鬆環境', '身體接觸', '態定放鬆', '沉静專注'],
    requirements: '需要按摩技術、人體解剖學和治療知識',
    nextSteps: ['學習按摩技術', '考取按摩證照', '累積治療經驗']
  },
  'hairstylist': {
    name: '髮型設計師',
    description: '設計和造型客戶的髮型',
    matchValues: ['creativity', 'creativity', 'transformation'],
    matchInterests: ['fashion', 'art_design'],
    matchTalents: ['理念', '個別', '取悅'],
    matchWorkStyles: ['美學創意', '時尚敏感', '個人風格', '客戶互動', '手工精巧'],
    requirements: '需要美髮技術、時尚敏感度和客戶溝通',
    nextSteps: ['學習美髮技術', '考取美髮執照', '關注時尚趨勢']
  },
  'makeup_artist': {
    name: '彩妝師',
    description: '為客戶提供化妝和造型服務',
    matchValues: ['creativity', 'artistry', 'enhancement'],
    matchInterests: ['fashion', 'art_design'],
    matchTalents: ['理念', '個別', '完美'],
    matchWorkStyles: ['美學藝術', '色彩創意', '細節完美', '時尚跟隨', '個人化服務'],
    requirements: '需要彩妝技術、色彩搭配和美感品味',
    nextSteps: ['學習彩妝技巧', '建立作品集', '累積客戶經驗']
  },
  'fitness_instructor': {
    name: '團體健身教練',
    description: '帶領團體健身課程和運動指導',
    matchValues: ['energy', 'group', 'motivation'],
    matchInterests: ['sports', 'education'],
    matchTalents: ['積極', '溝通', '指揮'],
    matchWorkStyles: ['團體帶領', '能量激勵', '音樂節奏', '示範指導', '氣氛經營'],
    requirements: '需要運動專業、領導技巧和課程設計能力',
    nextSteps: ['考取健身證照', '學習課程編排', '練習團體指導']
  },
  'travel_agent': {
    name: '旅遊業務',
    description: '為客戶規劃和安排旅遊行程',
    matchValues: ['adventure', 'service', 'experience'],
    matchInterests: ['travel', 'hospitality'],
    matchTalents: ['統籌', '交往', '個別'],
    matchWorkStyles: ['行程規劃', '個人化服務', '資源整合', '跟進服務', '生動分享'],
    requirements: '需要旅遊知識、規劃能力和客戶服務技能',
    nextSteps: ['考取旅遊證照', '累積旅遊經驗', '建立供應商網絡']
  },
  'wedding_planner': {
    name: '婚禮企劃師',
    description: '規劃和執行完美的婚禮慶典',
    matchValues: ['celebration', 'perfection', 'memory'],
    matchInterests: ['hospitality', 'art_design'],
    matchTalents: ['統籌', '完美', '體諒'],
    matchWorkStyles: ['完美執行', '細節管理', '多工協調', '壓力應對', '美學設計'],
    requirements: '需要活動企劃、供應商管理和壓力處理能力',
    nextSteps: ['學習活動企劃', '建立供應商網絡', '累積婚禮經驗']
  },
  'bartender': {
    name: '調酒師',
    description: '調製酒類飲品並提供吧檯服務',
    matchValues: ['craft', 'socializing', 'creativity'],
    matchInterests: ['food', 'hospitality'],
    matchTalents: ['理念', '交往', '專注'],
    matchWorkStyles: ['藝術調製', '社交互動', '夜間工作', '精細操作', '氣氛營造'],
    requirements: '需要調酒技術、酒類知識和客戶互動技巧',
    nextSteps: ['學習調酒技術', '考取調酒證照', '累積吧檯經驗']
  },
  'sommelier': {
    name: '侍酒師',
    description: '專精於葡萄酒品鑑和搭配建議',
    matchValues: ['expertise', 'refinement', 'pairing'],
    matchInterests: ['food', 'hospitality'],
    matchTalents: ['學習', '個別', '蒐集'],
    matchWorkStyles: ['專業品鑑', '品味教育', '精細服務', '口感分析', '酒款知識'],
    requirements: '需要酒類專業知識、品鑑能力和服務技巧',
    nextSteps: ['學習葡萄酒知識', '考取侍酒師證照', '累積品鑑經驗']
  },
  'concierge': {
    name: '禮賓部主管',
    description: '為飯店客人提供個人化服務建議',
    matchValues: ['service', 'knowledge', 'assistance'],
    matchInterests: ['hospitality', 'travel'],
    matchTalents: ['個別', '蒐集', '交往'],
    matchWorkStyles: ['個人化服務', '資源連接', '問題解決', '細心傾聽', '地方專家'],
    requirements: '需要服務精神、地方知識和問題解決能力',
    nextSteps: ['累積服務經驗', '建立資源網絡', '學習多元知識']
  },
  'casino_dealer': {
    name: '荷官',
    description: '在賭場操作各種博弈遊戲',
    matchValues: ['achievement', 'fun', 'neutral'],
    matchInterests: ['gaming', 'hospitality'],
    matchTalents: ['專注', '審慎', '公平'],
    matchWorkStyles: ['精確操作', '中立情緒', '壓力耐受', '夜間工作', '瞬間反應'],
    requirements: '需要遊戲規則熟練、數學計算和壓力管理',
    nextSteps: ['學習遊戲規則', '考取荷官執照', '練習操作技巧']
  },
  'security_guard': {
    name: '保全人員',
    description: '維護建築物和財產安全',
    matchValues: ['protection', 'vigilance', 'responsibility'],
    matchInterests: ['security', 'public_service'],
    matchTalents: ['責任', '審慎', '自信'],
    requirements: '需要安全意識、觀察力和應變能力',
    nextSteps: ['考取保全證照', '學習安全技能', '累積保全經驗']
  },
  'private_investigator': {
    name: '私家偵探',
    description: '進行私人調查和證據收集',
    matchValues: ['honesty', 'knowledge', 'security'],
    matchInterests: ['law', 'security'],
    matchTalents: ['蒐集', '分析', '審慎'],
    requirements: '需要調查技巧、法律知識和保密能力',
    nextSteps: ['學習調查技術', '考取偵探執照', '累積調查經驗']
  },
  'funeral_director': {
    name: '殯葬業者',
    description: '協助家屬處理喪葬事宜',
    matchValues: ['helping', 'responsibility', 'honesty'],
    matchInterests: ['social_work', 'hospitality'],
    matchTalents: ['體諒', '責任', '和諧'],
    matchWorkStyles: ['沉穩尊重', '情緒支持', '儀式細節', '同理心', '由死理生'],
    requirements: '需要同理心、儀式知識和情緒管理能力',
    nextSteps: ['學習殯葬知識', '考取相關證照', '累積服務經驗']
  },
  'pet_groomer': {
    name: '寵物美容師',
    description: '為寵物提供清潔和美容服務',
    matchValues: ['helping', 'creativity', 'fun'],
    matchInterests: ['animals', 'art_design'],
    matchTalents: ['體諒', '完美', '專注'],
    matchWorkStyles: ['動物愛心', '美容技藝', '耐心溝通', '溫柔守護', '細節修饰'],
    requirements: '需要動物知識、美容技術和耐心',
    nextSteps: ['學習寵物美容', '考取美容證照', '累積美容經驗']
  },
  'animal_trainer': {
    name: '動物訓練師',
    description: '訓練動物表演或工作技能',
    matchValues: ['helping', 'creativity', 'friendship'],
    matchInterests: ['animals', 'education'],
    matchTalents: ['伯樂', '體諒', '專注'],
    matchWorkStyles: ['耐心教導', '動物感知', '重複練習', '正向強化', '安全意識'],
    requirements: '需要動物行為學、訓練技巧和安全意識',
    nextSteps: ['學習動物行為', '累積訓練經驗', '考取訓練師證照']
  },
  'life_coach': {
    name: '生活教練',
    description: '協助他人設定和達成人生目標',
    matchValues: ['empowerment', 'growth', 'guidance'],
    matchInterests: ['psychology', 'education'],
    matchTalents: ['伯樂', '積極', '溝通'],
    matchWorkStyles: ['心理僾聽', '目標導向', '激勵指導', '成長顧問', '自主排程'],
    requirements: '需要諮詢技巧、激勵能力和人生智慧',
    nextSteps: ['學習教練技術', '考取教練證照', '累積諮詢經驗']
  },
  'personal_shopper': {
    name: '個人採購顧問',
    description: '為客戶提供購物建議和代購服務',
    matchValues: ['creativity', 'helping', 'achievement'],
    matchInterests: ['fashion', 'business'],
    matchTalents: ['個別', '蒐集', '交往'],
    matchWorkStyles: ['時尚眼光', '個人化服務', '品味建議', '資源對接', '一對一顧問'],
    requirements: '需要時尚眼光、客戶服務和市場知識',
    nextSteps: ['培養時尚品味', '建立客戶網絡', '學習個人風格']
  }
};


export const careerWorkStyleProfiles = {
  "分析型": {
    name: "分析型",
    description: "喜歡深入分析問題，追求精確和邏輯",
    strengths: ["邏輯思維", "專注力", "精確性"],
    suggestions: ["培養溝通能力", "學習團隊合作"]
  },
  "協作型": {
    name: "協作型",
    description: "善於與他人合作，重視團隊成果",
    strengths: ["人際關係", "溝通能力", "團隊精神"],
    suggestions: ["提升專業技能", "培養領導能力"]
  },
  "創新型": {
    name: "創新型",
    description: "富有想像力和創新思維",
    strengths: ["創意思維", "靈活性", "直覺"],
    suggestions: ["學習結構化思維", "提升執行能力"]
  },
  "領導型": {
    name: "領導型",
    description: "善於領導團隊，具有決策能力",
    strengths: ["領導力", "決策能力", "溝通能力"],
    suggestions: ["提升專業技能", "培養同理心"]
  },
  "執行型": {
    name: "執行型",
    description: "善於執行任務，注重效率",
    strengths: ["執行力", "效率", "專注力"],
    suggestions: ["培養創意思維", "提升溝通能力"]
  },
  "支持型": {
    name: "支持型",
    description: "善於支持他人，具有同理心",
    strengths: ["同理心", "溝通能力", "耐心"],
    suggestions: ["提升專業技能", "培養領導能力"]
  }
}


// 134個職業的工作風格需求配置檔案 (從主專案同步)
    export const detailedCareerWorkStyleProfiles = {
      // ===========================================
      // 科技創新類 (Technology & Innovation)
      // ===========================================
      'product_designer': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'ui_ux_designer': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'software_engineer': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'frontend_developer': {
        認知風格: ['視覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['內向充電', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'backend_developer': {
        認知風格: ['分析型決策', '抽象思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'fullstack_developer': {
        認知風格: ['整合型決策', '整體思維'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['平衡型', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'mobile_developer': {
        認知風格: ['視覺型學習', '分析型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['內向充電', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'devops_engineer': {
        認知風格: ['分析型決策', '整體思維'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '支援角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'cybersecurity_specialist': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'blockchain_developer': {
        認知風格: ['抽象思維', '分析型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'cloud_architect': {
        認知風格: ['抽象思維', '整體思維'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['內向充電', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'game_developer': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['內向充電', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'robotics_engineer': {
        認知風格: ['動覺型學習', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'iot_developer': {
        認知風格: ['動覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['內向充電', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      
      // ===========================================
      // 數據分析類
      // ===========================================
      'data_scientist': {
        認知風格: ['分析型決策', '抽象思維'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'data_analyst': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'machine_learning_engineer': {
        認知風格: ['抽象思維', '分析型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'database_administrator': {
        認知風格: ['細節思維', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '支援角色'],
        回饋需求: ['定期回饋'],
        壓力反應: ['低壓偏好型', '穩定偏好型']
      },
      'ai_engineer': {
        認知風格: ['抽象思維', '分析型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      
      // ===========================================
      // 商業管理類
      // ===========================================
      'startup_founder': {
        認知風格: ['直覺型決策', '整體思維'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'product_manager': {
        認知風格: ['整合型決策', '整體思維'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      
      // ===========================================
      // 教育培訓類 (Education & Training)
      // ===========================================
      'teacher': {
        認知風格: ['聽覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'counselor': {
        認知風格: ['聽覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '穩定節奏'],
        社交能量: ['外向充電', '聆聽導向'],
        協作模式: ['獨立工作', '支援角色'],
        回饋需求: ['階段回饋'],
        壓力反應: ['低壓偏好型', '穩定偏好型']
      },
      'trainer': {
        認知風格: ['聽覺型學習', '動覺型學習'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'social_worker': {
        認知風格: ['聽覺型學習', '整合型決策'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '支援角色'],
        回饋需求: ['階段回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'university_professor': {
        認知風格: ['抽象思維', '分析型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['內向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['低壓偏好型', '穩定偏好型']
      },
      'kindergarten_teacher': {
        認知風格: ['動覺型學習', '直覺型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'special_education_teacher': {
        認知風格: ['整合型決策', '動覺型學習'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['外向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['低壓偏好型', '穩定偏好型']
      },
      'language_teacher': {
        認知風格: ['聽覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'vocational_trainer': {
        認知風格: ['動覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '領導角色'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'educational_consultant': {
        認知風格: ['整合型決策', '抽象思維'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'librarian': {
        認知風格: ['視覺型學習', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '支援角色'],
        回饋需求: ['定期回饋'],
        壓力反應: ['低壓偏好型', '穩定偏好型']
      },
      'curriculum_designer': {
        認知風格: ['抽象思維', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'educational_technology_specialist': {
        認知風格: ['視覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['平衡型', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      
      // ===========================================
      // 設計創意類 (Design & Creative)
      // ===========================================
      'graphic_designer': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['平衡型', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'brand_designer': {
        認知風格: ['視覺型學習', '整合型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'web_designer': {
        認知風格: ['視覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['平衡型', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'motion_designer': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['內向充電', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'packaging_designer': {
        認知風格: ['視覺型學習', '細節思維'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'industrial_designer': {
        認知風格: ['動覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['平衡型', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'fashion_designer': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'jewelry_designer': {
        認知風格: ['視覺型學習', '細節思維'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['內向充電', '情境適應'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['低壓偏好型', '穩定偏好型']
      },
      'tattoo_artist': {
        認知風格: ['視覺型學習', '動覺型學習'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'writer': {
        認知風格: ['抽象思維', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['低壓偏好型', '穩定偏好型']
      },
      'copywriter': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'technical_writer': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'screenwriter': {
        認知風格: ['抽象思維', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['內向充電', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'content_strategist': {
        認知風格: ['整合型決策', '抽象思維'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['大團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'photographer': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['平衡型', '情境適應'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'wedding_photographer': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'food_photographer': {
        認知風格: ['視覺型學習', '細節思維'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'commercial_photographer': {
        認知風格: ['視覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'video_editor': {
        認知風格: ['視覺型學習', '細節思維'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'musician': {
        認知風格: ['聽覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['平衡型', '情境適應'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'interior_designer': {
        認知風格: ['視覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      
      // ===========================================
      // 商業金融類 (Business & Finance)
      // ===========================================
      'marketing_manager': {
        認知風格: ['整合型決策', '視覺型學習'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'consultant': {
        認知風格: ['整合型決策', '抽象思維'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'sales_manager': {
        認知風格: ['直覺型決策', '聽覺型學習'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'hr_manager': {
        認知風格: ['整合型決策', '聽覺型學習'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '聆聽導向'],
        協作模式: ['大團隊協作', '支援角色'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'financial_analyst': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'project_manager': {
        認知風格: ['整合型決策', '整體思維'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'business_analyst': {
        認知風格: ['分析型決策', '整體思維'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'investment_banker': {
        認知風格: ['分析型決策', '抽象思維'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'venture_capitalist': {
        認知風格: ['直覺型決策', '抽象思維'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '領導角色'],
        回饋需求: ['階段回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'real_estate_agent': {
        認知風格: ['直覺型決策', '視覺型學習'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'insurance_agent': {
        認知風格: ['整合型決策', '聽覺型學習'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'bank_manager': {
        認知風格: ['分析型決策', '整體思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'tax_consultant': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'supply_chain_manager': {
        認知風格: ['整體思維', '分析型決策'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['定期回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'quality_assurance_manager': {
        認知風格: ['細節思維', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      
      // ===========================================
      // 醫療健康類 (Healthcare & Medical)
      // ===========================================
      'doctor': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'nurse': {
        認知風格: ['整合型決策', '動覺型學習'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '支援角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'pharmacist': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'therapist': {
        認知風格: ['聽覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '穩定節奏'],
        社交能量: ['外向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['低壓偏好型', '穩定偏好型']
      },
      'nutritionist': {
        認知風格: ['分析型決策', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'dentist': {
        認知風格: ['動覺型學習', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'veterinarian': {
        認知風格: ['動覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'psychiatrist': {
        認知風格: ['聽覺型學習', '分析型決策'],
        工作環境: ['低結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['低壓偏好型', '理性應對型']
      },
      'occupational_therapist': {
        認知風格: ['動覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'speech_therapist': {
        認知風格: ['聽覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'radiologic_technologist': {
        認知風格: ['視覺型學習', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'medical_laboratory_technician': {
        認知風格: ['細節思維', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'paramedic': {
        認知風格: ['動覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'public_health_specialist': {
        認知風格: ['抽象思維', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      
      // ===========================================
      // 研究科學類
      // ===========================================
      'researcher': {
        認知風格: ['抽象思維', '分析型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['低壓偏好型', '理性應對型']
      },
      'lab_technician': {
        認知風格: ['細節思維', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'environmental_scientist': {
        認知風格: ['抽象思維', '整體思維'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      
      // ===========================================
      // 服務業類
      // ===========================================
      'chef': {
        認知風格: ['動覺型學習', '直覺型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'hotel_manager': {
        認知風格: ['整合型決策', '聽覺型學習'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'tour_guide': {
        認知風格: ['聽覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'event_planner': {
        認知風格: ['整體思維', '整合型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      
      // ===========================================
      // 工程類
      // ===========================================
      'engineer': {
        認知風格: ['分析型決策', '整體思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'architect': {
        認知風格: ['視覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'civil_engineer': {
        認知風格: ['抽象思維', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['大團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'mechanical_engineer': {
        認知風格: ['動覺型學習', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'electrical_engineer': {
        認知風格: ['抽象思維', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'chemical_engineer': {
        認知風格: ['抽象思維', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'environmental_engineer': {
        認知風格: ['抽象思維', '整體思維'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['大團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'aerospace_engineer': {
        認知風格: ['抽象思維', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['大團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'biomedical_engineer': {
        認知風格: ['整合型決策', '抽象思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'network_engineer': {
        認知風格: ['抽象思維', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '支援角色'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'manufacturing_engineer': {
        認知風格: ['動覺型學習', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['大團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      
      // ===========================================
      // 法律類
      // ===========================================
      'lawyer': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'judge': {
        認知風格: ['分析型決策', '整體思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['獨立工作', '領導角色'],
        回饋需求: ['階段回饋'],
        壓力反應: ['低壓偏好型', '理性應對型']
      },
      'prosecutor': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'public_defender': {
        認知風格: ['整合型決策', '聽覺型學習'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'corporate_lawyer': {
        認知風格: ['分析型決策', '抽象思維'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'patent_attorney': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'family_lawyer': {
        認知風格: ['聽覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'immigration_lawyer': {
        認知風格: ['分析型決策', '聽覺型學習'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['外向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'legal_consultant': {
        認知風格: ['整合型決策', '抽象思維'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'paralegal': {
        認知風格: ['細節思維', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '支援角色'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'politician': {
        認知風格: ['聽覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      
      // ===========================================
      // 其他服務類
      // ===========================================
      'journalist': {
        認知風格: ['聽覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'broadcaster': {
        認知風格: ['聽覺型學習', '直覺型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'flight_attendant': {
        認知風格: ['聽覺型學習', '整合型決策'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '支援角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'personal_trainer': {
        認知風格: ['動覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'massage_therapist': {
        認知風格: ['動覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '穩定節奏'],
        社交能量: ['平衡型', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['低壓偏好型', '穩定偏好型']
      },
      'hairstylist': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'makeup_artist': {
        認知風格: ['視覺型學習', '動覺型學習'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'fitness_instructor': {
        認知風格: ['動覺型學習', '聽覺型學習'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'travel_agent': {
        認知風格: ['視覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'wedding_planner': {
        認知風格: ['整體思維', '整合型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['大團隊協作', '領導角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'bartender': {
        認知風格: ['聽覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '變化擁抱型']
      },
      'sommelier': {
        認知風格: ['感官型學習', '分析型決策'],
        工作環境: ['中等結構化', '穩定節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'concierge': {
        認知風格: ['聽覺型學習', '整合型決策'],
        工作環境: ['中等結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '支援角色'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'casino_dealer': {
        認知風格: ['動覺型學習', '分析型決策'],
        工作環境: ['高結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['壓力促進型', '理性應對型']
      },
      'security_guard': {
        認知風格: ['視覺型學習', '分析型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'private_investigator': {
        認知風格: ['分析型決策', '細節思維'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['內向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['適度壓力型', '理性應對型']
      },
      'funeral_director': {
        認知風格: ['聽覺型學習', '整合型決策'],
        工作環境: ['高結構化', '穩定節奏'],
        社交能量: ['外向充電', '聆聽導向'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['定期回饋'],
        壓力反應: ['低壓偏好型', '穩定偏好型']
      },
      'pet_groomer': {
        認知風格: ['動覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['外向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '穩定偏好型']
      },
      'animal_trainer': {
        認知風格: ['動覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      'life_coach': {
        認知風格: ['聽覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['外向充電', '聆聽導向'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['階段回饋'],
        壓力反應: ['低壓偏好型', '穩定偏好型']
      },
      'personal_shopper': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '快節奏'],
        社交能量: ['外向充電', '主動溝通'],
        協作模式: ['獨立工作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      },
      
      // UI設計師 (補充原有定義)
      'ui_designer': {
        認知風格: ['視覺型學習', '直覺型決策'],
        工作環境: ['低結構化', '彈性節奏'],
        社交能量: ['平衡型', '主動溝通'],
        協作模式: ['小團隊協作', '專業執行'],
        回饋需求: ['即時回饋'],
        壓力反應: ['適度壓力型', '變化擁抱型']
      }
    };

// 情境式工作風格特質對應
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
  observational_learning: { name: '觀察學習', category: 'LEARNING_STYLE' },
  
  // 時間管理
  deadline_driven: { name: '截止日期導向', category: 'TIME_MANAGEMENT' },
  flexible_timing: { name: '彈性時間', category: 'TIME_MANAGEMENT' },
  structured_schedule: { name: '結構化時程', category: 'TIME_MANAGEMENT' }
};

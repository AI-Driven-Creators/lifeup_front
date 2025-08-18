/**
 * 興趣領域情境題數據與生成邏輯
 * 基於Holland職業興趣理論(RIASEC)和心理學研究重新設計
 * 採用系統化情境分類，確保每個興趣領域都有充分的測試機會
 */

// Holland RIASEC 職業興趣類型
const HOLLAND_TYPES = {
  REALISTIC: '實務型', // 喜歡操作、技術、機械
  INVESTIGATIVE: '研究型', // 喜歡思考、分析、研究
  ARTISTIC: '藝術型', // 喜歡創作、表達、美感
  SOCIAL: '社會型', // 喜歡助人、教導、服務
  ENTERPRISING: '企業型', // 喜歡領導、說服、競爭
  CONVENTIONAL: '事務型' // 喜歡組織、系統、規範
};

// 情境分類系統
const SCENARIO_CATEGORIES = {
  LEARNING: '學習選擇',
  CAREER: '職業發展', 
  LEISURE: '休閒活動',
  SKILL_DEVELOPMENT: '技能培養',
  WORK_ENVIRONMENT: '工作環境',
  PROBLEM_SOLVING: '問題解決'
};

// 興趣領域映射頻率表
const INTERESTS_FREQUENCY_MAP = {
  'technology': 4, 'art_design': 4, 'business': 4, 'education': 4,
  'healthcare': 3, 'media': 3, 'finance': 3, 'engineering': 3,
  'sports': 3, 'music': 3, 'food': 3, 'travel': 3,
  'fashion': 3, 'law': 3, 'science': 3, 'social_work': 4,
  'marketing': 3, 'manufacturing': 2, 'agriculture': 2, 'transportation': 2,
  'real_estate': 2, 'hospitality': 3, 'psychology': 3, 'gaming': 3,
  'photography': 3, 'writing': 3, 'crafts': 2, 'animals': 2,
  'environment': 3, 'consulting': 3
};

export const interestsScenarios = [
  // 學習選擇情境 (4題)
  {
    id: 1,
    category: SCENARIO_CATEGORIES.LEARNING,
    hollandType: [HOLLAND_TYPES.INVESTIGATIVE, HOLLAND_TYPES.ARTISTIC],
    question: '如果你可以選擇一個領域深入學習一年，你會選擇？',
    options: [
      { 
        text: '程式設計和人工智慧技術', 
        interests: ['technology', 'science'],
        description: '邏輯思維和創新技術'
      },
      { 
        text: '平面設計和視覺藝術創作', 
        interests: ['art_design', 'photography'],
        description: '視覺美感和創意表達'
      },
      { 
        text: '心理學和人際溝通技巧', 
        interests: ['psychology', 'education'],
        description: '理解人性和助人技能'
      },
      { 
        text: '商業策略和市場分析', 
        interests: ['business', 'marketing'],
        description: '商業洞察和策略思維'
      }
    ]
  },
  {
    id: 2,
    category: SCENARIO_CATEGORIES.LEARNING,
    hollandType: [HOLLAND_TYPES.REALISTIC, HOLLAND_TYPES.SOCIAL],
    question: '在線上課程平台瀏覽時，你最容易被什麼課程吸引？',
    options: [
      { 
        text: '醫療健康和生命科學相關課程', 
        interests: ['healthcare', 'science'],
        description: '關注健康和生命奧秘'
      },
      { 
        text: '音樂製作和表演藝術課程', 
        interests: ['music', 'art_design'],
        description: '音樂創作和表演技巧'
      },
      { 
        text: '烹飪技巧和美食文化課程', 
        interests: ['food', 'crafts'],
        description: '美食創作和文化探索'
      },
      { 
        text: '工程技術和製造工藝課程', 
        interests: ['engineering', 'manufacturing'],
        description: '技術實作和工藝精進'
      }
    ]
  },
  {
    id: 3,
    category: SCENARIO_CATEGORIES.LEARNING,
    hollandType: [HOLLAND_TYPES.ARTISTIC, HOLLAND_TYPES.ENTERPRISING],
    question: '參加工作坊時，你偏好哪種學習方式？',
    options: [
      { 
        text: '動手實作，製作具體的作品', 
        interests: ['crafts', 'art_design', 'engineering'],
        description: '透過實作學習'
      },
      { 
        text: '案例分析，討論實際問題解決', 
        interests: ['consulting', 'business', 'law'],
        description: '分析思考學習'
      },
      { 
        text: '團體合作，與他人協作完成項目', 
        interests: ['social_work', 'education', 'marketing'],
        description: '協作互動學習'
      },
      { 
        text: '理論探討，深入了解背後原理', 
        interests: ['science', 'psychology', 'technology'],
        description: '理論深度學習'
      }
    ]
  },
  {
    id: 4,
    category: SCENARIO_CATEGORIES.LEARNING,
    hollandType: [HOLLAND_TYPES.CONVENTIONAL, HOLLAND_TYPES.SOCIAL],
    question: '你更願意學習哪種類型的技能？',
    options: [
      { 
        text: '數據分析和財務管理技能', 
        interests: ['finance', 'consulting'],
        description: '數據和財務專業'
      },
      { 
        text: '攝影和影像處理技能', 
        interests: ['photography', 'media'],
        description: '視覺創作技術'
      },
      { 
        text: '語言和跨文化溝通技能', 
        interests: ['education', 'travel'],
        description: '語言和文化交流'
      },
      { 
        text: '環境保護和可持續發展技能', 
        interests: ['environment', 'agriculture'],
        description: '環保和永續發展'
      }
    ]
  },

  // 職業發展情境 (3題)
  {
    id: 5,
    category: SCENARIO_CATEGORIES.CAREER,
    hollandType: [HOLLAND_TYPES.ENTERPRISING, HOLLAND_TYPES.SOCIAL],
    question: '如果要創業，你最想開什麼類型的公司？',
    options: [
      { 
        text: '科技創新公司，開發前沿產品', 
        interests: ['technology', 'science'],
        description: '科技創新創業'
      },
      { 
        text: '創意設計工作室，提供設計服務', 
        interests: ['art_design', 'media'],
        description: '創意設計創業'
      },
      { 
        text: '餐飲或生活服務企業', 
        interests: ['food', 'hospitality'],
        description: '生活服務創業'
      },
      { 
        text: '教育培訓或諮詢顧問公司', 
        interests: ['education', 'consulting'],
        description: '知識服務創業'
      }
    ]
  },
  {
    id: 6,
    category: SCENARIO_CATEGORIES.CAREER,
    hollandType: [HOLLAND_TYPES.REALISTIC, HOLLAND_TYPES.INVESTIGATIVE],
    question: '在職涯發展中，你最希望在哪個領域建立專業聲譽？',
    options: [
      { 
        text: '醫療健康領域，幫助人們治療疾病', 
        interests: ['healthcare', 'science'],
        description: '醫療專業發展'
      },
      { 
        text: '法律政治領域，維護公義和秩序', 
        interests: ['law', 'social_work'],
        description: '法律公共事務'
      },
      { 
        text: '金融投資領域，管理財富和風險', 
        interests: ['finance', 'business'],
        description: '金融投資專業'
      },
      { 
        text: '工程技術領域，解決實際技術問題', 
        interests: ['engineering', 'technology'],
        description: '工程技術專業'
      }
    ]
  },
  {
    id: 7,
    category: SCENARIO_CATEGORIES.CAREER,
    hollandType: [HOLLAND_TYPES.ARTISTIC, HOLLAND_TYPES.ENTERPRISING],
    question: '你理想的工作成就是什麼？',
    options: [
      { 
        text: '創作出感動人心的藝術作品', 
        interests: ['art_design', 'music', 'writing'],
        description: '藝術創作成就'
      },
      { 
        text: '建立成功的商業帝國', 
        interests: ['business', 'marketing', 'real_estate'],
        description: '商業成功成就'
      },
      { 
        text: '幫助很多人改善生活品質', 
        interests: ['healthcare', 'social_work', 'education'],
        description: '社會服務成就'
      },
      { 
        text: '在科學研究上有重大突破', 
        interests: ['science', 'technology', 'psychology'],
        description: '科學研究成就'
      }
    ]
  },

  // 休閒活動情境 (2題)
  {
    id: 8,
    category: SCENARIO_CATEGORIES.LEISURE,
    hollandType: [HOLLAND_TYPES.ARTISTIC, HOLLAND_TYPES.REALISTIC],
    question: '週末空閒時，你最喜歡從事什麼活動？',
    options: [
      { 
        text: '運動健身或戶外探險', 
        interests: ['sports', 'travel'],
        description: '體能活動和探索'
      },
      { 
        text: '看電影、聽音樂或玩遊戲', 
        interests: ['media', 'music', 'gaming'],
        description: '娛樂休閒活動'
      },
      { 
        text: '烹飪美食或手工製作', 
        interests: ['food', 'crafts'],
        description: '動手創作活動'
      },
      { 
        text: '閱讀學習或研究感興趣的主題', 
        interests: ['science', 'psychology', 'writing'],
        description: '知識探索活動'
      }
    ]
  },
  {
    id: 9,
    category: SCENARIO_CATEGORIES.LEISURE,
    hollandType: [HOLLAND_TYPES.SOCIAL, HOLLAND_TYPES.CONVENTIONAL],
    question: '在旅行時，你最感興趣的活動是？',
    options: [
      { 
        text: '參觀博物館、藝術展或歷史景點', 
        interests: ['art_design', 'education', 'photography'],
        description: '文化藝術探索'
      },
      { 
        text: '體驗當地美食和生活方式', 
        interests: ['food', 'travel', 'hospitality'],
        description: '生活文化體驗'
      },
      { 
        text: '與當地人交流，了解不同文化', 
        interests: ['social_work', 'education', 'psychology'],
        description: '文化交流互動'
      },
      { 
        text: '攝影記錄美景和有趣的事物', 
        interests: ['photography', 'art_design', 'media'],
        description: '視覺記錄創作'
      }
    ]
  },

  // 工作環境情境 (2題)
  {
    id: 10,
    category: SCENARIO_CATEGORIES.WORK_ENVIRONMENT,
    hollandType: [HOLLAND_TYPES.REALISTIC, HOLLAND_TYPES.CONVENTIONAL],
    question: '你更願意在哪種環境工作？',
    options: [
      { 
        text: '現代化辦公室，使用先進科技設備', 
        interests: ['technology', 'business', 'consulting'],
        description: '現代科技環境'
      },
      { 
        text: '創意工作室，充滿藝術氛圍', 
        interests: ['art_design', 'media', 'fashion'],
        description: '創意藝術環境'
      },
      { 
        text: '醫院診所，直接服務病患', 
        interests: ['healthcare', 'social_work'],
        description: '醫療服務環境'
      },
      { 
        text: '工廠實驗室，進行實務操作', 
        interests: ['engineering', 'manufacturing', 'science'],
        description: '實務操作環境'
      }
    ]
  },
  {
    id: 11,
    category: SCENARIO_CATEGORIES.WORK_ENVIRONMENT,
    hollandType: [HOLLAND_TYPES.SOCIAL, HOLLAND_TYPES.ENTERPRISING],
    question: '你偏好的工作互動方式是？',
    options: [
      { 
        text: '團隊協作，與同事密切合作', 
        interests: ['education', 'social_work', 'marketing'],
        description: '團隊協作模式'
      },
      { 
        text: '客戶服務，直接面對使用者', 
        interests: ['hospitality', 'consulting', 'real_estate'],
        description: '客戶服務模式'
      },
      { 
        text: '獨立作業，專注於專業技能', 
        interests: ['writing', 'art_design', 'technology'],
        description: '獨立專業模式'
      },
      { 
        text: '領導管理，指導團隊方向', 
        interests: ['business', 'law', 'consulting'],
        description: '領導管理模式'
      }
    ]
  },

  // 問題解決情境 (2題)
  {
    id: 12,
    category: SCENARIO_CATEGORIES.PROBLEM_SOLVING,
    hollandType: [HOLLAND_TYPES.INVESTIGATIVE, HOLLAND_TYPES.REALISTIC],
    question: '面對複雜問題時，你的解決方式是？',
    options: [
      { 
        text: '收集數據，進行系統性分析', 
        interests: ['science', 'finance', 'consulting'],
        description: '數據分析解決'
      },
      { 
        text: '發揮創意，尋找創新解決方案', 
        interests: ['art_design', 'technology', 'marketing'],
        description: '創意創新解決'
      },
      { 
        text: '請教專家，尋求專業建議', 
        interests: ['education', 'healthcare', 'law'],
        description: '專業諮詢解決'
      },
      { 
        text: '動手實驗，通過實作找答案', 
        interests: ['engineering', 'crafts', 'manufacturing'],
        description: '實作實驗解決'
      }
    ]
  },
  {
    id: 13,
    category: SCENARIO_CATEGORIES.PROBLEM_SOLVING,
    hollandType: [HOLLAND_TYPES.SOCIAL, HOLLAND_TYPES.ARTISTIC],
    question: '你最有成就感的解決問題方式是？',
    options: [
      { 
        text: '透過溝通協調，化解人際衝突', 
        interests: ['psychology', 'social_work', 'education'],
        description: '溝通協調解決'
      },
      { 
        text: '運用技術手段，提高工作效率', 
        interests: ['technology', 'engineering', 'business'],
        description: '技術效率解決'
      },
      { 
        text: '設計美觀方案，兼顧功能與美感', 
        interests: ['art_design', 'fashion', 'photography'],
        description: '美感設計解決'
      },
      { 
        text: '建立系統流程，確保長期穩定', 
        interests: ['consulting', 'finance', 'manufacturing'],
        description: '系統流程解決'
      }
    ]
  },

  // 技能發展情境 (2題)
  {
    id: 14,
    category: SCENARIO_CATEGORIES.SKILL_DEVELOPMENT,
    hollandType: [HOLLAND_TYPES.INVESTIGATIVE, HOLLAND_TYPES.ARTISTIC],
    question: '如果要學習一門新的技能，你會選擇？',
    options: [
      { 
        text: '數據分析和統計建模技能', 
        interests: ['science', 'technology', 'finance'],
        description: '邏輯分析技能'
      },
      { 
        text: '影片剪輯和多媒體製作', 
        interests: ['media', 'art_design', 'technology'],
        description: '創意製作技能'
      },
      { 
        text: '外語和跨文化溝通', 
        interests: ['education', 'travel', 'social_work'],
        description: '溝通交流技能'
      },
      { 
        text: '投資理財和風險管理', 
        interests: ['finance', 'business', 'consulting'],
        description: '財務管理技能'
      }
    ]
  },
  {
    id: 15,
    category: SCENARIO_CATEGORIES.SKILL_DEVELOPMENT,
    hollandType: [HOLLAND_TYPES.REALISTIC, HOLLAND_TYPES.ENTERPRISING],
    question: '在技能認證方面，你更傾向考取？',
    options: [
      { 
        text: '專業技術證照（如工程師、建築師）', 
        interests: ['engineering', 'technology', 'science'],
        description: '技術專業認證'
      },
      { 
        text: '商業管理證照（如PMP、MBA）', 
        interests: ['business', 'consulting', 'marketing'],
        description: '管理商業認證'  
      },
      { 
        text: '創意設計證照（如Adobe、UI/UX）', 
        interests: ['art_design', 'media', 'technology'],
        description: '創意設計認證'
      },
      { 
        text: '服務業證照（如導遊、廚師）', 
        interests: ['hospitality', 'food', 'travel'],
        description: '服務技能認證'
      }
    ]
  },

  // 生活風格情境 (3題)
  {
    id: 16,
    category: SCENARIO_CATEGORIES.LEISURE,
    hollandType: [HOLLAND_TYPES.SOCIAL, HOLLAND_TYPES.ARTISTIC],
    question: '如果有一個月的假期，你最想做什麼？',
    options: [
      { 
        text: '深度旅行，探索不同國家文化', 
        interests: ['travel', 'photography', 'education'],
        description: '文化探索體驗'
      },
      { 
        text: '專心創作，完成一個藝術作品', 
        interests: ['art_design', 'writing', 'music'],
        description: '藝術創作投入'
      },
      { 
        text: '學習新技能，如程式設計或投資', 
        interests: ['technology', 'finance', 'science'],
        description: '技能學習提升'
      },
      { 
        text: '參與志工活動，服務社區', 
        interests: ['social_work', 'education', 'healthcare'],
        description: '社會服務參與'
      }
    ]
  },
  {
    id: 17,
    category: SCENARIO_CATEGORIES.LEISURE,
    hollandType: [HOLLAND_TYPES.INVESTIGATIVE, HOLLAND_TYPES.REALISTIC],
    question: '你最享受的學習方式是？',
    options: [
      { 
        text: '實作動手，邊做邊學', 
        interests: ['engineering', 'crafts', 'manufacturing'],
        description: '實作體驗學習'
      },
      { 
        text: '閱讀研究，深入理論探討', 
        interests: ['science', 'writing', 'psychology'],
        description: '理論研究學習'
      },
      { 
        text: '團體討論，與他人交流想法', 
        interests: ['education', 'social_work', 'marketing'],
        description: '互動交流學習'
      },
      { 
        text: '觀摩模仿，學習他人技巧', 
        interests: ['art_design', 'sports', 'music'],
        description: '觀摩模仿學習'
      }
    ]
  },
  {
    id: 18,
    category: SCENARIO_CATEGORIES.CAREER,
    hollandType: [HOLLAND_TYPES.ENTERPRISING, HOLLAND_TYPES.CONVENTIONAL],
    question: '在理想的工作環境中，你希望？',
    options: [
      { 
        text: '有清楚的晉升階梯和發展機會', 
        interests: ['business', 'consulting', 'finance'],
        description: '職涯發展導向'
      },
      { 
        text: '能發揮創意，不受傳統束縛', 
        interests: ['art_design', 'media', 'technology'],
        description: '創意自由導向'
      },
      { 
        text: '與優秀同事合作，共同成長', 
        interests: ['education', 'science', 'engineering'],
        description: '團隊合作導向'
      },
      { 
        text: '直接服務客戶，解決實際問題', 
        interests: ['healthcare', 'social_work', 'consulting'],
        description: '客戶服務導向'
      }
    ]
  }
];

/**
 * 根據使用者選擇的興趣領域動態生成情境題
 * 基於Holland RIASEC理論，確保科學性和全面性
 * @param {string[]} selectedInterests - 使用者選擇的興趣領域ID列表
 * @returns {Array} 篩選並處理後的情境題列表
 */
export const generateInterestsScenarios = (selectedInterests) => {
  console.log('生成興趣領域情境題，選擇的興趣:', selectedInterests);
  
  // 1. 計算每個情境題與使用者選擇的相關度
  const scenariosWithRelevance = interestsScenarios.map(scenario => {
    let relevanceScore = 0;
    let relevantOptions = [];
    
    scenario.options.forEach(option => {
      const matchingInterests = option.interests.filter(interest => selectedInterests.includes(interest));
      if (matchingInterests.length > 0) {
        relevanceScore += matchingInterests.length;
        relevantOptions.push(option);
      }
    });
    
    return {
      ...scenario,
      relevanceScore,
      relevantOptionsCount: relevantOptions.length,
      relevantOptions
    };
  });
  
  // 2. 按相關度和Holland類型平衡性排序
  const sortedScenarios = scenariosWithRelevance
    .filter(scenario => scenario.relevanceScore > 0)
    .sort((a, b) => {
      // 優先考慮有更多相關選項的情境題
      if (a.relevantOptionsCount !== b.relevantOptionsCount) {
        return b.relevantOptionsCount - a.relevantOptionsCount;
      }
      // 其次考慮總相關度分數
      return b.relevanceScore - a.relevanceScore;
    });
  
  // 3. 確保涵蓋不同的Holland類型，增加測驗全面性
  const selectedScenarios = [];
  const usedHollandTypes = new Set();
  
  // 優先選擇不同Holland類型的情境題
  sortedScenarios.forEach(scenario => {
    if (selectedScenarios.length < 8) {
      const isNewType = scenario.hollandType && 
        scenario.hollandType.some(type => !usedHollandTypes.has(type));
      
      if (isNewType || selectedScenarios.length < 3) {
        selectedScenarios.push(scenario);
        if (scenario.hollandType) {
          scenario.hollandType.forEach(type => usedHollandTypes.add(type));
        }
      }
    }
  });
  
  // 4. 如果還需要更多題目，補充剩餘的高相關度題目
  if (selectedScenarios.length < 6) {
    const remainingScenarios = sortedScenarios
      .filter(scenario => !selectedScenarios.some(selected => selected.id === scenario.id))
      .slice(0, 6 - selectedScenarios.length);
    
    selectedScenarios.push(...remainingScenarios);
  }
  
  // 5. 處理每個選中情境題的選項
  const finalScenarios = selectedScenarios.map(scenario => {
    const finalOptions = scenario.relevantOptionsCount >= 2 
      ? scenario.relevantOptions 
      : scenario.options;
      
    return {
      id: scenario.id,
      category: scenario.category,
      hollandType: scenario.hollandType,
      question: scenario.question,
      options: finalOptions
    };
  });
  
  // 6. 如果相關題目不足，補充一些通用題目
  if (finalScenarios.length < 8) {
    const additionalScenarios = interestsScenarios
      .filter(scenario => !finalScenarios.some(fs => fs.id === scenario.id))
      .slice(0, 8 - finalScenarios.length);
    
    finalScenarios.push(...additionalScenarios);
  }
  
  console.log('涵蓋的Holland類型:', [...usedHollandTypes]);
  console.log('最終生成的興趣情境題數量:', finalScenarios.length);
  
  return finalScenarios;
};

/**
 * 獲取興趣測驗統計信息，用於調試和優化
 */
export const getInterestsScenarioStats = () => {
  const categoryCount = {};
  const hollandTypeCount = {};
  const interestsCoverage = {};
  
  interestsScenarios.forEach(scenario => {
    // 統計類別分佈
    categoryCount[scenario.category] = (categoryCount[scenario.category] || 0) + 1;
    
    // 統計Holland類型分佈
    if (scenario.hollandType) {
      scenario.hollandType.forEach(type => {
        hollandTypeCount[type] = (hollandTypeCount[type] || 0) + 1;
      });
    }
    
    // 統計興趣覆蓋度
    scenario.options.forEach(option => {
      option.interests.forEach(interest => {
        interestsCoverage[interest] = (interestsCoverage[interest] || 0) + 1;
      });
    });
  });
  
  return {
    totalScenarios: interestsScenarios.length,
    categoryDistribution: categoryCount,
    hollandTypeDistribution: hollandTypeCount,
    interestsCoverage: interestsCoverage
  };
};
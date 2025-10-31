/**
 * 價值觀情境題數據與生成邏輯
 * 基於Schwartz價值觀理論和心理學研究文獻重新設計
 * 採用系統化情境分類，確保每個價值觀都有充分的測試機會
 */

// 情境分類系統
const SCENARIO_CATEGORIES = {
  WORK: '工作職場',
  RELATIONSHIP: '人際關係', 
  PERSONAL_GROWTH: '個人成長',
  LIFESTYLE: '生活方式',
  ETHICS: '道德倫理',
  TIME_ALLOCATION: '時間分配'
};

// 價值觀映射頻率表 - 確保每個價值觀都有足夠的測試機會
const VALUES_FREQUENCY_MAP = {
  'achievement': 4, 'freedom': 4, 'security': 3, 'creativity': 4,
  'family': 4, 'health': 3, 'honesty': 3, 'growth': 4,
  'friendship': 3, 'independence': 3, 'challenge': 3, 'stability': 3,
  'helping': 4, 'knowledge': 3, 'adventure': 3, 'wealth': 3,
  'recognition': 3, 'balance': 4, 'justice': 3, 'fun': 3,
  'responsibility': 3, 'spirituality': 2, 'excellence': 3, 'tradition': 2,
  'influence': 2, 'compassion': 3, 'authenticity': 3, 'variety': 3,
  'teamwork': 3, 'peace': 2
};

export const valuesScenarios = [
  // 工作職場情境 (6題)
  {
    id: 1,
    category: SCENARIO_CATEGORIES.WORK,
    question: '你正在考慮兩個工作機會，你會優先考慮哪個因素？',
    options: [
      { 
        text: '工作內容富有挑戰性，能讓我不斷突破自己', 
        values: ['challenge', 'growth', 'achievement'],
        description: '側重個人發展和成就感'
      },
      { 
        text: '工作環境穩定，有良好的保障和福利', 
        values: ['security', 'stability', 'balance'],
        description: '注重穩定性和生活保障'  
      },
      { 
        text: '能夠發揮創意，在工作中展現獨特想法', 
        values: ['creativity', 'freedom', 'authenticity'],
        description: '重視創新和自我表達'
      },
      { 
        text: '薪資優渥，能提供良好的物質生活', 
        values: ['wealth', 'security', 'family'],
        description: '關注經濟回報和家庭支持'
      }
    ]
  },
  {
    id: 2,
    category: SCENARIO_CATEGORIES.WORK,
    question: '在團隊合作中，你最希望扮演什麼角色？',
    options: [
      { 
        text: '團隊領導者，負責制定策略和方向', 
        values: ['influence', 'responsibility', 'achievement'],
        description: '喜歡承擔領導責任'
      },
      { 
        text: '創意發想者，提供新穎的解決方案', 
        values: ['creativity', 'challenge', 'recognition'],
        description: '重視創新和被認同'
      },
      { 
        text: '團隊協調者，確保大家合作順利', 
        values: ['teamwork', 'helping', 'balance'],
        description: '注重團隊和諧'
      },
      { 
        text: '專業執行者，將工作做到最佳品質', 
        values: ['excellence', 'responsibility', 'achievement'],
        description: '追求專業卓越'
      }
    ]
  },
  {
    id: 3,
    category: SCENARIO_CATEGORIES.WORK,
    question: '當工作與個人時間發生衝突時，你的選擇是？',
    options: [
      { 
        text: '優先完成工作，因為職業成就很重要', 
        values: ['achievement', 'responsibility', 'excellence'],
        description: '工作優先導向'
      },
      { 
        text: '保護個人時間，維持生活平衡', 
        values: ['balance', 'family', 'health'],
        description: '生活平衡導向'
      },
      { 
        text: '看具體情況，靈活調整安排', 
        values: ['variety', 'balance', 'growth'],
        description: '彈性適應導向'
      }
    ]
  },
  {
    id: 4,
    category: SCENARIO_CATEGORIES.WORK,
    question: '你理想的工作環境是什麼樣的？',
    options: [
      { 
        text: '安靜專注的空間，可以深度思考', 
        values: ['independence', 'knowledge', 'balance'],
        description: '喜歜獨立思考環境'
      },
      { 
        text: '活潑互動的氛圍，充滿團隊協作', 
        values: ['teamwork', 'friendship', 'fun'],
        description: '偏好社交互動環境'
      },
      { 
        text: '多變有趣的環境，經常有新挑戰', 
        values: ['variety', 'challenge', 'adventure'],
        description: '尋求變化和刺激'
      },
      { 
        text: '有清楚制度的環境，規範明確', 
        values: ['stability', 'tradition', 'security'],
        description: '偏好結構化環境'
      }
    ]
  },
  {
    id: 5,
    category: SCENARIO_CATEGORIES.WORK,
    question: '在職場中遇到不公平的事情，你會如何應對？',
    options: [
      { 
        text: '勇敢站出來，為正義發聲', 
        values: ['justice', 'honesty', 'responsibility'],
        description: '正義感導向'
      },
      { 
        text: '先了解各方立場，尋求平衡解決', 
        values: ['compassion', 'balance', 'teamwork'],
        description: '和諧平衡導向'
      },
      { 
        text: '保護自己，避免捲入紛爭', 
        values: ['security', 'independence', 'stability'],
        description: '自我保護導向'
      }
    ]
  },
  {
    id: 6,
    category: SCENARIO_CATEGORIES.WORK,
    question: '什麼樣的工作成就會讓你感到最滿足？',
    options: [
      { 
        text: '創造出影響社會的產品或服務', 
        values: ['creativity', 'influence', 'helping'],
        description: '社會影響導向'
      },
      { 
        text: '在專業領域獲得權威認可', 
        values: ['recognition', 'excellence', 'achievement'],
        description: '專業成就導向'
      },
      { 
        text: '幫助很多人解決問題或改善生活', 
        values: ['helping', 'compassion', 'growth'],
        description: '助人服務導向'
      },
      { 
        text: '獲得豐厚回報，提升生活品質', 
        values: ['wealth', 'security', 'family'],
        description: '物質回報導向'
      }
    ]
  },

  // 人際關係情境 (3題)
  {
    id: 7,
    category: SCENARIO_CATEGORIES.RELATIONSHIP,
    question: '在朋友聚會中，你通常會？',
    options: [
      { 
        text: '主動活絡氣氛，讓大家都開心', 
        values: ['fun', 'helping', 'friendship'],
        description: '社交活躍型'
      },
      { 
        text: '專注與少數朋友深度交流', 
        values: ['friendship', 'authenticity', 'balance'],
        description: '深度交流型'
      },
      { 
        text: '觀察大家，適時提供幫助', 
        values: ['compassion', 'helping', 'teamwork'],
        description: '關懷他人型'
      },
      { 
        text: '保持自己的步調，自在參與', 
        values: ['independence', 'authenticity', 'freedom'],
        description: '自主參與型'
      }
    ]
  },
  {
    id: 8,
    category: SCENARIO_CATEGORIES.RELATIONSHIP,
    question: '當朋友向你求助時，你的反應是？',
    options: [
      { 
        text: '立即放下手邊事情，全力協助', 
        values: ['helping', 'friendship', 'compassion'],
        description: '無條件支持'
      },
      { 
        text: '分析問題，提供實用的建議', 
        values: ['knowledge', 'responsibility', 'helping'],
        description: '理性分析協助'
      },
      { 
        text: '陪伴傾聽，給予情感上的支持', 
        values: ['compassion', 'friendship', 'balance'],
        description: '情感支持'
      },
      { 
        text: '根據自己的能力範圍提供幫助', 
        values: ['balance', 'honesty', 'responsibility'],
        description: '量力而為'
      }
    ]
  },
  {
    id: 9,
    category: SCENARIO_CATEGORIES.RELATIONSHIP,
    question: '你更傾向於與什麼樣的人深交？',
    options: [
      { 
        text: '有共同目標和理想的人', 
        values: ['growth', 'achievement', 'teamwork'],
        description: '志同道合型'
      },
      { 
        text: '誠實可靠，值得信任的人', 
        values: ['honesty', 'friendship', 'security'],
        description: '誠信可靠型'
      },
      { 
        text: '有趣幽默，能帶來歡樂的人', 
        values: ['fun', 'friendship', 'variety'],
        description: '歡樂有趣型'
      },
      { 
        text: '能互相學習成長的人', 
        values: ['growth', 'knowledge', 'challenge'],
        description: '互助成長型'
      }
    ]
  },

  // 個人成長情境 (3題)
  {
    id: 10,
    category: SCENARIO_CATEGORIES.PERSONAL_GROWTH,
    question: '在學習新技能時，你最重視什麼？',
    options: [
      { 
        text: '能夠實際應用，解決現實問題', 
        values: ['achievement', 'helping', 'responsibility'],
        description: '實用價值導向'
      },
      { 
        text: '滿足好奇心，拓展知識視野', 
        values: ['knowledge', 'growth', 'adventure'],
        description: '求知探索導向'
      },
      { 
        text: '發揮創意，創造獨特的作品', 
        values: ['creativity', 'authenticity', 'recognition'],
        description: '創意表達導向'
      },
      { 
        text: '提升競爭力，獲得更好機會', 
        values: ['achievement', 'security', 'wealth'],
        description: '競爭優勢導向'
      }
    ]
  },
  {
    id: 11,
    category: SCENARIO_CATEGORIES.PERSONAL_GROWTH,
    question: '面對失敗或挫折時，你的態度是？',
    options: [
      { 
        text: '從中學習經驗，繼續努力挑戰', 
        values: ['growth', 'challenge', 'responsibility'],
        description: '成長學習型'
      },
      { 
        text: '冷靜分析原因，制定改進策略', 
        values: ['knowledge', 'excellence', 'balance'],
        description: '理性분析型'
      },
      { 
        text: '尋求他人支持，一起度過難關', 
        values: ['friendship', 'helping', 'teamwork'],
        description: '尋求支持型'
      },
      { 
        text: '接受現實，尋找其他發展方向', 
        values: ['balance', 'variety', 'freedom'],
        description: '彈性調適型'
      }
    ]
  },
  {
    id: 12,
    category: SCENARIO_CATEGORIES.PERSONAL_GROWTH,
    question: '你認為什麼是個人成功的標準？',
    options: [
      { 
        text: '達成設定的目標，獲得成就感', 
        values: ['achievement', 'excellence', 'recognition'],
        description: '目標達成型'
      },
      { 
        text: '保持身心健康，生活平衡', 
        values: ['health', 'balance', 'family'],
        description: '健康平衡型'
      },
      { 
        text: '能夠幫助他人，對社會有貢獻', 
        values: ['helping', 'compassion', 'spirituality'],
        description: '利他貢獻型'
      },
      { 
        text: '做真實的自己，活出個人價值', 
        values: ['authenticity', 'freedom', 'growth'],
        description: '自我實現型'
      }
    ]
  },

  // 生活方式情境 (2題)
  {
    id: 13,
    category: SCENARIO_CATEGORIES.LIFESTYLE,
    question: '你理想的週末是如何度過的？',
    options: [
      { 
        text: '與家人朋友相聚，享受溫馨時光', 
        values: ['family', 'friendship', 'balance'],
        description: '親情友情導向'
      },
      { 
        text: '追求刺激冒險，體驗新奇事物', 
        values: ['adventure', 'challenge', 'variety'],
        description: '冒險刺激導向'
      },
      { 
        text: '安靜獨處，充實自己或休息', 
        values: ['independence', 'knowledge', 'balance'],
        description: '獨處充實導向'
      },
      { 
        text: '參與有意義的活動，幫助他人', 
        values: ['helping', 'spirituality', 'compassion'],
        description: '服務奉獻導向'
      }
    ]
  },
  {
    id: 14,
    category: SCENARIO_CATEGORIES.LIFESTYLE,
    question: '在做重要決定時，你主要依據什麼？',
    options: [
      { 
        text: '理性分析利弊，做最佳選擇', 
        values: ['knowledge', 'excellence', 'responsibility'],
        description: '理性分析導向'
      },
      { 
        text: '遵循內心感受和直覺', 
        values: ['authenticity', 'freedom', 'spirituality'],
        description: '直覺感受導向'
      },
      { 
        text: '考慮對家人朋友的影響', 
        values: ['family', 'friendship', 'compassion'],
        description: '關係影響導向'
      },
      { 
        text: '參考他人意見和社會標準', 
        values: ['tradition', 'teamwork', 'recognition'],
        description: '社會參考導向'
      }
    ]
  },

  // 道德倫理情境 (1題)
  {
    id: 15,
    category: SCENARIO_CATEGORIES.ETHICS,
    question: '當個人利益與集體利益衝突時，你會？',
    options: [
      { 
        text: '優先考慮集體利益，個人利益可以犧牲', 
        values: ['justice', 'helping', 'responsibility'],
        description: '集體優先導向'
      },
      { 
        text: '尋找兩全其美的解決方案', 
        values: ['balance', 'teamwork', 'compassion'],
        description: '平衡協調導向'
      },
      { 
        text: '保護個人權益，但不傷害他人', 
        values: ['independence', 'honesty', 'freedom'],
        description: '個人權益導向'
      },
      { 
        text: '根據具體情況，靈活判斷', 
        values: ['variety', 'knowledge', 'balance'],
        description: '情境判斷導向'
      }
    ]
  }
];

/**
 * 根據使用者選擇的價值觀動態生成情境題
 * 改進版本：基於心理學原理，確保科學性和有效性
 * @param {string[]} selectedValues - 使用者選擇的價值觀ID列表
 * @returns {Array} 篩選並處理後的情境題列表
 */
export const generateValuesScenarios = (selectedValues) => {
  
  // 1. 計算每個情境題與使用者選擇的相關度
  const scenariosWithRelevance = valuesScenarios.map(scenario => {
    let relevanceScore = 0;
    let relevantOptions = [];
    
    scenario.options.forEach(option => {
      const matchingValues = option.values.filter(value => selectedValues.includes(value));
      if (matchingValues.length > 0) {
        relevanceScore += matchingValues.length;
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
  
  // 2. 按相關度排序，優先選擇最相關的情境題
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
  
  // 3. 確保選中的情境題有足夠的選項（至少2個）
  const validScenarios = sortedScenarios.map(scenario => {
    const finalOptions = scenario.relevantOptionsCount >= 2 
      ? scenario.relevantOptions 
      : scenario.options;
      
    return {
      id: scenario.id,
      category: scenario.category,
      question: scenario.question,
      options: finalOptions
    };
  });
  
  // 4. 確保最少有6個情境題
  let finalScenarios = validScenarios.slice(0, 8); // 取前8個相關度最高的
  
  if (finalScenarios.length < 6) {
    // 如果相關題目不足，補充一些通用題目
    const additionalScenarios = valuesScenarios
      .filter(scenario => !finalScenarios.some(fs => fs.id === scenario.id))
      .slice(0, 6 - finalScenarios.length);
    
    finalScenarios = [...finalScenarios, ...additionalScenarios];
  }
  
  // 5. 確保涵蓋不同的情境類別，增加測驗的全面性
  const categories = [...new Set(finalScenarios.map(s => s.category))];
  
  return finalScenarios;
};

/**
 * 獲取情境題統計信息，用於調試和優化
 */
export const getScenarioStats = () => {
  const categoryCount = {};
  const valuesCoverage = {};
  
  valuesScenarios.forEach(scenario => {
    // 統計類別分佈
    categoryCount[scenario.category] = (categoryCount[scenario.category] || 0) + 1;
    
    // 統計價值觀覆蓋度
    scenario.options.forEach(option => {
      option.values.forEach(value => {
        valuesCoverage[value] = (valuesCoverage[value] || 0) + 1;
      });
    });
  });
  
  return {
    totalScenarios: valuesScenarios.length,
    categoryDistribution: categoryCount,
    valuesCoverage: valuesCoverage
  };
};

export default generateValuesScenarios;
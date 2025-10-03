<template>
  <div class="space-y-6">
    <div class="text-center mt-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        發現你的興趣領域
      </h2>
      <p class="text-gray-600 mb-6">
        以下情境你最想投入哪些？選擇6個最吸引你的
      </p>
    </div>

    <div v-if="currentQuestion < questions.length" class="max-w-2xl mx-auto">
      <!-- 簡潔進度條 -->
      <div class="mb-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: ((currentQuestion + 1) / questions.length * 100) + '%' }"
          />
        </div>
        <p class="text-sm text-gray-500 mt-2 text-center">
          第 {{ currentQuestion + 1 }} 題，共 {{ questions.length }} 題
        </p>
      </div>

      <div class="text-center mb-6">
        <h3 class="text-lg font-medium text-gray-800 mb-4">
          {{ questions[currentQuestion].title }}
        </h3>
        <p class="text-gray-600">
          {{ questions[currentQuestion].description }}
        </p>
      </div>

      <div class="space-y-3">
        <button
          v-for="(option, index) in questions[currentQuestion].options"
          :key="index"
          @click="selectAnswer(option.value)"
          class="w-full text-left p-4 hover:bg-gray-50 hover:border-gray-300 bg-transparent border border-gray-200 rounded-lg transition-colors"
        >
          <div class="font-medium text-gray-800">
            {{ option.label }}
          </div>
          <div class="text-sm text-gray-600 mt-1">
            {{ option.description }}
          </div>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Emits
const emit = defineEmits<{
  complete: [results: any]
}>()

// 響應式數據
const currentQuestion = ref(0)
const answers = reactive<Record<string, number>>({
  technology: 0,
  art_design: 0,
  business: 0,
  engineering: 0,
  science: 0,
  healthcare: 0,
  education: 0,
  law: 0,
  hospitality: 0,
  writing: 0,
  social_work: 0,
  psychology: 0,
  media: 0,
  marketing: 0,
  sports: 0,
  food: 0
})

// 簡化版興趣探索問題 - 12題涵蓋16大興趣領域
const questions = [
  {
    title: "週末休息時，你通常會想做什麼？",
    description: "選擇最吸引你的活動",
    options: [
      {
        icon: "📱",
        label: "玩科技產品",
        description: "研究新手機、看開箱影片、試用APP",
        value: "technology"
      },
      {
        icon: "🎨",
        label: "做點創作",
        description: "畫畫、拍照、做設計、手工藝",
        value: "art_design"
      },
      {
        icon: "🏃",
        label: "運動健身",
        description: "跑步、健身、打球、戶外活動",
        value: "sports"
      },
      {
        icon: "📚",
        label: "閱讀寫作",
        description: "看書、寫文章、寫日記",
        value: "writing"
      }
    ]
  },
  {
    title: "在團體中，你通常扮演什麼角色？",
    description: "回想學校或工作中的團體經驗",
    options: [
      {
        icon: "👨‍🏫",
        label: "指導者",
        description: "喜歡教學、分享知識",
        value: "education"
      },
      {
        icon: "🤝",
        label: "協調者",
        description: "關心團隊和諧、解決人際問題",
        value: "social_work"
      },
      {
        icon: "💼",
        label: "領導者",
        description: "規劃策略、帶領團隊達成目標",
        value: "business"
      },
      {
        icon: "🔨",
        label: "執行者",
        description: "動手實作、解決技術問題",
        value: "engineering"
      }
    ]
  },
  {
    title: "你做什麼事情時會特別有成就感？",
    description: "回想讓你感到開心滿足的時刻",
    options: [
      {
        icon: "🔬",
        label: "發現新知識",
        description: "做實驗、研究數據、解開謎題",
        value: "science"
      },
      {
        icon: "🩺",
        label: "幫助別人健康",
        description: "照顧病患、給予健康建議",
        value: "healthcare"
      },
      {
        icon: "😊",
        label: "讓人開心滿意",
        description: "客人滿意、提供好服務、接待賓客",
        value: "hospitality"
      },
      {
        icon: "💡",
        label: "想出好點子",
        description: "企劃成功、行銷策略奏效",
        value: "marketing"
      }
    ]
  },
  {
    title: "你在什麼樣的地方會感覺最自在？",
    description: "想想你喜歡待的空間",
    options: [
      {
        icon: "⚖️",
        label: "莊嚴的法庭",
        description: "法院、律師事務所、正義相關場所",
        value: "law"
      },
      {
        icon: "🧠",
        label: "溫馨的諮商室",
        description: "心理診所、諮商中心、傾聽空間",
        value: "psychology"
      },
      {
        icon: "🍽️",
        label: "美食餐廳廚房",
        description: "餐廳、咖啡廳、烘焙坊",
        value: "food"
      },
      {
        icon: "📺",
        label: "創意工作室",
        description: "攝影棚、編輯室、媒體製作中心",
        value: "media"
      }
    ]
  },
  {
    title: "看到以下哪種新聞最會讓你想深入了解？",
    description: "憑直覺選擇最感興趣的話題",
    options: [
      {
        icon: "🤖",
        label: "AI新技術發布",
        description: "ChatGPT、自動駕駛等科技新聞",
        value: "technology"
      },
      {
        icon: "🎨",
        label: "文化藝術展覽",
        description: "設計展、藝術節、創作者故事",
        value: "art_design"
      },
      {
        icon: "⚖️",
        label: "法律社會議題",
        description: "司法判決、人權、社會正義",
        value: "law"
      },
      {
        icon: "🔬",
        label: "科學研究突破",
        description: "新發現、太空探索、環境科學",
        value: "science"
      }
    ]
  },
  {
    title: "如果有時間學點新東西，你會想學？",
    description: "選擇你覺得有趣的技能",
    options: [
      {
        icon: "📝",
        label: "寫作技巧",
        description: "文案撰寫、小說創作、部落格",
        value: "writing"
      },
      {
        icon: "🎬",
        label: "媒體製作",
        description: "拍影片、剪輯、podcas製作",
        value: "media"
      },
      {
        icon: "🏋️",
        label: "運動訓練",
        description: "健身教練、運動科學、體能訓練",
        value: "sports"
      },
      {
        icon: "🍳",
        label: "烹飪技術",
        description: "做菜、烘焙、調酒、料理創作",
        value: "food"
      }
    ]
  },
  {
    title: "朋友會怎麼形容你？",
    description: "想想你在朋友眼中的形象",
    options: [
      {
        icon: "🔧",
        label: "動手實作型",
        description: "會修東西、組裝、DIY改造",
        value: "engineering"
      },
      {
        icon: "💼",
        label: "商業頭腦",
        description: "會賺錢、會談判、有生意眼光",
        value: "business"
      },
      {
        icon: "📢",
        label: "行銷達人",
        description: "會宣傳、懂策劃、點子很多",
        value: "marketing"
      },
      {
        icon: "💫",
        label: "熱心服務",
        description: "喜歡招待朋友、提供協助、讓人開心",
        value: "hospitality"
      }
    ]
  },
  {
    title: "你比較喜歡看哪類型的內容？",
    description: "選擇最吸引你的類型",
    options: [
      {
        icon: "👨‍🏫",
        label: "教學知識",
        description: "線上課程、教學影片、知識分享",
        value: "education"
      },
      {
        icon: "🤝",
        label: "人文關懷",
        description: "社會議題、志工故事、公益活動",
        value: "social_work"
      },
      {
        icon: "🧠",
        label: "心理健康",
        description: "心理學、情緒管理、人際關係",
        value: "psychology"
      },
      {
        icon: "🩺",
        label: "醫療保健",
        description: "健康知識、疾病預防、醫療新知",
        value: "healthcare"
      }
    ]
  },
  {
    title: "如果要創業，你會選擇什麼領域？",
    description: "憑直覺選擇",
    options: [
      {
        icon: "💻",
        label: "科技新創",
        description: "開發APP、科技產品、軟體服務",
        value: "technology"
      },
      {
        icon: "🎨",
        label: "設計工作室",
        description: "平面設計、品牌設計、UI/UX",
        value: "art_design"
      },
      {
        icon: "✍️",
        label: "內容創作",
        description: "寫作、出版、文字工作",
        value: "writing"
      },
      {
        icon: "🔬",
        label: "研發實驗",
        description: "科學研究、產品開發、技術創新",
        value: "science"
      }
    ]
  },
  {
    title: "你希望未來的工作能帶來什麼？",
    description: "選擇最重要的",
    options: [
      {
        icon: "⚖️",
        label: "正義公平",
        description: "維護法律、保障權益、伸張正義",
        value: "law"
      },
      {
        icon: "🏗️",
        label: "實體成果",
        description: "建造、製作、看到具體產出",
        value: "engineering"
      },
      {
        icon: "📺",
        label: "傳播影響力",
        description: "創作內容、影響大眾、傳遞訊息",
        value: "media"
      },
      {
        icon: "🎯",
        label: "達成業績",
        description: "銷售成功、市場成長、品牌擴展",
        value: "marketing"
      }
    ]
  },
  {
    title: "你覺得自己最擅長什麼？",
    description: "選擇你的強項",
    options: [
      {
        icon: "🏃‍♂️",
        label: "體能活動",
        description: "運動、體能訓練、身體協調",
        value: "sports"
      },
      {
        icon: "🍴",
        label: "味覺美感",
        description: "品嚐美食、烹飪、調配味道",
        value: "food"
      },
      {
        icon: "😌",
        label: "同理傾聽",
        description: "理解他人、給予安慰、情緒支持",
        value: "psychology"
      },
      {
        icon: "☕",
        label: "貼心服務",
        description: "照顧客人、提供協助、細心待客",
        value: "hospitality"
      }
    ]
  }
]

// 選擇答案
const selectAnswer = (value: string) => {
  answers[value] += 1

  setTimeout(() => {
    if (currentQuestion.value < questions.length - 1) {
      currentQuestion.value++
    } else {
      // 最後一題完成後直接完成測驗
      completeQuiz()
    }
  }, 100)
}

// 興趣領域名稱對照表
const interestNames: Record<string, {name: string, description: string}> = {
  technology: { name: 'IT科技', description: '程式設計、軟體開發、人工智慧' },
  art_design: { name: '藝術設計', description: '繪畫、設計、創作藝術' },
  business: { name: '商業經營', description: '企業管理、創業、商務策略' },
  engineering: { name: '工程技術', description: '機械、電子、建築工程' },
  science: { name: '科學研究', description: '科學、研究、實驗探索' },
  healthcare: { name: '醫療健康', description: '醫療、護理、健康照護' },
  education: { name: '教育培訓', description: '教學、培訓、知識傳授' },
  law: { name: '法律政治', description: '法律、政治、公共事務' },
  hospitality: { name: '服務款待', description: '飯店、旅遊、接待服務' },
  writing: { name: '寫作出版', description: '寫作、編輯、出版傳媒' },
  social_work: { name: '社會服務', description: '社工、公益、社會福利' },
  psychology: { name: '心理諮商', description: '心理學、諮商、輔導治療' },
  media: { name: '媒體傳播', description: '新聞、廣告、影視製作' },
  marketing: { name: '行銷銷售', description: '市場行銷、銷售、客戶服務' },
  sports: { name: '體育運動', description: '運動、健身、競技訓練' },
  food: { name: '餐飲美食', description: '烹飪、餐飲服務、美食文化' }
}

// 完成測驗
const completeQuiz = () => {
  // 計算興趣偏好分數並排序
  const sortedInterests = Object.entries(answers)
    .sort(([,a], [,b]) => b - a)
    .map(([interest, score]) => ({
      id: interest,
      category: interest,
      name: interestNames[interest]?.name || interest,
      description: interestNames[interest]?.description || '',
      score,
      strength: score >= 2 ? 'high' : score === 1 ? 'medium' : 'low'
    }))

  const results = {
    interests: sortedInterests,
    topInterests: sortedInterests.slice(0, 5).map(item => item.category),
    rawScores: answers,
    completionTime: new Date().toISOString()
  }

  emit('complete', results)
}
</script>

<style scoped>
.interest-card {
  transition: all 0.2s ease;
}

.interest-card:hover {
  transform: translateY(-2px);
}
</style>
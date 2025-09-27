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
  creative: 0,
  business: 0,
  healthcare: 0,
  education: 0,
  social_service: 0,
  research: 0,
  manual_skills: 0
})

// 簡化版興趣探索問題 - 7題涵蓋8大興趣領域
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
        description: "畫畫、拍照、聽音樂、寫東西",
        value: "creative"
      },
      {
        icon: "🛍️",
        label: "逛街購物",
        description: "看商品比價、研究品牌、關注流行",
        value: "business"
      },
      {
        icon: "🏃",
        label: "運動健身",
        description: "跑步、健身、看健康資訊",
        value: "healthcare"
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
        description: "關心團隊和諧、解決衝突",
        value: "social_service"
      },
      {
        icon: "🔍",
        label: "分析者",
        description: "收集資料、深入研究問題",
        value: "research"
      },
      {
        icon: "🔨",
        label: "執行者",
        description: "動手實作、解決技術問題",
        value: "manual_skills"
      }
    ]
  },
  {
    title: "你做什麼事情時會特別有成就感？",
    description: "回想讓你感到開心滿足的時刻",
    options: [
      {
        icon: "🔧",
        label: "搞定技術問題",
        description: "修好電腦、解決軟體問題、組裝東西",
        value: "technology"
      },
      {
        icon: "🎉",
        label: "創作被喜歡",
        description: "拍的照片被按讚、畫作被稱讚",
        value: "creative"
      },
      {
        icon: "💰",
        label: "賺到錢或省錢",
        description: "找到便宜好物、賣東西賺錢",
        value: "business"
      },
      {
        icon: "🤗",
        label: "幫助別人",
        description: "朋友心情變好、家人身體健康",
        value: "healthcare"
      }
    ]
  },
  {
    title: "你在什麼樣的地方會感覺最自在？",
    description: "想想你喜歡待的空間",
    options: [
      {
        icon: "📚",
        label: "安靜的學習空間",
        description: "圖書館、書店、教室",
        value: "education"
      },
      {
        icon: "👥",
        label: "熱鬧的人群中",
        description: "咖啡廳、活動現場、志工聚會",
        value: "social_service"
      },
      {
        icon: "🧪",
        label: "整齊的實驗室",
        description: "科學館、研究室、博物館",
        value: "research"
      },
      {
        icon: "🔧",
        label: "動手做東西的地方",
        description: "工作坊、實作教室、維修店",
        value: "manual_skills"
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
        icon: "🎪",
        label: "文化藝術活動",
        description: "展覽、音樂節、創作者故事",
        value: "creative"
      },
      {
        icon: "💰",
        label: "經濟商業動態",
        description: "股市、新創、商業模式",
        value: "business"
      },
      {
        icon: "🩺",
        label: "醫療健康突破",
        description: "新藥研發、健康生活方式",
        value: "healthcare"
      }
    ]
  },
  {
    title: "如果有時間學點新東西，你會想學？",
    description: "選擇你覺得有趣的技能",
    options: [
      {
        icon: "🎤",
        label: "表達技巧",
        description: "上台說話、做簡報、拍影片",
        value: "education"
      },
      {
        icon: "😊",
        label: "人際相處",
        description: "聊天技巧、安慰朋友、社交禮儀",
        value: "social_service"
      },
      {
        icon: "🔍",
        label: "資料查找",
        description: "網路搜尋、整理資訊、分析數據",
        value: "research"
      },
      {
        icon: "🛠️",
        label: "修理東西",
        description: "手機維修、組裝電腦、DIY手作",
        value: "manual_skills"
      }
    ]
  },
  {
    title: "朋友會怎麼形容你？",
    description: "想想你在朋友眼中的形象",
    options: [
      {
        icon: "🤓",
        label: "科技達人",
        description: "對新產品很了解，常幫人解決3C問題",
        value: "technology"
      },
      {
        icon: "🎭",
        label: "有創意的人",
        description: "總有新點子，會拍照、畫畫或做手工",
        value: "creative"
      },
      {
        icon: "💼",
        label: "很會賺錢",
        description: "知道哪裡便宜，會做小生意或投資",
        value: "business"
      },
      {
        icon: "💫",
        label: "溫暖的人",
        description: "關心朋友，常做志工或幫助別人",
        value: "social_service"
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

// 完成測驗
const completeQuiz = () => {
  // 計算興趣偏好分數並排序
  const sortedInterests = Object.entries(answers)
    .sort(([,a], [,b]) => b - a)
    .map(([interest, score]) => ({
      category: interest,
      score,
      strength: score >= 2 ? 'high' : score === 1 ? 'medium' : 'low'
    }))

  const results = {
    interests: sortedInterests,
    topInterests: sortedInterests.slice(0, 3).map(item => item.category),
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
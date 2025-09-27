<template>
  <div class="space-y-6">
    <div class="text-center mt-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        價值觀與工作風格配對
      </h2>
      <p class="text-gray-600 mb-6">
        什麼樣的工作環境和價值觀最適合你？
      </p>
    </div>

    <div v-if="currentQuestion < questions.length" class="max-w-2xl mx-auto">
      <!-- 簡潔進度條 -->
      <div class="mb-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-purple-600 h-2 rounded-full transition-all duration-300"
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
          @click="selectAnswer(option.values, option.score)"
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
const valueScores = reactive<Record<string, number>>({
  achievement: 0,      // 成就導向
  autonomy: 0,         // 自主獨立
  security: 0,         // 穩定安全
  helping_others: 0,   // 助人服務
  creativity: 0,       // 創意表達
  work_life_balance: 0,// 工作生活平衡
  leadership: 0,       // 領導影響
  learning_growth: 0,  // 學習成長
  teamwork: 0,         // 團隊合作
  flexibility: 0       // 彈性自由
})

// 簡化版價值觀+工作風格測驗 - 8題涵蓋10個價值維度
const questions = [
  {
    title: "如果要找工作，什麼對你最重要？",
    description: "選擇你最在意的事情",
    options: [
      {
        icon: "🏆",
        label: "做出好成績",
        description: "能表現優異，獲得主管認可",
        values: ["achievement", "leadership"],
        score: [2, 1]
      },
      {
        icon: "🎨",
        label: "可以發揮創意",
        description: "有空間做自己想做的事",
        values: ["creativity", "autonomy"],
        score: [2, 1]
      },
      {
        icon: "🤝",
        label: "能幫助別人",
        description: "工作對他人有正面影響",
        values: ["helping_others", "teamwork"],
        score: [2, 1]
      },
      {
        icon: "📚",
        label: "能一直學習",
        description: "不斷學新東西、提升能力",
        values: ["learning_growth", "autonomy"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "你比較喜歡什麼樣的生活步調？",
    description: "想想你理想的日常安排",
    options: [
      {
        icon: "⚡",
        label: "忙碌有挑戰",
        description: "快節奏、有壓力但很有成就感",
        values: ["achievement", "leadership"],
        score: [2, 1]
      },
      {
        icon: "🧘",
        label: "規律可預測",
        description: "每天差不多，生活穩定",
        values: ["security", "work_life_balance"],
        score: [2, 1]
      },
      {
        icon: "🎪",
        label: "多變有趣",
        description: "每天都不一樣，充滿驚喜",
        values: ["flexibility", "creativity"],
        score: [2, 1]
      },
      {
        icon: "👥",
        label: "和朋友一起",
        description: "喜歡團體活動，一起做事",
        values: ["teamwork", "helping_others"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "你在什麼情況下做事效率最高？",
    description: "想想你什麼時候表現最好",
    options: [
      {
        icon: "🏠",
        label: "自己安排時間",
        description: "可以決定什麼時候做什麼",
        values: ["autonomy", "flexibility"],
        score: [2, 1]
      },
      {
        icon: "📋",
        label: "有清楚規則",
        description: "知道該怎麼做，有人指導",
        values: ["security", "teamwork"],
        score: [2, 1]
      },
      {
        icon: "💡",
        label: "可以嘗試新方法",
        description: "鼓勵創新想法的地方",
        values: ["creativity", "learning_growth"],
        score: [2, 1]
      },
      {
        icon: "👑",
        label: "可以做決定",
        description: "能影響結果、帶領別人",
        values: ["leadership", "achievement"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "你對未來生活的期待是什麼？",
    description: "想想你希望的生活方式",
    options: [
      {
        icon: "⚖️",
        label: "生活平衡",
        description: "工作穩定，有足夠休息時間",
        values: ["work_life_balance", "security"],
        score: [2, 1]
      },
      {
        icon: "🏆",
        label: "追求成功",
        description: "願意努力工作換取成就",
        values: ["achievement", "leadership"],
        score: [2, 1]
      },
      {
        icon: "🎯",
        label: "自由彈性",
        description: "時間安排很彈性，工作生活混在一起",
        values: ["flexibility", "autonomy"],
        score: [2, 1]
      },
      {
        icon: "💝",
        label: "有意義的人生",
        description: "做對社會有幫助的事，比賺錢重要",
        values: ["helping_others", "creativity"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "遇到壓力大的事情時，你會怎麼做？",
    description: "想想你處理壓力的方式",
    options: [
      {
        icon: "💪",
        label: "正面迎戰",
        description: "把壓力當動力，越挫越勇",
        values: ["achievement", "leadership"],
        score: [2, 1]
      },
      {
        icon: "🛡️",
        label: "尋求安全感",
        description: "希望降低風險，求穩定",
        values: ["security", "work_life_balance"],
        score: [2, 1]
      },
      {
        icon: "🔄",
        label: "彈性調整",
        description: "改變方法和節奏來適應",
        values: ["flexibility", "learning_growth"],
        score: [2, 1]
      },
      {
        icon: "🤗",
        label: "找朋友幫忙",
        description: "和朋友一起面對，分擔壓力",
        values: ["teamwork", "helping_others"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "什麼樣的回饋最讓你開心？",
    description: "想想什麼獎勵最能激勵你",
    options: [
      {
        icon: "🏅",
        label: "被公開稱讚",
        description: "在大家面前被認可表揚",
        values: ["achievement", "leadership"],
        score: [2, 1]
      },
      {
        icon: "💰",
        label: "實質獎勵",
        description: "穩定收入、好的福利待遇",
        values: ["security", "work_life_balance"],
        score: [2, 1]
      },
      {
        icon: "🎨",
        label: "更多自由",
        description: "可以做更多自己想做的事",
        values: ["creativity", "autonomy"],
        score: [2, 1]
      },
      {
        icon: "📚",
        label: "學習機會",
        description: "學新技能、承擔新挑戰",
        values: ["learning_growth", "flexibility"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "做重要決定時，你最在意什麼？",
    description: "想想你考慮的重點",
    options: [
      {
        icon: "📊",
        label: "結果效果",
        description: "分析數據，看哪個結果最好",
        values: ["achievement", "autonomy"],
        score: [2, 1]
      },
      {
        icon: "❤️",
        label: "別人感受",
        description: "考慮對朋友家人的影響",
        values: ["helping_others", "teamwork"],
        score: [2, 1]
      },
      {
        icon: "⚖️",
        label: "安全風險",
        description: "仔細評估會不會有風險",
        values: ["security", "work_life_balance"],
        score: [2, 1]
      },
      {
        icon: "🌟",
        label: "新的可能性",
        description: "探索沒人試過的新方法",
        values: ["creativity", "learning_growth"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "你希望別人怎麼看你這個人？",
    description: "想想你理想中的個人形象",
    options: [
      {
        icon: "👑",
        label: "很厲害的領導者",
        description: "能帶領大家創造好結果",
        values: ["leadership", "achievement"],
        score: [2, 1]
      },
      {
        icon: "🎨",
        label: "很有創意的人",
        description: "總是有新想法和創新點子",
        values: ["creativity", "flexibility"],
        score: [2, 1]
      },
      {
        icon: "🤝",
        label: "可以信賴的朋友",
        description: "值得信任，會幫助別人",
        values: ["helping_others", "teamwork"],
        score: [2, 1]
      },
      {
        icon: "📚",
        label: "一直在進步的人",
        description: "不斷學習，持續提升自己",
        values: ["learning_growth", "autonomy"],
        score: [2, 1]
      }
    ]
  }
]

// 選擇答案
const selectAnswer = (values: string[], scores: number[]) => {
  values.forEach((value, index) => {
    valueScores[value] += scores[index]
  })

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
  // 計算價值觀強度並排序
  const sortedValues = Object.entries(valueScores)
    .sort(([,a], [,b]) => b - a)
    .map(([value, score]) => ({
      value,
      score,
      strength: score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low'
    }))

  // 分析工作風格偏好
  const workstyleAnalysis = {
    independence: valueScores.autonomy + valueScores.flexibility,
    collaboration: valueScores.teamwork + valueScores.helping_others,
    stability: valueScores.security + valueScores.work_life_balance,
    growth: valueScores.learning_growth + valueScores.creativity
  }

  const results = {
    values: sortedValues,
    topValues: sortedValues.slice(0, 3).map(item => item.value),
    workstyle: workstyleAnalysis,
    rawScores: valueScores,
    completionTime: new Date().toISOString()
  }

  emit('complete', results)
}
</script>

<style scoped>
.value-card {
  transition: all 0.2s ease;
}

.value-card:hover {
  transform: translateY(-2px);
}
</style>
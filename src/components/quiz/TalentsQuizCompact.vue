<template>
  <div class="space-y-6">
    <div class="text-center mt-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        💎 發現你的天賦特質
      </h2>
      <p class="text-gray-600 mb-6">
        回想過去經驗，哪些能力是你天生擅長的？
      </p>
    </div>

    <div v-if="currentQuestion < questions.length" class="max-w-3xl mx-auto">
      <!-- 進度條 -->
      <div class="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          class="bg-green-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: ((currentQuestion + 1) / questions.length * 100) + '%' }"
        />
      </div>

      <div class="bg-white rounded-xl shadow-sm border p-8">
        <div class="mb-6">
          <div class="text-sm text-green-600 font-medium mb-2">
            第 {{ currentQuestion + 1 }} 題，共 {{ questions.length }} 題
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            {{ questions[currentQuestion].title }}
          </h3>
          <p class="text-gray-600 leading-relaxed">
            {{ questions[currentQuestion].description }}
          </p>
        </div>

        <div class="space-y-3">
          <button
            v-for="(option, index) in questions[currentQuestion].options"
            :key="index"
            @click="selectAnswer(option.talents, option.score)"
            class="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
          >
            <div class="flex items-start">
              <span class="text-2xl mr-4 flex-shrink-0">{{ option.icon }}</span>
              <div>
                <div class="font-medium text-gray-800 mb-2">
                  {{ option.label }}
                </div>
                <div class="text-sm text-gray-600 leading-relaxed">
                  {{ option.description }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- 完成頁面 -->
    <div v-else class="max-w-2xl mx-auto text-center">
      <div class="bg-white rounded-xl shadow-sm border p-8">
        <div class="text-6xl mb-4">💪</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          天賦分析完成！
        </h3>
        <p class="text-gray-600 mb-6">
          已識別你的核心天賦領域
        </p>
        <button
          @click="completeQuiz"
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          繼續下一階段
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
const talentScores = reactive<Record<string, number>>({
  analytical: 0,      // 分析思維
  creative: 0,        // 創意表達
  interpersonal: 0,   // 人際溝通
  leadership: 0,      // 領導統御
  detail_oriented: 0, // 細心執行
  technical: 0,       // 技術操作
  learning: 0,        // 快速學習
  problem_solving: 0  // 問題解決
})

// 簡化版天賦探索問題 - 7題涵蓋8個天賦維度
const questions = [
  {
    title: "朋友通常誇你什麼？",
    description: "想想別人對你的正面評價",
    options: [
      {
        icon: "🤔",
        label: "想得很清楚",
        description: "能分析問題、找重點",
        talents: ["analytical", "problem_solving"],
        score: [2, 1]
      },
      {
        icon: "💡",
        label: "點子很多",
        description: "常有新想法、很有創意",
        talents: ["creative", "problem_solving"],
        score: [2, 1]
      },
      {
        icon: "😊",
        label: "很會聊天",
        description: "表達清楚、容易相處",
        talents: ["interpersonal", "leadership"],
        score: [2, 1]
      },
      {
        icon: "👑",
        label: "很有領導力",
        description: "能帶頭、讓大家團結",
        talents: ["leadership", "interpersonal"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "遇到困難的事情，你會怎麼做？",
    description: "想想你面對挑戰的反應",
    options: [
      {
        icon: "📝",
        label: "先列計畫",
        description: "寫下步驟，一步步來",
        talents: ["detail_oriented", "analytical"],
        score: [2, 1]
      },
      {
        icon: "📚",
        label: "趕快學習",
        description: "上網查資料，邊學邊做",
        talents: ["learning", "problem_solving"],
        score: [2, 1]
      },
      {
        icon: "🔧",
        label: "直接動手",
        description: "先試試看，做中學",
        talents: ["technical", "problem_solving"],
        score: [2, 1]
      },
      {
        icon: "💭",
        label: "想別的方法",
        description: "換個角度思考",
        talents: ["creative", "analytical"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "跟朋友一起做事時，你通常負責什麼？",
    description: "想想你在團體中的角色",
    options: [
      {
        icon: "🤝",
        label: "當和事佬",
        description: "讓大家不吵架，氣氛和諧",
        talents: ["interpersonal", "leadership"],
        score: [2, 1]
      },
      {
        icon: "🎯",
        label: "決定方向",
        description: "想目標，安排怎麼做",
        talents: ["leadership", "analytical"],
        score: [2, 1]
      },
      {
        icon: "✅",
        label: "檢查細節",
        description: "確保沒漏掉、做得好",
        talents: ["detail_oriented", "technical"],
        score: [2, 1]
      },
      {
        icon: "💡",
        label: "提供點子",
        description: "想新方法，讓大家有靈感",
        talents: ["creative", "interpersonal"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "什麼事情會讓你覺得很有挑戰性但想試試？",
    description: "選擇讓你想挑戰的任務",
    options: [
      {
        icon: "📊",
        label: "分析數據",
        description: "從一堆資料中找出規律",
        talents: ["analytical", "detail_oriented"],
        score: [2, 1]
      },
      {
        icon: "🎨",
        label: "做創作",
        description: "設計東西、做作品",
        talents: ["creative", "technical"],
        score: [2, 1]
      },
      {
        icon: "👥",
        label: "認識新朋友",
        description: "建立關係、影響別人",
        talents: ["interpersonal", "leadership"],
        score: [2, 1]
      },
      {
        icon: "🚀",
        label: "學新東西",
        description: "快速掌握沒接觸過的領域",
        talents: ["learning", "problem_solving"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "你怎麼學東西比較快？",
    description: "想想你學習的方式",
    options: [
      {
        icon: "📚",
        label: "看書理解",
        description: "先懂原理再應用",
        talents: ["analytical", "learning"],
        score: [2, 1]
      },
      {
        icon: "🔧",
        label: "動手做做",
        description: "邊做邊學，實際操作",
        talents: ["technical", "problem_solving"],
        score: [2, 1]
      },
      {
        icon: "💬",
        label: "跟人討論",
        description: "和朋友聊天交流想法",
        talents: ["interpersonal", "learning"],
        score: [2, 1]
      },
      {
        icon: "📝",
        label: "做筆記整理",
        description: "有條理地記錄重點",
        talents: ["detail_oriented", "analytical"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "朋友有困難會找你幫什麼？",
    description: "想想你通常幫朋友做什麼",
    options: [
      {
        icon: "🔍",
        label: "分析狀況",
        description: "幫忙想清楚問題在哪",
        talents: ["analytical", "problem_solving"],
        score: [2, 1]
      },
      {
        icon: "🎨",
        label: "設計美化",
        description: "幫忙畫圖、修照片、想點子",
        talents: ["creative", "technical"],
        score: [2, 1]
      },
      {
        icon: "🤗",
        label: "聊天安慰",
        description: "聽煩惱、給建議、陪伴",
        talents: ["interpersonal", "leadership"],
        score: [2, 1]
      },
      {
        icon: "📋",
        label: "整理事情",
        description: "幫忙規劃、整理文件資料",
        talents: ["detail_oriented", "learning"],
        score: [2, 1]
      }
    ]
  },
  {
    title: "什麼時候你會覺得「太棒了！」？",
    description: "想想讓你最開心滿足的時刻",
    options: [
      {
        icon: "🎯",
        label: "解決困難",
        description: "想通了難題、找到答案",
        talents: ["problem_solving", "analytical"],
        score: [2, 1]
      },
      {
        icon: "✨",
        label: "做得很完美",
        description: "每個細節都處理得很好",
        talents: ["detail_oriented", "technical"],
        score: [2, 1]
      },
      {
        icon: "🎨",
        label: "創造新東西",
        description: "做出沒人想過的作品",
        talents: ["creative", "learning"],
        score: [2, 1]
      },
      {
        icon: "👥",
        label: "帶大家成功",
        description: "領導團隊達成目標",
        talents: ["leadership", "interpersonal"],
        score: [2, 1]
      }
    ]
  }
]

// 選擇答案
const selectAnswer = (talents: string[], scores: number[]) => {
  talents.forEach((talent, index) => {
    talentScores[talent] += scores[index]
  })

  setTimeout(() => {
    if (currentQuestion.value < questions.length - 1) {
      currentQuestion.value++
    } else {
      currentQuestion.value++
    }
  }, 100)
}

// 完成測驗
const completeQuiz = () => {
  // 計算天賦強度並排序
  const sortedTalents = Object.entries(talentScores)
    .sort(([,a], [,b]) => b - a)
    .map(([talent, score]) => ({
      talent,
      score,
      strength: score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low'
    }))

  const results = {
    talents: sortedTalents,
    topTalents: sortedTalents.slice(0, 3).map(item => item.talent),
    rawScores: talentScores,
    completionTime: new Date().toISOString()
  }

  emit('complete', results)
}
</script>

<style scoped>
.talent-card {
  transition: all 0.2s ease;
}

.talent-card:hover {
  transform: translateY(-2px);
}
</style>
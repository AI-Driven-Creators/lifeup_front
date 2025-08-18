<template>
  <!-- 重新測驗按鈕 - 固定在頁面右上角 -->
  <div class="absolute top-6 right-6 z-10">
    <button
      @click="$emit('reset')"
      class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-lg shadow-gray-200/50 flex items-center space-x-2 transition-colors"
    >
      <RotateCcw :size="16" />
      <span>重新測驗</span>
    </button>
  </div>

  <div class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16 space-y-8 md:space-y-16">
      <!-- Jobs風格標題 -->
      <div class="text-center">
        <h1 class="text-3xl font-semibold text-gray-800 mb-6 mt-20">
          你的天職分析報告
        </h1>
        <p class="text-lg text-gray-600">
          基於你的價值觀、興趣和天賦的綜合分析結果
        </p>
      </div>

      <!-- Personal Description -->
      <div class="bg-white border-blue-100 shadow-lg shadow-gray-200/50 rounded-2xl border lg:rounded-3xl lg:shadow-xl">
        <div class="p-6 md:p-8 lg:p-10 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-blue-900">你是誰？—— 個人特質分析</h2>
          <p class="text-sm text-blue-600">
            基於測驗結果為你描繪的個人畫像
          </p>
        </div>
        <div class="p-6 md:p-8 lg:p-10">
          <p class="text-gray-800 leading-relaxed text-base font-normal mb-8">
            {{ generatePersonalDescription() }}
          </p>
            
          <!-- 特質標籤 -->
          <div v-if="values.length > 0 && interests.length > 0 && talents?.topTalents" class="space-y-6">
              <div>
                <h4 class="text-sm font-medium text-gray-600 mb-2">核心標籤</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="value in values.slice(0, 2)" 
                    :key="value.id"
                    class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ value.name }}
                  </span>
                  <span 
                    v-for="interest in interests.slice(0, 2)" 
                    :key="interest.id"
                    class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ interest.name }}
                  </span>
                  <span 
                    v-for="talent in talents.topTalents.slice(0, 2)" 
                    :key="talent.name"
                    class="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ talent.name }}
                  </span>
                </div>
              </div>

            <!-- 能力特色 -->
            <div v-if="talents?.attributes">
              <h4 class="text-sm font-medium text-gray-600 mb-3">⚡ 你的能力特色</h4>
              <div class="grid grid-cols-3 gap-3">
                <div 
                  v-for="(attr, index) in topAttributes" 
                  :key="attr.name"
                  class="text-center p-3 rounded-xl"
                  :class="attr.color"
                >
                  <div class="text-xs font-normal">{{ getAttributeName(attr.name) }}</div>
                  <div class="text-sm font-medium mt-1">{{ attr.score }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Values Section -->
      <div class="bg-white rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-xl shadow-gray-200/50 border p-6 lg:p-8">
        <div class="mb-6">
          <div class="flex items-center space-x-3 mb-3">
            <Heart class="h-6 w-6 text-blue-600" />
            <h2 class="text-xl font-semibold text-gray-900">你的核心價值觀</h2>
          </div>
          <p class="text-gray-500 text-sm font-normal">
            這些是對你最重要的人生價值和原則
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="(value, index) in values && values.length > 0 ? values.slice(0, 5) : []"
            :key="value?.id || index"
            class="flex items-start space-x-3 p-3 bg-red-50 rounded-lg"
          >
            <div class="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-1">
              {{ index + 1 }}
            </div>
            <div>
              <h3 class="font-medium text-gray-800">{{ value.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ value.description }}</p>
            </div>
          </div>
          <div v-if="!values || values.length === 0" class="text-center py-4 text-gray-500">
            暫無價值觀測驗數據
          </div>
        </div>
      </div>

      <!-- Interests Section -->
      <div class="bg-white rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-xl shadow-gray-200/50 border p-6 lg:p-8">
        <div class="mb-6">
          <div class="flex items-center space-x-3 mb-3">
            <BookOpen class="h-6 w-6 text-emerald-600" />
            <h2 class="text-xl font-semibold text-gray-900">你的興趣領域</h2>
          </div>
          <p class="text-gray-500 text-sm font-normal">
            這些是你感興趣且願意投入時間的領域
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="(interest, index) in interests && interests.length > 0 ? interests.slice(0, 5) : []"
            :key="interest?.id || index"
            class="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
          >
            <div class="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-1">
              {{ index + 1 }}
            </div>
            <div>
              <h3 class="font-medium text-gray-800">{{ interest.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ interest.description }}</p>
            </div>
          </div>
          <div v-if="!interests || interests.length === 0" class="text-center py-4 text-gray-500">
            暫無興趣領域測驗數據
          </div>
        </div>
      </div>

      <!-- Talents Section -->
      <div v-if="talents && talents.topTalents && talents.topTalents.length > 0" class="space-y-12">
        <!-- 前五大天賦 -->
        <div class="bg-white rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-xl shadow-gray-200/50 border p-6 lg:p-8">
          <div class="mb-6">
            <div class="flex items-center space-x-3 mb-3">
              <Brain class="h-6 w-6 text-violet-600" />
              <h2 class="text-xl font-semibold text-gray-900">你的前五大天賦</h2>
            </div>
            <p class="text-gray-500 text-sm font-normal">基於蓋洛普天賦測驗的評估結果</p>
          </div>
          <div class="space-y-4">
            <div 
              v-for="(talent, index) in talents.topTalents" 
              :key="talent.name" 
              class="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg"
            >
              <div class="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm font-medium mt-1">
                {{ index + 1 }}
              </div>
              <div>
                <h3 class="font-medium text-gray-800">{{ talent.name }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ talent.description }}</p>
                <div class="text-xs text-purple-600 mt-1">分數: {{ talent.score }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 能力屬性分析 -->
        <div v-if="talents.attributes" class="bg-white rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-xl shadow-gray-200/50 border p-6 lg:p-8">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-3">能力屬性分析</h2>
            <p class="text-gray-500 text-sm font-normal">你在六大能力屬性上的表現分佈</p>
          </div>
          <div class="h-80">
            <Radar :data="radarChartData" :options="radarChartOptions" />
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3 mt-4 lg:mt-6">
            <div 
              v-for="attr in attributesData" 
              :key="attr.attribute"
              class="flex items-center lg:flex-col lg:text-center lg:bg-gray-50 lg:p-3 lg:rounded-xl w-36 lg:w-auto"
            >
              <span class="text-gray-700 text-sm font-medium lg:text-sm lg:mb-2">{{ attr.attribute }}</span>
              <span class="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg text-sm font-semibold ml-auto lg:ml-0 lg:bg-transparent lg:text-sm lg:font-medium lg:text-gray-900">{{ attr.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Work Style Analysis Card -->
      <div v-if="workstyle && (workstyle.personalProfile || workstyle.overallProfile || workstyle.workingStyleType)" class="bg-white border-slate-200 shadow-lg lg:shadow-xl shadow-gray-200/50 rounded-2xl lg:rounded-3xl">
        <div class="p-6 md:p-8 lg:p-10 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-slate-800">你的工作風格分析</h2>
          <p class="text-slate-600">
            {{ isScenarioWorkStyle ? '基於30個真實工作情境的行為偏好分析' : '深度分析你的認知模式、環境偏好與協作風格' }}
          </p>
        </div>
        <div class="p-6 md:p-8 lg:p-10">
          <div class="space-y-6">
          <!-- 情境式測驗結果 -->
          <div v-if="isScenarioWorkStyle" class="space-y-6">
            <!-- 工作風格類型 -->
            <div class="mb-10">
              <h3 class="text-base font-semibold text-gray-800 mb-6 flex items-center">
                <Briefcase class="h-5 w-5 mr-2 text-green-600" />
                你的工作風格類型
              </h3>
              <div class="text-center p-6">
                <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase class="h-8 w-8 text-blue-600" />
                </div>
                <h4 class="text-lg font-semibold text-gray-800 mb-2">
                  {{ workstyle.workingStyleType }}
                </h4>
                <p class="text-gray-600">
                  基於你在各種工作情境中的選擇傾向分析得出
                </p>
              </div>
            </div>

            <!-- 分隔線 -->
            <hr class="border-gray-200 my-12">
            
            <!-- 核心工作特質 -->
            <div v-if="workstyle.traitScores" class="mb-10">
              <h3 class="text-base font-semibold text-gray-800 mb-6 flex items-center">
                <Star class="h-5 w-5 mr-2 text-yellow-600" />
                核心工作特質
              </h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div 
                  v-for="([trait, score], index) in topWorkStyleTraits" 
                  :key="trait"
                  class="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div class="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-gray-600 font-bold text-sm">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800">{{ getTraitName(trait) }}</h4>
                    <div class="text-xs text-yellow-600">分數: {{ score }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分隔線 -->
            <hr class="border-gray-200 my-12">
            
            <!-- 維度分析 -->
            <div v-if="workstyle.dimensionScores" class="mb-10">
              <h3 class="text-base font-semibold text-gray-800 mb-6 flex items-center">
                <Brain class="h-5 w-5 mr-2 text-blue-600" />
                你是什麼樣的工作者？
              </h3>
              <p class="text-gray-600 mb-4 text-sm">
                根據你在30個工作情境中的選擇，我們發現你是這樣的人：
              </p>
              <div class="space-y-3">
                <div 
                  v-for="([dimension, data], index) in topDimensions" 
                  :key="dimension"
                  class="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0"
                >
                  <div class="text-2xl">{{ getDimensionIcon(data.name || dimension) }}</div>
                  <div class="flex-1">
                    <p class="text-gray-800 font-medium">
                      {{ getPersonalityDescription(data.name || dimension) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 原版測驗結果 -->
          <div v-else class="space-y-6">
            <!-- 整體工作風格概況 -->
            <div class="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-blue-100">
              <h3 class="text-base font-semibold text-gray-800 mb-6 flex items-center">
                <Brain class="h-5 w-5 mr-2 text-blue-600" />
                工作風格概況
              </h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">認知風格：</span>
                    <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                      {{ workstyle.overallProfile?.cognitiveStyle || '平衡型思維者' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">工作環境：</span>
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {{ workstyle.overallProfile?.workEnvironment || '適應性強' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">社交風格：</span>
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {{ workstyle.overallProfile?.socialStyle || '平衡型互動' }}
                    </span>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">協作偏好：</span>
                    <span class="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm">
                      {{ workstyle.overallProfile?.collaborationPreference || '靈活協作' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">回饋需求：</span>
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {{ workstyle.overallProfile?.feedbackNeed || '定期回饋' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">壓力應對：</span>
                    <span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                      {{ workstyle.overallProfile?.stressResponse || '穩定應對' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主要工作風格 -->
            <div v-if="workstyle.primaryStyles" class="bg-purple-50 rounded-lg p-6 border border-purple-100">
              <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center">
                <Zap class="h-5 w-5 mr-2 text-purple-600" />
                你的核心工作風格
              </h3>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="([style, strength], index) in workstyle.primaryStyles.slice(0, 6)" 
                  :key="style"
                  class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-purple-200"
                >
                  <div class="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-gray-600 font-bold text-sm">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800">{{ style }}</h4>
                    <div class="text-xs text-purple-600">強度: {{ strength }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 工作環境建議 -->
          <div v-if="workstyle.recommendations" class="bg-green-50 rounded-lg p-6 border border-green-100">
            <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center">
              <MessageSquare class="h-5 w-5 mr-2 text-green-600" />
              個人化工作建議
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div v-if="workstyle.recommendations.idealWorkEnvironment?.length > 0">
                <h4 class="font-medium text-green-700 mb-2">理想工作環境</h4>
                <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li v-for="env in workstyle.recommendations.idealWorkEnvironment" :key="env">{{ env }}</li>
                </ul>
              </div>
              <div v-if="workstyle.recommendations.collaborationTips?.length > 0">
                <h4 class="font-medium text-blue-700 mb-2">🤝 協作建議</h4>
                <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li v-for="tip in workstyle.recommendations.collaborationTips" :key="tip">{{ tip }}</li>
                </ul>
              </div>
              <div v-if="workstyle.recommendations.careerSuggestions?.length > 0">
                <h4 class="font-medium text-purple-700 mb-2">適合職業類型</h4>
                <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li v-for="career in workstyle.recommendations.careerSuggestions" :key="career">{{ career }}</li>
                </ul>
              </div>
              <div v-if="workstyle.recommendations.developmentAreas?.length > 0">
                <h4 class="font-medium text-orange-700 mb-2">📈 發展建議</h4>
                <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li v-for="area in workstyle.recommendations.developmentAreas" :key="area">{{ area }}</li>
                </ul>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <!-- Career Suggestions -->
      <div class="bg-white rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-xl shadow-gray-200/50 border p-6 lg:p-8">
        <div class="mb-8">
          <div class="flex items-center space-x-3 mb-4">
            <Target class="h-6 w-6 text-blue-500" />
            <h2 class="text-xl font-semibold text-gray-900">天職方向建議</h2>
          </div>
          <div class="text-gray-500 text-sm font-normal">
            <span class="text-sm font-semibold text-gray-700">天職 = 價值觀 ∩ 興趣 ∩ 天賦 ∩ 工作風格</span><br/>
            基於四維測驗結果的精準職業匹配分析
          </div>
        </div>

        <!-- 完美匹配 -->
        <div v-if="perfectMatches.length > 0" class="mb-8">
          <h3 class="text-base font-semibold text-gray-800 mb-6 flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            完美匹配：四維全交集的理想天職
          </h3>
          <div class="space-y-0">
            <div v-for="(career, index) in perfectMatches" :key="index">
              <div v-if="index > 0" class="border-t border-gray-300 mx-4 my-8"></div>
              <div class="border border-green-200 rounded-xl lg:rounded-2xl p-6 lg:p-8 bg-emerald-50 mb-8 lg:mb-12">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <Briefcase class="h-6 w-6 text-green-600" />
                    <div>
                      <h3 class="text-xl font-medium text-gray-900">{{ career.name }}</h3>
                      <p class="text-gray-500 mt-2 text-sm font-light">{{ career.description }}</p>
                    </div>
                  </div>
                  <div class="bg-green-100 text-green-800 text-sm font-medium px-4 py-1 rounded-full whitespace-nowrap">
                    匹配度 {{ career.matchPercentage }}%
                  </div>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <h4 class="font-medium text-gray-700 mb-3 flex items-center">
                      <TrendingUp class="h-4 w-4 mr-2" />
                      為什麼推薦這個職業給你？
                    </h4>
                    
                    <!-- 具體匹配分析 -->
                    <div class="bg-white rounded-xl lg:rounded-2xl p-5 lg:p-6 mb-4 lg:mb-6 border border-green-100 shadow-lg shadow-gray-200/50">
                      <h5 class="text-lg font-medium text-gray-900 mb-4">你與這個職業的完美交集</h5>
                      <div class="grid md:grid-cols-2 gap-4">
                        
                        <!-- 價值觀匹配詳情 -->
                        <div v-if="career.valueMatches > 0" class="bg-white/70 rounded-lg p-3">
                          <h6 class="text-base font-medium text-red-700 mb-2">價值觀契合 ({{ career.valueMatches }} 項)</h6>
                          <div class="text-sm text-gray-700">
                            <span 
                              v-for="value in getMatchedValues(career)" 
                              :key="value.id" 
                              class="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium mr-2 mb-2"
                            >
                              {{ value.name }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- 興趣匹配詳情 -->
                        <div v-if="career.interestMatches > 0" class="bg-white/70 rounded-lg p-3">
                          <h6 class="text-base font-medium text-green-700 mb-2">興趣吻合 ({{ career.interestMatches }} 項)</h6>
                          <div class="text-sm text-gray-700">
                            <span 
                              v-for="interest in getMatchedInterests(career)" 
                              :key="interest.id" 
                              class="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium mr-2 mb-2"
                            >
                              {{ interest.name }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- 天賦匹配詳情 -->
                        <div v-if="career.talentMatches > 0 && talents?.topTalents" class="bg-white/70 rounded-lg p-3">
                          <h6 class="text-base font-medium text-purple-700 mb-2">天賦優勢 ({{ career.talentMatches }} 項)</h6>
                          <div class="text-sm text-gray-700">
                            <span 
                              v-for="talentName in getMatchedTalents(career)" 
                              :key="talentName" 
                              class="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium mr-2 mb-2"
                            >
                              {{ talentName }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- 工作風格匹配詳情 -->
                        <div v-if="career.workStyleMatches > 0" class="bg-white/70 rounded-lg p-3">
                          <h6 class="text-base font-medium text-blue-700 mb-2">工作風格契合 ({{ career.workStyleMatches }} 項)</h6>
                          <div class="text-sm text-gray-700">
                            <span class="text-blue-600 font-medium">你的情境式測驗顯示與此職業高度契合</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 發展建議 -->
                    <div v-if="career.nextSteps?.length" class="bg-white rounded-xl lg:rounded-2xl p-5 lg:p-6 mb-4 lg:mb-6 border border-green-100 shadow-lg shadow-gray-200/50">
                      <h5 class="text-lg font-medium text-gray-900 mb-4">🚀 發展建議</h5>
                      <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li v-for="step in career.nextSteps" :key="step">{{ step }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 優秀匹配 -->
        <div v-if="excellentMatches.length > 0" class="mb-8">
          <h3 class="text-base font-semibold text-gray-800 mb-6 flex items-center">
            <div class="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
            優秀匹配：核心三維+工作風格的天職方向
          </h3>
          <div class="space-y-0">
            <div v-for="(career, index) in excellentMatches" :key="index">
              <div v-if="index > 0" class="border-t border-gray-300 mx-4 my-8"></div>
              <div class="border border-purple-200 rounded-xl lg:rounded-2xl p-6 lg:p-8 bg-violet-50 mb-8 lg:mb-12">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <Briefcase class="h-6 w-6 text-purple-600" />
                    <div>
                      <h3 class="text-xl font-medium text-gray-900">{{ career.name }}</h3>
                      <p class="text-gray-500 mt-2 text-sm font-light">{{ career.description }}</p>
                    </div>
                  </div>
                  <div class="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-1 rounded-full whitespace-nowrap">
                    匹配度 {{ career.matchPercentage }}%
                  </div>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <h4 class="font-medium text-gray-700 mb-3 flex items-center">
                      <TrendingUp class="h-4 w-4 mr-2" />
                      為什麼推薦這個職業給你？
                    </h4>
                    
                    <!-- 具體匹配分析 -->
                    <div class="bg-white rounded-xl p-5 mb-4 border border-purple-100 shadow-lg shadow-gray-200/50">
                      <h5 class="text-lg font-medium text-gray-900 mb-4">你與這個職業的交集</h5>
                      <div class="grid md:grid-cols-2 gap-4">
                        
                        <!-- 價值觀匹配詳情 -->
                        <div v-if="career.valueMatches > 0" class="bg-white/70 rounded-lg p-3">
                          <h6 class="text-base font-medium text-red-700 mb-2">價值觀契合 ({{ career.valueMatches }} 項)</h6>
                          <div class="text-sm text-gray-700">
                            <span 
                              v-for="value in getMatchedValues(career)" 
                              :key="value.id" 
                              class="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium mr-2 mb-2"
                            >
                              {{ value.name }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- 興趣匹配詳情 -->
                        <div v-if="career.interestMatches > 0" class="bg-white/70 rounded-lg p-3">
                          <h6 class="text-base font-medium text-green-700 mb-2">興趣吻合 ({{ career.interestMatches }} 項)</h6>
                          <div class="text-sm text-gray-700">
                            <span 
                              v-for="interest in getMatchedInterests(career)" 
                              :key="interest.id" 
                              class="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium mr-2 mb-2"
                            >
                              {{ interest.name }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- 天賦匹配詳情 -->
                        <div v-if="career.talentMatches > 0 && talents?.topTalents" class="bg-white/70 rounded-lg p-3">
                          <h6 class="text-base font-medium text-purple-700 mb-2">天賦優勢 ({{ career.talentMatches }} 項)</h6>
                          <div class="text-sm text-gray-700">
                            <span 
                              v-for="talentName in getMatchedTalents(career)" 
                              :key="talentName" 
                              class="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium mr-2 mb-2"
                            >
                              {{ talentName }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- 工作風格匹配詳情 -->
                        <div v-if="career.workStyleMatches > 0" class="bg-white/70 rounded-lg p-3">
                          <h6 class="text-base font-medium text-blue-700 mb-2">工作風格契合 ({{ career.workStyleMatches }} 項)</h6>
                          <div class="text-sm text-gray-700">
                            <span class="text-blue-600 font-medium">你的情境式測驗顯示與此職業高度契合</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 發展建議 -->
                    <div v-if="career.nextSteps?.length" class="bg-white rounded-xl p-5 mb-4 border border-purple-100 shadow-lg shadow-gray-200/50">
                      <h5 class="text-lg font-medium text-gray-900 mb-4">🚀 發展建議</h5>
                      <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li v-for="step in career.nextSteps" :key="step">{{ step }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 良好匹配 -->
        <div v-if="goodMatches.length > 0" class="mb-8">
          <h3 class="text-base font-semibold text-gray-800 mb-6 flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            潛力匹配：兩項交集的發展方向
          </h3>
          <div class="space-y-0">
            <div v-for="(career, index) in goodMatches" :key="index">
              <div v-if="index > 0" class="border-t border-gray-300 mx-4 my-8"></div>
              <div class="border border-blue-200 rounded-xl lg:rounded-2xl p-6 lg:p-8 bg-blue-50 mb-8 lg:mb-12">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <Briefcase class="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 class="text-xl font-medium text-gray-900">{{ career.name }}</h3>
                      <p class="text-gray-500 mt-2 text-sm font-light">{{ career.description }}</p>
                    </div>
                  </div>
                  <div class="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full whitespace-nowrap">
                    匹配度 {{ career.matchPercentage }}%
                  </div>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <h4 class="font-medium text-gray-700 mb-3 flex items-center">
                      <TrendingUp class="h-4 w-4 mr-2" />
                      為什麼值得考慮這個職業？
                    </h4>
                    
                    <!-- 具體匹配分析 -->
                    <div class="bg-white rounded-xl p-5 mb-4 border border-blue-100 shadow-lg shadow-gray-200/50">
                      <h5 class="text-lg font-medium text-gray-900 mb-4">你與這個職業的契合點</h5>
                      <div class="grid md:grid-cols-2 gap-4">
                        
                        <!-- 價值觀匹配詳情 -->
                        <div v-if="career.valueMatches > 0" class="bg-white/70 rounded-lg p-3">
                          <h6 class="text-base font-medium text-red-700 mb-2">價值觀契合 ({{ career.valueMatches }} 項)</h6>
                          <div class="text-sm text-gray-700">
                            <span 
                              v-for="value in getMatchedValues(career)" 
                              :key="value.id" 
                              class="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium mr-2 mb-2"
                            >
                              {{ value.name }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- 興趣匹配詳情 -->
                        <div v-if="career.interestMatches > 0" class="bg-white/70 rounded-lg p-3">
                          <h6 class="text-base font-medium text-green-700 mb-2">興趣吻合 ({{ career.interestMatches }} 項)</h6>
                          <div class="text-sm text-gray-700">
                            <span 
                              v-for="interest in getMatchedInterests(career)" 
                              :key="interest.id" 
                              class="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium mr-2 mb-2"
                            >
                              {{ interest.name }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- 天賦匹配詳情 -->
                        <div v-if="career.talentMatches > 0 && talents?.topTalents" class="bg-white/70 rounded-lg p-3">
                          <h6 class="text-base font-medium text-purple-700 mb-2">天賦優勢 ({{ career.talentMatches }} 項)</h6>
                          <div class="text-sm text-gray-700">
                            <span 
                              v-for="talentName in getMatchedTalents(career)" 
                              :key="talentName" 
                              class="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium mr-2 mb-2"
                            >
                              {{ talentName }}
                            </span>
                          </div>
                        </div>
                        
                        <!-- 工作風格匹配詳情 -->
                        <div v-if="career.workStyleMatches > 0">
                          <h6 class="text-base font-medium text-blue-700 mb-2">工作風格契合 ({{ career.workStyleMatches }} 項)</h6>
                          <div class="text-sm text-gray-600">
                            <span class="text-blue-600">你的工作風格測驗顯示有一定契合度</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 發展建議 -->
                    <div v-if="career.nextSteps?.length" class="bg-white rounded-xl p-5 mb-4 border border-blue-100 shadow-lg shadow-gray-200/50">
                      <h5 class="text-lg font-medium text-gray-900 mb-4">🚀 發展建議</h5>
                      <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li v-for="step in career.nextSteps" :key="step">{{ step }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 無結果 -->
        <div v-if="perfectMatches.length === 0 && excellentMatches.length === 0 && goodMatches.length === 0" class="text-center py-8">
          <div class="bg-white rounded-lg shadow-lg shadow-gray-200/50 border p-8">
            <Users class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-600 mb-2">需要更多數據來精準匹配</h3>
            <p class="text-gray-500 mb-4">
              你的特質組合很獨特！建議可以：
            </p>
            <div class="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto">
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• 嘗試重新進行測驗，提供更多資訊</li>
                <li>• 尋求專業職涯諮詢師的建議</li>
                <li>• 透過實習體驗不同工作領域</li>
                <li>• 考慮跨領域或新興職業發展</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 天職發展原則 -->
        <div class="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center">
            <Lightbulb class="h-5 w-5 mr-2" />
            天職發展的核心原則
          </h3>
          <ul class="text-sm text-gray-600 space-y-2">
            <li>• <strong>價值觀一致：</strong>工作內容要符合你的核心價值觀</li>
            <li>• <strong>興趣驅動：</strong>選擇你真正感興趣的領域，保持長期熱忱</li>
            <li>• <strong>天賦發揮：</strong>善用你的天然優勢，在擅長的領域發光</li>
            <li>• <strong>工作風格匹配：</strong>選擇適合你認知模式和環境偏好的工作方式</li>
            <li>• <strong>持續成長：</strong>在四維交集的基礎上不斷學習精進</li>
            <li>• <strong>保持開放：</strong>天職可能隨時間演變，保持探索的心態</li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Heart, 
  BookOpen, 
  Brain, 
  Target, 
  Lightbulb, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Star, 
  Settings, 
  Zap, 
  MessageSquare, 
  RotateCcw
} from 'lucide-vue-next'
import { Radar } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { CAREER_DATABASE, detailedCareerWorkStyleProfiles, scenarioStyleTraits } from '../../data/careerDatabase.js'

// Props
interface Props {
  results: {
    values?: any[]
    interests?: any[]
    talents?: {
      topTalents: any[]
      attributes: any
    }
    workstyle?: {
      primaryStyles?: any[]
      categoryResults?: any
      overallProfile?: any
      recommendations?: any
      reliabilityCheck?: any
      traitScores?: any
      dimensionScores?: any
      personalProfile?: any
      careerMatches?: any
      developmentSuggestions?: any
      responsePatterns?: any[]
      workingStyleType?: string
      reliability?: any
    }
  }
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  reset: []
}>()

// 註冊Chart.js組件
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// 響應式數據
const values = ref(props.results.values || [])
const interests = ref(props.results.interests || [])
const talents = ref(props.results.talents || null)
const workstyle = ref(props.results.workstyle || null)

// 職業匹配結果
const perfectMatches = ref<any[]>([])
const excellentMatches = ref<any[]>([])
const goodMatches = ref<any[]>([])

// 計算屬性
const isScenarioWorkStyle = computed(() => {
  return workstyle.value && workstyle.value.workingStyleType
})

const topAttributes = computed(() => {
  if (!talents.value?.attributes) return []
  
  const attributes = talents.value.attributes
  const sorted = Object.entries(attributes)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([name, score], index) => ({
      name,
      score,
      color: index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
    }))
  
  return sorted
})

const topWorkStyleTraits = computed(() => {
  if (!workstyle.value?.traitScores) return []
  
  return Object.entries(workstyle.value.traitScores)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 6)
})

// 能力屬性數據
const attributesData = computed(() => {
  if (!talents.value?.attributes) return []
  return [
    { attribute: '智力', value: talents.value.attributes.intellect || 0 },
    { attribute: '毅力', value: talents.value.attributes.diligence || 0 },
    { attribute: '創造力', value: talents.value.attributes.creativity || 0 },
    { attribute: '社交力', value: talents.value.attributes.social || 0 },
    { attribute: '專注力', value: talents.value.attributes.focus || 0 },
    { attribute: '適應力', value: talents.value.attributes.adaptability || 0 }
  ]
})

// 雷達圖數據配置
const radarChartData = computed(() => ({
  labels: attributesData.value.map(attr => attr.attribute),
  datasets: [
    {
      label: '能力值',
      data: attributesData.value.map(attr => attr.value),
      backgroundColor: 'rgba(139, 92, 246, 0.3)',
      borderColor: '#8b5cf6',
      borderWidth: 2,
      pointBackgroundColor: '#8b5cf6',
      pointBorderColor: '#8b5cf6'
    }
  ]
}))

// 雷達圖選項配置
const radarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20,
        font: {
          size: 12,
          weight: 'normal'
        },
        color: '#6b7280'
      },
      pointLabels: {
        font: {
          size: 14,
          weight: 'normal'
        },
        color: '#374151'
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.08)'
      },
      angleLines: {
        color: 'rgba(0, 0, 0, 0.08)'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      titleColor: 'white',
      bodyColor: 'white',
      titleFont: {
        size: 14,
        weight: '600'
      },
      bodyFont: {
        size: 13
      }
    }
  }
}

const topDimensions = computed(() => {
  if (!workstyle.value?.dimensionScores) return []
  
  return Object.entries(workstyle.value.dimensionScores)
    .filter(([, data]) => (data as any).score >= 60)
    .sort(([,a], [,b]) => ((b as any).score || 0) - ((a as any).score || 0))
    .slice(0, 5)
})

// 輔助函數
const generatePersonalDescription = () => {
  const getValueStyle = () => {
    if (values.value.length === 0) return "均衡發展型"
    
    const topValues = values.value.slice(0, 3).map(v => v.id)
    
    if (topValues.includes('achievement') || topValues.includes('recognition') || topValues.includes('excellence')) {
      return "成就導向型"
    } else if (topValues.includes('helping') || topValues.includes('family') || topValues.includes('friendship')) {
      return "關係導向型"
    } else if (topValues.includes('freedom') || topValues.includes('creativity') || topValues.includes('independence')) {
      return "自由創意型"
    } else if (topValues.includes('security') || topValues.includes('stability') || topValues.includes('tradition')) {
      return "穩定安全型"
    } else {
      return "多元平衡型"
    }
  }

  const getInterestStyle = () => {
    if (interests.value.length === 0) return "多元探索"
    
    const topInterests = interests.value.slice(0, 3).map(i => i.id)
    
    if (topInterests.includes('technology') || topInterests.includes('science') || topInterests.includes('engineering')) {
      return "科技理性"
    } else if (topInterests.includes('art_design') || topInterests.includes('music') || topInterests.includes('writing')) {
      return "藝術創作"
    } else if (topInterests.includes('business') || topInterests.includes('marketing') || topInterests.includes('finance')) {
      return "商業管理"
    } else if (topInterests.includes('education') || topInterests.includes('healthcare') || topInterests.includes('social_work')) {
      return "人文關懷"
    } else {
      return "多元探索"
    }
  }

  const getTalentStyle = () => {
    if (!talents.value?.topTalents?.length) return "多元學習"
    
    const topTalent = talents.value.topTalents[0].name
    if (topTalent.includes('分析') || topTalent.includes('思維')) {
      return "理性分析"
    } else if (topTalent.includes('溝通') || topTalent.includes('交往')) {
      return "人際互動"
    } else if (topTalent.includes('戰略') || topTalent.includes('前瞻')) {
      return "戰略規劃"
    } else if (topTalent.includes('理念') || topTalent.includes('學習')) {
      return "理念學習"
    } else {
      return "多元發展"
    }
  }

  const valueStyle = getValueStyle()
  const interestStyle = getInterestStyle()
  const talentStyle = getTalentStyle()

  return `你是一個${valueStyle}的人，在${interestStyle}領域展現出濃厚興趣，並具備${talentStyle}的特質。這樣的組合讓你在需要深度思考和持續成長的環境中能夠發揮最佳表現。你重視個人發展，善於在複雜情境中找到最適合的解決方案，是一個既有理想又務實的人。`
}

const getAttributeName = (attr: string) => {
  const attrNames: Record<string, string> = {
    'intellect': '邏輯分析',
    'creativity': '創意發想', 
    'social': '人際溝通',
    'focus': '專注執行',
    'diligence': '堅持毅力',
    'adaptability': '彈性適應'
  }
  return attrNames[attr] || attr
}

const getTraitName = (trait: string) => {
  const traitInfo = scenarioStyleTraits[trait as keyof typeof scenarioStyleTraits]
  return traitInfo ? traitInfo.name : trait
}

const getDimensionIcon = (dimensionName: string) => {
  const icons: Record<string, string> = {
    '認知風格': '🧠',
    '社交能量': '👥',
    '工作環境': '🏢',
    '協作模式': '🤝',
    '回饋需求': '📊',
    '壓力反應': '⚡',
    '決策風格': '🎯',
    '溝通偏好': '💬',
    '學習方式': '📚',
    '時間管理': '⏰'
  }
  return icons[dimensionName] || '💼'
}

const getPersonalityDescription = (dimensionName: string) => {
  const descriptions: Record<string, string> = {
    '認知風格': '你是個邏輯清晰的分析型思考者',
    '社交能量': '你從與人互動中獲得工作動力',
    '工作環境': '你喜歡有明確規範的工作環境',
    '協作模式': '你樂於承擔領導角色，善於協調團隊',
    '回饋需求': '你重視工作回饋，希望及時了解表現',
    '壓力反應': '你在有挑戰性的環境中表現更出色',
    '決策風格': '你習慣快速做決定，相信自己的判斷',
    '溝通偏好': '你善於直接溝通，表達清晰明確',
    '學習方式': '你透過實際操作學習得最快最好',
    '時間管理': '你有很強的時間觀念，善於在期限內完成任務'
  }
  return descriptions[dimensionName] || '你在這個維度上表現出獨特的特質'
}

// 職業匹配相關函數
const getMatchedValues = (career: any) => {
  return values.value.filter(value => career.matchValues?.includes(value.id) || false)
}

const getMatchedInterests = (career: any) => {
  return interests.value.filter(interest => career.matchInterests?.includes(interest.id) || false)
}

const getMatchedTalents = (career: any) => {
  if (!talents.value?.topTalents || !career.matchTalents) return []
  return career.matchTalents.filter((talentName: string) => 
    talents.value.topTalents?.some(talent => talent.name === talentName)
  )
}

// 職業匹配算法 - 基於主專案的完整邏輯
const generateCareerSuggestions = () => {
  // 防御性檢查，確保數據存在
  if (!values.value || !Array.isArray(values.value) || !interests.value || !Array.isArray(interests.value)) {
    return []
  }

  const topValues = values.value.slice(0, 5).map(v => v?.id).filter(Boolean)
  const topInterests = interests.value.slice(0, 5).map(i => i?.id).filter(Boolean)
  const topTalents = talents.value?.topTalents?.slice(0, 5).map(t => t?.name).filter(Boolean) || []
  
  // 檢查是否為情境式測驗
  const isScenarioWorkStyle = workstyle.value?.workingStyleType
  
  // 計算工作風格維度匹配的函數
  const calculateWorkStyleMatch = (careerKey: string, careerProfile: any) => {
    // 情境式測驗結果匹配邏輯
    if (isScenarioWorkStyle && workstyle.value.careerMatches) {
      const scenarioCareerMatch = workstyle.value.careerMatches.find((match: any) => 
        match.career === careerProfile.name || 
        match.career === careerKey ||
        careerProfile.name?.includes(match.career) ||
        match.career?.includes(careerProfile.name)
      )
      
      if (scenarioCareerMatch) {
        return scenarioCareerMatch.matchScore / 100 // 將百分比轉換為比率
      }
      
      // 如果沒有直接匹配，使用維度分析進行模糊匹配
      if (workstyle.value.dimensionScores && detailedCareerWorkStyleProfiles[careerKey as keyof typeof detailedCareerWorkStyleProfiles]) {
        const careerRequirements = detailedCareerWorkStyleProfiles[careerKey as keyof typeof detailedCareerWorkStyleProfiles]
        let totalScore = 0
        let dimensionCount = 0
        
        // 情境式測驗維度對應映射
        const scenarioDimensionMapping = {
          '認知風格': workstyle.value.dimensionScores['認知風格']?.score || 0,
          '工作環境': workstyle.value.dimensionScores['工作環境']?.score || 0,
          '社交能量': workstyle.value.dimensionScores['社交能量']?.score || 0,
          '協作模式': workstyle.value.dimensionScores['協作模式']?.score || 0,
          '回饋需求': workstyle.value.dimensionScores['回饋需求']?.score || 0,
          '壓力反應': workstyle.value.dimensionScores['壓力反應']?.score || 0
        }
        
        Object.entries(careerRequirements).forEach(([dimension]) => {
          if (scenarioDimensionMapping[dimension as keyof typeof scenarioDimensionMapping]) {
            totalScore += scenarioDimensionMapping[dimension as keyof typeof scenarioDimensionMapping]
            dimensionCount++
          }
        })
        
        return dimensionCount > 0 ? (totalScore / dimensionCount) / 100 : 0
      }
    }
    
    // 如果沒有職業檔案，回退到標籤匹配
    if (!detailedCareerWorkStyleProfiles[careerKey as keyof typeof detailedCareerWorkStyleProfiles]) {
      if (!careerProfile.matchWorkStyles) return 0
      
      if (workstyle.value?.workingStyleType && careerProfile.matchWorkStyles.includes(workstyle.value.workingStyleType)) {
        return 1
      }
      
      if (workstyle.value?.primaryStyles?.length) {
        const userStyles = workstyle.value.primaryStyles.map(([style]: [string]) => style)
        const matches = careerProfile.matchWorkStyles.filter((style: string) => userStyles.includes(style))
        return matches.length > 0 ? 1 : 0
      }
      
      return 0
    }
    
    // 維度匹配邏輯（原版測驗）
    const careerRequirements = detailedCareerWorkStyleProfiles[careerKey as keyof typeof detailedCareerWorkStyleProfiles]
    let totalDimensions = 0
    let matchedDimensions = 0
    
    if (workstyle.value?.categoryResults) {
      Object.entries(careerRequirements).forEach(([dimension, requirements]) => {
        totalDimensions++
        const userScore = workstyle.value.categoryResults[dimension] || 0
        
        // 根據職業需求判斷是否匹配
        if (Array.isArray(requirements)) {
          const hasMatch = requirements.some((req: string) => {
            // 簡化的匹配邏輯
            return userScore > 60 // 基本閾值
          })
          if (hasMatch) matchedDimensions++
        }
      })
    }
    
    return totalDimensions > 0 ? matchedDimensions / totalDimensions : 0
  }

  const careerMatches: Array<{
    career: string, 
    valueMatches: number,
    interestMatches: number,
    talentMatches: number,
    workStyleMatches: number,
    totalMatches: number,
    matchPercentage: number,
    matchType: 'perfect' | 'excellent' | 'good' | 'partial',
    reasons: string[]
  }> = []

  // 為每個職業計算四維交集匹配 (價值觀+興趣+天賦+工作風格)
  Object.entries(CAREER_DATABASE).forEach(([careerKey, career]) => {
    // 防御性檢查職業數據
    if (!career || !career.matchValues || !career.matchInterests || !career.matchTalents) {
      return
    }

    // 價值觀匹配數
    const valueMatches = career.matchValues.filter(v => topValues.includes(v)).length
    
    // 興趣領域匹配數
    const interestMatches = career.matchInterests.filter(i => topInterests.includes(i)).length
    
    // 天賦匹配數
    const talentMatches = career.matchTalents.filter(t => topTalents.includes(t)).length
    
    // 工作風格匹配 - 使用新的維度匹配邏輯
    const workStyleMatchRate = calculateWorkStyleMatch(careerKey, career)
    const workStyleMatches = Math.round(workStyleMatchRate * 5) // 轉換為匹配數量（最多5個）

    const totalMatches = valueMatches + interestMatches + talentMatches + workStyleMatches
    
    // 重新設計匹配度計算 - 基於四維匹配表現
    let matchPercentage = 0
    
    // 分別計算四個維度的匹配率
    const valueMatchRate = career.matchValues.length > 0 ? (valueMatches / career.matchValues.length) : 0
    const interestMatchRate = career.matchInterests.length > 0 ? (interestMatches / career.matchInterests.length) : 0
    const talentMatchRate = career.matchTalents.length > 0 ? (talentMatches / career.matchTalents.length) : 0
    // 工作風格匹配率已經從 calculateWorkStyleMatch 函數獲得
    
    // 計算有效維度數量
    let validDimensions = 0
    let totalMatchRate = 0
    
    if (valueMatches > 0) { totalMatchRate += valueMatchRate; validDimensions++ }
    if (interestMatches > 0) { totalMatchRate += interestMatchRate; validDimensions++ }
    if (talentMatches > 0) { totalMatchRate += talentMatchRate; validDimensions++ }
    if (workStyleMatchRate > 0) { totalMatchRate += workStyleMatchRate; validDimensions++ }
    
    // 根據匹配維度數量計算匹配度
    if (validDimensions >= 4) {
      // 四維全匹配：完美匹配，給予90-98%的超高分
      const avgMatchRate = totalMatchRate / validDimensions
      matchPercentage = Math.round(90 + (avgMatchRate * 8))
    } else if (validDimensions >= 3) {
      // 三維匹配：優秀匹配，給予80-89%的高分
      const avgMatchRate = totalMatchRate / validDimensions
      matchPercentage = Math.round(80 + (avgMatchRate * 9))
    } else if (validDimensions >= 2) {
      // 兩維匹配：良好匹配，給予60-79%的中高分
      const avgMatchRate = totalMatchRate / validDimensions
      matchPercentage = Math.round(60 + (avgMatchRate * 19))
    } else if (validDimensions >= 1) {
      // 單維匹配：部分匹配，給予40-59%的基礎分
      const avgMatchRate = totalMatchRate / validDimensions
      matchPercentage = Math.round(40 + (avgMatchRate * 19))
    }

    // 重新定義匹配類型判斷邏輯
    let matchType: 'perfect' | 'excellent' | 'good' | 'partial' = 'partial'
    
    if (validDimensions >= 4) {
      matchType = 'perfect' // 四維全匹配：完美天職
    } else if (validDimensions >= 3 && valueMatches > 0 && interestMatches > 0 && talentMatches > 0) {
      matchType = 'excellent' // 核心三維+工作風格：優秀匹配
    } else if (validDimensions >= 3) {
      matchType = 'excellent' // 三維匹配：優秀匹配
    } else if (validDimensions >= 2) {
      matchType = 'good' // 兩維匹配：良好匹配
    }

    // 只推薦至少有兩個維度匹配的職業
    if (matchType !== 'partial') {
      const reasons: string[] = []
      if (valueMatches > 0) {
        reasons.push(`與你的核心價值觀高度契合 (${valueMatches}項匹配)`)
      }
      if (interestMatches > 0) {
        reasons.push(`符合你的興趣領域 (${interestMatches}項匹配)`)
      }
      if (talentMatches > 0) {
        reasons.push(`能發揮你的天賦優勢 (${talentMatches}項匹配)`)
      }
      if (workStyleMatchRate > 0) {
        const matchLevel = workStyleMatchRate >= 0.9 ? '高度' : 
                         workStyleMatchRate >= 0.7 ? '中等' : '部分'
        reasons.push(`${matchLevel}符合你的工作風格偏好 (${Math.round(workStyleMatchRate * 100)}%契合)`)
      }

      careerMatches.push({
        career: careerKey,
        valueMatches,
        interestMatches,
        talentMatches,
        workStyleMatches,
        totalMatches,
        matchPercentage,
        matchType,
        reasons
      })
    }
  })

  // 根據匹配類型和分數排序
  return careerMatches
    .sort((a, b) => {
      const typeOrder = { 'perfect': 4, 'excellent': 3, 'good': 2, 'partial': 1 }
      const aOrder = typeOrder[a.matchType]
      const bOrder = typeOrder[b.matchType]
      
      if (aOrder !== bOrder) return bOrder - aOrder
      if (a.totalMatches !== b.totalMatches) return b.totalMatches - a.totalMatches
      return b.matchPercentage - a.matchPercentage
    })
    .slice(0, 6) // 增加到6個職業建議，因為現在有更精準的匹配
    .map(match => ({
      ...CAREER_DATABASE[match.career as keyof typeof CAREER_DATABASE],
      matchScore: match.totalMatches,
      matchPercentage: match.matchPercentage,
      valueMatches: match.valueMatches,
      interestMatches: match.interestMatches,
      talentMatches: match.talentMatches,
      workStyleMatches: match.workStyleMatches,
      matchType: match.matchType,
      reasons: match.reasons
    }))
}

const updateCareerSuggestions = () => {
  const suggestions = generateCareerSuggestions()
  
  perfectMatches.value = suggestions.filter(c => c.matchType === 'perfect')
  excellentMatches.value = suggestions.filter(c => c.matchType === 'excellent')
  goodMatches.value = suggestions.filter(c => c.matchType === 'good')
}

onMounted(() => {
  updateCareerSuggestions()
})
</script>

<style scoped>
.jobs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.jobs-button {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}

.jobs-button-secondary {
  @apply bg-white border border-gray-300 hover:bg-gray-50 text-gray-700;
}
</style>

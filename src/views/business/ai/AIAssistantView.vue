<script setup>
import { ref } from 'vue'
import { useAIStore } from '../../../stores/ai.store'
import { storeToRefs } from 'pinia'
import { Bot, RefreshCw, AlertCircle, TrendingUp, TrendingDown, Lightbulb, ChevronRight } from 'lucide-vue-next'

const aiStore = useAIStore()
const { loading, error, activeTab, restockResult, slowMovingResult, insightsResult } = storeToRefs(aiStore)

const tabs = [
  { key: 'restock', label: 'បំពេញស្តុក', icon: TrendingUp },
  { key: 'slow', label: 'លក់មិនសូវដាច់', icon: TrendingDown },
  { key: 'insights', label: 'ទិន្នន័យអាជីវកម្មស៊ីជម្រៅ', icon: Lightbulb },
]

function generate() {
  if (activeTab.value === 'restock') aiStore.getRestockRecommendations()
  else if (activeTab.value === 'slow') aiStore.getSlowMovingAnalysis()
  else aiStore.getBusinessInsights()
}

const urgencyClass = (u) => ({
  High: 'bg-red-100 text-red-700', Medium: 'bg-amber-100 text-amber-700', Low: 'bg-gray-100 text-gray-600'
})[u] ?? 'bg-gray-100 text-gray-600'
</script>

<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Bot class="w-6 h-6" /> ជំនួយការ AI
      </h1>
      <p class="text-sm text-gray-500 mt-0.5">ដំណើរការដោយ Gemini AI — វិភាគទិន្នន័យហាងរបស់អ្នក</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200">
      <button
        v-for="tab in tabs" :key="tab.key"
        @click="activeTab = tab.key"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px"
        :class="activeTab === tab.key ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>



    <div class="bg-white rounded-xl border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <p class="text-sm font-semibold text-gray-900">
          {{ tabs.find(t => t.key === activeTab)?.label }}
        </p>
        <button
          @click="generate"
          :disabled="loading"
          class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-60 transition-colors"
        >
          <RefreshCw class="w-4 h-4" :class="loading ? 'animate-spin' : ''" />
          {{ loading ? 'កំពុងវិភាគ...' : 'វិភាគឥឡូវនេះ' }}
        </button>
      </div>

      <!-- Error -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">{{ error }}</div>

      <!-- Restock results -->
      <div v-if="activeTab === 'restock'">
        <div v-if="!restockResult.length" class="text-center text-gray-400 py-10 text-sm">ចុច "វិភាគឥឡូវនេះ" ដើម្បីទទួលបានការណែនាំសម្រាប់ការបំពេញស្តុក</div>
        <div v-else class="space-y-3">
          <div v-for="item in restockResult" :key="item.productName" class="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900">{{ item.productName }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ item.reason }}</p>
            </div>
            <div class="flex items-center gap-3 ml-4 flex-shrink-0">
              <div class="text-right">
                <p class="text-xs text-gray-500">បច្ចុប្បន្ន</p>
                <p class="text-sm font-bold text-gray-900">{{ item.currentStock }}</p>
              </div>
              <ChevronRight class="w-4 h-4 text-gray-400" />
              <div class="text-right">
                <p class="text-xs text-gray-500">បញ្ជាទិញ</p>
                <p class="text-sm font-bold text-black">+{{ item.recommendedQty }}</p>
              </div>
              <span :class="urgencyClass(item.urgency)" class="px-2 py-0.5 text-xs font-semibold rounded-full">{{ item.urgency }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Slow Moving results -->
      <div v-if="activeTab === 'slow'">
        <div v-if="!slowMovingResult.length" class="text-center text-gray-400 py-10 text-sm">ចុច "វិភាគឥឡូវនេះ" ដើម្បីស្វែងរកផលិតផលដែលលក់មិនសូវដាច់</div>
        <div v-else class="space-y-3">
          <div v-for="item in slowMovingResult" :key="item.productName" class="p-4 border border-gray-100 rounded-xl">
            <div class="flex items-start justify-between mb-2">
              <p class="text-sm font-semibold text-gray-900">{{ item.productName }}</p>
              <span class="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">{{ item.action }}</span>
            </div>
            <p class="text-xs text-gray-500">{{ item.recommendation }}</p>
          </div>
        </div>
      </div>

      <!-- Business Insights -->
      <div v-if="activeTab === 'insights'">
        <div v-if="!insightsResult" class="text-center text-gray-400 py-10 text-sm">ចុច "វិភាគឥឡូវនេះ" ដើម្បីបង្កើតទិន្នន័យអាជីវកម្មស៊ីជម្រៅ</div>
        <div v-else class="prose prose-sm max-w-none">
          <div class="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{{ insightsResult }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

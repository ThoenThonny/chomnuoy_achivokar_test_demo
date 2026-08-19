<script setup>
import { useMarketingStore } from '../../../stores/marketing.store'
import { useProductStore } from '../../../stores/product.store'
import { storeToRefs } from 'pinia'
import { Megaphone, RefreshCw, Copy, CheckCircle, AlertCircle } from 'lucide-vue-next'
import { ref } from 'vue'

const marketingStore = useMarketingStore()
const productStore = useProductStore()
const { loading, error, selectedProduct, platform, language, tone, generatedContent } = storeToRefs(marketingStore)

const copied = ref(false)

function copyContent() {
  navigator.clipboard.writeText(generatedContent.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Megaphone class="w-5 h-5" /> ទីផ្សារ AI
      </h1>
      <p class="text-sm text-gray-500 mt-0.5">បង្កើតមាតិកាប្រព័ន្ធផ្សព្វផ្សាយសង្គមជាមួយ Gemini AI</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Config panel -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <p class="text-sm font-semibold text-gray-900">ការកំណត់មាតិកា</p>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">ផលិតផល</label>
          <select v-model="marketingStore.selectedProduct" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
            <option value="">ជ្រើសរើសផលិតផល...</option>
            <option v-for="p in productStore.products" :key="p.id" :value="p.name">{{ p.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">វេទិកា</label>
          <div class="flex gap-3">
            <label v-for="opt in ['Facebook', 'Telegram']" :key="opt" class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="marketingStore.platform" :value="opt" class="accent-black" />
              <span class="text-sm text-gray-700">{{ opt }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">ភាសា</label>
          <div class="flex gap-3">
            <label v-for="opt in ['Khmer', 'English']" :key="opt" class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="marketingStore.language" :value="opt" class="accent-black" />
              <span class="text-sm text-gray-700">{{ opt === 'Khmer' ? '🇰🇭 Khmer' : '🇬🇧 English' }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">សម្លេង</label>
          <div class="flex flex-wrap gap-2">
            <label v-for="opt in [{en:'Professional', km:'ផ្លូវការ'}, {en:'Friendly', km:'រាក់ទាក់'}, {en:'Promotional', km:'ផ្សព្វផ្សាយ'}]" :key="opt.en"
              class="flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer text-sm transition-colors"
              :class="marketingStore.tone === opt.en ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'"
            >
              <input type="radio" v-model="marketingStore.tone" :value="opt.en" class="hidden" />
              {{ opt.km }}
            </label>
          </div>
        </div>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          <AlertCircle class="w-3.5 h-3.5 inline mr-1" />{{ error }}
        </div>

        <button
          @click="marketingStore.generateContent()"
          :disabled="loading || !selectedProduct"
          class="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-60"
        >
          <RefreshCw class="w-4 h-4" :class="loading ? 'animate-spin' : ''" />
          {{ loading ? 'កំពុងបង្កើត...' : 'បង្កើតមាតិកា' }}
        </button>
      </div>

      <!-- Output panel -->
      <div class="bg-white rounded-xl border border-gray-100 p-6 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-semibold text-gray-900">មាតិកាដែលបានបង្កើត</p>
          <button
            v-if="generatedContent"
            @click="copyContent"
            class="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
          >
            <component :is="copied ? CheckCircle : Copy" class="w-3.5 h-3.5" :class="copied ? 'text-green-600' : ''" />
            {{ copied ? 'បានចម្លង!' : 'ចម្លង' }}
          </button>
        </div>

        <div class="flex-1 min-h-48">
          <div v-if="!generatedContent" class="h-full flex items-center justify-center text-sm text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
            មាតិកានឹងបង្ហាញនៅទីនេះបន្ទាប់ពីការបង្កើត
          </div>
          <div v-else class="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-line min-h-full">
            {{ generatedContent }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

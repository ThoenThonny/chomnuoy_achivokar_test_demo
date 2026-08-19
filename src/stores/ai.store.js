import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { geminiService } from '../services/gemini.service'
import { useProductStore } from './product.store'
import { useSaleStore } from './sale.store'

export const useAIStore = defineStore('ai', () => {
  const loading = ref(false)
  const error = ref(null)
  const activeTab = ref('restock')

  // Restock recommendations
  const restockResult = ref([])

  // Slow moving analysis
  const slowMovingResult = ref([])

  // Business insights
  const insightsResult = ref('')

  // Stock prediction
  const predictionResult = ref('')

  function buildContext() {
    const productStore = useProductStore()
    const saleStore = useSaleStore()

    const products = productStore.products.map(p => ({
      name: p.name,
      sku: p.sku,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold
    }))

    const last30Sales = saleStore.sales.slice(-100)
    const salesSummary = saleStore.bestSelling.slice(0, 10)

    return { products, salesSummary, last30Sales: last30Sales.length }
  }

  async function getRestockRecommendations() {
    loading.value = true
    error.value = null
    try {
      const ctx = buildContext()
      const prompt = `
You are an AI inventory assistant for a retail store.

Current inventory data:
${JSON.stringify(ctx.products, null, 2)}

Sales summary (top selling):
${JSON.stringify(ctx.salesSummary, null, 2)}

Based on this data, provide a restock recommendation for products that need restocking.
Return a JSON array only (no markdown, no explanation), format:
[
  {
    "productName": "...",
    "currentStock": 0,
    "recommendedQty": 0,
    "urgency": "High|Medium|Low",
    "reason": "... (write this reason in Khmer language)"
  }
]
Only include products that need restocking. IMPORTANT: The "urgency" must be exactly "High", "Medium", or "Low".`

      const raw = await geminiService.generate(prompt)
      // Extract JSON from response
      const jsonMatch = raw.match(/\[[\s\S]*\]/)
      restockResult.value = jsonMatch ? JSON.parse(jsonMatch[0]) : []
    } catch (e) {
      error.value = e.message
      restockResult.value = []
    } finally {
      loading.value = false
    }
  }

  async function getSlowMovingAnalysis() {
    loading.value = true
    error.value = null
    try {
      const ctx = buildContext()
      const prompt = `
You are a retail business analyst.

Product inventory:
${JSON.stringify(ctx.products, null, 2)}

Sales data (most sold products):
${JSON.stringify(ctx.salesSummary, null, 2)}

Identify products that are slow-moving (high stock, low sales).
Return a JSON array only, format:
[
  {
    "productName": "...",
    "currentStock": 0,
    "soldQty": 0,
    "recommendation": "... (write this recommendation in Khmer language)",
    "action": "... (short action word in Khmer)"
  }
]`

      const raw = await geminiService.generate(prompt)
      const jsonMatch = raw.match(/\[[\s\S]*\]/)
      slowMovingResult.value = jsonMatch ? JSON.parse(jsonMatch[0]) : []
    } catch (e) {
      error.value = e.message
      slowMovingResult.value = []
    } finally {
      loading.value = false
    }
  }

  async function getBusinessInsights() {
    loading.value = true
    error.value = null
    try {
      const ctx = buildContext()
      const saleStore = useSaleStore()
      const weeklyRevenue = saleStore.last7DaysSales.reduce((s, d) => s + d.revenue, 0)

      const prompt = `
You are a business consultant for a small retail store.

Key metrics:
- Total products: ${ctx.products.length}
- Total sales records: ${ctx.last30Sales}
- Weekly revenue: $${weeklyRevenue.toFixed(2)}
- Top products: ${ctx.salesSummary.map(p => p.productName).join(', ')}

Provide 3-5 actionable business insights in Khmer language. Be concise and practical. 
Each insight should start with an emoji and be 1-2 sentences.`

      insightsResult.value = await geminiService.generate(prompt)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    loading, error, activeTab,
    restockResult, slowMovingResult, insightsResult, predictionResult,
    getRestockRecommendations, getSlowMovingAnalysis, getBusinessInsights
  }
})

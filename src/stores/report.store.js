import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductStore } from './product.store'
import { useSaleStore } from './sale.store'

export const useReportStore = defineStore('report', () => {
  const saleStore = useSaleStore()
  const productStore = useProductStore()

  const dateFrom = ref('')
  const dateTo = ref('')
  const reportType = ref('sales')

  const filteredSalesForReport = computed(() => {
    if (!dateFrom.value && !dateTo.value) return saleStore.sales
    return saleStore.sales.filter(s => {
      const inFrom = !dateFrom.value || s.date >= dateFrom.value
      const inTo = !dateTo.value || s.date <= dateTo.value
      return inFrom && inTo
    })
  })

  const salesSummary = computed(() => {
    const data = filteredSalesForReport.value
    return {
      totalOrders: data.length,
      totalRevenue: data.reduce((s, x) => s + x.total, 0),
      totalItems: data.reduce((s, x) => s + x.items.reduce((a, i) => a + i.quantity, 0), 0),
      totalProfit: data.reduce((sum, sale) => {
        return sum + sale.items.reduce((p, item) => p + ((item.price - (item.cost || 0)) * item.quantity), 0) - sale.discount
      }, 0)
    }
  })

  const inventorySummary = computed(() => ({
    totalProducts: productStore.products.length,
    totalStock: productStore.totalStock,
    lowStock: productStore.lowStockProducts.length,
    outOfStock: productStore.outOfStockProducts.length,
    inventoryValue: productStore.inventoryValue
  }))

  const productPerformance = computed(() => {
    const data = filteredSalesForReport.value
    const map = {}
    data.forEach(sale => {
      sale.items.forEach(item => {
        if (!map[item.productId]) {
          const product = productStore.getById(item.productId)
          map[item.productId] = {
            name: item.productName,
            sold: 0,
            revenue: 0,
            profit: 0,
            stock: product?.stock ?? 0
          }
        }
        map[item.productId].sold += item.quantity
        map[item.productId].revenue += item.price * item.quantity
        map[item.productId].profit += (item.price - (item.cost || 0)) * item.quantity
      })
    })
    return Object.values(map).sort((a, b) => b.revenue - a.revenue)
  })

  return {
    dateFrom, dateTo, reportType,
    filteredSalesForReport, salesSummary, inventorySummary, productPerformance
  }
})

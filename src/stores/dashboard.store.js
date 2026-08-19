import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useProductStore } from './product.store'
import { useSaleStore } from './sale.store'

export const useDashboardStore = defineStore('dashboard', () => {
  const productStore = useProductStore()
  const saleStore = useSaleStore()

  const totalProducts = computed(() => productStore.products.length)
  const currentStock = computed(() => productStore.totalStock)
  const lowStockCount = computed(() => productStore.lowStockProducts.length)
  const outOfStockCount = computed(() => productStore.outOfStockProducts.length)
  const todayRevenue = computed(() => saleStore.todayRevenue)
  const todayProfit = computed(() => saleStore.todayProfit)
  const todayOrders = computed(() => saleStore.todaySales.length)
  const salesChartData = computed(() => saleStore.last7DaysSales)
  const lowStockItems = computed(() => productStore.lowStockProducts.slice(0, 5))
  const recentSales = computed(() => saleStore.filteredSales.slice(0, 5))

  return {
    totalProducts, currentStock, lowStockCount, outOfStockCount,
    todayRevenue, todayProfit, todayOrders,
    salesChartData, lowStockItems, recentSales
  }
})

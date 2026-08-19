import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../services/storage.service'
import { sales as mockSales } from '../mock/sales'
import { useInventoryStore } from './inventory.store'
import { useCartStore } from './cart.store'

export const useSaleStore = defineStore('sale', () => {
  const sales = ref(storage.get('sales', mockSales))
  const dateFilter = ref('')
  const statusFilter = ref('all')

  function save() { storage.set('sales', sales.value) }

  const today = computed(() => new Date().toISOString().split('T')[0])

  const todaySales = computed(() =>
    sales.value.filter(s => s.date === today.value)
  )

  const todayRevenue = computed(() =>
    todaySales.value.reduce((sum, s) => sum + s.total, 0)
  )

  const todayProfit = computed(() =>
    todaySales.value.reduce((sum, s) => {
      const profit = s.items.reduce((p, item) => {
        return p + ((item.price - (item.cost || 0)) * item.quantity)
      }, 0)
      return sum + profit - s.discount
    }, 0)
  )

  const filteredSales = computed(() => {
    return sales.value.filter(s => {
      const matchDate = !dateFilter.value || s.date === dateFilter.value
      const matchStatus = statusFilter.value === 'all' || s.status === statusFilter.value
      return matchDate && matchStatus
    }).sort((a, b) => b.id - a.id)
  })

  // Sales by day for the last 7 days
  const last7DaysSales = computed(() => {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const daySales = sales.value.filter(s => s.date === dateStr)
      result.push({
        date: dateStr,
        label: d.toLocaleDateString('en', { weekday: 'short' }),
        revenue: daySales.reduce((s, x) => s + x.total, 0),
        orders: daySales.length
      })
    }
    return result
  })

  const bestSelling = computed(() => {
    const map = {}
    sales.value.forEach(sale => {
      sale.items.forEach(item => {
        if (!map[item.productId]) {
          map[item.productId] = { productId: item.productId, productName: item.productName, qty: 0, revenue: 0 }
        }
        map[item.productId].qty += item.quantity
        map[item.productId].revenue += item.price * item.quantity
      })
    })
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 10)
  })

  function completeSale(cartItems, subtotal, discount, total, paymentMethod) {
    const inventoryStore = useInventoryStore()
    const dateStr = new Date().toISOString().split('T')[0]
    const saleId = Date.now()
    const invoiceNo = `INV-${dateStr.replace(/-/g, '')}-${String(sales.value.length + 1).padStart(3, '0')}`

    const newSale = {
      id: saleId,
      invoiceNo,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        cost: item.product.costPrice
      })),
      subtotal,
      discount,
      total,
      paymentMethod,
      date: dateStr,
      status: 'completed'
    }

    // Deduct stock for each item
    cartItems.forEach(item => {
      inventoryStore.saleDeduction({
        productId: item.product.id,
        quantity: item.quantity,
        date: dateStr
      })
    })

    sales.value.push(newSale)
    save()
    return newSale
  }

  return {
    sales, dateFilter, statusFilter,
    todaySales, todayRevenue, todayProfit,
    filteredSales, last7DaysSales, bestSelling,
    completeSale
  }
})

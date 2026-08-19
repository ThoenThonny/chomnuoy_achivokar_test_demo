import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../services/storage.service'
import { useProductStore } from './product.store'

export const useInventoryStore = defineStore('inventory', () => {
  const history = ref(storage.get('inventory_history', []))
  const typeFilter = ref('ALL')
  const dateFilter = ref('')

  const filteredHistory = computed(() => {
    return history.value.filter(h => {
      const matchType = typeFilter.value === 'ALL' || h.type === typeFilter.value
      const matchDate = !dateFilter.value || h.date === dateFilter.value
      return matchType && matchDate
    }).sort((a, b) => b.id - a.id)
  })

  function save() {
    storage.set('inventory_history', history.value)
  }

  function addLog(entry) {
    history.value.push({ id: Date.now(), ...entry })
    save()
  }

  // Stock In: Receive stock from supplier
  function stockIn({ productId, quantity, supplierId, cost, reason = 'Purchase', date }) {
    const productStore = useProductStore()
    const product = productStore.getById(productId)
    if (!product) return

    const beforeStock = product.stock
    productStore.adjustStock(productId, quantity)

    addLog({
      productId,
      productName: product.name,
      type: 'STOCK_IN',
      quantity,
      beforeStock,
      afterStock: beforeStock + quantity,
      supplierId,
      cost,
      reason,
      date: date || new Date().toISOString().split('T')[0]
    })
  }

  // Stock Out: Remove stock manually
  function stockOut({ productId, quantity, reason = 'Manual', date }) {
    const productStore = useProductStore()
    const product = productStore.getById(productId)
    if (!product) return

    const beforeStock = product.stock
    productStore.adjustStock(productId, -quantity)

    addLog({
      productId,
      productName: product.name,
      type: 'STOCK_OUT',
      quantity,
      beforeStock,
      afterStock: Math.max(0, beforeStock - quantity),
      reason,
      date: date || new Date().toISOString().split('T')[0]
    })
  }

  // Stock Adjustment: Correct discrepancy
  function adjustment({ productId, newStock, reason = 'Physical Count', date }) {
    const productStore = useProductStore()
    const product = productStore.getById(productId)
    if (!product) return

    const beforeStock = product.stock
    const diff = newStock - beforeStock
    productStore.adjustStock(productId, diff)

    addLog({
      productId,
      productName: product.name,
      type: 'ADJUSTMENT',
      quantity: Math.abs(diff),
      beforeStock,
      afterStock: newStock,
      reason,
      date: date || new Date().toISOString().split('T')[0]
    })
  }

  // Called by sale.store when completing a sale
  function saleDeduction({ productId, quantity, date }) {
    const productStore = useProductStore()
    const product = productStore.getById(productId)
    if (!product) return

    const beforeStock = product.stock
    productStore.adjustStock(productId, -quantity)

    addLog({
      productId,
      productName: product.name,
      type: 'SALE',
      quantity,
      beforeStock,
      afterStock: Math.max(0, beforeStock - quantity),
      reason: 'Sale',
      date: date || new Date().toISOString().split('T')[0]
    })
  }

  return {
    history, typeFilter, dateFilter, filteredHistory,
    stockIn, stockOut, adjustment, saleDeduction
  }
})

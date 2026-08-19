import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductStore } from './product.store'

export const useCartStore = defineStore('cart', () => {
  const items = ref([]) // { product, quantity, price, discount }
  const discount = ref(0)
  const paymentMethod = ref('cash')

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )

  const total = computed(() => Math.max(0, subtotal.value - discount.value))

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  function addItem(product, qty = 1) {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += qty
    } else {
      items.value.push({
        product,
        quantity: qty,
        price: product.sellingPrice
      })
    }
  }

  function removeItem(productId) {
    items.value = items.value.filter(i => i.product.id !== productId)
  }

  function updateQty(productId, qty) {
    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      item.quantity = Math.max(1, qty)
    }
  }

  function clearCart() {
    items.value = []
    discount.value = 0
    paymentMethod.value = 'cash'
  }

  return {
    items, discount, paymentMethod,
    subtotal, total, totalItems,
    addItem, removeItem, updateQty, clearCart
  }
})

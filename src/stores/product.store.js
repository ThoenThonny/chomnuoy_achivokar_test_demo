import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../services/storage.service'
import { products as mockProducts } from '../mock/products'

export const useProductStore = defineStore('product', () => {
  const products = ref(storage.get('products', mockProducts))
  const loading = ref(false)
  const search = ref('')
  const categoryFilter = ref(null)
  const statusFilter = ref('all')

  const filteredProducts = computed(() => {
    return products.value.filter(p => {
      const matchSearch = !search.value || 
        p.name.toLowerCase().includes(search.value.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.value.toLowerCase())
      const matchCat = !categoryFilter.value || p.categoryId === categoryFilter.value
      const matchStatus = statusFilter.value === 'all' || p.status === statusFilter.value
      return matchSearch && matchCat && matchStatus
    })
  })

  const lowStockProducts = computed(() =>
    products.value.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold)
  )

  const outOfStockProducts = computed(() =>
    products.value.filter(p => p.stock === 0)
  )

  const totalStock = computed(() =>
    products.value.reduce((sum, p) => sum + p.stock, 0)
  )

  const inventoryValue = computed(() =>
    products.value.reduce((sum, p) => sum + (p.costPrice * p.stock), 0)
  )

  function save() {
    storage.set('products', products.value)
  }

  function addProduct(data) {
    const newProduct = {
      id: Date.now(),
      status: 'active',
      image: null,
      ...data
    }
    products.value.push(newProduct)
    save()
    return newProduct
  }

  function updateProduct(id, data) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      products.value[idx] = { ...products.value[idx], ...data }
      save()
    }
  }

  function deleteProduct(id) {
    products.value = products.value.filter(p => p.id !== id)
    save()
  }

  function adjustStock(productId, quantity) {
    const idx = products.value.findIndex(p => p.id === productId)
    if (idx !== -1) {
      products.value[idx].stock += quantity
      if (products.value[idx].stock < 0) products.value[idx].stock = 0
      save()
    }
  }

  function getById(id) {
    return products.value.find(p => p.id === id)
  }

  return {
    products, loading, search, categoryFilter, statusFilter,
    filteredProducts, lowStockProducts, outOfStockProducts,
    totalStock, inventoryValue,
    addProduct, updateProduct, deleteProduct, adjustStock, getById
  }
})

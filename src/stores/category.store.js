import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../services/storage.service'
import { categories as mockCategories } from '../mock/categories'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref(storage.get('categories', mockCategories))
  const search = ref('')

  const filteredCategories = computed(() =>
    categories.value.filter(c =>
      c.name.toLowerCase().includes(search.value.toLowerCase())
    )
  )

  function save() {
    storage.set('categories', categories.value)
  }

  function addCategory(data) {
    const newCat = {
      id: Date.now(),
      productCount: 0,
      ...data
    }
    categories.value.push(newCat)
    save()
    return newCat
  }

  function updateCategory(id, data) {
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      categories.value[idx] = { ...categories.value[idx], ...data }
      save()
    }
  }

  function deleteCategory(id) {
    categories.value = categories.value.filter(c => c.id !== id)
    save()
  }

  function getCategoryById(id) {
    return categories.value.find(c => c.id === id)
  }

  return {
    categories, search, filteredCategories,
    addCategory, updateCategory, deleteCategory, getCategoryById
  }
})

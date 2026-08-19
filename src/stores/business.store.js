import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../services/storage.service'
import { businesses as mockBusinesses } from '../mock/businesses'

export const useBusinessStore = defineStore('business', () => {
  const businesses = ref(storage.get('businesses', mockBusinesses))
  const search = ref('')
  const planFilter = ref('All')
  const statusFilter = ref('All')

  const filteredBusinesses = computed(() => {
    return businesses.value.filter(b => {
      const matchSearch = !search.value ||
        b.name.toLowerCase().includes(search.value.toLowerCase()) ||
        b.owner.toLowerCase().includes(search.value.toLowerCase())
      const matchPlan = planFilter.value === 'All' || b.plan === planFilter.value
      const matchStatus = statusFilter.value === 'All' || b.status === statusFilter.value
      return matchSearch && matchPlan && matchStatus
    })
  })

  const stats = computed(() => ({
    total: businesses.value.length,
    active: businesses.value.filter(b => b.status === 'Active').length,
    pending: businesses.value.filter(b => b.status === 'Pending').length,
    inactive: businesses.value.filter(b => b.status === 'Inactive').length,
  }))

  function save() { storage.set('businesses', businesses.value) }

  function addBusiness(data) {
    const b = { id: Date.now(), status: 'Pending', products: 0, sales: 0, date: new Date().toISOString().split('T')[0], ...data }
    businesses.value.push(b)
    save()
  }

  function updateBusiness(id, data) {
    const idx = businesses.value.findIndex(b => b.id === id)
    if (idx !== -1) { businesses.value[idx] = { ...businesses.value[idx], ...data }; save() }
  }

  function toggleStatus(id) {
    const b = businesses.value.find(x => x.id === id)
    if (!b) return
    const map = { Active: 'Inactive', Inactive: 'Active', Pending: 'Active' }
    updateBusiness(id, { status: map[b.status] || 'Active' })
  }

  return {
    businesses, search, planFilter, statusFilter,
    filteredBusinesses, stats,
    addBusiness, updateBusiness, toggleStatus
  }
})

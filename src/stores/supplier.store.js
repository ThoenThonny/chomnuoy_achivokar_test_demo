import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage } from '../services/storage.service'
import { suppliers as mockSuppliers } from '../mock/suppliers'

export const useSupplierStore = defineStore('supplier', () => {
  const suppliers = ref(storage.get('suppliers', mockSuppliers))
  const purchases = ref(storage.get('purchases', []))
  const search = ref('')

  function save() {
    storage.set('suppliers', suppliers.value)
    storage.set('purchases', purchases.value)
  }

  function addSupplier(data) {
    const s = { id: Date.now(), status: 'Active', ...data }
    suppliers.value.push(s)
    save()
    return s
  }

  function updateSupplier(id, data) {
    const idx = suppliers.value.findIndex(s => s.id === id)
    if (idx !== -1) { suppliers.value[idx] = { ...suppliers.value[idx], ...data }; save() }
  }

  function deleteSupplier(id) {
    suppliers.value = suppliers.value.filter(s => s.id !== id)
    save()
  }

  function addPurchase(data) {
    const p = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...data }
    purchases.value.push(p)
    save()
    return p
  }

  function getById(id) {
    return suppliers.value.find(s => s.id === id)
  }

  return {
    suppliers, purchases, search,
    addSupplier, updateSupplier, deleteSupplier, addPurchase, getById
  }
})

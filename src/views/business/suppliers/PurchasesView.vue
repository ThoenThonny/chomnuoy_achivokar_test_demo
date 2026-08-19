<script setup>
import { ref } from 'vue'
import { useSupplierStore } from '../../../stores/supplier.store'
import { useProductStore } from '../../../stores/product.store'
import { useInventoryStore } from '../../../stores/inventory.store'
import { Plus, Save } from 'lucide-vue-next'

const supplierStore = useSupplierStore()
const productStore = useProductStore()
const inventoryStore = useInventoryStore()

const showForm = ref(false)
const form = ref({ supplierId: null, productId: null, quantity: 1, unitCost: 0, totalCost: 0, date: new Date().toISOString().split('T')[0], note: '' })

function handleSave() {
  if (!form.value.supplierId || !form.value.productId) return alert('តម្រូវឱ្យមានអ្នកផ្គត់ផ្គង់ និងផលិតផល')
  supplierStore.addPurchase({ ...form.value })
  // Auto stock-in
  inventoryStore.stockIn({ productId: Number(form.value.productId), quantity: Number(form.value.quantity), supplierId: Number(form.value.supplierId), cost: Number(form.value.unitCost), reason: 'ការទិញ', date: form.value.date })
  showForm.value = false
  form.value = { supplierId: null, productId: null, quantity: 1, unitCost: 0, totalCost: 0, date: new Date().toISOString().split('T')[0], note: '' }
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div><h1 class="text-xl font-bold text-gray-900">ការបញ្ជាទិញ</h1><p class="text-sm text-gray-500 mt-0.5">ការបញ្ជាទិញពីអ្នកផ្គត់ផ្គង់ (ស្តុកចូលដោយស្វ័យប្រវត្តិ)</p></div>
      <button @click="showForm = !showForm" class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900">
        <Plus class="w-4 h-4" />ការបញ្ជាទិញថ្មី
      </button>
    </div>

    <div v-if="showForm" class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 class="text-sm font-semibold">កត់ត្រាការបញ្ជាទិញ</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">អ្នកផ្គត់ផ្គង់ *</label>
          <select v-model="form.supplierId" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
            <option :value="null">ជ្រើសរើសអ្នកផ្គត់ផ្គង់</option>
            <option v-for="s in supplierStore.suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ផលិតផល *</label>
          <select v-model="form.productId" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
            <option :value="null">ជ្រើសរើសផលិតផល</option>
            <option v-for="p in productStore.products" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">បរិមាណ *</label>
          <input v-model.number="form.quantity" type="number" min="1" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">តម្លៃឯកតា ($)</label>
          <input v-model.number="form.unitCost" type="number" step="0.01" min="0" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">កាលបរិច្ឆេទ</label>
          <input v-model="form.date" type="date" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <button @click="showForm = false" class="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">បោះបង់</button>
        <button @click="handleSave" class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900">
          <Save class="w-4 h-4" />កត់ត្រាការបញ្ជាទិញ
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full data-table min-w-max">
          <thead><tr><th>កាលបរិច្ឆេទ</th><th>អ្នកផ្គត់ផ្គង់</th><th>ផលិតផល</th><th>ចំនួន</th><th>តម្លៃឯកតា</th></tr></thead>
          <tbody>
            <tr v-if="supplierStore.purchases.length === 0"><td colspan="5" class="text-center text-gray-400 py-8">មិនទាន់មានការបញ្ជាទិញទេ</td></tr>
            <tr v-for="p in supplierStore.purchases.slice().reverse()" :key="p.id">
              <td class="text-gray-500 text-xs">{{ p.date }}</td>
              <td>{{ supplierStore.getById(Number(p.supplierId))?.name ?? '—' }}</td>
              <td>{{ productStore.getById(Number(p.productId))?.name ?? '—' }}</td>
              <td class="font-bold">{{ p.quantity }}</td>
              <td>${{ p.unitCost?.toFixed(2) ?? '0.00' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

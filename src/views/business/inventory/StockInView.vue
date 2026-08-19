<script setup>
import { ref, computed } from 'vue'
import { useInventoryStore } from '../../../stores/inventory.store'
import { useProductStore } from '../../../stores/product.store'
import { useSupplierStore } from '../../../stores/supplier.store'
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowUpCircle } from 'lucide-vue-next'

const router = useRouter()
const inventoryStore = useInventoryStore()
const productStore = useProductStore()
const supplierStore = useSupplierStore()

const form = ref({
  productId: null,
  quantity: 1,
  supplierId: null,
  cost: 0,
  reason: 'ការទិញ',
  date: new Date().toISOString().split('T')[0]
})

const loading = ref(false)
const success = ref(false)

function handleSubmit() {
  if (!form.value.productId || !form.value.quantity) return alert('សូមជ្រើសរើសផលិតផល និងបរិមាណ')
  
  loading.value = true
  setTimeout(() => {
    inventoryStore.stockIn({
      productId: Number(form.value.productId),
      quantity: Number(form.value.quantity),
      supplierId: Number(form.value.supplierId),
      cost: Number(form.value.cost),
      reason: form.value.reason,
      date: form.value.date
    })
    loading.value = false
    success.value = true
    form.value = { productId: null, quantity: 1, supplierId: null, cost: 0, reason: 'ការទិញ', date: new Date().toISOString().split('T')[0] }
    setTimeout(() => success.value = false, 3000)
  }, 300)
}

const selectedProduct = computed(() => {
  return productStore.getById(Number(form.value.productId))
})
</script>



<template>
  <div class="w-full space-y-5">
    <div class="flex items-center gap-3">
      <button @click="router.back()" class="p-1.5 hover:bg-gray-100 rounded-lg">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-xl font-bold text-gray-900">ស្តុកចូល</h1>
        <p class="text-sm text-gray-500 mt-0.5">បន្ថែមស្តុកដែលទទួលបានពីអ្នកផ្គត់ផ្គង់</p>
      </div>
    </div>

    <!-- Success -->
    <div v-if="success" class="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
      <ArrowUpCircle class="w-4 h-4" />
      បានបន្ថែមស្តុកដោយជោគជ័យ!
    </div>

    <div class="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ផលិតផល *</label>
        <select v-model="form.productId" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
          <option :value="null">ជ្រើសរើសផលិតផល...</option>
          <option v-for="p in productStore.products" :key="p.id" :value="p.id">
            {{ p.name }} (បច្ចុប្បន្ន: {{ p.stock }} {{ p.unit }})
          </option>
        </select>
      </div>

      <!-- Current stock info -->
      <div v-if="selectedProduct" class="p-3 bg-gray-50 rounded-lg text-sm">
        <span class="text-gray-500">ស្តុកបច្ចុប្បន្ន: </span>
        <strong>{{ selectedProduct.stock }} {{ selectedProduct.unit }}</strong>
        <span class="text-gray-400 mx-2">→</span>
        <strong class="text-black">{{ selectedProduct.stock + Number(form.quantity) }} {{ selectedProduct.unit }}</strong>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">បរិមាណ *</label>
          <input v-model.number="form.quantity" type="number" min="1" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">តម្លៃឯកតា ($)</label>
          <input v-model.number="form.cost" type="number" step="0.01" min="0" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">អ្នកផ្គត់ផ្គង់</label>
        <select v-model="form.supplierId" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
          <option :value="null">ជ្រើសរើសអ្នកផ្គត់ផ្គង់</option>
          <option v-for="s in supplierStore.suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">មូលហេតុ</label>
          <select v-model="form.reason" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
            <option>ការទិញ</option>
            <option>ការបង្វិលសង</option>
            <option>ការផ្ទេរ</option>
            <option>ការកែសម្រួល</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">កាលបរិច្ឆេទ</label>
          <input v-model="form.date" type="date" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button @click="router.back()" class="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">បោះបង់</button>
        <button @click="handleSubmit" :disabled="loading" class="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-60">
          <ArrowUpCircle class="w-4 h-4" />
          {{ loading ? 'កំពុងបន្ថែម...' : 'បញ្ជាក់ស្តុកចូល' }}
        </button>
      </div>
    </div>
  </div>
</template>

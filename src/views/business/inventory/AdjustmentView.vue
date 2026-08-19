<script setup>
import { ref, computed } from 'vue'
import { useInventoryStore } from '../../../stores/inventory.store'
import { useProductStore } from '../../../stores/product.store'
import { useRouter } from 'vue-router'
import { ArrowLeft, Scale } from 'lucide-vue-next'

const router = useRouter()
const inventoryStore = useInventoryStore()
const productStore = useProductStore()

const form = ref({ productId: null, newStock: 0, reason: 'ការរាប់ជាក់ស្តែង', date: new Date().toISOString().split('T')[0] })
const loading = ref(false)
const success = ref(false)

const selectedProduct = computed(() => productStore.getById(Number(form.value.productId)))
const diff = computed(() => {
  if (!selectedProduct.value) return 0
  return Number(form.value.newStock) - selectedProduct.value.stock
})

function onProductSelect() {
  if (selectedProduct.value) form.value.newStock = selectedProduct.value.stock
}

function handleSubmit() {
  if (!form.value.productId) return alert('សូមជ្រើសរើសផលិតផល')
  loading.value = true
  setTimeout(() => {
    inventoryStore.adjustment({ productId: Number(form.value.productId), newStock: Number(form.value.newStock), reason: form.value.reason, date: form.value.date })
    loading.value = false
    success.value = true
    form.value = { productId: null, newStock: 0, reason: 'ការរាប់ជាក់ស្តែង', date: new Date().toISOString().split('T')[0] }
    setTimeout(() => success.value = false, 3000)
  }, 300)
}
</script>

<template>
  <div class="w-full space-y-5">
    <div class="flex items-center gap-3">
      <button @click="router.back()" class="p-1.5 hover:bg-gray-100 rounded-lg"><ArrowLeft class="w-5 h-5" /></button>
      <div>
        <h1 class="text-xl font-bold text-gray-900">ការកែសម្រួលស្តុក</h1>
        <p class="text-sm text-gray-500 mt-0.5">កែតម្រូវភាពខុសគ្នានៃស្តុក</p>
      </div>
    </div>
    <div v-if="success" class="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">បានកែសម្រួលដោយជោគជ័យ!</div>
    <div class="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ផលិតផល *</label>
        <select v-model="form.productId" @change="onProductSelect" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
          <option :value="null">ជ្រើសរើសផលិតផល...</option>
          <option v-for="p in productStore.products" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>
      <div v-if="selectedProduct" class="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">ស្តុកក្នុងប្រព័ន្ធ</span>
          <strong>{{ selectedProduct.stock }} {{ selectedProduct.unit }}</strong>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">ស្តុកថ្មី (ស្តុកជាក់ស្តែង)</span>
          <strong>{{ form.newStock }} {{ selectedProduct.unit }}</strong>
        </div>
        <div class="flex justify-between text-sm border-t border-gray-200 pt-2">
          <span class="text-gray-500">ការកែសម្រួល</span>
          <strong :class="diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-600'">
            {{ diff > 0 ? '+' : '' }}{{ diff }} {{ selectedProduct.unit }}
          </strong>
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ចំនួនស្តុកជាក់ស្តែង *</label>
        <input v-model.number="form.newStock" type="number" min="0" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">មូលហេតុ</label>
          <select v-model="form.reason" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
            <option>ការរាប់ជាក់ស្តែង</option><option>ខូចខាត</option><option>ការលួច</option><option>ហួសកំណត់</option><option>ផ្សេងៗ</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">កាលបរិច្ឆេទ</label>
          <input v-model="form.date" type="date" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
        </div>
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button @click="router.back()" class="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">បោះបង់</button>
        <button @click="handleSubmit" :disabled="loading" class="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-60">
          <Scale class="w-4 h-4" />{{ loading ? 'កំពុងអនុវត្ត...' : 'អនុវត្តការកែសម្រួល' }}
        </button>
      </div>
    </div>
  </div>
</template>

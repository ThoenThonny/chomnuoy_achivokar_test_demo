<script setup>
import { ref, computed } from 'vue'
import { useInventoryStore } from '../../../stores/inventory.store'
import { useProductStore } from '../../../stores/product.store'
import { useRouter } from 'vue-router'
import { ArrowLeft, ArrowDownCircle } from 'lucide-vue-next'

const router = useRouter()
const inventoryStore = useInventoryStore()
const productStore = useProductStore()

const form = ref({ productId: null, quantity: 1, reason: 'ដោយផ្ទាល់', date: new Date().toISOString().split('T')[0] })
const loading = ref(false)
const success = ref(false)

const selectedProduct = computed(() => productStore.getById(Number(form.value.productId)))

function handleSubmit() {
  if (!form.value.productId || !form.value.quantity) return alert('តម្រូវឱ្យមានផលិតផល និងបរិមាណ')
  if (selectedProduct.value && form.value.quantity > selectedProduct.value.stock) {
    return alert('ស្តុកមិនគ្រប់គ្រាន់ទេ!')
  }
  loading.value = true
  setTimeout(() => {
    inventoryStore.stockOut({ productId: Number(form.value.productId), quantity: Number(form.value.quantity), reason: form.value.reason, date: form.value.date })
    loading.value = false
    success.value = true
    form.value = { productId: null, quantity: 1, reason: 'ដោយផ្ទាល់', date: new Date().toISOString().split('T')[0] }
    setTimeout(() => success.value = false, 3000)
  }, 300)
}
</script>

<template>
  <div class="w-full space-y-5">
    <div class="flex items-center gap-3">
      <button @click="router.back()" class="p-1.5 hover:bg-gray-100 rounded-lg"><ArrowLeft class="w-5 h-5" /></button>
      <div>
        <h1 class="text-xl font-bold text-gray-900">ស្តុកចេញ</h1>
        <p class="text-sm text-gray-500 mt-0.5">ដកស្តុកចេញពីស្តុកសរុប</p>
      </div>
    </div>
    <div v-if="success" class="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">បានដកស្តុកចេញដោយជោគជ័យ!</div>
    <div class="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ផលិតផល *</label>
        <select v-model="form.productId" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
          <option :value="null">ជ្រើសរើសផលិតផល...</option>
          <option v-for="p in productStore.products.filter(x => x.stock > 0)" :key="p.id" :value="p.id">{{ p.name }} (មានក្នុងស្តុក {{ p.stock }})</option>
        </select>
      </div>
      <div v-if="selectedProduct" class="p-3 bg-gray-50 rounded-lg text-sm">
        <span class="text-gray-500">បន្ទាប់ពីដកចេញ: </span>
        <strong class="text-red-600">{{ Math.max(0, selectedProduct.stock - Number(form.quantity)) }} {{ selectedProduct.unit }}</strong>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">បរិមាណ *</label>
          <input v-model.number="form.quantity" type="number" min="1" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">កាលបរិច្ឆេទ</label>
          <input v-model="form.date" type="date" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">មូលហេតុ</label>
        <select v-model="form.reason" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
          <option>ដោយផ្ទាល់</option><option>ខូចខាត</option><option>ហួសកំណត់</option><option>ការបង្វិលសង</option><option>ការផ្ទេរ</option>
        </select>
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button @click="router.back()" class="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">បោះបង់</button>
        <button @click="handleSubmit" :disabled="loading" class="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-60">
          <ArrowDownCircle class="w-4 h-4" />{{ loading ? 'កំពុងដំណើរការ...' : 'បញ្ជាក់ស្តុកចេញ' }}
        </button>
      </div>
    </div>
  </div>
</template>

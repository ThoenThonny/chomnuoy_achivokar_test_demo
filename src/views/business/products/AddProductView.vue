<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductStore } from '../../../stores/product.store'
import { useCategoryStore } from '../../../stores/category.store'
import { useSupplierStore } from '../../../stores/supplier.store'
import { ArrowLeft, Save } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const supplierStore = useSupplierStore()

const isEdit = computed(() => !!route.params.id)
const title = computed(() => isEdit.value ? 'កែប្រែផលិតផល' : 'បន្ថែមផលិតផល')

const form = ref({
  name: '',
  sku: '',
  categoryId: null,
  supplierId: null,
  costPrice: 0,
  sellingPrice: 0,
  stock: 0,
  lowStockThreshold: 10,
  unit: 'unit',
  status: 'active'
})

onMounted(() => {
  if (isEdit.value) {
    const existing = productStore.getById(Number(route.params.id))
    if (existing) {
      Object.assign(form.value, existing)
    }
  }
})

function handleSave() {
  if (!form.value.name || !form.value.sku) {
    alert('តម្រូវឱ្យមានឈ្មោះ និងលេខកូដ SKU')
    return
  }

  if (isEdit.value) {
    productStore.updateProduct(Number(route.params.id), { ...form.value })
  } else {
    productStore.addProduct({ ...form.value })
  }

  router.push('/business/products')
}
</script>

<template>
  <div class="w-full space-y-5">
    <div class="flex items-center gap-3">
      <button @click="router.back()" class="p-1.5 hover:bg-gray-100 rounded-lg">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-xl font-bold text-gray-900">{{ title }}</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ isEdit ? 'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានផលិតផល' : 'បង្កើតផលិតផលថ្មី' }}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ឈ្មោះផលិតផល *</label>
          <input v-model="form.name" type="text" placeholder="ឧ. កូកាកូឡា" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">លេខកូដ SKU *</label>
          <input v-model="form.sku" type="text" placeholder="ឧ. CC-001" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ឯកតា</label>
          <input v-model="form.unit" type="text" placeholder="ឧ. ដប, កេស, គីឡូក្រាម" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ប្រភេទ</label>
          <select v-model="form.categoryId" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
            <option :value="null">ជ្រើសរើសប្រភេទ</option>
            <option v-for="c in categoryStore.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">អ្នកផ្គត់ផ្គង់</label>
          <select v-model="form.supplierId" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
            <option :value="null">ជ្រើសរើសអ្នកផ្គត់ផ្គង់</option>
            <option v-for="s in supplierStore.suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ថ្លៃដើម ($)</label>
          <input v-model.number="form.costPrice" type="number" step="0.01" min="0" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">តម្លៃលក់ ($)</label>
          <input v-model.number="form.sellingPrice" type="number" step="0.01" min="0" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ស្តុកដំបូង</label>
          <input v-model.number="form.stock" type="number" min="0" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">កម្រិតស្តុកជិតអស់</label>
          <input v-model.number="form.lowStockThreshold" type="number" min="0" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ស្ថានភាព</label>
          <select v-model="form.status" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
            <option value="active">សកម្ម</option>
            <option value="inactive">អសកម្ម</option>
          </select>
        </div>
      </div>

      <!-- Profit preview -->
      <div v-if="form.sellingPrice && form.costPrice" class="p-4 bg-gray-50 rounded-lg border border-gray-100">
        <p class="text-xs text-gray-500 mb-1">ការបង្ហាញប្រាក់ចំណេញប៉ាន់ស្មាន</p>
        <p class="text-lg font-bold text-gray-900">
          ${{ (form.sellingPrice - form.costPrice).toFixed(2) }}
          <span class="text-sm font-normal text-gray-500 ml-1">
            ({{ form.sellingPrice > 0 ? (((form.sellingPrice - form.costPrice) / form.sellingPrice) * 100).toFixed(1) : 0 }}%)
          </span>
        </p>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button @click="router.back()" class="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          បោះបង់
        </button>
        <button @click="handleSave" class="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
          <Save class="w-4 h-4" />
          {{ isEdit ? 'រក្សាទុកការផ្លាស់ប្តូរ' : 'បន្ថែមផលិតផល' }}
        </button>
      </div>
    </div>
  </div>
</template>

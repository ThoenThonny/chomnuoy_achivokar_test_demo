<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../../../stores/product.store'
import { useCategoryStore } from '../../../stores/category.store'
import { useSupplierStore } from '../../../stores/supplier.store'
import {
  Search, Plus, Edit2, Trash2, ArrowUpCircle, ArrowDownCircle, Filter, Eye
} from 'lucide-vue-next'

const router = useRouter()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const supplierStore = useSupplierStore()



function getCategoryName(id) {
  return categoryStore.getCategoryById(id)?.name ?? '—'
}

function getSupplierName(id) {
  return supplierStore.getById(id)?.name ?? '—'
}

function confirmDelete(id) {
  if (confirm('តើអ្នកចង់លុបផលិតផលនេះទេ? វាមិនអាចត្រឡប់វិញបានទេ។')) {
    productStore.deleteProduct(id)
  }
}

function getStatusClass(product) {
  if (product.stock === 0) return 'bg-red-100 text-red-700'
  if (product.stock <= product.lowStockThreshold) return 'bg-amber-100 text-amber-700'
  return 'bg-green-100 text-green-700'
}

function getStatusLabel(product) {
  if (product.stock === 0) return 'អស់ពីស្តុក'
  if (product.stock <= product.lowStockThreshold) return 'ស្តុកជិតអស់'
  return 'មានក្នុងស្តុក'
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">ផលិតផល</h1>
        <p class="text-sm text-gray-500 mt-0.5">គ្រប់គ្រងបញ្ជីផលិតផលរបស់អ្នក</p>
      </div>
      <button
        @click="router.push('/business/products/add')"
        class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
      >
        <Plus class="w-4 h-4" />
        បន្ថែមផលិតផល
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="productStore.search"
          type="text"
          placeholder="ស្វែងរកតាមឈ្មោះ ឬលេខកូដ SKU..."
          class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
        />
      </div>
      <select
        v-model="productStore.categoryFilter"
        class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
      >
        <option :value="null">ប្រភេទទាំងអស់</option>
        <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <select
        v-model="productStore.statusFilter"
        class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white"
      >
        <option value="all">ស្ថានភាពទាំងអស់</option>
        <option value="active">សកម្ម</option>
        <option value="inactive">អសកម្ម</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full data-table min-w-max">
          <thead>
            <tr>
              <th>ផលិតផល</th>
              <th>លេខកូដ SKU</th>
              <th>ប្រភេទ</th>
              <th>ថ្លៃដើម</th>
              <th>តម្លៃលក់</th>
              <th>ស្តុក</th>
              <th>ស្ថានភាព</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="productStore.filteredProducts.length === 0">
              <td colspan="8" class="text-center text-gray-400 py-8">រកមិនឃើញផលិតផលទេ</td>
            </tr>
            <tr v-for="p in productStore.filteredProducts" :key="p.id" class="group">
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                    {{ p.name.substring(0, 2).toUpperCase() }}
                  </div>
                  <span class="font-medium text-gray-900">{{ p.name }}</span>
                </div>
              </td>
              <td class="font-mono text-xs">{{ p.sku }}</td>
              <td>{{ getCategoryName(p.categoryId) }}</td>
              <td>${{ p.costPrice.toFixed(2) }}</td>
              <td class="font-semibold">${{ p.sellingPrice.toFixed(2) }}</td>
              <td>
                <span class="font-bold" :class="p.stock === 0 ? 'text-red-600' : p.stock <= p.lowStockThreshold ? 'text-amber-600' : 'text-gray-900'">
                  {{ p.stock }}
                </span>
                <span class="text-xs text-gray-400 ml-1">{{ p.unit }}</span>
              </td>
              <td>
                <span :class="getStatusClass(p)" class="px-2 py-0.5 text-xs font-semibold rounded-full">
                  {{ getStatusLabel(p) }}
                </span>
              </td>
              <td>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="router.push(`/business/products/${p.id}/edit`)" class="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-900">
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>
                  <button @click="confirmDelete(p.id)" class="p-1.5 hover:bg-red-50 rounded text-gray-500 hover:text-red-600">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                  <button @click="router.push('/business/inventory/stock-in')" class="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-900" title="Stock In">
                    <ArrowUpCircle class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
        {{ productStore.filteredProducts.length }} នៃ {{ productStore.products.length }} ផលិតផល
      </div>
    </div>
  </div>
</template>

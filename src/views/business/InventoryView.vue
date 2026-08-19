<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '../../stores/product.store'
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ArrowUpCircle,
  ArrowDownCircle,
  Filter
} from 'lucide-vue-next'

const productStore = useProductStore()
const { search: searchQuery, category: selectedCategory, filteredProducts: products, loading } = storeToRefs(productStore)

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">ការគ្រប់គ្រងស្តុក</h2>
        <p class="text-sm text-gray-500 mt-1">គ្រប់គ្រងផលិតផល កម្រិតស្តុក និងប្រភេទរបស់អ្នក។</p>
      </div>
      <div class="flex space-x-3">
        <button class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          នាំចេញ
        </button>
        <button class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
          <Plus class="w-4 h-4 mr-2" />
          បន្ថែមផលិតផល
        </button>
      </div>
    </div>

    <!-- Filters & Actions -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="ស្វែងរកផលិតផលតាមឈ្មោះ ឬលេខកូដ..." 
          class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        >
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <Filter class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select v-model="selectedCategory" class="appearance-none bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-8 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[140px]">
            <option value="All">ប្រភេទទាំងអស់</option>
            <option value="Beverages">ភេសជ្ជៈ</option>
            <option value="Grocery">គ្រឿងទេស</option>
            <option value="Dairy">ផលិតផលទឹកដោះគោ</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-max">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th class="py-4 px-6">ព័ត៌មានលម្អិតផលិតផល</th>
              <th class="py-4 px-6">ប្រភេទ</th>
              <th class="py-4 px-6">តម្លៃ</th>
              <th class="py-4 px-6">កម្រិតស្តុក</th>
              <th class="py-4 px-6">ស្ថានភាព</th>
              <th class="py-4 px-6 text-right">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            <tr v-if="loading">
              <td colspan="6" class="py-8 text-center text-gray-500">កំពុងទាញយកផលិតផល...</td>
            </tr>
            <tr v-else-if="products.length === 0">
              <td colspan="6" class="py-8 text-center text-gray-500">រកមិនឃើញផលិតផលទេ។</td>
            </tr>
            <tr v-else v-for="product in products" :key="product.id" class="hover:bg-blue-50/30 transition-colors group">
              <td class="py-4 px-6">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 mr-3 border border-gray-200">
                    <img v-if="product.image" :src="product.image" alt="" class="w-full h-full object-cover rounded-lg">
                    <span v-else class="font-bold text-xs">{{ product.name.substring(0, 2).toUpperCase() }}</span>
                  </div>
                  <div>
                    <div class="font-bold text-gray-900">{{ product.name }}</div>
                    <div class="text-xs text-gray-500">{{ product.id }}</div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 text-gray-600">{{ product.category }}</td>
              <td class="py-4 px-6 font-medium text-gray-900">${{ product.price.toFixed(2) }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center">
                  <span class="font-bold text-gray-900 mr-2">{{ product.stock }}</span>
                  <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="text-emerald-500 hover:text-emerald-600" title="ស្តុកចូល">
                      <ArrowUpCircle class="w-4 h-4" />
                    </button>
                    <button class="text-red-500 hover:text-red-600" title="ស្តុកចេញ">
                      <ArrowDownCircle class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <span :class="{
                  'text-emerald-700 bg-emerald-100 border-emerald-200': product.status === 'In Stock',
                  'text-amber-700 bg-amber-100 border-amber-200': product.status === 'Low Stock',
                  'text-red-700 bg-red-100 border-red-200': product.status === 'Out of Stock',
                }" class="px-2.5 py-1 text-xs font-bold rounded-full border">
                  {{ product.status === 'In Stock' ? 'មានក្នុងស្តុក' : product.status === 'Low Stock' ? 'ស្តុកជិតអស់' : 'អស់ពីស្តុក' }}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors" title="កែប្រែ">
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button class="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors" title="លុប">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
                <button class="p-2 text-gray-400 lg:hidden group-hover:hidden">
                  <MoreVertical class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
        <div>កំពុងបង្ហាញ 1 ដល់ 5 នៃ 452 ផលិតផល</div>
        <div class="flex space-x-1">
          <button class="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>មុន</button>
          <button class="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded shadow-sm">1</button>
          <button class="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50">2</button>
          <button class="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50">3</button>
          <button class="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50">បន្ទាប់</button>
        </div>
      </div>
    </div>
  </div>
</template>

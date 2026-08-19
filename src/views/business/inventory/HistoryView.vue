<script setup>
import { useInventoryStore } from '../../../stores/inventory.store'
import { storeToRefs } from 'pinia'

const inventoryStore = useInventoryStore()
const { filteredHistory, typeFilter, dateFilter } = storeToRefs(inventoryStore)

const typeBadge = (type) => {
  const map = {
    STOCK_IN: 'bg-green-100 text-green-700',
    STOCK_OUT: 'bg-amber-100 text-amber-700',
    ADJUSTMENT: 'bg-blue-100 text-blue-700',
    SALE: 'bg-gray-100 text-gray-700',
    RETURN: 'bg-purple-100 text-purple-700',
  }
  return map[type] ?? 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-xl font-bold text-gray-900">ប្រវត្តិនៃការផ្លាស់ប្តូរស្តុក</h1>
      <p class="text-sm text-gray-500 mt-0.5">រាល់ប្រតិបត្តិការ និងចលនាស្តុកទាំងអស់</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <select v-model="inventoryStore.typeFilter" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black bg-white">
        <option value="ALL">ប្រភេទទាំងអស់</option>
        <option value="STOCK_IN">ស្តុកចូល</option>
        <option value="STOCK_OUT">ស្តុកចេញ</option>
        <option value="ADJUSTMENT">ការកែសម្រួល</option>
        <option value="SALE">ការលក់</option>
      </select>
      <input v-model="inventoryStore.dateFilter" type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
      <button @click="inventoryStore.typeFilter = 'ALL'; inventoryStore.dateFilter = ''" class="px-3 py-2 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50">
        សម្អាត
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full data-table min-w-max">
          <thead>
            <tr>
              <th>កាលបរិច្ឆេទ</th>
              <th>ផលិតផល</th>
              <th>ប្រភេទ</th>
              <th>មុនពេល</th>
              <th>ចំនួន</th>
              <th>បន្ទាប់ពី</th>
              <th>មូលហេតុ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredHistory.length === 0">
              <td colspan="7" class="text-center text-gray-400 py-8">មិនទាន់មានប្រតិបត្តិការទេ</td>
            </tr>
            <tr v-for="h in filteredHistory" :key="h.id">
              <td class="text-gray-500 text-xs">{{ h.date }}</td>
              <td class="font-medium text-gray-900">{{ h.productName }}</td>
              <td>
                <span :class="typeBadge(h.type)" class="px-2 py-0.5 text-xs font-semibold rounded-full">{{ h.type }}</span>
              </td>
              <td class="text-gray-500">{{ h.beforeStock }}</td>
              <td class="font-medium" :class="['STOCK_IN'].includes(h.type) ? 'text-green-600' : 'text-red-600'">
                {{ ['STOCK_IN'].includes(h.type) ? '+' : '-' }}{{ h.quantity }}
              </td>
              <td class="font-bold text-gray-900">{{ h.afterStock }}</td>
              <td class="text-gray-500 text-xs">{{ h.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

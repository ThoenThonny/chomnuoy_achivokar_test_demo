<script setup>
import { useReportStore } from '../../../stores/report.store'
import { storeToRefs } from 'pinia'
const { inventorySummary } = storeToRefs(useReportStore())
</script>
<template>
  <div class="space-y-5">
    <div><h1 class="text-xl font-bold text-gray-900">របាយការណ៍ស្តុក</h1><p class="text-sm text-gray-500 mt-0.5">តម្លៃស្តុកបច្ចុប្បន្ន និងស្ថានភាព</p></div>
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-500 mb-2">ផលិតផលសរុប</p>
        <p class="text-2xl font-bold">{{ inventorySummary.totalProducts }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-500 mb-2">ស្តុកសរុប</p>
        <p class="text-2xl font-bold">{{ inventorySummary.totalStock.toLocaleString() }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-500 mb-2">តម្លៃស្តុកសរុប</p>
        <p class="text-2xl font-bold">${{ inventorySummary.inventoryValue.toFixed(2) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-500 mb-2">ស្តុកជិតអស់</p>
        <p class="text-2xl font-bold text-amber-600">{{ inventorySummary.lowStock }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-500 mb-2">អស់ពីស្តុក</p>
        <p class="text-2xl font-bold text-red-600">{{ inventorySummary.outOfStock }}</p>
      </div>
    </div>
  </div>
</template>

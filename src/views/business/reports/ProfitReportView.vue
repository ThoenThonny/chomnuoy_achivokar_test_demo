<script setup>
import { useReportStore } from '../../../stores/report.store'
import { storeToRefs } from 'pinia'
const { salesSummary } = storeToRefs(useReportStore())
</script>
<template>
  <div class="space-y-5">
    <div><h1 class="text-xl font-bold text-gray-900">របាយការណ៍ប្រាក់ចំណេញ</h1><p class="text-sm text-gray-500 mt-0.5">ការវិភាគចំណូលដកថ្លៃដើម</p></div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 p-5">
        <p class="text-xs text-gray-500 mb-2">ចំណូលសរុប</p>
        <p class="text-2xl font-bold">${{ salesSummary.totalRevenue.toFixed(2) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-5">
        <p class="text-xs text-gray-500 mb-2">ប្រាក់ចំណេញប៉ាន់ស្មាន</p>
        <p class="text-2xl font-bold text-black">${{ salesSummary.totalProfit.toFixed(2) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-5">
        <p class="text-xs text-gray-500 mb-2">អត្រាប្រាក់ចំណេញ</p>
        <p class="text-2xl font-bold">{{ salesSummary.totalRevenue > 0 ? ((salesSummary.totalProfit / salesSummary.totalRevenue) * 100).toFixed(1) : 0 }}%</p>
      </div>
    </div>
  </div>
</template>

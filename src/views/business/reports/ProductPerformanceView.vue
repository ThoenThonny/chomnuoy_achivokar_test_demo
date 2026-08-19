<script setup>
import { useReportStore } from '../../../stores/report.store'
import { storeToRefs } from 'pinia'
const { productPerformance } = storeToRefs(useReportStore())
</script>
<template>
  <div class="space-y-5">
    <div><h1 class="text-xl font-bold text-gray-900">ដំណើរការផលិតផល</h1><p class="text-sm text-gray-500 mt-0.5">ចំណូល និងប្រាក់ចំណេញក្នុងមួយផលិតផល</p></div>
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full data-table min-w-max">
          <thead><tr><th>ផលិតផល</th><th>ចំនួនលក់</th><th>ចំណូល</th><th>ប្រាក់ចំណេញ</th><th>ស្តុក</th></tr></thead>
          <tbody>
            <tr v-if="!productPerformance.length"><td colspan="5" class="text-center text-gray-400 py-8">មិនទាន់មានទិន្នន័យ</td></tr>
            <tr v-for="p in productPerformance" :key="p.name">
              <td class="font-medium text-gray-900">{{ p.name }}</td>
              <td class="font-bold">{{ p.sold }}</td>
              <td>${{ p.revenue.toFixed(2) }}</td>
              <td class="text-black font-semibold">${{ p.profit.toFixed(2) }}</td>
              <td class="text-gray-500">{{ p.stock }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

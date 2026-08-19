<script setup>
import { useReportStore } from '../../../stores/report.store'
import { storeToRefs } from 'pinia'

const report = useReportStore()
const { dateFrom, dateTo, salesSummary } = storeToRefs(report)
</script>
<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div><h1 class="text-xl font-bold text-gray-900">របាយការណ៍លក់</h1><p class="text-sm text-gray-500 mt-0.5">ការវិភាគចំណូល និងការបញ្ជាទិញ</p></div>
      <div class="flex gap-3 flex-wrap">
        <input v-model="report.dateFrom" type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
        <input v-model="report.dateTo" type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
        <button @click="report.dateFrom = ''; report.dateTo = ''" class="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">សម្អាត</button>
      </div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs font-medium text-gray-500 mb-2">ការបញ្ជាទិញសរុប</p>
        <p class="text-2xl font-bold text-gray-900">{{ salesSummary.totalOrders }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs font-medium text-gray-500 mb-2">ចំណូល</p>
        <p class="text-2xl font-bold text-gray-900">${{ salesSummary.totalRevenue.toFixed(2) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs font-medium text-gray-500 mb-2">ទំនិញដែលបានលក់</p>
        <p class="text-2xl font-bold text-gray-900">{{ salesSummary.totalItems }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs font-medium text-gray-500 mb-2">ប្រាក់ចំណេញប៉ាន់ស្មាន</p>
        <p class="text-2xl font-bold text-gray-900">${{ salesSummary.totalProfit.toFixed(2) }}</p>
      </div>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full data-table min-w-max">
          <thead><tr><th>វិក្កយបត្រ</th><th>ទំនិញ</th><th>សរុប</th><th>ការបង់ប្រាក់</th><th>កាលបរិច្ឆេទ</th></tr></thead>
          <tbody>
            <tr v-if="!report.filteredSalesForReport.length"><td colspan="5" class="text-center text-gray-400 py-8">មិនមានទិន្នន័យសម្រាប់រយៈពេលនេះទេ</td></tr>
            <tr v-for="s in report.filteredSalesForReport.slice().reverse()" :key="s.id">
              <td class="font-mono text-xs">{{ s.invoiceNo }}</td>
              <td>{{ s.items.reduce((a, i) => a + i.quantity, 0) }}</td>
              <td class="font-bold">${{ s.total.toFixed(2) }}</td>
              <td class="capitalize text-gray-600">{{ s.paymentMethod }}</td>
              <td class="text-gray-500 text-xs">{{ s.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

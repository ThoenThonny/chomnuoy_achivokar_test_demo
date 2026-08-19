<script setup>
import { useSaleStore } from '../../../stores/sale.store'
import { storeToRefs } from 'pinia'

const saleStore = useSaleStore()
const { filteredSales, dateFilter } = storeToRefs(saleStore)
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">ប្រវត្តិនៃការលក់</h1>
        <p class="text-sm text-gray-500 mt-0.5">ប្រតិបត្តិការដែលបានបញ្ចប់ទាំងអស់</p>
      </div>
      <router-link to="/business/sales/new" class="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
        + ការលក់ថ្មី
      </router-link>
    </div>
    <div class="flex gap-3">
      <input v-model="saleStore.dateFilter" type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black" />
      <button @click="saleStore.dateFilter = ''" class="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">សម្អាត</button>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full data-table min-w-max">
          <thead>
            <tr>
              <th>វិក្កយបត្រ</th>
              <th>ទំនិញ</th>
              <th>សរុបបឋម</th>
              <th>បញ្ចុះតម្លៃ</th>
              <th>សរុប</th>
              <th>ការបង់ប្រាក់</th>
              <th>កាលបរិច្ឆេទ</th>
              <th>ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredSales.length === 0">
              <td colspan="8" class="text-center text-gray-400 py-8">រកមិនឃើញការលក់ទេ</td>
            </tr>
            <tr v-for="sale in filteredSales" :key="sale.id">
              <td class="font-mono text-xs font-medium">{{ sale.invoiceNo }}</td>
              <td class="text-gray-600">{{ sale.items.reduce((s, i) => s + i.quantity, 0) }} ឯកតា</td>
              <td>${{ sale.subtotal.toFixed(2) }}</td>
              <td class="text-gray-500">{{ sale.discount > 0 ? `$${sale.discount.toFixed(2)}` : '—' }}</td>
              <td class="font-bold">${{ sale.total.toFixed(2) }}</td>
              <td class="capitalize text-gray-600">{{ sale.paymentMethod }}</td>
              <td class="text-gray-500 text-xs">{{ sale.date }}</td>
              <td><span class="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">បានបញ្ចប់</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">{{ filteredSales.length }} ការលក់</div>
    </div>
  </div>
</template>

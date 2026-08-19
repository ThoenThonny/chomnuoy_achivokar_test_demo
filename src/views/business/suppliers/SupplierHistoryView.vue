<script setup>
import { useSupplierStore } from '../../../stores/supplier.store'
import { useInventoryStore } from '../../../stores/inventory.store'
import { storeToRefs } from 'pinia'

const supplierStore = useSupplierStore()
const inventoryStore = useInventoryStore()
const stockInHistory = inventoryStore.history.filter(h => h.type === 'STOCK_IN')
</script>
<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-xl font-bold text-gray-900">ប្រវត្តិអ្នកផ្គត់ផ្គង់</h1>
      <p class="text-sm text-gray-500 mt-0.5">រាល់ចលនាស្តុកទាក់ទងនឹងអ្នកផ្គត់ផ្គង់</p>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full data-table min-w-max">
          <thead><tr><th>កាលបរិច្ឆេទ</th><th>ផលិតផល</th><th>អ្នកផ្គត់ផ្គង់</th><th>ចំនួនដែលបានបន្ថែម</th><th>មូលហេតុ</th></tr></thead>
          <tbody>
            <tr v-if="!stockInHistory.length"><td colspan="5" class="text-center text-gray-400 py-8">មិនទាន់មានប្រវត្តិអ្នកផ្គត់ផ្គង់ទេ</td></tr>
            <tr v-for="h in stockInHistory.slice().reverse()" :key="h.id">
              <td class="text-gray-500 text-xs">{{ h.date }}</td>
              <td class="font-medium text-gray-900">{{ h.productName }}</td>
              <td>{{ h.supplierId ? (supplierStore.getById(Number(h.supplierId))?.name ?? '—') : '—' }}</td>
              <td class="font-bold text-green-600">+{{ h.quantity }}</td>
              <td class="text-gray-500">{{ h.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

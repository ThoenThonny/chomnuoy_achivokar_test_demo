<script setup>
import { computed } from 'vue'
import { useProductStore } from '../../../stores/product.store'
import { useSaleStore } from '../../../stores/sale.store'

const productStore = useProductStore()
const saleStore = useSaleStore()

const slowMoving = computed(() => {
  const soldMap = {}
  saleStore.sales.forEach(s => s.items.forEach(i => {
    soldMap[i.productId] = (soldMap[i.productId] || 0) + i.quantity
  }))
  return productStore.products
    .map(p => ({ ...p, soldTotal: soldMap[p.id] || 0 }))
    .filter(p => p.stock > p.lowStockThreshold && (soldMap[p.id] || 0) < 5)
    .sort((a, b) => a.soldTotal - b.soldTotal)
})
</script>
<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-xl font-bold text-gray-900">ផលិតផលលក់យឺតបំផុត</h1>
      <p class="text-sm text-gray-500 mt-0.5">ផលិតផលមានស្តុកច្រើនតែការលក់ទាបបំផុត</p>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full data-table">
          <thead><tr><th>ផលិតផល</th><th>លេខកូដ SKU</th><th>ស្តុកបច្ចុប្បន្ន</th><th>ចំនួនលក់សរុប</th><th>សកម្មភាព</th></tr></thead>
          <tbody>
            <tr v-if="slowMoving.length === 0"><td colspan="5" class="text-center text-gray-400 py-8">មិនមានផលិតផលលក់យឺតទេ 🎉</td></tr>
            <tr v-for="p in slowMoving" :key="p.id">
              <td class="font-semibold text-gray-900">{{ p.name }}</td>
              <td class="font-mono text-xs">{{ p.sku }}</td>
              <td class="font-bold text-amber-600">{{ p.stock }}</td>
              <td class="text-gray-500">{{ p.soldTotal }}</td>
              <td><span class="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full font-medium">គួរធ្វើប្រូម៉ូសិន</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

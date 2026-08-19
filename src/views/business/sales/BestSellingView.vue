<script setup>
import { useSaleStore } from '../../../stores/sale.store'
import { storeToRefs } from 'pinia'

const { bestSelling } = storeToRefs(useSaleStore())

const medals = ['🥇', '🥈', '🥉']
</script>
<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-xl font-bold text-gray-900">ផលិតផលលក់ដាច់បំផុត</h1>
      <p class="text-sm text-gray-500 mt-0.5">ផលិតផលកំពូលតាមចំនួនដែលបានលក់</p>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full data-table">
          <thead><tr><th>#</th><th>ផលិតផល</th><th>ចំនួនលក់</th><th>ចំណូល</th></tr></thead>
          <tbody>
            <tr v-if="bestSelling.length === 0"><td colspan="4" class="text-center text-gray-400 py-8">មិនទាន់មានទិន្នន័យ</td></tr>
            <tr v-for="(item, idx) in bestSelling" :key="item.productId">
              <td class="text-lg">{{ medals[idx] ?? idx + 1 }}</td>
              <td class="font-semibold text-gray-900">{{ item.productName }}</td>
              <td class="font-bold">{{ item.qty }}</td>
              <td class="font-medium">${{ item.revenue.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

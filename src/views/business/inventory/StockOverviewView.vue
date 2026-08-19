<script setup>
import { useProductStore } from '../../../stores/product.store'
import { useInventoryStore } from '../../../stores/inventory.store'
import { storeToRefs } from 'pinia'
import { AlertTriangle, XCircle, BarChart3, Package } from 'lucide-vue-next'

const productStore = useProductStore()
const inventoryStore = useInventoryStore()
const { products, lowStockProducts, outOfStockProducts, totalStock, inventoryValue } = storeToRefs(productStore)
</script>

<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-xl font-bold text-gray-900">ទិដ្ឋភាពទូទៅនៃស្តុក</h1>
      <p class="text-sm text-gray-500 mt-0.5">ស្ថានភាពស្តុកបច្ចុប្បន្នសម្រាប់ផលិតផលទាំងអស់</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs font-medium text-gray-500 mb-2">ផលិតផលសរុប</p>
        <p class="text-2xl font-bold text-gray-900">{{ products.length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs font-medium text-gray-500 mb-2">ចំនួនស្តុកសរុប</p>
        <p class="text-2xl font-bold text-gray-900">{{ totalStock.toLocaleString() }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs font-medium text-gray-500 mb-2">តម្លៃស្តុកសរុប</p>
        <p class="text-2xl font-bold text-gray-900">${{ inventoryValue.toFixed(2) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-medium text-gray-500">ការដាស់តឿន</p>
          <AlertTriangle class="w-4 h-4 text-amber-500" />
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ lowStockProducts.length + outOfStockProducts.length }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ outOfStockProducts.length }} អស់ពីស្តុក</p>
      </div>
    </div>

    <!-- All products with stock bars -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h2 class="text-sm font-semibold text-gray-900">កម្រិតស្តុកផលិតផលទាំងអស់</h2>
      </div>
      <div class="divide-y divide-gray-50">
        <div v-for="p in products" :key="p.id" class="px-5 py-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                {{ p.name.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ p.name }}</p>
                <p class="text-xs text-gray-400">{{ p.sku }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold" :class="p.stock === 0 ? 'text-red-600' : p.stock <= p.lowStockThreshold ? 'text-amber-600' : 'text-gray-900'">
                {{ p.stock }} / {{ p.lowStockThreshold }} អប្បបរមា
              </p>
              <p class="text-xs" :class="p.stock === 0 ? 'text-red-500' : p.stock <= p.lowStockThreshold ? 'text-amber-500' : 'text-gray-400'">
                {{ p.stock === 0 ? 'អស់ពីស្តុក' : p.stock <= p.lowStockThreshold ? 'ស្តុកជិតអស់' : 'មានក្នុងស្តុក' }}
              </p>
            </div>
          </div>
          <!-- Stock bar -->
          <div class="w-full bg-gray-100 rounded-full h-1.5">
            <div
              class="h-1.5 rounded-full transition-all"
              :style="{ width: Math.min(100, (p.stock / (p.lowStockThreshold * 3)) * 100) + '%' }"
              :class="p.stock === 0 ? 'bg-red-500' : p.stock <= p.lowStockThreshold ? 'bg-amber-400' : 'bg-black'"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

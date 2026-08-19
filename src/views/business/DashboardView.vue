<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '../../stores/dashboard.store'
import { useProductStore } from '../../stores/product.store'
import { useAuthStore } from '../../stores/auth.store'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Package, BarChart3, ShoppingCart, DollarSign, AlertTriangle, XCircle, Plus, ArrowRight } from 'lucide-vue-next'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const router = useRouter()
const auth = useAuthStore()
const dashboard = useDashboardStore()
const productStore = useProductStore()

const statCards = computed(() => [
  { label: 'ផលិតផលសរុប', value: dashboard.totalProducts, icon: Package, sub: 'ក្នុងប្រព័ន្ធ' },
  { label: 'ស្តុកបច្ចុប្បន្ន', value: dashboard.currentStock.toLocaleString(), icon: BarChart3, sub: 'ឯកតាសរុប' },
  { label: "ចំណូលថ្ងៃនេះ", value: `$${dashboard.todayRevenue.toFixed(2)}`, icon: ShoppingCart, sub: `${dashboard.todayOrders} ការបញ្ជាទិញ` },
  { label: 'ប្រាក់ចំណេញថ្ងៃនេះ', value: `$${dashboard.todayProfit.toFixed(2)}`, icon: DollarSign, sub: 'ប៉ាន់ស្មាន' },
])

const chartData = computed(() => ({
  labels: dashboard.salesChartData.map(d => d.label),
  datasets: [{
    label: 'ចំណូល ($)',
    data: dashboard.salesChartData.map(d => d.revenue),
    borderColor: '#000000',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 2,
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#000000',
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: ctx => `$${ctx.raw.toFixed(2)}`
      }
    }
  },
  scales: {
    x: { grid: { display: false }, border: { display: false } },
    y: {
      grid: { color: '#f3f4f6' },
      border: { display: false },
      ticks: { callback: v => `$${v}` }
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">ផ្ទាំងគ្រប់គ្រង</h1>
        <p class="text-sm text-gray-500 mt-0.5">
          {{ new Date().toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
      </div>
      <button
        @click="router.push('/business/sales/new')"
        class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
      >
        <Plus class="w-4 h-4" />
        ការលក់ថ្មី
      </button>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in statCards"
        :key="stat.label"
        class="bg-white rounded-xl border border-gray-100 p-4"
      >
        <div class="flex items-start justify-between mb-3">
          <p class="text-xs font-medium text-gray-500">{{ stat.label }}</p>
          <component :is="stat.icon" class="w-4 h-4 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ stat.sub }}</p>
      </div>
    </div>

    <!-- Alerts row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" v-if="dashboard.lowStockCount > 0 || dashboard.outOfStockCount > 0">
      <div v-if="dashboard.lowStockCount > 0" class="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle class="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <p class="text-sm font-semibold text-amber-800">ការព្រមានស្តុកទាប</p>
          <p class="text-xs text-amber-600">{{ dashboard.lowStockCount }} ផលិតផលក្រោមចំនួនកំណត់</p>
        </div>
        <router-link to="/business/inventory" class="ml-auto text-xs font-medium text-amber-800 hover:underline flex items-center gap-1">
          មើល <ArrowRight class="w-3 h-3" />
        </router-link>
      </div>
      <div v-if="dashboard.outOfStockCount > 0" class="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <XCircle class="w-5 h-5 text-red-600 flex-shrink-0" />
        <div>
          <p class="text-sm font-semibold text-red-800">អស់ស្តុក</p>
          <p class="text-xs text-red-600">{{ dashboard.outOfStockCount }} ផលិតផលត្រូវបំពេញស្តុក</p>
        </div>
        <router-link to="/business/inventory/stock-in" class="ml-auto text-xs font-medium text-red-800 hover:underline flex items-center gap-1">
          បំពេញស្តុក <ArrowRight class="w-3 h-3" />
        </router-link>
      </div>
    </div>

    <!-- Charts + Recent Sales -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sales Chart -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-semibold text-gray-900">ទិដ្ឋភាពទូទៅនៃការលក់ — ៧ ថ្ងៃចុងក្រោយ</p>
        </div>
        <div class="h-52">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Low Stock Items -->
      <div class="bg-white rounded-xl border border-gray-100 p-5">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-semibold text-gray-900">ផលិតផលស្តុកទាប</p>
          <router-link to="/business/inventory" class="text-xs text-gray-500 hover:text-gray-900">មើលទាំងអស់</router-link>
        </div>
        <div class="space-y-3">
          <div v-if="dashboard.lowStockItems.length === 0" class="text-xs text-gray-400 text-center py-4">
            ស្តុកទាំងអស់ធម្មតា ✓
          </div>
          <div
            v-for="item in dashboard.lowStockItems"
            :key="item.id"
            class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
              <p class="text-xs text-gray-500">អប្បបរមា: {{ item.lowStockThreshold }}</p>
            </div>
            <span class="flex-shrink-0 ml-2 px-2 py-0.5 text-xs font-semibold rounded-full"
              :class="item.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'"
            >
              នៅសល់ {{ item.stock }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Sales Table -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <p class="text-sm font-semibold text-gray-900">ការលក់ថ្មីៗ</p>
        <router-link to="/business/sales" class="text-xs text-gray-500 hover:text-gray-900">មើលទាំងអស់</router-link>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full data-table">
          <thead>
            <tr>
              <th>វិក្កយបត្រ</th>
              <th>ចំនួន</th>
              <th>សរុប</th>
              <th>ការទូទាត់</th>
              <th>កាលបរិច្ឆេទ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="dashboard.recentSales.length === 0">
              <td colspan="5" class="text-center text-gray-400 py-6">មិនទាន់មានការលក់នៅថ្ងៃនេះទេ</td>
            </tr>
            <tr v-for="sale in dashboard.recentSales" :key="sale.id">
              <td class="font-mono text-xs font-medium">{{ sale.invoiceNo }}</td>
              <td>{{ sale.items.length }} items</td>
              <td class="font-semibold">${{ sale.total.toFixed(2) }}</td>
              <td class="capitalize">{{ sale.paymentMethod }}</td>
              <td class="text-gray-500">{{ sale.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

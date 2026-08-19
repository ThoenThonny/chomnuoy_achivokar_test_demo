<script setup>
import { computed } from 'vue'
import { useBusinessStore } from '../../stores/business.store'
import { Building2, Users, TrendingUp, Activity } from 'lucide-vue-next'

const businessStore = useBusinessStore()
const stats = computed(() => [
  { label: 'អាជីវកម្មសរុប', value: businessStore.stats.total, icon: Building2 },
  { label: 'សកម្ម', value: businessStore.stats.active, icon: TrendingUp },
  { label: 'រង់ចាំ', value: businessStore.stats.pending, icon: Activity },
  { label: 'អសកម្ម', value: businessStore.stats.inactive, icon: Users },
])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-white">ផ្ទាំងគ្រប់គ្រងអ្នកគ្រប់គ្រង</h1>
      <p class="text-sm text-white/50 mt-0.5">ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធ</p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="bg-white/5 border border-white/10 rounded-xl p-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium text-white/50">{{ stat.label }}</p>
          <component :is="stat.icon" class="w-4 h-4 text-white/30" />
        </div>
        <p class="text-3xl font-bold text-white">{{ stat.value }}</p>
      </div>
    </div>

    <div class="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-white/10">
        <h2 class="text-sm font-semibold text-white">អាជីវកម្មថ្មីៗ</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-max">
          <thead>
            <tr class="border-b border-white/10 text-xs text-white/40 uppercase tracking-wider">
              <th class="px-5 py-3 text-left font-semibold">អាជីវកម្ម</th>
              <th class="px-5 py-3 text-left font-semibold">ម្ចាស់</th>
              <th class="px-5 py-3 text-left font-semibold">កញ្ចប់</th>
              <th class="px-5 py-3 text-left font-semibold">ស្ថានភាព</th>
              <th class="px-5 py-3 text-left font-semibold">កាលបរិច្ឆេទ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5 text-sm">
            <tr v-for="b in businessStore.businesses.slice(0, 5)" :key="b.id" class="hover:bg-white/5 transition-colors">
              <td class="px-5 py-3 font-medium text-white">{{ b.name }}</td>
              <td class="px-5 py-3 text-white/60">{{ b.owner }}</td>
              <td class="px-5 py-3 text-white/60">{{ b.plan }}</td>
              <td class="px-5 py-3">
                <span class="px-2 py-0.5 text-xs font-semibold rounded-full"
                  :class="b.status === 'Active' ? 'bg-green-500/20 text-green-400' : b.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/40'">
                  {{ b.status }}
                </span>
              </td>
              <td class="px-5 py-3 text-white/40 text-xs">{{ b.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

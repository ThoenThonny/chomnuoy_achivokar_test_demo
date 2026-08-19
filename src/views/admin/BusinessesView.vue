<script setup>
import { useBusinessStore } from '../../stores/business.store'
import { storeToRefs } from 'pinia'
import { Search, Plus, Power, Filter } from 'lucide-vue-next'

const businessStore = useBusinessStore()
const { search, planFilter, filteredBusinesses, loading } = storeToRefs(businessStore)

function statusClass(s) {
  return s === 'Active' ? 'bg-green-500/20 text-green-400' : s === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/40'
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-white">អាជីវកម្ម</h1>
        <p class="text-sm text-white/40 mt-0.5">គ្រប់គ្រងអាជីវកម្មដែលបានចុះឈ្មោះទាំងអស់</p>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input v-model="businessStore.search" type="text" placeholder="ស្វែងរកអាជីវកម្ម..." class="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
      </div>
      <select v-model="businessStore.planFilter" class="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none">
        <option value="All">កញ្ចប់ទាំងអស់</option>
        <option>Basic</option><option>Pro</option><option>Enterprise</option>
      </select>
      <select v-model="businessStore.statusFilter" class="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none">
        <option value="All">ស្ថានភាពទាំងអស់</option>
        <option>Active</option><option>Pending</option><option>Inactive</option>
      </select>
    </div>
    <div class="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-max">
          <thead class="border-b border-white/10 text-xs text-white/40 uppercase tracking-wider">
            <tr><th class="px-5 py-3 text-left font-semibold">អាជីវកម្ម</th><th class="px-5 py-3 text-left font-semibold">ម្ចាស់</th><th class="px-5 py-3 text-left font-semibold">អ៊ីមែល</th><th class="px-5 py-3 text-left font-semibold">កញ្ចប់</th><th class="px-5 py-3 text-left font-semibold">ស្ថានភាព</th><th class="px-5 py-3 text-left font-semibold">សកម្មភាព</th></tr>
          </thead>
          <tbody class="divide-y divide-white/5 text-sm">
            <tr v-if="!filteredBusinesses.length"><td colspan="6" class="text-center text-white/30 py-8">រកមិនឃើញអាជីវកម្មទេ</td></tr>
            <tr v-for="b in filteredBusinesses" :key="b.id" class="hover:bg-white/5 transition-colors group">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">{{ b.name.charAt(0) }}</div>
                  <span class="font-medium text-white">{{ b.name }}</span>
                </div>
              </td>
              <td class="px-5 py-3 text-white/60">{{ b.owner }}</td>
              <td class="px-5 py-3 text-white/40 text-xs">{{ b.email }}</td>
              <td class="px-5 py-3 text-white/60">{{ b.plan }}</td>
              <td class="px-5 py-3"><span :class="statusClass(b.status)" class="px-2 py-0.5 text-xs font-semibold rounded-full">{{ b.status }}</span></td>
              <td class="px-5 py-3">
                <button @click="businessStore.toggleStatus(b.id)" class="p-1.5 hover:bg-white/10 rounded text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-all" :title="b.status === 'Active' ? 'បិទដំណើរការ' : 'បើកដំណើរការ'">
                  <Power class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

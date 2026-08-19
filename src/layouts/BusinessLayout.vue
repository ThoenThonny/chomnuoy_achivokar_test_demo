<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import {
  LayoutDashboard, Package, Layers, ClipboardList,
  ShoppingCart, Truck, Bot, FileBarChart, Settings,
  LogOut, Menu, ChevronDown, ChevronRight, Megaphone
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const sidebarOpen = ref(false)

const navItems = [
  { label: 'ផ្ទាំងគ្រប់គ្រង', to: '/business/dashboard', icon: LayoutDashboard },
  {
    label: 'ផលិតផល',
    icon: Package,
    children: [
      { label: 'ផលិតផលទាំងអស់', to: '/business/products' },
      { label: 'បន្ថែមផលិតផល', to: '/business/products/add' },
      { label: 'ប្រភេទផលិតផល', to: '/business/products/categories' },
    ]
  },
  {
    label: 'សន្និធិ (ស្តុក)',
    icon: Layers,
    children: [
      { label: 'ទិដ្ឋភាពទូទៅនៃស្តុក', to: '/business/inventory' },
      { label: 'ស្តុកចូល', to: '/business/inventory/stock-in' },
      { label: 'ស្តុកចេញ', to: '/business/inventory/stock-out' },
      { label: 'ការកែសម្រួលស្តុក', to: '/business/inventory/adjustment' },
      { label: 'ប្រវត្តិនៃការផ្លាស់ប្តូរស្តុក', to: '/business/inventory/history' },
    ]
  },
  {
    label: 'ការលក់',
    icon: ShoppingCart,
    children: [
      { label: 'ការលក់ថ្មី (POS)', to: '/business/sales/new' },
      { label: 'ប្រវត្តិនៃការលក់', to: '/business/sales' },
      { label: 'លក់ដាច់បំផុត', to: '/business/sales/best-selling' },
      { label: 'លក់យឺតបំផុត', to: '/business/sales/slow-moving' },
    ]
  },
  {
    label: 'អ្នកផ្គត់ផ្គង់',
    icon: Truck,
    children: [
      { label: 'បញ្ជីអ្នកផ្គត់ផ្គង់', to: '/business/suppliers' },
      { label: 'ការបញ្ជាទិញ', to: '/business/suppliers/purchases' },
      { label: 'ប្រវត្តិអ្នកផ្គត់ផ្គង់', to: '/business/suppliers/history' },
    ]
  },
  {
    label: 'AI',
    icon: Bot,
    children: [
      { label: 'ជំនួយការ AI', to: '/business/ai/assistant' },
      { label: 'ទីផ្សារ AI', to: '/business/ai/marketing' },
    ]
  },
  {
    label: 'របាយការណ៍',
    icon: FileBarChart,
    children: [
      { label: 'របាយការណ៍លក់', to: '/business/reports/sales' },
      { label: 'របាយការណ៍ស្តុក', to: '/business/reports/inventory' },
      { label: 'របាយការណ៍ប្រាក់ចំណេញ', to: '/business/reports/profit' },
      { label: 'ដំណើរការផលិតផល', to: '/business/reports/performance' },
    ]
  },
  { label: 'ការកំណត់', to: '/business/settings', icon: Settings },
]

const expanded = ref({ Products: true, Inventory: false, Sales: false, Suppliers: false, AI: false, Reports: false })

function isGroupActive(item) {
  if (!item.children) return false
  return item.children.some(c => route.path.startsWith(c.to))
}

function isActive(to) {
  return route.path === to
}

function toggle(label) {
  expanded.value[label] = !expanded.value[label]
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <!-- Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-20 bg-black/40 lg:hidden" @click="sidebarOpen = false" />

    <!-- Sidebar -->
    <aside
      class="fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col bg-black text-white transition-transform duration-300 ease-in-out"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Brand -->
      <div class="flex items-center gap-3 px-5 py-5 border-b border-white/10 flex-shrink-0">
        <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <Package class="w-5 h-5 text-black" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-bold leading-none truncate">ជំនួយអាជីវករ</p>
          <p class="text-[10px] text-white/40 mt-0.5 truncate">{{ auth.user?.name }}</p>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-0.5">
        <template v-for="item in navItems" :key="item.label">
          <!-- Single link -->
          <router-link
            v-if="!item.children"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="isActive(item.to) ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/10'"
            @click="sidebarOpen = false"
          >
            <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
            {{ item.label }}
          </router-link>

          <!-- Group with children -->
          <div v-else>
            <button
              @click="toggle(item.label)"
              class="flex items-center justify-between w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="isGroupActive(item) ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/10'"
            >
              <span class="flex items-center gap-3">
                <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
                {{ item.label }}
              </span>
              <ChevronDown
                class="w-3.5 h-3.5 transition-transform flex-shrink-0"
                :class="expanded[item.label] ? 'rotate-180' : ''"
              />
            </button>

            <div v-show="expanded[item.label]" class="pl-4 mt-0.5 space-y-0.5 border-l border-white/10 ml-5">
              <router-link
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                class="flex items-center px-3 py-2 rounded-lg text-xs transition-colors"
                :class="isActive(child.to) ? 'bg-white text-black font-semibold' : 'text-white/50 hover:text-white hover:bg-white/10'"
                @click="sidebarOpen = false"
              >
                {{ child.label }}
              </router-link>
            </div>
          </div>
        </template>
      </nav>

      <!-- User -->
      <div class="border-t border-white/10 p-4 flex-shrink-0">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {{ auth.user?.name?.charAt(0) }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-white/40 truncate">ម្ចាស់អាជីវកម្ម</p>
          </div>
        </div>
        <button
          @click="logout"
          class="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut class="w-4 h-4" />
          ចាកចេញ
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header class="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-gray-200 bg-white flex-shrink-0">
        <button @click="sidebarOpen = !sidebarOpen" class="p-1.5 rounded hover:bg-gray-100">
          <Menu class="w-5 h-5" />
        </button>
        <span class="font-semibold text-sm">ជំនួយអាជីវករ</span>
      </header>

      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

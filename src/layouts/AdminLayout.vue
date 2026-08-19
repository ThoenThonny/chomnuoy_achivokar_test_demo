<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import {
  LayoutDashboard, Building2, Users, CreditCard,
  Activity, FileBarChart, ScrollText, Bot, Settings,
  LogOut, Menu, X, ChevronRight, Package
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const sidebarOpen = ref(false)

const nav = [
  { label: 'ផ្ទាំងគ្រប់គ្រង', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'អាជីវកម្ម', to: '/admin/businesses', icon: Building2 },
  { label: 'ម្ចាស់អាជីវកម្ម', to: '/admin/owners', icon: Users },
  { label: 'ការជាវប្រចាំ', to: '/admin/subscriptions', icon: CreditCard },
  { label: 'ការប្រើប្រាស់ប្រព័ន្ធ', to: '/admin/system-usage', icon: Activity },
  { label: 'របាយការណ៍ប្រព័ន្ធ', to: '/admin/reports', icon: FileBarChart },
  { label: 'កំណត់ហេតុប្រព័ន្ធ', to: '/admin/logs', icon: ScrollText },
  { label: 'ការកំណត់ AI', to: '/admin/ai-config', icon: Bot },
  { label: 'ការកំណត់', to: '/admin/settings', icon: Settings },
]

const isActive = (to) => route.path === to || route.path.startsWith(to + '/')

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <!-- Sidebar Overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-20 bg-black/40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col bg-black text-white transition-transform duration-300 ease-in-out"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Brand -->
      <div class="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <Package class="w-5 h-5 text-black" />
        </div>
        <div>
          <p class="text-sm font-bold leading-none">ជំនួយអាជីវករ</p>
          <p class="text-[10px] text-white/40 mt-0.5">អ្នកគ្រប់គ្រងកំពូល</p>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <router-link
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-white text-black'
            : 'text-white/60 hover:text-white hover:bg-white/10'"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
          {{ item.label }}
        </router-link>
      </nav>

      <!-- User -->
      <div class="border-t border-white/10 p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
            {{ auth.user?.name?.charAt(0) }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-white/40 truncate">{{ auth.user?.email }}</p>
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
      <!-- Top bar (mobile) -->
      <header class="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-gray-200 bg-white flex-shrink-0">
        <button @click="sidebarOpen = !sidebarOpen" class="p-1.5 rounded hover:bg-gray-100">
          <Menu class="w-5 h-5" />
        </button>
        <span class="font-semibold text-sm">អ្នកគ្រប់គ្រង ជំនួយអាជីវករ</span>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

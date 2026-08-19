<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'
import { Package, Eye, EyeOff, AlertCircle, Zap, BarChart2, ShieldCheck, Sparkles } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const showPass = ref(false)
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'សូមបញ្ចូលឈ្មោះគណនី និងលេខសម្ងាត់'
    return
  }
  error.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  try {
    const user = auth.login(username.value, password.value)
    router.push(user.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/business/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white flex">
    <!-- Left panel -->
    <div class="hidden lg:flex flex-col justify-between w-1/2 bg-black p-12">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
          <Package class="w-5 h-5 text-black" />
        </div>
        <span class="text-white font-bold text-lg">ជំនួយអាជីវករ</span>
      </div>

      <div>
        <h1 class="text-4xl font-bold text-white leading-tight mb-4">
          គ្រប់គ្រងសន្និធិរបស់អ្នក<br />កាន់តែឆ្លាតវៃ។
        </h1>
        <p class="text-white/50 text-sm leading-relaxed">
          តាមដានផលិតផល គ្រប់គ្រងស្តុក វិភាគការលក់ និងទទួលបានការយល់ដឹងពី AI — ទាំងអស់នៅក្នុងកន្លែងតែមួយ។
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col gap-3 transition-colors hover:bg-white/10">
          <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Zap class="w-4 h-4 text-white" />
          </div>
          <div>
            <p class="font-bold text-white text-sm">លឿនរហ័ស</p>
            <p class="text-xs text-white/50 mt-0.5">ដំណើរការរលូន និងងាយស្រួល</p>
          </div>
        </div>
        <div class="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col gap-3 transition-colors hover:bg-white/10">
          <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <BarChart2 class="w-4 h-4 text-white" />
          </div>
          <div>
            <p class="font-bold text-white text-sm">របាយការណ៍ច្បាស់លាស់</p>
            <p class="text-xs text-white/50 mt-0.5">តាមដានទិន្នន័យគ្រប់ជ្រុងជ្រោយ</p>
          </div>
        </div>
        <div class="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col gap-3 transition-colors hover:bg-white/10">
          <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <ShieldCheck class="w-4 h-4 text-white" />
          </div>
          <div>
            <p class="font-bold text-white text-sm">សុវត្ថិភាពខ្ពស់</p>
            <p class="text-xs text-white/50 mt-0.5">រក្សាទុកទិន្នន័យដោយទំនុកចិត្ត</p>
          </div>
        </div>
        <div class="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col gap-3 transition-colors hover:bg-white/10">
          <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Sparkles class="w-4 h-4 text-white" />
          </div>
          <div>
            <p class="font-bold text-white text-sm">បច្ចេកវិទ្យា AI</p>
            <p class="text-xs text-white/50 mt-0.5">វិភាគនិងផ្តល់យោបល់ឆ្លាតវៃ</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right panel -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-sm">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center gap-3 mb-8">
          <div class="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
            <Package class="w-5 h-5 text-white" />
          </div>
          <span class="font-bold text-lg">ជំនួយអាជីវករ</span>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-1">ចូលប្រើប្រាស់</h2>
        <p class="text-sm text-gray-500 mb-8">បញ្ចូលព័ត៌មានរបស់អ្នកដើម្បីចូលគណនី</p>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Error -->
          <div v-if="error" class="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
            <AlertCircle class="w-4 h-4 flex-shrink-0" />
            {{ error }}
          </div>

          <!-- Username -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ឈ្មោះគណនី</label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="owner"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">លេខសម្ងាត់</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
              <button type="button" @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <EyeOff v-if="showPass" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? 'កំពុងចូល...' : 'ចូលប្រើប្រាស់' }}
          </button>
        </form>

        <!-- Demo credentials -->
        <div class="mt-8 space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-500">
            <p class="font-semibold text-gray-700 mb-2">ព័ត៌មានគណនីសាកល្បង</p>
            <p>ម្ចាស់អាជីវកម្ម — <strong class="text-gray-900">name: owner</strong> / <strong class="text-gray-900">password: owner123</strong></p>
          </div>
          <div class="p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-xs leading-relaxed">
            <span class="font-semibold">ចំណាំ៖</span> ប្រព័ន្ធនេះត្រូវបានបង្កើតឡើងសម្រាប់តែការសាកល្បង (Demo) ដើម្បីបង្ហាញពីមុខងារ និងគោលបំណងរបស់ក្រុមពួកយើងនៃការប្រើប្រាស់ប៉ុណ្ណោះ។
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

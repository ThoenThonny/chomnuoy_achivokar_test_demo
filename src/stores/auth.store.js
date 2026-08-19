import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../services/storage.service'
import { users as mockUsers } from '../mock/users'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(storage.get('auth_user', null))
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'SUPER_ADMIN')
  const isOwner = computed(() => user.value?.role === 'BUSINESS_OWNER')

  function login(username, password) {
    // Load users from storage, fall back to mock
    const storedUsers = storage.get('users', mockUsers)
    const found = storedUsers.find(u => u.username === username && u.password === password)
    
    if (!found) throw new Error('Invalid username or password')
    
    const { password: _, ...safeUser } = found
    user.value = safeUser
    storage.set('auth_user', safeUser)
    return safeUser
  }

  function logout() {
    user.value = null
    storage.remove('auth_user')
  }

  return { user, isAuthenticated, isAdmin, isOwner, login, logout }
})

<script setup>
import { ref } from 'vue'
import { useSupplierStore } from '../../../stores/supplier.store'
import { Plus, Edit2, Trash2, Save, Phone, Mail, MapPin } from 'lucide-vue-next'

const supplierStore = useSupplierStore()
const showForm = ref(false)
const editingId = ref(null)
const form = ref({ name: '', phone: '', email: '', address: '' })

function startAdd() { form.value = { name: '', phone: '', email: '', address: '' }; editingId.value = null; showForm.value = true }
function startEdit(s) { form.value = { name: s.name, phone: s.phone, email: s.email, address: s.address }; editingId.value = s.id; showForm.value = true }
function cancelForm() { showForm.value = false; editingId.value = null }
function handleSave() {
  if (!form.value.name) return alert('តម្រូវឱ្យមានឈ្មោះអ្នកផ្គត់ផ្គង់')
  if (editingId.value) supplierStore.updateSupplier(editingId.value, { ...form.value })
  else supplierStore.addSupplier({ ...form.value })
  cancelForm()
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">អ្នកផ្គត់ផ្គង់</h1>
        <p class="text-sm text-gray-500 mt-0.5">គ្រប់គ្រងទំនាក់ទំនងអ្នកផ្គត់ផ្គង់របស់អ្នក</p>
      </div>
      <button @click="startAdd" class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
        <Plus class="w-4 h-4" />បន្ថែមអ្នកផ្គត់ផ្គង់
      </button>
    </div>

    <div v-if="showForm" class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 class="text-sm font-semibold">{{ editingId ? 'កែប្រែអ្នកផ្គត់ផ្គង់' : 'អ្នកផ្គត់ផ្គង់ថ្មី' }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ឈ្មោះ *</label>
          <input v-model="form.name" type="text" placeholder="ឈ្មោះអ្នកផ្គត់ផ្គង់" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">លេខទូរស័ព្ទ</label>
          <input v-model="form.phone" type="text" placeholder="012 345 678" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">អ៊ីមែល</label>
          <input v-model="form.email" type="email" placeholder="email@example.com" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">អាសយដ្ឋាន</label>
          <input v-model="form.address" type="text" placeholder="ទីក្រុង, ខេត្ត" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <button @click="cancelForm" class="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">បោះបង់</button>
        <button @click="handleSave" class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900">
          <Save class="w-4 h-4" />រក្សាទុក
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="s in supplierStore.suppliers" :key="s.id" class="bg-white rounded-xl border border-gray-100 p-5">
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-700">
            {{ s.name.charAt(0) }}
          </div>
          <div class="flex gap-1">
            <button @click="startEdit(s)" class="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900"><Edit2 class="w-3.5 h-3.5" /></button>
            <button @click="supplierStore.deleteSupplier(s.id)" class="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"><Trash2 class="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <p class="font-semibold text-gray-900 mb-3">{{ s.name }}</p>
        <div class="space-y-1.5 text-xs text-gray-500">
          <div v-if="s.phone" class="flex items-center gap-2"><Phone class="w-3 h-3" />{{ s.phone }}</div>
          <div v-if="s.email" class="flex items-center gap-2"><Mail class="w-3 h-3" />{{ s.email }}</div>
          <div v-if="s.address" class="flex items-center gap-2"><MapPin class="w-3 h-3" />{{ s.address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

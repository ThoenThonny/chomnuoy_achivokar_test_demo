<script setup>
import { ref } from 'vue'
import { useCategoryStore } from '../../../stores/category.store'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-vue-next'

const categoryStore = useCategoryStore()

const showForm = ref(false)
const editingId = ref(null)
const form = ref({ name: '', description: '' })

function startAdd() { form.value = { name: '', description: '' }; editingId.value = null; showForm.value = true }
function startEdit(cat) { form.value = { name: cat.name, description: cat.description }; editingId.value = cat.id; showForm.value = true }
function cancelForm() { showForm.value = false; editingId.value = null }

function handleSave() {
  if (!form.value.name) return alert('តម្រូវឱ្យមានឈ្មោះប្រភេទ')
  if (editingId.value) {
    categoryStore.updateCategory(editingId.value, { ...form.value })
  } else {
    categoryStore.addCategory({ ...form.value })
  }
  cancelForm()
}

function handleDelete(id) {
  if (confirm('តើអ្នកចង់លុបប្រភេទនេះទេ?')) categoryStore.deleteCategory(id)
}
</script>

<template>
  <div class="w-full space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">ប្រភេទផលិតផល</h1>
        <p class="text-sm text-gray-500 mt-0.5">រៀបចំផលិតផលរបស់អ្នកតាមប្រភេទ</p>
      </div>
      <button @click="startAdd" class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
        <Plus class="w-4 h-4" />
        បន្ថែមប្រភេទ
      </button>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="showForm" class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 class="text-sm font-semibold text-gray-900">{{ editingId ? 'កែប្រែប្រភេទ' : 'ប្រភេទថ្មី' }}</h2>
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ឈ្មោះ *</label>
        <input v-model="form.name" type="text" placeholder="ឧ. ភេសជ្ជៈ" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ការពិពណ៌នា</label>
        <input v-model="form.description" type="text" placeholder="ការពិពណ៌នាបន្ថែម (អាចមិនដាក់)" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" />
      </div>
      <div class="flex justify-end gap-3">
        <button @click="cancelForm" class="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">បោះបង់</button>
        <button @click="handleSave" class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
          <Save class="w-4 h-4" />
          រក្សាទុក
        </button>
      </div>
    </div>

    <!-- List -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table class="w-full data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ឈ្មោះ</th>
            <th>ការពិពណ៌នា</th>
            <th>សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="categoryStore.categories.length === 0">
            <td colspan="4" class="text-center text-gray-400 py-6">មិនទាន់មានប្រភេទទេ</td>
          </tr>
          <tr v-for="(cat, idx) in categoryStore.categories" :key="cat.id" class="group">
            <td class="text-gray-400">{{ idx + 1 }}</td>
            <td class="font-medium text-gray-900">{{ cat.name }}</td>
            <td class="text-gray-500">{{ cat.description || '—' }}</td>
            <td>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="startEdit(cat)" class="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-900">
                  <Edit2 class="w-3.5 h-3.5" />
                </button>
                <button @click="handleDelete(cat.id)" class="p-1.5 hover:bg-red-50 rounded text-gray-500 hover:text-red-600">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

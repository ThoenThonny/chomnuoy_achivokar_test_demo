<template>
  <div class="w-full space-y-5">
    <div><h1 class="text-xl font-bold text-gray-900">ការកំណត់អាជីវកម្ម</h1><p class="text-sm text-gray-500 mt-0.5">កំណត់ចំណូលចិត្តហាងរបស់អ្នក</p></div>
    <div class="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
      <div><label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ឈ្មោះអាជីវកម្ម</label>
      <input type="text" value="My Store" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" /></div>
      <div><label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">រូបិយប័ណ្ណ</label>
      <select class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white"><option>USD ($)</option><option>KHR (រ)</option></select></div>
      <div class="pt-2 border-t border-gray-100">
        <p class="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">តំបន់គ្រោះថ្នាក់</p>
        <button class="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm hover:bg-red-100 transition-colors">
          កំណត់ទិន្នន័យឡើងវិញទាំងអស់
        </button>
      </div>
    </div>
  </div>
</template>

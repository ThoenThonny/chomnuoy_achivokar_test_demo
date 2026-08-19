<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '../../../stores/product.store'
import { useCartStore } from '../../../stores/cart.store'
import { useSaleStore } from '../../../stores/sale.store'
import { useRouter } from 'vue-router'
import { Search, Plus, Minus, Trash2, ShoppingCart, CheckCircle } from 'lucide-vue-next'

const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const saleStore = useSaleStore()

const productSearch = ref('')
const lastSale = ref(null)

const availableProducts = computed(() =>
  productStore.products
    .filter(p => p.stock > 0 && (!productSearch.value || p.name.toLowerCase().includes(productSearch.value.toLowerCase())))
)

function completeSale() {
  if (!cartStore.items.length) return
  const sale = saleStore.completeSale(
    cartStore.items, cartStore.subtotal, cartStore.discount, cartStore.total, cartStore.paymentMethod
  )
  lastSale.value = sale
  cartStore.clearCart()
}

function addToCart(product) {
  cartStore.addItem(product)
}

function printReceipt() {
  window.print()
}
</script>

<template>
  <div class="h-full flex flex-col lg:flex-row gap-5 relative">
    <!-- Product selector -->
    <div class="flex-1 min-w-0 space-y-4 print:hidden">
      <div>
        <h1 class="text-xl font-bold text-gray-900">ការលក់ថ្មី</h1>
        <p class="text-sm text-gray-500 mt-0.5">ជ្រើសរើសផលិតផលដើម្បីបញ្ជូលទៅក្នុងកន្ត្រក</p>
      </div>
      
      <!-- Success Banner -->
      <div v-if="lastSale" class="flex items-center gap-3 p-4 bg-black text-white rounded-xl">
        <CheckCircle class="w-5 h-5 flex-shrink-0" />
        <div class="flex-1">
          <p class="text-sm font-semibold">ការលក់បានជោគជ័យ — {{ lastSale.invoiceNo }}</p>
          <p class="text-xs text-white/60">សរុប: ${{ lastSale.total.toFixed(2) }}</p>
        </div>
        <button @click="printReceipt" class="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200">បោះពុម្ព</button>
        <button @click="lastSale = null" class="text-white/60 hover:text-white text-xs ml-2">បិទ</button>
      </div>

      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input v-model="productSearch" type="text" placeholder="ស្វែងរកផលិតផល..." class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          v-for="p in availableProducts"
          :key="p.id"
          @click="addToCart(p)"
          class="bg-white border border-gray-100 rounded-xl p-4 text-left hover:border-black hover:shadow-sm transition-all group"
        >
          <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 mb-3">
            {{ p.name.substring(0, 2).toUpperCase() }}
          </div>
          <p class="text-sm font-semibold text-gray-900 mb-1 truncate">{{ p.name }}</p>
          <p class="text-sm font-bold text-gray-900">${{ p.sellingPrice.toFixed(2) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ p.stock }} ក្នុងស្តុក</p>
        </button>
      </div>
    </div>

    <!-- Cart -->
    <div class="lg:w-80 flex flex-col bg-white rounded-xl border border-gray-100 h-fit lg:sticky lg:top-0 print:hidden">
      <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <ShoppingCart class="w-4 h-4" />
        <h2 class="text-sm font-semibold text-gray-900">កន្ត្រក</h2>
        <span v-if="cartStore.totalItems" class="ml-auto bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">{{ cartStore.totalItems }}</span>
      </div>

      <!-- Cart items -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 lg:max-h-none">
        <div v-if="!cartStore.items.length" class="text-center text-sm text-gray-400 py-6">កន្ត្រកទទេ</div>
        <div v-for="item in cartStore.items" :key="item.product.id" class="flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ item.product.name }}</p>
            <p class="text-xs text-gray-500">${{ item.price.toFixed(2) }} ក្នុងមួយឯកតា</p>
          </div>
          <div class="flex items-center gap-1">
            <button @click="cartStore.updateQty(item.product.id, item.quantity - 1)" class="p-1 hover:bg-gray-100 rounded">
              <Minus class="w-3 h-3" />
            </button>
            <span class="w-8 text-center text-sm font-bold">{{ item.quantity }}</span>
            <button @click="cartStore.updateQty(item.product.id, item.quantity + 1)" class="p-1 hover:bg-gray-100 rounded">
              <Plus class="w-3 h-3" />
            </button>
          </div>
          <p class="text-sm font-bold w-16 text-right">${{ (item.price * item.quantity).toFixed(2) }}</p>
          <button @click="cartStore.removeItem(item.product.id)" class="p-1 hover:bg-red-50 rounded text-red-500">
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Totals -->
      <div class="p-4 border-t border-gray-100 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">សរុបបឋម</span>
          <span class="font-medium">${{ cartStore.subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">បញ្ចុះតម្លៃ</span>
          <div class="flex items-center gap-1">
            <span class="text-xs text-gray-400">$</span>
            <input v-model.number="cartStore.discount" type="number" min="0" step="0.5" class="w-16 px-2 py-1 text-sm border border-gray-200 rounded text-right focus:outline-none focus:border-black" />
          </div>
        </div>
        <div class="flex justify-between font-bold border-t border-gray-100 pt-3">
          <span>សរុបចុងក្រោយ</span>
          <span class="text-lg">${{ cartStore.total.toFixed(2) }}</span>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">ការទូទាត់</label>
          <select v-model="cartStore.paymentMethod" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
            <option value="cash">សាច់ប្រាក់</option>
            <option value="qr">កូដ QR / ABA</option>
            <option value="card">កាតធនាគារ</option>
          </select>
        </div>
        <button
          @click="completeSale"
          :disabled="!cartStore.items.length"
          class="w-full py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-40"
        >
          បញ្ជាក់ការលក់
        </button>
      </div>
    </div>

    <!-- Printable Receipt (Hidden by default, shown when printing) -->
    <!-- Printable Receipt (Hidden by default, shown when printing) -->
    <div id="printable-receipt" class="hidden text-black bg-white w-[80mm] mx-auto text-[12px] leading-tight font-sans">
      <div class="text-center mb-3">
        <h1 class="font-bold text-xl mb-1">វិក្កយបត្រ</h1>
        <h2 class="font-bold text-sm tracking-widest uppercase">Receipt</h2>
      </div>
      
      <div class="mb-4 text-[11px] flex flex-col gap-1.5">
        <div class="flex justify-between items-end">
          <span class="flex-1 flex items-end">លក់ជូន/Cust: <span class="flex-1 border-b border-dotted border-black ml-1"></span></span>
          <span class="whitespace-nowrap ml-2">លេខ/No: <span class="font-bold">{{ lastSale?.invoiceNo }}</span></span>
        </div>
        <div class="flex justify-between items-end">
          <span class="flex-1 flex items-end">អាស័យដ្ឋាន/Add: <span class="flex-1 border-b border-dotted border-black ml-1"></span></span>
          <span class="whitespace-nowrap ml-2">កាលបរិច្ឆេទ/Date: <span class="font-bold">{{ lastSale?.date }}</span></span>
        </div>
        <div class="flex justify-between items-end">
          <span class="flex-1 flex items-end">លេខទូរស័ព្ទ/Phone: <span class="flex-1 border-b border-dotted border-black ml-1"></span></span>
        </div>
      </div>

      <table class="w-full text-[11px] mb-3">
        <thead>
          <tr class="border-y border-black border-dashed">
            <th class="py-1 text-left font-bold">ល.រ<br>No</th>
            <th class="py-1 text-left font-bold">ឈ្មោះទំនិញ<br>Item</th>
            <th class="py-1 text-center font-bold">ចំនួន<br>Qty</th>
            <th class="py-1 text-right font-bold">តម្លៃ<br>Price</th>
            <th class="py-1 text-right font-bold">សរុប<br>Amount</th>
          </tr>
        </thead>
        <tbody class="border-b border-black border-dashed">
          <tr v-for="(item, index) in lastSale?.items" :key="item.productId">
            <td class="py-1 align-top">{{ index + 1 }}</td>
            <td class="py-1 pr-1">{{ item.productName }}</td>
            <td class="py-1 text-center align-top">{{ item.quantity }}</td>
            <td class="py-1 text-right align-top">${{ item.price.toFixed(2) }}</td>
            <td class="py-1 text-right align-top font-bold">${{ (item.price * item.quantity).toFixed(2) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="pt-2 pb-0.5 text-right font-bold text-[11px]">សរុបបឋម / Subtotal:</td>
            <td class="pt-2 pb-0.5 text-right font-bold text-[11px]">${{ lastSale?.subtotal.toFixed(2) }}</td>
          </tr>
          <tr v-if="lastSale?.discount > 0">
            <td colspan="4" class="py-0.5 text-right font-bold text-[11px]">បញ្ចុះតម្លៃ / Discount:</td>
            <td class="py-0.5 text-right font-bold text-[11px]">-${{ lastSale?.discount.toFixed(2) }}</td>
          </tr>
          <tr>
            <td colspan="4" class="py-1 text-right font-bold text-[13px]">សរុប / TOTAL:</td>
            <td class="py-1 text-right font-bold text-[13px]">${{ lastSale?.total.toFixed(2) }}</td>
          </tr>
        </tfoot>
      </table>

      <div class="flex justify-between text-[11px] mt-6 mb-6">
        <div class="text-center w-[45%]">
          <p class="mb-8">អតិថិជន / Customer</p>
          <div class="border-b border-black border-dotted"></div>
        </div>
        <div class="text-center w-[45%]">
          <p class="mb-8">អ្នកលក់ / Seller</p>
          <div class="border-b border-black border-dotted"></div>
        </div>
      </div>

      <div class="text-[9px] mb-3 leading-relaxed">
        <p>១. សូមពិនិត្យមើលទំនិញរបស់អ្នកឱ្យបានប្រាកដមុននឹងចាកចេញ</p>
        <p>២. ទិញហើយមិនអាចប្តូរយកប្រាក់វិញបានទេ</p>
      </div>
      
      <div class="text-center text-[11px] mt-2 font-bold pb-2 border-t border-black border-dashed pt-2">
        សូមអរគុណ / Thank You
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  @page {
    margin: 0;
    size: 80mm auto;
  }
  body {
    margin: 0;
    padding: 0;
    background: white;
  }
  body * {
    visibility: hidden;
  }
  #printable-receipt, #printable-receipt * {
    visibility: visible;
  }
  #printable-receipt {
    display: block !important;
    position: absolute;
    left: 0;
    top: 0;
    width: 80mm;
    padding: 4mm;
    margin: 0;
  }
}
</style>

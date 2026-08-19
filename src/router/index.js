import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const routes = [
  // Auth
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { requiresGuest: true }
  },

  // ── Super Admin ─────────────────────────────────────
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'SUPER_ADMIN' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('../views/admin/DashboardView.vue') },
      { path: 'businesses', name: 'AdminBusinesses', component: () => import('../views/admin/BusinessesView.vue') },
      { path: 'owners', name: 'AdminOwners', component: () => import('../views/admin/OwnersView.vue') },
      { path: 'subscriptions', name: 'AdminSubscriptions', component: () => import('../views/admin/SubscriptionsView.vue') },
      { path: 'system-usage', name: 'SystemUsage', component: () => import('../views/admin/SystemUsageView.vue') },
      { path: 'reports', name: 'AdminReports', component: () => import('../views/admin/SystemReportsView.vue') },
      { path: 'logs', name: 'SystemLogs', component: () => import('../views/admin/SystemLogsView.vue') },
      { path: 'ai-config', name: 'AIConfig', component: () => import('../views/admin/AIConfigView.vue') },
      { path: 'settings', name: 'AdminSettings', component: () => import('../views/admin/SettingsView.vue') },
    ]
  },

  // ── Business Owner ──────────────────────────────────
  {
    path: '/business',
    component: () => import('../layouts/BusinessLayout.vue'),
    meta: { requiresAuth: true, role: 'BUSINESS_OWNER' },
    children: [
      { path: '', redirect: '/business/dashboard' },
      { path: 'dashboard', name: 'BusinessDashboard', component: () => import('../views/business/DashboardView.vue') },

      // Products
      { path: 'products', name: 'Products', component: () => import('../views/business/products/ProductsView.vue') },
      { path: 'products/add', name: 'AddProduct', component: () => import('../views/business/products/AddProductView.vue') },
      { path: 'products/categories', name: 'Categories', component: () => import('../views/business/products/CategoriesView.vue') },
      { path: 'products/:id/edit', name: 'EditProduct', component: () => import('../views/business/products/AddProductView.vue') },

      // Inventory
      { path: 'inventory', name: 'StockOverview', component: () => import('../views/business/inventory/StockOverviewView.vue') },
      { path: 'inventory/stock-in', name: 'StockIn', component: () => import('../views/business/inventory/StockInView.vue') },
      { path: 'inventory/stock-out', name: 'StockOut', component: () => import('../views/business/inventory/StockOutView.vue') },
      { path: 'inventory/adjustment', name: 'Adjustment', component: () => import('../views/business/inventory/AdjustmentView.vue') },
      { path: 'inventory/history', name: 'InventoryHistory', component: () => import('../views/business/inventory/HistoryView.vue') },

      // Sales
      { path: 'sales', name: 'SalesHistory', component: () => import('../views/business/sales/SalesHistoryView.vue') },
      { path: 'sales/new', name: 'NewSale', component: () => import('../views/business/sales/NewSaleView.vue') },
      { path: 'sales/best-selling', name: 'BestSelling', component: () => import('../views/business/sales/BestSellingView.vue') },
      { path: 'sales/slow-moving', name: 'SlowMoving', component: () => import('../views/business/sales/SlowMovingView.vue') },

      // Suppliers
      { path: 'suppliers', name: 'Suppliers', component: () => import('../views/business/suppliers/SuppliersView.vue') },
      { path: 'suppliers/purchases', name: 'Purchases', component: () => import('../views/business/suppliers/PurchasesView.vue') },
      { path: 'suppliers/history', name: 'SupplierHistory', component: () => import('../views/business/suppliers/SupplierHistoryView.vue') },

      // AI
      { path: 'ai/assistant', name: 'AIAssistant', component: () => import('../views/business/ai/AIAssistantView.vue') },
      { path: 'ai/marketing', name: 'AIMarketing', component: () => import('../views/business/ai/AIMarketingView.vue') },

      // Reports
      { path: 'reports/sales', name: 'SalesReport', component: () => import('../views/business/reports/SalesReportView.vue') },
      { path: 'reports/inventory', name: 'InventoryReport', component: () => import('../views/business/reports/InventoryReportView.vue') },
      { path: 'reports/profit', name: 'ProfitReport', component: () => import('../views/business/reports/ProfitReportView.vue') },
      { path: 'reports/performance', name: 'ProductPerformance', component: () => import('../views/business/reports/ProductPerformanceView.vue') },

      // Settings
      { path: 'settings', name: 'BusinessSettings', component: () => import('../views/business/SettingsView.vue') },
    ]
  },

  // Catch all
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return next(auth.isAdmin ? '/admin/dashboard' : '/business/dashboard')
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return next(auth.isAdmin ? '/admin/dashboard' : '/business/dashboard')
  }

  next()
})

export default router

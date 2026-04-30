import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardPage.vue'),
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/produtos',
  //   name: 'Produtos',
  //   component: () => import('../views/ProdutosPage.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/vendas',
  //   name: 'Vendas',
  //   component: () => import('../views/VendasPage.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/relatorios',
  //   name: 'Relatorios',
  //   component: () => import('../views/RelatoriosPage.vue'),
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de navegação
router.beforeEach((to, from, next) => {
  console.log('🛡️ [Router Guard] Navegando de', from.path, 'para', to.path)
  
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  console.log('🔐 requiresAuth:', requiresAuth, 'isAuthenticated:', authStore.isAuthenticated)

  if (requiresAuth && !authStore.isAuthenticated) {
    console.log('🚫 Bloqueado: redirecionando para /login')
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    console.log('✅ Autenticado: redirecionando para /dashboard')
    next('/dashboard')
  } else {
    console.log('✅ Navegação permitida')
    next()
  }
})

export default router
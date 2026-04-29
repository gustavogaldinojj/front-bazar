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
  {
    path: '/',
    redirect: '/dashboard'
  },
//   {
//     path: '/:pathMatch(.*)*',
//     name: 'NotFound',
//     component: () => import('../views/NotFoundPage.vue')
//   }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de navegação
router.beforeEach((to, from, next) => {
  
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  console.log('🔐 requiresAuth:', requiresAuth, 'isAuthenticated:', authStore.isAuthenticated)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
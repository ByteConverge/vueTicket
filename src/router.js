// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { authUtils } from './utils/auth'

// Comment out or remove Landing.vue import for now
// import Landing from './pages/Landing.vue'
import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import Dashboard from './pages/Dashboard.vue'
import Tickets from './pages/Tickets.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    // Temporarily use Login as landing page
    component: Login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: Tickets,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = authUtils.isAuthenticated()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
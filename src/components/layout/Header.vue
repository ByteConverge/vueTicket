<!-- src/components/layout/Header.vue -->
<template>
  <header class="header" v-if="showHeader">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo">
          TicketFlow
        </router-link>
        
        <nav class="nav">
          <template v-if="authStore.isAuthenticated">
            <router-link to="/dashboard">Dashboard</router-link>
            <router-link to="/tickets">Tickets</router-link>
            <span class="user-info">
              {{ authStore.user?.email }}
            </span>
            <button @click="handleLogout" class="btn btn-ghost">
              Logout
            </button>
          </template>
          <template v-else>
            <router-link to="/login">Login</router-link>
            <router-link to="/signup" class="btn btn-primary">
              Get Started
            </router-link>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const showHeader = computed(() => {
  return !['/login', '/signup'].includes(route.path)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>
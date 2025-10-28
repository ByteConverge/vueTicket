// src/stores/auth.js
import { defineStore } from 'pinia'
import { authUtils } from '../utils/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authUtils.getCurrentUser(),
    isAuthenticated: authUtils.isAuthenticated()
  }),

  actions: {
    async login(email, password) {
      const result = await authUtils.login(email, password)
      if (result.success) {
        this.user = result.user
        this.isAuthenticated = true
      }
      return result
    },

    async signup(email, password, confirmPassword) {
      const result = await authUtils.signup(email, password, confirmPassword)
      if (result.success) {
        this.user = result.user
        this.isAuthenticated = true
      }
      return result
    },

    logout() {
      authUtils.logout()
      this.user = null
      this.isAuthenticated = false
    }
  }
})
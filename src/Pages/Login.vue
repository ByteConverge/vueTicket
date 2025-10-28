<!-- src/pages/Login.vue -->
<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <div class="auth-logo">
          <span class="logo-icon">🎫</span>
          <h1>TicketFlow</h1>
        </div>
        <h2>Welcome back</h2>
        <p>Sign in to your account to continue</p>
      </div>

      <div class="auth-card card">
        <form class="auth-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              autocomplete="email"
              required
              :class="['form-input', { error: errors.email }]"
              placeholder="Enter your email address"
              :disabled="loading"
            />
            <div v-if="errors.email" class="form-error">
              <span class="error-icon">⚠️</span>
              {{ errors.email }}
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="password-input-container">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :class="['form-input', 'password-input', { error: errors.password }]"
                placeholder="Enter your password"
                :disabled="loading"
              />
              <button
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
                :disabled="loading"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <span class="password-toggle-icon">
                  {{ showPassword ? '👁️' : '🔒' }}
                </span>
              </button>
            </div>
            <div v-if="errors.password" class="form-error">
              <span class="error-icon">⚠️</span>
              {{ errors.password }}
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox" />
              <span class="checkmark"></span>
              Remember me
            </label>
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary auth-submit-btn"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <div class="spinner"></div>
              Signing in...
            </span>
            <span v-else>Sign in to your account</span>
          </button>

          <div class="auth-divider">
            <span>or</span>
          </div>

          <div class="demo-credentials">
            <h4>Demo Credentials</h4>
            <p>Use any email and password (minimum 6 characters)</p>
            <div class="demo-example">
              <strong>Email:</strong> demo@example.com<br />
              <strong>Password:</strong> ••••••
            </div>
          </div>
        </form>

        <div class="auth-footer">
          <p>
            Don't have an account?
            <router-link to="/signup" class="auth-link">Sign up here</router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Message Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ modalType === 'success' ? 'Success' : 'Error' }}</h2>
        </div>
        <div class="modal-body">
          <div :class="['modal-icon', modalType]">
            {{ modalType === 'success' ? '✅' : '❌' }}
          </div>
          <p class="modal-message">{{ modalMessage }}</p>
        </div>
        <div class="modal-footer">
          <button
            @click="closeModal"
            :class="['btn', modalType === 'success' ? 'btn-success' : 'btn-primary']"
            :disabled="modalType === 'success'"
          >
            {{ modalType === 'success' ? 'Redirecting...' : 'Close' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const errors = ref({})
const showPassword = ref(false)
const showModal = ref(false)
const modalMessage = ref('')
const modalType = ref('success')

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const showMessageModal = (message, type = 'success') => {
  modalMessage.value = message
  modalType.value = type
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalMessage.value = ''
}

const validateForm = () => {
  const newErrors = {}
  
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid'
  }
  
  if (!formData.password) {
    newErrors.password = 'Password is required'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  errors.value = {}

  try {
    const result = await authStore.login(formData.email, formData.password)
    
    if (result.success) {
      showMessageModal('Login successful! Redirecting to dashboard...', 'success')
      setTimeout(() => router.push('/dashboard'), 2000)
    } else {
      showMessageModal(result.error || 'Login failed. Please check your credentials.', 'error')
    }
  } catch (err) {
    showMessageModal('An error occurred during login. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}
</script>
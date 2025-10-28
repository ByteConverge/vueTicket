<!-- src/pages/Signup.vue -->
<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <div class="auth-logo">
          <span class="logo-icon">🎫</span>
          <h1>TicketFlow</h1>
        </div>
        <h2>Create your account</h2>
        <p>Get started with your free account today</p>
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
                autocomplete="new-password"
                required
                :class="['form-input', 'password-input', { error: errors.password }]"
                placeholder="Create a password"
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
            <div class="form-help">Must be at least 6 characters long</div>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <div class="password-input-container">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                :class="['form-input', 'password-input', { error: errors.confirmPassword }]"
                placeholder="Confirm your password"
                :disabled="loading"
              />
              <button
                type="button"
                class="password-toggle"
                @click="toggleConfirmPasswordVisibility"
                :disabled="loading"
                :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
              >
                <span class="password-toggle-icon">
                  {{ showConfirmPassword ? '👁️' : '🔒' }}
                </span>
              </button>
            </div>
            <div v-if="errors.confirmPassword" class="form-error">
              <span class="error-icon">⚠️</span>
              {{ errors.confirmPassword }}
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox" required />
              <span class="checkmark"></span>
              I agree to the <a href="#" class="terms-link">Terms of Service</a> and 
              <a href="#" class="terms-link">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary auth-submit-btn"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <div class="spinner"></div>
              Creating account...
            </span>
            <span v-else>Create your account</span>
          </button>

          <div class="auth-divider">
            <span>or</span>
          </div>

          <div class="demo-credentials">
            <h4>Demo Information</h4>
            <p>For testing, use any valid email and a password with at least 6 characters</p>
          </div>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account?
            <router-link to="/login" class="auth-link">Sign in here</router-link>
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
          >
            {{ modalType === 'success' ? 'Continue to Dashboard' : 'Close' }}
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
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const errors = ref({})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showModal = ref(false)
const modalMessage = ref('')
const modalType = ref('success')

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const showMessageModal = (message, type = 'success') => {
  modalMessage.value = message
  modalType.value = type
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalMessage.value = ''
  if (modalType.value === 'success') {
    router.push('/dashboard')
  }
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
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters'
  }
  
  if (!formData.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password'
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  errors.value = {}

  try {
    const result = await authStore.signup(
      formData.email, 
      formData.password, 
      formData.confirmPassword
    )
    
    if (result.success) {
      showMessageModal('Account created successfully! You will be redirected to the dashboard.', 'success')
    } else {
      showMessageModal(result.error || 'Signup failed. Please try again.', 'error')
    }
  } catch (err) {
    showMessageModal('An error occurred during signup. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}
</script>
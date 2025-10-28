// src/utils/auth.js
export const authUtils = {
  isAuthenticated: () => {
    return localStorage.getItem('ticketapp_session') !== null
  },

  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email && password.length >= 6) {
      const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
      const user = { email, id: Date.now().toString() }
      
      localStorage.setItem('ticketapp_session', token)
      localStorage.setItem('ticketapp_user', JSON.stringify(user))
      
      return { success: true, token, user }
    }
    
    return { success: false, error: 'Invalid email or password' }
  },

  signup: async (email, password, confirmPassword) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' }
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }
    
    if (!email) {
      return { success: false, error: 'Email is required' }
    }
    
    const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
    const user = { email, id: Date.now().toString() }
    
    localStorage.setItem('ticketapp_session', token)
    localStorage.setItem('ticketapp_user', JSON.stringify(user))
    
    return { success: true, token, user }
  },

  logout: () => {
    localStorage.removeItem('ticketapp_session')
    localStorage.removeItem('ticketapp_user')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('ticketapp_user')
    return user ? JSON.parse(user) : null
  }
}
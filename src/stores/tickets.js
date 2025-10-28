// src/stores/tickets.js
import { defineStore } from 'pinia'
import { ticketUtils } from '../utils/tickets'

export const useTicketsStore = defineStore('tickets', {
  state: () => ({
    tickets: [],
    loading: false,
    error: ''
  }),

  getters: {
    getStats: (state) => () => ticketUtils.getStats(),
    
    filteredTickets: (state) => (filter = 'all', searchQuery = '') => {
      return state.tickets.filter(ticket => {
        if (filter !== 'all' && ticket.status !== filter) return false
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            ticket.title.toLowerCase().includes(query) ||
            ticket.description.toLowerCase().includes(query) ||
            ticket.priority.toLowerCase().includes(query)
          )
        }
        return true
      })
    }
  },

  actions: {
    loadTickets() {
      this.loading = true
      try {
        this.tickets = ticketUtils.getTickets()
        this.error = ''
      } catch (err) {
        this.error = 'Failed to load tickets'
      } finally {
        this.loading = false
      }
    },

    createTicket(ticketData) {
      this.loading = true
      try {
        const newTicket = ticketUtils.createTicket(ticketData)
        this.tickets.push(newTicket)
        this.error = ''
        return { success: true, ticket: newTicket }
      } catch (err) {
        this.error = 'Failed to create ticket'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    updateTicket(id, updates) {
      this.loading = true
      try {
        const updatedTicket = ticketUtils.updateTicket(id, updates)
        if (updatedTicket) {
          const index = this.tickets.findIndex(t => t.id === id)
          if (index !== -1) {
            this.tickets[index] = updatedTicket
          }
          this.error = ''
          return { success: true, ticket: updatedTicket }
        } else {
          this.error = 'Ticket not found'
          return { success: false, error: this.error }
        }
      } catch (err) {
        this.error = 'Failed to update ticket'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    deleteTicket(id) {
      this.loading = true
      try {
        const success = ticketUtils.deleteTicket(id)
        if (success) {
          this.tickets = this.tickets.filter(ticket => ticket.id !== id)
          this.error = ''
          return { success: true }
        } else {
          this.error = 'Failed to delete ticket'
          return { success: false, error: this.error }
        }
      } catch (err) {
        this.error = 'Failed to delete ticket'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})
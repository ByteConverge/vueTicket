// src/utils/tickets.js
export const ticketUtils = {
  getTickets: () => {
    let tickets = localStorage.getItem('ticketapp_tickets')
    
    if (!tickets) {
      const sampleTickets = [
        {
          id: '1',
          title: 'Website login issue',
          description: 'Users are unable to login to the website using their credentials.',
          status: 'open',
          priority: 'high',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          createdBy: 'admin@example.com'
        },
        // ... include all your sample tickets from React version
      ]
      
      localStorage.setItem('ticketapp_tickets', JSON.stringify(sampleTickets))
      tickets = JSON.stringify(sampleTickets)
    }
    
    return JSON.parse(tickets)
  },

  saveTickets: (tickets) => {
    localStorage.setItem('ticketapp_tickets', JSON.stringify(tickets))
  },

  createTicket: (ticketData) => {
    const tickets = ticketUtils.getTickets()
    const newTicket = {
      id: Date.now().toString(),
      title: ticketData.title,
      description: ticketData.description || '',
      status: ticketData.status || 'open',
      priority: ticketData.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: JSON.parse(localStorage.getItem('ticketapp_user'))?.email || 'Unknown'
    }
    
    tickets.push(newTicket)
    ticketUtils.saveTickets(tickets)
    return newTicket
  },

  updateTicket: (id, updates) => {
    const tickets = ticketUtils.getTickets()
    const ticketIndex = tickets.findIndex(ticket => ticket.id === id)
    
    if (ticketIndex !== -1) {
      tickets[ticketIndex] = {
        ...tickets[ticketIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      ticketUtils.saveTickets(tickets)
      return tickets[ticketIndex]
    }
    return null
  },

  deleteTicket: (id) => {
    const tickets = ticketUtils.getTickets()
    const filteredTickets = tickets.filter(ticket => ticket.id !== id)
    ticketUtils.saveTickets(filteredTickets)
    return true
  },

  getStats: () => {
    const tickets = ticketUtils.getTickets()
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      closed: tickets.filter(t => t.status === 'closed').length
    }
  }
}
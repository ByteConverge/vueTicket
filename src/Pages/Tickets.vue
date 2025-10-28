<!-- src/pages/Tickets.vue -->
<template>
  <Layout>
    <div class="container">
      <!-- Header -->
      <div class="tickets-header">
        <div>
          <h1>Ticket Management</h1>
          <p>Manage and track all support tickets</p>
        </div>
        <div class="tickets-actions">
          <input
            type="text"
            placeholder="Search tickets..."
            v-model="searchQuery"
            class="form-input"
            style="min-width: 200px;"
          />
          <select
            v-model="filter"
            class="form-select"
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <button
            @click="showCreateForm = true"
            :disabled="ticketsStore.loading"
            class="btn btn-primary"
          >
            + Create New Ticket
          </button>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="ticketsStore.error" class="alert alert-error">
        {{ ticketsStore.error }}
      </div>

      <!-- Search and Filter Info -->
      <div v-if="searchQuery || filter !== 'all'" class="alert alert-info">
        Showing {{ filteredTickets.length }} tickets
        <span v-if="searchQuery"> matching "{{ searchQuery }}"</span>
        <span v-if="filter !== 'all'"> with status "{{ filter.replace('_', ' ') }}"</span>
        <button
          @click="clearFilters"
          class="ml-2 underline hover:no-underline"
        >
          Clear filters
        </button>
      </div>

      <!-- Create Ticket Modal -->
      <div v-if="showCreateForm" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Create New Ticket</h2>
          </div>
          <div class="modal-body">
            <TicketForm
              :loading="ticketsStore.loading"
              @submit="handleCreateTicket"
              @cancel="showCreateForm = false"
            />
          </div>
        </div>
      </div>

      <!-- Edit Ticket Modal -->
      <div v-if="editingTicket" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Edit Ticket</h2>
          </div>
          <div class="modal-body">
            <TicketForm
              :ticket="editingTicket"
              :loading="ticketsStore.loading"
              @submit="handleUpdateTicket"
              @cancel="editingTicket = null"
            />
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Confirm Delete</h2>
          </div>
          <div class="modal-body">
            <p class="modal-message">
              Are you sure you want to delete this ticket? This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button @click="showDeleteModal = false" class="btn btn-ghost">
              Cancel
            </button>
            <button @click="confirmDelete" class="btn btn-danger">
              Delete Ticket
            </button>
          </div>
        </div>
      </div>

      <!-- Success/Error Modal -->
      <div v-if="showMessageModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ messageModalType === 'success' ? 'Success' : 'Error' }}</h2>
          </div>
          <div class="modal-body">
            <div :class="['modal-icon', messageModalType]">
              {{ messageModalType === 'success' ? '✅' : '❌' }}
            </div>
            <p class="modal-message">{{ messageModalText }}</p>
          </div>
          <div class="modal-footer">
            <button
              @click="showMessageModal = false"
              :class="['btn', messageModalType === 'success' ? 'btn-success' : 'btn-primary']"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Tickets Grid -->
      <div v-if="ticketsStore.loading && ticketsStore.tickets.length === 0" class="flex justify-center items-center py-20">
        <div class="spinner"></div>
        <span class="ml-2">Loading tickets...</span>
      </div>

      <div v-else-if="filteredTickets.length === 0" class="empty-state">
        <div class="empty-state-icon">📋</div>
        <h3>
          {{ searchQuery || filter !== 'all' ? 'No matching tickets' : 'No tickets found' }}
        </h3>
        <p>
          <span v-if="searchQuery">No tickets found matching "{{ searchQuery }}"</span>
          <span v-else-if="filter !== 'all'">No {{ filter.replace('_', ' ') }} tickets found.</span>
          <span v-else>Get started by creating your first ticket!</span>
        </p>
        <div class="flex gap-4 justify-center">
          <button
            v-if="searchQuery || filter !== 'all'"
            @click="clearFilters"
            class="btn btn-ghost"
          >
            Clear Filters
          </button>
          <button
            @click="showCreateForm = true"
            class="btn btn-primary"
          >
            Create Your First Ticket
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TicketCard
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          :ticket="ticket"
          @edit="handleEditTicket"
          @delete="handleDeleteTicket"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTicketsStore } from '../stores/tickets'
import Layout from '../components/layout/Layout.vue'
import TicketForm from '../components/tickets/TicketForm.vue'
import TicketCard from '../components/tickets/TicketCard.vue'

const ticketsStore = useTicketsStore()

const showCreateForm = ref(false)
const editingTicket = ref(null)
const filter = ref('all')
const searchQuery = ref('')
const showDeleteModal = ref(false)
const ticketToDelete = ref(null)
const showMessageModal = ref(false)
const messageModalText = ref('')
const messageModalType = ref('success')

const filteredTickets = computed(() => 
  ticketsStore.filteredTickets(filter.value, searchQuery.value)
)

const showMessage = (message, type = 'success') => {
  messageModalText.value = message
  messageModalType.value = type
  showMessageModal.value = true
}

const clearFilters = () => {
  searchQuery.value = ''
  filter.value = 'all'
}

const handleCreateTicket = async (ticketData) => {
  const result = await ticketsStore.createTicket(ticketData)
  if (result.success) {
    showCreateForm.value = false
    showMessage('Ticket created successfully!', 'success')
  } else {
    showMessage(`Failed to create ticket: ${result.error}`, 'error')
  }
}

const handleUpdateTicket = async (ticketData) => {
  const result = await ticketsStore.updateTicket(editingTicket.value.id, ticketData)
  if (result.success) {
    editingTicket.value = null
    showMessage('Ticket updated successfully!', 'success')
  } else {
    showMessage(`Failed to update ticket: ${result.error}`, 'error')
  }
}

const handleEditTicket = (ticket) => {
  editingTicket.value = ticket
}

const handleDeleteTicket = (ticketId) => {
  ticketToDelete.value = ticketId
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  const result = await ticketsStore.deleteTicket(ticketToDelete.value)
  if (result.success) {
    showMessage('Ticket deleted successfully!', 'success')
  } else {
    showMessage(`Failed to delete ticket: ${result.error}`, 'error')
  }
  showDeleteModal.value = false
  ticketToDelete.value = null
}

onMounted(() => {
  ticketsStore.loadTickets()
})
</script>
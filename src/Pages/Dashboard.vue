<!-- src/pages/Dashboard.vue -->
<template>
  <Layout>
    <div class="container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your support dashboard</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Stats -->
        <div class="lg:col-span-1">
          <div class="stats-grid">
            <div class="stat-card card">
              <div class="stat-number">{{ stats.total }}</div>
              <div class="stat-label">Total Tickets</div>
              <div class="text-sm text-gray-500 mt-2">All tickets in the system</div>
            </div>
            
            <div class="stat-card card stat-open">
              <div class="stat-number">{{ stats.open }}</div>
              <div class="stat-label">Open Tickets</div>
              <div class="text-sm text-gray-500 mt-2">Waiting for resolution</div>
            </div>
            
            <div class="stat-card card stat-progress">
              <div class="stat-number">{{ stats.in_progress }}</div>
              <div class="stat-label">In Progress</div>
              <div class="text-sm text-gray-500 mt-2">Currently being worked on</div>
            </div>
            
            <div class="stat-card card stat-closed">
              <div class="stat-number">{{ stats.closed }}</div>
              <div class="stat-label">Resolved Tickets</div>
              <div class="text-sm text-gray-500 mt-2">Successfully completed</div>
            </div>
          </div>
        </div>

        <!-- Right Column - Actions and Overview -->
        <div class="lg:col-span-2">
          <div class="actions-grid">
            <div class="action-card card">
              <h3>Quick Actions</h3>
              <div class="space-y-4">
                <router-link to="/tickets" class="btn btn-primary w-full text-center justify-center">
                   Manage All Tickets
                </router-link>
                <router-link to="/tickets" class="btn btn-ghost w-full text-center justify-center" @click="handleCreateTicket">
                   Create New Ticket
                </router-link>
                <button class="btn btn-ghost w-full text-center justify-center">
                   View Reports
                </button>
              </div>
            </div>

            <div class="action-card card">
              <h3>Recent Activity</h3>
              <div class="space-y-4">
                <div v-if="stats.open > 0" class="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                      <span class="text-warning-600"></span>
                    </div>
                    <div>
                      <div class="font-medium text-warning-700">{{ stats.open }} Open Tickets</div>
                      <div class="text-sm text-warning-600">Need immediate attention</div>
                    </div>
                  </div>
                  <div class="text-warning-600 font-bold">{{ stats.open }}</div>
                </div>
                
                <div v-if="stats.in_progress > 0" class="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span class="text-primary-600"></span>
                    </div>
                    <div>
                      <div class="font-medium text-primary-700">{{ stats.in_progress }} In Progress</div>
                      <div class="text-sm text-primary-600">Currently being resolved</div>
                    </div>
                  </div>
                  <div class="text-primary-600 font-bold">{{ stats.in_progress }}</div>
                </div>
                
                <div v-if="stats.closed > 0" class="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                      <span class="text-success-600"></span>
                    </div>
                    <div>
                      <div class="font-medium text-success-700">{{ stats.closed }} Resolved</div>
                      <div class="text-sm text-success-600">Successfully completed</div>
                    </div>
                  </div>
                  <div class="text-success-600 font-bold">{{ stats.closed }}</div>
                </div>
                
                <div v-if="stats.total === 0" class="text-center py-4">
                  <div class="text-4xl mb-2"></div>
                  <p class="text-gray-600">No tickets yet. Create your first ticket to get started!</p>
                </div>
              </div>
            </div>

            <div class="action-card card">
              <h3>Priority Overview</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-error-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-error-100 rounded-full flex items-center justify-center">
                      <span class="text-error-600 text-sm"></span>
                    </div>
                    <span class="font-medium text-error-700">Urgent</span>
                  </div>
                  <span class="font-bold text-error-600">1</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-warning-100 rounded-full flex items-center justify-center">
                      <span class="text-warning-600 text-sm"></span>
                    </div>
                    <span class="font-medium text-warning-700">High</span>
                  </div>
                  <span class="font-bold text-warning-600">2</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                      <span class="text-primary-600 text-sm"></span>
                    </div>
                    <span class="font-medium text-primary-700">Medium</span>
                  </div>
                  <span class="font-bold text-primary-600">2</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                      <span class="text-success-600 text-sm"></span>
                    </div>
                    <span class="font-medium text-success-700">Low</span>
                  </div>
                  <span class="font-bold text-success-600">1</span>
                </div>
              </div>
            </div>

            <div class="action-card card">
              <h3>Quick Stats</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                  <span class="text-gray-600">Resolution Rate</span>
                  <span class="font-bold text-success-600">
                    {{ stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0 }}%
                  </span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                  <span class="text-gray-600">Avg. Response Time</span>
                  <span class="font-bold text-primary-600">2.3h</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-600">Customer Satisfaction</span>
                  <span class="font-bold text-warning-600">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTicketsStore } from '../stores/tickets'
import Layout from '../components/layout/Layout.vue'

const router = useRouter()
const ticketsStore = useTicketsStore()

const stats = computed(() => ticketsStore.getStats())

const handleCreateTicket = () => {
  // This will be handled by the tickets page
  setTimeout(() => {
    const createButton = document.querySelector('.tickets-actions .btn-primary')
    if (createButton) createButton.click()
  }, 100)
}

onMounted(() => {
  ticketsStore.loadTickets()
})
</script>
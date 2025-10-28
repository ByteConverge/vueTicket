<!-- src/components/tickets/TicketCard.vue -->
<template>
  <div class="card ticket-card">
    <div class="ticket-header">
      <h3 class="ticket-title">{{ ticket.title }}</h3>
      <div class="ticket-actions">
        <button
          @click="$emit('edit', ticket)"
          class="btn btn-ghost btn-sm"
          title="Edit ticket"
        >
          ✏️
        </button>
        <button
          @click="$emit('delete', ticket.id)"
          class="btn btn-ghost btn-sm text-error-600"
          title="Delete ticket"
        >
          🗑️
        </button>
      </div>
    </div>

    <p v-if="ticket.description" class="ticket-description">
      {{ ticket.description }}
    </p>

    <div class="ticket-meta">
      <span :class="['status-badge', `status-${ticket.status}`]">
        {{ ticket.status.replace('_', ' ') }}
      </span>
      <span :class="['priority-badge', `priority-${ticket.priority}`]">
        {{ ticket.priority }}
      </span>
    </div>

    <div class="ticket-footer">
      <span>Created: {{ formatDate(ticket.createdAt) }}</span>
      <span v-if="ticket.updatedAt !== ticket.createdAt">
        Updated: {{ formatDate(ticket.updatedAt) }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.ticket-card {
  transition: all 0.3s ease;
  height: 100%;
}

.ticket-card:hover {
  transform: translateY(-2px);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-3);
  gap: var(--space-2);
}

.ticket-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--gray-900);
  flex: 1;
  margin: 0;
  line-height: 1.4;
}

.ticket-actions {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}

.ticket-description {
  color: var(--gray-600);
  margin-bottom: var(--space-4);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ticket-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--gray-500);
  flex-wrap: wrap;
  gap: var(--space-2);
}

/* Priority Colors */
.priority-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: capitalize;
}

.priority-low {
  background: var(--success-100);
  color: var(--success-700);
}

.priority-medium {
  background: var(--primary-100);
  color: var(--primary-700);
}

.priority-high {
  background: var(--warning-100);
  color: var(--warning-700);
}

.priority-urgent {
  background: var(--error-100);
  color: var(--error-700);
}
</style>
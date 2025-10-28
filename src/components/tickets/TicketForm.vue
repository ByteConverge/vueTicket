<!-- src/components/tickets/TicketForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="form-group">
      <label for="title" class="form-label">Title *</label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        :class="['form-input', { error: errors.title }]"
        placeholder="Enter ticket title"
        :disabled="loading"
      />
      <div v-if="errors.title" class="form-error">
        {{ errors.title }}
      </div>
    </div>

    <div class="form-group">
      <label for="description" class="form-label">Description</label>
      <textarea
        id="description"
        v-model="formData.description"
        class="form-input"
        rows="4"
        placeholder="Enter ticket description (optional)"
        :disabled="loading"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="form-group">
        <label for="status" class="form-label">Status *</label>
        <select
          id="status"
          v-model="formData.status"
          :class="['form-input', { error: errors.status }]"
          :disabled="loading"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <div v-if="errors.status" class="form-error">
          {{ errors.status }}
        </div>
      </div>

      <div class="form-group">
        <label for="priority" class="form-label">Priority</label>
        <select
          id="priority"
          v-model="formData.priority"
          class="form-input"
          :disabled="loading"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    </div>

    <div class="flex gap-4 justify-end pt-4 border-t">
      <button
        type="button"
        @click="handleCancel"
        class="btn btn-ghost"
        :disabled="loading"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="loading"
      >
        <span v-if="loading" class="flex items-center gap-2">
          <div class="spinner"></div>
          Saving...
        </span>
        <span v-else>{{ props.ticket ? 'Update Ticket' : 'Create Ticket' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  ticket: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({
  title: '',
  description: '',
  status: 'open',
  priority: 'medium'
})

const errors = ref({})

// Watch for ticket prop changes (for editing)
watch(() => props.ticket, (newTicket) => {
  if (newTicket) {
    formData.title = newTicket.title || ''
    formData.description = newTicket.description || ''
    formData.status = newTicket.status || 'open'
    formData.priority = newTicket.priority || 'medium'
  } else {
    // Reset form when creating new ticket
    formData.title = ''
    formData.description = ''
    formData.status = 'open'
    formData.priority = 'medium'
  }
  errors.value = {}
}, { immediate: true })

const validateForm = () => {
  const newErrors = {}
  
  if (!formData.title.trim()) {
    newErrors.title = 'Title is required'
  }
  
  if (!formData.status) {
    newErrors.status = 'Status is required'
  } else if (!['open', 'in_progress', 'closed'].includes(formData.status)) {
    newErrors.status = 'Invalid status value'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', { ...formData })
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>
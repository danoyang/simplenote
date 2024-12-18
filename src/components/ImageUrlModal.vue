<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'urlSubmitted', url: string): void
  (e: 'close'): void
}>()

const imageUrl = ref('')
const error = ref('')

const handleSubmit = () => {
  if (!imageUrl.value.trim()) {
    error.value = 'Please enter a URL'
    return
  }
  emit('urlSubmitted', imageUrl.value.trim())
  imageUrl.value = ''
  error.value = ''
}

const handleCancel = () => {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
    <div class="bg-white p-4 rounded-lg shadow-lg w-96">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Add Image</h3>
        <button
          @click="handleCancel"
          class="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      <input
        type="url"
        v-model="imageUrl"
        placeholder="Enter image URL"
        class="w-full border p-2 rounded mb-4"
        @keyup.enter="handleSubmit"
      />
      <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>
      <div class="flex justify-end gap-2">
        <button
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded"
          @click="handleSubmit"
          :disabled="!imageUrl.trim()"
        >
          Add Image
        </button>
      </div>
    </div>
  </div>
</template>

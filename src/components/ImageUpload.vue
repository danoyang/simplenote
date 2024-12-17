<script setup lang="ts">
import { ref } from 'vue'
import { config } from '../config'

const emit = defineEmits<{
  (e: 'imageUploaded', url: string): void
}>()

const uploading = ref(false)
const error = ref('')

async function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true
  error.value = ''

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(`${config.backendUrl}/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    emit('imageUploaded', data.url)
  } catch (e) {
    error.value = 'Upload failed'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div>
    <input
      type="file"
      accept="image/*"
      @change="handleFileUpload"
      :disabled="uploading"
    />
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </div>
</template>

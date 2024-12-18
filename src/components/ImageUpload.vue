<script setup lang="ts">
import { ref } from 'vue'
import { config } from '../config'

const emit = defineEmits<{
  (e: 'imageUploaded', url: string): void
  (e: 'close'): void
  (e: 'switchToUrl'): void
}>()

const uploading = ref(false)
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

async function handleFileUpload(event: Event) {
  try {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) {
      return
    }
    const file = input.files[0]
    if (!file.type.startsWith('image/')) {
      error.value = 'Please select an image file'
      return
    }

    uploading.value = true
    error.value = ''

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${config.backendUrl}/upload`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    if (!data.url) {
      throw new Error('Invalid response from server')
    }

    const imageUrl = data.url.startsWith('http')
      ? data.url
      : `${config.backendUrl}${data.url}`
    emit('imageUploaded', imageUrl)
  } catch (err: any) {
    console.error('File upload error:', err)
    error.value = err.message || 'Upload failed. Please try again.'
  } finally {
    uploading.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
    <div class="upload-container p-4 border rounded shadow-lg bg-white max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Upload Image</h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      <div class="space-y-4">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileUpload"
          class="hidden"
          :disabled="uploading"
        />
        <div v-if="uploading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Uploading...</p>
        </div>
        <div v-else class="text-center">
          <button
            @click="triggerFileInput"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mb-2"
            :disabled="uploading"
          >
            Choose Image
          </button>
          <div class="mt-2">
            <button
              @click="$emit('switchToUrl')"
              class="text-blue-500 hover:text-blue-700 text-sm underline"
            >
              Enter URL Instead
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, GIF</p>
          <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

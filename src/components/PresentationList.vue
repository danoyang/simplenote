<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storage } from '../utils/storage'
import { nanoid } from 'nanoid'
import FileOperations from './FileOperations.vue'
import type { Presentation } from '../types/presentation'

const presentations = ref<Presentation[]>([])
const fileOperationsRef = ref<InstanceType<typeof FileOperations> | null>(null)

const emit = defineEmits<{
  (e: 'select', presentation: Presentation): void
}>()

const createNewPresentation = () => {
  const newPresentation: Presentation = {
    id: nanoid(),
    name: `Presentation ${presentations.value.length + 1}`,
    elements: [],
    lastModified: Date.now()
  }
  storage.savePresentation(newPresentation)
  loadPresentations()
  emit('select', newPresentation)
}

const deletePresentation = (id: string) => {
  if (confirm('Are you sure you want to delete this presentation?')) {
    storage.deletePresentation(id)
    loadPresentations()
  }
}

const importPresentation = (presentation: Presentation) => {
  storage.savePresentation(presentation)
  loadPresentations()
  emit('select', presentation)
}

const exportPresentation = (presentation: Presentation) => {
  fileOperationsRef.value?.handleExport(presentation)
}

const loadPresentations = () => {
  presentations.value = storage.getAllPresentations()
}

onMounted(loadPresentations)
</script>

<template>
  <div class="presentation-list p-4 bg-gray-50 rounded-lg">
    <FileOperations
      ref="fileOperationsRef"
      @import="importPresentation"
    />
    
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">My Presentations</h2>
      <div class="space-x-2">
        <button
          @click="$refs.fileOperationsRef?.$el.querySelector('input').click()"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Import
        </button>
        <button
          @click="createNewPresentation"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          New Presentation
        </button>
      </div>
    </div>
    
    <div class="space-y-2">
      <div
        v-for="presentation in presentations"
        :key="presentation.id"
        class="flex items-center justify-between p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow"
      >
        <div>
          <h3 class="font-medium">{{ presentation.name }}</h3>
          <p class="text-sm text-gray-500">
            Last modified: {{ new Date(presentation.lastModified).toLocaleDateString() }}
          </p>
        </div>
        <div class="space-x-2">
          <button
            @click="emit('select', presentation)"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            @click="exportPresentation(presentation)"
            class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Export
          </button>
          <button
            @click="deletePresentation(presentation.id)"
            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
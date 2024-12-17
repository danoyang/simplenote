<script setup lang="ts">
import { ref } from 'vue'
import { fileOperations } from '../utils/fileOperations'
import type { Presentation } from '../types/presentation'

const emit = defineEmits<{
  (e: 'import', presentation: Presentation): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const handleImport = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  try {
    const presentation = await fileOperations.importPresentation(file)
    emit('import', presentation)
    if (fileInput.value) {
      fileInput.value.value = '' // Reset file input
    }
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Failed to import presentation')
  }
}

const handleExport = (presentation: Presentation) => {
  fileOperations.exportPresentation(presentation)
}

defineExpose({
  handleExport
})
</script>

<template>
  <div class="file-operations">
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="hidden"
      @change="handleImport"
    >
  </div>
</template>
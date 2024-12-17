<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PresentationElement } from '../../types/presentation'

const props = defineProps<{
  element: PresentationElement
}>()

const emit = defineEmits<{
  (e: 'update', element: PresentationElement): void
}>()

const content = ref(props.element.content)
const fontSize = ref(props.element.fontSize || 100)

// Watch for external changes to element content
watch(() => props.element.content, (newContent) => {
  content.value = newContent
})

const updateElement = () => {
  emit('update', {
    ...props.element,
    content: content.value,
    fontSize: fontSize.value
  })
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  content.value = target.value
  updateElement()
}
</script>

<template>
  <div class="text-editor">
    <div class="mb-2">
      <input
        :value="content"
        class="w-full border p-2 rounded font-primary"
        @input="handleInput"
      >
    </div>
    <div class="flex items-center gap-2">
      <label class="text-sm">Font Size:</label>
      <input
        v-model="fontSize"
        type="range"
        min="20"
        max="200"
        step="1"
        class="flex-1"
        @input="updateElement"
      >
      <span class="text-sm">{{ fontSize }}px</span>
    </div>
  </div>
</template>

<style scoped>
.text-editor input[type="text"] {
  font-family: var(--font-primary);
}

/* Improve range input styling */
input[type="range"] {
  -webkit-appearance: none;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #2563eb;
}
</style>
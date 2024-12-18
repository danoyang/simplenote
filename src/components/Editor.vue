<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { nanoid } from 'nanoid'
import type { Presentation, PresentationElement } from '../types/presentation'
import { storage } from '../utils/storage'
import TextEditor from './editor/TextEditor.vue'
import ImageUpload from './ImageUpload.vue'
import ImageUrlModal from './ImageUrlModal.vue'

const props = defineProps<{
  presentation: Presentation
}>()

const emit = defineEmits<{
  (e: 'update', presentation: Presentation): void
}>()

const presentationName = ref(props.presentation.name)
const isEditing = ref(false)

const handleBlur = () => {
  isEditing.value = false
  updateName()
}

const updateName = () => {
  if (presentationName.value.trim() !== props.presentation.name) {
    const updatedPresentation = {
      ...props.presentation,
      name: presentationName.value.trim()
    }
    storage.savePresentation(updatedPresentation)
    emit('update', updatedPresentation)
  }
}

watch(() => props.presentation.name, (newName) => {
  presentationName.value = newName
})

const elements = ref<PresentationElement[]>(props.presentation.elements || [])
const showImageUpload = ref(false)
const showImageUrlModal = ref(false)

watch(elements, (newElements) => {
  const updatedPresentation: Presentation = {
    ...props.presentation,
    elements: newElements,
    lastModified: Date.now()
  }
  storage.savePresentation(updatedPresentation)
  emit('update', updatedPresentation)
}, { deep: true })

const addElement = (type: 'text' | 'image') => {
  if (type === 'image') {
    console.log('Setting showImageUpload to true')
    showImageUpload.value = true
    showImageUrlModal.value = false  // Ensure URL modal is closed
    console.log('Current modal states:', { showImageUpload: showImageUpload.value, showImageUrlModal: showImageUrlModal.value })
    return
  }
  if (!Array.isArray(elements.value)) {
    elements.value = []
  }
  elements.value.push({
    id: nanoid(),
    type,
    content: 'New Text',
    sequence: (elements.value.length || 0) + 1
  })
}

const handleImageUrl = (url: string) => {
  if (!Array.isArray(elements.value)) {
    elements.value = []
  }
  elements.value.push({
    id: nanoid(),
    type: 'image',
    content: url,
    sequence: (elements.value.length || 0) + 1
  })
  showImageUrlModal.value = false
}

const handleImageUrlCancel = () => {
  showImageUrlModal.value = false
  showImageUpload.value = true
}

const updateElement = (element: PresentationElement) => {
  const index = elements.value.findIndex(e => e.id === element.id)
  if (index !== -1) {
    elements.value[index] = element
  }
}

const updateSequence = () => {
  elements.value.forEach((element, index) => {
    element.sequence = index + 1
  })
}
</script>

<template>
  <div class="editor-container p-4">
    <div class="toolbar mb-4">
      <div class="flex items-center gap-2 mb-4">
        <input
          type="text"
          v-model="presentationName"
          @blur="handleBlur"
          @keyup.enter="updateName"
          class="text-2xl font-bold px-2 py-1 border rounded"
          :class="{ 'border-transparent': !isEditing }"
          @focus="isEditing = true"
        />
      </div>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        @click="addElement('text')"
      >
        Add Text
      </button>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded"
        @click="addElement('image')"
      >
        Add Image
      </button>
    </div>

    <draggable
      v-model="elements"
      class="elements-list"
      @end="updateSequence"
      item-key="id"
    >
      <template #item="{ element }">
        <div class="element-item p-4 mb-2 bg-gray-100 rounded">
          <div class="flex justify-between items-start">
            <span class="sequence-number">{{ element.sequence }}</span>
            <div class="element-content flex-1 ml-4">
              <TextEditor
                v-if="element.type === 'text'"
                :element="element"
                @update="updateElement"
              />
              <div v-else class="image-container">
                <img
                  :src="element.content"
                  :alt="'Image ' + element.sequence"
                  class="max-w-full h-auto rounded shadow-sm"
                  @error="(e) => e.target.classList.add('error')"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <!-- Move modals outside the main container for proper z-index stacking -->
    <ImageUrlModal
      v-if="showImageUrlModal"
      @urlSubmitted="handleImageUrl"
      @close="handleImageUrlCancel"
    />

    <ImageUpload
      v-if="showImageUpload"
      @imageUploaded="(url) => {
        if (!Array.isArray(elements.value)) {
          elements.value = []
        }
        elements.value.push({
          id: nanoid(),
          type: 'image',
          content: url,
          sequence: (elements.value.length || 0) + 1
        })
        showImageUpload.value = false
      }"
      @close="() => { showImageUpload.value = false }"
      @switchToUrl="() => {
        showImageUpload.value = false
        showImageUrlModal.value = true
      }"
    />
  </div>
</template>

<style scoped>
.editor-container {
  max-width: 800px;
  margin: 0 auto;
}

.element-item {
  cursor: move;
}

.sequence-number {
  width: 24px;
  height: 24px;
  background: #333;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  max-width: 100%;
  margin: 1rem 0;
}

.image-container img.error {
  border: 2px solid #ef4444;
  padding: 0.5rem;
}
</style>

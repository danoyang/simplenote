<script setup lang="ts">
import { ref } from 'vue'
import Editor from './components/Editor.vue'
import Player from './components/Player.vue'
import PresentationList from './components/PresentationList.vue'
import type { Presentation } from './types/presentation'

const mode = ref<'list' | 'edit' | 'play'>('list')
const currentPresentation = ref<Presentation | null>(null)

const handlePresentationSelect = (presentation: Presentation) => {
  currentPresentation.value = presentation
  mode.value = 'edit'
}

const handlePresentationUpdate = (presentation: Presentation) => {
  currentPresentation.value = presentation
}

const goToList = () => {
  mode.value = 'list'
  currentPresentation.value = null
}
</script>

<template>
  <div class="app-container p-4">
    <div v-if="mode !== 'list'" class="mb-4">
      <button
        class="px-4 py-2 bg-gray-500 text-white rounded"
        @click="goToList"
      >
        ← Back to List
      </button>
    </div>

    <div v-if="mode === 'list'">
      <PresentationList
        @select="handlePresentationSelect"
      />
    </div>

    <template v-else>
      <div class="mode-switch mb-4 text-center">
        <button
          class="px-4 py-2 rounded"
          :class="mode === 'edit' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
          @click="mode = 'edit'"
        >
          Editor
        </button>
        <button
          class="px-4 py-2 rounded ml-2"
          :class="mode === 'play' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
          @click="mode = 'play'"
        >
          Player
        </button>
      </div>

      <Editor
        v-if="mode === 'edit' && currentPresentation"
        :presentation="currentPresentation"
        @update="handlePresentationUpdate"
      />
      <Player
        v-else-if="mode === 'play' && currentPresentation"
        :elements="currentPresentation.elements"
      />
    </template>
  </div>
</template>
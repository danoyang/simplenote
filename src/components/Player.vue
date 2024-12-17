<script setup lang="ts">
import { ref } from 'vue'
import type { PresentationElement } from '../types/presentation'
import Controls from './presentation/Controls.vue'
import PresentationArea from './presentation/PresentationArea.vue'
import { useKeyboardControls } from './presentation/KeyboardControls'

const props = defineProps<{
  elements: PresentationElement[]
}>()

const currentIndex = ref(-1)
const isPlaying = ref(false)

const nextElement = () => {
  if (currentIndex.value < props.elements.length - 1) {
    currentIndex.value++
  }
}

const previousElement = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const resetPresentation = () => {
  currentIndex.value = -1
  isPlaying.value = false
}

const startPresentation = () => {
  resetPresentation()
  isPlaying.value = true
  currentIndex.value = 0
}

useKeyboardControls(isPlaying, currentIndex, props.elements.length - 1)
</script>

<template>
  <div class="player-container min-h-screen flex flex-col items-center justify-center">
    <Controls
      @start="startPresentation"
      @reset="resetPresentation"
    />

    <PresentationArea
      :elements="elements"
      :current-index="currentIndex"
      :is-playing="isPlaying"
      @next="nextElement"
      @previous="previousElement"
    />

    <div class="mt-4 text-sm text-gray-500">
      Press Space/Right Arrow to advance, Left Arrow to go back
    </div>
  </div>
</template>
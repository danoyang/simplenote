<script setup lang="ts">
import { ref } from 'vue'
import type { PresentationElement } from '../../types/presentation'
import ElementDisplay from './ElementDisplay.vue'
import { useFullscreen } from '@vueuse/core'

const presentationArea = ref<HTMLElement | null>(null)
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(presentationArea)

defineProps<{
  elements: PresentationElement[]
  currentIndex: number
  isPlaying: boolean
}>()

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'previous'): void
}>()

const handleClick = (event: MouseEvent) => {
  // Left half of the screen triggers previous, right half triggers next
  const { clientX, currentTarget } = event
  if (currentTarget instanceof HTMLElement) {
    const halfWidth = currentTarget.offsetWidth / 2
    if (clientX < halfWidth) {
      emit('previous')
    } else {
      emit('next')
    }
  }
}
</script>

<template>
  <div class="presentation-container relative">
    <div 
      ref="presentationArea"
      class="presentation-area w-full max-w-3xl aspect-video bg-gray-100 relative overflow-hidden rounded-lg shadow-lg"
      :class="{ 'fullscreen': isFullscreen }"
      @click="handleClick"
    >
      <template v-for="(element, index) in elements" :key="element.id">
        <ElementDisplay
          v-if="isPlaying && index <= currentIndex"
          :element="element"
          :index="index"
          :current-index="currentIndex"
        />
      </template>

      <div 
        v-if="!isPlaying"
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
      >
        <p class="text-xl">Click Start to begin presentation</p>
      </div>

      <button
        v-if="isPlaying"
        class="fullscreen-button absolute bottom-4 right-4 p-2 bg-black bg-opacity-30 text-white rounded hover:bg-opacity-50 transition-opacity"
        @click.stop="toggleFullscreen"
      >
        <span v-if="isFullscreen">Exit Fullscreen</span>
        <span v-else>Enter Fullscreen</span>
      </button>

      <div v-if="isPlaying" class="navigation-hints absolute inset-x-0 bottom-4 flex justify-center gap-4 text-sm text-white opacity-50">
        <span>← Previous</span>
        <span>Next →</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.presentation-area {
  min-height: 400px;
  cursor: pointer;
}

.fullscreen {
  max-width: none !important;
  width: 100vw;
  height: 100vh;
  border-radius: 0;
}

.fullscreen-button {
  opacity: 0;
}

.presentation-area:hover .fullscreen-button,
.presentation-area:hover .navigation-hints {
  opacity: 0.8;
}

.navigation-hints {
  opacity: 0;
  transition: opacity 0.3s ease;
}
</style>
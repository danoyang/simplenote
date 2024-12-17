<script setup lang="ts">
import { computed } from 'vue'
import type { PresentationElement } from '../../types/presentation'
import TextElement from './TextElement.vue'

const props = defineProps<{
  element: PresentationElement
  index: number
  currentIndex: number
}>()

const isActive = computed(() => props.index === props.currentIndex)
const isPast = computed(() => props.index < props.currentIndex)
const isFuture = computed(() => props.index > props.currentIndex)
const offset = computed(() => Math.abs(props.currentIndex - props.index))

const opacity = computed(() => {
  if (isActive.value) return 1
  if (isFuture.value) return 0
  if (props.element.type === 'image') return 0
  
  // Past text elements have decreasing opacity
  switch (offset.value) {
    case 1: return 0.3
    case 2: return 0.1
    default: return 0
  }
})

// Calculate base spacing unit based on font size
const baseSpacing = computed(() => {
  const fontSize = props.element.fontSize || 100
  return fontSize * 1.5 // Increased to 150% of font size for more natural spacing
})

const yOffset = computed(() => {
  if (isActive.value) return 0
  if (isFuture.value) return baseSpacing.value
  return -baseSpacing.value * offset.value
})

const elementStyle = computed(() => ({
  opacity: opacity.value,
  transform: `translateY(${yOffset.value}px)`,
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
}))
</script>

<template>
  <Transition name="fade-slide">
    <div
      class="presentation-element absolute inset-0 flex items-center justify-center"
      :style="elementStyle"
    >
      <TextElement
        v-if="element.type === 'text'"
        :content="element.content"
        :font-size="element.fontSize"
      />
      <img
        v-else
        :src="element.content"
        class="max-w-full max-h-full object-contain"
        alt=""
      >
    </div>
  </Transition>
</template>

<style scoped>
.presentation-element {
  will-change: transform, opacity;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
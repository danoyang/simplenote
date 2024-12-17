<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  element: {
    id: string
    type: 'text' | 'image'
    content: string
    sequence: number
  }
  index: number
  currentIndex: number
}>()

const isActive = computed(() => props.index === props.currentIndex)
const isPast = computed(() => props.index < props.currentIndex)
const elementClasses = computed(() => ({
  'presentation-element': true,
  'is-active': isActive.value,
  'is-past': isPast.value,
  [`offset-${props.currentIndex - props.index}`]: isPast.value
}))
</script>

<template>
  <Transition>
    <div
      :class="elementClasses"
      class="absolute inset-0 flex items-center justify-center"
    >
      <div v-if="element.type === 'text'" class="text-2xl">
        {{ element.content }}
      </div>
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
  transition: all 0.3s ease-in-out;
}

.is-past {
  opacity: 0.3;
  transform: translateY(-30px);
}

.is-past.offset-1 { transform: translateY(-30px); }
.is-past.offset-2 { transform: translateY(-60px); }
.is-past.offset-3 { transform: translateY(-90px); }
.is-past.offset-4 { transform: translateY(-120px); }
.is-past.offset-5 { transform: translateY(-150px); }

/* Vue transition classes */
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
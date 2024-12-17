<!-- Wrapper component to handle motion logic -->
<script setup lang="ts">
import { computed } from 'vue'
import { useMotion } from '@vueuse/motion'
import { createVariants } from '../../utils/variants'

const props = defineProps<{
  isActive: boolean
  isPast: boolean
  offset: number
}>()

const variants = computed(() => 
  createVariants(props.isActive, props.isPast, props.offset)
)

const { target } = useMotion(variants.value)
</script>

<template>
  <div
    ref="target"
    class="motion-wrapper"
  >
    <slot />
  </div>
</template>

<style scoped>
.motion-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
}</style>
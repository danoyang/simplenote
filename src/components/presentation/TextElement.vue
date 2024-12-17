<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  content: string
  fontSize?: number
}>()

const style = computed(() => ({
  fontSize: `${props.fontSize || 100}px`,
  fontFamily: 'var(--font-primary)',
  lineHeight: 1.2
}))
</script>

<template>
  <div class="text-element" :style="style">
    {{ content }}
  </div>
</template>

<style scoped>
.text-element {
  max-width: 90%;
  word-wrap: break-word;
  text-align: center;
}
</style>
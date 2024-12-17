<script setup lang="ts">
defineEmits<{
  (e: 'start'): void
  (e: 'reset'): void
}>()
</script>

<template>
  <div class="controls mb-4">
    <button
      class="px-4 py-2 bg-green-500 text-white rounded mr-2"
      @click="$emit('start')"
    >
      Start
    </button>
    <button
      class="px-4 py-2 bg-red-500 text-white rounded"
      @click="$emit('reset')"
    >
      Reset
    </button>
  </div>
</template>
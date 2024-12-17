<script setup lang="ts">
defineProps<{
  type: 'text' | 'image'
  content: string
}>()
</script>

<template>
  <div class="element-content">
    <p v-if="type === 'text'" class="text-2xl">
      {{ content }}
    </p>
    <img
      v-else
      :src="content"
      class="max-w-full max-h-full object-contain"
      alt=""
    >
  </div>
</template>
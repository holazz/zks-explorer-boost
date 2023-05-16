<script setup lang="ts">
defineProps<{
  value: number
}>()
</script>

<template>
  <div>
    <span>{{ value }}</span>
  </div>
</template>

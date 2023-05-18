<script setup lang="ts">
import type { Tx } from '../../types'

defineProps<{
  value: number
  status: Tx['status']
}>()
</script>

<template>
  <span :class="{ failed: status === 'failed' }">{{ value }}</span>
</template>

<style scoped>
.failed {
  color: #d4d4d4;
}
</style>

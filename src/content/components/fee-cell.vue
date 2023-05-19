<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTippy } from 'vue-tippy'

const props = defineProps<{
  feeETH: number
  feeUSD: number
}>()

const tokenRef = ref<HTMLSpanElement>()

useTippy(tokenRef, {
  content: String(props.feeETH),
  theme: 'light',
})

const shortFeeETH = computed(() => {
  const prefixLength = 5
  const suffixLength = 2
  return `${props.feeETH}`.replace(
    new RegExp(`^(.{${prefixLength}}).*(.{${suffixLength}})$`),
    `$1...$2`
  )
})
</script>

<template>
  <div class="token-amount-symbol">
    <span ref="tokenRef" class="token-amount-short">{{ shortFeeETH }}</span>
    <div class="token-amount">{{ feeETH }}</div>
    <div class="token-icon-label token-icon">
      <a
        href="/address/0x0000000000000000000000000000000000000000"
        class="token-link"
        data-testid="tokens-icon"
      >
        <span class="token-symbol">
          <span>ETH</span>
        </span>
        <div class="token-icon-container sm">
          <div class="token-img-loader"></div>
          <img
            class="token-img loaded"
            src="https://firebasestorage.googleapis.com/v0/b/token-library.appspot.com/o/eth.svg?alt=media&amp;token=1985e3d8-3aa7-4d04-8839-565d4c341615"
            alt="ETH"
          />
        </div>
      </a>
    </div>
  </div>
  <span class="token-price">${{ feeUSD }}</span>
</template>

<style scoped>
.token-amount-symbol {
  display: flex;
  align-items: center;
}
.token-amount-short {
  display: none;
}
.token-amount {
  display: block;
}
.token-icon {
  margin-left: 0.25rem;
}
.token-price {
  margin-left: 0;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(156 163 175);
}
@media (min-width: 768px) {
  .token-amount-short {
    display: block;
  }
  .token-amount {
    display: none;
  }
}
</style>

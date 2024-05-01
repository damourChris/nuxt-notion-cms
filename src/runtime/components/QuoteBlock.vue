<script lang="ts" setup>
import type { QuoteBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { computed } from 'vue'
import RichText from './utils/RichText.vue'

const props = defineProps<{
  block: QuoteBlockObjectResponse
}>()

const quote = computed(() => {
  return props.block.quote.rich_text
})
</script>

<template>
  <div class="blockquote">
    <div style="background-color: black;" />
    <RichText
      v-for="text in quote"
      :key="text.plain_text"
      :rich-text="text"
    />
  </div>
</template>

<style scoped>
.blockquote {
  position: relative;
  padding: 1rem;
  border-left: 4px solid #333;
}
</style>

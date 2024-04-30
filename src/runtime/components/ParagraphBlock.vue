<script lang="ts" setup>
import { computed } from 'vue'
import type { ParagraphBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import RichText from './utils/RichText.vue'

const props = defineProps<{
  block: ParagraphBlockObjectResponse
}>()

const richText = computed(() => {
  return props.block.paragraph.rich_text
})
</script>

<template>
  <div>
    <RichText
      v-for="text in richText"
      :key="text.plain_text"
      :rich-text="text"
    />
  </div>
</template>

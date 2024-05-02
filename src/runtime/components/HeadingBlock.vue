<script lang="ts" setup>
import { computed } from 'vue'
import type { Heading1BlockObjectResponse, Heading2BlockObjectResponse, Heading3BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import RichText from './utils/RichText.vue'

const props = defineProps<{
  block: Heading1BlockObjectResponse | Heading2BlockObjectResponse | Heading3BlockObjectResponse
}>()

const headingComponent = computed(() => {
  return 'h' + props.block.type.split('_')[1]
})

const richText = computed(() => {
  if (props.block.type === 'heading_1') return props.block.heading_1.rich_text
  if (props.block.type === 'heading_2') return props.block.heading_2.rich_text
  if (props.block.type === 'heading_3') return props.block.heading_3.rich_text
  return []
})
</script>

<template>
  <component :is="headingComponent">
    <RichText
      v-for="text in richText"
      :key="text.plain_text"
      :rich-text="text"
    />
  </component>
</template>

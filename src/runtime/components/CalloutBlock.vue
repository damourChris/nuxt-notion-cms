<script lang="ts" setup>
import type { CalloutBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { h, computed } from 'vue'
import RichText from './utils/RichText.vue'

const props = defineProps<{
  block: CalloutBlockObjectResponse
}>()

const iconNode = computed(() => {
  const iconType = props.block.callout.icon?.type
  if (iconType === 'emoji') {
    return h('span', { innerHTML: props.block.callout.icon?.emoji })
  }
  if (iconType === 'file') {
    return h('img', {
      src: props.block.callout.icon?.file.url,
      alt: 'Callout icon',
    })
  }
  if (iconType === 'external') {
    return h('img', {
      src: props.block.callout.icon?.external.url,
      alt: 'Callout icon',
    })
  }
  return ''
})
</script>

<template>
  <div class="callout">
    <component :is="iconNode" />
    <RichText
      v-for="text in block.callout.rich_text"
      :key="text.plain_text"
      :rich-text="text"
    />
  </div>
</template>

<style scoped>
.callout {
  position: relative;
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .5rem;
  border-radius: 0.25rem;
  border: .1rem solid #333;
}
</style>

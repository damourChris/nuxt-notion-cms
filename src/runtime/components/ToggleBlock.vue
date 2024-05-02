<script lang="ts" setup>
import type { ToggleBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { computed } from 'vue'
import { isFullBlock } from '@notionhq/client'
import RichText from './utils/RichText.vue'
import BlockRenderer from './BlockRenderer.vue'
import { useNuxtApp } from '#app'

const props = defineProps<{
  block: ToggleBlockObjectResponse
}>()

const childrenList = await useNuxtApp().$notion.client.blocks.children.list({
  block_id: props.block.id,
})

const children = computed(() => {
  return childrenList.results.filter(isFullBlock)
})

const richText = computed(() => {
  return props.block.toggle.rich_text
})
</script>

<template>
  <details>
    <summary>
      <RichText
        v-for="text in richText"
        :key="text.plain_text"
        :rich-text="text"
      />
    </summary>
    <div>
      <BlockRenderer
        v-for="child in children"
        :key="child.id"
        :block="child"
      />
    </div>
  </details>
</template>

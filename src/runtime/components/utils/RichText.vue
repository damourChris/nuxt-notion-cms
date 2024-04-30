<script lang="ts" setup>
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { h, computed, type VNode } from 'vue'

const { richText } = defineProps<{
  richText: RichTextItemResponse
}>()

type RichTextRenderers = {
  [key: string]: (children: VNode, key: string) => VNode
}

const richTextRenderers: RichTextRenderers = {
  ['bold']: (children: VNode, key: string) => {
    return h('b', { key }, children)
  },
  ['italic']: (children: VNode, key: string) => {
    return h('i', { key }, children)
  },
  ['strikethrough']: (children: VNode, key: string) => {
    return h('del', { key }, children)
  },
  ['underline']: (children: VNode, key: string) => {
    return h('u', { key }, children)
  },
  ['code']: (children: VNode, key: string) => {
    return h('code', { key }, children)
  },
  ['color']: (children: VNode, key: string) => {
    if (richText.annotations.color === 'default') return h('span', { key }, children)
    if (richText.annotations.color.includes('background')) return h('span', { key, style: { backgroundColor: richText.annotations.color.split('_')[0] } }, children)
    return h('span', { key, style: { color: richText.annotations.color } }, children)
  },
}

const richTextNode = computed(() => {
  const annotations = []

  for (const entries of Object.entries(richText.annotations)) {
    const key = entries[0]
    const value = entries[1]

    if (value) {
      annotations.push(key)
    }
  }

  const base = h('span', { key: 'base' }, richText.plain_text)
  const res = annotations.reduce((acc, annotation) => {
    return richTextRenderers[annotation](acc, annotation)
  }, base)

  return res
})
</script>

<template>
  <component :is="richTextNode" />
</template>

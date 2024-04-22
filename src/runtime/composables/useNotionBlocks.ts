import { useAsyncData } from '#app'

export const useNotionBlocks = (id: string) => {
  const response = useAsyncData(id, () => $fetch(`/api/notion/blocks/${id}`), {
    transform(data) {
      return {
        ...data,
        fetched_at: Date.now(),
      }
    },
    getCachedData(key, nuxtApp) {
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      if (!data) return

      // Stale if older than 5 minutes
      const isStale = Date.now() - data.fetched_at > 1000 * 60 * 5
      return isStale ? null : data
    },
  })

  return response
}

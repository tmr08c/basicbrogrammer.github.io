<template>
  <div>
    <ArticleCard
      v-for="article in articles"
      :key="article.slug"
      :article="article"
    />
  </div>
</template>

<script>
import ArticleCard from '@/components/ArticleCard'

export default {
  components: { ArticleCard },
  watchQuery: ['tag'],
  async asyncData({ $content, params, query }) {
    const articles = await $content('articles')
      .only(['title', 'description', 'img', 'slug', 'tags', 'cover_image'])
      .where({ tags: { $contains: query.tag || '' } })
      .sortBy('createdAt', 'asc')
      .fetch()

    return {
      articles,
    }
  },
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
</style>

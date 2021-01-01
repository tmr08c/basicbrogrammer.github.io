<template>
  <div class="mx-auto w-full md:w-3/4">
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
  async asyncData({ $content, params }) {
    const articles = await $content('articles', params.slug)
      .only(['title', 'description', 'img', 'slug', 'tags', 'cover_image'])
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

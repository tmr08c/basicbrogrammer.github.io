<template>
  <div class="my-4 border-2 rounded-lg border-primary">
    <nuxt-link :to="{ name: 'blog-slug', params: { slug: article.slug } }">
      <div
        class="cover-img"
        :style="{ backgroundImage: `url(${article.cover_image})` }"
      ></div>
    </nuxt-link>
    <div class="p-3">
      <nuxt-link :to="{ name: 'blog-slug', params: { slug: article.slug } }">
        <h3 class="font-bold tracking-wider text-center color-secondary">
          {{ article.title }}
        </h3>
      </nuxt-link>
      <p class="py-1 my-2 font-medium border-t-2">
        {{ article.description }}
      </p>
      <ArticleTag v-for="tag in tags" :key="tag" :tag="tag" />
    </div>
  </div>
</template>

<script>
import ArticleTag from '@/components/ArticleTag'

export default {
  components: { ArticleTag },
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tags() {
      return this.article.tags.split(',').map((tag) => tag.trim())
    },
  },
}
</script>

<style scoped>
.cover-img {
  display: block;
  width: 100%;
  height: auto;
  padding-bottom: 25%;
  background-size: cover;
  background-position: center center;
  @apply rounded-lg;
}
</style>

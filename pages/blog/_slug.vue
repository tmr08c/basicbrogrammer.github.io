<template>
  <div>
    <img :src="article.cover_image" class="border-2 rounded-lg" />
    <h1 class="color-primary text-3xl font-extrabold my-1">
      {{ article.title }}
    </h1>
    <div class="m-2 flex flex-wrap">
      <ArticleTag v-for="tag in tags" :key="tag" :tag="tag" />
    </div>
    <nuxt-content :document="article" class="my-2" />
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const article = await $content('articles', params.slug).fetch()

    return { article }
  },
  computed: {
    tags() {
      return this.article.tags.split(',').map((tag) => tag.trim())
    },
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    },
  },
}
</script>

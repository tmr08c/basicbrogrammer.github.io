<template>
  <div class="p-3 border-2 rounded-lg border-primary">
    <h3 class="font-bold tracking-wider text-center color-secondary">
      {{ article.title }}
    </h3>
    <p class="py-1 my-2 font-medium border-t-2">
      {{ article.description }}
    </p>
    <ArticleTag v-for="tag in tags" :key="tag" :tag="tag" />
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

<!-- <style scoped></style> -->

<template>
  <div class="container">
    <nuxt-content :document="article" class="my-2" />
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const article = await $content('about').fetch()

    return { article }
  },
}
</script>

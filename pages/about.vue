<template>
  <div id="about-page">
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

<style>
#about-page p {
  @apply my-5;
}
</style>

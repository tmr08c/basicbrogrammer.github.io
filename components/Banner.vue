<template>
  <div class="banner">
    <slot />
  </div>
</template>

<script>
export default {}
</script>
<style scoped>
.blah {
  @apply bg-white;
}
.banner {
  padding: 1em;
  @apply border-2 rounded-lg border-red-600;
  @apply p-1 mb-3 bg-red-100;
}
h2 {
  color: red;
  @apply text-red-600 font-semibold;
}
p {
  @apply font-light;
}
</style>

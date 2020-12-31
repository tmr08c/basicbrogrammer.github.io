<template>
  <span :class="tag">{{ tag }}</span>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
span {
  @apply p-1 m-1 border-2 rounded-lg border-current font-mono;
}
.react {
  color: #61dafb;
  background-color: #282c34;
}
.javascript {
  color: black;
  background-color: #fcdc00;
}
.redux {
  color: white;
  background-color: #764abc;
  border-color: black;
}
</style>

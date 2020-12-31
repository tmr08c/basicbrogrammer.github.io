<template>
  <aside
    class="flex flex-col justify-between flex-none w-3/4 h-screen px-4 py-5 border-r-2 fixed md:relative md:w-1/4 border-secondary"
  >
    <ul class="flex flex-col items-start font-semibold tracking-wider">
      <li class="self-center">
        <img
          class="w-24 h-24 border-4 border-double rounded-full border-primary"
          src="~/assets/images/prof-pic.jpg"
          alt="Jeremy Ward"
        />
      </li>
      <li>
        <nuxt-link to="/about" @click="console.log('hey there')">
          ReadMe
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="/"> Blog </nuxt-link>
      </li>
      <!-- <li> -->
      <!-- <nuxt-link to="/portfolio"> /Works </nuxt-link> -->
      <!-- </li> -->
      <li v-for="social in socials" :key="social.id" class="md:hidden">
        <a :href="social.href" target="_blank">
          {{ social.text }}
        </a>
      </li>
    </ul>
    <div class="justify-around hidden md:flex">
      <a
        v-for="social in socials"
        :key="social.id"
        :href="social.href"
        target="_blank"
      >
        <SocialIcon :for="social.id" />
      </a>
    </div>
  </aside>
</template>

<script>
import SocialIcon from '@/components/SocialIcon'

export default {
  components: { SocialIcon },
  data() {
    return {
      socials: [
        {
          id: 'github',
          text: 'GitHub',
          href: 'https://github.com/basicbrogrammer',
        },
        {
          id: 'twitter',
          text: 'Twitter',
          href: 'https://twitter.com/basicbrogrammer',
        },
        {
          id: 'instagram',
          text: 'Instagram',
          href: 'https://instagram.com/basicbrogrammer',
        },
      ],
    }
  },
}
</script>

<style scoped>
li {
  margin: 0.5rem 0;
}
aside {
  background-color: #f4f0ec;
}

li > a::before {
  content: '/';
  color: #ff124f;
}
</style>

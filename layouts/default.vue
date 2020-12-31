<template>
  <main>
    <div
      class="top-0 flex items-center w-screen h-10 border-b-2 md:hidden border-secondary"
    >
      <button
        class="btn-sidebar color-primary focus:outline-none focus:shadow-outline"
        @click="sideNavOpen = !sideNavOpen"
      >
        <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
          <path
            fill-rule="evenodd"
            :d="sidebarToggleIcon"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>

      <nuxt-link
        to="/"
        class="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline"
        >BasicBrogrammer</nuxt-link
      >
    </div>
    <div class="flex">
      <transition name="sidebar-slide">
        <SideBar v-if="showSideBar" />
      </transition>
      <article class="flex-grow p-4 mx-auto">
        <Nuxt />
      </article>
    </div>
  </main>
</template>
<script>
import SideBar from '@/components/SideBar'

export default {
  components: { SideBar },
  data() {
    return {
      sideNavOpen: false,
    }
  },
  computed: {
    showSideBar() {
      return window.innerWidth > 500 || this.sideNavOpen
    },
    sidebarToggleIcon() {
      return this.sideNavOpen
        ? 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
        : 'M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z'
    },
  },
  watch: {
    $route() {
      this.sideNavOpen = false
    },
  },
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: #feecfb;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.btn-sidebar {
  @apply px-3 rounded-lg;
}

.color-primary {
  color: #ff124f;
}
.color-secondary {
  color: #7a04eb;
}
.border-primary {
  border-color: #ff124f;
}
.border-secondary {
  border-color: #7a04eb;
}

.button--primary {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #ff124f;
  color: #ff124f;
  text-decoration: none;
  padding: 10px 30px;
}

.button--primary:hover {
  color: #fff;
  background-color: #ff124f;
}

/* Enter and leave animations can use different
 durations and timing functions.              */
.sidebar-slide-enter-active {
  transition: all 0.3s ease;
}
.sidebar-slide-leave-active {
  transition: all 0.3s ease;
}
.sidebar-slide-enter,
.sidebar-slide-leave-to {
  transform: translateX(-75px);
  opacity: 0;
}
</style>

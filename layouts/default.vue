<template>
  <main>
    <div
      class="navbar fixed bottom-0 flex items-center w-screen h-10 border-t-2 md:hidden border-secondary z-50"
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
    <div class="main-body">
      <transition name="sidebar-slide">
        <SideBar v-if="showSideBar" />
      </transition>
      <article class="w-screen p-4 md:w-3/4">
        <div class="mx-auto w-full md:w-3/4">
          <Nuxt />
        </div>
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
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    showSideBar() {
      return this.windowWidth > 767 || this.sideNavOpen
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
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    })
  },
}
</script>

<style>
.navbar {
  background-color: #f4f0ec;
}

.btn-sidebar {
  @apply px-3 rounded-lg;
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

/* above small */
@media only screen and (min-width: 767px) {
  article {
    margin-left: 25%;
  }
}

/* small */
@media only screen and (max-width: 767px) {
  .main-body {
    height: 95vh;
    overflow-y: auto;
  }
}
</style>

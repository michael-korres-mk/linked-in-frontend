<script setup>
import navItems from '@/navigation/horizontal'

// Components
import Footer from '@/layouts/components/Footer.vue'
import { HorizontalNavLayout } from '@layouts'
import UserSidebar from "@/layouts/components/UserSidebar.vue";

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref(null)

watch([
  isFallbackStateActive,
  refLoadingIndicator,
], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()
  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })
// !SECTION
</script>

<template>
  <HorizontalNavLayout :nav-items="navItems">


<!--    <NavBarI18n-->
<!--      v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"-->
<!--      :languages="themeConfig.app.i18n.langConfig"-->
<!--    />-->
<!--  <NavbarThemeSwitcher class="me-2" />-->

    <AppLoadingIndicator ref="refLoadingIndicator" />

          <div v-if="sideBarLayout()" class="my-page">
            <UserSidebar class="my-sidebar" />

            <div class="my-main">
              <!-- 👉 Pages -->
        <RouterView v-slot="{ Component }">

    <!--      <Breadcrumbs />-->

          <Suspense
            :timeout="0"
            @fallback="isFallbackStateActive = true"
            @resolve="isFallbackStateActive = false"
          >
            <Component :is="Component" />
          </Suspense>
        </RouterView>
      </div>
    </div>

    <div v-else >
      <!-- 👉 Pages -->
      <RouterView v-slot="{ Component }">

        <!--      <Breadcrumbs />-->

        <Suspense
          :timeout="0"
          @fallback="isFallbackStateActive = true"
          @resolve="isFallbackStateActive = false"
        >
          <Component :is="Component" />
        </Suspense>
      </RouterView>
    </div>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </HorizontalNavLayout>
</template>

<script>

export default {
  methods: {
    sideBarLayout() {
      return ['home'].includes(this.$route.name) //&& !(this.user.userRole === 'ADMIN') // TODO: check this out
    },
  }
}

</script>

<style lang="scss" scoped>
.my-page {
  display: grid;
  grid-template-areas: "sidebar main";
  grid-template-rows: 1fr; /* Only one row since we have a single horizontal layout */
  grid-template-columns: 25% 75%; /* Sidebar is 25%, main content is 75% */
}

.my-sidebar {
  grid-area: sidebar;
}

.my-main {
  grid-area: main;
}
</style>

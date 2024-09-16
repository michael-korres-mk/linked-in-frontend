<script setup>
import { HorizontalNav } from '@layouts/components'

// ℹ️ Using import from `@layouts` causing build to hangup

// import { useLayouts } from '@layouts'
import { useLayoutConfigStore } from '@layouts/stores/config'
import logo from "@images/logo.png";
import UserProfile from "@/layouts/components/UserProfile.vue";
import NavBarNotifications from "@/layouts/components/NavBarNotifications.vue";

const props = defineProps({
  navItems: {
    type: null,
    required: true,
  },
})

const configStore = useLayoutConfigStore()
</script>

<template>
  <div class="layout-wrapper" :class="configStore._layoutClasses">
    <VToolbar fixed class="layout-navbar-and-nav-container position-fixed">
        <VContainer fluid>
          <VRow>
            <VCol cols="3">
              <div class="mt-1">
                <img :src="`${logo}`" width="50%"  alt="logo"/>
              </div>
            </VCol>
            <VCol cols="8">
              <div class="mt-2">
                <div class="layout-horizontal-nav">
                  <div class="horizontal-nav-content-container">
                    <HorizontalNav :nav-items="navItems" />
                  </div>
                </div>
              </div>
            </VCol>
            <VCol cols="1">
              <div class="mt-6 mr-10 d-flex justify-content-between">
                <NavBarNotifications />
                <UserProfile />
              </div>
            </VCol>
          </VRow>

        </VContainer>

      <!-- 👉 Navbar -->
<!--      <div class="layout-navbar">-->
<!--        <div class="navbar-content-container">-->
<!--          <slot name="navbar" />-->
<!--        </div>-->
<!--      </div>-->
      <!-- 👉 Navigation -->
<!--      <div class="layout-horizontal-nav">-->
<!--        <div class="horizontal-nav-content-container">-->
<!--          <HorizontalNav :nav-items="navItems" />-->
<!--        </div>-->
<!--      </div>-->
    </VToolbar>

    <main class="my-layout-page-content">
      <slot />
    </main>

    <!-- 👉 Footer -->
    <footer class="layout-footer">
      <div class="footer-content-container">
        <slot name="footer" />
      </div>
    </footer>
  </div>
</template>

<style lang="scss">

.my-layout-page-content {
  margin-top:80px!important;
  margin-left:40px!important;
  margin-right:40px!important;
  overflow: hidden;

  > :first-child {
    max-block-size: 100%;
    overflow-y: auto;
  }
}

</style>

<script setup>
import { themeConfig } from '@themeConfig';

definePage({ meta: { layout: 'blank' } })

</script>

<template>
  <VCard
    flat
    :max-width="500"
    class="mt-12 mt-sm-0 pa-4"
  >
    <VCardText>
      <h4 class="text-h1 mb-1 text-bottom">
        <img
          src="@/assets/images/logo_blue.png"
          width="35"
          alt="LinkedIn"
        />
        <span class="ms-2 text-primary">{{ themeConfig.app.title }}</span>
      </h4>
      <p class="text-center text-primary font-18 mt-5">
        Καλώς Ήρθατε στο Linked In
      </p>
    </VCardText>
    <VCardText>
      <VRow>
        <VCol cols="12">
          <VBtn
            :disabled="!!hasToken"
            block
            @click="webLogin"
          >
            <span class="font-weight-light">Σύνδεση Χρήστη</span>
          </VBtn>
          <VSpacer/>
          <VBtn
            :disabled="!!hasToken"
            color="secondary"
            block
            @click="webSignup"
          >
            <span class="font-weight-light">Εγγραφή Χρήστη</span>
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script>
import {themeConfig} from "@themeConfig";

export default {
  computed: {
    hasToken() {
      return this.$route.query.token
    },
  },
  mounted() {
    if (this.hasToken) {
      this.authenticateUser(this.$route.query.token)
    }
  },
  methods: {
    webLogin() {
      this.$router.push({ name: 'login' })
    },
    webSignup() {
      this.$router.push({ name: 'sign-up' })
    },
  },
}
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

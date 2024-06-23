<script setup>
import logo from '@images/logo_white.png'
import { themeConfig } from '@themeConfig'

definePage({ meta: { layout: 'blank' } })

const logoImage = logo
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 me-0">
        <div class="d-flex align-center justify-center  w-100 h-100 bg-primary">
          <VImg
            max-width="505"
            :src="logoImage"
            class="auth-illustration mt-16 mb-2"
          />
        </div>
      </div>
    </VCol>
    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
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
    </VCol>
  </VRow>
</template>

<script>
import useJwt from "@/plugins/jwt/useJwt.js";

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
    if (this.hasError) {
      this.loginError()
    }
  },
  methods: {
    webLogin() {
      this.$router.push({ name: 'login' })
    },
    webSignup() {
      this.$router.push({ name: 'sign-up' })
    },
    authenticateUser(token) {
      useJwt.setToken(token)
      this.$store
        .jwtLogin(token)
        .then(res => {
          let userData = res.data
          userData.token = token
          this.$store.userData = userData
          sessionStorage.setItem('userData', JSON.stringify(userData))
          this.$router.push('/home')
        })
        .catch(error => {
          console.error('Authentication failed:', error)
          this.failedLogin = true
          this.loginError()
        })
    },
    loginError() {
      this.errorToast({
        title: 'Αδυναμία Σύνδεσης',
        text: 'Δεν βρέθηκε χρήστης με το συγκεκριμένο ΑΦΜ',
      })
    },
  },
}
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

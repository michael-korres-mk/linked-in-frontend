<script setup>
import logo from '@images/logo_white.png';
import { themeConfig } from '@themeConfig';
import useJwt from "@/plugins/jwt/useJwt.js";
definePage({ meta: { layout: 'blank' } })

</script>

<template>
  <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
    <VCardText>
      <h4 class="text-h1 mb-1 text-bottom">
        <img src="@/assets/images/logo_blue.png" width="35" alt="LinkedIn"/>
        <span class="ms-2 text-primary">{{ themeConfig.app.title }}</span>
      </h4>
      <p class="text-center text-primary font-18 mt-5"> Καλώς Ήρθατε στο Linked In </p>
    </VCardText>
    <VCardText>
      <VRow>
        <VCol cols="12">
          <AppTextField v-model="form.email" type="email" label="Email"/>
          <AppTextField v-model="form.password" type="password" label="Password"/>

          <div class="d-flex justify-end flex-wrap gap-3 padding-top-2">
            <VBtn color="secondary" variant="tonal" @click="returnToLoginWall"> Cancel </VBtn>

            <VBtn @click="myLoginUser">
              Login
              <VIcon end icon="tabler-arrow-right" class="flip-in-rtl"/>
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: 'admin@demo.com',
        password: 'admin',
        remember: false,
      },
      logoImage: logo,
    };
  },
  methods: {
    returnToLoginWall() {
      this.$router.push('/login-wall');
    },
    async myLoginUser() {
      console.log(this.form);

      let userData = await this.$store.jwtLoginCredentials(this.form.email, this.form.password);
      this.$store.userData = userData.data;
      sessionStorage.setItem('userData', JSON.stringify(userData.data));
      this.$router.push('/home');
    },
    authenticateUser(token) {
      useJwt.setToken(token);
      this.$store
        .jwtLogin(token)
        .then(res => {
          let userData = res.data;
          userData.token = token;
          this.$store.userData = userData;
          sessionStorage.setItem('userData', JSON.stringify(userData));
          this.$router.push('/home');
        })
        .catch(error => {
          console.error('Authentication failed:', error);
          this.failedLogin = true;
          this.loginError();
        });
    },
    loginError() {
      this.errorToast({
        title: 'Αδυναμία Σύνδεσης',
        text: 'Δεν βρέθηκε χρήστης με το συγκεκριμένο ΑΦΜ',
      });
    },
  },
  mounted() {
    if (this.hasToken) {
      this.authenticateUser(this.$route.query.token);
    }
    if (this.hasError) {
      this.loginError();
    }
  },
};
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

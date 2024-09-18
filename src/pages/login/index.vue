<script setup>
import { themeConfig } from '@themeConfig';
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

            <VBtn @click="() => authenticateUser()">
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
import useJwt from "@/plugins/jwt/useJwt.js";
import logo from '@images/logo_white.png';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: 'professional@demo.com',
        password: '111',
        remember: false,
      },
      logoImage: logo,
    };
  },
  methods: {
    returnToLoginWall() {
      this.$router.push('/login-wall');
    },
    async authenticateUser(token = null) {
      if(token !== null){
        useJwt.setToken(token);
      }

      await this.$store.jwtLogin(token,this.form.email, this.form.password)
        .then(res => {
          let userData = res.data;
          this.$store.userData = res.data;
          localStorage.setItem('userData', JSON.stringify(userData));
          useJwt.setToken(userData.token)
          this.$router.push((this.$store.isAdmin)? '/users' : '/home');
        })
        .catch(err => {this.loginError(err.response.data.message)})
      ;
    },
    loginError(errorMessage) {
      this.errorToast({
        title: 'Αδυναμία Σύνδεσης',
        text: errorMessage,
      });
    },
  },
  mounted() {
    if (this.hasError) {
      this.loginError();
    }
  },
};
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

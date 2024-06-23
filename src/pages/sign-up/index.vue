<script setup>
import logo from '@images/logo_white.png';
import { themeConfig } from '@themeConfig';
import useJwt from "@/plugins/jwt/useJwt.js";
import { defineStore } from 'pinia'

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
          <AppTextField v-model="form.firstName" label="Firstname"/>
          <AppTextField v-model="form.lastName" label="Lastname"/>
          <AppTextField v-model="form.mobile" type="phone" label="Phone Number"/>
          <AppTextField v-model="form.email" type="email" label="Email"/>
          <AppTextField v-model="form.username" label="Username"/>
          <AppTextField v-model="form.password" type="password" label="Password"/>
          <AppTextField v-model="form.confirmPassword" type="password" label="Confirm Password"/>

          <VFileInput label="Photo"/>

          <div class="d-flex justify-end flex-wrap gap-3 padding-top-2">
            <VBtn color="secondary" variant="tonal" @click="returnToLoginWall"> Cancel </VBtn>

            <VBtn @click="mySignUpUser">
              Sign Up
              <VIcon end icon="tabler-arrow-right" class="flip-in-rtl"/>
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

</template>

<script>

import {defineStore} from "pinia";
import useGenericEntityStore from "@/stores/entity.js";
import {themeConfig} from "@themeConfig";

export default {
  name: 'SignUp',
  data() {
    return {
      entityStore: defineStore('users', useGenericEntityStore('users'),)(),
      form: {
        email: '',
        firstName: '',
        lastName: '',
        username: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        photo:{}
      },
      logoImage: logo,
    };
  },
  methods: {
    returnToLoginWall() {
      this.$router.push('/login-wall');
    },
    async mySignUpUser() {

      const userData = await this.entityStore.saveEntity(this.form,false)

      this.$store.userData = userData;
      sessionStorage.setItem('userData', JSON.stringify(userData));
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

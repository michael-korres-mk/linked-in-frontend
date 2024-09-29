<script setup>
import { themeConfig } from '@themeConfig';
import { defineStore } from 'pinia'
import entityedit from "@/mixins/entityedit.js";

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
        <EntitySingle
          :key="componentKey"
          :config="config"
          :sections="sections"
          :entity="entity"
          hide-title
          hide-cancel-btn
          authority="users"
          @entityUpdated="setEntity"
          @editModeSet="editModeSet"
          @entitySaved="entitySaved"
        />
      </VRow>
    </VCardText>
  </VCard>

</template>

<script>
import logo from '@images/logo_white.png';
import {defineStore} from "pinia";
import useGenericEntityStore from "@/stores/entity.js";
import {themeConfig} from "@themeConfig";
import useJwt from "@/plugins/jwt/useJwt.js";

export default {
  mixins: [entityedit],
  name: 'SignUp',
  data() {
    return {
      entity: {
        workExperiences:[],
        educations:[],
        skills:[],
      },
      profileImage: null,
      componentKey : 0,
      entityStore: defineStore('users', useGenericEntityStore('users'),)(),
      // form: {
      //   email: '',
      //   firstName: '',
      //   lastName: '',
      //   username: '',
      //   mobile: '',
      //   password: '',
      //   confirmPassword: '',
      //   userRole:'PROFESSIONAL',
      //   photo:{}
      // },
      logoImage: logo,
    };
  },
  methods: {
    returnToLoginWall() {
      this.$router.push('/login-wall');
    },
    async signUpUser() {
      const response = await this.entityStore.saveEntity(this.form, false)
        .then(res => res)
        .catch(err => {
          this.signupError(err.response.data.message)
        })

      console.log(response)
      debugger

      await this.$store.jwtLogin(null, this.form.email, this.form.password)
        .then(res => {
          let userData = res.data;

          console.log(res.data)
          debugger
          this.$store.userData = res.data;
          localStorage.setItem('userData', JSON.stringify(userData));
          useJwt.setToken(userData.token)
          this.$router.push('/home');
        })
        .catch(err => {
          this.loginError(err.response.data.message)
        })
    },
    signupError(errorMessage) {
      this.errorToast({
        title: 'Αδυναμία Εγγραφής Χρήστη',
        text: errorMessage,
      })
    },
  },
  computed:{
    config() {
      return {
        endpoint: 'users',
        route: 'home',
        title: {
          geniki: 'Χρήστη',
        },
      }
    },
    sections() {
      return [
        {
          fields: this.formFields,
          title: this.$t('Information'),
        },

      ]
    },
    formFields() {
      return [
        {
          id: 'firstName',
          type: 'text',
          label: this.$t('User FirstName'),
          required: true,
          colSize: 12,
        },
        {
          id: 'lastName',
          type: 'text',
          label: this.$t('User LastName'),
          required: true,
          colSize: 12,
        },
        {
          id: 'mobile',
          type: 'text',
          label: this.$t('Telephone'),
          rules: ['phone'],
          colSize: 12,
        },
        {
          id: 'email',
          type: 'text',
          label: this.$t('Email'),
          rules: ['email'],
          required: true,
          colSize: 12,
        },
        {
          id: 'password',
          type: 'text',
          label: this.$t('Password'),
          required: true,
          colSize: 12,
        },
        {
          id: 'confirmPassword',
          type: 'text',
          label: this.$t('Confirm Password'),
          required: true,
          colSize: 12,
        },
      ]
    },
  },
};
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

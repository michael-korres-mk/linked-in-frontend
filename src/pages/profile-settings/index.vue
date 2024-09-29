<script setup>
import EntitySingle from '../../components/entity/EntitySingle.vue'
import editMixins from '../../mixins/entityedit'

definePage({
  meta: {
    authority: 'users',
  },
})
</script>

<template>
  <h1 class="text-center text-info mb-0">
    {{ title}}
  </h1>
  <VContainer fluid>
    <VRow>
      <VCol>
        <div class="card-wrapper">
          <div class="card-body">
            <EntitySingle
              :key="componentKey"
              :config="config"
              :form-fields="formFields"
              :entity="entity"
              hide-title
              :hide-cancel-button="!editMode"
              :return-to-list="false"
              authority="users"
              @entityUpdated="setEntity"
              @editModeSet="editModeSet"
              @entitySaved="entitySaved"
              @entityFetched="setEntity"
            />
          </div>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import useJwt from "@/plugins/jwt/useJwt.js";

export default {
  mixins: [editMixins],
  data() {
    return {
      entity: {
        authorities: [],
        roles: [],
      },
      componentKey: 0,
    }
  },
  async mounted() {
    this.entity = await this.$store.axiosGet({ url: 'users/settings/' + this.user.id })
  },
  computed: {
    title(){
      return this.$t("Settings")
    },
    config() {
      return {
        endpoint: 'users/settings',
        route: (this.$store.isAdmin)? 'users' : 'home',
        title: {
          geniki: 'Χρήστη',
        },
      }
    },
    formFields() {
      return [
        {
          id: 'email',
          type: 'text',
          label: this.$t('Email'),
          required: true,
          rules: ['email'],
          colSize: 12,
        },
        {
          id: 'password',
          type: 'text',
          label: (this.editMode)? this.$t('New Password') : this.$t('Password'),
          required: true,
          colSize: 12,
        },
        {
          id: 'confirmPassword',
          type: 'text',
          label: (this.editMode)? this.$t('Confirm New Password') :this.$t('Confirm Password'),
          required: true,
          hidden: !this.editMode,
          colSize: 12,
        },
      ]
    },
  },

  methods: {
    async entitySaved(entity) {
      this.entity = entity

      localStorage.setItem('userData', JSON.stringify({...this.user,token:entity.token}));
      useJwt.setToken(entity.token)

      this.componentKey++
    },
    loginError(errorMessage) {
      this.errorToast({
        title: 'Αδυναμία Σύνδεσης',
        text: errorMessage,
      });
    },
  },
}
</script>

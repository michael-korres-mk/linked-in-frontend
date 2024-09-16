<script setup>
import EntitySingle from '@/components/entity/EntitySingle.vue'
import entityedit from '@/mixins/entityedit.js'
</script>

<template>
  <h1 class="text-center text-info mb-0">{{ title }}</h1>
  <VContainer fluid>
    <VRow>
      <VCol>
        <div class="card-wrapper">
          <legend class="legend-title text-center">{{ title }}</legend>
          <div class="card-body">
            <EntitySingle
              :config="config"
              :entity="entity"
              :form-fields="formFields"
              hide-title
              @editModeSet="editModeSet"
            />
          </div>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
export default {
  mixins: [entityedit],
  data() {
    return {
      editMode: false,
      entity: {
        roles: [],
      },
      roleOptions: [],
    }
  },
  computed: {
    title(){
      return this.$t("Settings")
    },
    config() {
      return {
        endpoint: 'users',
        route: 'users',
        returnRoute: (this.$store.isAdmin)? 'users' : 'home',
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
          colSize: this.colSize,
        },
        {
          id: 'password',
          type: 'text',
          label: this.$t('Password'),
          required: true,
          colSize: this.colSize,
        },
        {
          id: 'confirmPassword',
          type: 'text',
          label: this.$t('Confirm Password'),
          required: true,
          hidden: !this.editMode,
          colSize: this.colSize,
        },
      ]
    },
    colSize() {
      return 12
    },

    sections() {
      return [
        {
          fields: this.formFields,
          title: 'Στοιχεία Χρήστη',
        },
      ]
    },
  },
  async mounted() {
    this.entity = await this.$store.axiosGet({ url: 'users/profile' })
  },
}
</script>

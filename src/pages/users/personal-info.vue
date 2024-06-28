<script setup>
import EntitySingle from '@/components/entity/EntitySingle.vue'
</script>

<template>
  <h1 class="text-center text-info mb-0">
    {{ title}}
  </h1>
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
            />
          </div>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
export default {
  data() {
    return {
      entity: {
        roles: [],
      },
      roleOptions: [],
    }
  },
  computed: {
    title(){
      return this.$t("Personal Info")
    },
    config() {
      return {
        endpoint: 'users',
        route: 'home',
        title: {
          geniki: 'Χρήστη',
        },
      }
    },

    formFields() {
      return [
        {
          id: 'firstName',
          type: 'text',
          label: this.$t('User FirstName'),
          required: true,
          colSize: this.colSize,
        },
        {
          id: 'lastName',
          type: 'text',
          label: this.$t('User LastName'),
          required: true,
          colSize: this.colSize,
        },
        {
          id: 'email',
          type: 'text',
          label: this.$t('Email'),
          required: true,
          rules: ['email'],
          readOnly: true,
          colSize: this.colSize,
        },
        {
          id: 'username',
          type: 'text',
          label: this.$t('Username'),
          rules: ['username'],
          disabled: true,
          colSize: this.colSize,
        },
        {
          id: 'mobile',
          type: 'text',
          label: this.$t('Telephone'),
          rules: ['phone'],
          required: true,
          colSize: this.colSize,
        },
      ]
    },
    colSize() {
      return 6
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

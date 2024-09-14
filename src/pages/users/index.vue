<script setup>
definePage({
  meta: {
    authority: 'users',
  },
})
</script>

<template>
  <div>
    <h1 class="text-center text-info">
      Διαχείριση Χρηστών
    </h1>
    <EntityList
      ref="entityList"
      :config="config"
      :columns="columns"
      :formatted-columns="formattedColumns"
      :filters="filters"
      :selections="selections"
      show-select
      authority="users"
      @itemSelected="handleSelectedChange"
    />
<!--    <VContainer fluid>-->
<!--      <div class="card-wrapper">-->
<!--        <legend class="legend-title">-->
<!--          Ανατεθειμένοι Ρόλοι-->
<!--        </legend>-->
<!--        <VRow class="text-center font-weight-bold font-size-20 my-4">-->
<!--          <VCol class="text-center text-darkred mx-7">-->
<!--            {{ rolesTitle }}-->
<!--          </VCol>-->
<!--        </VRow>-->
<!--        <div-->
<!--          v-if="selectedEntity"-->
<!--          class="card-body mx-3 mb-3"-->
<!--        >-->
<!--          <VDataTable-->
<!--            :headers="rolesHeaders"-->
<!--            :items="selectedEntity.roles"-->
<!--          >-->
<!--            <template #bottom />-->
<!--          </VDataTable>-->
<!--        </div>-->
<!--      </div>-->
<!--    </VContainer>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedEntity: null,
      selections: [],
      organizationOptions: [],
      roleOptions: [],
    }
  },
  mounted() {
    this.fetchRoles()
  },
  computed: {
    config() {
      return {
        endpoint: 'users',
        route: 'users',
        title: {
          single: 'User',
          plural: 'Users',
          geniki: 'User(gen)',
        },
      }
    },
    columns() {
      return [
        {
          key: 'id',
          title: 'Code User',
        },
        {
          key: 'firstName',
          title: 'User FirstName',
        },
        {
          key: 'lastName',
          title: 'User LastName',
        },
        {
          key: 'enabled',
          title: 'Status',
        },
      ]
    },
    formattedColumns() {
      return [
        { key: 'enabled', callback: 'booleanTitle' },
      ]
    },
    filters() {
      return [
        {
          id: 'id',
          type: 'number',
          label: this.$t('User Code'),
          colSize: 4,
        },
        {
          id: 'firstName',
          type: 'text',
          label: this.$t('User FirstName'),
          colSize: 4,
        },
        {
          id: 'lastName',
          type: 'text',
          label: this.$t('User LastName'),
          colSize: 4,
        },
        {
          id: 'email',
          type: 'text',
          label: this.$t('Email'),
          colSize: 4,
        },
        {
          id: 'enabled',
          type: 'select',
          label: this.$t('Status'),
          options: this.statusOptions,
          colSize: 4,
        },
        {
          id: 'userRole',
          type: 'select',
          label: this.$t('Role'),
          options: this.roleOptions,
          colSize: 8,
        },
      ]
    },
    rolesHeaders() {
      return [
        {
          key: 'assignDate',
          title: this.$t('Assign Date'),
        },
        {
          key: 'role.title',
          title: this.$t('User Role'),
        },
      ]
    },
    rolesTitle() {
      if (this.selectedEntity) {
        return `Ανατεθειμένοι Ρόλοι στον χρήστη: "${this.selectedEntity.title}"`
      }

      return 'Επιλέξτε Χρήστη για να εμφανιστούν οι ανατεθειμένοι ρόλοι του'
    },
  },
  methods: {
    handleSelectedChange(selectedItems) {
      this.selections = selectedItems
      this.selectedEntity = selectedItems.length ? selectedItems[0] : null
    },
    async fetchRoles(){
      this.roleOptions = await this.$store.roles()
      console.log(this.roleOptions)
    },
  },
}
</script>

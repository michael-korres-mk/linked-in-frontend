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
  <EntitySingle
    :key="componentKey"
    :config="config"
    :sections="sections"
    :entity="entity"
    authority="users"
    @entityUpdated="entityHasBeenUpdated"
    @editModeSet="editModeSet"
    @propUpdated="afterPropUpdate"
  >
<!--    <CardList-->
<!--      v-if="!editMode"-->
<!--      legend-title="User Rights"-->
<!--      no-data-title="Κανένα καταχωρημένο δικαίωμα στους ανατεθειμένους ρόλους"-->
<!--      :data-object="categorizedRights"-->
<!--    />-->
  </EntitySingle>
</template>

<script>
export default {
  mixins: [editMixins],
  data() {
    return {
      entity: {
        authorities: [],
        roles: [],
      },
      organizationOptions: [],
      roleOptions: [],
      editMode: !this.singleEdit,
      componentKey: 0,
    }
  },
  computed: {
    config() {
      return {
        endpoint: 'users',
        route: 'users',
        title: {
          geniki: 'Χρήστη',
        },
      }
    },
    sections() {
      return [
        {
          fields: this.formFields,
          title: 'Στοιχεία Χρήστη',
        },
      ]
    },
    formFields() {
      return [
        {
          id: 'id',
          type: 'text',
          label: this.$t('User Code'),
          readonly: true,
          colSize: 3,
          hidden: this.editMode,
        },
        {
          id: 'firstName',
          type: 'text',
          label: this.$t('User FirstName'),
          required: true,
          colSize: 3,
        },
        {
          id: 'lastName',
          type: 'text',
          label: this.$t('User LastName'),
          required: true,
          colSize: 3,
        },
        {
          id: 'email',
          type: 'text',
          label: this.$t('Email'),
          rules: ['email'],
          required: true,
          colSize: 3,
        },
        {
          id: 'mobile',
          type: 'text',
          label: this.$t('Telephone'),
          rules: ['phone'],
          required: true,
          colSize: 3,
        },
        {
          id: 'enabled',
          type: 'checkbox',
          label: this.$t('Status'),
          optionLabel: this.$t('enabled'),
          colSize: 3,
        },
        // {
        //   id: 'roles',
        //   type: 'select',
        //   object: true,
        //   options: this.roleOptions,
        //   multiple: true,
        //   label: this.$t('Roles'),
        //   colsize: 6,
        //   readonly: !this.editMode,
        // },
      ]
    },
    // notAssignedRoles() {
    //   if (!this.entity.roles || this.entity.roles.length == 0) {
    //     return this.roleOptions
    //   }
    //
    //   console.log(this.entity.roles)
    //
    //   const assignedRoleIds = this.entity.roles?.map(r => r.role.id)
    //
    //   return this.roleOptions.filter(r => !assignedRoleIds.includes(r.id))
    // },
    // categorizedRights() {
    //   return this.entity.authorities.reduce((acc, right) => {
    //     (acc[right.group.title] = acc[right.group.title] || []).push(
    //       right.title,
    //     )
    //
    //     return acc
    //   }, {})
    // },
  },
  async mounted() {
    this.setParentField()
  },
  methods: {
    entityHasBeenUpdated(entity) {
      this.setEntity(entity)
      // this.fetchRoles()
    },
    // async fetchRoles() {
    //   this.roleOptions = await this.$store.roles()
    // },
    afterPropUpdate(fieldObj) {
      if (fieldObj.id === 'organization') {
        // this.fetchRoles()
        this.entity.roles.splice(0, this.entity.roles.length)
      }
    },
  },
}
</script>

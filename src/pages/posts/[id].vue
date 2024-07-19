<script setup>
import EntitySingle from '../../components/entity/EntitySingle.vue'
// definePage({
//   meta: {
//     authority: 'posts',
//   },
// })
</script>

<template>
  <EntitySingle
    :key="componentKey"
    :config="config"
    :sections="sections"
    :entity="entity"
    authority="posts"
    @entityUpdated="entityHasBeenUpdated"
    @editModeSet="editModeSet"
    @propUpdated="afterPropUpdate"
  />
</template>

<script>
import editMixins from '../../mixins/entityedit'

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
        endpoint: 'posts',
        route: 'posts',
        returnRoute: 'home',
        title: {
          single: 'Post',
          plural: 'Posts',
          geniki: 'Post(gen)',
        },
      }
    },
    sections() {
      return [
        {
          fields: this.formFields,
          title: this.$t('Post Details'),
        },
      ]
    },
    formFields() {
      return [
        {
          id: 'id',
          type: 'text',
          label: this.$t('Post Code'),
          readonly: true,
          colSize: 4,
          hidden: this.editMode,
        },
        {
          id: 'title',
          type: 'text',
          label: this.$t('Title'),
          colSize: 8,
        },
        {
          id: 'description',
          type: 'text',
          label: this.$t('Description'),
          colSize: 12,
        },
        {
          id: 'file',
          type: 'file',
          filetype: 'png',
          label: this.$t('Photo'),
          rules: ['filesize'],
          filesize: 30,
          required: true,
          colSize: 9
        },
        {
          id: 'enabled',
          type: 'checkbox',
          label: this.$t('Status'),
          optionLabel: this.$t('enabled'),
          colSize: 3,
        },
      ]
    },
  },
  async mounted() {
    this.setParentField()
  },
  methods: {
    entityHasBeenUpdated(entity) {
      this.setEntity(entity)
    },
    afterPropUpdate(fieldObj) {
      if (fieldObj.id === 'photo') {
        // ... await this.$store.???()
      }
    },
  },
}
</script>

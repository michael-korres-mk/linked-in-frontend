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
    :secondary-tables="secondaryTables"
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
        photos: [],
        ordering: 1,
      },
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
          id: 'title',
          type: 'text',
          label: this.$t('Title'),
          colSize: 12,
        },
        {
          id: 'description',
          type: 'textarea',
          label: this.$t('Description'),
          colSize: 12,
        },
        // {
        //   id: 'enabled',
        //   type: 'checkbox',
        //   label: this.$t('Status'),
        //   optionLabel: this.$t('enabled'),
        //   colSize: 3,
        // },
      ]
    },
    secondaryTables() {
      return [
        {
          fields: [
            // {
            //   id: 'title',
            //   type: 'text',
            //   label: this.$t('Designation'),
            //   required: true,
            // },
            {
              id: 'file',
              type: 'file',
              filetype: ['image/*','audio/*','video/*'],
              label: this.$t('File'),
              rules: ['filesize'],
              filesize: 30,
              required: true,
              colSize: 9
            },
            {
              id: 'ordering',
              type: 'number',
              rules: ['minvalue'],
              minvalue: 1,
              required: true,
            },
          ],
          formattedColumns: [{ key: 'file', callback: 'renderFileUrl', handleClick: this.downloadFile }],
          hiddenColumns: ['ordering'],
          defaultItem: { ordering: 1 },
          title: this.$t('Uploaded Files'),
          property: 'photos',
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

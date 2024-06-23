<script setup>
import EntityList from '@/components/entity/EntityList.vue'
import EntitySingle from '@/components/entity/EntitySingle.vue'
import entityedit from '@/mixins/entityedit'

definePage({
  meta: {
    authority: 'users',
  },
})
</script>

<template>
  <EntityList
    ref="list"
    :config="config"
    :columns="columns"
    :formatted-columns="formattedColumns"
    :extra-actions="extraActions"
    :custom-query="customQuery"
    :blank-entity="entity"
    dialog-create
    single-edit
    filters-legend-title="Στοιχεία Αναζήτησης"
    legend-title="Οι Αιτήσεις μου"
    authority="submissions"
    @editModeSet="editModeSet"
    @itemFetched="itemFetched"
  >
    <template #editmodal>
      <EntitySingle
        :entity="entity"
        :config="config"
        :sections="sections"
        :single-edit="false"
        :return-to-list="false"
        hide-title
        @entitySaved="savedEntity"
        @editModeSet="editModeSet"
        @propUpdated="afterPropUpdate"
      />
    </template>
  </EntityList>
</template>

<script>
export default {
  expose: ['openCreateDialog'],
  mixins: [entityedit],
  props: {
    customQuery: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },
  data() {
    return {
      entity: { },
      requestCategoryOptions: [],
      circularOptions: [],
      requestTypeOptions: [],
      isLocked: false,
    }
  },
  computed: {
    config() {
      return {
        endpoint: 'submissions',
        route: 'submissions-category',
        title: {
          single: 'Submission',
          plural: 'Submissions',
          geniki: 'New Submission(gen)',
          createBtn: 'New Submission',
        },
      }
    },
    columns() {
      return [
        {
          key: 'submissionDate',
          title: 'Submission Date',
        },
        {
          key: 'requestType.requestCategory.title',
          title: 'Category',
        },
        {
          key: 'requestType.title',
          title: 'Submission Type',
        },
        {
          key: 'requestType.educationLevel',
          title: 'Level',
        },
        {
          key: 'status',
          title: 'Status',
        },
      ]
    },
    formattedColumns() {
      return [
        { key: 'submissionDate', callback: 'mediumDate' },
        { key: 'requestType.educationLevel', callback: 'translate' },
        { key: 'status', callback: 'translate' },
      ]
    },
    sections() {
      return [
        {
          fields: this.formFields,
          title: 'Στοιχεία Αναζήτησης',
        },

      ]
    },
    formFields() {
      return [
        {
          id: 'educationLevel',
          type: 'select',
          label: 'Σχολική Βαθμίδα',
          options: this.educationLevelOptions,
          readonly: true,
        },
        {
          id: 'requestCategory',
          type: 'select',
          label: 'Κατηγορία Αίτησης',
          options: this.requestCategoryOptions,
          readonly: this.isReadOnly || this.categoryToId > 0,
        },
        {
          id: 'circular',
          type: 'select',
          object: true,
          label: 'Επιλογή Εγκυκλίου',
          options: this.circularOptions,
          readonly: this.isReadOnly,
        },
        {
          id: 'requestType',
          type: 'select',
          object: true,
          label: 'Είδος Αίτησης',
          options: this.requestTypeOptions,
          readonly: this.isReadOnly,
        },
      ]
    },
    isReadOnly() {
      return this.isLocked
    },
    extraActions() {
      return [
        {
          icon: 'gavel',
          title: 'Objection',

          // renderCondition: {
          //   key: 'locked',
          //   value: true,
          // },
        },
      ]
    },

  },
  async mounted() {
    this.requestCategoryOptions = await this.$store.requestCategories()
    this.entity.requestCategory = this.categoryToId
    this.entity.educationLevel = this.$store.userData.educationLevel
  },

  methods: {
    editModeSet(mode) {
      if (!mode) {
        this.closeModal()
      }
    },

    closeModal() {
      this.$refs.list.closeModal(true)
      this.resetEntity()
    },

    async itemFetched(item) {
      this.entity = item
      await this.initializeOptions()
    },

    // initializing options
    async initializeOptions() {
      const { id: schoolYear } = this.schoolYearOptions[0] || {}
      const { educationLevel } = this.$store.userData

      if (schoolYear && educationLevel) {
        await this.updateCircularOptions(schoolYear, educationLevel)
        if (this.entity.circular) {
          await this.updateRequestTypeOptions(this.entity.circular)
        }
      }
    },

    // Updates the circular options based on the school year and education level
    async updateCircularOptions(schoolYear, educationLevel) {
      this.circularOptions = await this.$store.circularList(schoolYear, educationLevel)
    },

    // Updates the request type options based on the circular
    async updateRequestTypeOptions(circular) {
      this.requestTypeOptions = (await this.$store.axiosGet({ url: `circulars/${circular.id}` })).circularRequestTypes.map(item => ({
        id: item.requestType.id,
        title: item.requestType.title,
      }))
    },

    // Resets the entity with default values
    resetEntity() {
      const { educationLevel } = this.$store.userData

      this.entity = {
        requestCategory: this.categoryToId,
        educationLevel,
      }
      this.isLocked = false
    },

    // Opens the create dialog with defaults and payload information
    async openCreateDialog(payload) {
      this.isLocked = true

      const { educationLevel } = this.$store.userData
      const { circular, id: requestType, schoolYear } = payload

      this.entity = {
        requestType,
        requestCategory: this.categoryToId,
        circular,
        educationLevel,
        schoolYear: schoolYear || (this.schoolYearOptions[0]?.id),
      }
      
      await this.initializeOptions()
      this.$refs.list.handleAddClick()
    },

    async afterPropUpdate({ id, value }) {
      switch (id) {
      case 'educationLevel':
        await this.initializeOptions()
        break
      case 'circular':
        this.entity.requestType = null
        await this.updateRequestTypeOptions(value)
        break
      }
    },
    savedEntity(item) {
      this.closeModal()

      // TODO Untested
      this.$router.push({ name: 'submissions-category-id', params: { category: this.category, id: item.id } })
    },
  },
}
</script>

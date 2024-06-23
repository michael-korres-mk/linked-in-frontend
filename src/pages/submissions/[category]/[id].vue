<script setup>
import EntitySingle from '@/components/entity/EntitySingle.vue'
import entityMixins from '@/mixins/entityedit'

definePage({
  meta: {
    authority: 'submissions',
  },
})
</script>

<template>
  <EntitySingle
    :entity="entity"
    :config="config"
    :sections="sections"
    :extra-sections="extraSections"
    authority="submissions"
    @entityUpdated="setEntity"
    @entityFetched="entityFetched"
    @editModeSet="editModeSet"
  />
</template>

<script>
export default {
  mixins: [entityMixins],
  data() {
    return {
      entity: {},
      circularOptions: [],
      requestTypeOptions: [],
      requestCategoryOptions: [],
      extraSections: [],
    }
  },
  computed: {
    config() {
      return {
        endpoint: 'submissions',
        route: 'submissions',
        title: {
          single: 'Submission',
          plural: 'Submissions',
          geniki: 'Submission(gen)',
        },
      }
    },
    id() {
      return this.$route.params.id
    }, 
    category() {
      return this.$route.params.category
    }, 
    sections() {
      return [
        {
          fields: this.formFields,
          title: 'Στοιχεία Αίτησης',
        },
      ]
    },
    formFields() {
      return [
        {
          id: 'educationLevel',
          type: 'select',
          label: 'Σχολική Βαθμίδα',
          colSize: 6,
          options: this.educationLevelOptions,
        },
        {
          id: 'requestCategory',
          type: 'select',
          label: 'Κατηγορία Αίτησης',
          colSize: 6,
          options: this.requestCategoryOptions,
        },
        {
          id: 'circular',
          type: 'select',
          label: 'Επιλογή Εγκυκλίου',
          colSize: 6,
          options: this.circularOptions,
        },
        {
          id: 'requestType',
          type: 'select',
          label: 'Είδος Αίτησης',
          colSize: 6,
          options: this.requestTypeOptions,
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
    entityFetched(entity) {
      this.fetchFields(entity.requestType.id, entity.circular.publishDate)
    },
    async fetchFields(requestTypeId, circularDate) {
      this.extraSections = (await this.$store.submissionSections(requestTypeId))
        .filter(section => !!section.sectionFields.length)
        .map(section => ({
          ...section,
          fields: section.sectionFields
            .filter(field => this.isDateBetween(circularDate, field.activeFrom, field.activeTo))
            .map(item => {
              const field = item.field
              const type = field.type.toLowerCase()
              
              return {
                id: field.id,
                type,
                object: field.object,
                options: field.options,
                label: field.label,
                suffix: field.unit ? field.unit.title : null,
                extraClass: field.required ? 'required-field' : null,
                readonly: !this.editMode,
                colSize: field.size,
                helpText: field.helpText,
                step: type == 'number' ? 'any' : null,
                rules:
              (field.minValue ? 'min_value:' + field.minValue : '') +
              (field.minValue && field.maxValue ? '|' : '') +
              (field.maxValue ? 'max_value:' + field.maxValue : ''),
                autoupload: true,
              }
            }),
        }))
    },
  },
}
</script>


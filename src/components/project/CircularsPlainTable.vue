<script setup>
import CustomPlainTable from '@/components/project/CustomPlainTable.vue'
import EntityEditSection from '../entity/EntityEditSection.vue'

definePage({
  meta: {
    authority: 'circulars',
  },
})
</script>

<template>
  <VContainer fluid>
    <TableFilters
      ref="filters"
      :filters="filters"
      @applyFilters="applyFilters"
      @filterUpdated="filterUpdated"
      @resetFilters="resetFilters"
    />
   
    <div class="card-wrapper">
      <legend class="legend-title">
        Στοιχεία Εγκυκλίου
      </legend>
      <div class="card-body">
        <CustomPlainTable
          v-if="items.length"
          ref="list"
          :extra-actions="extraActions"
          :columns="columns"
          :items="items"
        >
          <template
            v-if="!hideHeaderContent"
            #extraHeaderContent
          >
            <div class="text-right">
              <VBtn
                color="primary"
                variant="outlined"
                @click="downloadCircular"
              >
                {{ $t('Download Circular') }}
                <FontAwesomeIcon
                  class="ms-2 color-orange"
                  :icon="['fas', 'cloud-arrow-down']"
                />
              </VBtn>
            </div>
          </template>
          <template
            v-if="!hideFooterContent"
            #extraFooterContent
          >
            <div class="text-right">
              <VBtn
                color="primary"
                variant="outlined"
                @click="downloadTables"
              >
                {{ $t('Download Tables') }}
                <FontAwesomeIcon
                  class="ms-2 color-orange"
                  :icon="['fas', 'table-cells']"
                />
              </VBtn>
            </div>
          </template>
        </CustomPlainTable>
        <div v-if="!items.length">
          <VAlert class="text-center">
            Παρακαλώ επιλέξτε απο τα παραπάνω φίλτρα Σχολικό Έτος, Σχολική Βαθμίδα και Εγκύκλιο για να εμφανίσετε τις διαθέσιμες Αιτήσεις.
          </VAlert>
        </div>
      </div>
    </div>

    <Dialog
      :open="dialog"
      :title="$t('Circular Dates Details')"
      :cancel-callback="() => (dialog = false)"
      hide-submit-btn
      persistent
    >
      <div class="card-wrapper mt-10 pb-5">
        <legend class="legend-title">
          {{ entityDialog.title }}
        </legend>
        <div class="card-body">
          <EntityEditSection
            :entity="entityDialog"
            :form-fields="formFields"
            authority="circulars"
          />
        </div>
      </div>
    </Dialog>
  </VContainer>
</template>

<script>
export default {
  props: {
    customQuery: {
      type: Object,
      default: () => ({}),
    },
    hideHeaderContent: {
      type: Boolean,
      default: false,
    },
    hideFooterContent: {
      type: Boolean,
      default: false,
    },
    hideLegend: {
      type: Boolean,
      default: false,
    },
    hideFilterLegend: {
      type: Boolean,
      default: false,
    },
    autoUpdateFilters: {
      type: Boolean,
      default: false,
    },
    hidePagination: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['itemFetched', 'submissionsDialogCreate'],
  data() {
    return {
      entity: {},
      items: [],
      entityDialog: {},
      dialog: false,
      circularOptions: [],
    }
  },
  computed: {
    config() {
      return{
        endpoint: 'circulars',
        route: 'circulars',
      }
    },
    columns() {
      return [
        {
          key: 'title',
          title: this.$t('Available Submissions'),
        },

      ]
    },
    filters() {
      return [
        {
          id: 'schoolYear',
          type: 'select',
          label: 'Σχολικό Έτος',
          options: this.schoolYearOptions,
          colSize: 2,
          initVal: this.schoolYearOptions[0].id,
        },
        {
          id: 'educationLevel',
          type: 'select',
          label: 'Σχολική Βαθμίδα',
          options: this.educationLevelOptions,
          colSize: 3,
          initVal: this.user.educationLevel,
        },
        {
          id: 'circular',
          type: 'select',
          label: 'Εγκύκλιος',
          options: this.circularOptions,
          colSize: 7,
        },
      ]
    },
    formFields() {
      return [
        {
          id: 'submissionStartDate',
          type: 'date',
          label: this.$t('Submission Period Start'),
          readonly: true,
          colSize: 6,
        },
        {
          id: 'submissionEndDate',
          type: 'date',
          label: this.$t('To'),
          readonly: true,
          colSize: 6,
        },
        {
          id: 'reviewStartDate',
          type: 'date',
          label: this.$t('Submission Evaluation Period Start'),
          readonly: true,
          colSize: 6,
        },
        {
          id: 'reviewEndDate',
          type: 'date',
          label: this.$t('To'),
          readonly: true,
          colSize: 6,
        },
        {
          id: 'resultsAnnouncementDate',
          type: 'date',
          label: this.$t('Table Anouncement Date'),
          readonly: true,
          colSize: 12,
        },
        {
          id: 'objectionStartDate',
          type: 'date',
          label: this.$t('Objection Period Start'),
          readonly: true,
          colSize: 6,
        },
        {
          id: 'objectionEndDate',
          type: 'date',
          label: this.$t('To'),
          readonly: true,
          colSize: 6,
        },
        {
          id: 'withdrawDeadLine',
          type: 'datetime-local',
          label: this.$t('Submission Withdraw Deadline'),
          readonly: true,
          colSize: 12,
        },
      ]
    },
    extraActions() {
      return [
        {
          icon: 'calendar-days',
          title: 'calendar',
          callback: this.callendarModal,
        },
        {
          icon: 'file',
          title: 'Submissions',
          callback: this.submissionRedirect,
          renderCondition: this.submissionRenderCondition,
        },
        {
          icon: 'file',
          title: 'Submissions',
          renderCondition: this.submissionRenderConditionDisabled,
          disabled: true,
        },
      ]
    },
  },

  // async mounted() {
  //   this.circularOptions = await this.$store.circularList(filterVals.schoolYear, filterVals.educationLevel)
  // },
  methods: {
    downloadCircular (item) {
      alert('Download Circular : '+ ' ' +this.$route.params.type)
    },
    downloadTables () {
      alert('Download Tables : '+ ' ' +this.$route.params.type)
    },

    callendarModal(item) {
      this.entityDialog = item
      this.dialog = true
    },  
    submissionRedirect(item) {
      const payload = { ...item, circular: this.$refs.filters?.filterVals?.circular }

      this.$emit('submissionsDialogCreate', payload)
    },
    submissionRenderCondition(item) {
      return this.dateNow() >= this.isoDateOnlyTrimmed(item.submissionStartDate)
    },
    submissionRenderConditionDisabled(item) {
      return this.dateNow() < this.isoDateOnlyTrimmed(item.submissionStartDate)
    },
    async filterUpdated(id) {
      const filterVals = this.$refs.filters.filterVals
      if (id === "schoolYear") {
        this.$refs.filters.filterVals.circular = null
        this.resetFilters()
      }
      if (id === "educationLevel") {
        this.$refs.filters.filterVals.circular = null
        this.resetFilters()
      }
      if (id === "circular") {
        this.resetFilters()
      }
      if (['schoolYear', 'educationLevel', 'circular'].includes(id) && filterVals.schoolYear && filterVals.educationLevel) {
        this.circularOptions = await this.$store.circularList(filterVals.schoolYear, filterVals.educationLevel)
      } else {
        this.circularOptions = []
        this.resetFilters()
      }
    },
    applyFilters(filterVals) {
      if (filterVals.circular !== null) {
        this.requestItemsFetch(filterVals)
      }
    },
    async requestItemsFetch(filterVals) {
      const response = await this.$store.axiosGet({ url: `circulars/${filterVals.circular}` })

      this.items = response.circularRequestTypes.map(item => ({
        ...item,
        title: item.requestType.title,
      }))
    },
    resetFilters() {
      this.items = []
    },
  },
}
</script>

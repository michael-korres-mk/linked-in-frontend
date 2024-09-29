<template>
  <h1 class="text-center text-info">
    {{ $t('Jobs') }}
  </h1>
  <div class="card-wrapper bg-global-primary">
    <div class="card-body text-primary d-flex align-items-center">

      <Dialog
        :open="dialog"
        :valid="valid"
        :max-width="maxWidth"
        :title="formTitle"
        :success-icon="'fa-paper-plane'"
        :success-title="$t('Apply')"
        :cancel-callback="close"
        :success-callback="submitEntity"
        persistent
      >
        <div class="card-wrapper pb-10 my-5">
          <legend class="legend-title text-center">
            {{ modalLegendTitle }}
          </legend>
          <div class="card-body p-5 m-5">
            <VForm
              ref="form"
              v-model="valid"
              autocomplete="off"
            >
              <EntityEditSection
                :entity="applicationEntity"
                :form-fields="applicationFormFields"
                @fieldUpdated="updateApplicationEntity"
              />
            </VForm>
          </div>
        </div>
      </Dialog>

      <EntitySingle
        :key="componentKey"
        :config="config"
        :sections="sections"
        :entity="entity"
        :secondary-tables="secondaryTables"
        :extra-actions="extraActions"
        authority="jobs"
        hide-title
        editButtonColor="secondary"
        :can-edit="currentJobIsMine || newJob"
        @entityUpdated="setEntity"
        @editModeSet="editModeSet"
        @entitySaved="entitySaved"
      />
    </div>
  </div>
</template>

<script>
import editMixins from '../../mixins/entityedit.js'
import {defineStore} from "pinia";
import useGenericEntityStore from "@/stores/entity.js";
import EntitySingle from "@/components/entity/EntitySingle.vue";

export default {
  name: "[id]",
  components: {EntitySingle},
  mixins: [editMixins],
  data() {
    return {
      entity: {},
      applicationEntity: {...this.$store.userData,id:null},
      valid: false,
      dialog: false,
      applied: false,
      entityStore: defineStore('jobs', useGenericEntityStore('jobs'))(),
      applicationsStore: defineStore('job-applications', useGenericEntityStore('job-applications'))(),
      componentKey: 0,
      maxWidth: '800px',
      formTitle: 'Υποβολή αίτησης',
      modalLegendTitle: 'Στοιχεία Επικοινωνίας',
      workplaceTypeOptions: [],
      employmentTypeOptions: [],
    }
  },
  computed: {
    config() {
      return {
        endpoint: 'jobs',
        route: 'jobs',
        title: {
          geniki: 'Αγγελίας',
        },
      }
    },
    sections() {
      return [
        {
          fields: this.formFields,
          title: 'Στοιχεία Αγγελίας',
        },
      ]
    },
    applicationFormFields() {
      return [
        {
          id: 'firstName',
          type: 'text',
          label: this.$t('User FirstName'),
          required: true,
          colSize: 12,
        },
        {
          id: 'lastName',
          type: 'text',
          label: this.$t('User LastName'),
          required: true,
          colSize: 12,
        },
        {
          id: 'email',
          type: 'text',
          label: this.$t('Email'),
          required: true,
          rules: ['email'],
          readOnly: true,
          colSize: 12,
        },
        {
          id: 'username',
          type: 'text',
          label: this.$t('Username'),
          rules: ['username'],
          disabled: true,
          colSize: 12,
        },
        {
          id: 'mobile',
          type: 'text',
          label: this.$t('Telephone'),
          rules: ['phone'],
          required: true,
          colSize: 12,
        },
        // {
        //   id: 'workExperience',
        //   type: 'tiptap',
        //   label: this.$t('Work Experience'),
        //   colSize: 12,
        // },
        // {
        //   id: 'education',
        //   type: 'tiptap',
        //   label: this.$t('Education'),
        //   colSize: 12,
        // },
        // {
        //   id: 'skills',
        //   type: 'tiptap',
        //   label: this.$t('Skills'),
        //   colSize: 12,
        // },
      ]
    },
    formFields() {
      return [
        {
          id: 'title',
          type: 'text',
          label: this.$t('Title'),
          disabled: !this.editMode,
          colSize: 12,
        },
        {
          id: 'description',
          type: 'tiptap',
          label: this.$t('Description'),
          disabled: !this.editMode,
          colSize: 12,
        },
        {
          id: 'workplaceType',
          type: 'select',
          label: this.$t('Workplace Type'),
          disabled: !this.editMode,
          options: this.workplaceTypeOptions,
          colSize: 6,
        },
        {
          id: 'employmentType',
          type: 'select',
          label: this.$t('Employment Type'),
          disabled: !this.editMode,
          options: this.employmentTypeOptions,
          colSize: 6,
        },
        {
          id: 'location',
          type: 'text',
          label: this.$t('Location'),
          disabled: !this.editMode,
          colSize: 6,
        },
      ]
    },
    secondaryTables(){
      return [
        {
          fields: this.skillFields,
          title: this.$t('Skills'),
          hiddenColumns: ['description'],
          property: 'skills',
        },
        {
          fields: [
            {
              id: 'creator.title',
              type: 'text',
              label: this.$t('Applicant'),
            },
          ],
          title: this.$t('Job Applications'),
          property: 'applications',
          hideEditButton: true,
          hideAddButton: true,
          hidden: !this.currentJobIsMine
        }
      ]
    },
    skillFields(){
      return [
        {
          id: 'title',
          type: 'text',
          label: this.$t('Skill Title'),
          required: true,
          colSize: 12,
        }
      ]
    },
    currentJobIsMine(){
      return this.entity?.creator?.id == this.user.id
    },
    newJob(){
      return this.$route.params.id == '0'
    },
    extraActions() {
      return [
        {
          title: (this.applied)? this.$t('Applied') : this.$t('Apply'),
          icon: (this.applied)? 'fa-check' : 'fa-paper-plane',
          color: 'secondary',
          callback: this.apply,
          disabled: this.applied,
          renderCondition: () => !this.currentJobIsMine && !this.newJob
        },
      ]
    },
  },
  mounted() {
    this.setJobs()
    this.setWorkplaceTypes()
    this.setEmploymentTypes()
  },
  methods: {
    updateApplicationEntity(fieldObj) {
      this.applicationEntity[fieldObj.id] = fieldObj.value
    },
    async submitEntity(){
      const response = await this.applicationsStore.saveEntity({...this.applicationEntity, job: {id: this.$route.params.id}},false)
      if(response.id){
        this.valid = false
        this.applied = true
        this.dialog = false
      }
    },
    apply () {
      this.dialog = true
    },
    close() {
      this.dialog = false
    },
    async setJobs() {
      const myJobApplications = await this.$store.fetchJobApplications({creator: this.user.id})

      if (myJobApplications.length > 0) {
        this.applied = myJobApplications.filter(ja => ja.job.id == this.$route.params.id).length > 0
      }
    },
    async setWorkplaceTypes(){
      this.workplaceTypeOptions = await this.$store.fetchWorkplaceTypes()
    },
    async setEmploymentTypes(){
      this.employmentTypeOptions = await this.$store.fetchEmploymentTypes()
    }
  },

}
</script>


<style scoped lang="scss">

</style>

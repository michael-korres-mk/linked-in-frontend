<template>
  <h1 class="text-center text-info">
    {{ entity.title }}
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
                @fieldUpdated="updateEntity"
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
        authority="jobs"
        hide-title
        hide-return-button
        hide-edit-button
        hide-cancel-button
        hide-submit-button
        @editModeSet="editModeSet"
      />
      <div class="d-flex flex-row align-items-center ga-5">
        <BigActionBtn
          size="x-large"
          :icon="'fa-circle-chevron-left'"
          :label="'Back'"
          :color="(applied)? 'secondary' : 'secondary'"
          @click="() => this.$router.push({name: 'jobs'})"
        />
        <BigActionBtn
          size="x-large"
          :icon="(applied)? 'fa-check' : 'fa-paper-plane'"
          :disabled="applied"
          :label="(applied)? 'Applied' : 'Apply'"
          :color="'secondary'"
          @click="apply"
        />
      </div>

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
      editMode: !this.singleEdit,
      componentKey: 0,
      maxWidth: '800px',
      formTitle: 'Υποβολή αίτησης',
      modalLegendTitle: 'Στοιχεία Επικοινωνίας'
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
        {
          id: 'workExperience',
          type: 'tiptap',
          label: this.$t('Work Experience'),
          colSize: 12,
        },
        {
          id: 'education',
          type: 'tiptap',
          label: this.$t('Education'),
          colSize: 12,
        },
        {
          id: 'skills',
          type: 'tiptap',
          label: this.$t('Skills'),
          colSize: 12,
        },
      ]
    },
    formFields() {
      return [
        {
          id: 'title',
          type: 'text',
          label: this.$t('Title'),
          readonly: true,
          colSize: 12,
        },
        {
          id: 'description',
          type: 'tiptap',
          label: this.$t('Description'),
          readonly: true,
          colSize: 12,
        },
        {
          id: 'workplaceType',
          type: 'select',
          label: this.$t('Workplace Type'),
          readonly: true,
          colSize: 6,
        },
        {
          id: 'employmentType',
          type: 'select',
          label: this.$t('Employment Type'),
          readonly: true,
          colSize: 6,
        },
      ]
    },
  },
  mounted() {
    this.fetchJob()
  },
  methods: {
    async fetchJob(){
      this.entity = await this.entityStore.getEntity(this.$route.params.id)
    },
    updateEntity(fieldObj) {
      this.applicationEntity[fieldObj.id] = fieldObj.value
    },
    async submitEntity(){
      const response = await this.applicationsStore.saveEntity({...this.applicationEntity, jobId: this.$route.params.id},false)
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
  },
}
</script>


<style scoped lang="scss">

</style>

<template>
  <h1 class="text-center text-info mb-0">
    {{ title}}
  </h1>
  <VContainer fluid>
    <VRow>
      <VCol>
        <div class="card-wrapper">
          <div class="card-body">
            <EntitySingle
              :key="componentKey"
              :config="config"
              :sections="sections"
              :entity="entity"
              hide-title
              :return-to-list="false"
              :hide-cancel-button="!editMode"
              authority="users"
              @entityFetched="setEntity"
              @entityUpdated="setEntity"
              @editModeSet="editModeSet"
              @entitySaved="entitySaved"
            />
          </div>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import editMixins from '@/mixins/entityedit'
import EntitySingle from "@/components/entity/EntitySingle.vue";

export default {
  components: {EntitySingle},

  mixins: [editMixins],

  data() {
    return {
      entity: {
        workExperiences:[],
        educations:[],
        skills:[],
      },
      editMode: !this.singleEdit,
      componentKey: 0,
    }
  },
  computed:{
    title(){
      return this.$t("Personal Info")
    },
    config() {
      return {
        endpoint: 'users/profile',
        route: 'personal-info',
        title: {
          geniki: 'Χρήστη',
        },
      }
    },
    sections() {
      return [
        {
          fields: this.formFields,
          title: this.$t('Information'),
        },
        {
          fields: this.aboutMe,
          title: this.$t('About Me'),
        },
        {
          fields: this.settings,
          title: this.$t('Public / Private Info'),
        },
      ]
    },
    secondaryTables(){
      return [
        {
          fields: this.workExperienceFields,
          title: this.$t('Experience'),
          // formattedColumns: [{ key: 'file', callback: 'renderFileUrl', handleClick: this.downloadFile }],
          hiddenColumns: ['description'],
          property: 'workExperiences',
          hidden: !this.entity.workExperiencesEnabled && !this.editMode && !this.myProfile && !this.connected
        },
        {
          fields: this.educationFields,
          title: this.$t('Education'),
          // formattedColumns: [{ key: 'file', callback: 'renderFileUrl', handleClick: this.downloadFile }],
          hiddenColumns: ['description'],
          property: 'educations',
          hidden: !this.entity.educationsEnabled && !this.editMode && !this.myProfile && !this.connected
        },
        {
          fields: this.skillFields,
          title: this.$t('Skills'),
          hiddenColumns: ['description'],
          property: 'skills',
          hidden: !this.entity.skillsEnabled && !this.editMode && !this.myProfile && !this.connected
        },
      ]
    },
    formFields() {
      return [
        {
          id: 'firstName',
          type: 'text',
          label: this.$t('User FirstName'),
          required: true,
          colSize: 4,
        },
        {
          id: 'lastName',
          type: 'text',
          label: this.$t('User LastName'),
          required: true,
          colSize: 4,
        },
        {
          id: 'mobile',
          type: 'text',
          label: this.$t('Telephone'),
          rules: ['phone'],
          colSize: 4,
        },
        {
          id: 'company',
          type: 'text',
          label: this.$t('Company'),
          colSize: 6,
        },
        {
          id: 'jobTitle',
          type: 'text',
          label: this.$t('Job Title'),
          colSize: 6,
        },
        {
          id: 'profilePhoto',
          type: 'file',
          filetype: ['image/*'],
          label: this.$t('Photo'),
          rules: ['filesize'],
          filesize: 30,
          colSize: 12
        },
      ]
    },
    aboutMe() {
      return [
        {
          id: 'aboutMe',
          type: 'textarea',
          colSize: 12,
        }
      ]
    },
    settings(){
      return [
        {
          id: 'workExperiencesEnabled',
          type: 'checkbox',
          label: this.$t('Work Experience'),
          disabled: this.viewMode,
          colSize: 4,
        },
        {
          id: 'educationsEnabled',
          type: 'checkbox',
          label: this.$t('Education'),
          disabled: this.viewMode,
          colSize: 4,
        },
        {
          id: 'skillsEnabled',
          type: 'checkbox',
          label: this.$t('Skills'),
          disabled: this.viewMode,
          colSize: 4,
        }
      ]
    },
    workExperienceFields(){
      return [
        {
          id: 'title',
          type: 'text',
          label: this.$t('Job Title'),
          colSize: 12,
        },
        {
          id: 'company',
          type: 'text',
          label: this.$t('Company'),
          colSize: 12,
        },
        {
          id: 'description',
          type: 'text',
          label: this.$t('Job Description'),
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
          id: 'location',
          type: 'text',
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
        {
          id: 'startDate',
          type: 'date',
          label: this.$t('Start'),
          colSize: 6,
        },
        {
          id: 'endDate',
          type: 'date',
          label: this.$t('To'),
          colSize: 6,
        },

      ]
    },
    educationFields(){
      return [
        {
          id: 'title',
          type: 'text',
          label: this.$t('Education Title'),
          required: true,
          colSize: 12,
        },
        {
          id: 'company',
          type: 'text',
          label: this.$t('Company'),
          colSize: 12,
        },
        {
          id: 'description',
          type: 'text',
          label: this.$t('Education Description'),
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
          id: 'location',
          type: 'text',
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
        {
          id: 'startDate',
          type: 'date',
          label: this.$t('Start'),
          readonly: true,
          colSize: 6,
        },
        {
          id: 'endDate',
          type: 'date',
          label: this.$t('To'),
          readonly: true,
          colSize: 6,
        },

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
  },
  mounted(){
    this.fetchUser()
  },
  methods: {
    async fetchUser(){
      this.entity = await this.$store.axiosGet({ url: 'users/profile/' + this.user.id })
    },
    entitySaved(entity) {
      this.entity = entity
      localStorage.setItem('userData', JSON.stringify(entity));
      this.componentKey++
    },
  },
}
</script>

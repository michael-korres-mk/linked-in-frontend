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
              :secondary-tables="secondaryTables"
              :entity="entity"
              hide-title
              :can-edit="myProfile"
              hide-return-button
              authority="users"
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
export default {
  mixins: [editMixins],
  data() {
    return {
      entity: {
        authorities: [],
        roles: [],
      },
      title: this.$t('Users'),
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
        {
          fields: this.aboutMe,
          title: this.$t('About Me'),
        },
        {
          fields: this.settings,
          title: this.$t('Public / Private Info'),
          hidden: !this.editMode && !this.myProfile
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
          colSize: 3,
        },
        {
          id: 'lastName',
          type: 'text',
          label: this.$t('User LastName'),
          colSize: 3,
        },
        {
          id: 'email',
          type: 'text',
          label: this.$t('Email'),
          rules: ['email'],
          colSize: 3,
        },
        {
          id: 'mobile',
          type: 'text',
          label: this.$t('Telephone'),
          rules: ['phone'],
          colSize: 3,
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
          colSize: 12,
        }
      ]
    },
    profileId(){
      return this.$route.params.id
    },
    myProfile(){
      return this.$route.params.id == this.user.id
    },
    isSender(){
      return this.profileId == this.connectionRequest?.creator.id
    }
  },

  methods: {
    entitySaved(entity) {
      this.entity = entity
      this.componentKey++
    },
  },
}
</script>

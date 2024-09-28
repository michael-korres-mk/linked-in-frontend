<template>
  <header>
    <div class="profile-header">
      <div class="profile-info">
        <v-avatar color="grey" rounded="25" size="160">
          <VImg v-if="profileImage" :src="profileImage" :height="'100%'" cover/>
          <FontAwesomeIcon v-else :icon="'fas fa-circle-user'" color="white" size="10x"/>
        </v-avatar>
        <h1 class="text-white"> {{ entity.title }}</h1>
        <h2 class="text-info"> {{ entity.jobTitle}}</h2>
      </div>
      <div v-if="!myProfile" class="actions">
        <div v-if="connectionRequest">
          <div v-if="connected">
            <!-- 👉 My Network -->
            <BigActionBtn
              :color="'secondary'"
              :icon="'fa-user-group'"
              :label="'My Network'"
              @click="() => $router.push({name: 'network-id', params: { id: entity.id }})"
            />
          </div>
          <div v-else-if="isSender">
            <!-- 👉 Decline -->
            <BigActionBtn
                :color="'secondary'"
                :icon="'fa-xmark'"
                :label="'Decline'"
                @click="decline"
              />

            <!-- 👉 Accept -->
            <BigActionBtn
                :color="'secondary'"
                :icon="'fa-check'"
                :label="'Accept'"
                @click="accept"
              />
          </div>
          <div v-else>
              <!-- 👉 Sent -->
              <BigActionBtn
                :icon="'fa-check'"
                :label="'Sent'"
                :color="'secondary'"
                disabled
              />
          </div>
        </div>
        <div v-else>
          <!-- 👉 Connect -->
          <BigActionBtn
            :icon="'fa-user-plus'"
            :label="'Connect'"
            :color="'secondary'"
            @click="sendRequest"
          />
        </div>

        <!-- 👉 Send Message -->
        <BigActionBtn
          :color="'secondary'"
          :icon="'fa-message'"
          :label="'Send Message'"
          @click="() => $router.push({name: 'chats-id', params: { id: entity.id }})"
        />
      </div>
    </div>
  </header>

  <EntitySingle
      :key="componentKey"
      :config="config"
      :sections="sections"
      :secondary-tables="secondaryTables"
      :entity="entity"
      hide-title
      :return-to-list="false"
      hide-return-button
      :hide-edit-button="!myProfile"
      authority="users"
      @entityUpdated="setEntity"
      @editModeSet="editModeSet"
      @entitySaved="entitySaved"
      @entity-fetched="setProfileImage"
    />

</template>

<script>
import {defineStore} from "pinia";
import useGenericEntityStore from "@/stores/entity.js";
import EntitySingle from "@/components/entity/EntitySingle.vue";
import editMixins from "@/mixins/entityedit.js"

export default {
  name: "[id]",
  mixins: [editMixins],
  components: {EntitySingle},
  data() {
    return {
      entity: {
        workExperiences:[],
        educations:[],
        skills:[],
      },
      profileImage: null,
      componentKey : 0,
      entityStore: defineStore('users', useGenericEntityStore('users'))(),
      requesting: false,
      loading: false,
      connectionRequestStore: defineStore('connection-requests', useGenericEntityStore('connection-requests'))(),
      requested: false,
      connected: false,
      connectionRequest: null,
    }
  },
  mounted() {
    this.setConnectionRequest()
  },
  computed:{
    config() {
      return {
        endpoint: 'users/profile',
        route: 'in',
        returnRoute: '/in-id',
        routeParam: this.profileId,
        title: {
          geniki: 'Χρήστη',
        },
      }
    },
    sections() {
      return [
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
  methods:{
    freeze(){
      this.requesting = true
    },
    unfreeze(){
      this.requesting = false
    },
    async sendRequest(){
      this.freeze()
      const response = await this.connectionRequestStore.saveEntity({recipientId: this.profileId},false)

      if(response.id){
        this.connectionRequest = response
        this.requesting = false
        this.requested = true
      }

      this.unfreeze()
    },
    async setConnectionRequest(){
      if(!this.myProfile){

        const connectionRequests = await this.$store.fetchConnectionRequests({creator: this.user.id,recipient: this.profileId})

        if(connectionRequests.length > 0){
          this.requested = true
          this.connectionRequest = connectionRequests[0]
          this.connected = this.connectionRequest?.connectionDate != null
        }
      }

    },
    async accept(){
      await this.connectionRequestStore.saveEntity({id:this.connectionRequest.id},true)
      this.connected = true
    },
    async decline(){
      await this.connectionRequestStore.deleteEntity(this.connectionRequest.id)
      this.connectionRequest = null
    },
    entitySaved(entity) {
      this.entity = entity
      this.componentKey++
    },
    async setProfileImage(){
      this.profileImage = await this.imgShow(this.entity?.profilePhoto) ?? null
    },
  }
}
</script>

<style scoped lang="scss">

/* General styles */
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  color: #333;
  margin: 0;
  padding: 0;
}


/* Header styles */
header {
  top: 0; /* Background effect covers the bottom half */
  left: 0;
  right: 0;
  bottom: 50%;
  background: rgb(var(--v-theme-primary)); /* Background effect (color overlay) */
  z-index: 1;
  color: #fff;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

}

.profile-header {
  display: grid;
  grid-template-columns: 1fr auto; /* Creates two columns, one for profile info and one for actions */
  align-items: center; /* Vertically centers items in the grid cells */
  gap: 16px; /* Space between columns */
  padding: 20px;
}

.profile-picture {
  border-radius: 50%;
  width: 150px;
  height: 150px;
}

.profile-info {
  display: flex;
  align-items: start;
  /* Align to the start of the header */
  justify-content: start; /* Optional, since it's the default for flex items */
  flex-direction: column;
}


h1 {
  margin: 10px 0;
}

h2 {
  font-weight: normal;
}

/* About Section */
.about {
  background-color: #fff;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.about p {
  line-height: 1.6;
}

/* Experience Section */
.experience {
  background-color: #fff;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.job {
  margin-bottom: 20px;

  h4 {
    margin-bottom: 5px;
    color: #42b883;
  }

  ul {
    list-style-type: square;
    margin-left: 20px;
  }
}

/* Skills Section */
.skills {
  background-color: #fff;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style-type: none;
  padding: 0;
}

.skills-list li {
  background-color: #42b883;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
}

/* Projects Section */
.projects {
  background-color: #fff;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.project {
  margin-bottom: 20px;
}

/* Certifications Section */
.certifications {
  background-color: #fff;
  padding: 20px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.certifications ul {
  list-style-type: disc;
  margin-left: 20px;
}

/* Footer */
footer {
  text-align: center;
  padding: 10px;
  background-color: #2c3e50;
  border-radius: 5px;
  color: #fff;
  margin-top: 20px;
}

.actions {
  display: flex;
  gap: 8px; /* Space between buttons */
  justify-self: end; /* Aligns the actions to the end (right) of its grid cell */
}

</style>

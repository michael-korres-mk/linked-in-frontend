<template>
  <VContainer :style="{marginBottom:'50px'}" fluid>
    <RouterLink :to="`/jobs/${this.item.id}?view=1`">
      <VCard class="list-item">
        <VRow>
          <VCol>
            <v-avatar :style="{ marginLeft: '50px' }" color="grey" rounded="25" size="160">
              <VImg v-if="profileImage" :src="profileImage" :height="'100%'" cover/>
              <FontAwesomeIcon v-else :icon="'fas fa-sack-dollar'" color="white" size="7x"/>
            </v-avatar>
          </VCol>
          <VCol class="d-flex flex-column justify-content-between align-items-center">
            <h2 class="text-info">{{ item.title }}</h2>
            <h4 v-if="item.company" class="d-flex gap-2 align-center text-primary">{{ item.company }}</h4>
            <h4 v-if="item.location" class="d-flex gap-2 align-center text-primary"><FontAwesomeIcon :icon="'fas fa-location-dot'" color="#d04a02"/>  {{ item.location }}</h4>
            <h4 v-if="item.workplaceType" class="d-flex gap-2 align-center text-primary"><FontAwesomeIcon :icon="'fas fa-building'" color="#d04a02"/>  {{ $t(item.workplaceType) }}</h4>
            <h4 v-if="item.employmentType" class="d-flex gap-2 align-center text-primary"><FontAwesomeIcon :icon="'fas fa-clock'" color="#d04a02"/>  {{ $t(item.employmentType) }}</h4>
          </VCol>
        </VRow>
      </VCard>
    </RouterLink>
  </VContainer>
</template>

<script>
import {defineStore} from "pinia";
import useGenericEntityStore from "@/stores/entity.js";

export default {
  name: "JobListItem",
  data(){
    return {
      requesting: false,
      loading: false,
      connectionRequestStore: defineStore('connection-requests', useGenericEntityStore('connection-requests'))(),
      profileImage: null,
      requested: false
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.setProfileImage()
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
      const response = await this.connectionRequestStore.saveEntity({recipientId:this.item.id},false)

      if(response.id){
        this.requesting = false
        this.requested = true
      }

      this.unfreeze()
    },
    async setProfileImage(){
      this.profileImage = await this.imgShow(this.entity?.profilePhoto) ?? null
    },
  }
}
</script>


<style scoped lang="scss">
.list-item {
  position: relative;
  width: 100%;
  background: linear-gradient(
      to right,
      rgb(var(--v-theme-primary)) 50%,  /* Left half with overlay */
      #FFF 50% /* Right half transparent */
  );
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>


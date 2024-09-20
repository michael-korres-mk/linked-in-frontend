<template>
  <VContainer :style="{marginBottom:'50px'}" fluid>
    <VCard class="list-item">
      <VRow>
        <VCol>
          <v-avatar :style="{ marginLeft: '50px' }" color="grey" rounded="25" size="160">
            <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
          </v-avatar>
        </VCol>
        <VCol>
          <RouterLink :to="`/jobs/${this.item.id}?view=1`"><h2 class="text-link">{{ item.title }}</h2></RouterLink>
          <h4 class="text-primary">{{ item.company }}</h4>
          <h4 class="text-primary">{{ item.workplaceType }} | {{ item.employmentType }}</h4>
        </VCol>
      </VRow>
    </VCard>
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
      requested: false
    }
  },
  props: {
    item: {
      type: Object,
      required: true
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
      const response = await this.connectionRequestStore.saveEntity({recipientId:this.item.id},false)

      if(response.id){
        this.requesting = false
        this.requested = true
      }

      this.unfreeze()
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


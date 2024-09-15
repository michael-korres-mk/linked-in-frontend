<template>
  <VContainer :style="{marginBottom:'50px'}" fluid>
    <VCard :loading="requesting" :disabled="requesting" class="list-item">
      <VRow>
        <VCol>
          <v-avatar :style="{ marginLeft: '50px' }" color="grey" rounded="25" size="160">
            <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
          </v-avatar>
        </VCol>
        <VCol>
          <RouterLink :to="`/jobs/applications/${this.item.id}?view=1`"><h2 class="text-link">{{ item.title }}</h2></RouterLink>
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
    freezeCard(){
      this.requesting = true
    },
    unfreezeCard(){
      this.requesting = false
    },
    async sendRequest(){
      this.freezeCard()
      const response = await this.connectionRequestStore.saveEntity({recipientId:this.item.id},false)

      if(response.id){
        this.requesting = false
        this.requested = true
      }

      this.unfreezeCard()
    },
  }
}
</script>


<style scoped lang="scss">

</style>

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
          <h2 class="text-info">{{ item.title }}</h2>
          <h4 class="text-primary">{{ item.company }}</h4>
          <h4 class="text-primary">{{ item.workplaceType }} | {{ item.employmentType }}</h4>


<!--          <BigActionBtn-->
<!--            v-if="!requesting"-->
<!--            :icon="(requested)? 'fa-check' : 'fa-user-plus'"-->
<!--            :label="(requested)? 'Sent' : 'Connect'"-->
<!--            :disabled="requested"-->
<!--            :color="(requested)? 'info' : 'primary'"-->
<!--            @click="sendRequest"-->
<!--          />-->
<!--          <v-progress-circular-->
<!--            v-else-->
<!--            indeterminate-->
<!--            :size="22"-->
<!--            :width="4"-->
<!--          />-->

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

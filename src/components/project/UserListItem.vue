<template>
  <VContainer :style="{marginBottom:'50px'}" fluid>
    <VCard :loading="requesting" :disabled="requesting" class="list-item">
      <VRow>
        <VCol>
          <RouterLink :to="`/in/${item.id}`" >
            <div>
              <v-avatar :style="{ marginLeft: '50px' }" color="grey" rounded="25" size="160">
                <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
              </v-avatar>
            </div>
          </RouterLink>
        </VCol>

        <VCol>
          <RouterLink :to="`/in/${item.id}`" >
            <VRow class="d-flex flex-column mt-4">
              <h2 class="text-info">{{ item.title }}</h2>
              <h4 class="text-primary">{{ item.jobTitle }}</h4>
              <h4 class="text-primary">{{ item.company }}</h4>
            </VRow>
          </RouterLink>
          <VRow class="d-flex justify-center align-items-center mt-2">
            <BigActionBtn
              v-if="!requesting"
              :icon="(requested)? 'fa-check' : 'fa-user-plus'"
              :label="(requested)? 'Sent' : 'Connect'"
              :disabled="requested"
              :color="(requested)? 'info' : 'primary'"
              @click="sendRequest"
            />
            <v-progress-circular
              v-else
              indeterminate
              :size="22"
              :width="4"
            />
          </VRow>
        </VCol>
      </VRow>
    </VCard>
  </VContainer>
</template>

<script>
import {defineStore} from "pinia";
import useGenericEntityStore from "@/stores/entity.js";

export default {
  name: "UserListItem",
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
.list-item {
  position: relative;
  width: 100%;
  background: linear-gradient(
      to right,
      rgb(var(--v-theme-primary)) 50%,  /* Left half with overlay */
      transparent 50% /* Right half transparent */
  );
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>

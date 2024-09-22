<template>
  <VContainer :style="{marginBottom:'50px'}" fluid>
    <RouterLink :to="`/in/${item.id}?view=1`" >
      <VCard class="list-item">
      <VRow>
        <VCol>
            <div>
              <v-avatar :style="{ marginLeft: '50px' }" color="grey" rounded="25" size="160">
                <VImg v-if="profileImage" :src="profileImage" :height="'100%'" cover/>
                <FontAwesomeIcon v-else :icon="'fas fa-circle-user'" color="white" size="10x"/>
              </v-avatar>
            </div>

        </VCol>

        <VCol>
            <VRow class="d-flex flex-column mt-7">
              <h2 class="text-info">{{ item.title }}</h2>
              <h4 class="text-primary">{{ item.jobTitle }}</h4>
              <h4 class="text-primary">{{ item.company }}</h4>
            </VRow>
        </VCol>
      </VRow>
    </VCard>
    </RouterLink>
  </VContainer>
</template>

<script>
export default {
  name: "UserListItem",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      profileImage: null,
    }
  },
  mounted() {
    this.setProfileImage()
  },
  methods:{
    async setProfileImage(){
      this.profileImage = (this.item.profilePhoto)? await this.imgShow(this.item.profilePhoto) : null
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

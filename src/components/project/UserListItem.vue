<template>
  <VContainer :style="{marginBottom:'50px'}" fluid>
    <RouterLink :to="`/in/${item.id}`" >
      <VCard :loading="requesting" :disabled="requesting" class="list-item">
      <VRow>
        <VCol>
            <div>
              <v-avatar :style="{ marginLeft: '50px' }" color="grey" rounded="25" size="160">
                <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
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

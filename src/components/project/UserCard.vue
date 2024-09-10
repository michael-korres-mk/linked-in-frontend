<template>
  <v-card
    class="mx-auto"
    max-width="400"
    rounded="50"
  >

    <RouterLink :to="`in/${card.id}`" >
    <div class="image-container">
      <div class="image-overlay"></div> <!-- Background effect -->

      <!-- Avatar and text sit on top of the container -->
      <div class="content-overlay">
        <v-avatar :style="{ marginTop: '80px' }" color="grey" rounded="25" size="160">
          <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
        </v-avatar>

        <v-card-title class="text-info">{{ card.title }}</v-card-title>
        <v-card-subtitle class="text-primary">{{ card.jobTitle }}</v-card-subtitle>
        <v-card-subtitle class="text-primary">{{ card.company }}</v-card-subtitle>
      </div>
    </div>
    </RouterLink>

    <v-divider color="primary" />

    <v-card-actions class="d-flex mb-0 mt-auto align-center">
      <v-container fluid>
        <br>
        <v-row>
          <v-col>

            <div class="w-130px">
              <div class="d-flex justify-end">

              <slot name="actions" />
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "UserCard",
  props: {
    card: {
      type: Object,
      required: true
    },
    userRequests: {
      type: Array,
      required: true,
    }
  },
  computed:{
    requested() {
      return this.userRequests.some(request => request.recipient.id === this.card.id); // && request.acceptanceDate == null
    },
  },
}
</script>


<style scoped lang="scss">
.image-container {
  position: relative;
  width: auto; /* Set the desired width */
  height: 400px; /* Set the desired height */
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0; /* Background effect covers the bottom half */
  left: 0;
  right: 0;
  bottom: 50%;
  background: rgb(var(--v-theme-primary)); /* Background effect (color overlay) */
  z-index: 1;
}

.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 2; /* Higher z-index to ensure avatar and text sit on top */
}
</style>

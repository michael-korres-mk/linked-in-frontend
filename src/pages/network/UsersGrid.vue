<script>
import UserCard from "@/pages/network/UserCard.vue";

export default {
  name: "UsersGrid",
  components: {UserCard},
  mounted(){
    this.fetchConnectionRequests()
  },
  data(){
    return {
      userRequests: [],
    }
  },
  props: {
    users: {
      type: Array,
      default: []
    }
  },
  methods:{
    async fetchConnectionRequests(){
      this.userRequests = await this.$store.fetchUserRequests()
    }
  }
}
</script>

<template>
   <v-card
      class="mx-auto"
    >
      <v-container fluid>
        <v-row >
          <v-col
            v-for="user in users"
            :key="user.title"
            :cols="user.flex"
          >
            <UserCard :card="user" @connectionRequested="fetchConnectionRequests" :user-requests="userRequests" />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
</template>


<style scoped lang="scss">

</style>

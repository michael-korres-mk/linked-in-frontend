<script>
export default {
  name: "UserCard",
  data() {
    return {
      requesting: false
    }
  },
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
  method: {
    freezeCard(){
      this.requesting = true
      // setTimeout(() => (this.loading = false), 2000)
    },
    unfreezeCard(){
      this.requesting = false
    },
    sendRequest(){
      this.freezeCard()
      // await this.commentStore.saveEntity({postId:this.post.id,description:this.commentText},false)
      // let updatedPost = await this.entityStore.getEntity(this.post.id)
      // this.$emit('update-post', updatedPost);
      // this.commentText = ''
      this.unfreezeCard()
    },
  }
}
</script>

<template>
  <v-card>
    <v-img
      :src="card.src"
      class="align-end"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      height="200px"
      cover
    >
      <v-card-title class="text-white" v-text="card.title"></v-card-title>
    </v-img>

    <v-card-actions class="d-flex mb-0 mt-auto align-center">
      <v-container fluid>
        <br>
        <v-row>
          <v-col>
            <BigActionBtn
              v-if="!requesting"
              :icon="(requested)? 'fa-xmark' : 'fa-user-plus'"
              :label="(requested)? $t('Withdraw') : $t('Connect')"
              :color="(requested)? 'danger' : 'primary'"
              @click="sendRequest"
            />
<!--            <v-progress-circular-->
<!--              v-else-->
<!--              indeterminate-->
<!--              :size="22"-->
<!--              :width="4"-->
<!--            />-->

          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss">

</style>

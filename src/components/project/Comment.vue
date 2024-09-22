<script>
export default {
  name: "Comment",
  props: {
    comment:{
      type: Object,
      required: true
    }
  },
  data(){
    return {
      profileImage: null
    }
  },
  mounted() {
    this.setProfileImage()
  },
  methods:{
    async setProfileImage(){
      this.profileImage = (this.comment.creator.profilePhoto)? await this.imgShow(this.comment.creator.profilePhoto) : null
    },
  }
}
</script>

<template>
  <div style="height: 60px!important;" class="d-flex gap-2">
    <v-avatar size="48">
      <VImg v-if="profileImage" :src="profileImage" :height="'100%'" cover/>
      <FontAwesomeIcon v-else :icon="'fas fa-circle-user'" color="#1f4e79" size="3x"/>
    </v-avatar>
    <div>
      <div>
        <strong class="text-info" >{{ comment.creator.title }}</strong> @{{ mediumDate(comment.creationDate) }}
      </div>

      <div>{{ comment.description }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>

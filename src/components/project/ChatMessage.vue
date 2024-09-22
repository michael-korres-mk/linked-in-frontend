<template>
  <v-list-item :class="['message-information','display-flex']">
    <v-list-item-title class="d-flex align-center font-16">
      <v-avatar class="border-thin mr-2" color="grey" rounded="25" size="70">
        <VImg v-if="profileImage" :src="profileImage" :height="'100%'" cover/>
        <FontAwesomeIcon v-else :icon="'fas fa-circle-user'" color="#1f4e79" size="5x"/>
      </v-avatar>
      <span> <strong>{{ senderData.title }}</strong> <FontAwesomeIcon icon="fa-circle" style="width:3px" /> {{ shortTime(message.createdDate) }} </span>
    </v-list-item-title>
    <v-list-item-subtitle class="text-black"><div class="message-text">{{ message.text }}</div></v-list-item-subtitle>
  </v-list-item>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default: () => ({
        sender: { id: 0 },
        recipient: { id: 0 },
        creationTimestamp: '',
        message: '',
        delivered: false,
        read: false,
      }),
    },
  },
  data(){
    return {
      profileImage: null,
    }
  },
  watch: {
    message() {
      this.setProfileImage()
    },
  },
  mounted() {
    this.setProfileImage()
  },
  computed: {
    formattedText() {
      return this.messageText.replace(/\n/g, '<br>');
    },
    senderData() {
      return (this.message.sender.id == this.user.id) ? this.user : this.message.sender
    },
  },
  methods:{
    async setProfileImage(){
      this.profileImage = (this.senderData.profilePhoto)? await this.imgShow(this.senderData.profilePhoto) : null
    },
  }
}
</script>

<style scoped>

.message-text{
  white-space: pre-line!important;
}

</style>

<template>
  <v-list-item
     :class="['message-information', 'display-flex', 'border-thin',{'clicked-connection': clicked}]"
     @click="chatPicked"
  >
      <template v-slot:prepend>
        <v-avatar class="border-thin" color="grey" rounded="25" size="100">
          <VImg v-if="profileImage" :src="profileImage" :height="'100%'" cover/>
          <FontAwesomeIcon v-else :icon="'fas fa-circle-user'" color="#1f4e79" size="10x"/>
        </v-avatar>
      </template>
      <v-list-item-title class="name text-info font-weight-bold">{{ chatUserData.title }}</v-list-item-title>
      <v-list-item-subtitle v-if="chat.lastMessage" class="message-description cut font-roboto-condensed font-italic">{{ chat.lastMessage.text }}</v-list-item-subtitle>
      <div v-else>{{ $t('New chat')}}</div>
      <template v-slot:append>
        <div v-if="chat.lastMessage" class="font-12">{{ shortDate(chat.lastMessage.creationTimestamp) }}</div>
      </template>
    </v-list-item>
</template>

<script>
export default {
  name: "Chat",
  emits:['chatPicked'],
  props: {
    chat: {
      type: {},
      required: true,
    },
    clicked:{
      type: Boolean,
      required: true,
    }
  },
  data(){
    return {
      profileImage: null,
    }
  },
  watch: {
    chat() {
      this.setProfileImage()
    },
  },
  mounted() {
    this.setProfileImage()
  },
  computed:{
    chatUserData(){
      return (this.chat.creator.id == this.user.id)? this.chat.recipient : this.chat.creator
    }
  },
  methods:{
    chatPicked() {
      this.$emit('chatPicked', this.chat.id)
    },
    async setProfileImage(){
      this.profileImage = (this.chatUserData.profilePhoto)? await this.imgShow(this.chatUserData.profilePhoto) : null
    },
  }
}
</script>


<style scoped lang="scss">
  .clicked-connection {
    background-color: #ccc;
  }
</style>

<template>
  <h1 class="text-center text-info">
    {{ $t('Chats') }}
  </h1>
  <div class="card-wrapper bg-global-primary">
    <div class="card-body text-center">
    <VCard>
      <VCardText>
        <VContainer v-if="chats.length" fluid class="d-flex">
          <VCol :cols="4">
            <Chats :chats="chats" @chatPicked="chatPicked" :clicked="clicked"/>
          </VCol>
          <VCol :cols="8">
            <ChatMessages v-if="clicked !== -1" :chat="activeChat" @messageSent="messageSent"/>
            <h1 class="text-info" v-else > {{ $t('No chat picked') }}  </h1>
          </VCol>
        </VContainer>
        <div v-else>{{ $t('There are no available chats yet')}}</div>
      </VCardText>
    </VCard>
    </div>
  </div>
</template>

<script>
import FormField from '@/components/entity/FormField.vue'
import Chats from "@/components/project/Chats.vue";
import ChatMessages from "@/components/project/ChatMessages.vue";
import useGenericEntityStore from "@/stores/entity.js";
import {defineStore} from "pinia";

export default {
  components: {
    ChatMessages,
    Chats,
    FormField,
  },
  mounted(){
    this.fetchChats()

    if(this.$route.params.id != '0'){
     this.setPickedChat(this.$route.params.id)
    }

    this.isLoading = false
  },
  data() {
    return {
      clicked: -1,
      activeChat: {},
      isLoading: true,
      chats:[],
      connections:[],
      entityStore: defineStore('chats', useGenericEntityStore('chats'))(),
    }
  },
  methods: {
    async fetchChats(){
      this.chats = await this.$store.fetchChats({ creator:this.user.id })
    },
    async chatPicked(chatId){
      this.activeChat = this.chats.find(c => c.id == chatId);
      this.clicked = chatId
    },
    async messageSent(newMessage){
      this.activeChat.lastMessage = newMessage
    },
    async setPickedChat(recipient) {

      this.activeChat = await this.$store.axiosGet({url: 'chats', params: {recipient: recipient}})

      if(!this.chats.find(c => c.id == this.activeChat.id)){
        this.chats.unshift(this.activeChat)
      }

      this.clicked = this.activeChat.id
    }
  },
}
</script>

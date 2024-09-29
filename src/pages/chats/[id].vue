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
            <Chats :key="componentKey" :chats="chats" @chatPicked="chatPicked" :active-chat="activeChat"/>
          </VCol>
          <VCol :cols="8">
            <ChatMessages v-if="activeChat.id" :chat="activeChat" @messageSent="messageSent"/>
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
import entityedit from "@/mixins/entityedit.js";

export default {
  components: {
    ChatMessages,
    Chats,
    FormField,
  },
  mixins: [entityedit],
  mounted(){
    this.fetchChats()
    this.isLoading = false
  },
  data() {
    return {
      clicked: -1,
      activeChat: {},
      isLoading: true,
      chats:[],
      connections:[],
      componentKey: 0,
      entityStore: defineStore('chats', useGenericEntityStore('chats'))(),
    }
  },
  methods: {
    async fetchChats(){
      const fetchedChats = await this.$store.fetchChats({ creator:this.user.id })
      this.chats.push(...fetchedChats)

      if(this.id != '0'){
        this.setPickedChat(this.id)
      }
    },
    async chatPicked(chat){
      this.activeChat = chat
    },
    async messageSent(newMessage){
      this.activeChat.lastMessage = newMessage
    },
    async setPickedChat(recipient) {
      this.activeChat = await this.$store.axiosGet({url: 'chats', params: {recipient: recipient}})
      const index = this.chats.map(c => c.id).indexOf(this.activeChat.id)
      if(index === -1) this.chats.unshift(this.activeChat);
    }
  },
}
</script>

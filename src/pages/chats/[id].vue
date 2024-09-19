<template>
  <h1 class="text-center text-info">
    {{ $t('Chats') }}
  </h1>
  <div class="card-wrapper bg-global-primary">
    <div class="card-body text-center">
    <VCard>
      <VCardText>
        <VContainer fluid class="d-flex">
          <VCol :cols="4">
            <Chats :key="componentKey" :chats="chats" @chatClicked="chatClicked"/>
          </VCol>
          <VCol :cols="8">
            <ChatMessages v-if="clicked !== -1" :chat="clickedChat" @messageSent="messageSent"/>
            <h1 class="text-info" v-else > {{ $t('No chat picked') }}  </h1>
          </VCol>
        </VContainer>
      </VCardText>
    </VCard>
    </div>
  </div>
</template>

<script>
import FormField from '@/components/entity/FormField.vue'
import Chats from "@/components/project/Chats.vue";
import ChatMessages from "@/components/project/ChatMessages.vue";

export default {
  components: {
    ChatMessages,
    Chats,
    FormField,
  },
  mounted(){
    this.fetchChats()

    if(this.$route.params.id != '0'){
     this.setClickedChat(this.$route.params.id)
    }

    this.isLoading = false
  },
  data() {
    return {
      componentKey:0,
      clicked: -1,
      isLoading: true,
      clickedChat:{},
      chats:[],
      // entityStore: defineStore('chats', useGenericEntityStore('chats'))(),
    }
  },
  methods: {
    async fetchChats(){
      this.chats = await this.$store.fetchChats()
    },
    async chatClicked(chatId){
      this.clicked = chatId
      this.clickedChat = this.chats[this.clicked]
    },
    async messageSent(newMessage){
      this.clickedChat.lastMessage = newMessage
    },
    setClickedChat(recipientId) {
      return null
    }
  },
}
</script>

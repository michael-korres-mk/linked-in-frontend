<script setup>
  import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
</script>

<template>
  <PerfectScrollbar :options="{ wheelPropagation: false }" class="border-solid" style="max-block-size: 23.75rem;">
    <ChatMessage v-for="(message,i) in chat.messages" :message="message" :my-prop="i" />
  </PerfectScrollbar>
  <v-text-field
    :loading="loading"
    :disabled="sending"
    v-model="messageText"
    density="compact"
    variant="outlined"
    hide-details
    single-line
    tile
    class="border-thin mt-2"
  >

    <template #append-inner>
      <VBtn
        v-if="!sending"
        variant="plain"
        :ripple="false"
        :readonly="messageText === ''"
        @mouseover="isHovered = true"
        @mouseleave="isHovered = false"
        @click="sendMessage"
      >
        <FontAwesomeIcon :icon="(!isHovered || messageText === '')?'far fa-paper-plane' : 'fas fa-paper-plane'"/>
      </VBtn>
      <v-progress-circular
        v-else
        indeterminate
        :size="22"
        :width="4"
      />
    </template>
  </v-text-field>
</template>

<script>
import ChatMessage from "@/pages/chats/ChatMessage.vue";
import { Client } from '@stomp/stompjs'

export default {
  name: "ChatMessages",
  components: {ChatMessage},
  props: {
    chat: {
      type: {},
      required: true,
    },
  },
  data() {
    return {
      isHovered: false,
      loading: false,
      messageText:'',
      sending:false,
    }
  },
  computed: {
    recipientId() {
      return this.$route.params.id
    },
    token() {
      return localStorage.getItem('token')
    },
  },
  // async mounted() {
  //   this.connect()
  //   const data = await this.$store.fetchChatMessages(this.recipientId)
  //   if (data) {
  //     this.msgs = data.messages.reverse()
  //     this.connection = data.connection.recipient
  //   }
  //   this.loading = false
  // },
  methods: {
    connect() {
      this.stompClient = new Client({
        brokerURL: import.meta.env.VITE_API_URL.replace('http', 'ws') + 'ws',
        onConnect: () => {
          this.stompClient.subscribe('/user/' + this.user.id + '/queue/messages',
            (newMsg) => {
              const msg = JSON.parse(newMsg.body)
              if (msg.sender.id === this.recipientId) {
                this.appendMessage(msg)
              }
            }
          )
        },
      })
      this.stompClient.activate()
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.deactivate()
      }
    },
    appendMessage(newMsg) {
      this.msgs.push(newMsg)
    },
    sendMessage() {
      console.log(this.messageText)
      // TODO: Fix Message saving in db - refactor chat entities
      // if (this.stompClient && this.message.length > 0) {
      //   const newMsg = {
      //     connection : {recipient : { id: this.recipientId }},
      //     lastMessage: this.message,
      //     token: this.token,
      //   }
      //   this.stompClient.publish({
      //     destination: '/app/chat',
      //     body: JSON.stringify(newMsg),
      //   })
      //   this.appendMessage(newMsg)
      //   this.message = ''
      // }
    },
  },
}
</script>

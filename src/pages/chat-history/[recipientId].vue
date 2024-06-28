<template>
  <div class="rest-container">
<!--    <Loader v-if="isLoading" />-->
    <div class="mt-5">
      <VBtn color="secondary" size="large" @click="routeToGeneralChat()">
        <FontAwesomeIcon icon="fa-reply" class="font-24 mr-4"/>
        {{this.$t("Chats")}}
      </VBtn>
    </div>

    <div class="card-linkedin">
      <legend class="scheduler-border"> Συνομιλία με: <span class="font-weight-bold text-info"> {{ contact.title }} </span> </legend>

      <div class="card-body-linkedin">
        <div class="chat-container">
          <ChatMsg v-for="msg in msgs" :key="msg.createdTimestamp" :msg="msg"/>
        </div>
      </div>

      <div class="send-message">
        <div class="send-message-container width-100">
          <!-- <FontAwesomeIcon icon="fa-solid fa-images" />
              <FontAwesomeIcon icon="fa-solid fa-camera" /> -->
          <input v-model="message" type="text" class="message-input" />

          <VBtn color="primary" @click="sendMessage">
            {{ this.$t("Send") }}
            <FontAwesomeIcon icon="fa-paper-plane" class="ml-2" />
          </VBtn>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatMsg from './ChatMsg.vue'
import Loader from '@/components/Loader.vue'
import { Client } from '@stomp/stompjs'
export default {
  components: {
    ChatMsg,
    Loader,
  },
  data() {
    return {
      isLoading: true,
      stompClient: null,
      message: '',
      msgs: [],
      contact: [],
    }
  },
  computed: {
    recipientId() {
      return this.$route.params.recipientId
    },
    token() {
      return localStorage.getItem('token')
    },
  },
  async mounted() {
    this.connect()
    const data = await this.$store.fetchChatHistory(this.recipientId)
    if (data) {
      this.msgs = data.messages.reverse()
      this.contact = data.contact.recipient
    }
    this.isLoading = false
  },
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
      // TODO: Fix Message saving in db - refactor chat entities
      if (this.stompClient && this.message.length > 0) {
        const newMsg = {
          contact : {recipient : { id: this.recipientId }},
          lastMessage: this.message,
          token: this.token,
        }
        this.stompClient.publish({
          destination: '/app/chat',
          body: JSON.stringify(newMsg),
        })
        this.appendMessage(newMsg)
        this.message = ''
      }
    },
    routeToGeneralChat() {
      this.$router.push({name: 'chats'})
    },
  },
}
</script>

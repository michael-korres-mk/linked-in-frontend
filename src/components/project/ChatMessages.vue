<template>
  <VVirtualScroll
    :items="groupedMessages"
    height="400"
    class="border-solid"
  >
    <template #default="{ item }">
      <div>
        <!-- Display Date -->
        <VDivider class="text-black">{{ item.date }}</VDivider>

        <!-- Loop through the messages of that date -->
        <div v-for="(message, i) in item.messages" :key="i">
          <ChatMessage :message="message" :index="i" />
        </div>
      </div>
    </template>

  </VVirtualScroll>
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
import { Client } from '@stomp/stompjs'
import ChatMessage from "@/components/project/ChatMessage.vue";

export default {
  name: "ChatMessages",
  components: {ChatMessage},
  emits: ['messageSent'],
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
      messages:[]
    }
  },
  computed: {
    recipientId() {
      return this.chat.recipient.id
    },
    token() {
      return this.$store.userData.token
    },
    groupedMessages() {

      const groups = {};
      this.messages.forEach((message) => {
        const date = this.isoDateOnlyTrimmed(message.creationTimestamp)

        if (!groups[date]) groups[date] = [];
        groups[date].push(message);
      });

      // Convert the groups object to an array with 'date' and 'messages'
      return Object.keys(groups).map((date) => ({
        date,
        messages: groups[date],
      }))
      .sort((a, b) => (a.date < b.date) ? -1 : (a.date > b.date) ? 1 : 0)
      .map(g => {
        const timestamp = g.messages[0].creationTimestamp
        if (new Date(timestamp).getFullYear() < new Date().getFullYear()) {
          return {...g, date: this.midDate(g.messages[0].creationTimestamp)}
        }
        return {...g, date: this.dayMonth(g.messages[0].creationTimestamp)}

      })
    },
  },
  mounted() {
    this.connect()
    this.fetchChatMessages()
    this.loading = false
  },
  watch: {
    chat() {
      this.fetchChatMessages()
    },
  },
  methods: {
    connect() {
      this.stompClient = new Client({
        brokerURL: import.meta.env.VITE_API_URL.replace('http', 'ws') + 'ws',
        onConnect: () => {
          this.stompClient.subscribe('/user/' + this.user.id + '/queue/messages',
            (newMsg) => {
              const msg = JSON.parse(newMsg.body)
              if (msg.creator.id === this.recipientId) this.appendMessage(msg)
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
      this.messages.push(newMsg)
    },
    async fetchChatMessages(){
      this.messages = await this.$store.fetchChatMessages(this.recipientId)
    },
    sendMessage() {
      if (this.stompClient && !this.messageText.isEmpty) {

        const newMessage = this.createMessageObj(this.messageText)

        this.stompClient.publish({
          destination: '/app/chat',
          body: JSON.stringify(newMessage),
        })

        this.appendMessage(newMessage)
        this.$emit('messageSent',newMessage)
        this.messageText = ''
      }
    },
    createMessageObj(messageText){
      return {
        text: messageText,
        sender: this.user,
        recipient : { id: this.recipientId },
        chat: { id: this.chat.id },
        token: this.token
        // token: useJwt.getToken()

      }
    }
  },
}
</script>

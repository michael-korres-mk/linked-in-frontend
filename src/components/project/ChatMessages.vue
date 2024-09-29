<template>
  <div v-if="groupedMessages.length > 0">
    <VVirtualScroll
      :items="groupedMessages"
      height="30vw"
      class="border-solid bg-white"
    >
      <template #default="{ item }">
        <div>
          <!-- Display Date -->
          <VDivider class="text-black">{{ item.date }}</VDivider>

          <!-- Loop through the messages of that date -->
          <div>
            <div v-for="(message, i) in item.messages" :key="i">
              <ChatMessage :message="message" :index="i" />
            </div>
          </div>
        </div>
      </template>

    </VVirtualScroll>
  </div>
  <h3 v-else style="padding-top: 30px;height:30vw;border-style: solid; border-color: rgb(var(--v-theme-primary));" class="text-info">
    {{ $t('There are no messages yet')}}
  </h3>
  <VTextarea
    :loading="loading"
    :disabled="sending"
    v-model="messageText"
    hide-details
    tile
    density="compact"
    variant="outlined"
    row-height="5"
    rows="2"
    style="border-color: rgb(var(--v-theme-primary));"
    class="border-thin mt-2"
    @keydown="(e) => (e.key === 'Enter')? ((e.shiftKey || (messageText.replace(/\s+/g, '') === ''))? '' : sendMessage()) : () => {} "
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
  </VTextarea>
</template>

<script>
import { Client } from '@stomp/stompjs'
import ChatMessage from "@/components/project/ChatMessage.vue";
import useJwt from "@/plugins/jwt/useJwt.js";

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
      return (this.chat.creator.id == this.user.id)? this.chat.recipient.id : this.chat.creator.id
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
        token: useJwt.getToken()

      }
    }
  },
}
</script>

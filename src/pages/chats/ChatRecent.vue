<template>
  <div class="all-contact-persons-messages">
    <Loader v-if="isLoading" />
    <div
      v-for="chat in chats"
      :key="chat.createdTimestamp"
      class="contact-persons-message-container display-flex"
    >
      <div class="message-information display-flex">
        <div class="float-left message-content">
          <div class="name">{{ chat.sender.title }}</div>
          <div class="message-description cut font-roboto-condensed font-italic">
            {{ chat.message }}
          </div>
          <div class="font-13">{{ mediumDate(chat.createdTimestamp) }}</div>
        </div>
        <div class="date float-right font-weight-light date-read">
          <v-col>
            <v-btn
              :to="{ name: 'chat-history', params: { id: chat.recipient.id } }"
              size="large"
              color="info"
            >
              <span class="text-nowrap"> ΠΕΡΙΣΣΟΤΕΡΑ </span>
              <FontAwesomeIcon
                icon="fa-angles-right"
                class="ml-1"
              />
            </v-btn>
          </v-col>
        </div>
        <div class="clearfix" />
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
export default {
  components: {
    Loader,
  },
  data() {
    return {
      isLoading: true,
      chats: [],
    }
  },
  async mounted() {
    const data = await this.$store.fetchRecentChats()
    if (data) {
      this.chats = data.content
    }
    this.isLoading = false
  },
}
</script>

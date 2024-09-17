<template>
  <div class="all-connection-persons-messages">
    <Loader v-if="isLoading" />
    <div v-for="chat in chats" :key="chat.lastMessage.createdTimestamp" class="connection-persons-message-container display-flex">
      <div class="message-information display-flex">

        <div class="float-left message-content">
          <div class="name">{{ chat.connection.recipient.title }}</div>
          <div class="message-description cut font-roboto-condensed font-italic"> {{ chat.lastMessage.message }} </div>
          <div class="font-13">{{ mediumDate(chat.createdTimestamp) }}</div>
        </div>

        <div class="date float-right font-weight-light date-read">
          <VCol>
            <VBtn :to="`chat-history/${chat.connection.recipient.id}`" size="large" color="info">
              <span class="text-nowrap"> {{ this.$t("See more") }} </span>
              <FontAwesomeIcon icon="fa-angles-right" class="ml-1"/>
            </VBtn>
          </VCol>
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
    this.chats = await this.$store.fetchRecentChats()
    this.isLoading = false
  },
}
</script>

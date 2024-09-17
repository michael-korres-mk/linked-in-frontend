<template>
  <div class="all-connection-persons-messages">
    <Loader v-if="isLoading" />
    <RouterLink v-for="connection in connections" :key="connection.title" :to="`chat-history/${connection.recipient.id}`">
      <div class="connection-persons-message-container display-flex">

        <div class="connection-persons-profile-picture float-left">
          <span class="fas fa-circle green-status"><FontAwesomeIcon icon="fa-solid fa-circle" /></span>
        </div>

          <FontAwesomeIcon :icon="'fa-solid fa-' + (false ? 'building-columns' : 'address-book')" class="font-40"/>

        <div class="message-information display-flex">
          <div class="float-left message-content">
            <div class="name">{{ connection.recipient.title }}</div>
            <div class="message-description">{{ connection.description }}</div>
            <div class="message">{{ connection.message }}</div>
          </div>
          <div class="date float-right font-weight-light grey-label">
            {{ connection.creationDate ? longDate(connection.creationDate) : '' }}
          </div>
          <div class="clearfix" />
        </div>
      </div>
    </RouterLink>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      connections: [],
    }
  },

  async mounted() {
    this.connections = await this.$store.fetchChatContacts()
    this.isLoading = false
  }
}
</script>

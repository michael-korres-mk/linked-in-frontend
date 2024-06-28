<template>
  <div class="all-contact-persons-messages">
    <Loader v-if="isLoading" />
    <RouterLink v-for="contact in contacts" :key="contact.title" :to="`chat-history/${contact.recipient.id}`">
      <div class="contact-persons-message-container display-flex">

        <div class="contact-persons-profile-picture float-left">
          <span class="fas fa-circle green-status"><FontAwesomeIcon icon="fa-solid fa-circle" /></span>
        </div>

          <FontAwesomeIcon :icon="'fa-solid fa-' + (false ? 'building-columns' : 'address-book')" class="font-40"/>

        <div class="message-information display-flex">
          <div class="float-left message-content">
            <div class="name">{{ contact.recipient.title }}</div>
            <div class="message-description">{{ contact.description }}</div>
            <div class="message">{{ contact.message }}</div>
          </div>
          <div class="date float-right font-weight-light grey-label">
            {{ contact.creationDate ? longDate(contact.creationDate) : '' }}
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
      contacts: [],
    }
  },

  async mounted() {
    this.contacts = await this.$store.fetchChatContacts()
    this.isLoading = false
  }
}
</script>

<template>
  <div class="all-contact-persons-messages">
    <RouterLink v-for="contact in contacts" :key="contact.title" :to="`chat-history/${contact.contact.id}`">
      <div class="contact-persons-message-container display-flex">

        <div class="contact-persons-profile-picture float-left">
          <span class="fas fa-circle green-status"><FontAwesomeIcon icon="fa-solid fa-circle" /></span>
        </div>

          <FontAwesomeIcon :icon="'fa-solid fa-' + (false ? 'building-columns' : 'address-book')" class="font-40"/>

        <div class="message-information display-flex">
          <div class="float-left message-content">
            <div class="name">{{ contact.contact.title }}</div>
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
      privateContacts: []
    }
  },
  computed: {
    contacts() {
      return [ ...this.privateContacts]
    }
  },
  async mounted() {
    const data = await this.$store.fetchChatContacts()

    this.privateContacts = data
    // if (data) {
    //   this.privateContacts = data.map((contact) => ({
    //     ...contact,
    //     name: contact.title,
    //     publicAuthority: false
    //   }))
    // }
  }
}
</script>

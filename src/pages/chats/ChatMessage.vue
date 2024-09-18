<template>
  <v-list-item :class="['message-information','display-flex']">

    <v-list-item-title class="d-flex align-center font-16">
      <v-avatar class="border-thin mr-2" color="grey" rounded="25" size="70">
        <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
      </v-avatar>
      <span> <strong>{{ message.sender.title }}</strong> <FontAwesomeIcon icon="fa-circle" style="width:3px" /> {{ shortTime(message.createdDate) }} </span>
    </v-list-item-title>
    <v-list-item-subtitle class="text-black">{{ message.text }}</v-list-item-subtitle>

  </v-list-item>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default: () => ({
        sender: { id: 0 },
        recipient: { id: 0 },
        creationTimestamp: '',
        message: '',
        delivered: false,
        read: false,
      }),
    },
  },
  computed: {
    isSender() {return !this.message.sender || this.user.id === this.message.sender.id},
  },
}
</script>

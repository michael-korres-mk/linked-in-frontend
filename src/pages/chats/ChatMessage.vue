<template>
  <v-list-item :class="['message-information','display-flex']">

    <template v-slot:prepend>
      <v-avatar class="border-thin" color="grey" rounded="25" size="100">
        <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
      </v-avatar>
    </template>

    <v-list-item-title class="name text-info font-weight-bold">
      <div class="d-flex justify-content-between ma-1">
        <span class="name text-info font-weight-bold">{{ message.sender.title }}</span>
        <span> <FontAwesomeIcon icon="fa-solid fa-calendar-days" /> {{ midDate(message.createdTimestamp) }} </span>
      </div>
    </v-list-item-title>
<!--    <v-list-item-subtitle class="message-description cut font-roboto-condensed font-italic">{{ chat.lastMessage.message }}</v-list-item-subtitle>-->

    <template v-slot:append>
      <div> <span class="icon fas fa-clock" /> {{ shortTime(message.createdTimestamp) }} </div>
      <!--        <div class="message-info">-->
      <!--        </div>-->
      <div :class="isSender ? 'bg-info' : ''" class="message-content">{{ message.text }} </div>    </template>
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
        createdTimestamp: '',
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

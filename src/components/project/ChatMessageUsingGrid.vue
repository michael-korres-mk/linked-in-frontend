<template>
  <VRow :class="['display-flex', 'border-thin']">

    <VCol :cols="3">
      <div class="float-left">
        <v-avatar class="border-thin" color="grey" rounded="25" size="60">
          <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
        </v-avatar>
      </div>
    </VCol>
    <VCol :cols="9">
      <div class="d-flex flex-column justify-start align-items-center font-18">
        <div class="d-flex justify-content-between ma-1">
          <span class="name text-info font-weight-bold">{{ message.sender.title }}</span>
          <span> <FontAwesomeIcon icon="fa-solid fa-calendar-days" /> {{ midDate(message.createdTimestamp) }} </span>
        </div>
        <div> <span class="icon fas fa-clock" /> {{ shortTime(message.createdTimestamp) }} </div>
<!--        <div class="message-info">-->
<!--        </div>-->
        <div :class="isSender ? 'bg-info' : ''" class="message-content">{{ message.text }} </div>
      </div>
    </VCol>




  </VRow>
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

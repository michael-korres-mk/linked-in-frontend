<template>
  <div :class="(isSender ? 'right' : 'left') + '-align-message'">

    <div class="message-info">
      <div> <FontAwesomeIcon icon="fa-solid fa-calendar-days" /> {{ midDate(msg.createdTimestamp) }} </div>
      <div> <span class="icon fas fa-clock" /> {{ shortTime(msg.createdTimestamp) }} </div>
    </div>

    <div :class="isSender ? 'bg-info' : ''" class="message-content">{{ msg.text }} </div>

    <div class="profile-picture">
      <FontAwesomeIcon icon="fa-solid fa-user" :style="{ position: 'relative', top: '9px', left: '15px', color: isSender ? '#d04a02' : '#AAAAAA' }"/>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    msg: {
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
    isSender() {return !this.msg.sender || this.user.id === this.msg.sender.id},
  },
}
</script>

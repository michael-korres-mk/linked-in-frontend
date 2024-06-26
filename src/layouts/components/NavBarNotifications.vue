<template>
  <Notifications
    :notifications="notifications"
    @remove="removeNotification"
    @click:notification="handleNotificationClick"
  />
</template>

<script>
import axios from '@axios'

export default {
  data() {
    return {
      notifications: [],
    }
  },
  async mounted() {
    this.getNotifications() 
    setInterval(() => {
      this.getNotifications() 
    }, 300000) // 5 minutes
  },
  methods: {
    async getNotifications() {
      this.notifications = await this.$store.fetchList('notifications/fresh')
    },
    handleNotificationClick(notification) {
      if (notification.url) {
        this.$router.push(notification.url)
      }
    },    
    removeNotification(notificationId) {
      this.notifications = this.notifications.filter(item => item.id != notificationId)
      axios.put(`notifications/dismiss/${notificationId}`)
    },
  },
}
</script>

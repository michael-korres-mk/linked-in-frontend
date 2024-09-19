<template>
  <v-list-item
     :class="['message-information', 'display-flex', 'border-thin',{'clicked-connection': clicked}]"
     @click="chatPicked"
  >
      <template v-slot:prepend>
        <v-avatar class="border-thin" color="grey" rounded="25" size="100">
          <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
        </v-avatar>
      </template>

      <v-list-item-title v-if="chat.recipient.title" class="name text-info font-weight-bold">{{ chat.recipient.title }}</v-list-item-title>
      <v-list-item-subtitle v-if="chat.lastMessage" class="message-description cut font-roboto-condensed font-italic">{{ chat.lastMessage.text }}</v-list-item-subtitle>
      <div v-else>{{ $t('New chat')}}</div>
      <template v-slot:append>
        <div class="font-12">{{ shortDate(chat.creationTimestamp) }}</div>
      </template>
    </v-list-item>
</template>

<script>
export default {
  name: "Chat",
  emits:['chatPicked'],
  props: {
    chat: {
      type: {},
      required: true,
    },
    clicked:{
      type: Boolean,
      required: true,
    }
  },
  methods:{
    chatPicked() {
      this.$emit('chatPicked', this.chat.id)
    }
  }
}
</script>


<style scoped lang="scss">
  .clicked-connection {
    background-color: #ccc;
  }
</style>

<template>
  <v-list-item
     :class="['message-information', 'display-flex', 'border-thin',{'clicked-connection': clicked}]"
     @click="chatClicked"
  >
      <template v-slot:prepend>
        <v-avatar class="border-thin" color="grey" rounded="25" size="100">
          <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
        </v-avatar>
      </template>

      <v-list-item-title v-if="chat.recipient.title" class="name text-info font-weight-bold">{{ chat.recipient.title }}</v-list-item-title>
      <v-list-item-subtitle class="message-description cut font-roboto-condensed font-italic">{{ chat.lastMessage.text }}</v-list-item-subtitle>

      <template v-slot:append>
        <div class="font-12">{{ shortDate(chat.createdTimestamp) }}</div>
      </template>
    </v-list-item>
</template>

<script>
export default {
  name: "Chat2",
  emits:['chatClicked'],
  props: {
    chat: {
      type: {},
      required: true,
    },
    index:{
      type: Number,
      required: true,
    },
    clicked:{
      type: Boolean,
      required: true,
    }
  },
  methods:{
    chatClicked() {
      this.$emit('chatClicked', this.index)
    }
  }
}
</script>


<style scoped lang="scss">
  .clicked-connection {
    background-color: #ccc;
  }
</style>

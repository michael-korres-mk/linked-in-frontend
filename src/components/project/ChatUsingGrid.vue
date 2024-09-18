<template>
  <VRow
      :key="chat.lastMessage.createdTimestamp"
      :class="['message-information', 'display-flex', 'border-thin',{'clicked-connection': clicked}]"
      @click="chatClicked"
  >
    <VCol :cols="4">
      <div>
        <v-avatar class="border-thin" color="grey" rounded="25" size="100">
          <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover />
        </v-avatar>
      </div>
    </VCol>
    <VCol :cols="5">
      <div class="d-flex flex-column justify-start align-items-center font-18">
        <div class="name text-info font-weight-bold">{{ chat.recipient.title }}</div>
        <div class="message-description cut font-roboto-condensed font-italic"> {{ chat.lastMessage.message }} </div>
      </div>
    </VCol>
    <VCol :cols="3">
      <div class="font-12">{{ shortDate(chat.createdTimestamp) }}</div>
    </VCol>
  </VRow>
</template>

<script>
export default {
  name: "Chat",
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

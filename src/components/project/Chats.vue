<template>
    <VVirtualScroll
      :items="chats"
      height="450"
      class="border-solid bg-white"
    >
      <template #default="{ item }">
        <Chat :chat="item" @chatClicked="chatClicked" :clicked="clicked === item.id" />
      </template>

    </VVirtualScroll>
</template>


<script>
import Chat from "@/components/project/Chat.vue";

export default {
  name: "Chats",
  components: {Chat},
  emits:['chatClicked'],
  props: {
    chats: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      clicked: -1
    }
  },
  methods:{
    chatClicked(chatId){
      this.clicked = chatId
      this.$emit('chatClicked', chatId)
    }
  }
}
</script>


<style scoped lang="scss">

.ps {
  max-height: 100px; /* or height: 100px; */
}
</style>

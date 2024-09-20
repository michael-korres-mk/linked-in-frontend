<template>
    <VVirtualScroll
      :items="chats"
      height="450"
      class="border-solid bg-white"
    >
      <template #default="{ item }">
        <Chat :chat="item" @chatPicked="chatPicked" :clicked="clicked == item.id" />
      </template>

    </VVirtualScroll>
</template>


<script>
import Chat from "@/components/project/Chat.vue";

export default {
  name: "Chats",
  components: {Chat},
  emits:['chatPicked'],
  props: {
    chats: {
      type: Array,
      required: true,
    },
    clicked:{
      type: Number,
      required: true
    },
  },
  methods:{
    chatPicked(chatId){
      this.$emit('chatPicked', chatId)
    }
  }
}
</script>


<style scoped lang="scss">

.ps {
  max-height: 100px; /* or height: 100px; */
}
</style>

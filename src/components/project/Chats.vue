<template>
    <VVirtualScroll
      :items="chats"
      height="100%"
      style="border-style: solid; border-color: rgb(var(--v-theme-primary)); background-color: #FFF;"
    >
      <template #default="{ item }">
        <Chat :chat="item" @chatPicked="chatPicked" :clicked="activeChat.id == item.id" />
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
    activeChat:{
      type: Object,
      required: true
    },
  },
  methods:{
    chatPicked(chat){
      this.$emit('chatPicked', chat)
    }
  }
}
</script>


<style scoped lang="scss">
.ps {
  max-height: 100px; /* or height: 100px; */
}
</style>

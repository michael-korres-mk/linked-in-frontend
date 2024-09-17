<template>
    <VVirtualScroll
      :items="chats"
      height="450"
      class="border-solid"
    >
      <template #default="{ index , item }">
        <Chat :chat="item" :index="index" @chatClicked="chatClicked" :clicked="clicked === index" />
      </template>

    </VVirtualScroll>
</template>


<script>
import Chat from "@/pages/chats/Chat.vue";

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
    chatClicked(index){
      this.clicked = index
      this.$emit('chatClicked', index)
    }
  }
}
</script>


<style scoped lang="scss">

.ps {
  max-height: 100px; /* or height: 100px; */
}
</style>

<script setup>
  import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
</script>
<template>
    <PerfectScrollbar :options="{ wheelPropagation: false }" class="border-solid" style="max-block-size: 23.75rem;">
      <Chat v-for="(chat,i) in chats" :chat="chat" :index="i" @chatClicked="chatClicked" :clicked="clicked === i" />
    </PerfectScrollbar>
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

</style>

<script setup>
// definePage({
//   meta: {
//     authority: 'submissions',
//   },
// })
  import UsersGrid from "@/pages/network/UsersGrid.vue";

  const users = [
    { id:1,title:'User1', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 4 },
    { id:2,title:'User2', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 4 },
    { id:3,title:'User3', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 4 },
    { id:4,title:'User4', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 4 },
    { id:5,title:'User5', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 4 },
    { id:6,title:'User6', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 4 },
  ]

</script>

<template>
  <h1 class="text-center text-info">
    {{ this.$t('Network') }}
  </h1>

  <div class="card-wrapper">
    <div class="card-body text-center">
      <UsersGrid :users="users" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    

  },
  async mounted() {
    
  },
  methods: {
    redirect(param) {
      this.$router.push({
        name: 'applications-category',
        params: { category: param },
      })
    },
  },
}
</script>

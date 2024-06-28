<script setup>
definePage({
  meta: {
    authority: 'applications',
  },
})
</script>

<template>
  <h1 class="text-center text-info">
    Αρχική
  </h1>
  <div class="card-wrapper">
    <div class="card-body text-center">

      <Post :title="title"/>
      <Post :title="title"/>
      <Post :title="title"/>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Disruptive Tech News"
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

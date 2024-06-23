<script setup>
definePage({
  meta: {
    authority: 'submissions',
  },
})
</script>

<template>
  <h1 class="text-center text-info">
    Αρχική
  </h1>
  <div class="card-wrapper">
    <div class="card-body text-center">
      Καλώς Ήρθατε στο Linked In
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

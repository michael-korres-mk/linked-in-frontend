<script setup>
definePage({
  meta: {
    authority: 'submissions',
  },
})
</script>

<template>
  <div class="card-wrapper">
    <div class="card-body text-center">
      Υπό Κατασκευή
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

<script setup>
import PostList from "@/components/PostList.vue";

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

      <PostList
        :config="config"
        :filters="filters"
        :results-per-page="2"
      />

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
    config() {
      return {
        endpoint: 'users',
        route: 'users',
        title: {
          single: 'Post',
          plural: 'Posts',
          geniki: 'Post(gen)',
        },
      }
    },
    filters() {
      return [
        {
          id: 'id',
          type: 'number',
          label: this.$t('User Code'),
          colSize: 4,
        },
        {
          id: 'firstName',
          type: 'text',
          label: this.$t('User FirstName'),
          colSize: 4,
        },
        {
          id: 'lastName',
          type: 'text',
          label: this.$t('User LastName'),
          colSize: 4,
        }
      ]
    }
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

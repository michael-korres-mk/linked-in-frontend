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
          id: 'searchTerm',
          type: 'text',
          label: this.$t('Search'),
          colSize: 4,
        },
      ]
    }
  }
}
</script>

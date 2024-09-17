<script setup>
import PostList from "@/components/project/PostList.vue";

// definePage({
//   meta: {
//     authority: 'applications',
//   },
// })
</script>

<template>
  <h1 class="text-center text-info">
    Αρχική
  </h1>
  <div class="card-wrapper bg-global-primary">
    <div class="card-body text-center">

      <PostList
        :config="config"
        :results-per-page="7"
        hide-view
      />

<!--        :filters="filters"-->
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    config() {
      return {
        endpoint: 'posts',
        route: 'posts',
        title: {
          single: 'Post',
          plural: 'Posts',
          geniki: 'Post(gen)',
        },
      }
    },
  }
}
</script>

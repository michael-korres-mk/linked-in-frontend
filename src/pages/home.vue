<script setup>
import DataIterator from "@/components/entity/DataIterator.vue";

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

      <DataIterator
        :config="config"
        :results-per-page="7"
        hide-view
        :extra-styling="extraStyling"
      >
        <template #default="{ items,itemUpdated }" >
          <Post v-for="item in items.map(i => i.value)" :post="item" @itemUpdated="itemUpdated"/>
        </template>
      </DataIterator>

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
    extraStyling() {
      return {
        container: ['post-list'],
        cardBody: ['post-list']
      }
    }
  }
}
</script>

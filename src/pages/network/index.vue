<script setup>
// definePage({
//   meta: {
//     authority: 'submissions',
//   },
// })
  import UsersGrid from "@/pages/network/UsersGrid.vue";
</script>

<template>
  <h1 class="text-center text-info">
    {{ $t('Network') }}
  </h1>

  <v-card>
    <v-tabs v-model="tab" grow>
      <v-tab value="tab-1">
        {{ this.$t('Connected Users') }}
      </v-tab>
      <v-tab value="tab-2">
        {{ this.$t('Connection Requests') }}
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item class="card-body" value="tab-1">
          <UsersGrid :config="config" :results-per-page="9" hide-view />
      </v-tabs-window-item>
      <v-tabs-window-item class="card-body" value="tab-2">
        <UsersGrid :config="config" :results-per-page="2" hide-view />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      tab: 'posts',
      tabItems:[
        {
          key: 'posts',
          value: 'posts',
          text: 'Posts',
          component: PostList,
        },
        {
          key: 'users',
          value: 'users',
          text: 'Users',
          component: () => import('@/pages/network/UsersGrid.vue'), // Lazy-load the component
        }
      ]
    }
  },
  computed: {
    config() {
      return {
        endpoint: 'users',
        route: 'users',
        title: {
          single: 'Network',
          plural: 'Posts',
          geniki: 'Post(gen)',
        },
      }
    },
  }
}
</script>

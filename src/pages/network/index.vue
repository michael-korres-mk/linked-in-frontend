<script setup>
// definePage({
//   meta: {
//     authority: 'submissions',
//   },
// })
  import UsersGrid from "@/pages/network/UsersGrid.vue";
import UsersList from "@/components/project/UsersList.vue";

</script>

<template>
  <h1 class="text-center text-info">
    {{ $t('Network') }}
  </h1>

  <v-card>
    <v-tabs v-model="tab" grow>
      <v-tab value="tab-1">
        {{ $t('My Network') }}
      </v-tab>
      <v-tab value="tab-2">
        {{ $t('Search') }}
      </v-tab>
<!--      <v-tab value="tab-3">-->
<!--        {{ $t('Connection Requests') }}-->
<!--      </v-tab>-->
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item class="card-body" value="tab-1">
          <UsersGrid :config="config" :results-per-page="9" hide-view />
      </v-tabs-window-item>
      <v-tabs-window-item class="card-body" value="tab-2">
        <UsersList :config="config" :results-per-page="9" hide-view />
      </v-tabs-window-item>
      <v-tabs-window-item class="card-body" value="tab-3">
        <UsersGrid :config="config" :results-per-page="2" hide-view />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      tab: 'tab-2',
      tabItems:[
        {
          key: 'posts',
          value: 'posts',
          text: 'Posts',
        },
        {
          key: 'users',
          value: 'users',
          text: 'Users',
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

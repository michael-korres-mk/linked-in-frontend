<script setup>
// definePage({
//   meta: {
//     authority: 'submissions',
//   },
// })
  import UsersGrid from "@/components/project/UsersGrid.vue";
import UsersList from "@/components/project/UsersList.vue";

</script>

<template>
  <h1 class="text-center text-info">
    {{ $t('Network') }}
  </h1>
  <div class="card-wrapper bg-global-primary">
      <div v-if="$route.params.id != '0'">
          <div class="card-wrapper" style="margin: 1.5em;">
            <h2 class="text-center text-info card-body">{{$t('The Network of user: ') + networkUser.title}}</h2>
            <UsersGrid
              :config="connectionsConfig"
              :results-per-page="9"
              :filters="connectionsfilters"
              auto-update-filters
              hide-view
              hide-legend
              hide-filters
            />
          </div>
      </div>
    <div v-else class="card-body text-center">
      <v-card>
        <v-tabs v-model="tab" grow>
          <v-tab value="tab-1">
            {{ $t('My Network') }}
          </v-tab>
          <v-tab value="tab-2">
            {{ $t('Search') }}
          </v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item class="card-body" value="tab-1">
            <h2 class="text-center text-info">{{ $t('My Network')}}</h2>
            <UsersGrid
              :config="connectionsConfig"
              :results-per-page="9"
              :filters="connectionsfilters"
              auto-update-filters
              hide-view
              hide-legend
              hide-filters
            />
          </v-tabs-window-item>
          <v-tabs-window-item class="card-body" value="tab-2">
            <h2 class="text-center text-info">{{ $t('Search') }}</h2>
            <UsersList
              :config="config"
              :filters="filters"
              :results-per-page="9"
              auto-update-filters
              hide-filter-legend
              hide-view
            />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </div>
  </div>
</template>

<script>
import useGenericEntityStore from "@/stores/entity.js";
import {defineStore} from "pinia";

export default {
  data() {
    return {
      tab: 'tab-2',
      userStore: defineStore('users', useGenericEntityStore('users'))(),
      networkUser: {}
    }
  },
  mounted(){
    if(this.$route.params.id !== 0) this.fetchNetworkUser();
  },
  computed: {
    connectionsConfig() {
      return {
        endpoint: 'connection-requests',
        route: 'network',
        title: {
          single: 'Network',
          plural: 'Networks',
          geniki: 'Network(gen)',
        },
      }
    },
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
    connectionsfilters() {
      return [
        {
          id: 'creator',
          type: 'text',
          label: this.$t('User Search'),
          initVal: (this.$route.params.id == '0') ? this.user.id : this.$route.params.id,
          colSize: 4,
        },
        {
          id: 'accepted',
          type: 'checkbox',
          label: this.$t('User Search'),
          initVal: true,
          colSize: 4,
        }
      ]
    },
    filters() { // TODO: disable add for connected users ?
      return [
        {
          id: 'q',
          type: 'text',
          label: this.$t('Users Search'),
          placeholder: this.$t('Search') + '...',
          icon: 'tabler-search',
          clearable: true,
          colSize: 12,
        },
        {
          id: 'exceptLoggedUser',
          type: 'checkbox',
          label: this.$t('User Search'),
          initVal: true,
          hidden:true,
          colSize: 4,
        }
      ]
    },
  },
  methods:{
    async fetchNetworkUser(){
      this.networkUser = await this.userStore.getEntity(this.$route.params.id)
    }
  }
}
</script>

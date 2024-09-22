<script setup>
import DataIterator from "@/components/entity/DataIterator.vue";

definePage({
  meta: {
    authority: 'submissions',
  },
})
</script>

<template>
  <h1 class="text-center text-info">
    {{ $t('Jobs')}}
  </h1>
  <div class="card-wrapper bg-global-primary">
    <v-card>
      <v-tabs v-model="tab" grow>
        <v-tab value="tab-1">
          {{ $t('My Jobs') }}
        </v-tab>
        <v-tab value="tab-2">
          {{ $t('Search') }}
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item class="card-body" value="tab-1">
          <h2 class="text-center text-info">{{ $t('My Jobs')}}</h2>
          <DataIterator
            :config="config"
            :filters="filters"
            :results-per-page="9"
            auto-update-filters
            hide-filter-legend
            hide-view
            :extra-styling="extraStyling"
          >
            <template #default="{ items }" >
              <JobListItem v-for="item in items.map(i => i.value)" :item="item"/>
            </template>
          </DataIterator>
        </v-tabs-window-item>
        <v-tabs-window-item class="card-body" value="tab-2">
          <h2 class="text-center text-info">{{ $t('Search') }}</h2>
          <DataIterator
            :config="config"
            :filters="filters"
            :results-per-page="9"
            auto-update-filters
            hide-filter-legend
            hide-view
            hide-insert-btn
            :extra-styling="extraStyling"
          >
            <template #default="{ items }" >
              <JobListItem v-for="item in items.map(i => i.value)" :item="item"/>
            </template>
          </DataIterator>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>

  </div>

</template>

<script>
export default {

  data(){
    return {
      tab: 'tab-1',
    }
  },
  computed: {
    config() {
      return {
        endpoint: 'jobs',
        route: 'jobs',
        title: {
          single: 'Job',
          plural: 'Jobs',
          geniki: 'Job(gen)',
        },
      }
    },
    filters() {
      return [
        // {
        //   id: 'id',
        //   type: 'number',
        //   label: this.$t('User Code'),
        //   colSize: 4,
        // },
        // {
        //   id: 'searchTerm',
        //   type: 'text',
        //   label: this.$t('Search'),
        //   colSize: 4,
        // },
      ]
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

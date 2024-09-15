<script setup>
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

      <JobsList :config="config" :filters="filters" :filters-legend-title="''" :results-per-page="9" hide-view />

  </div>

</template>

<script>
export default {
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
    }
  }
}
</script>

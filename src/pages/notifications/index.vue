<script setup>
import EntityList from '../../components/entity/EntityList.vue';

// definePage({
//   meta: {
//     authority: 'announcements',
//   },
// })
</script>

<template>

  <EntityList
    ref="list"
    :config="config"
    :columns="columns"
    :formatted-columns="formattedColumns"
    :filters="connectionRequestFilter"
    :extra-actions="connectionRequestActions"
    hide-insert-btn
    hide-edit
    hide-view
    hide-delete
    auto-update-filters
    hide-filters
  />

  <EntityList
    ref="list"
    :config="config"
    :columns="columns"
    :filters="expressionOfInterestFilter"
    :formatted-columns="formattedColumns"
    :extra-actions="expressionOfInterestActions"
    hide-insert-btn
    hide-edit
    hide-view
    hide-delete
    auto-update-filters
    hide-filters
  />
</template>

<script>
export default {
  computed: {
    config() {
      return {
        endpoint: 'notifications',
        route: 'notifications',
        title: {
          geniki: 'Notifications',
        },
      }
    },
    columns() {
      return [
        {
          key: 'creationDate',
          title: 'Date',
        },
        {
          key: 'title',
          title: 'Title',
        },
      ]
    },
    formattedColumns() {
      return [
        // {
        //   key: 'kind',
        //   callback: 'translate',
        // },
        {
          key: 'creationDate',
          callback: 'dateOnly',
        },
      ]
    },
    expressionOfInterestFilter() {
      return [
        {
          id: 'kind',
          type: 'text',
          initVal: 'EXPRESSION_OF_INTEREST',
        }
        ]
    },
    connectionRequestFilter() {
      return [
        {
          id: 'kind',
          type: 'text',
          initVal: 'CONNECTION_REQUEST',
        }
      ]
    },
    expressionOfInterestActions() {
      return [
        {
          title: 'Visit',
          icon: 'fa-link',
          callback: this.fetchExtraItem,
          propertyExists: 'url',
        },
      ]
    },
    connectionRequestActions() {
      return [
        {
          title: 'Accept',
          icon: 'fa-check',
          // callback: this.acceptRequest,
        },
        {
          title: 'Delete',
          icon: 'fa-trash-can',
          // callback: this.deleteRequest,
        },
        {
          title: 'Visit',
          icon: 'fa-link',
          callback: this.fetchExtraItem,
          propertyExists: 'url',
        },
      ]
    },
  },
  methods: {
    fetchExtraItem(item) {
      if (item.url) {
        this.$router.push(item.url)
      }
    },
  },
}
</script>

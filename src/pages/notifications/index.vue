<script setup>
import EntityList from '../../components/entity/EntityList.vue';

definePage({
  meta: {
    authority: 'announcements',
  },
})
</script>

<template>
  <EntityList
    ref="list"
    :config="config"
    :columns="columns"
    :formatted-columns="formattedColumns"
    :extra-actions="extraActions"
    authority="announcements"
    hide-insert-btn
    hide-edit
    hide-view
    hide-delete
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
          key: 'kind',
          title: 'Kind',
        },
        {
          key: 'title',
          title: 'Title',
        },
      ]
    },
    formattedColumns() {
      return [
        {
          key: 'kind',
          callback: 'translate',
        },
        {
          key: 'creationDate',
          callback: 'dateOnly',
        },
      ]
    },
    extraActions() {
      return [
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

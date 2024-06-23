<template>
  <EntityList
    ref="entityList"
    :config="config"
    :columns="columns"
    :formatted-columns="formattedColumns"
    :legend-title="legendTitle"
    :custom-query="customQuery"
    :show-select="showSelect"
    :filters="filters"
    :parent-entity="parentEntity"
    :selections="selections"
    authority="users"
    @itemSelected="handleSelectedChange"
  />
</template>

<script>
import EntityList from './entity/EntityList.vue'

export default {
  components: {
    EntityList,
  },
  props: {
    legendTitle: {
      type: String,
      default: 'Αποτελέσματα Αναζήτησης',
    },
    showSelect: {
      type: Boolean,
      default: false,
    },
    filters: {
      type: Array,
      default: () => [],
    },
    customQuery: {
      type: Object,
      default: () => {},
    },
    removeColumn: {
      type: String,
      default: '',
    },
    parentEntity: {
      type: Object,
      default: null,
    },
    selections: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['itemSelected'],
  computed: {
    config() {
      return {
        endpoint: 'users',
        route: 'users',
        title: {
          single: 'User',
          plural: 'Users',
          geniki: 'User(gen)',
        },
      }
    },
    columns() {
      const cols = [
        {
          key: 'market',
          title: 'Market',
        },
        {
          key: 'organization.title',
          title: 'Organization',
        },
        {
          key: 'id',
          title: 'Code User',
        },
        {
          key: 'afm',
          title: 'Tax User',
        },
        {
          key: 'title',
          title: 'Name User',
        },
        {
          key: 'enabled',
          title: 'Status',
        },
      ]

      if (this.removeColumn.length) {
        return cols.filter(item => item.key !== this.removeColumn)
      }

      return cols
    },
    formattedColumns() {
      return [
        { key: 'market', callback: 'translate' },
        { key: 'enabled', callback: 'booleanTitle' },
      ]
    },
  },
  methods: {
    handleSelectedChange(selectedItems) {
      this.$emit('itemSelected', selectedItems)
    },
  },
}
</script>

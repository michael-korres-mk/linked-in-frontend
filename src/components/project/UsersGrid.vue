<template>

    <TableFilters
      v-if="filters.length"
      ref="filters"
      :filters-legend-title="filtersTitle"
      :filters="filters"
      :hide-filter-legend="hideFilterLegend"
      :hide-filters="hideFilters"
      :auto-update-filters="autoUpdateFilters"
      @initFilters="initFilterValues"
      @filterUpdated="filterUpdated"
      @applyFilters="updateFilterValues"
    />

    <v-container  fluid>
    <!-- 👉 Table Container Legend -->
      <legend v-if="!hideLegend" class="legend-title">
        {{ legendTitle }}
      </legend>
      <div class="card-body">
        <VCard>
          <VRow>
            <VCol>
              <VDataIterator
                v-if="tableReady"
                :items-per-page="perPage"
                :items-length="totalRows"
                :items="filteredEntities"
                :loading="loading"
                :sort-by="[sortBy]"
                :page="currentPage"
                return-object
                dense
                @update:sortBy="sortByChange"
                @update:options="fetchEntities"
              >
                <template #default="{ items }">
                  <v-row >
                    <v-col v-for="item in items.map(i => i.value)" :cols="4">
                      <UserCard :card="item" />
                    </v-col >
                  </v-row >

                </template>

                <!-- 👉 Pagination Setup -->
                <template #footer>
                  <slot name="extraFooterContent" />
                  <VRow v-if="!hidePagination" class="pt-4 pb-3">
                    <!-- 👉 Pagination Label -->
                    <VCol class="pt-6 ps-4">
                      <label v-if="totalRows" class="font-15">
                        {{
                          $t('ShowingEntries', {
                            from: (currentPage - 1) * perPage + 1,
                            to:
                              totalRows < perPage
                                ? totalRows
                                : currentPage * perPage,
                            entries: totalRows,
                          })
                        }}
                      </label>
                    </VCol>
                    <!-- 👉 Pagination Functionality -->
                    <VCol>
                      <VPagination
                        v-show="totalPages > 0"
                        v-model="currentPage"
                        :length="totalPages"
                        color="primary"
                        rounded="md"
                        class="elevation-0 justify-end"
                        @update:modelValue="pageChange"
                        @input="pageChange"
                      />
                    </VCol>
                  </VRow>
                </template>
              </VDataIterator>
            </VCol>
          </VRow>
        </VCard>
      </div>
    </v-container>
</template>

<script>
import UserCard from "@/components/project/UserCard.vue";
import {defineStore} from "pinia";
import useGenericEntityStore from "@/stores/entity.js";

export default {
  name: "UsersGrid",
  components: {UserCard},
  setup(props) {
    const entityStore = defineStore(
      props.config.endpoint,
      useGenericEntityStore(props.config.endpoint),
    )()

    return {
      entityStore,
    }
  },
  data(){
    return {
      userRequests: [],
      users:[],
      allowInsert: false,
      allowEdit: false,
      allowDelete: false,
      editDialogOpen: false,
      isEntityDuplicate: false,
      perPage: 10,
      totalRows: 0,
      currentPage: 1,
      totalPages: 0,
      perPageOptions: [10, 25, 50, 100],
      searchQuery: '',
      sortBy: { key: this.sortKey, order: this.descSort ? 'desc' : 'asc' },
      entities: [],
      removedItems: [],
      tableReady: false,
      loading: true,
      disableActions: false,
      deleteDialog: false,
      deleteModalId: 0,
      entityHeaderTitleField: {},
    }
  },
  props: {
    filtersLegendTitle: {
      type: String,
      required: false,
    },
    showSelect: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      required: true,
    },
    multiSelect: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default() {
        return [
          {
            key: 'id',
            title: 'id',
          },
          {
            key: 'title',
            title: 'title',
          },
        ]
      },
    },
    legendTitle: {
      type: String,
      default: 'Αποτελέσματα Αναζήτησης',
    },
    singleEdit: {
      type: Boolean,
      default: true,
    },
    allowDuplicate: {
      type: Boolean,
      default: false,
    },
    hideView: {
      type: Boolean,
      default: false,
    },
    hideEdit: {
      type: Boolean,
      default: false,
    },
    hideDelete: {
      type: Boolean,
      default: false,
    },
    hideEnabled: {
      type: Boolean,
      default: true,
    },
    hideInsertBtn: {
      type: Boolean,
      default: false,
    },
    detailsViewIcon: {
      type: String,
      default: 'fa-desktop',
    },
    detailsViewTitle: {
      type: String,
      default: 'Details',
    },
    filters: {
      type: Array,
      default: () => [],
    },
    customQuery: {
      type: Object,
      default: () => {},
    },
    resultsPerPage: {
      type: Number,
      default: 10,
    },
    formattedColumns: {
      type: Array,
      default: null,
    },
    authority: {
      type: String,
      default: '',
    },
    extraActions: {
      type: Array,
      default: null,
    },
    selections: {
      type: Array,
      default: () => [],
    },
    blankEntity: {
      type: Object,
      default: () => ({}),
    },
    parentEntity: {
      type: Object,
      default: null,
    },
    hideLegend: {
      type: Boolean,
      default: false,
    },
    isSelectable: {
      type: Function,
      default: () => true,
    },
    hideTableActions: {
      type: Boolean,
      default: false,
    },
    sortKey: {
      type: String,
      default: 'id',
    },
    descSort: {
      type: Boolean,
      default: true,
    },
    showDownloadBtn: {
      type: Boolean,
      default: false,
    },
    hideFilterLegend: {
      type: Boolean,
      default: false,
    },
    hideFilters: {
      type: Boolean,
      default: false,
    },
    autoUpdateFilters: {
      type: Boolean,
      default: false,
    },
    hidePagination: {
      type: Boolean,
      default: false,
    },
    dialogCreate: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selectedItems: {
      get() {
        return this.selections
      },
      set(val) {
        this.$emit('itemSelected', val)
      },
    },

    filteredEntities() {
      if (this.isSelectable) {
        return this.entities.map(entity => {
          entity.selectable = this.isSelectable(entity)

          return entity
        })
      }

      return this.entities
    },
    filtersTitle() {
      return this.filtersLegendTitle || `Αναζήτηση ${this.$t(this.config.title.geniki)}`
    },
    exportFields() {
      const jsonFields = {}
      for (const obj of this.columns) {
        const label = obj.title || obj.key

        jsonFields[label] = obj.key
      }

      return jsonFields
    },
    dialogTitle() {
      return this.isEntityDuplicate
        ? this.$t('Duplicate') + ' ' + this.$t(this.config.title.geniki)
        : this.$route.params.id == 0
          ? this.$t('Add New') + ' ' + this.$t(this.config.title.geniki)
          : this.$t('Edit') + ' ' + this.$t(this.config.title.geniki)
    },
  },
  mounted() {
    // this.fetchConnectionRequests()

    const rights = this.$store.userRights

    this.allowInsert = true
    this.allowEdit = true
    this.allowDelete = true

    // this.allowInsert = rights.includes(`${this.authority}_edit`)
    // this.allowEdit = rights.includes(`${this.authority}_edit`)
    // this.allowDelete = rights.includes(`${this.authority}_edit`)

    this.perPage = this.resultsPerPage
    this.tableReady = true
  },
  methods: {
    async fetchConnectionRequests(){
      this.userRequests = await this.$store.fetchUserRequests()
    },
    updateDeleteModalId(deleteId) {
      this.deleteModalId = deleteId
      this.deleteDialog = true
    },
    closeDeleteModal() {
      this.deleteModalId = 0
      this.deleteDialog = false
    },
    getQueryParams() {
      if(this.totalRows > 0) {
        const maxPage = Math.ceil(this.totalRows / this.perPage)
        if (this.currentPage - 1 > maxPage) {
          this.currentPage = maxPage
        }
      }

      const queryParams = {
        searchquery: this.searchQuery || null,
        page: this.currentPage - 1,
        size: this.perPage,
        sort: `${this.sortBy.key},${this.sortBy.order}`,
      }

      if (this.filters.length) {
        Object.entries(this.filterVals).forEach(([key, value]) => {
          if (value !== null) {
            queryParams[key] = value
          }
        })
      }
      if (this.customQuery) {
        Object.entries(this.customQuery).forEach(([key, value]) => {
          queryParams[key] = value
        })
      }

      return queryParams
    },
    refetchData() {
      this.fetchEntities()
      this.disableActions = false
    },
    pageChange(newPage) {
      this.currentPage = newPage
      this.refetchData()
    },
    sortByChange(sortArr) {
      this.sortBy = sortArr.length ? sortArr[0] : { key: this.sortBy.key, order: this.sortBy.order == 'asc' ? 'desc' : 'asc' }
    },
    fetchEntities() {
      return this.getEntities(this.getQueryParams())
    },
    getEntities(params) {
      return this.entityStore
        .getEntities(params)
        .then(response => {
          const items = response.content

          this.totalRows = response.totalElements || 0
          this.totalPages = response.totalPages
          this.entities = items || []
          this.entityHeaderTitleField = response.entityHeaderTitleField
          this.$emit('entitiesFetched', this.entities)
          this.loading = false

          return this.entities
        })
        .catch(() => {
          this.errorToast({
            title: 'Αδυναμία φόρτωσης λίστας',
          })
        })
    },
    getItemLink(itemId, view = true, singleEdit=1) {
      if (singleEdit) {

        const obj = {
          name: `${this.config.route}-id`,
          params: { id: itemId },
        }

        if (view) {
          obj.query = { view: 1 }
        }
        if (this.parentEntity) {
          obj.query = {
            ...obj.query,
            parent: this.parentEntity.field,
            parentid: this.parentEntity.id,
            parentroute: this.parentEntity.route,
          }
        }

        return obj
      }

      return ''
    },
    extraActionShouldRender(action, item) {

      if (typeof action.renderCondition === 'function') {
        return action.renderCondition(item)
      }

      return (
        (!action.hasOwnProperty('authorityValidation') ||
          action.authorityValidation) &&
        (!action.renderCondition ||
          item[action.renderCondition.key] === action.renderCondition.value) &&
        (!action.propertyExists || item[action.propertyExists]) &&
        (!action.propertyNotExists || !item[action.propertyNotExists])
      )
    },
    fetchItem(item) {
      this.$emit('itemFetched', item)
    },
    setEntityData(entityData) {
      this.fetchItem(entityData)
      this.editDialogOpen = true
    },
    filterUpdated(fieldId, newVal) {
      this.$emit('filterUpdated', fieldId, newVal)
    },
    initFilterValues(selFilters) {
      this.filterVals = selFilters
    },
    updateFilterValues(selFilters) {
      this.filterVals = selFilters
      this.refetchData()
    },
  },
}
</script>


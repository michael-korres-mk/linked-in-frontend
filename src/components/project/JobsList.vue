<!-- eslint-disable vue/no-v-html -->
<template>
  <VContainer fluid>
    <div :class="!hideLegend ? 'card-wrapper' : 'card-wrapper-nl'">
      <!-- 👉 Table Container Legend -->
      <legend v-if="!hideLegend" class="legend-title">
        {{ legendTitle }}
      </legend>
      <div class="card-body">
        <VCard class="elevation-0">

          <TableFilters
            v-if="filters.length"
            ref="filters"
            :filters-legend-title="filtersLegendTitle"
            :filters="filters"
            :hide-filter-legend="hideFilterLegend"
            :auto-update-filters="autoUpdateFilters"
            @initFilters="initFilterValues"
            @filterUpdated="filterUpdated"
            @applyFilters="updateFilterValues"
          />


          <!-- 👉 Table Container Card -->
          <VRow class="mt-0 pt-0">
            <VCol>
              <VDataIterator
                v-if="tableReady && filteredEntities.length > 0"
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
                  <JobListItem v-for="item in items.map(i => i.value)" :item="item"/>
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
              <div
                v-else
              >
                {{ $t('No jobs found')}}
              </div>
            </VCol>
          </VRow>
        </VCard>
      </div>
    </div>
  </VContainer>
</template>

<script>
import useGenericEntityStore from '@/stores/entity.js'
import { defineStore } from 'pinia'
import ADialog from '../Dialog.vue'
import ActionBtn from '../entity/ActionBtn.vue'
import UserListItem from "@/components/project/UserListItem.vue";

/**
 * The generic EntityList component for lists.
 * @displayName EntityList
 */
export default {
  components: {
    UserListItem,
    ActionBtn,
    ADialog,
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
      default: '',
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
  emits: [
    'entitiesFetched',
    'itemSelected',
    'itemFetched',
    'entityDeleted',
    'editModeSet',
    'extraItemFetched',
  ],
  setup(props) {
    const entityStore = defineStore(props.config.endpoint, useGenericEntityStore(props.config.endpoint),)()

    return {
      entityStore,
    }
  },
  data() {
    return {
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

    this.fetchEntities()

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
    getCreateLink() {
      if (this.singleEdit && !this.dialogCreate) {
        const createObj = {
          name: `${this.config.route}-id`,
          params: { id: 0 },
        }

        if (this.parentEntity) {
          createObj.query = {
            parent: this.parentEntity.field,
            parentid: this.parentEntity.id,
          }
        }

        return createObj
      }

      return ''
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
    getViewLink(itemId) {
      return this.getItemLink(itemId)
    },
    getEditLink(itemId) {
      return this.getItemLink(itemId, false, this.singleEdit)
    },
    getCopyLink(itemId) {
      return this.singleEdit
        ? {
          name: `${this.config.route}-id`,
          params: { id: itemId },
          query: { id: itemId, duplicate: 1 },
        }
        : ''
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
    viewShouldRender(item) {
      return (
        !this.hideView &&
        (!this.config.viewCondition ||
          item[this.config.viewCondition.key] ===
          this.config.viewCondition.value)
      )
    },
    editShouldRender(item) {
      return (
        this.allowEdit &&
        !this.hideEdit &&
        (!this.config.editRenderCondition ||
          item[this.config.editRenderCondition.key] ===
          this.config.editRenderCondition.value) &&
        (!this.config.editPropertyExists ||
          item[this.config.editPropertyExists]) &&
        (!this.config.editPropertyNotExists ||
          !item[this.config.editPropertyNotExists])
      )
    },
    deleteShouldRender(item) {
      return (
        this.allowDelete &&
        !this.hideDelete &&
        (!this.config.hasOwnProperty('deleteValidation') ||
          this.config.deleteValidation) &&
        (!this.config.deleteRenderCondition ||
          item[this.config.deleteRenderCondition.key] ===
          this.config.deleteRenderCondition.value) &&
        (!this.config.deletePropertyExists ||
          item[this.config.deletePropertyExists]) &&
        (!this.config.deletePropertyNotExists ||
          !item[this.config.deletePropertyNotExists])
      )
    },
    fetchItem(item) {
      this.$emit('itemFetched', item)
    },
    setEntityData(entityData) {
      this.fetchItem(entityData)
      this.editDialogOpen = true
    },
    handleAddClick() {

      this.$router.push(this.getCreateLink());

      if (!this.singleEdit || this.dialogCreate) {
        this.setEntityData(JSON.parse(JSON.stringify(this.blankEntity)))
      }
    },
    handleViewClick(entityData) {

      this.$router.push(this.getViewLink(entityData.id))

      if (this.storeTarget != '') {
        this.$store['selected' + this.storeTarget] = entityData
      }
    },
    handleEntityClick(entityData, duplicate = false) {
      if(duplicate){
        this.$router.push(this.getCopyLink(entityData.id))
      }
      else{
        this.$router.push(this.getEditLink(entityData.id))
      }

      if (!this.singleEdit) {
        if (duplicate) {
          delete entityData.id
        }
        this.setEntityData(entityData)
      }
    },
    handleDeleteClick() {
      const id = this.deleteModalId

      this.entityStore
        .deleteEntity(id)
        .then(() => {
          this.$emit('entityDeleted', id)
          this.refetchData()
        })
        .catch(() => {
          this.errorToast({
            title:
              'Η οντότητα δεν είναι δυνατό να διαγραφεί! Παρακαλώ διαγράψτε πρώτα τις εξαρτώμενες οντότητες.',
          })
        })
      this.closeDeleteModal()
    },
    async handleExtraActionClick(item, action) {
      try{
        if (action.endpoint) {
          await this.entityStore.extraAction(
            `${action.endpoint}/${item.id}`,
          )
          this.refetchData()
        }
        else if (action.callback) {
          if (typeof action.callback === 'function') {
            action.callback(item)
          } else {
            this[action.callback](item, action)
          }
        }
      } catch (error) {
        this.handleSaveError(error)
      }
    },
    async toggleEnableDisable(item) {
      this.disableActions = true
      await this.entityStore.toggleEnabled(item)
      this.refetchData()
    },
    getValueByPath(obj, path) {
      return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null
      }, obj)
    },
    handleUpdateJob(updatedJob){
      const i = this.entities.findIndex(job => job.id === updatedJob.id)
      this.entities[i] = updatedJob
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

<style lang="scss">
.list-item {
  position: relative;
  width: 100%;
  background: linear-gradient(
      to right,
      rgb(var(--v-theme-primary)) 50%,  /* Left half with overlay */
      transparent 50% /* Right half transparent */
  );
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
}

.profile-picture {
  border-radius: 50%;
  width: 150px;
  height: 150px;
}

</style>

<!-- eslint-disable vue/no-v-html -->
<template>
  <VContainer>
    <Dialog
      :open="deleteDialog"
      :width="700"
      :cancel-callback="closeDeleteModal"
      :success-callback="handleDeleteClick"
      title-bg="bg-danger"
      title="Επιβεβαίωση Διαγραφής"
      success-bg-color="white"
      success-title="Διαγραφή"
      success-icon="fa-trash-can"
      cancel-icon="xmark"
      hide-icon
      persistent
    >
      <div class="mt-10">
        <VAlert
          type="error"
          variant="outlined"
          prominent
        >
          <p class="font-20 mt-4">
            ΕΙΣΤΕ ΣΙΓΟΥΡΟΙ ΟΤΙ ΘΕΛΕΤΕ ΝΑ ΠΡΟΧΩΡΗΣΕΤΕ ΣΕ
            <strong>ΔΙΑΓΡΑΦH;</strong>
            <br />
            Μετά απο αυτήν την ενέργεια δεν θα είναι εφικτή η επαναφορά.
          </p>
        </VAlert>
      </div>
    </Dialog>
    <TableFilters
      v-if="filters.length"
      ref="filters"
      :filters-legend-title="filtersLegendTitle"
      :filters="filters"
      :hide-filters="hideFilters"
      :hide-filter-legend="hideFilterLegend"
      :auto-update-filters="autoUpdateFilters"
      @initFilters="initFilterValues"
      @filterUpdated="filterUpdated"
      @applyFilters="updateFilterValues"
    />
    <VContainer :class="[!hideLegend ? 'card-wrapper' : 'card-wrapper-nl', ...extraStyling.container]">
      <!-- 👉 Table Container Legend -->
      <legend v-if="!hideLegend" class="legend-title">
        {{ legendTitle }}
      </legend>
      <div class="card-body">
        <VCard :class="['elevation-0', ...extraStyling.cardBody]" >
          <!-- 👉 Table Container Buttons -->
          <VRow :class="!hideLegend? 'mb-0 pb-0': 'd-flex justify-center mb-0 pb-0'">
            <VCol cols="12" class="d-flex text-end justify-end">
              <!-- 👉 Extra Btn Slot -->
              <slot name="extraHeaderContent" />
              <!-- 👉 Add Btn -->
              <VBtn
                v-if="allowInsert && !hideInsertBtn"
                color="primary"
                variant="outlined"
                @click="handleAddClick"
              >
                {{config.title.createBtn ? $t(config.title.createBtn) : $t('Add New') + ' ' + $t(config.title.geniki)}}
                <template #append><FontAwesomeIcon :icon="'file-circle-plus'" class="ms-2 color-orange"/></template>
              </VBtn>
            </VCol>
          </VRow>
          <!-- 👉 Table Container Card -->
          <VRow class="mt-0 pt-0">
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
                @initFilters="initFilterValues"
                @filterUpdated="filterUpdated"
                @applyFilters="updateFilterValues"
              >
                <template #default="{ items }">
                  <slot :items="items"
                    :itemUpdated="itemUpdated"
                    :refetchData="refetchData"
                    :setEntityData="setEntityData"
                    :updateDeleteModalId="updateDeleteModalId"
                  />
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

              <VContainer v-if="(entities.length == 0)" class="d-flex text-center text-info card-wrapper bg-primary">
                  {{ $t('No data available')}}
              </VContainer>
            </VCol>
          </VRow>
        </VCard>
      </div>
    </VContainer>
  </VContainer>
</template>

<script>
import useGenericEntityStore from '@/stores/entity.js'
import { defineStore } from 'pinia'
import Dialog from '../Dialog.vue'
import ActionBtn from '../entity/ActionBtn.vue'

/**
 * The generic EntityList component for lists.
 * @displayName EntityList
 */
export default {
  components: {
    ActionBtn,
    Dialog,
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
    hideFilters: {
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
    extraStyling: {
      type: Object,
      default: {
        container: [''],
        cardBody: ['']
      }
    }
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
    const entityStore = defineStore(
      props.config.endpoint,
      useGenericEntityStore(props.config.endpoint),
    )()

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
      deleteDialog: false,
      deleteModalId: 0,
      filterVals: {},
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
    itemUpdated(updatedItem){
      const i = this.entities.findIndex(item => item.id === updatedItem.id)
      this.entities[i] = updatedItem
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

<style>
.post-list{
  background-color: #EEE!important;
}
</style>

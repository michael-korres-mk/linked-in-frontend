<template>
  <div>
    <TableFilters
      v-if="filters.length"
      ref="filters"
      :filters-legend-title="filtersTitle"
      :filters="filters"
      :initial-filter-values="initialFilterValues"
      @filterUpdated="filterUpdated"
      @applyFilters="updateFilterValues"
    />
    <Dialog
      :open="deleteDialog"
      :width="700"
      :cancel-callback="closeDeleteModal"
      :success-callback="handleDeleteClick"
      title-bg="bg-danger"
      title="Επιβεβαίωση Διαγραφής"
      success-color="red"
      cancel-color="red"
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

    <div :class="!hideLegend ? 'card-wrapper' : 'card-wrapper-nl'">
      <div v-if="!hideLegend">
        <legend class="legend-title">
          {{ legendTitle }}
        </legend>
      </div>
      <div class="card-body">
        <VCol
          cols="12"
          class="text-end"
        >
          <slot name="extra-button" />
          <!-- Table Container Card -->
          <VCard class="elevation-0">
          <!-- Table Container Card -->
          <VCardText class="mb-0">
            <VDataTable
              v-if="tableReady"
              ref="refEntitiesTable"
              v-model="selectedItems"
              :items-per-page="perPage"
              :items-length="totalRows"
              item-selectable="itemSelectable"
              :items="filteredEntities"
              :headers="tableColumns"
              :loading="loading"
              :sort-by="[sortBy]"
              :page="currentPage"
              :show-select="showSelect"
              :select-strategy="multiSelect ? 'all' : 'single'"
              class="table"
              return-object
              @update:sortBy="sortByChange"
              @update:options="fetchEntities"
            >
              <template #bottom>
                <VRow class="pt-4 pb-3">
                  <VCol class="pt-6 ps-10">
                    <label
                      v-if="totalRows"
                      class="font-15"
                    >{{
                      $t('ShowingEntries', {
                        from: (currentPage - 1) * perPage + 1,
                        to:
                          totalRows < perPage
                            ? totalRows
                            : currentPage * perPage,
                        entries: totalRows,
                      })
                    }}</label>
                  </VCol>
                  <VCol>
                    <VPagination
                      v-show="totalPages > 1"
                      v-model="currentPage"
                      :length="totalPages"
                      color="primary"
                      rounded="pill"
                      class="elevation-0 justify-end"
                      @input="pageChange"
                    />
                  </VCol>
                </VRow>
              </template>

              <template #item.selection="{ item }">
                <div>
                  <VCheckbox
                    v-model="customSelections[item.id]"
                    :id="`select-item-${item.id}`"
                    :label="`Select item ${item.id}`"
                    :aria-label="`Select item ${item.id}`"
                    v-bind="{
                      'aria-labelledby': item.id,
                      'aria-describedby': item.id,
                      'label': item.id,
                    }"
                    @update:modelValue="value => updateSelections(item, value)"
                  />
                </div>
              </template>

              <template
                v-for="field in formattedColumns"
                :key="field.key"
                #[`item.${field.key}`]="{ item }"
              >
                <div v-html="callFunc(field.callback, item[field.key])" />
              </template>
              <template #item.actions="{ item }">
                <div class="w-160px">
                  <div class="d-flex justify-center">
                    <!-- View btn -->
                    <RouterLink
                      v-if="viewShouldRender(item)"
                      :to="getViewLink(item.id)"
                      @click="handleViewClick(item)"
                    >
                      <ActionBtn
                        :icon="detailsViewIcon"
                        :label="detailsViewTitle"
                        color="primary"
                      />
                    </RouterLink>
                    <!-- Edit Btn -->
                    <RouterLink
                      v-if="editShouldRender(item)"
                      :to="getEditLink(item.id)"
                      @click="handleEntityClick(item)"
                    >
                      <ActionBtn
                        icon="fa-pencil"
                        label="Edit"
                        color="amber"
                      />
                    </RouterLink>
                    <template v-for="extraAction in extraActions">
                      <ActionBtn
                        v-if="extraActionShouldRender(extraAction, item)"
                        :key="extraAction.icon"
                        :icon="extraAction.icon"
                        :label="extraAction.title"
                        :color="extraAction.color ?? 'primary'"
                        @click="handleExtraActionClick(item, extraAction)"
                      />
                    </template>
                    <!-- Delete Btn -->
                    <ActionBtn
                      v-if="deleteShouldRender(item)"
                      :label="'Delete'"
                      icon="fa-trash"
                      color="danger"
                      @click="updateDeleteModalId(item.id)"
                    />
                  </div>
                </div>
              </template>
            </VDataTable>
          </VCardText>
        </VCard>
        </VCol>
        <div class="mt-6">
          <!-- Table Top -->
          <VRow align="center">
            <!-- Per Page -->
            <VCol cols="3">
              <VRow align="center">
                <VCol
                  align="right"
                  md="5"
                >
                  <label for="SelectPages" class="font-15">{{ $t('Entries') }}</label>
                </VCol>
                <VCol>
                  <VSelect
                    v-model="perPage"
                    :items="perPageOptions"
                    :id.attr="`SelectPages`"
                    density="compact"
                    variant="outlined"
                    class="per-page-selector d-inline-block"
                    hide-details
                    v-bind="{
                      'aria-labelledby': 'SelectPages',
                      'aria-describedby': 'SelectPages',
                      'label': $t('-- Choose --')
                    }"
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol
              md="4"
              class="ms-auto pe-8"
            >
              <VBtn
                v-if="!hideInsertBtn"
                :to="singleEdit ? getCreateLink() : ''"
                :size="smallTable ? 'regular' : 'large'"
                color="primary"
                class="w-100 with-icon-right"
                @click="handleAddClick"
              >
                <span class="text-nowrap">{{ config.title.single }}</span>
                <FontAwesomeIcon
                  v-if="config.title.icon"
                  :icon="config.title.icon"
                  class="btn-icon btn-icon-right round-icon"
                />
              </VBtn>
            </VCol>
          </VRow>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useGenericEntityStore from '@/stores/entity.js'
import { defineStore } from 'pinia'
import Dialog from '../Dialog.vue'
import ActionBtn from './ActionBtn.vue'
import TableFilters from './TableFilters.vue'
import ADialog from "@/components/Dialog.vue";

/**
 * The generic DataTable component for lists.
 * @displayName DataTable
 */
export default {
  components: {
    ADialog,
    ActionBtn,
    Dialog,
    TableFilters
  },
  props: {
    filtersLegendTitle: {
      type: String,
      required: false,
    },
    filters: {
      type: Array,
      default: () => [],
    },

    /**
     * Define if we have checkbox for the table rows.
     * @values Boolean.
     */
    showSelect: {
      type: Boolean,
      default: false,
    },

    /**
     * Configuration of the DataTable.
     * @values Object.
     */
    config: {
      type: Object,
      required: true,
    },

    /**
     * Headers of the table.
     * @values Array.
     */
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
          {
            key: 'actions',
            title: 'actions',
            sortable: false,
          },
        ]
      },
    },
    singleEdit: {
      type: Boolean,
      default: true,
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
    detailsView: {
      type: Boolean,
      default: false,
    },
    detailsViewIcon: {
      type: String,
      default: 'fa-eye',
    },
    detailsViewTitle: {
      type: String,
      default: 'Details',
    },
    hasInsertBtn: {
      type: Boolean,
      default: true,
    },
    legendTitle: {
      type: String,
      default: 'Αποτελέσματα',
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
    extraActions: {
      type: Array,
      default: null,
    },
    storeTarget: {
      type: String,
      default: '',
    },
    smallTable: {
      type: Boolean,
      default: false,
    },
    selections: {
      type: Array,
      default: () => [],
    },
    isSelectable: {
      type: Function,
      default: () => true,
    },
    hideTableActions: {
      type: Boolean,
      default: false,
    },

    // deleteLabel: {
    //   type: Object,
    //   default: () => ({
    //     title: 'DeleteModalTitle',
    //     desc: 'DeleteModalDesc',
    //     button: 'DeleteModalButton',
    //   }),
    // },
    dynamicColumns: {
      type: Boolean,
      default: false,
    },
    multiSelect: {
      type: Boolean,
      default: false,
    },
    hideLegend: {
      type: Boolean,
      default: false,
    },
    hideInsertBtn: {
      type: Boolean,
      default: false,
    },
    initialFilterValues: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: [
    'entitiesFetched',
    'itemSelected',
    'itemFetched',
    'entityDeleted',
    'filterUpdated',
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
      isDisabled: false,
      dialog: false,
      isEntityHandlerSidebarActive: false,
      isEntityDuplicate: false,
      entity: { id: null },
      perPage: 10,
      totalRows: 0,
      currentPage: 1,
      totalPages: 0,
      perPageOptions: [10, 25, 50, 100, 200, 500],
      searchQuery: '',
      sortBy: { key: 'id', order: 'desc' },
      entities: [],
      removedItems: [],
      tableReady: false,
      loading: 'primary',
      disableActions: false,
      deleteDialog: false,
      infoWindowPos: null,
      infoWinOpen: false,
      currentMidx: null,
      filterVals: {},
      deleteModalId: 0,
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
    tableColumns() {
      if (!this.dynamicColumns) {
        let columns = [...this.columns]

        if (!this.hideTableActions) {
          columns.push({
            key: 'actions',
            title: this.$t('actions'),
            sortable: false,
          })
        }

        return columns
      } else {
        if (this.filteredEntities.length > 0) {
          const entityKeys = Object.keys(this.filteredEntities[0])

          const dynamicColumns = entityKeys.map(key => ({
            title: this.$t(key),
            value: key,
            sortable: true,
          }))

          if (!this.hideTableActions) {
            dynamicColumns.push({
              text: this.$t('actions'),
              value: 'actions',
              sortable: false,
              align: 'end',
            })
          }

          return dynamicColumns
        } else {
          return []
        }
      }
    },

    filteredEntities() {
      if (this.isSelectable) {
        return this.entities.map(entity => {
          entity.itemSelectable = this.isSelectable(entity)
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
    filtersTitle() {
      return this.filtersLegendTitle || `Αναζήτηση ${this.$t(this.config.title.geniki)}`
    },
  },
  mounted() {
    this.fetchEntities()
    this.perPage = this.resultsPerPage
    this.tableReady = true
  },
  methods: {
    updateSelections(item, val) {
      if (val) {
        this.selectedItems.push(item)
      } else {
        this.selectedItems.splice(
          this.selectedItems.findIndex(entity => entity.id === item.id),
          1,
        )
      }
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
      const queryParams = {
        searchquery: this.searchQuery || null,
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
    },
    sortByChange(sortArr) {
      if (sortArr.length) {
        this.sortBy = sortArr[0]
      }
    },

    fetchEntities() {
      return this.getEntities(this.getQueryParams())
    },
    fetchAllEntities() {
      return this.getEntities({
        ...this.getQueryParams(),
        size: null,
      })
    },
    getEntities(params) {
      return this.entityStore
        .getEntities(params)
        .then(response => {
          const items = response

          this.totalRows = response.length
          this.totalPages =Math.floor(
            response.length / this.perPage +
            (response.length % this.perPage > 0 ? 1 : 0))
          this.entities = items || []
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

        return obj
      }

      return ''
    },
    getViewLink(itemId) {
      return this.getItemLink(itemId)
    },
    getCreateLink() {
      if (this.config.insertRoute) {
        return this.config.insertRoute
      }

      return { name: `${this.config.route}-edit` }
    },
    getEditLink(itemId) {
      return this.singleEdit
        ? { name: `${this.config.route}-edit`, params: { id: itemId } }
        : '#'
    },
    getExtraActionLink(extraAction, itemId) {
      return extraAction.href
        ? { name: extraAction.href, params: { id: itemId } }
        : null
    },
    getCopyLink(itemId) {
      return this.singleEdit
        ? { name: `${this.config.route}-edit`, query: { duplicate: itemId } }
        : '#'
    },
    fetchItem(item) {
      this.$emit('itemFetched', item)
    },
    extraActionShouldRender(action, item) {

      if (typeof action.renderCondition === 'function') {
        return action.renderCondition(item)
      }

      // If no authority validation is given or the validation passes continue
      return (
        // eslint-disable-next-line no-prototype-builtins
        (!action.hasOwnProperty('authorityValidation') ||
          action.authorityValidation) &&

        // If no render condition is given or the key matches the desired value continue
        (!action.renderCondition || item[action.renderCondition.key] === action.renderCondition.value) &&
        (!action.propertyExists || item[action.propertyExists.key]) &&
        (!action.propertyNotExists || !item[action.propertyNotExists.key])
      )
    },
    viewShouldRender(item) {
      return (
        this.detailsView &&
        (!this.config.viewCondition ||
          item[this.config.viewCondition.key] ===
            this.config.viewCondition.value)
      )
    },
    editShouldRender(item) {
      return (
        !this.hideEdit &&
        (!this.config.editCondition ||
          item[this.config.editCondition.key] ===
            this.config.editCondition.value)
      )
    },
    deleteShouldRender(item) {
      return (
        !this.hideDelete &&
        (!this.config.deleteCondition ||
          item[this.config.deleteCondition.key] ===
            this.config.deleteCondition.value)
      )
    },
    filterUpdated(fieldId, newVal) {
      this.$emit('filterUpdated', fieldId, newVal)
    },
    updateFilterValues(selFilters) {
      this.filterVals = selFilters
      this.filterUpdated()
      this.refetchData()
    },
    closeModal(refetch) {
      this.isEntityHandlerSidebarActive = false
      if (refetch) {
        this.refetchData()
      }
    },
    handleEntitySave() {
      this.isEntityHandlerSidebarActive = false
      this.refetchData()
      this.$store.clearCache()
    },
    setEntityData(entityData) {
      this.entity = entityData
      this.fetchItem(this.entity)
      this.isEntityHandlerSidebarActive = true
    },
    handleAddClick() {
      if (!this.singleEdit) {
        this.setEntityData({})
      }
    },
    handleViewClick(entityData) {
      if (this.storeTarget != '') {
        this.$store['selected' + this.storeTarget] = entityData
      }
    },
    handleEntityClick(entityData) {
      if (!this.singleEdit) {
        this.isEntityDuplicate = false
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
      if (action.endpoint) {
        await this.entityStore.extraAction(`${action.endpoint}/${item.id}`)
      } else if (action.callback) {
        if (typeof action.callback === 'function') {
          action.callback(item)
        } else {
          this[action.callback](item, action)
        }
      }
    },
  },
}
</script>


<style scoped>


label:empty{
  display: none!important;
}

.v-field--center-affix .v-label.v-field-label {
  top: 50%;
  transform: translateY(0%);
  display: none!important;
}

.v-label v-label--clickable{
  display: none!important;
}
</style>

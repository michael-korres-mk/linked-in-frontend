<!-- eslint-disable vue/no-v-html -->
<template>
  <VContainer fluid>
    <ADialog
      v-if="tableReady"
      :open="editDialogOpen"
      :title="dialogTitle"
      :cancel-callback="
        () => ((editDialogOpen = false), $emit('editModeSet', false))
      "
      hide-actions
    >
      <slot name="editmodal" />
    </ADialog>
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
    <ADialog
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
    </ADialog>

    <div :class="!hideLegend ? 'card-wrapper' : 'card-wrapper-nl'">
      <!-- 👉 Table Container Legend -->
      <legend v-if="!hideLegend" class="legend-title">
        {{ legendTitle }}
      </legend>
      <div class="card-body">
        <VCard class="elevation-0">
          <!-- 👉 Table Container Buttons -->
          <VRow :class="!hideLegend? 'mb-0 pb-0': 'd-flex justify-center mb-0 pb-0'">
            <VCol
              cols="12"
              class="d-flex text-end justify-end"
            >
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
              <VDataTableServer
                v-if="tableReady"
                ref="refEntitiesTable"
                v-model="selectedItems"
                :items-per-page="perPage"
                :items-length="totalRows"
                :items="filteredEntities"
                :headers="tableColumns"
                :loading="loading"
                :sort-by="[sortBy]"
                :page="currentPage"
                :show-select="showSelect"
                :select-strategy="multiSelect ? 'page' : 'single'"
                item-selectable="selectable"
                return-object
                dense
                @update:sortBy="sortByChange"
                @update:options="fetchEntities"
              >
                <template #item.selection="{ item }">
                  <VCheckboxBtn
                    v-model="customSelections[item.id]"
                    @update:modelValue="value => updateSelections(item, value)"
                  />
                </template>
                <!-- Column: name -->
                <template #item.title="{ item }">
                  <div
                    v-if="!hideEdit"
                    class="font-weight-bold d-block"
                    @click="handleEntityClick(item)"
                  >
                    {{ item.title }}
                  </div>
                  <span v-else>
                    {{ item.title }}
                  </span>
                </template>
                <template
                  v-for="field in formattedColumns"
                  :key="field.key"
                  #[`item.${field.key}`]="{ item }"
                >
                  <div v-html="callFunc(field.callback, getValueByPath(item, field.key))"/>
                </template>
                <template #item.actions="{ item }">
                  <div class="w-130px">
                    <div class="d-flex justify-end">
                      <!-- 👉 View btn -->
                      <ActionBtn
                        v-if="viewShouldRender(item)"
                        :icon="detailsViewIcon"
                        :label="detailsViewTitle"
                        @click="handleViewClick(item)"
                      />

                      <!-- 👉 Edit Btn -->
                      <ActionBtn
                        v-if="editShouldRender(item)"
                        :icon="config.edit?.icon || 'fa-edit'"
                        :label="config.edit?.label || 'Edit'"
                        :color="config.edit?.color || 'warning'"
                        @click="handleEntityClick(item)"
                      />

                      <!-- 👉 Toggle enabled Btn -->
                      <ActionBtn
                        v-if="!hideEnabled && editShouldRender(item)"
                        :icon="item.enabled ? 'fa-toggle-on' : 'fa-toggle-off'"
                        variant="text"
                        :label="item.enabled ? 'Disable' : 'Enable'"
                        :disabled="disableActions"
                        @click="toggleEnableDisable(item)"
                      />

                      <!-- 👉 Delete Btn -->
                      <ActionBtn
                        v-if="deleteShouldRender(item)"
                        icon="trash-can"
                        label="Delete"
                        color="error"
                        class="text-black"
                        @click="updateDeleteModalId(item.id)"
                      />

                      <!-- 👉 Duplicate Btn -->
                      <ActionBtn
                        v-if="allowDuplicate && editShouldRender(item)"
                        icon="fa-copy"
                        label="Duplicate"
                        color="purple"
                        @click="handleEntityClick(item, true)"
                      />

                      <!-- 👉 ExtraAction Btn -->
                      <template v-for="extraAction in extraActions">
                        <ActionBtn
                          v-if="extraActionShouldRender(extraAction, item)"
                          :key="extraAction.icon"
                          :color="extraAction.color ?? 'primary'"
                          :icon="(extraAction.dynamicIcon && item[extraAction.iconProp]) ? extraAction.dynamicIcon : extraAction.icon"
                          :label="extraAction.title"
                          :href="extraAction.href ? (extraAction.path || '') + getValueByPath(item, extraAction.href) + (extraAction.extraparam ? '_' + getValueByPath(item, extraAction.extraparam) : '') + (extraAction.suffix || '') : null"
                          @click="handleExtraActionClick(item, extraAction)"
                        />
                      </template>
                    </div>
                  </div>
                </template>
                <!-- 👉 Pagination Setup -->
                <template #bottom>
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
              </VDataTableServer>
            </VCol>
          </VRow>
        </VCard>
      </div>
    </div>
  </VContainer>
</template>

<script>
import useGenericEntityStore from '@/stores/entity'
import { defineStore } from 'pinia'
import ADialog from '../Dialog.vue'
import ActionBtn from './ActionBtn.vue'
import TableFilters from './TableFilters.vue'

/**
 * The generic EntityList component for lists.
 * @displayName EntityList
 */
export default {
  components: {
    ActionBtn,
    TableFilters,
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
  emits: [
    'entitiesFetched',
    'itemSelected',
    'itemFetched',
    'entityDeleted',
    'filterUpdated',
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
      disableActions: false,
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

    tableColumns() {
      const cols = this.columns.map(field => ({
        ...field,
        title: this.$t(field.title),
        align: 'center',
      }))
   
      if (!this.hideTableActions) {
        cols.push({
          key: 'actions',
          title: this.$t('actions'),
          sortable: false,
        })
      }

      return cols
    },
    customSelections() {
      const selObj = {}

      this.selectedItems.forEach(item => {
        selObj[item.id] = true
      })

      return selObj
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
    filtersTitle() {
      return this.filtersLegendTitle || this.$t('Search') + ' ' + this.$t(this.config.title.geniki)
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
    },
    sortByChange(sortArr) {
      this.sortBy = sortArr.length ? sortArr[0] : { key: this.sortBy.key, order: this.sortBy.order == 'asc' ? 'desc' : 'asc' }
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
    clearFilter(filter) {
      this.$refs.filters.filterVals[filter] = null
    },
    closeModal(refetch) {
      this.editDialogOpen = false
      this.isEntityDuplicate = false
      if (refetch) {
        this.refetchData()
      }
    },
    fetchItem(item) {
      this.$emit('itemFetched', item)
    },
    fetchExtraItem(item) {
      this.$emit('extraItemFetched', item)
    },
    handleEntitySave() {
      this.editDialogOpen = false
      this.refetchData()
      this.$store.clearCache()
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
  },
}
</script>

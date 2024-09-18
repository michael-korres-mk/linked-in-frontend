<template>
  <VDataTable
    :headers="columns"
    :items="items"
    items-per-page="-1"
    class="elevation-0"
  >
    <template #top>
      <VDialog
        v-model="dialog"
        :max-width="maxWidth"
        persistent
      >
        <template #activator="{ props }">
          <VRow class="d-flex flex-row-reverse my-3">
            <div class="grid grid-cols-2 gap-6 justify-items-end">
              <div>
                <!--
                  <VBtn
                  color="primary"
                  variant="outlined"
                  >
                  Προσθήκη
                  <template #append>
                  <FontAwesomeIcon
                  :icon="['fas', 'file-circle-plus']"
                  class="ms-2 color-orange"
                  /> 
                  </template>
                  </VBtn> 
                -->
                <VBtn
                  v-if="allowEdit && !hideAddButton"
                  v-bind="props"
                  class="btn-eett-blue-outline px-5 mb-0 mx-3"
                  color="primary"
                  variant="outlined"
                  rounded="md"
                  type="button"
                >
                  {{ btnTitle }}
                  <FontAwesomeIcon
                    :icon="['fas', 'circle-plus']"
                    class="ms-5 color-orange"
                  />
                </VBtn>
              </div>
            </div>
          </VRow>
        </template>

        <VCard>
          <VCardTitle class="dialog-header">
            <span class="dialog-title">{{ formTitle }}</span>
          </VCardTitle>
          <VCardText>
            <div class="card-wrapper pb-10 my-5">
              <legend class="legend-title text-center">
                {{ modalLegendTitle }}
              </legend>
              <div class="card-body p-5 m-5">
                <VForm
                  ref="form"
                  v-model="valid"
                  autocomplete="off"
                >
                  <EntityEditSection
                    :entity="editedItem"
                    :form-fields="formFields"
                    @fieldUpdated="updateItem"
                  />
                </VForm>
              </div>
            </div>
          </VCardText>
          <VCardActions>
            <VRow>
              <VCol
                cols="12"
                class="text-center"
              >
                <VBtn
                  class="px-5"
                  color="secondary"
                  variant="flat"
                  rounded="md"
                  size="large"
                  @click="close"
                >
                  <FontAwesomeIcon
                    icon="close"
                    class="font-size-20 me-5"
                  />
                  {{ $t('Cancel') }}
                </VBtn>

                <VBtn
                  :disabled="!valid"
                  class=" px-5"
                  color="primary"
                  variant="flat"
                  rounded="md"
                  size="large"
                  @click="save"
                >
                  <FontAwesomeIcon
                    icon="save"
                    class="font-size-20 me-5"
                  />
                  {{ $t('Add') }}
                </VBtn>
              </VCol>
            </VRow>
          </VCardActions>
        </VCard>
      </VDialog>
    </template>
    <template
      v-for="field in formattedColumns"
      :key="field.key"
      #[`item.${field.key}`]="{ item }"
    >
      <div
        @click="field.handleClick(item[field.key])"
        v-html="callFunc(field.callback, item[field.key])"
      />
    </template>
    <template #item.actions="{ item }">
      <div>
        <ActionBtn
          v-if="allowEdit && !hideEditButton"
          :icon="editIcon? editIcon : 'fa-edit'"
          color="orange"
          variant="text"
          label="Edit"
          @click="editItem(item)"
        />
        <ActionBtn
          v-if="allowEdit && !hideDeleteButton"
          icon="xmark"
          label="Delete"
          color="error"
          @click="deleteItem(item)"
        />
      </div>
    </template>
    <template #bottom />
  </VDataTable>
</template>

<script>
import entityMixins from '../../mixins/entityedit'
import ActionBtn from './ActionBtn.vue'
import EntityEditSection from './EntityEditSection.vue'

export default {
  components: {
    ActionBtn,
    EntityEditSection,
  },
  mixins: [entityMixins],
  props: {
    formFields: {
      type: Array,
      required: true,
    },
    extraColumns: {
      type: Array,
      default: () => [],
    },
    initItems: {
      type: Array,
      default: () => [],
    },
    defaultItem: {
      type: Object,
      default: () => {},
    },
    formattedColumns: {
      type: Array,
      default: null,
    },
    hiddenColumns: {
      type: Array,
      default: () => [],
    },
    btnTitle: {
      type: String,
      default: 'Προσθήκη',
    },
    modalLegendTitle: {
      type: String,
      default: 'Στοιχεία',
    },
    allowEdit: {
      type: Boolean,
      default: false,
    },
    hideEditButton: {
      type: Boolean,
      default: false,
    },
    dataTransformation: {
      type: Function,
      default: entity => entity,
    },
    editTransformation: {
      type: Function,
      default: entity => entity,
    },
    maxWidth: {
      type: String,
      default: '800px',
    },
    hideDeleteButton: {
      type: Boolean,
      default: false,
    },
    hideAddButton: {
      type: Boolean,
      default: false,
    },
    editIcon: {
      type: String,
      default: '',
    },
  },
  emits: ['itemFieldUpdated', 'closeDialog', 'editedItemFetched'],
  data() {
    return {
      valid: false,
      dialog: false,
      items: [],
      editedIndex: -1,
      editedItem: {},
    }
  },
  computed: {
    columns() {
      return [
        ...this.formFields
          .filter(
            field =>
              this.hiddenColumns && !this.hiddenColumns.includes(field.id),
          )
          .map(field => ({
            key:
              field.type == 'select' && field.object
                ? `${field.id}.title`
                : field.id,
            title: field.label,
            align: field.align,
          })),
        ...this.extraColumns,
        ...[{ key: 'actions', label: this.$t('actions'), sortable: false }],
      ]
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Προσθήκη' : 'Επεξεργασία'
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  created() {
    this.items = this.initItems
    this.setDefaultItem()
  },
  methods: {
    setDefaultItem() {
      this.editedItem = this.editTransformation(
        JSON.parse(JSON.stringify(this.defaultItem ?? {})),
      )
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = this.editTransformation(
        JSON.parse(JSON.stringify(item ?? {})),
      )
      this.dialog = true
      this.$emit('editedItemFetched', this.editedItem)
    },
    deleteItem(item) {
      this.items.splice(this.items.indexOf(item), 1)
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.setDefaultItem()
        this.editedIndex = -1
        this.$emit('closeDialog')
      })
    },
    updateItem(fieldObj) {
      if (fieldObj.parent) {
        this.editedItem[fieldObj.parent][fieldObj.id] = fieldObj.value
      } else {
        this.editedItem[fieldObj.id] = fieldObj.value
      }
      this.$emit('itemFieldUpdated', fieldObj)
    },
    async save() {
      const item = this.dataTransformation(
        JSON.parse(JSON.stringify(this.editedItem)),
      )

      if (this.editedIndex > -1) {
        this.items[this.editedIndex] = item
      } else {
        this.items.push(item)
      }
      this.close()
    },
  },
}
</script>

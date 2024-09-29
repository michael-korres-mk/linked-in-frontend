<template>
  <VContainer
    fluid
    class="mt-4"
  >
    <h1
      v-if="!hideTitle"
      class="text-orange text-center mb-4"
    >
      {{ entityTitle(entity, config.title.geniki, viewMode, editMode) }}
    </h1>
    <EntityEdit
      :config="config"
      :entity="entity"
      :entity-id="entityId"
      :data-transformation="dataTransformation"
      :edit-transformation="editTransformation"
      :edit-mode="editMode"
      :hide-cancel-button="hideCancelButton"
      :single-edit="singleEdit"
      :return-to-list="returnToList"
      :authority="authority"
      :can-edit="canEdit"
      :extra-actions="extraActions"
      @entityFetched="entityFetched"
      @entitySaved="entitySaved"
      @entitySavedError="entitySavedError"
      @editModeSet="editModeSet"
      @entitySubmitted="entitySubmitted"
    >
      <slot name="header" />
      <EntityEditSection
        v-if="loaded && formFields.length"
        :entity="entity"
        :form-fields="formFields"
        :disabled="!editMode"
        @fieldUpdated="updateEntityProp"
        @detailsBtnClicked="detailsBtnClicked"
      />
      <div v-else-if="sections.length">
        <div
          v-for="section in sections"
          :key="section.title"
          :class="(section.hidden ? 'd-none' : 'card-wrapper mb-10')"
        >
          <!-- Element <legend> needs to be wrapped by a <fieldset> element -->
          <legend class="legend-title">
            {{ section.title }}
          </legend>
          <div class="card-body mb-5">
            <EntityEditSection
              v-if="loaded"
              :entity="entity"
              :disabled="!editMode"
              :form-fields="section.fields"
              @fieldUpdated="updateEntityProp"
              @detailsBtnClicked="detailsBtnClicked"
            />
            <slot name="inline" />
          </div>
        </div>
        <div v-if="secondaryTables.length">
          <VExpansionPanels
            v-if="accordion"
            variant="accordion"
          >
            <VExpansionPanel
              v-for="table in secondaryTables"
              :key="table.title"
              :title="table.title"
            >
              <VExpansionPanelText v-if="!table.hidden">
                <SecondaryTable
                  v-if="loaded"
                  :init-items="entity[table.property]"
                  :form-fields="table.fields"
                  :extra-columns="table.extraColumns"
                  :formatted-columns="table.formattedColumns"
                  :hidden-columns="table.hiddenColumns"
                  :default-item="table.defaultItem"
                  :hide-delete-button="table.hideDeleteButton"
                  :hide-add-button="table.hideAddButton"
                  :allow-edit="editMode"
                  @fieldUpdated="updateEntityProp"
                />
              </VExpansionPanelText>
            </VExpansionPanel>
            <slot name="extraAccordionContent" />
          </VExpansionPanels>
          <div v-else>
            <div
              v-for="table in secondaryTables"
              :key="table.title"
            >
              <div
                :class="'card-wrapper'"
                v-if="!table.hidden"
              >

                <legend class="legend-title text-center">
                  {{ table.title }}
                </legend>
                <div class="card-body">
                  <SecondaryTable
                    v-if="loaded"
                    :init-items="entity[table.property]"
                    :form-fields="table.fields"
                    :extra-columns="table.extraColumns"
                    :formatted-columns="table.formattedColumns"
                    :hidden-columns="table.hiddenColumns"
                    :default-item="table.defaultItem"
                    :hide-edit-button="table.hideEditButton"
                    :hide-delete-button="table.hideDeleteButton"
                    :hide-add-button="table.hideAddButton"
                    :allow-edit="editMode"
                    @fieldUpdated="updateEntityProp"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <slot />
    </EntityEdit>
  </VContainer>
</template>

<script>
import entityMixins from '../../mixins/entityedit'
import EntityEdit from './EntityEdit.vue'
import EntityEditSection from './EntityEditSection.vue'
import SecondaryTable from './SecondaryTable.vue'

export default {
  components: {
    EntityEdit,
    EntityEditSection,
    SecondaryTable,
  },
  mixins: [entityMixins],
  props: {
    entity: {
      type: Object,
      required: true,
    },
    entityId: {
      type: Number,
      default: null,
    },
    config: {
      type: Object,
      required: true,
    },
    formFields: {
      type: Array,
      default: () => [],
    },
    sections: {
      type: Array,
      default: () => [],
    },
    secondaryTables: {
      type: Array,
      default: () => [],
    },
    extraSections: {
      type: Array,
      default: () => [],
    },
    dataTransformation: {
      type: Function,
      default: entity => entity,
    },
    editTransformation: {
      type: Function,
      default: entity => entity,
    },
    extraActions: {
      type: Array,
      default: null,
    },
    hideTitle: {
      type: Boolean,
      default: false,
    },
    hideCancelButton: {
      type: Boolean,
      default: false,
    },
    singleEdit: {
      type: Boolean,
      default: true,
    },
    returnToList: {
      type: Boolean,
      default: true,
    },
    accordion: {
      type: Boolean,
      default: false,
    },
    authority: {
      type: String,
      default: '',
    },
    canEdit: {
      type: Boolean,
      default: true // generally should be all closed
    }
  },
  emits: ['entityFetched', 'entitySaved', 'editModeSet', 'detailsBtnClicked', 'entitySubmitted', 'entitySavedError'],
  // computed: {
  //   canEdit() {
  //     return (this.entity?.creator?.id == this.user.id) || (this.id == '0')
  //     //  return !this.authority.length || this.$store.userRights.includes(`${this.authority}_edit`)
  //   },
  // },
  mounted() {
    this.editModeSet(this.editMode)
  },
  methods: {
    detailsBtnClicked(fieldId) {
      this.$emit('detailsBtnClicked', fieldId)
    },
    entitySubmitted() {
      this.$emit('entitySubmitted')
    },
    entitySavedError(error) {
      this.$emit('entitySavedError', error)
    },
  },
}
</script>

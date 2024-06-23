<script setup>
import EntityList from '../../components/entity/EntityList.vue'
import FormField from '../../components/entity/FormField.vue'

definePage({
  meta: {
    authority: 'users',
  },
})
</script>

<template>
  <VContainer
    fluid
    class="rounded-lg"
  >
    <h1 class="text-center text-info">
      Διαχείριση Ρόλων
    </h1>
    <div class="card-wrapper mt-5">
      <legend class="legend-title">
        Επιλογή Υποσυστήματος
      </legend>
      <div class="card-body m-0 p-0">
        <FormField
          :entity="subEntity"
          :form-field="searchField"
          class="ps-4 pe-1 py-3"
          @fieldUpdated="setSubsystem"
        />
      </div>
    </div>
    <VRow v-if="subEntity.subsystem">
      <VCol
        cols="6"
        class=" mt-5"
      >
        <EntityList
          ref="list"
          :config="config"
          :columns="columns"
          :formatted-columns="formattedColumns"
          :form-fields="formFields"
          :results-per-page="8"
          :single-edit="false"
          :hide-enabled="false"
          :legend-title="$t('Roles')"
          :extra-actions="extraActions"
          :selections="selections"
          :custom-query="{ subsystem: subEntity.subsystem }"
          authority="users"
          show-select
          hide-view
          hide-edit
          @itemFetched="itemFetched"
          @itemSelected="handleSelectedChange"
        >
          <template #editmodal>
            <EntitySingle
              :entity="entity"
              :single-edit="false"
              :config="config"
              :sections="sections"
              authority="users"
              hide-title
              @entitySaved="closeModal"
              @editModeSet="closeModalIfEditModeIsFalse"
            />
          </template>
        </EntityList>
      </VCol>

      <VCol cols="6">
        <div class="card-wrapper mt-5">
          <legend class="legend-title">
            Δικαιώματα ανά Ρόλο
          </legend>
          <div class="card-body m-0 p-0">
            <div v-if="!selectedEntity">
              <h3 class="font-weight-bold text-center my-5">
                Παρακαλώ επιλέξτε Ρόλο απο την λίστα για να εμφανίσετε τα
                αντίστοιχα Δικαιώματα
              </h3>
            </div>
            <div
              v-else
              class="px-3"
            >
              <VAlert
                color="secondary"
                class="text-center text-white my-3"
                variant="flat"
              >
                <span class="text-center font-size-20">{{
                  selectedEntity.title
                }}</span>
              </VAlert>
              <div class="text-center py-4">
                <VBtn
                  class="ms-2"
                  size="small"
                  variant="flat"
                  rounded="pill"
                  :color="areAllPanelsExpanded ? 'orange' : 'primary'"
                  @click="togglePanelsState"
                >
                  {{ areAllPanelsExpanded ? $t('Collapse') : $t('Expand') }}
                  <FontAwesomeIcon
                    :icon="
                      areAllPanelsExpanded
                        ? ['fas', 'chevron-up']
                        : ['fas', 'chevron-down']
                    "
                    class="ms-3"
                  />
                </VBtn>
              </div>
              <EntityEdit
                :config="config"
                :entity="selectedEntity"
                hide-cancel-button
                :data-transformation="dataTransformation"
              >
                <VContainer
                  fluid
                  class="mt-0"
                >
                  <VExpansionPanels
                    v-model="panels"
                    multiple
                  >
                    <VExpansionPanel
                      v-for="group in allRights"
                      :key="group.code"
                      :title="group.title"
                    >
                      <VExpansionPanelText>
                        <VContainer fluid>
                          <VCheckbox
                            v-for="right in group.rights"
                            :key="right.id"
                            v-model="roleRightsIds"
                            :label="right.title"
                            :value="right.id"
                            hide-details
                          />
                        </VContainer>
                      </VExpansionPanelText>
                    </VExpansionPanel>
                  </VExpansionPanels>
                </VContainer>
              </EntityEdit>
            </div>
          </div>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
export default {
  data() {
    return {
      entity: {},
      subEntity: {},
      selectedEntity: null,
      selections: [],
      allRights: [],
      subsystemOptions: [{ id: 1, title: "hello" }],
      roleRightsIds: [],
      panels: [],
    }
  },
  computed: {
    config() {
      return {
        endpoint: 'roles',
        route: 'roles',
        title: {
          single: 'Role',
          plural: 'Roles',
          geniki: 'Role(gen)',
        },
        deleteRenderCondition: {
          key: 'locked',
          value: false,
        },
      }
    },
    columns() {
      return [
        {
          key: 'title',
          title: 'title',
        },
        { key: 'enabled', title: 'Status' },
      ]
    },
    formattedColumns() {
      return [{ key: 'enabled', callback: 'booleanTitle' }]
    },
    formFields() {
      return [
        {
          id: 'title',
          type: 'text',
          label: this.$t('title'),
          required: true,
        },
        {
          id: 'enabled',
          type: 'checkbox',
          label: this.$t('Status'),
          optionLabel: this.$t('enabled'),
        },
      ]
    },
    sections() {
      return [
        {
          fields: this.formFields,
          title: 'Στοιχεία Ρόλου',
        },
      ]
    },
    extraActions() {
      return [
        {
          icon: 'lock',
          title: 'locked',
          renderCondition: {
            key: 'locked',
            value: true,
          },
        },
      ]
    },
    areAllPanelsExpanded() {
      return this.panels.length === this.allRights.length
    },
    searchField() {
      return {
        id: 'subsystem',
        type: 'select',
        label: 'Υποσύστημα',
        options: this.subsystemOptions,
      }
    },
  },
  async mounted() {
    this.subsystemOptions = await this.$store.subsystems()
  },
  methods: {
    closeModalIfEditModeIsFalse(value) {
      if (!value) {
        this.closeModal()
      }
    },
    itemFetched(item) {
      this.entity = item
    },
    closeModal() {
      
      this.$refs.list.closeModal(true)
    },
    handleSelectedChange(selectedItems) {
      this.selections = selectedItems
      if (selectedItems.length) {
        this.selectedEntity = selectedItems[0]
        this.roleRightsIds = this.selectedEntity.rights.map(right => right.id)
      } else {
        this.selectedEntity = null
        this.roleRightsIds = []
      }
    },
    dataTransformation(entity) {
      entity.rights = []
      this.roleRightsIds.forEach(id => {
        entity.rights.push({ id: id })
      })

      return entity
    },
    togglePanelsState() {
      if (this.panels.length === this.allRights.length) {
        this.panels = []
      } else {
        this.panels = this.allRights.map((_, index) => index)
      }
    },
    async setSubsystem(selection) {
      this.subEntity.subsystem = selection.value
      this.allRights = await this.$store.rights(this.subEntity.subsystem)
      await nextTick()
      this.$refs.list.refetchData()
      this.selections = []
      this.selectedEntity = null
    },
  },
}
</script>

<template>
  <VForm
    ref="form"
    v-model="valid"
    autocomplete="off"
    @submit.prevent="submitForm"
    class="d-flex flex-column"
  >
    <slot />
    <div class="entity-edit-buttons">
      <!-- Cancel Button -->
      <VBtn
        v-if="!hideCancelButton"
        color="secondary"
        variant="flat"
        rounded="md"
        @click="editMode ? setEditMode(false) : routeToList()"
      >
        <template #prepend>
          <FontAwesomeIcon :icon="editMode ? 'close' : 'arrow-left'" />
        </template>
        <span class="responsive-text">
        {{
            !singleEdit
              ? 'Κλείσιμο'
              : $route.params.id == 0 || !editMode
                ? 'Επιστροφή'
                : 'Ακύρωση'
          }}
        </span>
      </VBtn>
      <VBtn
        v-if="wizardSteps > 0"
        v-show="tabIndex > 1"
        variant="flat"
        :disabled="prevStepCallback()"
        rounded="md"
        type="button"
        :class="prevStepCallback() ? 'disabled' : ''"
        @click="updateTabIndex(-1)"
      >
        <template #prepend>
          <FontAwesomeIcon icon="fa-circle-chevron-left" />
        </template>
        <span class="responsive-text">Προηγούμενο</span>
      </VBtn>
      <VBtn
        v-if="wizardSteps > 0"
        v-show="tabIndex < wizardSteps"
        :disabled="nextStepCallback()"
        variant="flat"
        rounded="md"
        type="button"
        :class="nextStepCallback() ? 'disabled' : ''"
        @click="updateTabIndex(1)"
      >
        <template #prepend>
          <FontAwesomeIcon icon="fa-circle-chevron-right" />
        </template>
        <span class="responsive-text">{{
            tempSave ? 'Αποθήκευση & Συνέχεια' : $t('Next')
          }}</span>
      </VBtn>
      <VBtn
        v-if="editMode && canEdit"
        v-show="
          wizardSteps == 0 ||
          wizardSteps == tabIndex ||
          config.btn?.onAllSteps
        "
        :disabled="disableActions || !(valid && allowSave)"
        type="submit"
        variant="flat"
        rounded="md"
      >
        <template #prepend>
          <FontAwesomeIcon icon="save" />
        </template>
        <span class="responsive-text">{{ config.btn?.title ?? 'Αποθήκευση' }}</span>
      </VBtn>
      <template v-for="extraAction in extraActions">
        {{wizardSteps}}
        <VBtn
          v-if="extraActionShouldRender(extraAction)"
          v-show="
            wizardSteps == 0 ||
            tabIndex == (extraAction.tabIndex ?? wizardSteps)
          "
          :color="extraAction.color"
          :key="extraAction.title"
          :disabled="disableActions || extraAction.disabled"
          :class="extraAction.class ?? ''"
          @click="handleExtraActionClick(extraAction)"
        >
          <template #prepend>
            <FontAwesomeIcon :icon="extraAction.icon" />
          </template>
          <span class="responsive-text">{{ extraAction.title }}</span>
        </VBtn>
      </template>

      <VBtn
        v-if="canEdit && !editMode && singleEdit"
        variant="flat"
        rounded="md"
        @click="setEditMode(true)"
      >
        <template #prepend>
          <FontAwesomeIcon :icon="['fas', 'pen-to-square']" />
        </template>
        <span class="responsive-text">{{ $t('Edit') }}</span>
      </VBtn>
    </div>
  </VForm>
</template>

<script>
import { defineStore } from 'pinia'
import useGenericEntityStore from '../../stores/entity'

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
    entity: {
      type: Object,
      required: true,
    },
    extraValidation: {
      type: Function,
      default: () => '',
    },
    extraActions: {
      type: Array,
      default: null,
      required: false,
    },
    returnToList: {
      type: Boolean,
      default: true,
    },
    editMode: {
      type: Boolean,
      default: true,
    },
    canEdit: {
      type: Boolean,
      default: true,
    },
    wizardSteps: {
      type: Number,
      default: 0,
    },
    tabIndex: {
      type: Number,
      default: 0,
    },
    hideCancelButton: {
      type: Boolean,
      default: false,
    },
    serverSubmit: {
      type: Boolean,
      default: true,
    },
    noValidation: {
      type: Boolean,
      default: false,
    },
    prevStepCallback: {
      type: Function,
      default: () => false,
    },
    nextStepCallback: {
      type: Function,
      default: () => false,
    },
    dataTransformation: {
      type: Function,
      default: entity => entity,
    },
    editTransformation: {
      type: Function,
      default: entity => entity,
    },
    tempSave: {
      type: Boolean,
      default: false,
    },
    singleEdit: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'entityFetched',
    'entitySubmitted',
    'entitySaved',
    'editModeSet',
    'tabIndexUpdated',
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
      valid: false,
      editEntity: {},
      disableActions: false,
    }
  },
  computed: {
    entityChanged() {
      return JSON.stringify(this.editEntity) != JSON.stringify(this.entity)
    },
    allowSave() {
      return !this.editMode || (this.editEntity && this.entityChanged)
    },
  },
  async mounted() {
    if (this.singleEdit) {
      this.fetchEntity()
    } else {
      this.$emit('entityFetched', {})
    }
  },
  methods: {
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    async fetchEntity() {
      const entityID = this.$route.params.id

      if (entityID > 0) {
        const entity = this.editTransformation(
          await this.entityStore.getEntity(entityID),
        )

        if (this.$route.query.duplicate) {
          delete entity.id
        }
        this.$emit('entityFetched', entity)
        this.$nextTick(() => {
          this.editEntity = JSON.parse(JSON.stringify(entity))
        })
      }
    },
    deepEqual(object1, object2) {
      const keys1 = Object.keys(object1)
      const keys2 = Object.keys(object2)
      if (keys1.length !== keys2.length) {
        return false
      }
      for (const key of keys1) {
        const val1 = object1[key]
        const val2 = object2[key]
        const areObjects = this.isObject(val1) && this.isObject(val2)
        if (
          (areObjects && !this.deepEqual(val1, val2)) ||
          (!areObjects && val1 !== val2)
        ) {
          return false
        }
      }

      return true
    },
    isObject(object) {
      return object != null && typeof object === 'object'
    },
    async submitEntity() {
      const data = this.dataTransformation(
        JSON.parse(JSON.stringify(this.entity)),
      )

      if (data.id) {
        await this.saveEntity(true, data)
      } else {
        await this.saveEntity(false, data)
      }
    },
    async saveEntity(update, data, suffix = '') {
      this.$emit('entitySubmitted', data)
      if (this.serverSubmit) {
        this.disableActions = true
        try {
          const response = await this.entityStore.saveEntity(
            data,
            update,
            suffix,
          )

          this.handleEntitySave(response)
          this.disableActions = false

          return response
        } catch (error) {
          this.handleSaveError(error)
          this.disableActions = false
        }
      }
    },
    handleEntitySave(response) {
      this.processEntitySave(
        response,
        this.$t('Entity Saved'),
        this.$t('Save completed successfully'),
      )
      this.$store.clearCache()
    },
    processEntitySave(response, msgTitle, msgText) {
      this.$emit('entitySaved', response)
      this.successToast({
        title: msgTitle,
        text: msgText,
      })
      this.$nextTick(() => {
        if (this.returnToList) {
          this.routeToList()
        }
      })
    },
    handleSaveError(error) {
      const msg = error.response?.data?.message || error.message

      const list = error.response?.data?.errors
        ? `<ul>${error.response.data.errors
          .map(li => `<li>${li}</li>`)
          .join('')}</ul>`
        : ''

      this.errorToast({
        title: this.$t('Save Failure'),
        text: this.$t(msg) + list,
      })
    },
    async submitForm() {
      if (!(this.editMode && this.canEdit)) {
        return
      }

      const errorMsg = this.extraValidation()
      if ((this.valid && errorMsg.length === 0) || this.noValidation) {
        this.submitEntity()
      } else {
        this.errorToast({
          title: this.$t('Save Failure'),
          text: errorMsg,
        })
      }
    },
    extraActionShouldRender(action) {
      if (typeof action.renderCondition === 'function') {

        return action.renderCondition(action)
      } else {
        return (
          this.entity.id &&
          // If no authority validation is given or the validation passes continue
          (!action.hasOwnProperty('authorityValidation') ||
            action.authorityValidation) &&
          // Handle renderCondition when it's a function or a static condition
          (!action.renderCondition ||
            (typeof action.renderCondition === 'function'
              ? action.renderCondition(this.entity)
              : (action.renderCondition.exists &&
                this.entity[action.renderCondition.key] > 0) ||
              this.entity[action.renderCondition.key] ===
              action.renderCondition.value))
        )
      }
    },
    routeToList() {
      let routeName = this.config.routeParams
        ? `${this.config.route}-${Object.keys(this.config.routeParams)[0]}`
        : this.config.route
      let routeParams = this.$route.params ? this.$route.params : null
      let routeQuery = null

      if (this.$route.query.parentid && this.$route.query.parentroute) {
        routeName = `${this.$route.query.parentroute}-id`
        routeParams = { id: this.$route.query.parentid }
        routeQuery = { view: 1 }
      }

      this.$router.push({
        name: routeName,
        params: routeParams,
        query: routeQuery,
      })
    },
    async updateTabIndex(incVal) {
      if (this.tempSave) {
        const { valid } = await this.$refs.form.validate()
        if (!valid) {
          return false
        }
        const response = await this.submitEntity()
        if (!response) {
          return false
        }
      }
      this.$emit('tabIndexUpdated', this.tabIndex + incVal)
    },
    async handleExtraActionClick(action) {
      if (action.endpoint) {
        this.disableActions = true
        try {
          const response = await axios.get(
            `${action.endpoint}/${this.entity.id}`,
          )

          this.processEntitySave(
            response,
            'Action completed',
            'Action completed successfully',
          )
          if (action.callback) {
            action.callback()
          }
        } catch (error) {
          this.handleSaveError(error)
        }
        this.disableActions = false
      } else if (action.callback) {
        action.callback(this.entity)
      }
    },
    setEditMode(mode) {
      if (
        !mode &&
        (this.$route.params.id == 0 || this.$route.query.duplicate)
      ) {
        this.routeToList()
      }
      this.$emit('editModeSet', mode)
    },
  },
}
</script>

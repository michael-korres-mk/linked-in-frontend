<template>
  <VForm
    ref="form"
    v-model="valid"
    autocomplete="off"
    @submit.prevent="submitForm"
  >
    <slot />
    <div
      v-if="editMode"
      class="d-flex justify-center my-6"
    >
      <VBtn
        v-if="wizardSteps > 0"
        v-show="tabIndex < wizardSteps - 1"
        :disabled="nextStepCallback()"
        type="button"
        @click="updateTabIndex(1)"
      >
        {{ tempSave ? 'Αποθήκευση & Συνέχεια' : 'Συνέχεια' }}
      </VBtn>

      <!-- Cancel Button -->
      <VBtn
        v-if="!hideCancelButton"
        color="secondary"
        variant="flat"
        rounded="md"
        size="large"
        @click="setEditMode(false)"
      >
        <FontAwesomeIcon
          icon="close"
          class="font-size-20 me-5"
        />
        {{
          !singleEdit
            ? 'Κλείσιμο'
            : $route.params.id == 0
              ? 'Επιστροφή'
              : 'Ακύρωση'
        }}
      </VBtn>

      <VBtn
        v-if="canEdit && !hideSubmitButton"
        v-show="wizardSteps == 0 || wizardSteps == tabIndex + 1"
        :disabled="disableActions || !(valid && allowSave)"
        type="submit"
        class="btn-darkblue px-5 ms-2"
        variant="flat"
        rounded="md"
        size="large"
      >
        <FontAwesomeIcon
          icon="save"
          class="font-size-20 me-5"
        />
        {{ config.btn ? config.btn.title : 'Αποθήκευση' }}
      </VBtn>
      <template v-for="extraAction in extraActions">
        <VBtn
          v-if="extraActionShouldRender(extraAction)"
          :key="extraAction.title"
          :disabled="disableActions"
          class="ms-3"
          :color="extraAction.color ?? 'primary'"
          :class="extraAction.class ? extraAction.class : 'btn-blue'"
          @click="handleExtraActionClick(extraAction)"
        >
          <FontAwesomeIcon
            :icon="extraAction.icon"
            size="lg"
            class="pe-5"
          />
          {{ extraAction.title }}
        </VBtn>
      </template>
    </div>

    <div
      v-else-if="singleEdit"
      class="d-flex justify-center my-6"
    >
      <!-- Return Button -->
      <VBtn
        v-if="!hideReturnButton"
        class="px-5"
        color="secondary"
        variant="flat"
        rounded="md"
        size="large"
        @click="routeToList"
      >
        <FontAwesomeIcon
          :icon="['fas', 'circle-chevron-left']"
          class="font-size-20 me-5"
        />
        Επιστροφή
      </VBtn>
      <VBtn
        v-if="canEdit && !hideEditButton"
        class="px-5 mx-2"
        variant="flat"
        rounded="md"
        size="large"
        @click="setEditMode(true)"
      >
        <FontAwesomeIcon
          :icon="['fas', 'pen-to-square']"
          class="font-size-20 me-5"
        />
        {{ $t('Edit') }}
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
    wizardSteps: {
      type: Number,
      default: 0,
    },
    tabIndex: {
      type: Number,
      default: 0,
    },
    hideReturnButton: {
      type: Boolean,
      default: false,
    },
    hideEditButton: {
      type: Boolean,
      default: false,
    },
    hideCancelButton: {
      type: Boolean,
      default: false,
    },
    hideSubmitButton: {
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
    authority: {
      type: String,
      default: '',
    },
  },
  emits: [
    'entityFetched',
    'entitySubmitted',
    'entitySaved',
    'editModeSet',
    'updateTabIndex',
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
    canEdit() {
      // TODO revert when authorities are implemented
      // return !this.authority.length || this.$store.userRights.includes(`${this.authority}_edit`)
      return true
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
        this.saveEntity(true, data)
      } else {
        this.saveEntity(false, data)
      }
    },
    async saveEntity(update, data) {
      this.$emit('entitySubmitted', data)
      if (this.serverSubmit) {
        this.disableActions = true
        try {
          const response = await this.entityStore.saveEntity(data, update)

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
    // TODO: Study this
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
        alert('extraActionShouldRender')
        
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
      let routeName = this.config.returnRoute ? this.config.returnRoute : this.config.route
      let routeParams = this.config.routeParam ? this.config.routeParam : null
      let routeQuery = null

      if (this.$route.query.parentid && this.$route.query.parentroute) {
        routeName = `${this.$route.query.parentroute}-id`
        routeParams = { id: this.$route.query.parentid }
        routeQuery = { view: 1 }
      }
      if (this.config.routeParam) {
        routeName = `${this.config.route}-id`
        routeParams = { id: this.config.routeParam }
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
      }
    },
    setEditMode(mode) {
      if (!mode && (this.$route.params.id == 0 || this.$route.query.duplicate ) ) {
        this.routeToList()
      }
      this.$emit('editModeSet', mode)
    },
  },
}
</script>

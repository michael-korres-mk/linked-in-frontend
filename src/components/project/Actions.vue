<script>
import {defineStore} from "pinia";
import useGenericEntityStore from "@/stores/entity.js";

export default {
  name: "Actions",
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
      disableActions: false,
    }
  },
  props:{
    item:{
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: true,
    },
    detailsViewIcon: {
      type: String,
      default: 'fa-desktop',
    },
    detailsViewTitle: {
      type: String,
      default: 'Details',
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
    extraActions: {
      type: Array,
      default: null,
    },
    singleEdit: {
      type: Boolean,
      default: true,
    },
    allowDuplicate: {
      type: Boolean,
      default: false,
    },
    hideEnabled: {
      type: Boolean,
      default: true,
    },
    refetchData:{
      type: Function,
      required: true,
    },
    allowInsert: {
      type: Boolean,
      default: true,
    },
    allowEdit: {
      type: Boolean,
      default: true,
    },
    allowDelete: {
      type: Boolean,
      default: true,
    },
    setEntityData: {
      type: Function,
      required: true,
    },
    updateDeleteModalId:{
      type: Function,
      required: true,
    }
  },
  methods:{
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
      await this.refetchData()
      this.disableActions = false
    },
  }
}
</script>

<template>

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

</template>

<style scoped lang="scss">

</style>

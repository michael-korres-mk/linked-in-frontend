<script setup>
import ActionBtn from '../entity/ActionBtn.vue'
</script>

<template>
  <slot name="extraHeaderContent" />
  <VTable class="mt-4">
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="col.key"
          :class="col.class"
          :colspan="4"
        >
          {{ col.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(itemPair, pairIndex) in itemPairs"
        :key="`pair-${pairIndex}`"
      >
        <template v-for="(item, itemIndex) in itemPair">
          <td
            v-for="col in columns"
            :key="`item-${pairIndex}-${itemIndex}-${col.key}`"
          >
            <div
              v-if="col.format"
              v-html="col.format(item[col.key], col.extraParam)"
            />
            <div v-else-if="col.key === 'actions'">
              <ActionBtn
                v-if="!hideDelete"
                color="danger"
                size="small"
                icon
                @click="$emit('itemDeleted', item)"
              >
                <FontAwesomeIcon icon="fa-solid fa-trash-can" />
              </ActionBtn>
            </div>
            <div v-else>
              {{ item[col.key] }}
            </div>
          </td>
          <td>
            <div class="d-flex justify-end">
              <div
                v-for="extraAction in extraActions"
                :key="extraAction.icon"
              >
                <ActionBtn
                  v-if="extraActionShouldRender(extraAction, item)"
                  :key="extraAction.icon"
                  color="orange"
                  :icon="(extraAction.dynamicIcon && item[extraAction.iconProp]) ? extraAction.dynamicIcon : extraAction.icon"
                  :label="extraAction.title"
                  :disabled="extraAction.disabled?? false"
                  :href="extraAction.href ? (extraAction.path || '') + getValueByPath(item, extraAction.href) + (extraAction.extraparam ? '_' + getValueByPath(item, extraAction.extraparam) : '') + (extraAction.suffix || '') : null"
                  @click="handleExtraActionClick(item, extraAction)"
                />
              </div>
            </div>
          </td>
        </template>
      </tr>
    </tbody>
  </VTable>
  <slot name="extraFooterContent" />
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    hideDelete: {
      type: Boolean,
      default: false,
    },
    extraActions: {
      type: Array,
      default: () => [],
    },
  
  },
  emits: ['itemDeleted'],
  computed: {
    itemPairs() {
      // Group items into pairs for rendering
      let pairs = []
      for (let i = 0; i < this.items.length; i += 2) {
        pairs.push(this.items.slice(i, i + 2))
      }
      
      return pairs
    },
  },
  methods: {
    extraActionShouldRender(action, item) {
      // First, check if renderCondition is a function and evaluate it
      if (typeof action.renderCondition === 'function') {
        return action.renderCondition(item)
      } else {
        // If renderCondition is not a function, proceed with the rest of the conditions
        return (
          (!action.hasOwnProperty('authorityValidation') ||
            action.authorityValidation) &&
          (!action.renderCondition ||
            item[action.renderCondition.key] ===
              action.renderCondition.value) &&
          (!action.propertyExists || item[action.propertyExists]) &&
          (!action.propertyNotExists || !item[action.propertyNotExists])
        )
      }
      
      return true
    },
    async handleExtraActionClick(item, action) {
      if (action.endpoint) {
        await this.entityStore.extraAction(
          `${action.endpoint}/${item.id}`,
        )
      }
      else if (action.callback && typeof action.callback === 'function') {
        action.callback(item)
      }
      else if (action.callback) {
        this[action.callback](item, action)
      }
    },
    getValueByPath(object, path) {
      return path.split('.').reduce((o, i) => o[i], object)
    },
  },
}
</script>


<script setup>
import ActionBtn from './ActionBtn.vue'
</script>

<template>
  <VTable class="my-4 table">
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :id="col.key"
          :key="col.key"
          :class="col.class"
        >
          {{ col.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in items"
        :key="item.id"
      >
        <td
          v-for="col in columns"
          :key="col.key"
          :class="col.class"
        >
          <div
            v-if="col.format"
            v-html="col.format(item[col.key], col.extraParam)"
          />
          <div v-else-if="col.key.includes('.')">
            {{ getParsedKey(item, col.key) }}
          </div>
          <div v-else-if="col.key === 'actions'">
            <VBtn
              v-if="!hideDelete"
              color="danger"
              size="small"
              icon
              @click="$emit('itemDeleted', item)"
            >
              <FontAwesomeIcon icon="fa-solid fa-trash-can" />
              <VTooltip
                activator="parent"
                location="bottom"
              >
                {{ $t('Delete') }}
              </VTooltip>
            </VBtn>
          </div>
          <div v-else-if="col.icon">
            <RouterLink
              v-if="generateUrl(item, col.extraParam).name"
              :to="generateUrl(item, col.extraParam)"
            >
              <ActionBtn
                :icon="col.icon"
                :label="col.title"
              />
            </RouterLink>
            <span v-else>-</span>
          </div>
          <span v-else>{{ item[col.key] }}</span>
        </td>
      </tr>
    </tbody>
  </VTable>
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
  },
  emits: ['itemDeleted'],
}
</script>

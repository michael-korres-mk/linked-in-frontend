<template>
  <div
    :class="
      legendTitle!==''
    
        ?
          'card-wrapper'
        :
          ''"
    class="mt-10"
  >
    <legend
      v-if="legendTitle!==''"
      class="legend-title text-center"
    >
      {{ $t(legendTitle) }}
    </legend>
    <div class="card-body p-10">
      <VRow>
        <VCol v-if="Object.keys(dataObject).length === 0">
          <p>{{ noDataTitle }}</p>
        </VCol>
        <VCol
          v-for="(items, category) in dataObject"
          v-else
          :key="category"
          cols="4"
        >
          <VCard
            class="mb-4"
            variant="outlined"
          >
            <VCardText>
              <h4>{{ category }}</h4>
              <div
                v-for="item in items"
                :key="item"
              >
                <VChip
                  class="ma-0"
                  color="orange"
                  label
                  variant="flat"
                  size="x-small"
                >
                  <span>{{ item }}</span>
                </VChip>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataObject: {
      type: Object,
      default: () => ({}),
    },
    legendTitle: {
      type: String,
      default: '',
    },
    noDataTitle: {
      type: String,
      default: 'No Data',
    },
  },
}
</script>


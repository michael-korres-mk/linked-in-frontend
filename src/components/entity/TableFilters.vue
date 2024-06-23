<template>
  <div
    v-if="filters.length"
    :class="hideFilterLegend ? 'card-wrapper-nl' : 'card-wrapper'"
  >
    <div v-if="!hideFilterLegend">
      <legend class="legend-title">
        {{ filtersLegendTitle }}
      </legend>
    </div>
    <div class="card-body mb-0 pb-0">
      <VRow>
        <VCol
          v-for="field in filters"
          v-show="!field.hidden"
          :key="field.id"
          :md="field.colSize ? field.colSize : 4"
          cols="12"
          class="mb-0"
        >
          <div class="field-label-text mb-1">
            {{ field.label }}
          </div>
          <VSelect
            v-if="field.type === 'select'"
            v-model="filterVals[field.id]"
            :items="field.options"
            :data-id="field.id"
            placeholder="-- Επιλέξτε --"
            item-value="id"
            item-color="white"
            variant="outlined"
            class="mb-2"
            clearable
            @update:modelValue="filterUpdated(field.id)"
          />
          <VTextField
            v-else
            v-model="filterVals[field.id]"
            :name="field.id"
            :type="field.type"
            :prepend-inner-icon="field.type !== 'date' ? 'mdi-magnify' : ''"
            :data-id="field.id"
            placeholder="Αναζητήστε"
            variant="outlined"
            class="mb-2"
            density="compact"
            @update:modelValue="filterUpdated(field.id)"
          />
        </VCol>
      </VRow>
      <VRow
        v-if="!autoUpdateFilters"
        :class="autoUpdateFilters? 'mb-0 pb-0':'pb-2 mb-2'"
      >
        <VCol
          cols="12"
          class="text-center"
        >
          <VBtn
            class="me-2"
            color="secondary"
            rounded="md"
            variant="flat"
            @click="resetForm"
          >
            <FontAwesomeIcon
              icon="close"
              class="font-size-20 me-5"
            />
            Καθαρισμός
          </VBtn>
          <VBtn
            color="primary"
            variant="flat"
            rounded="md"
            @click="submitForm"
          >
            <FontAwesomeIcon
              icon="search"
              class="font-size-20 me-5"
            />
            Αναζήτηση
          </VBtn>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<script>
import { vueDebounce } from 'vue-debounce'

export default {
  name: 'TableFilters',
  directives: {
    debounce: vueDebounce({ lock: true }),
  },
  props: {
    filters: {
      type: Array,
      required: true,
    },
    filtersLegendTitle: {
      type: String,
      default: 'Αναζήτηση',
    },
    hideFilterLegend: {
      type: Boolean,
      default: false,
    },
    autoUpdateFilters: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['initFilters', 'applyFilters', 'filterUpdated', 'resetFilters'],
  data() {
    return {
      filterVals: {},
    }
  },
  computed: {
    allFilters() {
      return [
        ...this.filters,
        ...[
          {
            id: 'q',
            type: 'text',
            colSize: 12,
          },
        ],
      ]
    },
  },
  mounted() {
    this.initVals()
  },
  methods: {
    initVals() {
      this.filters.forEach(filter => {
        this.filterVals[filter.id] = filter.initVal
      })
      this.$emit('initFilters', this.filterVals)
    },
    submitForm() {
      this.$emit('applyFilters', this.filterVals)
    },
    updatefilter(newVal, e) {
      const fieldId = e.target.name
      if (newVal.length > 2) {
        this.filterVals[fieldId] = newVal
        this.filterUpdated(fieldId)
      }
    },
    filterUpdated(fieldId) {
      this.$emit('filterUpdated', fieldId, this.filterVals[fieldId])
      this.autoUpdateFilters? this.submitForm() : null
    },
    resetForm() {
      this.initVals()
      this.submitForm()
      this.$emit('resetFilters')
    },
  },
}
</script>

<style>
.field-container {
  margin-block: 0;
  margin-inline: auto;
  max-inline-size: 350px;
}

.custom-input .v-input__control {
  border-radius: 20px;

  /* Adjust the border radius as needed */
}
</style>

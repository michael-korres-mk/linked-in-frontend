<template>
  <div
    v-if="filters.length"
    :class="[hideFilterLegend ? 'card-wrapper-nl' : 'card-wrapper',hideFilters? 'd-none' : '']"
  >
    <div v-if="!hideFilterLegend">
      <legend class="legend-title">
        <h2>{{ filtersLegendTitle }}</h2>
      </legend>
    </div>
    <div class="card-body mb-8 pb-0">
      <VRow>
        <VCol
          v-for="field in fields"
          v-show="!field.hidden"
          :key="field.id"
          :md="field.colSize ? field.colSize : 4"
          cols="12"
          class="mb-0"
        >
          <FormField
            :form-field="field"
            :entity="filterVals"
            is-filter
            @fieldUpdated="filterUpdated"
          />
        </VCol>
      </VRow>
      <VRow v-if="!autoUpdateFilters">
        <VCol
          cols="12"
          class="text-center gap-3 justify-left"
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
            variant="flat"
            rounded="md"
            @click="submitForm"
          >
            <FontAwesomeIcon
              icon="search"
              class="font-size-20 me-5"
            />
            <span color="on-surface">Αναζήτηση</span>
          </VBtn>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<script>
import { vueDebounce } from 'vue-debounce'
import FormField from './FormField.vue'

export default {
  components: {
    FormField,
  },
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
    hideFilters: {
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
    fields() {
      return this.filters.map(filter => ({
        ...filter,
        variant: 'outlined',
      }))
    },
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
        this.filterVals[filter.id] = filter.storeVal ?? filter.initVal
      })
      this.$emit('initFilters', this.filterVals)
    },
    submitForm() {
      this.$emit('applyFilters', this.filterVals)
    },
    filterUpdated(fieldObj) {
      this.filterVals[fieldObj.id] = fieldObj.value
      this.$emit('filterUpdated', fieldObj.id, fieldObj.value)
      if (this.autoUpdateFilters) {
        this.submitForm()
      }
    },
    resetForm() {
      this.initVals()
      this.submitForm()
      this.$emit('resetFilters')
    },
  },
}
</script>

<script setup>
import CustomField from './CustomField.vue'
import FormField from './FormField.vue'
</script>

<template>
  <div>
    <h3 v-if="title">
      {{ title }}
    </h3>
    <VRow>
      <VCol
        v-for="(formField, index) in fields"
        :key="
          formField.parent
            ? formField.parent + '_' + formField.id
            : formField.id
        "
        :md="formField.colSize ? formField.colSize : 12"
        :class="(formField.hidden ? 'd-none' : '') + ' pb-0'"
        cols="12"
      >
        <CustomField
          v-if="formField.type === 'custom'"
          :form-field="formField"
          :entity="formField.parent ? entity[formField.parent] : entity"
          :parent="formField.parent"
        />
        <FormField
          v-else-if="!formField.hidden"
          :form-field="formField"
          :entity="entity"
          :disabled="disabled"
          :autofocus="allowAutofocus && index == 0"
          @fieldUpdated="updateField"
          @detailsBtnClicked="detailsBtnClicked"
        />
      </VCol>
    </VRow>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
      required: false,
    },
    formFields: {
      type: Array,
      required: true,
    },
    entity: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    allowAutofocus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['fieldUpdated', 'detailsBtnClicked'],
  computed: {
    fields() {
      return this.formFields.map(field => {
       
        field.disabled = this.disabled
        
        return field
      })
    },
  },
  methods: {
    updateField(fieldObj) {
      this.$emit('fieldUpdated', fieldObj)
    },
    detailsBtnClicked(fieldId) {
      this.$emit('detailsBtnClicked', fieldId)
    },
  },
}
</script>

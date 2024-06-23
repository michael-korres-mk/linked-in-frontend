<template>
  <div v-if="entity">
    <PlainTable
      :columns="columns"
      :items="items"
    />
  </div>
</template>

<script>
export default {
  props: {
    entity: {
      type: Object,
      default: () => ({}),
    },
    formField: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uploading: false,
    }
  },
  computed: {
    fieldValue: {
      get() {
        if (this.entity) {
          return this.formField.parent
            ? this.entity[this.formField.parent][this.formField.id]
            : this.entity[this.formField.id]
        }

        return null
      },
      set(val) {
        this.emitField(this.formField.parent, val)
      },
    },
    fieldId() {
      return this.formField.id
    },
    columns() {
      return [
        { key: 'firstName', title: 'First Name' },
        { key: 'lastName', title: 'Last Name' },
        { key: 'birthDate', title: 'birthDate' },
        { key: 'status', title: 'Οικογενειακή Κατάσταση' },
        { key: 'start', title: 'Έναρξη Σπουδών' },
        { key: 'cat', title: 'Μοριοδοτείται' },
      ]
    },
    items() {
      return [
        { firstName: 'Πέτρος', lastName: 'Κοντός', birthDate: '16/3/1995', status: 'Άγαμο', start: '-', cat: 'Δεν μοριοδοτείται' },
        { firstName: 'Κώστας', lastName: 'Ψηλός', birthDate: '6/1/1993', status: 'Άγαμο', start: '-', cat: 'Μοριοδοτείται' },
      ]
    },
  },
}
</script>

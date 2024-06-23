<script setup>
import entityMixins from '../../mixins/entityedit';
import organizationMixins from '../../mixins/organization';
</script>

<template>
  <EntitySingle
    :entity="entity"
    :config="config"
    :sections="sections"
    :single-edit="singleEdit"
    :hide-title="!singleEdit"
    :secondary-tables="secondaryTables"
    :accordion="accordion"
    authority="organizations"
    @entitySaved="entitySaved"
    @editModeSet="editModeSet"
  >
    <template #extraAccordionContent>
      <slot name="extraAccordionContent" />
    </template>
  </EntitySingle>
</template>

<script>
export default {
  mixins: [entityMixins, organizationMixins],
  props: {
    entity: {
      type: Object,
      required: true,
    },
    singleEdit: {
      type: Boolean,
      default: true,
    },
    secondaryTables: {
      type: Array,
      default: () => [],
    },
    accordion: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editMode: !this.singleEdit,
      questionnaireOptions: [],
    }
  },
  computed: {
    sections() {
      return [
        {
          fields: this.formFields,
          title: 'Στοιχεία Φορέα',
        },
      ]
    },
  },
}
</script>

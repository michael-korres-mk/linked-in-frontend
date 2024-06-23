<script setup>
import AccordionItem from './AccordionItem.vue'
</script>
<template>
  <div class="linked-in-accordion">
    <details
      v-for="item in items"
      :key="item.id"
      class="linked-in-accordion__section"
    >
      <AccordionItem :title="item.title">
        <div v-html="item.description" />
      </AccordionItem>
    </details>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
}
</script>

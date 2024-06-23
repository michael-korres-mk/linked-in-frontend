<template>
  <summary class="linked-in-accordion__section-summary">
    <h2 class="linked-in-accordion__section-heading">
      <span class="linked-in-accordion__section-button">{{ title }}</span>
    </h2>
  </summary>
  <div class="linked-in-accordion__section-content">
    <div class="linked-in-body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <div v-show="errorMsg.length" class="linked-in-error-summary">
    <h3 class="linked-in-heading-s">Υπήρξε κάποιο πρόβλημα</h3>
    <div class="linked-in-body mb-0">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errorMsg: {
      type: String,
      required: true,
    },
  },
}
</script>

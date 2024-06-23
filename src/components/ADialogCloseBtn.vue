<template>
  <VBtn
    variant="text"
    class="dialog-close-btn"
  >
    <FontAwesomeIcon
      :icon="icon"
      :size="size"
    />
  </VBtn>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'fa-close',
    },
    size: {
      type: String,
      default: 'lg',
    },
  },
}
</script>

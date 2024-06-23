<template>
  <VBtn
    :density="density"
    class=" ms-n3 side-btn"
    size="large"
    variant="flat"

    @click="$emit('detailsBtnClicked')"
  >
    <FontAwesomeIcon
      :icon="icon || 'fa-desktop'"
      color="primary"
      class="font-22"
    />
  </VBtn>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: null,
    },
    density: {
      type: String,
      default: 'default',
    },
  },
  emits: ['detailsBtnClicked'],
}
</script>

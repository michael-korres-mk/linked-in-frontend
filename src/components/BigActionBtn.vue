<template>

  <VBtn
    color="primary"
    class="mb-2 rounded my-button"
    :size="size"
  >
    <FontAwesomeIcon
      :icon="icon"
      size="lg"
      class="pe-5"
    />
    <div class="font-20">
      {{ $t(label) }}
    </div>
  </VBtn>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
    iconOnly: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: 'Btn',
    },
    size:{
      type: String,
      default: 'large',
    }
  },
}
</script>

<style scoped>
.rounded {
  border-radius: 8px !important;
}

.my-button {
  width: 150px; /* Set a fixed width */
}
</style>

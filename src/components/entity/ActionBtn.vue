<template>
  <VBtn
    :disabled="disabled"
    :aria-label="$t(label)"
    :variant="variant"
    :size="size"
    rounded="md"
    icon="icon"
    class="mx-1 p-0 action-btn-border" 
  >
    <FontAwesomeIcon
      :icon="icon"
      class="font-18"
    />

    <VTooltip
      activator="parent"
      location="top"
    >
      {{ $t(label) }}
    </VTooltip>
  </VBtn>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'text',
    },
    size: {
      type: String,
      default: 'small',
    },
  },
}
</script>

<template>
  <VDialog
    v-model="modalOpen"
    :max-width="width"
    :persistent="persistent"
    scrollable
    @update:modelValue="cancelCallback"
  >
    <ADialogCloseBtn
      v-if="!persistent"
      @click="cancelCallback"
    />
    <VCard class="rounded-lg">
      <VCardTitle
        v-if="title"
        :class="`${titleBg} py-3`"
      >
        {{ title }}
      </VCardTitle>
      <VCardText class="py-0">
        <slot />
      </VCardText>

      <VCardActions
        v-if="!hideActions"
        class="d-flex justify-center my-6"
      >
        <div>
          <!-- Cancel Button -->
          <VBtn
            :color="cancelColor"
            variant="flat"
            rounded="md"
            size="large"
            @click="cancelCallback"
          >
            <FontAwesomeIcon
              :icon="cancelIcon"
              class="font-size-20 me-5"
            />
            {{ cancelTitle }}
          </VBtn>

          <!-- Submit Button -->
          <VBtn
            v-if="!hideSubmitBtn"
            :color="successColor"
            variant="flat"
            rounded="md"
            size="large"
            @click="successCallback"
          >
            <FontAwesomeIcon
              :icon="successIcon"
              class="font-size-20 me-5"
            />
            {{ successTitle }}
          </VBtn>
        </div>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import ADialogCloseBtn from './ADialogCloseBtn.vue'

export default {
  components: {
    ADialogCloseBtn,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    width: {
      type: Number,
      default: 800,
    },
    titleBg: {
      type: String,
      default: 'bg-primary',
    },
    successTitle: {
      type: String,
      default: 'Προσθήκη',
    },
    successIcon: {
      type: String,
      default: 'fa-circle-plus',
    },
    cancelIcon: {
      type: String,
      default: 'fa-xmark',
    },
    cancelColor: {
      type: String,
      default: 'secondary',
    },
    successColor: {
      type: String,
      default: 'primary',
    },
    cancelTitle: {
      type: String,
      default: 'Κλείσιμο',
    },
    successCallback: {
      type: Function,
      default: () => '',
    },
    cancelCallback: {
      type: Function,
      default: () => '',
    },
    valid: {
      type: Boolean,
      default: true,
    },
    hideActions: {
      type: Boolean,
      default: false,
    },
    hideIcon: {
      type: Boolean,
      default: false,
    },
    open: {
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: true,
    },
    hideSubmitBtn: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    modalOpen: {
      get() {
        return this.open
      },
      set(val) {
        this.cancelCallback()
      },
    },
  },
}
</script>

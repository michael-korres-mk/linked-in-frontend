<template>
  <VSnackbar
    v-model="showSnackbar"
    :color="color"
    :timeout="timer"
    location="top end"
    transition="scroll-y-reverse-transition"
  >
    <div class="d-flex align-items-start">
      <FontAwesomeIcon
        :class="`mr-3 text-${variant}`"
        :icon="icon"
        size="xl"
      />
      <div class="d-flex flex-grow-1">
        <div>
          <h5
            v-if="title"
            :class="`text-${variant}`"
            class="mb-0 font-weight-bolder"
            v-text="title"
          />
          <small
            v-if="text"
            class="d-inline-block font-14 text-grey-900"
            v-html="text"
          />
        </div>
        <FontAwesomeIcon
          v-if="showClose"
          icon="fa-x"
          class="ml-auto"
          size="xs"
          @click="showSnackbar = false"
        />
      </div>
    </div>
  </VSnackbar>
</template>

<script>
export default {
  data() {
    return{
      showSnackbar: false,
      showClose: true,
      title: '',
      text: '',
      variant: 'success',
      color: 'surface',
      icon: 'mdi-check',
      timer: 3000,
    }
  },
  methods: {
    close() {
      this.showSnackbar = false
    },
    show(data) {
      this.title = data.title || 'missing "title"'
      this.text = data.text || ''
      this.variant = data.variant || 'success'
      this.color = data.color || 'surface'
      this.timer = data.timer || 3000
      this.icon = data.icon || 'mdi-check'
      this.showSnackbar = true
      this.showClose = data.showClose || true
    },
  },
}
</script>

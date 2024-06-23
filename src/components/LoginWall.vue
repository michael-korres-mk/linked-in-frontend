<template>
  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 me-0">
        <div class="d-flex align-center justify-center  w-100 h-100 bg-primary">
          <VImg
            max-width="505"
            :src="logoImage"
            class="auth-illustration mt-16 mb-2"
          />
        </div>
      </div>
    </VCol>
    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <slot/>
    </VCol>
  </VRow>
</template>

<script>
  import logo from '@images/logo_white.png'

  export default {

    data() {
      return {logoImage:logo}
    }
  }
</script>

<style scoped lang="scss">

</style>

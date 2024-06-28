<template>
  <div
    class="loader-overlay"
    role="status"
  >
    <div class="loader-spinner" />
    <div class="loader-message">{{ loaderMessage }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: null,
    }
  },
  computed: {
    loaderMessage() {
      return 'ΠΑΡΑΚΑΛΩ ΠΕΡΙΜΕΝΕΤΕ...'
    },
  },
}
</script>

<style>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loader-spinner {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

.loader-message {
  font-size: 18px;
  margin-top: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

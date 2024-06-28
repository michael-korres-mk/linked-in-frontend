<template>
  <VCard :disabled="loading" :loading="loading" class="mx-auto my-12" max-width="600">
    <template v-slot:loader="{ isActive }">
      <VProgressLinear :active="isActive" color="#1f4e79" height="4" indeterminate/>
    </template>

    <VImg height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png" cover />

    <v-card-item>
      <v-card-title class="text-left text-info">Cafe Badilico</v-card-title>

      <v-card-subtitle class="text-left">
        <span class="me-1">Local Favorite</span>

        <v-icon
          color="error"
          icon="mdi-fire-circle"
          size="small"
        ></v-icon>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>

      <div class="my-4 text-subtitle-1">
        $ • Italian, Cafe
      </div>
      <v-timeline align="start" density="compact">
        <v-timeline-item
          v-for="message in messages"
          :key="message.time"
          :dot-color="message.color"
          size="x-small"
        >
          <div class="mb-4">
            <div class="font-weight-normal">
              <strong>{{ message.from }}</strong> @{{ message.time }}
            </div>

            <div>{{ message.message }}</div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="deep-purple-lighten-2"
        text="Reserve"
        block
        border
        @click="reserve"
      ></v-btn>

    </v-card-actions>
  </VCard>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'foo'
    },
  },

  data: () => ({
    loading: false,
    messages: [
      {
        from: 'You',
        message: `Sure, I'll see you later.`,
        time: '10:42am',
        color: 'deep-purple-lighten-1',
      },
      {
        from: 'John Doe',
        message: 'Yeah, sure. Does 1:00pm work?',
        time: '10:37am',
        color: 'green',
      },
      {
        from: 'You',
        message: 'Did you still want to grab lunch today?',
        time: '9:47am',
        color: 'deep-purple-lighten-1',
      },
    ],
  }),
  methods:{
    reserve () {
      this.loading = true

      setTimeout(() => (this.loading = false), 2000)
    },
  }
}
</script>

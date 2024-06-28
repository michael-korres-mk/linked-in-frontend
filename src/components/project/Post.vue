<template>
  <VCard :disabled="loading" :loading="loading" class="mx-auto my-12 post" max-width="1000">
    <template v-slot:loader="{ isActive }">
      <VProgressLinear :active="isActive" color="#1f4e79" height="4" indeterminate/>
    </template>

    <VCardItem>
        <VCardTitle class="text-left text-info bg-amber-lighten-1 justify-end">
          <v-icon icon="tabler-user" color="info" size="large" />
          <div>{{ post.title }}</div>
        </VCardTitle>
        <VCardSubtitle class="text-left"><span class="me-1">Local Favorite</span></VCardSubtitle>
        <div class="text-subtitle-1 text-left"> $ • Italian, Cafe </div>
    </VCardItem>

    <div>
      Small plates, salads & sandwiches - an intimate setting with 12 indoor
      seats plus patio seating.
    </div>

    <VImg height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png" cover />

    <VCardText>

      <v-timeline align="start" density="compact">
        <v-timeline-item
          v-for="comment in post.comments"
          :key="comment.time"
          :dot-color="comment.color"
          size="x-small"
        >
          <div class="mb-4">
            <div class="font-weight-normal">
              <strong>{{ comment.creator }}</strong> @{{ comment.creationDate }}
            </div>

            <div>{{ comment.text }}</div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </VCardText>

    <VCardActions>
      <VBtn color="deep-purple-lighten-2" border @click="reserve"> Comment </VBtn>
      <VBtn color="deep-purple-lighten-2" border @click="like"> Like </VBtn>

    </VCardActions>
  </VCard>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'foo'
    },
    post:{
      type: Object,
      default: {}
    }
  },

  data: () => ({
    loading: false,
    comments: [
      {
        from: 'You',
        text: `Sure, I'll see you later.`,
        time: '10:42am',
        color: 'deep-purple-lighten-1',
      },
      {
        from: 'John Doe',
        text: 'Yeah, sure. Does 1:00pm work?',
        time: '10:37am',
        color: 'green',
      },
      {
        from: 'You',
        text: 'Did you still want to grab lunch today?',
        time: '9:47am',
        color: 'deep-purple-lighten-1',
      },
    ],
  }),
  methods:{
    freezeCard(){
      this.loading = true
      setTimeout(() => (this.loading = false), 2000)
    },
    like () {
      this.freezeCard()
    },
    reserve () {
      this.freezeCard()
    },
  }
}
</script>

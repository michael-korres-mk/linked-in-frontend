<template>
  <VCard :disabled="loading" :loading="loading" class="mx-auto my-12 post" max-width="1000">
    <template v-slot:loader="{ isActive }">
      <VProgressLinear :active="isActive" color="#1f4e79" height="4" indeterminate/>
    </template>

    <VCardItem>
        <VCardTitle class="text-left text-info bg-amber-lighten-1 justify-end">
          <v-icon icon="tabler-user" color="info" size="large" />
          <div>{{ post.creator.title }}</div>
        </VCardTitle>
        <div class="text-subtitle-1 text-left text">{{ post.title }}</div>
    </VCardItem>

    <div>{{ post.description }}</div>

    <div id="imageSlot"/>

    <VCardText>
      <v-expansion-panels v-if="post.comments.length > 0" flat>
        <v-expansion-panel title="Comments">
          <v-expansion-panel-text>
            <v-timeline align="start" density="compact">
              <v-timeline-item
                v-for="comment in post.comments"
                :key="comment.time"
                :dot-color="comment.color"
                size="x-small"
              >
                <v-avatar icon="$vuetify" image="https://cdn.vuetifyjs.com/images/cards/cooking.png" size="48"></v-avatar>
                <div class="mb-4">
                  <div class="font-weight-normal">
                    <strong>{{ comment.creator.title }}</strong> @{{ comment.creationDate }}
                  </div>

                  <div>{{ comment.description }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <div v-else class="mx-auto my-12 post"> No comments available </div>
    </VCardText>

    <VCardActions>
      <VBtn color="deep-purple-lighten-2" border @click="reserve"> Comment </VBtn>
      <VBtn color="deep-purple-lighten-2" border @click="like"> Like </VBtn>

      <slot name="actions"/>

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
  mounted() {
    this.imgShow(this.post)
  },
  methods:{
    async convertToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = (error) => {
          reject(error);
        };
      });
    },
    async imgShow(post) {
       if (post.photos.length > 0) {
         const photoObj = await this.$store.fetchFile(post.photos[0].photo.id)
         const b64 = await this.convertToBase64(photoObj.data).then(base64 => {
           return base64
         }).catch(error => {
           console.error('Error:', error);
         });

         const imageSlot = document.getElementById('imageSlot');
         const image = document.createElement("img");
         image.id = "id";
         image.width = 700
         image.height = 500
         image.src = b64
         image.addEventListener("change", this.imgShow)
         imageSlot.appendChild(image);

       }

    },
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

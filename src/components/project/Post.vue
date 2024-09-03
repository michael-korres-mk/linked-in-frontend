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

    <div v-if="post.photos.length > 0">
      <div>{{ post.description }}</div>
      <v-divider />
      <v-carousel
        color="#1f4e79"
        hide-delimiter-background
        :hide-delimiters="post.photos.length === 1"
        :show-arrows="post.photos.length > 1"
        show-arrows="hover"
      >

        <v-carousel-item
          v-for="photo in post.photos"
          :key="photo"
          :src="imgShow(photo)"
          cover
        >
          <div :id="photo.id"/>
        </v-carousel-item>
      </v-carousel>
    </div>
    <div v-else class="no-photo-post">
      {{ post.description }}
    </div>
    <v-divider /><br>

<!--    <VCardText>-->
<!--      <v-expansion-panels v-if="comments.length > 0" >-->
<!--        <v-expansion-panel title="Comments">-->
<!--          <v-expansion-panel-text>-->
<!--            <v-timeline align="start" density="compact">-->
<!--              <v-timeline-item-->
<!--                v-for="comment in comments"-->
<!--                :key="comment.time"-->
<!--                :dot-color="comment.color"-->
<!--                size="x-small"-->
<!--              >-->
<!--                <v-avatar icon="$vuetify" image="https://cdn.vuetifyjs.com/images/cards/cooking.png" size="48"></v-avatar>-->
<!--                <div class="mb-4">-->
<!--&lt;!&ndash;                  <div class="font-weight-normal">&ndash;&gt;-->
<!--&lt;!&ndash;                    <strong>{{ comment.creator.title }}</strong> @{{ comment.creationDate }}&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->

<!--&lt;!&ndash;                  <div>{{ comment.description }}</div>&ndash;&gt;-->
<!--                  <div>{{ comment.from }}</div>-->
<!--                </div>-->
<!--              </v-timeline-item>-->
<!--            </v-timeline>-->
<!--          </v-expansion-panel-text>-->
<!--        </v-expansion-panel>-->
<!--      </v-expansion-panels>-->
<!--      <div v-else class="mx-auto my-12 post"> No comments available </div>-->
<!--    </VCardText>-->

    <div>
      <font-awesome-icon icon="fa-thumbs-up" /> 231 {{ post.likes }}
    </div>

    <div>
       {{ post.comments.length }} {{ this.$t('comments') }}
    </div>

    <br>
    <v-divider />
    <br>

    <VCardActions>

      <BigActionBtn
        icon="fa-thumbs-up"
        :label="$t('Like!')"
        color="primary"
        @click="like"
      />
      <BigActionBtn
        icon="fa-comment"
        :label="$t('Comment')"
        color="warning"
        @click="comment"
      />

      <span :style="{display: 'inline-flex', justifyContent: 'flex-end', width: '100%'}">
        <slot :style="{display: 'flex', justifyContent: 'flex-end'}" name="actions"/>
      </span>

    </VCardActions>
  </VCard>
</template>
<script>
import BigActionBtn from "@/components/BigActionBtn.vue";

export default {
  components: {BigActionBtn},
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
    async imgShow(photo) {

         const photoObj = await this.$store.fetchFile(photo.file.id)
         const b64 = await this.convertToBase64(photoObj.data).then(base64 => {
           return base64
         }).catch(error => {
           console.error('Error:', error);
         });

         const imageSlot = document.getElementById(photo.id);
         const image = document.createElement("img");
         image.id = "id";
         image.width = 700
         image.height = 500
         image.src = b64
         imageSlot.appendChild(image);

    },
    freezeCard(){
      this.loading = true
      setTimeout(() => (this.loading = false), 2000)
    },
    like () {
      this.freezeCard()
    },
    comment () {
      this.freezeCard()
    },
  }
}
</script>

<style>

.no-photo-post{
  font-size: larger;
}

</style>

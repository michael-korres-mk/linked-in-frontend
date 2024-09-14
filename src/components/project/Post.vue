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

    <PostPhotos :post="post" />

    <v-divider /><br>

    <div>
      <font-awesome-icon icon="fa-thumbs-up" /> {{ getPostLikes()  }}
    </div>

    <div>
       {{ post.comments.length }} {{ this.$t('comments') }}
    </div>

    <br>
    <v-divider />
    <br>

    <VDialog
      v-model="commentsDialog"
      :width="maxWidth"
      scrollable
    >
      <VCard>
        <VCardTitle class="dialog-header">
          <span class="dialog-title">{{ $t('Comments') }}</span>
        </VCardTitle>

        <VDivider />

        <VCardText>
          <CommentsTimeline :comments="post.comments" />
        </VCardText>

        <VDivider />

        <VCardActions :style="{backgroundColor:'#EEEEEE'}">
          <VContainer fluid>
            <VRow>
              <VCol>
                <div class="text-subtitle-1">Add a comment</div>

                <v-text-field
                  :loading="loading"
                  :disabled="sending"
                  v-model="commentText"
                  density="compact"
                  variant="solo"
                  hide-details
                  single-line
                >

                  <template #append-inner>
                    <VBtn
                      v-if="!sending"
                      variant="plain"
                      :ripple="false"
                      :readonly="this.commentText === ''"
                      @mouseover="isHovered = true"
                      @mouseleave="isHovered = false"
                      @click="sendComment"
                    >
                      <FontAwesomeIcon :icon="(!isHovered || commentText === '')?'far fa-paper-plane' : 'fas fa-paper-plane'"/>
                    </VBtn>
                    <v-progress-circular
                      v-else
                      indeterminate
                      :size="22"
                      :width="4"
                    />
                  </template>
                </v-text-field>
              </VCol>
            </VRow>
          </VContainer>
        </VCardActions>
      </VCard>
    </VDialog>

    <VCardActions>

      <BigActionBtn
        icon="fa-thumbs-up"
        :label="(liked)? 'Liked!' : 'Like!'"
        :color="(liked)? 'success' : 'primary'"
        @click="like"
      />
      <BigActionBtn
        icon="fa-comment"
        :label="'Comment'"
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
import useGenericEntityStore from "@/stores/entity";
import {defineStore} from "pinia";
import CommentsTimeline from "@/components/project/CommentsTimeline.vue";
import PostPhotos from "@/components/project/PostPhotos.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  components: {FontAwesomeIcon, PostPhotos, CommentsTimeline, BigActionBtn},
  props: {
    title: {
      type: String,
      default: 'foo'
    },
    post:{
      type: Object,
      default: {}
    },
    maxWidth: {
      type: String,
      default: '1200px',
    },
  },

  data: () => ({
    loading: false,
    commentsDialog: false,
    commentText:'',
    isHovered:false,
    sending:false,
    valid: false,
    entityStore: defineStore(
      'posts',
      useGenericEntityStore('posts'),
    )(),
    likeStore: defineStore(
      'posts/like',
      useGenericEntityStore('posts/like'),
    )(),
    commentStore: defineStore(
      'posts/comment',
      useGenericEntityStore('posts/comment'),
    )(),
  }),
  computed:{
    liked() {
      return this.post.likes.some(like => like.creator.id === this.$store.userData.id && like.creationDate != null);
    },
  },
  methods:{
    freezeComment(){
      this.sending = true
      // setTimeout(() => (this.loading = false), 2000)
    },
    unfreezeComment(){
      this.sending = false
    },
    freezeCard(){
      this.loading = true
      // setTimeout(() => (this.loading = false), 2000)
    },
    unfreezeCard(){
      this.loading = false
    },
    getPostLikes(){
      return this.post.likes.filter(l => l.creationDate != null).length
    },
    async like () {
      this.freezeCard()
      await this.likeStore.toggleEnabled({...this.post,enabled:this.liked})
      let updatedPost = await this.entityStore.getEntity(this.post.id)
      this.$emit('update-post', updatedPost);
      this.unfreezeCard()
    },
    async sendComment(){
      this.freezeComment()
      await this.commentStore.saveEntity({postId:this.post.id,description:this.commentText},false)
      let updatedPost = await this.entityStore.getEntity(this.post.id)
      this.$emit('update-post', updatedPost);
      this.commentText = ''
      this.unfreezeComment()
    },
    comment () {
      this.open()
    },
    open(){
      this.commentsDialog = true
    },
    close(){
      this.commentsDialog = false
    }
  }
}
</script>

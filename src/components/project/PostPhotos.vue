<template>
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
        v-for="(photo, index) in post.photos"
        :key="photo.file.id"
        cover
      >
        <VImg v-if="getElementType(photo.file) === 'img'" :src="base64Files[index]" :height="'100%'" />
        <video v-else-if="getElementType(photo.file) === 'video'" :src="base64Files[index]" :height="'100%'" controls autoplay muted loop />
        <div v-else-if="getElementType(photo.file) === 'audio'" class="card-body d-flex bg-red h-100">
          <audio id="player" :src="base64Files[index]" autoplay muted controls/>
<!--          <div>-->
<!--            <VBtn @click="() => document.getElementById('player').play()">Play</VBtn>-->
<!--            <VBtn @click="() => document.getElementById('player').pause()">Pause</VBtn>-->
<!--            <VBtn @click="() => document.getElementById('player').volume += 0.1">Vol +</VBtn>-->
<!--            <VBtn @click="() => document.getElementById('player').volume -= 0.1">Vol -</VBtn>-->
<!--          </div>-->
        </div>

      </v-carousel-item>
    </v-carousel>
  </div>
  <div v-else class="no-photo-post">
    {{ post.description }}
  </div>
</template>

<script>
export default {
  name: "PostPhotos",
  data(){
    return {
      base64Files: []
    }
  },
  props: {
    post:{
      type: Object,
      required: true
    },
    imgWidth:{
      type: String,
      default: '700'
    },
    imgHeight:{
      type: String,
      default: '500'
    }
  },
  mounted() {
    this.preloadFiles(); // Call the preload function when the component is mounted
  },
  methods:{
    async preloadFiles() {
      // Preload images and store the base64 strings in the base64Files array
      for (let i = 0; i < this.post.photos.length; i++) {
        const photo = this.post.photos[i];
        const base64 = await this.imgShow(photo.file);
        this.base64Files.push(base64); // Cache base64 string
      }
    },
  }
}
</script>


<style>

.no-photo-post{
  font-size: larger;
}

</style>

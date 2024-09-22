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
</template>

<script>
export default {
  name: "PostPhotos",
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
      image.width = this.imgWidth
      image.height = this.imgHeight
      image.src = b64
      imageSlot.appendChild(image);

    },
  }
}
</script>


<style>

.no-photo-post{
  font-size: larger;
}

</style>

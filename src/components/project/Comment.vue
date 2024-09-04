<script>
export default {
  name: "Comment",
  props: {
    comment:{
      type: Object,
      required: true
    }
  },
}
</script>

<template>
  <v-avatar icon="$vuetify" image="https://cdn.vuetifyjs.com/images/cards/cooking.png" size="48"></v-avatar>
  <div class="mb-4">
    <div class="font-weight-normal">
      <strong>{{ comment.creator.title }}</strong> @{{ comment.creationDate }}
    </div>

    <div>{{ comment.description }}</div>
    <div>{{ comment.from }}</div>
  </div>
</template>

<style scoped lang="scss">

</style>

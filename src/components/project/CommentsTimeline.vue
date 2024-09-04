<script>
export default {
  name: "CommentsDialog",
  props: {
    comments:{
      type: Array,
      required: true
    }
  },
}
</script>

<template>

  <v-timeline align="start" density="compact">
    <v-timeline-item
      v-for="(comment, index) in comments" :key="index"
      :dot-color="comment.color"
      size="x-small"
    >
      <Comment :comment="comment" />
      <VDivider v-if="index < comments.length - 1"/>
    </v-timeline-item>
  </v-timeline>

</template>

<style scoped lang="scss">

</style>

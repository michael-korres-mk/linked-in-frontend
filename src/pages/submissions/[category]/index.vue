<script setup>
import CircularsPlainTable from '@/components/project/CircularsPlainTable.vue'
import SlideGroup from '@/components/project/SlideGroup.vue'
import SubmissionsList from '@/components/project/SubmissionsList.vue'

definePage({
  meta: {
    authority: 'submissions',
  },
})
</script>

<template>
  <h1 class="text-center text-info mb-0">
    {{ pageTitle }}
  </h1>
  <div v-if="category === 'mysubmissions'">
    <SlideGroup class="mb-10" />
  </div>
  <div v-else>
    <CircularsPlainTable
      :key="category"
      :custom-query="{category: categoryToId}"
      @submissionsDialogCreate="submissionsDialogCreate"
    />
  </div>
  <SubmissionsList
    :key="category"
    ref="submissionsList"
    :custom-query="{category: categoryToId}"
  />
</template>


<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    pageTitle() {
      return this.$t(`${this.category}(h1)`)
    },
    category() {
      return this.$route.params.category

      // return this.categoryToId
    },
  },

  methods: {
    submissionsDialogCreate(payload) {
      // alert('submissionsDialogCreate' + item.id)
      // const payload = item

      this.$refs.submissionsList.openCreateDialog(payload)

      // this.$router.push({
      //   name: 'submissions-category-create',
      //   params: { category: this.category },
      // })
    },
  },
}
</script>

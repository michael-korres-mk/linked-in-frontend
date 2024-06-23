<template>
  <VSlideGroup
    v-model="model"
    class="bg-white mt-5"
    selected-class="bg-success"
    show-arrows="always"
  >
    <template #prev>
      <FontAwesomeIcon
        :icon="['fas', 'caret-left']"
        class="font-50 text-primary"
      />
    </template>
    <template #next>
      <FontAwesomeIcon
        :icon="['fas', 'caret-right']"
        class="font-50 text-primary"
      />
    </template>
    <VSlideGroupItem
      v-for="item in items"
      :key="item.title"
    >
      <VCard
        class="mx-auto bg-primary rounded-md outer-card ms-1 me-1 "
        max-width="235"
        rounded-md
        hover
        max-height="400"
        elevation="0"
      >
        <div class="fill-height inner-card d-flex flex-column">
          <VCardItem>
            <VCardTitle class="card-title">
              {{ item.title }}
            </VCardTitle>
            <VCardSubtitle class="card-title-border" />
          </VCardItem>
  
          <VCardText class="text-center pb-10 flex-grow-1">
            <!-- flex-grow-1 to ensure it takes up available space -->
            {{ item.description }}
          </VCardText>
  
          <VCardActions class="d-flex mb-0 mt-auto">
            <!-- mt-auto to push to bottom -->
            <VBtn
              variant="flat"
              color="white"
              class="text-primary"
              rounded="sm"
              block
              @click="redirect(item.category)"
            >
              Περισσότερα
            </VBtn>
          </VCardActions>
        </div>
      </VCard>
    </VSlideGroupItem>
  </VSlideGroup>
</template>

<script>
export default {
  data() {
    return {
      model: null,
      reveal: true,
      items: [
        { 
          id: 1, 
          category: 'transfer',
          title: 'Αιτήσεις Μετάθεσης', 
          description: 'Δείτε τις εγκυκλίους του τρέχοντος Σχολικού Έτους που αφορούν στις Μεταθέσεις των Εκπαιδευτικών και υποβάλετε την αίτηση σας.', 
        },
        { 
          id: 2, 
          category: 'secondment',
          title: 'Αιτήσεις Απόσπασης', 
          description: 'Δείτε τις εγκυκλίους του τρέχοντος Σχολικού Έτους που αφορούν στις Αποσπάσεις των Εκπαιδευτικών και υποβάλετε την αίτηση σας.', 
        },
        { 
          id: 3, 
          category: 'reassignment',
          title: 'Αιτήσεις Μετάταξης', 
          description: 'Δείτε τις εγκυκλίους του τρέχοντος Σχολικού Έτους που αφορούν στις Μετατάξεις των Εκπαιδευτικών και υποβάλετε την αίτηση σας.', 
        },
        { 
          id: 4, 
          category: 'registry',
          title: 'Αιτήσεις Μητρώου', 
          description: 'Δείτε τις εγκυκλίους του τρέχοντος Σχολικού Έτους που αφορούν στα Μητρώα των Εκπαιδευτικών και υποβάλετε την αίτηση σας.', 
        },
        { 
          id: 5, 
          category: 'other',
          title: 'Λοιπές Αιτήσεις', 
          description: 'Δείτε τις εγκυκλίους του τρέχοντος Σχολικού Έτους που αφορούν στις Λοιπές αιτήσεις των Εκπαιδευτικών και υποβάλετε την αίτηση σας.', 
        },
      ],
    }
  },
  methods: {
    redirect(param) {
      this.$router.push({
        name: 'submissions-category',
        params: { category: param },
      })

    },
  },
}
</script>

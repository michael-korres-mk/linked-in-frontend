<template>
  <div class="rest-container">
<!--    <div class="search-container mt-4 mb-3 px-3">-->
<!--      <FormField-->
<!--        :form-field="searchField"-->
<!--        fluid-layout-->
<!--        @fieldUpdated="setItemCode"-->
<!--      />-->
<!--    </div>-->
    <VCard>
      <VTabs
        v-model="tab"
        color="#1f4e79"
        class="card-header"
        fixed-tabs
      >
        <VTab
          v-for="(item, index) in tabs"
          :key="index"
          :value="index"
        >
          {{ item }}
        </VTab>
      </VTabs>
      <VCardText>
        <VWindow v-model="tab">
          <VWindowItem :value="0">
            <hr />
            <ChatContact />
          </VWindowItem>
          <VWindowItem :value="1">
            <hr />
            <ChatRecent />
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </div>
</template>

<script>
import FormField from '@/components/entity/FormField.vue'
import ChatContact from './ChatContact.vue'
import ChatRecent from './ChatRecent.vue'
export default {
  components: {
    FormField,
    ChatContact,
    ChatRecent
  },
  data() {
    return {
      tab: 0,
    }
  },
  computed: {
    tabs() {
      return [this.$t('Contacts'),this.$t('Chats')]
    },
    // searchField() {
    //   return {
    //     id: 'contactTypeahead',
    //     type: 'autocomplete',
    //     placeholder: 'Αναζήτηση...',
    //     filter: (itemTitle, query, item) => {
    //       return item.value !== this.user.userId
    //     },
    //     config: {
    //       endpoint: 'vessels/vesselcaptain-autosuggest',
    //     }
    //   }
    // },
  },
  methods: {
    // setItemCode(captain) {
    //   this.$router.push({
    //     name: 'chat-history',
    //     params: { id: captain.value.id }
    //   })
    // },
  }
}
</script>

<template>
  <h1 class="text-center text-info">
    {{ $t('Chats') }}
  </h1>
  <div class="card-wrapper bg-global-primary">
    <div class="card-body text-center">
    <VCard>
      <VCardText>
        <VContainer fluid class="d-flex">
          <VCol :cols="4">
            <Chats :chats="chats" @chatClicked="chatClicked"/>
          </VCol>
          <VCol :cols="8">
            <ChatMessages :chat="chats[clicked]"/>
          </VCol>
        </VContainer>
      </VCardText>
    </VCard>
    </div>
  </div>
</template>

<script>
import FormField from '@/components/entity/FormField.vue'
import Chats from "@/pages/chats/Chats.vue";
import ChatMessages from "@/pages/chats/ChatMessages.vue";
export default {
  components: {
    ChatMessages,
    Chats,
    FormField,
  },
  mounted(){
    this.isLoading = false
  },
  data() {
    return {
      clicked: 0,
      isLoading: true,
      chats: [
        {
          connection: {
            recipient: {
              id:1000,
              title: 'Test User'
            }

          },
          lastMessage:{
            createdTimestamp: '2000-01-01T00:00:00.000Z',
            message: 'Test Message'
          },
          messages:[
            {
              sender: { id: 1,title: 'Petros' },
              recipient: { id: 2 },
              createdTimestamp: '2024-09-16T10:00:00',
              text: 'Hello! How are you? #1',
              delivered: true,
              read: false,
            },
            {
              sender: { id: 2,title: this.$store.userData.title },
              recipient: { id: 1 },
              createdTimestamp: '2024-09-17T10:05:00',
              text: 'I am doing great, thanks! How about you? #1',
              delivered: true,
              read: true,
            },
            {
              sender: { id: 1,title: 'Petros' },
              recipient: { id: 2 },
              createdTimestamp: '2024-09-17T10:10:00',
              text: 'I am good too! Let’s catch up later. #1',
              delivered: true,
              read: false,
            },
            {
              sender: { id: 2,title: this.$store.userData.title },
              recipient: { id: 1 },
              createdTimestamp: '2024-09-17T10:05:00',
              text: 'I am doing great, thanks! How about you? #1',
              delivered: true,
              read: true,
            },
            {
              sender: { id: 1,title: 'Petros' },
              recipient: { id: 2 },
              createdTimestamp: '2024-09-17T10:10:00',
              text: 'I am good too! Let’s catch up later. #1',
              delivered: true,
              read: false,
            },

          ]
        },
        {
          connection: {
            recipient: {
              id:1000,
              title: 'Test User'
            }

          },
          lastMessage:{
            createdTimestamp: '2000-01-01T00:00:00.000Z',
            message: 'Test Message',
          },
          messages:[
            {
              sender: { id: 1,title: 'Petros' },
              recipient: { id: 2 },
              createdTimestamp: '2024-09-16T10:00:00',
              text: 'Hello! How are you? #2',
              delivered: true,
              read: false,
            },
            {
              sender: { id: 2,title: this.$store.userData.title },
              recipient: { id: 1 },
              createdTimestamp: '2024-09-17T10:05:00',
              text: 'I am doing great, thanks! How about you? #2',
              delivered: true,
              read: true,
            },
          ]
        },
        {
          connection: {
            recipient: {
              id:1000,
              title: 'Test User'
            }

          },
          lastMessage:{
            createdTimestamp: '2000-01-01T00:00:00.000Z',
            message: 'Test Message',
          },
          messages:[
            {
              sender: { id: 1,title: 'Petros' },
              recipient: { id: 2 },
              createdTimestamp: '2024-09-16T10:00:00',
              text: 'Hello! How are you? #3',
              delivered: true,
              read: false,
            },
            {
              sender: { id: 2,title: this.$store.userData.title },
              recipient: { id: 1 },
              createdTimestamp: '2024-09-17T10:05:00',
              text: 'I am doing great, thanks! How about you? #3',
              delivered: true,
              read: true,
            },
            {
              sender: { id: 1,title: 'Petros' },
              recipient: { id: 2 },
              createdTimestamp: '2024-09-17T10:10:00',
              text: 'I am good too! Let’s catch up later. #3',
              delivered: true,
              read: false,
            },
          ]
        },
        {
          connection: {
            recipient: {
              id:1000,
              title: 'Test User'
            }

          },
          lastMessage:{
            createdTimestamp: '2000-01-01T00:00:00.000Z',
            message: 'Test Message'
          }
        },
        {
          connection: {
            recipient: {
              id:1000,
              title: 'Test User'
            }

          },
          lastMessage:{
            createdTimestamp: '2000-01-01T00:00:00.000Z',
            message: 'Test Message'
          }
        },
        {
          connection: {
            recipient: {
              id:1000,
              title: 'Test User'
            }

          },
          lastMessage:{
            createdTimestamp: '2000-01-01T00:00:00.000Z',
            message: 'Test Message'
          }
        },
        {
          connection: {
            recipient: {
              id:1000,
              title: 'Test User'
            }

          },
          lastMessage:{
            createdTimestamp: '2000-01-01T00:00:00.000Z',
            message: 'Test Message'
          }
        },
        {
          connection: {
            recipient: {
              id:1000,
              title: 'Test User'
            }

          },
          lastMessage:{
            createdTimestamp: '2000-01-01T00:00:00.000Z',
            message: 'Test Message'
          }
        },
        {
          connection: {
            recipient: {
              id:1000,
              title: 'Test User'
            }

          },
          lastMessage:{
            createdTimestamp: '2000-01-01T00:00:00.000Z',
            message: 'Test Message'
          }
        },
      ],
    }
  },
  computed: {
    // searchField() {
    //   return {
    //     id: 'connectionTypeahead',
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
    chatClicked(index){
      this.clicked = index
      // this.$router.push({
        //     name: 'chat-messages',
        //     params: { id: key }
        //   })
    }
  }
}
</script>

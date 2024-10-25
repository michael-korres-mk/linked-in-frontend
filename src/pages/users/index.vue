<script setup>
import editmixins from "@/mixins/entityedit.js"
</script>

<template>
    <DataTable
      ref="list"
      :config="config"
      :columns="columns"
      :filters="filters"
      :selections="selections"
      :show-select="allowEdit"
      :custom-query="customQuery"
      :formatted-columns="formattedColumns"
      :single-edit="false"
      :initial-filter-values="initialFilterValues"
      :is-selectable="isSelectable"
      authority="ess"
      multi-select
      hide-edit
      details-view
      hide-insert-btn
      hide-table-actions
      @itemSelected="handleSelectedChange"
    >
      <template #extra-button>
        <BigActionBtn
          v-if="!allowEdit"
          color="primary"
          icon="fa-download"
          :label="'Download User Data'"
          @click="editModeSet(true)"
        />
      </template>
    </DataTable>
    <div v-if="allowEdit" class="text-center py-n3">
      <BigActionBtn
        color="primary"
        icon="fa-circle-down"
        :disabled="btnIsDisabled"
        :label="'Add Selected'"
        @click="addUsers"
      />
    </div>
    <div v-if="allowEdit" class="card-wrapper mx-5">

      <div class="card-body d-flex flex-column justify-center">
        <VDataTable
          :headers="headers"
          :items="users"
          items-per-page="-1"
        >
          <template
            v-if="allowEdit"
            #item.actions="{ item }"
          >
            <ActionBtn
              icon="trash-can"
              label="Delete"
              color="error"
              class="text-black"
              @click="deleteItem(item)"
            />
          </template>
        </VDataTable>
        <div>
          <BigActionBtn
            color="secondary"
            icon="fa-xmark"
            :label="'Cancel'"
            @click="editModeSet(false)"
          />
          <BigActionBtn
            color="primary"
            icon="fa-download"
            :disabled="users.length === 0"
            :label="'Download XML'"
            @click="() => downloadUsers(true)"
          />
          <BigActionBtn
            color="primary"
            icon="fa-download"
            :disabled="users.length === 0"
            :label="'Download JSON'"
            @click="() => downloadUsers(false)"
          />
        </div>
      </div>

    </div>
</template>

<script>
import DataTable from "@/components/entity/DataTable.vue";

export default {
  mixins:[editmixins],
  components: {DataTable},
  props: {
    initialUsers: {
      type: Array,
      default: () => [],
    },
    questionnaireId: {
      type: Number,
      default: null,
    },
  },
  emits: ['usersChanged'],
  data() {
    return {
      users: this.initialUsers,
      selections: [],
      filterAboveEmpty: true,
      essFilter: !!this.questionnaireId,
    }
  },
  mounted() {
    this.editModeSet(this.editMode)
  },
  computed: {
    config() {
      return {
        endpoint: 'users/as-list',
        route: 'users',
        title: {
          single: 'User',
          plural: 'Users',
          geniki: 'User(gen)',
        },
      }
    },
    allowEdit(){
      return this.editMode
    },
    customQuery() {
      return {
        questionnaire: this.essFilter ? this.questionnaireId : null,
      }
    },
    initialFilterValues() {
      return {
        ess: !!this.$route.params.id,
      }
    },
    headers() {
      return this.allowEdit
        ? [...this.columns, { key: 'actions', title: this.$t('Actions') }]
        : this.columns
    },
    btnIsDisabled() {
      return !this.selections.length
    },
    userIds() {
      return this.users.map(user => user.id)
    },
    columns() {
      return [
        {
          key: 'id',
          title: this.$t('User Code'),
        },
        {
          key: 'title',
          title: this.$t('User'),
        },
        {
          key: 'enabled',
          title: this.$t('Status'),
        },
      ]
    },
    formattedColumns() {
      return [
        { key: 'title', callback: 'renderTitleUrl',handleClick: this.redirectToUserPage },
      ]
    },
    filters() {
      return [
        {
          id: 'id',
          type: 'number',
          label: this.$t('User Code'),
          colSize: 4,
        },
        {
          id: 'firstName',
          type: 'text',
          label: this.$t('User FirstName'),
          colSize: 4,
        },
        {
          id: 'lastName',
          type: 'text',
          label: this.$t('User LastName'),
          colSize: 4,
        },
        {
          id: 'email',
          type: 'text',
          label: this.$t('Email'),
          colSize: 4,
        },
        {
          id: 'enabled',
          type: 'select',
          label: this.$t('Status'),
          options: this.statusOptions,
          colSize: 4,
        },
      ]
    },
  },
  methods: {
      handleSelectedChange(selectedItems) {
        this.selections = selectedItems
        this.selectedEntity = selectedItems.length ? selectedItems[0] : null
      },
      addUsers() {
        this.users = [
          ...this.users,
          ...this.selections.filter(
            item =>
              !this.userIds.includes(
                item.id,
              ),
          ),
        ]
        // this.$emit('usersChanged', this.users)
        // this.selections = []
      },
      deleteItem(item) {
        this.users.splice(this.users.indexOf(item), 1)
        this.$emit('usersChanged', this.users)
      },
      isSelectable(item){
        return !this.users.some(selection => selection.id === item.id)
      },
      async downloadUsers(xml){

        const fileObj = await this.$store.fetchUsersFile(this.users,xml)

        const link = document.createElement('a')

        link.href = window.URL.createObjectURL(new Blob([fileObj.data]))
        link.setAttribute('download', 'users-list.' + ((xml)? 'xml' : 'json'))
        document.body.appendChild(link)
        link.click()
        // this.downloadingFile = false
      },
    redirectToUserPage(item, itemKey) {
        console.log('bla')
        this.$router.push(`/users/${item.id}?view=1`)
    },
  },
}
</script>

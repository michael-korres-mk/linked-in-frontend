<template>
  <h1 class="text-center text-info">
    {{ entity.title }}
  </h1>
  <div class="card-wrapper bg-global-primary">
    <div class="card-body text-primary d-flex align-items-center">

      <VDialog
        v-model="dialog"
        :max-width="maxWidth"
        persistent
      >
        <template #activator="{ props }">
          <VRow class="d-flex flex-row-reverse my-3">
            <div class="grid grid-cols-2 gap-6 justify-items-end">
              <div>
                <!--
                  <VBtn
                  color="primary"
                  variant="outlined"
                  >
                  Προσθήκη
                  <template #append>
                  <FontAwesomeIcon
                  :icon="['fas', 'file-circle-plus']"
                  class="ms-2 color-orange"
                  />
                  </template>
                  </VBtn>
                -->
                <VBtn
                  v-if="allowEdit && !hideAddButton"
                  v-bind="props"
                  class="btn-eett-blue-outline px-5 mb-0 mx-3"
                  color="primary"
                  variant="outlined"
                  rounded="md"
                  type="button"
                >
                  {{ btnTitle }}
                  <FontAwesomeIcon
                    :icon="['fas', 'circle-plus']"
                    class="ms-5 color-orange"
                  />
                </VBtn>
              </div>
            </div>
          </VRow>
        </template>

        <VCard>
          <VCardTitle class="dialog-header">
            <span class="dialog-title">{{ formTitle }}</span>
          </VCardTitle>
          <VCardText>
            <div class="card-wrapper pb-10 my-5">
              <legend class="legend-title text-center">
                {{ modalLegendTitle }}
              </legend>
              <div class="card-body p-5 m-5">
                <VForm
                  ref="form"
                  v-model="valid"
                  role="edit-form"
                  autocomplete="off"
                >
                  <EntityEditSection
                    :entity="editedItem"
                    :form-fields="formFields"
                    @fieldUpdated="updateItem"
                  />
                </VForm>
              </div>
            </div>
          </VCardText>
          <VCardActions>
            <VRow>
              <VCol
                cols="12"
                class="text-center"
              >
                <VBtn
                  class="px-5"
                  color="secondary"
                  variant="flat"
                  rounded="md"
                  size="large"
                  @click="close"
                >
                  <FontAwesomeIcon
                    icon="close"
                    class="font-size-20 me-5"
                  />
                  {{ $t('Cancel') }}
                </VBtn>

                <VBtn
                  :disabled="!valid"
                  class=" px-5"
                  color="primary"
                  variant="flat"
                  rounded="md"
                  size="large"
                  @click="save"
                >
                  <FontAwesomeIcon
                    icon="save"
                    class="font-size-20 me-5"
                  />
                  {{ $t('Add') }}
                </VBtn>
              </VCol>
            </VRow>
          </VCardActions>
        </VCard>
      </VDialog>

      <EntitySingle
        :key="componentKey"
        :config="config"
        :sections="sections"
        :entity="entity"
        authority="jobs"
        hide-title
        hide-return-button
        hide-edit-button
        hide-cancel-button
        hide-submit-button
        @editModeSet="editModeSet"
      />

      <BigActionBtn
        icon="fa-paper-plane"
        size="x-large"
        :label="(applied)? 'Applied' : 'Apply'"
        :color="'secondary'"
        @click="apply"
      />

    </div>
  </div>
</template>

<script>
import editMixins from '../../../mixins/entityedit'
import {defineStore} from "pinia";
import useGenericEntityStore from "@/stores/entity.js";
import EntitySingle from "@/components/entity/EntitySingle.vue";

export default {
  name: "[id]",
  components: {EntitySingle},
  mixins: [editMixins],
  data() {
    return {
      entity: {},
      dialog: false,
      applied: false,
      entityStore: defineStore('jobs', useGenericEntityStore('jobs'))(),
      editMode: !this.singleEdit,
      componentKey: 0,
    }
  },
  computed: {
    config() {
      return {
        endpoint: 'jobs',
        route: 'jobs',
        title: {
          geniki: 'Αγγελίας',
        },
      }
    },
    sections() {
      return [
        {
          fields: this.formFields,
          title: 'Στοιχεία Αγγελίας',
        },
      ]
    },
    formFields() {
      return [
        {
          id: 'title',
          type: 'text',
          label: this.$t('Title'),
          readonly: true,
          colSize: 12,
        },
        {
          id: 'description',
          type: 'tiptap',
          label: this.$t('Description'),
          readonly: true,
          colSize: 12,
        },
        {
          id: 'workplaceType',
          type: 'select',
          label: this.$t('Workplace Type'),
          readonly: true,
          colSize: 6,
        },
        {
          id: 'employmentType',
          type: 'select',
          label: this.$t('Employment Type'),
          readonly: true,
          colSize: 6,
        },
      ]
    },
  },
  mounted() {
    this.fetchJob()
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  methods: {
    async fetchJob(){
      this.entity = await this.entityStore.getEntity(this.$route.params.id)
    },
    async apply () {

      this.dialog = true

      // this.freezeCard()
      // await this.likeStore.toggleEnabled({...this.post,enabled:this.liked})
      // let updatedPost = await this.entityStore.getEntity(this.post.id)
      // this.$emit('update-post', updatedPost);
      // this.unfreezeCard()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.setDefaultItem()
        this.editedIndex = -1
        this.$emit('closeDialog')
      })
    },
  },
}
</script>


<style scoped lang="scss">

</style>

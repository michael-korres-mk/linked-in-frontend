<template>
  <div v-if="entity && (!formField.dependency || entity[formField.dependency])">
    <div
      class="form-group-field"
      :class="formField.required ? 'required-field' : ''"
    >
      <div
        v-if="formField.label"
        class="text-subtitle-1"
      >
        {{ formField.label }}
      </div>
      <input
        v-if="formField.type === 'hidden'"
        v-model="fieldValue"
        type="hidden"
      />
      <VTextField
        v-else-if="
          formField.type === 'text' ||
          formField.type === 'email' ||
          formField.type === 'number' ||
          formField.type === 'password'
        "
        v-model="fieldValue"
        :type="formField.type"
        :rules="validationRules"
        :autofocus="autofocus"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        :placeholder="formField.placeholder"
        :prepend-inner-icon="formField.icon"
        :prefix="formField.prefix"
        :hint="formField.hint"
        :variant="variant"
        :density="density"
        :class="
          formField.readonly
            ? 'font-weight-bold font-20 text-center'
            : ''
        "
        step="any"
        persistent-hint
      >
        <template
          v-if="formField.detailsView"
          #append
        >
          <DetailsBtn
            v-show="entity[formField.id] || formField.detailsIcon"
            :density="density"      
            :icon="formField.detailsIcon"
            @detailsBtnClicked="detailsBtnClicked"
          />
        </template>
      </VTextField>
      <VSelect
        v-else-if="formField.type === 'select'"
        v-model="fieldValue"
        :return-object="formField.object"
        :rules="validationRules"
        :multiple="formField.multiple"
        :chips="formField.multiple"
        :items="(formField.excludeSelf && entity.id) ? formField.options.filter(option => option.id != entity.id) : formField.options"
        :hint="formField.hint"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        :item-value="formField.itemValue || 'id'"
        :density="density"
        :prepend-inner-icon="formField.icon"
        :no-data-text="formField.noDataText"
        :clearable="formField.readonly ? false : formField.clearable"
        :placeholder="formField.placeholder || $t('SELECT_OPTION')"
        item-title="title"
        item-color="white"
        persistent-hint
        @update:modelValue="dropdownClick(formField.id)"
      >
        <template
          v-if="
            formField.multiple &&
              formField?.options?.length &&
              !formField.hideAllSelected
          "
          #prepend-item
        >
          <VListItem
            :title="$t('Select All')"
            @click="toggleSelectAll"
          >
            <template #prepend>
              <VCheckboxBtn
                v-model="isAllSelected"
                color="primary"
              />
            </template>
          </VListItem>

          <VDivider class="mt-2" />
        </template>
        <template
          v-if="formField.detailsView"
          #append
        >
          <DetailsBtn
            v-show="entity[formField.id] || formField.detailsIcon"
            :density="density"
            :icon="formField.detailsIcon"
            @detailsBtnClicked="detailsBtnClicked"
          />
        </template>
      </VSelect>
      <VCombobox
        v-else-if="formField.type === 'combobox'"
        v-model="fieldValue"
        :return-object="formField.object"
        :rules="validationRules"
        :multiple="formField.multiple"
        :chips="formField.multiple"
        :items="formField.options"
        :hint="formField.hint"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        :item-value="formField.itemValue || 'id'"
        :density="density"
        :prepend-inner-icon="formField.icon"
        :no-data-text="formField.noDataText"
        :placeholder="$t('SELECT_OPTION')"
        item-title="title"
        small-chips
        persistent-hint
        clearable
      />

      <VDateInput
        v-else-if="formField.type === 'date'"
        v-model="fieldValue"
        :hint="formField.hint"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        :variant="variant"
        :density="density"
        color="primary"
        placeholder="ηη/μμ/εεεε"
        size="10"
        persistent-hint
        :rules="validationRules"
        :min="formField.minDate ? isoDateOnlyTrimmed(formField.minDate) : ''"
        :max="formField.maxDate ? isoDateOnlyTrimmed(formField.maxDate) : ''"
        :id.attr="formField.id"
        :name="formField.id"
        v-bind="{
            'aria-labelledby': formField.id,
            'aria-describedby': formField.id,
            'label': formField.id,
          }"
      />

      <VTextField
        v-else-if="
          formField.type === 'date' ||
            formField.type === 'datetime-local' ||
            formField.type === 'time'
        "
        v-model="fieldValue"
        :hint="formField.hint"
        :type="formField.type"
        :rules="validationRules"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        :variant="variant"
        :density="density"
        :min="formField.minDate ? isoDateOnlyTrimmed(formField.minDate) : ''"
        :max="formField.maxDate ? isoDateOnlyTrimmed(formField.maxDate) : ''"
        locale="el"
        persistent-hint
      />
      <VTextarea
        v-else-if="formField.type === 'textarea'"
        v-model="fieldValue"
        :rules="validationRules"
        :hint="formField.hint"
        :rows="formField.rows ? formField.rows : 2"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        :variant="variant"
        :class="formField.class"
        persistent-hint
      />
      <VTextField
        v-else-if="formField.type === 'password'"
        v-model="fieldValue"
        :type="isPasswordVisible ? 'text' : 'password'"
        :rules="validationRules"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        :placeholder="formField.placeholder"
        :hint="formField.hint"
        :variant="variant"
        :density="density"
        :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
        @click:appendInner="isPasswordVisible = !isPasswordVisible"
      />
      <div v-else-if="formField.type === 'tiptap'">
        <div
          v-if="formField.disabled"
          class="tiptap-disabled"
          v-html="fieldValue"
        />
        <TiptapEditor
          v-else
          v-model="fieldValue"
        />
      </div>
      <VSwitch
        v-else-if="formField.type === 'checkbox'"
        v-model="fieldValue"
        :rules="validationRules"
        :label="formField.optionLabel"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        :variant="variant"
        @update:modelValue="checkboxClick(formField.id)"
      />
      <VCheckbox
        v-else-if="formField.type === 'checkboxplain'"
        v-model="fieldValue"
        :rules="validationRules"
        :label="formField.optionLabel"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        :variant="variant"
        @update:modelValue="checkboxClick(formField.id)"
      />
      <VCheckbox
        v-for="option in formField.options"
        v-else-if="formField.type === 'checkboxgroup'"
        v-bind="field"
        :key="option.name"
        :value="entity[option.name]"
        :label="option.name"
        :variant="variant"
      />
      <VRadioGroup
        v-else-if="formField.type === 'radio'"
        v-model="fieldValue"
        :options="formField.options"
        :disabled="formField.disabled"
      >
        <VRadio
          v-for="option in formField.options"
          :key="option.id"
          :label="option.title"
          :value="option.id"
          :disabled="!!option.disabledField"
        />
      </VRadioGroup>
      <VBtnToggle
        v-else-if="formField.type === 'radiobtn'"
        v-model="fieldValue"
        variant="flat"
        size="large"
        class="mb-5"
        mandatory
        group
      >
        <VBtn
          v-for="option in formField.options"
          :key="option.value"
          :value="option.value"
          :disabled="
            formField.disabledField ? option[formField.disabledField] : false
          "
        >
          {{ option.text }}
        </VBtn>
      </VBtnToggle>
      <VAutocomplete
        v-else-if="formField.type === 'autocomplete'"
        v-model="fieldValue"
        v-debounce:300ms="autocomplete"
        :return-object="formField.object"
        :loading="autocompleteLoading"
        :multiple="formField.multiple"
        :placeholder="formField.placeholder"
        :items="formField.options || autocompleteItems"
        :item-title="formField.itemTitle || 'title'"
        :item-value="formField.itemValue || 'id'"
        :custom-filter="formField.filter || autocompleteFilter"
        :rules="validationRules"
        :density="density"
        :variant="variant"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        :auto-select-first="formField.autoSelect || false"
        hide-no-data
        hide-details
        clearable
      />
      <VFileInput
        v-else-if="formField.type === 'file'"
        v-model="fieldValue"
        :rules="validationRules"
        :accept="`.${formField.filetype}`"
        :multiple="false"
        :hint="`Μέγιστο μέγεθος αρχείου ${formField.filesize}MB σε μορφή .${formField.filetype}`"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        :density="density"
        :loading="uploading"
        :variant="variant"
        persistent-hint
        show-size
        class="mb-4"
        label="Επιλογή αρχείου"
        @update:modelValue="handleFileChange"
      >
        <template
          v-if="fieldValue"
          #append
        >
          <a
            href="javascript:void(0)"
            @click="downloadFile(entity.uploads[formField.id])"
          >
            <FontAwesomeIcon
              icon="fa-download"
              class="linked-in-!-font-size-19 font-size-19"
            />
          </a>
        </template>
      </VFileInput>
      <CurrencyInput
        v-else-if="formField.type === 'currency'"
        v-model="fieldValue"
        :rules="validationRules"
        :hint="formField.hint"
        :options="{ currency: 'EUR', locale: 'de-DE', variant }"
        :readonly="formField.readonly"
        :disabled="formField.disabled"
        persistent-hint
      />
    </div>
  </div>
</template>

<script>
import { vueDebounce } from 'vue-debounce'
import formMixins from '../../mixins/forms'
import CurrencyInput from './CurrencyInput.vue'
import DetailsBtn from './DetailsBtn.vue'
import TiptapEditor from './TiptapEditor.vue'

export default {
  components: { DetailsBtn, CurrencyInput, TiptapEditor },
  directives: {
    debounce: vueDebounce({ lock: true }),
  },
  mixins: [formMixins],
  props: {
    entity: {
      type: Object,
      default: () => ({}),
    },
    formField: {
      type: Object,
      required: true,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    checkboxClick: {
      type: Function,
      default: () => {},
    },
    dropdownClick: {
      type: Function,
      default: () => {},
    },
    idSuffix: {
      type: String,
      default: '',
    },
    isFilter: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['fieldUpdated', 'detailsBtnClicked'],
  data() {
    return {
      modalShow: false,
      uploading: false,
      isPasswordVisible: false,
      autocompleteLoading: false,
      autocompleteItems: [],
    }
  },
  computed: {
    fieldValue: {
      get() {
        if (this.entity) {
          let value = this.formField.parent
            ? this.entity[this.formField.parent][this.formField.id]
            : this.entity[this.formField.id]

          if (this.formField.type === 'date' && value) {
            value = new Date(value)
          }

          return value
        }

        return null
      },
      set(val) {
        if (this.formField.type === 'date') {
          val = this.isoDateOnlyTrimmed(val)
        }
        this.emitField(this.formField.parent, val)
      },
    },
    density() {
      return this.formField.density || 'compact'
    },
    validationRules() {
      const rules = []
      if (this.formField.rules) {
        this.formField.rules.forEach(rule => {
          switch (rule) {
            case 'filesize':
            case 'minvalue':
            case 'maxvalue':
            case 'condition':
              rules.push(
                this.rules[rule](this.fieldValue, this.formField[rule]),
              )
              break
            default:
              rules.push(this.rules[rule])
              break
          }
        })
      }
      if (
        this.formField.required &&
        (!this.formField.dependency || this.entity[this.formField.dependency])
      ) {
        rules.push(this.rules.required)
      }

      return rules
    },
    fieldId() {
      return this.formField.id + this.idSuffix
    },
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    autocompleteConfig() {
      const defaultConfig = {
        length: 2,
        parameter: 'searchquery',
        prependPath: import.meta.env.VITE_CORE_API_PATH,
      }

      if (this.formField.config) {
        return { ...defaultConfig, ...this.formField.config }
      }

      return defaultConfig
    },
    variant() {
      return this.formField.variant || 'outlined'
    },
    isAllSelected() {
      return (
        this.fieldValue &&
        this.formField.options &&
        this.fieldValue.length === this.formField.options.length
      )
    },
  },
  methods: {
    toggleSelectAll() {
      if (!this.fieldValue || !Array.isArray(this.fieldValue)) {
        this.fieldValue = []
      }

      this.fieldValue = this.isAllSelected ? [] : [...this.formField.options]
    },
    emitField(parent, value) {
      this.$emit('fieldUpdated', {
        id: this.formField.id,
        type: this.formField.type,
        parent: parent,
        value: value,
      })
    },
    detailsBtnClicked() {
      this.$emit('detailsBtnClicked', this.formField.id)
    },
    async handleFileChange() {
      let file = null
      if (this.fieldValue) {
        file = this.fieldValue.length ? this.fieldValue[0] : this.fieldValue
        this.uploading = true
        file = await this.$store.uploadFile(file, file.name)
        this.uploading = false
      }
      this.emitField(null, file)
    },
    async autocomplete(val) {
      if (
        this.autocompleteConfig.endpoint &&
        val.length > this.autocompleteConfig.length
      ) {
        this.autocompleteLoading = 'primary'

        this.autocompleteItems = await this.$store.getSearchItems(
          this.autocompleteConfig.endpoint,
          this.autocompleteConfig.parameter,
          val,
          this.autocompleteConfig.prependPath,
        )
        this.autocompleteLoading = false
      }
    },
    autocompleteFilter(value, query, item) {
      return item.title
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLocaleLowerCase()
        .indexOf(
          query
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .toLocaleLowerCase(),
        )
    },
  },
}
</script>

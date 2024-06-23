<template>
  <VTextField
    ref="inputRef"
    v-model="formattedValue"
    type="text"
  />
</template>

<script>
import { watch } from 'vue'
import { useCurrencyInput } from 'vue-currency-input'

export default {
  name: 'CurrencyInput',
  props: {
    modelValue: Number,
    options: Object,
  },
  setup(props) {
    const { inputRef, formattedValue, setValue } = useCurrencyInput(
      props.options,
    )

    watch(
      () => props.modelValue,
      value => {
        setValue(value)
      },
    )

    return { inputRef, formattedValue }
  },
}
</script>

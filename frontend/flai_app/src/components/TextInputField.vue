<template>
  <div :class="componentClass ?? 'default-labeled-input'">
    <label :for="labelName" class="body-medium">
      <div v-if="labelName" class="label">{{ labelName }}</div>
    </label>
    <input
      :value="modelValue"
      :type="customType ? customType : 'text'"
      :name="labelName"
      :placeholder="placeholder"
      :class="`${elementClass} ${validationWrong ? 'wrong' : ''}`"
      :step="timeStep"
      :disabled="disabled"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  labelName?: string
  placeholder: string
  elementClass: string
  componentClass?: string
  customType?: string
  timeStep?: number
  modelValue: string | number | undefined
  validationWrong?: boolean
  disabled?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const onInput = (e: Event): void => {
  // emit is placed in method so that validation for input value can be added
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<style lang="scss">
@import '@/assets/scss/components/_input_field.scss';
</style>

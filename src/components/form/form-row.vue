<template>
  <div class="ui-form-row">
    <div class="ui-form-row__inner">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UiFormRow',
  inject: ['elForm']
}
</script>

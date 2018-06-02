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
<style>
.ui-form-row{
  margin-left: -4%;
  margin-right: -4%;
  .ui-form-row__inner{
    display: table;
    box-sizing: border-box;
    width: 100%;
  }
}
</style>

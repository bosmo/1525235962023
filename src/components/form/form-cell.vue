<template>
  <div class="ui-form-cell">
    <el-form-item v-bind="$props">
      <slot></slot>
    </el-form-item>
  </div>
</template>
<script>
import {
  FormItem
} from 'element-ui'

export default {
  name: 'UiFormCell',
  props: {
    label: String,
    labelWidth: String,
    prop: String
  },
  components: {
    ElFormItem: FormItem
  },
  inject: ['elForm']
}
</script>
<style lang="less">
.ui-form-cell{
  display: table-cell;
  padding: 0 2%;
  &:first-child{
    padding-left: 4%;
  }
  &:last-child{
    padding-right: 4%;
  }
}
</style>

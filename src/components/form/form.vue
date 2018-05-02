<template>
  <el-form ref="form" class="ui-form" v-bind="$props">
    <slot></slot>
  </el-form>
</template>
<script>
import {
  Form
} from 'element-ui'
export default {
  name: 'UiForm',
  components: {
    ElForm: Form
  },
  provide () {
    return {
      UiForm: this
    }
  },
  props: {
    labelWidth: String,
    rules: Object,
    model: Object
  },
  methods: {
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((result) => {
          if (result === true) {
            resolve()
          } else {
            reject()
          }
        })
      })
    }
  }
}
</script>

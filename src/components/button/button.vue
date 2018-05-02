<template>
  <el-button v-bind="$props" v-on="$listeners" @click="handleClick"><slot></slot></el-button>
</template>
<script>
import {
  Button
} from 'element-ui'

export default {
  name: 'UiButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    nativeType: String,
    loading: Boolean,
    disabled: Boolean,
    autofocus: Boolean
  },
  inject: {
    uiDialog: {
      default: ''
    }
  },
  components: {
    ElButton: Button
  },
  methods: {
    handleClick () {
      if (this.uiDialog) {
        this.uiDialog.$emit('dialog-button-click', {
          name: this.$attrs.name
        })
      }
    }
  }
}
</script>

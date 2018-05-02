<template>
  <el-dialog
    class="ui-dialog"
    ref="dialog"
    v-bind="$props"
    :visible.sync="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="handleBeforeClose"
  >
    <template v-if="visible">
      <slot><slot name="content"></slot></slot>
    </template>
    <template slot="footer">
      <slot name="buttons"></slot>
    </template>
  </el-dialog>
</template>
<script>
import {
  Dialog
} from 'element-ui'
export default {
  name: 'UiDialog',
  components: {
    ElDialog: Dialog
  },
  provide () {
    return {
      uiDialog: this
    }
  },
  props: {
    title: String,
    modal: {
      type: Boolean,
      default: true
    },
    lockScroll: Boolean,
    width: String,
    customClass: String
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    contentInstance () {
      const contentSlots = this.$slots.content || this.$slots.default
      if (!contentSlots) {
        return
      }
      const contentInstance = contentSlots[0].componentInstance
      if (!contentInstance) {
        return
      }
      return contentInstance
    }
  },
  created () {
    this.$on('dialog-button-click', this.handleButtonClick)
  },
  methods: {
    open () {
      this.visible = true
    },
    close () {
      this.visible = false
    },
    doContentAction (action) {
      return new Promise((resolve, reject) => {
        if (!this.contentInstance) {
          return resolve()
        }
        if (!action) {
          return resolve()
        }
        const methodName = 'on' + action.replace(/\b(\w)|\s(\w)/, v => v.toUpperCase())
        if (this.contentInstance[methodName]) {
          const r = this.contentInstance[methodName]({
            action
          })
          if (r && r.then) {
            r.then(resolve, reject)
          } else {
            return resolve()
          }
        } else {
          return resolve()
        }
      })
    },
    handleBeforeClose (done) {
      this.doContentAction('close').then(() => {
        done()
      })
    },
    handleButtonClick ({name}) {
      this.doContentAction(name).then(() => {
        this.close()
      })
    }
  }
}
</script>

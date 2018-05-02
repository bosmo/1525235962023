<template>
  <div>
    <ui-form label-width="40px">
      <ui-form-row>
        <ui-form-cell label="测试">
          <ui-textbox></ui-textbox>
        </ui-form-cell>
        <ui-form-cell label="测试">
          <ui-textbox></ui-textbox>
        </ui-form-cell>
        <ui-form-cell label="测试">
          <ui-textbox></ui-textbox>
        </ui-form-cell>
      </ui-form-row>
      <ui-form-row>
        <ui-form-cell label="测试">
          <ui-textbox></ui-textbox>
        </ui-form-cell>
        <ui-form-cell label="测试">
          <ui-textbox></ui-textbox>
        </ui-form-cell>
        <ui-form-cell label="测试">
          <ui-textbox></ui-textbox>
        </ui-form-cell>
      </ui-form-row>
      <ui-form-row>
        <ui-form-cell>
          <ui-button @click="handleConfirmClick">确定</ui-button>
        </ui-form-cell>
      </ui-form-row>
    </ui-form>
    <ui-dialog ref="dialog" title="测试">
      <template slot="content">
        <dialog-content></dialog-content>
      </template>
      <template slot="buttons">
        <ui-button name="confirm">确定</ui-button>
        <ui-button name="cancel">取消</ui-button>
      </template>
    </ui-dialog>
  </div>
</template>
<script>
import DialogContent from './dialog-content'

export default {
  name: 'PageForm',
  components: {
    DialogContent
  },
  methods: {
    handleConfirmClick () {
      this.$refs.dialog.open()
    }
  }
}
</script>


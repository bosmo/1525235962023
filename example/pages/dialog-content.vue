<template>
  <div>
    测试内容
  </div>
</template>
<script>
export default {
  name: 'dialog-content',
  methods: {
    onClose () {
      return new Promise((resolve, reject) => {
        reject()
      })
    },
    onConfirm () {
      return new Promise((resolve, reject) => {
        reject()
      })
    },
    onCancel () {
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
}
</script>


<template>
  <div>
    <ui-align-line class="draggables" ref="alignline">
      <ui-draggable slot="reference" class="draggable-test" style="height: 60px;" @move="handleMove">bbb</ui-draggable>
      <ui-draggable class="draggable-test" style="width: 120px; height: 120px;">aaa</ui-draggable>
      <ui-draggable class="draggable-test" style="width: 180px; height: 180px;">ccc</ui-draggable>
      <ui-draggable class="draggable-test" style="width: 240px; height: 240px;">ddd</ui-draggable>
    </ui-align-line>
    <span>test</span>
  </div>
</template>
<script>
  export default {
    name: 'PageAlignLine',
    methods: {
      handleMove () {
        this.$refs.alignline.update()
      }
    }
  }
</script>
<style lang="less">
.draggable-test{
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  background-color: #eee;
  position: absolute;
}
</style>

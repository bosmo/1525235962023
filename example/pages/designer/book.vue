<template>
  <div class="page-book">
    <div class="page-book__inner" ref="testBoard">
      <ui-book-designer v-if="ready" :width="width" :height="height" :zoom="zoom" :data="pageData"></ui-book-designer>
    </div>
  </div>
</template>
<script>
  import pageData from './page-data.js'

  export default {
    name: 'PageBookDesigner',
    data () {
      return {
        realWidth: 1000,
        realHeight: 500,
        width: 0,
        height: 0,
        zoom: 1,
        ready: false,
        pageData
      }
    },
    mounted () {
      this.zoomToViewport()
      this.ready = true
      window.addEventListener('resize', this.handleWindowResize)
    },
    methods: {
      handleWindowResize () {
        this.zoomToViewport()
      },
      zoomToViewport () {
        const boardParentWidth = this.$refs.testBoard.clientWidth
        const boardParentHeight = this.$refs.testBoard.clientHeight
        let width = this.realWidth
        let height = this.realHeight
        if (this.width > boardParentWidth) {
          width = boardParentWidth
          height = width * this.height / this.width
        }
        if (height > boardParentHeight) {
          let height1 = boardParentHeight
          let width1 = height1 * width / height
          height = height1
          width = width1
        }
        console.log(width)
        console.log(height)
        this.width = width
        this.height = height
        this.zoom = width / this.realWidth
      }
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.handleWindowResize)
    }
  }
</script>
<style lang="less">
  .page-book{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #E6E7E9;
  }
  .page-book__inner{
    position: absolute;
    top: 24px;
    right: 24px;
    bottom: 24px;
    left: 24px;
    text-align: center;
  }
</style>

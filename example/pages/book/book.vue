<template>
  <div class="page-book">
    <div style="margin: 30px">
      <ui-draggable selector=".test">
        <div class="test">test1</div>
        <div class="test">test2</div>
        <div class="test">test3</div>
        <div class="test">test4</div>
      </ui-draggable>
    </div>
    <div class="page-book__inner" ref="testBoard">
      <ui-book
        v-if="ready"
        :width="realWidth"
        :height="realHeight"
        :zoom="zoom"
        :pages="pageData"
        :current-page-index="currentPageIndex"
        @page-item-change="handlePageItemChange"
        @page-index-changed="handlePageIndexChanged"
      ></ui-book>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import pageData from './page-data.js'
  export default {
    name: 'PageBookDesigner',
    data () {
      return {
        realWidth: 1840,
        realHeight: 600,
        width: 0,
        height: 0,
        zoom: 1,
        ready: false,
        pageData,
        currentPageIndex: 1
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
      },
      handlePageItemChange ({data, item, page}) {
        for (let i in data) {
          Vue.set(item, i, data[i])
        }
      },
      handlePageIndexChanged (evt) {
        this.currentPageIndex = evt.pageIndex
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
    .ui-book{
      margin-left: auto;
      margin-right: auto;
    }
  }
  .test{
    width: 100px;
    height: 100px;
    background: #f00;
    z-index: 100;
    position: relative;
  }
</style>

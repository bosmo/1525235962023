<template>
  <div class="ui-board" :style="renderStyle()">
    <canvas class="ui-board__canvas" :id="id"></canvas>
    <template v-if="isReady">
      <div class="ui-board__main" :style="renderMainStyle()">
        <board-page
          v-for="(page, index) in data"
          :key="index"
          v-bind="page"
          :zoom="zoom"
          :items="page.items"
          @dropactivate="handlePageDropactivate(page)"
          @dragenter="handlePageDragenter(page)"
          @dragleave="handlePageDragleave(page)"
          @drop="handlePageDrop(page)"
          @item-moving="handleItemMoving(page, $event)"
          @item-scaling="handleItemScaling(page, $event)"
          @item-rotating="handleItemRotating(page, $event)"
        ></board-page>
      </div>
    </template>
  </div>
</template>
<script>
import { v4 } from 'uuid'
import { fabric } from 'fabric'
import boardPage from './board-page'

export default {
  name: 'UiBoard',
  components: {
    boardPage
  },
  props: {
    width: {
      type: [String, Number],
      default: 100
    },
    height: {
      type: [String, Number],
      default: 100
    },
    zoom: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: () => []
    },
    double: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      innerWidth: null,
      innerHeight: null,
      innerZoom: null,
      selectedItems: [],
      id: v4(),
      isReady: false
    }
  },
  computed: {
    pageItems () {
      let result = []
      if (this.data) {
        this.data.forEach(v => {
          if (v.items) {
            result = result.concat(v.items)
          }
        })
      }
      return result
    },
    pageItemsMap () {
      let result = {}
      this.pageItems.forEach(v => {
        result[v.id] = v
      })
      return result
    }
  },
  provide () {
    return {
      UiBoard: this
    }
  },
  watch: {
    zoom (val) {
      this.setZoom(val)
    },
    width (val) {
      this.setWidth(val)
    },
    height (val) {
      this.setHeight(val)
    }
  },
  mounted () {
    this.canvas = new fabric.Canvas(this.id, {
      enableRetinaScaling: true
    })
    this.canvas.on('selection:created', (e) => {
      this.handleRefreshSelected(e.selected)
    })
    this.canvas.on('selection:cleared', (e) => {
      this.handleRefreshSelected([])
    })
    this.canvas.on('selection:updated', (e) => {
      this.handleRefreshSelected(e.selected)
    })
    this.isReady = true
  },
  created () {
    this.setZoom(this.zoom)
    this.setWidth(this.width)
    this.setHeight(this.height)
  },
  methods: {
    /**
     * 投放页面被激活时触发
    */
    handlePageDropactivate (page) {
      this.$emit('page-dropactivate', {
        page
      })
    },
    /**
     * 投放的组件移到页面上时触发
    */
    handlePageDragenter (page) {
      this.$emit('page-dragenter', {
        page
      })
    },
    /**
     * 投放的组件离开页面时触发
    */
    handlePageDragleave (page) {
      this.$emit('page-dragleave', {
        page
      })
    },
    /**
     * 页面投放组件时触发
    */
    handlePageDrop (page) {
      this.$emit('page-drop', {
        page
      })
    },
    /**
     * 刷新选中项
    */
    handleRefreshSelected (selected) {
      const selectedItems = []
      selected.forEach(v => {
        if (this.pageItemsMap[v.id]) {
          selectedItems.push(this.pageItemsMap[v.id])
        }
      })
      this.$set(this, 'selectedItems', selectedItems)
      if (selectedItems.length > 0) {
        this.$emit('page-item-selected', {
          selecteds: selectedItems
        })
      }
    },
    handleItemMoving (page, evt) {
      this.$emit('page-item-moving', {
        page,
        ...evt
      })
    },
    handleItemScaling (page, evt) {
      this.$emit('page-item-scaling', {
        page,
        ...evt
      })
    },
    handleItemRotating (page, evt) {
      this.$emit('page-item-rotating', {
        page,
        ...evt
      })
    },
    /**
     * 设置画板宽度
    */
    setWidth (width) {
      width = parseFloat(width)
      if (isNaN(width)) {
        return
      }
      this.innerWidth = width
      this.$nextTick(() => {
        width *= this.innerZoom
        this.canvas.setWidth(width)
      })
    },
    /**
     * 设置画板高度
    */
    setHeight (height) {
      height = parseFloat(height)
      if (isNaN(height)) {
        return
      }
      this.innerHeight = height
      this.$nextTick(() => {
        height *= this.innerZoom
        this.canvas.setHeight(height)
      })
    },
    /**
     * 设置缩放
    */
    setZoom (zoom) {
      if (isNaN(zoom)) {
        return
      }
      this.innerZoom = zoom
      this.$nextTick(() => {
        this.canvas.setWidth(this.innerWidth * zoom)
        this.canvas.setHeight(this.innerHeight * zoom)
        this.canvas.setZoom(zoom)
      })
    },
    /**
     * 获取所有选中画板组件
    */
    getSelecteds () {
      return [].concat(this.selectedItems)
    },
    /**
     * 刷新画板
    */
    refresh () {
      this.$nextTick(() => {
        this.canvas.requestRenderAll()
      })
    },
    renderStyle () {
      const width = this.innerWidth * this.zoom
      const height = this.innerHeight * this.zoom
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    },
    renderMainStyle () {
      return {
        width: `${this.innerWidth}px`,
        height: `${this.innerHeight}px`,
        marginTop: `${this.innerHeight * -1}px`,
        transformOrigin: '0 100%',
        transform: `scale(${this.zoom})`
      }
    }
  }
}
</script>
<style lang="less">
  .ui-board{
    position: relative;
    border: 1px solid #666;
  }
  .ui-board__main{
    overflow: hidden;
    &:after{
      content: '';
      display: block;
      clear: both;
    }
    .ui-board-page{
      float: left;
    }
  }
</style>

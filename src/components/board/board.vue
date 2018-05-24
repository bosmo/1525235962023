<template>
  <div class="ui-board" :style="renderStyle()">
    <canvas class="ui-board__canvas" :id="id"></canvas>
    <div class="ui-board__elements" v-if="ready" :style="renderElementsStyle()">
      <component
        v-for="item in items"
        :ref="item.id"
        :key="item.id"
        :id="item.id"
        :width="item.width"
        :height="item.height"
        :left="item.left"
        :top="item.top"
        :rotate="item.rotate"
        :scaleX="item.scaleX"
        :scaleY="item.scaleY"
        v-bind="item.props"
        :is="handleRenderItem(item.type)"
        @moving="handleItemMoving(item, $event)"
        @scaling="handleItemScaling(item, $event)"
        @rotating="handleItemRotating(item, $event)"
        @selected="handleItemSelected(item)"
        @deselect="handleItemDeselect(item)"
      ></component>
    </div>
  </div>
</template>
<script>
import { v4 } from 'uuid'
import { fabric } from 'fabric'
import interact from 'interactjs'
import boardItems from './board-items'

export default {
  name: 'UiBoard',
  provide () {
    return {
      UiBoard: this
    }
  },
  props: {
    bgImageUrl: {
      type: String
    },
    bgImageRepeat: {
      type: String
    },
    bgImageLeft: {
      type: [String, Number]
    },
    bgImageTop: {
      type: [String, Number]
    },
    bgColor: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    zoom: {
      type: Number,
      default: 1
    },
    items: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      id: v4(),
      ready: false
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
      enableRetinaScaling: true,
      selection: false
    })
    this.interact = interact(this.$el).dropzone({
      ondropactivate: (event) => {
        this.$emit('dropactivate', event)
      },
      ondragenter: (event) => {
        this.$emit('dragenter', event)
      },
      ondragleave: () => {
        this.$emit('dragleave', event)
      },
      ondrop: (event) => {
        this.$emit('drop', event)
      }
    })
    this.setZoom(this.zoom)
    this.setWidth(this.width)
    this.setHeight(this.height)
    this.ready = true
  },
  methods: {
    /**
     * 渲染动态新增的组件
    */
    handleRenderItem (type) {
      if (!boardItems[type]) {
        throw new Error(`Not found component ${type}`)
      }
      return boardItems[type]
    },
    /**
     * 移动画板组件触发
    */
    handleItemMoving (item, evt) {
      this.$emit('item-moving', {
        item,
        data: evt
      })
    },
    /**
     * 旋转画板组件触发
    */
    handleItemScaling (item, evt) {
      this.$emit('item-scaling', {
        item,
        data: evt
      })
    },
    /**
     * 缩放画板组件触发
    */
    handleItemRotating (item, evt) {
      this.$emit('item-rotating', {
        item,
        data: evt
      })
    },
    handleItemSelected (item) {
      this.$emit('item-selected', {
        item
      })
    },
    handleItemDeselect (item) {
      this.$emit('item-deselect', {
        item
      })
    },
    /**
     * 向画布中添加组件
    */
    addWidget (widget) {
      this.canvas.add(widget)
    },
    /**
     * 从画布中移除组件
    */
    removeWidget (widget) {
      this.canvas.remove(widget)
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
     * 刷新画板
    */
    refresh () {
      this.$nextTick(() => {
        this.canvas.requestRenderAll()
      })
    },
    /**
     * 输出页面样式
    */
    renderStyle () {
      const width = this.innerWidth * this.zoom
      const height = this.innerHeight * this.zoom
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    },
    renderElementsStyle () {
      const bgImageUrl = this.bgImageUrl ? `url(${this.bgImageUrl})` : ''
      return {
        backgroundColor: `${this.bgColor}`,
        backgroundImage: `${bgImageUrl}`,
        backgroundRepeat: `${this.bgImageRepeat}`,
        backgroundPosition: `${this.bgImageLeft} ${this.bgImageTop}`,
        width: `${this.innerWidth}px`,
        height: `${this.innerHeight}px`,
        transformOrigin: '0 0',
        transform: `scale(${this.zoom})`
      }
    }
  }
}
</script>
<style lang="less">
.ui-board{
  position: relative;
  .canvas-container{
    z-index: 10;
  }
  .ui-board__elements{
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>

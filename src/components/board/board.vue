<template>
  <div
    class="ui-board"
    ref="alignLine"
    :active="activeLine"
    :style="renderStyle()"
    :active-rect="selectedItemRect"
    :reference-rects="referenceItemRects"
  >
    <canvas class="ui-board__canvas" :id="id"></canvas>
    <div class="ui-board__elements" v-if="ready" :style="renderElementsStyle()">
      <ui-board-region
        v-for="page in items"
        :key="page.id"
        v-bind="page"
        @item-moving="handleItemMoving(page, $event)"
        @item-scaling="handleItemScaling(page, $event)"
        @item-rotating="handleItemRotating(page, $event)"
        @item-selected="handleItemSelected(page, $event)"
        @item-deselect="handleItemDeselect(page, $event)"
      ></ui-board-region>
    </div>
  </div>
</template>
<script>
import { v4 } from 'uuid'
import { fabric } from 'fabric'
import UiBoardRegion from './board-region'
import UiBoardAlignline from './board-alignline'

export default {
  name: 'UiBoard',
  components: {
    UiBoardRegion,
    UiBoardAlignline
  },
  provide () {
    return {
      UiBoard: this
    }
  },
  props: {
    zoom: {
      type: Number,
      default: 1
    },
    width: {
      type: Number
    },
    height: {
      type: Number
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
      activeLine: false,
      selectedItem: null,
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
  computed: {
    selectedItemRect: {
      cache: false,
      get () {
        if (this.selectedItem) {
          let $selectedItem = this.$refs[`item-${this.selectedItem.id}`]
          if ($selectedItem && $selectedItem[0]) {
            $selectedItem = $selectedItem[0]
            const {width, height, left, top} = $selectedItem.widget.getBoundingRect(true, true)
            return {
              width,
              height,
              left,
              top,
              right: width + left,
              bottom: top + height
            }
          }
        }
      }
    },
    referenceItemRects: {
      cache: false,
      get () {
        const result = []
        if (this.selectedItem) {
          this.items.forEach(v => {
            if (v !== this.selectedItem) {
              let $item = this.$refs[`item-${v.id}`]
              if ($item && $item[0]) {
                $item = $item[0]
                const {width, height, left, top} = $item.widget.getBoundingRect(true, true)
                result.push({
                  width,
                  height,
                  left: left,
                  top: top,
                  right: width + left,
                  bottom: top + height
                })
              }
            }
          })
        }
        return result
      }
    }
  },
  mounted () {
    this.canvas = new fabric.Canvas(this.id, {
      enableRetinaScaling: true,
      selection: false
    })
    this.canvas.on('mouse:down', this.handleCanvasMouseDown)
    this.canvas.on('mouse:up', this.handleCanvasMouseUp)
    this.setZoom(this.zoom)
    this.setWidth(this.width)
    this.setHeight(this.height)
    this.ready = true
  },
  methods: {
    handleItemMoving (page, {item, data}) {
      // this.$refs.alignLine.update()
      this.$emit('item-moving', {
        page,
        item,
        data
      })
    },
    handleItemScaling (page, {item, data}) {
      // this.$refs.alignLine.update()
      this.$emit('item-scaling', {
        page,
        item,
        data
      })
    },
    handleItemRotating (page, {item, data}) {
      // this.$refs.alignLine.update()
      this.$emit('item-rotating', {
        page,
        item,
        data
      })
    },
    handleCanvasMouseDown () {
      this.$set(this, 'activeLine', true)
    },
    handleCanvasMouseUp () {
      this.$set(this, 'activeLine', false)
    },
    handleItemSelected (page, {item}) {
      this.$set(this, 'selectedItem', item)
      // this.$refs.alignLine.update()
      this.$emit('item-selected', {
        page,
        item
      })
    },
    handleItemDeselect (page, {item}) {
      this.$set(this, 'selectedItem', null)
      // this.$refs.alignLine.update()
      this.$emit('item-deselect', {
        page,
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
  overflow: hidden;
  position: relative;
  .canvas-container{
    z-index: 10;
  }
}
.ui-board__elements{
  position: absolute;
  left: 0;
  top: 0;
}
</style>

<template>
  <div :class="['ui-board-frame', {'has-image': imageUrl}]" :style="renderStyle()">
    <img v-if="imageUrl" :src="imageUrl" style="max-height: 100%; max-width: 100%;" />
  </div>
</template>
<script>
import { fabric } from 'fabric'
export default {
  name: 'UiBoardFrame',
  props: {
    id: {
      type: String,
      required: true
    },
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    scaleX: {
      type: Number,
      default: 1
    },
    scaleY: {
      type: Number,
      default: 1
    },
    rotate: {
      type: Number,
      default: 0
    },
    imageUrl: {
      type: String
    },
    imageWidth: {
      type: Number
    },
    imageHeight: {
      type: Number
    }
  },
  inject: ['UiBoard'],
  mounted () {
    this.widget = new fabric.Rect({
      id: this.id,
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      fill: 'rgba(0,0,0,0)',
      angle: this.rotate,
      scaleX: this.scaleX,
      scaleY: this.scaleY
    })
    this.widget.on('moving', () => {
      this.$emit('moving', this.getData())
    })
    this.widget.on('scaling', () => {
      this.$emit('scaling', this.getData())
    })
    this.widget.on('rotating', () => {
      const { rotate } = this.getData()
      this.$emit('rotating', { rotate })
    })
    this.widget.on('selected', () => {
      this.$emit('selected', this.getData())
    })
    this.widget.on('deselected', () => {
      this.$emit('deselect', this.getData())
    })
    this.UiBoard.addWidget(this.widget)
    this.renderStyle()
  },
  methods: {
    /**
     * 获取组件数据
    */
    getData () {
      return {
        rotate: this.widget.angle,
        left: this.widget.left,
        top: this.widget.top,
        scaleX: this.widget.scaleX,
        scaleY: this.widget.scaleY,
        width: this.widget.width,
        height: this.widget.height
      }
    },
    renderStyle () {
      let width = this.width * this.scaleX
      let height = this.height * this.scaleY
      let left = this.left
      let top = this.top
      if (this.widget) {
        let {x, y} = this.widget.translateToGivenOrigin(this.widget.getCenterPoint(), 'center', 'center', 0, 0)
        left = x + 0.5 * this.scaleX
        top = y + 0.5 * this.scaleY
      }
      const data = {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${this.rotate}deg)`
      }
      return data
    }
  },
  beforeDestroy () {
    this.UiBoard.removeWidget(this.widget)
  }
}
</script>

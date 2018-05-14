<template>
  <div class="ui-board-text" :style="renderStyle()">
    {{text}}
  </div>
</template>
<script>
import { fabric } from 'fabric'

export default {
  name: 'board-widget-text',
  props: {
    id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
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
    scale: {
      type: Number,
      default: 1
    },
    rotate: {
      type: Number,
      default: 0
    },
    fontSize: {
      type: Number,
      default: 12
    },
    fontColor: {
      type: String,
      default: '#333'
    },
    lineHeight: {
      type: Number,
      default: 1.5
    },
    fontFace: {
      type: String,
      default: 'Microsoft Yahei'
    },
    fontStyle: {
      type: String,
      default: 'normal',
      validator (value) {
        return ['normal', 'italic', 'oblique'].indexOf(value) >= 0
      }
    },
    fontWeight: {
      type: [String, Number],
      default: 'normal'
    },
    backgroundColor: {
      type: String
    },
    textAlign: {
      type: String,
      validator (value) {
        return ['left', 'center', 'right', 'justify', 'justify-left', 'justify-center', 'justify-right'].indexOf(value) >= 0
      }
    },
    underline: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Object,
      default: null
    }
  },
  inject: ['UiBoard', 'UiBoardPage'],
  watch: {
    fontSize (val) {
      this.widget.set('fontSize', val)
      this.UiBoard.refresh()
    },
    fontColor (val) {
      this.widget.set('fill', val)
      this.UiBoard.refresh()
    },
    fontWeight (val) {
      this.widget.set('fontWeight', val)
      this.UiBoard.refresh()
    },
    fontStyle (val) {
      this.widget.set('fontStyle', val)
      this.UiBoard.refresh()
    }
  },
  mounted () {
    this.widget = new fabric.Textbox(this.text, {
      id: this.id,
      left: this.left,
      top: this.top,
      width: this.width,
      fill: 'rgba(255,0,0,0)',
      angle: this.rotate,
      scaleX: this.scale,
      scaleY: this.scale
    })
    this.widget.on('moving', () => {
      this.$emit('moving', this.getData())
    })
    this.widget.on('scaling', () => {
      console.log(this.getData())
      this.$emit('scaling', this.getData())
    })
    this.widget.on('rotating', () => {
      this.$emit('rotating', this.getData())
    })
    this.widget.on('selected', () => {
      this.$emit('selected', this.getData())
    })
    this.widget.on('deselected', () => {
      this.$emit('deselect', this.getData())
    })
    this.UiBoardPage.addWidget(this.widget)
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
        scale: this.widget.scaleX,
        width: this.widget.width,
        height: this.widget.height
      }
    },
    renderStyle () {
      return {
        position: 'absolute',
        left: `${this.left}px`,
        top: `${this.top}px`,
        width: `${this.width}px`,
        height: `${this.height}px`,
        transform: `scale(${this.scale}, ${this.scale})`
      }
    }
  },
  beforeDestroy () {
    this.UiBoardPage.removeWidget(this.widget)
  }
}
</script>
<style>
.board-widget-text{
  position: absolute;
  z-index: 1;
}
</style>

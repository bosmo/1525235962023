<template>
  <div class="ui-board-text" :style="renderStyle()">
    <div class="ui-board-text__inner">
      {{text}}
    </div>
  </div>
</template>
<script>
import { fabric } from 'fabric'

export default {
  name: 'UiBoardText',
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
  inject: ['UiBoard'],
  mounted () {
    this.widget = new fabric.Rect({
      id: this.id,
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      fill: 'rgba(255,0,0,0)',
      angle: this.rotate,
      scale: this.scale
    })
    this.widget.on('moving', () => {
      this.$emit('moving', this.getData())
    })
    this.widget.on('scaling', () => {
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
      let fontSize = this.fontSize
      let left = this.left
      let top = this.top
      if (this.widget) {
        let {x, y} = this.widget.translateToGivenOrigin(this.widget.getCenterPoint(), 'center', 'center', 0, 0)
        left = x
        top = y
      }
      const data = {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        fontSize: `${fontSize}px`,
        color: this.fontColor,
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
<style lang="less">
.ui-board-text{
  display: table;
}
.ui-board-text__inner{
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
</style>

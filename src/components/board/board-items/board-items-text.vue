<template>
  <widget-proxy
    :width="width"
    :height="height"
    :left="left"
    :top="top"
    :scale="scale"
    :rotate="rotate"
  ></widget-proxy>
</template>
<script>
import { fabric } from 'fabric'
import WidgetProxy from './board-items-proxy'

export default {
  name: 'board-widget-font',
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
      type: Boolean,
      default: false
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
  inject: ['UiBoardPage'],
  components: {
    WidgetProxy
  },
  mounted () {
    this.widget = new fabric.Textbox(this.text, {
      id: this.id,
      left: this.left,
      top: this.top,
      width: this.width,
      fontSize: this.fontSize,
      angle: this.rotate,
      scaleX: this.scale,
      scaleY: this.scale,
      shadow: this.shadow
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
.board-widget-text__coord{
  position: absolute;
  left: 0;
  top: -30px;
  height: 30px;
  line-height: 30px;
}
</style>

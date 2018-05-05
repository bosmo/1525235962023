<template>
  <div class="ui-board-background">
    <slot></slot>
  </div>
</template>
<script>
import { fabric } from 'fabric'
export default {
  name: 'UiBoardBackground',
  inject: ['UiBoard'],
  props: {
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    bgColor: {
      type: String,
      default: 'rgba(255,255,255,0)'
    },
    bgImageUrl: {
      type: String
    },
    bgImageRepeat: {
      type: String,
      default: 'no-repeat',
      validator (val) {
        return ['repeat-x', 'repeat-y', 'repeat', 'no-repeat'].indexOf(val) >= 0
      }
    },
    bgImageLeft: {
      type: [Number, String],
      default: 0,
      validator (val) {
        if (typeof val === 'number') {
          return true
        }
        if (typeof val === 'string' && val.indexOf('%') >= 0) {
          return true
        }
        return false
      }
    },
    bgImageTop: {
      type: [Number, String],
      default: 0,
      validator (val) {
        if (typeof val === 'number') {
          return true
        }
        if (typeof val === 'string' && val.indexOf('%') >= 0) {
          return true
        }
        return false
      }
    }
  },
  watch: {
    bgImageUrl: {
      immediate: true,
      handler (val) {
        this.$nextTick(() => {
          if (val) {
            fabric.util.loadImage(val, (img) => {
              this.widget.set('fill', new fabric.Pattern({
                source: img
              }))
              this.UiBoard.board.renderAll()
            })
          } else {
            this.widget.set('fill', this.bgColor)
          }
        })
      }
    },
    bgImageTop: {
      immediate: true,
      handler (val) {
        this.$nextTick(() => {
          this.pattern.setOptions({
            'offsetY': val
          })
          this.UiBoard.board.renderAll()
        })
      }
    },
    bgImageLeft: {
      immediate: true,
      handler (val) {
        this.$nextTick(() => {
          this.pattern.setOptions({
            'offsetX': val
          })
        })
        this.UiBoard.board.renderAll()
      }
    },
    bgImageRepeat: {
      immediate: true,
      handler (val) {
        this.$nextTick(() => {
          this.pattern.setOptions({
            'repeat': val
          })
        })
        this.UiBoard.board.renderAll()
      }
    }
  },
  mounted () {
    this.widget = new fabric.Rect({
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      selectable: false,
      hoverCursor: 'default',
      fill: this.bgColor
    })
    this.pattern = new fabric.Pattern()
    this.UiBoard.board.add(this.widget)
    this.$el.remove()
  },
  beforeDestroy () {
    this.UiBoard.board.remove(this.widget)
  }
}
</script>

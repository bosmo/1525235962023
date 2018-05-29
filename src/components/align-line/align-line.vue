<template>
  <div class="ui-align-line">
    <slot></slot>
    <slot name="reference"></slot>
    <i
      v-for="(line, index) in lines"
      :key="index"
      :class="`ui-align-line__${line.type}`"
      :style="renderLineStyle(line)"
    ></i>
  </div>
</template>
<script>
/**
 * 在范围内比较两个数字
*/
const rangeCompare = (val1, val2, range) => {
  const compare = Math.abs(val1) - Math.abs(val2)
  return Math.abs(compare) <= range
}

export default {
  name: 'UiAlignLine',
  props: {
    compatRange: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      lines: []
    }
  },
  computed: {
    referenceEl () {
      if (this.$slots.reference && this.$slots.reference[0]) {
        return this.$slots.reference[0].elm
      }
    },
    siblingsEl () {
      const result = []
      if (this.referenceEl && this.$slots.default) {
        this.$slots.default.forEach(v => {
          if (v.elm && v.elm.nodeType === 1) {
            result.push(v.elm)
          }
        })
      }
      return result
    },
    referenceRect: {
      cache: false,
      get () {
        if (this.referenceEl) {
          return {
            left: this.referenceEl.offsetLeft,
            top: this.referenceEl.offsetTop,
            right: this.referenceEl.clientWidth + this.referenceEl.offsetLeft,
            bottom: this.referenceEl.clientHeight + this.referenceEl.offsetTop,
            width: this.referenceEl.clientWidth,
            height: this.referenceEl.clientHeight
          }
        }
      }
    },
    siblingsRect: {
      cache: false,
      get () {
        let result = []
        if (this.siblingsEl) {
          result = this.siblingsEl.map(v => {
            return {
              left: v.offsetLeft,
              top: v.offsetTop,
              right: v.clientWidth + v.offsetLeft,
              bottom: v.clientHeight + v.offsetTop,
              width: v.clientWidth,
              height: v.clientHeight
            }
          })
        }
        return result
      }
    },
    elRect: {
      cache: false,
      get () {
        if (this.$el) {
          return {
            left: 0,
            top: 0,
            right: this.$el.clientWidth,
            bottom: this.$el.clientHeight,
            width: this.$el.clientWidth,
            height: this.$el.clientHeight
          }
        }
      }
    }
  },
  methods: {
    renderLineStyle (line) {
      if (line.type === 'horizon') {
        return {
          'top': `${line.top}px`
        }
      } else {
        return {
          'left': `${line.left}px`
        }
      }
    },
    checkLine (rect, rects, compatRange, checkHorizon, checkVertical) {
      const lines = []
      let hasHorizonLine = false
      let hasVerticalLine = false
      rects.some(({left, top, bottom, right, height, width}) => {
        if (!hasHorizonLine && checkHorizon !== false) {
          if (
            rangeCompare(left, rect.left, compatRange) ||
            rangeCompare(left, rect.left + rect.width / 2, compatRange) ||
            rangeCompare(left, rect.right, compatRange)
          ) {
            lines.push({
              type: 'vertical',
              left
            })
            hasHorizonLine = true
          } else if (
            rangeCompare(left + width / 2, rect.left, compatRange) ||
            rangeCompare(left + width / 2, rect.left + rect.width / 2, compatRange) ||
            rangeCompare(left + width / 2, rect.right, compatRange)
          ) {
            lines.push({
              type: 'vertical',
              left: left + width / 2
            })
            hasHorizonLine = true
          } else if (
            rangeCompare(right, rect.right, compatRange) ||
            rangeCompare(right, rect.left + rect.width / 2, compatRange) ||
            rangeCompare(right, rect.left, compatRange)
          ) {
            lines.push({
              type: 'vertical',
              left: right
            })
            hasHorizonLine = true
          }
        }
        if (!hasVerticalLine && checkVertical !== false) {
          if (
            rangeCompare(top, rect.top, compatRange) ||
            rangeCompare(top, rect.top + rect.height / 2, compatRange) ||
            rangeCompare(top, rect.bottom, compatRange)
          ) {
            lines.push({
              type: 'horizon',
              top
            })
            hasVerticalLine = true
          } else if (
            rangeCompare(bottom, rect.bottom, compatRange) ||
            rangeCompare(bottom, rect.top + rect.height / 2, compatRange) ||
            rangeCompare(bottom, rect.top, compatRange)
          ) {
            lines.push({
              type: 'horizon',
              top: bottom
            })
            hasVerticalLine = true
          } else if (
            rangeCompare(top + height / 2, rect.top, compatRange) ||
            rangeCompare(top + height / 2, rect.bottom, compatRange) ||
            rangeCompare(top + height / 2, rect.top + rect.height / 2, compatRange)
          ) {
            lines.push({
              type: 'horizon',
              top: top + height / 2
            })
            hasVerticalLine = true
          }
        }
        return hasHorizonLine && hasVerticalLine
      })
      return lines
    },
    update () {
      let lines = []
      if (this.referenceRect) {
        if (this.elRect) {
          lines = this.checkLine(this.referenceRect, [this.elRect], this.compatRange)
        }
        lines = lines.concat(this.checkLine(this.referenceRect, this.siblingsRect, this.compatRange))
      }
      this.$set(this, 'lines', lines)
    }
  }
}
</script>
<style>
.ui-align-line{
  width: 600px;
  height: 600px;
  border: 1px solid #eee;
  position: relative;
}
.ui-align-line__horizon{
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #aaa;
}
.ui-align-line__vertical{
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 1px dashed #aaa;
}
</style>

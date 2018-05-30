<template>
  <div :style="{width: `${width}px`, height: `${height}px`}">
    <canvas ref="canvas" :height="height" :width="width"></canvas>
  </div>
</template>
<script>
export default {
  name: 'UiRulerBase',
  props: {
    dir: {
      type: String,
      default: 'x'
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    workspaceZoom: {
      type: Number,
      default: 50
    },
    workspaceWidth: {
      type: Number,
      default: 0
    },
    workspaceHeight: {
      type: Number,
      default: 0
    },
    start: {
      type: Number,
      default: 300
    }
  },
  mounted () {
    this.canvasContext = this.$refs.canvas.getContext('2d')
    this.update()
  },
  computed: {
    rIntervals () {
      let rIntervals = []
      let i
      for (i = 0.1; i < 1E5; i *= 10) {
        rIntervals.push(i)
        rIntervals.push(2 * i)
        rIntervals.push(5 * i)
      }
      return rIntervals
    },
    rulerLen () {
      if (this.dir === 'x') {
        return this.workspaceWidth
      } else {
        return this.workspaceHeight
      }
    }
  },
  methods: {
    clear () {
      this.canvasContext.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
    },
    update () {
      const zoom = this.workspaceZoom
      let i
      let limit = 30000
      var unit = 1

      let lentype = this.dir === 'x' ? 'width' : 'height'
      let contentDim = this.start

      let rulerLen = this.rulerLen
      let totalLen = rulerLen
      let ctxNum = 0
      let ctx = this.canvasContext
      let ctxArr
      let num
      let ctxArrNum
      let hcanv = this.$refs.canvas

      ctx.fillStyle = 'rgb(200,0,0)'
      ctx.fillRect(0, 0, this.width, this.height)

      if (rulerLen >= limit) {
        ctxArrNum = parseInt(rulerLen / limit, 10) + 1
        ctxArr = []
        ctxArr[0] = ctx
        let copy
        for (i = 1; i < ctxArrNum; i++) {
          hcanv[lentype] = limit
          copy = hcanv.cloneNode(true)
          hcanv.parentNode.appendChild(copy)
          ctxArr[i] = copy.getContext('2d')
        }
        copy[lentype] = rulerLen % limit

        rulerLen = limit
      }

      hcanv[lentype] = rulerLen

      let uMulti = unit * zoom

      let rawM = 50 / uMulti
      let multi = 1
      for (i = 0; i < this.rIntervals.length; i++) {
        num = this.rIntervals[i]
        multi = num
        if (rawM <= num) {
          break
        }
      }

      let bigInt = multi * uMulti

      ctx.font = '9px sans-serif'

      let rulerD = ((contentDim / uMulti) % multi) * uMulti
      let labelPos = rulerD - bigInt
      while (rulerD < totalLen) {
        labelPos += bigInt

        var curD = Math.round(rulerD) + 0.5
        if (this.dir === 'x') {
          ctx.moveTo(curD, 15)
          ctx.lineTo(curD, 0)
        } else {
          ctx.moveTo(15, curD)
          ctx.lineTo(0, curD)
        }

        num = (labelPos - contentDim) / uMulti
        let label
        if (multi >= 1) {
          label = Math.round(num)
        } else {
          let decs = String(multi).split('.')[1].length
          label = num.toFixed(decs)
        }

        if (label !== 0 && label !== 1000 && label % 1000 === 0) {
          label = (label / 1000) + 'K'
        }

        if (this.dir === 'x') {
          ctx.fillText(label, rulerD + 2, 8)
        } else {
          let str = String(label).split('')
          for (i = 0; i < str.length; i++) {
            ctx.fillText(str[i], 1, (rulerD + 9) + i * 9)
          }
        }

        let part = bigInt / 10
        for (i = 1; i < 10; i++) {
          let subD = Math.round(rulerD + part * i) + 0.5
          if (ctxArr && subD > rulerLen) {
            ctxNum++
            ctx.stroke()
            if (ctxNum >= ctxArrNum) {
              i = 10
              rulerD = totalLen
              continue
            }
            ctx = ctxArr[ctxNum]
            rulerD -= limit
            subD = Math.round(rulerD + part * i) + 0.5
          }

          let lineNum = (i % 2) ? 12 : 10
          if (this.dir === 'x') {
            ctx.moveTo(subD, 15)
            ctx.lineTo(subD, lineNum)
          } else {
            ctx.moveTo(15, subD)
            ctx.lineTo(lineNum, subD)
          }
        }
        rulerD += bigInt
      }
      ctx.strokeStyle = '#000'
      ctx.stroke()
    }
  }
}
</script>

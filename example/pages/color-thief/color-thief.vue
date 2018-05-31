<template>
  <div id="app" style="text-align: left;">
    <img ref="image" style="display: none;" src="static/image/2.jpg" />
    <div :style="renderStyle()"></div>
    <span v-if="level >= 192">浅</span>
    <span v-else>深</span>
  </div>
</template>

<script>
const ColorThief = require('color-thief')
export default {
  name: 'App',
  data () {
    return {
      color: [],
      level: null
    }
  },
  mounted () {
    this.$refs.image.onload = () => {
      this.colorThief = new ColorThief()
      this.color = this.colorThief.getColor(this.$refs.image)
      const level = this.color[0] * 0.299 + this.color[1] * 0.587 + this.color[2] * 0.114
      this.level = level
    }
  },
  methods: {
    renderStyle () {
      return {
        width: '40px',
        height: '40px',
        backgroundColor: `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`
      }
    }
  }
}
</script>

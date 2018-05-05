<template>
  <span class="board-widget-proxy" :style="renderStyle()">
    <span class="board-widget-proxy__coord">
      {{parseInt(left, 10)}}, {{parseInt(top, 10)}}
    </span>
    <span class="board-widget-proxy__size">
      {{parseInt(width, 10)}}, {{parseInt(height, 10)}}
    </span>
    <span class="board-widget-proxy__rotate">
      <span>{{parseInt(rotate, 10)}}°</span>
    </span>
    <slot></slot>
  </span>
</template>
<script>
export default {
  name: 'board-widget-proxy',
  props: {
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
    }
  },
  inject: ['UiBoard'],
  methods: {
    renderStyle () {
      return {
        width: this.width + 'px',
        height: this.height + 'px',
        left: this.left + 'px',
        top: this.top + 'px',
        transform: `rotate(${this.rotate}deg)`
      }
    }
  }
}
</script>
<style>
.board-widget-proxy{
  position: absolute;
  z-index: 1;
}
.board-widget-proxy__coord{
  position: absolute;
  left: 0;
  top: -30px;
  height: 30px;
  line-height: 30px;
  white-space: nowrap;
  display: none;
}
.board-widget-proxy__size{
  position: absolute;
  right: 0;
  bottom: -30px;
  height: 30px;
  line-height: 30px;
  white-space: nowrap;
  display: none;
}
.board-widget-proxy__rotate{
  position: absolute;
  left: 0;
  right: 0;
  top: -30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  white-space: nowrap;
  display: none;
}
</style>

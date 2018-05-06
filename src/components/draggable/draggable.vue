<template>
  <div class="ui-draggable" :id="id">
    <slot></slot>
  </div>
</template>
<script>
import interact from 'interactjs'
const unique = (() => {
  let number = (new Date()).getTime()
  return () => {
    return `draggable-${number++}`
  }
})()

export default {
  name: 'UiDraggable',
  props: {
    selector: {
      type: String
    },
    allowFrom: {
      type: String
    },
    ignoreFrom: {
      type: String
    }
  },
  data () {
    return {
      id: unique()
    }
  },
  computed: {
    innerSelector () {
      if (this.selector) {
        return `#${this.id} ${this.selector}`
      }
      return `#${this.id}`
    }
  },
  mounted () {
    this.interact = interact(this.innerSelector).draggable({
      autoScroll: true,
      allowFrom: this.allowFrom,
      ignoreFrom: this.ignoreFrom,
      onstart: (event) => {
        this.$emit('start', event)
      },
      onmove: (event) => {
        let target = event.target
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
        target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        this.$emit('move', event)
      },
      onend: (event) => {
        this.$emit('end', event)
      }
    })
  },
  beforeDestroy () {
    this.interact.off()
  }
}
</script>

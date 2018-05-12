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
    let $cloneNode = null
    this.interact = interact(this.innerSelector).draggable({
      autoScroll: true,
      allowFrom: this.allowFrom,
      ignoreFrom: this.ignoreFrom,
      onstart: (event) => {
        this.$emit('start', event)
      },
      onmove: (event) => {
        const taraget = event.target
        if (!$cloneNode) {
          const rect = taraget.getBoundingClientRect()
          $cloneNode = taraget.cloneNode()
          $cloneNode.innerHTML = taraget.innerHTML
          $cloneNode.style.position = 'fixed'
          $cloneNode.style.left = rect.x + 'px'
          $cloneNode.style.top = rect.y + 'px'
          $cloneNode.style.zIndex = 100
          event.target.after($cloneNode)
        }
        let x = (parseFloat($cloneNode.style.left || 0)) + event.dx
        let y = (parseFloat($cloneNode.style.top || 0)) + event.dy
        $cloneNode.style.left = x + 'px'
        $cloneNode.style.top = y + 'px'
        this.$emit('move', event)
      },
      onend: (event) => {
        $cloneNode.remove()
        $cloneNode = null
        this.$emit('end', event)
      }
    })
  },
  beforeDestroy () {
    this.interact.off()
  }
}
</script>

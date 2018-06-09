<template>
  <div :class="['ui-board-region', `ui-board-region--${type}`]" :style="renderStyle()">
    <component
      v-for="item in items"
      :ref="`item-${item.id}`"
      :key="item.id"
      :id="item.id"
      :width="item.width"
      :height="item.height"
      :left="item.left"
      :top="item.top"
      :rotate="item.rotate"
      :scaleX="item.scaleX"
      :scaleY="item.scaleY"
      v-bind="item.props"
      :is="handleRenderItem(item.type)"
      @moving="handleItemMoving(item, $event)"
      @scaling="handleItemScaling(item, $event)"
      @rotating="handleItemRotating(item, $event)"
      @selected="handleItemSelected(item)"
      @deselect="handleItemDeselect(item)"
    ></component>
  </div>
</template>
<script>
import interact from 'interactjs'
import boardItems from './board-items'
export default {
  name: 'UiBoardRegion',
  props: {
    bgImageUrl: {
      type: String
    },
    bgImageRepeat: {
      type: String,
      default: 'no-repeat'
    },
    bgImageLeft: {
      type: [String, Number],
      default: 0
    },
    bgImageTop: {
      type: [String, Number],
      default: 0
    },
    bgColor: {
      type: String,
      default: '#fff'
    },
    type: {
      type: String
    },
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
    items: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  provide () {
    return {
      UiBoardRegion: this
    }
  },
  mounted () {
    this.interact = interact(this.$el).dropzone({
      ondropactivate: (event) => {
        this.$emit('dropactivate', event)
      },
      ondragenter: (event) => {
        this.$emit('dragenter', event)
      },
      ondragleave: () => {
        this.$emit('dragleave', event)
      },
      ondrop: (event) => {
        this.$emit('drop', event)
      }
    })
  },
  methods: {
    renderStyle () {
      const { left, top, width, height, bgColor, bgImageUrl, bgImageLeft, bgImageTop, bgImageRepeat } = this.$props
      return {
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
        backgroundColor: `${bgColor}`,
        backgroundImage: `url(${bgImageUrl})`,
        backgroundPosition: `${bgImageLeft} ${bgImageTop}`,
        backgroundRepeat: `${bgImageRepeat}`,
        backgroundSize: 'cover'
      }
    },
    /**
     * 渲染动态新增的组件
    */
    handleRenderItem (type) {
      if (!boardItems[type]) {
        throw new Error(`Not found component ${type}`)
      }
      return boardItems[type]
    },
    /**
     * 移动画板组件触发
    */
    handleItemMoving (item, evt) {
      this.$emit('item-moving', {
        item,
        data: evt
      })
    },
    /**
     * 旋转画板组件触发
    */
    handleItemScaling (item, evt) {
      this.$emit('item-scaling', {
        item,
        data: evt
      })
    },
    /**
     * 缩放画板组件触发
    */
    handleItemRotating (item, evt) {
      this.$emit('item-rotating', {
        item,
        data: evt
      })
    },
    handleItemSelected (item) {
      this.$emit('item-selected', {
        item
      })
    },
    handleItemDeselect (item) {
      this.$emit('item-deselect', {
        item
      })
    }
  }
}
</script>
<style lang="less">
  .ui-board-region{
    position: absolute;
  }
</style>

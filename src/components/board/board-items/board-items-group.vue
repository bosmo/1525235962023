<template>
  <span>
    <component
      v-if="isReady"
      v-for="item in items"
      :key="item.id"
      :id="item.id"
      :width="item.width"
      :height="item.height"
      :left="item.left"
      :top="item.top"
      :rotate="item.rotate"
      :scale="item.scale"
      v-bind="item.props"
      :is="handleRenderWidget(item.type)"
      @create="handleItemCreate(item, $event)"
      @destroy="handleItemDestroy(item, $event)"
    ></component>
  </span>
</template>
<script>
import { fabric } from 'fabric'
import widgets from './index'
export default {
  name: 'widget-group',
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'group'
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
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isReady: false
    }
  },
  mounted () {
    this.widget = new fabric.Group([], {
      id: this.id,
      left: this.left,
      top: this.top,
      scaleX: this.scale,
      scaleY: this.scale,
      width: this.width,
      height: this.height,
      angle: this.rotate
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
    this.$emit('create', {
      widget: this.widget
    })
    this.isReady = true
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
    },
    /**
     * 渲染动态新增的组件
    */
    handleRenderWidget (type) {
      if (!widgets[type]) {
        throw new Error(`Not found component ${type}`)
      }
      return widgets[type]
    },
    handleItemCreate (item, { widget }) {
      this.widget.add(widget)
    },
    handleItemDestroy (item, { widget }) {
      this.widget.remove(widget)
      this.$emit('destroy', {
        widget: this.widget
      })
    }
  }
}
</script>

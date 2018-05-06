<template>
  <div class="ui-board-page" :style="renderPageStyle()">
    <board-background
      :left="left"
      :top="top"
      :width="width"
      :height="height"
      :bgImageUrl="bgImageUrl"
      :bgImageLeft="bgImageLeft"
      :bgImageTop="bgImageTop"
      :bgImageRepeat="bgImageRepeat"
      :bgColor="bgColor"
    >
      <template v-if="ready">
        <component
          v-for="item in widgets"
          :ref="item.id"
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
          @moving="handleWidgetMoving(item)"
          @scaling="handleWidgetScaling(item)"
          @rotating="handleWidgetRotating(item)"
          @selected="handleWidgetSelected(item)"
          @deselect="handleWidgetDeselect(item)"
        ></component>
      </template>
    </board-background>
  </div>
</template>
<script>
import interact from 'interactjs'
import boardItems from './board-items'
import boardAlignline from './board-alignline'
import boardBackground from './board-background'

export default {
  name: 'UiBoardPage',
  components: {
    boardBackground,
    boardAlignline
  },
  props: {
    bgImageUrl: {
      type: String
    },
    bgImageRepeat: {
      type: String
    },
    bgImageLeft: {
      type: [String, Number]
    },
    bgImageTop: {
      type: [String, Number]
    },
    bgColor: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    left: {
      type: Number
    },
    top: {
      type: Number
    },
    zoom: {
      type: Number,
      default: 1
    },
    widgets: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      ready: false
    }
  },
  mounted () {
    this.interact = interact(this.$el).dropzone({
      ondropactivate: (event) => {
        this.$emit('page-dropactivate', event)
      },
      ondragenter: (event) => {
        this.$emit('page-dragenter', event)
      },
      ondragleave: () => {
        this.$emit('page-dragleave', event)
      },
      ondrop: () => {
        this.$emit('page-drop', event)
      }
    })
    this.ready = true
  },
  methods: {
    /**
     * 渲染动态新增的组件
    */
    handleRenderWidget (type) {
      if (!boardItems[type]) {
        throw new Error(`Not found component ${type}`)
      }
      return boardItems[type]
    },
    handleWidgetMoving (widget) {
      this.$emit('widget-moving', {
        widget
      })
    },
    handleWidgetScaling (widget) {
      this.$emit('widget-scaling', {
        widget
      })
    },
    handleWidgetRotating (widget) {
      this.$emit('widget-rotating', {
        widget
      })
    },
    handleWidgetSelected (widget) {
      this.$emit('widget-selected', {
        widget
      })
    },
    handleWidgetDeselect (widget) {
      this.$emit('widget-deselect', {
        widget
      })
    },
    /**
     * 输出页面样式
    */
    renderPageStyle () {
      const width = this.width * this.zoom
      const height = this.height * this.zoom
      const left = this.left * this.zoom
      const top = this.top * this.zoom
      return {
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`
      }
    }
  }
}
</script>

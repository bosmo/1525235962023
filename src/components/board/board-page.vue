<template>
  <div class="ui-board-page">
    <board-background
      class="ui-board-page"
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
        ></component>
      </template>
    </board-background>
  </div>
</template>
<script>
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
    }
  }
}
</script>

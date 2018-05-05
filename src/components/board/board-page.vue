<template>
  <div class="ui-board-page">
    <board-alignline>
      <board-background
        :left="0"
        :top="0"
        :width="300"
        :height="300"
        bgImageUrl="http://www.w3school.com.cn/i/lamp.gif"
      ></board-background>
      <board-background
        :left="300"
        :top="0"
        :width="300"
        :height="300"
        bgColor="rgb(255,255,0)"
      ></board-background>
      <component
        v-for="item in innerData"
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
        @create="handleItemCreate(item, $event)"
        @destroy="handleItemDestroy(item, $event)"
        @scaling="handleItemScaling(item, $event)"
        @rotating="handleItemRotating(item, $event)"
        @moving="handleItemMoving(item, $event)"
      ></component>
    </board-alignline>
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
  data () {
    return {
    }
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

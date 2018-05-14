<template>
  <div class="ui-board-page" :style="renderPageStyle()">
    <template v-if="ready">
      <component
        v-for="item in items"
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
        :is="handleRenderItem(item.type)"
        @moving="handleItemMoving(item, $event)"
        @scaling="handleItemScaling(item, $event)"
        @rotating="handleItemRotating(item, $event)"
        @selected="handleItemSelected(item)"
        @deselect="handleItemDeselect(item)"
      ></component>
    </template>
  </div>
</template>
<script>
import { v4 } from 'uuid'
import { fabric } from 'fabric'
import interact from 'interactjs'
import boardItems from './board-items'
import boardBackground from './board-background'

export default {
  name: 'UiBoardPage',
  components: {
    boardBackground
  },
  inject: ['UiBoard'],
  provide () {
    return {
      UiBoardPage: this
    }
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
    items: {
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
    this.ready = true
  },
  methods: {
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
    },
    /**
     * 向画布中添加组件
    */
    addWidget (widget) {
      this.UiBoard.canvas.add(widget)
    },
    /**
     * 从画布中移除组件
    */
    removeWidget (widget) {
      this.UiBoard.canvas.remove(widget)
    },
    /**
     * 合并选区中的组件
    */
    mergeSelectionItems () {
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          const activeSelection = this.UiBoard.canvas.getActiveObject()
          if (!activeSelection || activeSelection.type !== 'activeSelection') {
            return
          }
          const objects = activeSelection.getObjects()
          const ids = objects.map(({id}) => {
            return id
          })
          this.merge(ids, {
            left: activeSelection.left,
            top: activeSelection.top,
            scale: activeSelection.scaleX,
            rotate: activeSelection.angle,
            width: activeSelection.width,
            height: activeSelection.height
          }).then((result) => {
            this.$nextTick(() => {
              const $item = this.$refs[result.groupId]
              if ($item && $item[0]) {
                this.UiBoard.canvas.setActiveObject($item[0].widget)
              }
            })
            resolve(result)
          })
        })
      })
    },
    /**
     * 拆分选区中的组件
    */
    unmergeSelectionItems () {
      this.$nextTick(() => {
        const group = this.UiBoard.canvas.getActiveObject()
        if (group.type !== 'group') {
          return
        }
        const groupOpts = group.toObject()
        this.unmerge(group.id, true).then(({itemIds}) => {
          this.$nextTick(() => {
            const $widgetsArr = []
            itemIds.forEach(v => {
              const $widget = this.$refs[v] && this.$refs[v][0]
              if (!$widget) {
                return
              }
              $widgetsArr.push($widget.widget)
            })
            const activeSelection = new fabric.ActiveSelection($widgetsArr, {
              canvas: this.UiBoard.canvas
            })
            const {type, objects, ...opts} = groupOpts
            activeSelection.set(opts)
            activeSelection.setCoords()
            this.UiBoard.canvas.setActiveObject(activeSelection)
          })
        })
      })
    },
    /**
     * 合并
    */
    merge (itemIds, options) {
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          if (!Array.isArray(itemIds)) {
            return
          }
          const items = []
          let $widgetsArr = []
          let $widgetsMap = {}
          itemIds.forEach(v => {
            if (this.dataMap[v] && this.$refs[v] && this.$refs[v][0]) {
              const $widget = this.$refs[v][0].widget
              if ($widget) {
                $widgetsArr = $widgetsArr.concat($widget)
                $widgetsMap[v] = $widget
                items.push(this.dataMap[v])
              }
            }
          })
          if ($widgetsArr.length <= 1) {
            return
          }
          const activeSelection = new fabric.ActiveSelection($widgetsArr, {
            canvas: this.UiBoard.canvas
          })
          const group = activeSelection.toGroup()
          this.UiBoard.canvas.discardActiveObject(this.UiBoard.canvas.getActiveObject())
          const mergeItems = []
          const newData = [].concat(this.widgetsData)
          const groupId = v4()
          // 组织新的分组数据
          const newGroup = {
            id: groupId,
            type: 'group',
            ...Object.assign({
              left: group.left,
              top: group.top,
              scale: group.scaleX,
              rotate: group.angle,
              width: group.width,
              height: group.height
            }, options),
            props: {
              items: mergeItems
            }
          }
          items.forEach(v => {
            const $widget = $widgetsMap[v.id]
            mergeItems.push(Object.assign({}, v, {
              left: $widget.left,
              top: $widget.top,
              scale: $widget.scaleX,
              rotate: $widget.angle,
              width: $widget.width,
              height: $widget.height
            }))
            for (let i = newData.length - 1; i >= 0; i--) {
              if (newData[i].id === v.id) {
                newData.splice(i, 1)
              }
            }
          })
          newData.push(newGroup)
          this.$set(this, 'widgetsData', newData)
          this.UiBoard.canvas.remove(group)
          resolve({
            groupId
          })
          this.$emit('change', {
            data: this.getData()
          })
        })
      })
    },
    /**
     * 取消合并
    */
    unmerge (itemId, isActive) {
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          const $group = this.$refs[itemId] && this.$refs[itemId][0]
          if (!$group || $group.type !== 'group') {
            return
          }
          const $groupItems = $group.widget.getObjects()
          const oldGroupItemsArr = $group.items || []
          const oldGroupItemsMap = {}
          const newGroupItems = []
          const newGroupItemIds = []
          let newData = []
          $group.widget.toActiveSelection()
          if (isActive !== true) {
            this.UiBoard.canvas.discardActiveObject()
          }
          oldGroupItemsArr.forEach(v => {
            oldGroupItemsMap[v.id] = v
          })
          $groupItems.forEach(v => {
            const $widget = v
            const item = oldGroupItemsMap[v.id]
            if (oldGroupItemsMap[v.id]) {
              const id = v4()
              newGroupItems.push(Object.assign({}, item, {
                id,
                left: $widget.left,
                top: $widget.top,
                scale: $widget.scaleX,
                rotate: $widget.angle,
                width: $widget.width,
                height: $widget.height
              }))
              newGroupItemIds.push(id)
            }
            this.UiBoard.canvas.remove($widget)
          })
          newData = this.widgetsData.filter(v => {
            return v.id !== itemId
          })
          newData = newData.concat(newGroupItems)
          this.$set(this, 'widgetsData', newData)
          this.UiBoard.canvas.remove($group.widget)
          resolve({
            itemIds: newGroupItemIds
          })
          this.$emit('change', {
            data: this.getData()
          })
        })
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

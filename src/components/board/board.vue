<template>
  <div class="board" :style="{width: `${innerWidth}px`, height: `${innerHeight}px`}">
    <canvas :id="id"></canvas>
    <component
      v-if="isReady"
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
  </div>
</template>
<script>
import { fabric } from 'fabric'
import { v4 } from 'uuid'
import boardItems from './board-items'

export default {
  name: 'UiBoard',
  props: {
    width: {
      type: [String, Number],
      default: 100
    },
    height: {
      type: [String, Number],
      default: 100
    },
    zoom: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      innerWidth: null,
      innerHeight: null,
      innerZoom: null,
      innerData: [],
      selectedItems: [],
      id: v4(),
      isReady: false
    }
  },
  computed: {
    dataMap () {
      const result = {}
      this.innerData.forEach(v => {
        result[v.id] = v
      })
      return result
    }
  },
  provide () {
    return {
      Board: this
    }
  },
  watch: {
    zoom (val) {
      this.setZoom(val)
    },
    width (val) {
      this.setWidth(val)
    },
    height (val) {
      this.setHeight(val)
    }
  },
  mounted () {
    this.board = new fabric.Canvas(this.id, {
      enableRetinaScaling: false
    })
    this.board.on('selection:created', (e) => {
      this.handleRefreshSelected(e.selected)
    })
    this.board.on('selection:cleared', (e) => {
      this.handleRefreshSelected([])
    })
    this.board.on('selection:updated', (e) => {
      this.handleRefreshSelected(e.selected)
    })
    this.isReady = true
  },
  created () {
    this.setZoom(this.zoom)
    this.setWidth(this.width)
    this.setHeight(this.height)
    this.setData(JSON.parse(JSON.stringify(this.data)) || [])
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
    /**
     * 新增画板项目时触发
    */
    handleItemCreate (item, {widget}) {
      this.board.add(widget)
    },
    /**
     * 移除画板项目时触发
    */
    handleItemDestroy (item, {widget}) {
      this.board.remove(widget)
    },
    /**
     * 刷新选中项
    */
    handleRefreshSelected (selected) {
      const ids = []
      selected.forEach(v => {
        ids.push(v.id)
      })
      this.$set(this, 'selectedItems', ids)
      if (ids.length > 0) {
        this.$emit('selected', {
          selectedIds: ids
        })
      }
    },
    /**
     * 旋转画板项目触发
    */
    handleItemRotating (item, data) {
      this.updateItem(item, data)
    },
    /**
     * 缩放画板项目触发
    */
    handleItemScaling (item, data) {
      this.updateItem(item, data)
    },
    /**
     * 移动画板项目触发
    */
    handleItemMoving (item, data) {
      this.updateItem(item, data)
    },
    /**
     * 更新画板项目
    */
    updateItem (item, data) {
      console.log(data)
      for (let i in data) {
        this.$set(item, i, data[i])
      }
      this.$emit('change', {
        data: this.getData()
      })
    },
    /**
     * 设置画板宽度
    */
    setWidth (width) {
      width = parseFloat(width)
      if (isNaN(width)) {
        return
      }
      this.innerWidth = width
      this.$nextTick(() => {
        this.board.setWidth(width)
      })
    },
    /**
     * 设置画板高度
    */
    setHeight (height) {
      height = parseFloat(height)
      if (isNaN(height)) {
        return
      }
      this.innerHeight = height
      this.$nextTick(() => {
        this.board.setHeight(height)
      })
    },
    /**
     * 设置缩放
    */
    setZoom (zoom) {
      if (isNaN(zoom)) {
        return
      }
      this.innerZoom = zoom
      this.$nextTick(() => {
        this.board.setZoom(zoom)
      })
    },
    /**
     * 获取所有选中画板项目
    */
    getSelecteds () {
      return [].concat(this.selectedItems)
    },
    /**
     * 设置画板数据
    */
    setData (data) {
      if (!Array.isArray(data)) {
        return
      }
      this.$set(this, 'innerData', data)
    },
    /**
     * 获取画板数据
    */
    getData () {
      return [].concat(this.innerData)
    },
    /**
     * 合并选区中的项目
    */
    mergeSelectionItems () {
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          const activeSelection = this.board.getActiveObject()
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
                this.board.setActiveObject($item[0].widget)
              }
            })
            resolve(result)
          })
        })
      })
    },
    /**
     * 拆分选区中的项目
    */
    unmergeSelectionItems () {
      this.$nextTick(() => {
        const group = this.board.getActiveObject()
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
              canvas: this.board
            })
            const {type, objects, ...opts} = groupOpts
            activeSelection.set(opts)
            activeSelection.setCoords()
            this.board.setActiveObject(activeSelection)
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
            canvas: this.board
          })
          const group = activeSelection.toGroup()
          this.board.discardActiveObject(this.board.getActiveObject())
          const mergeItems = []
          const newData = [].concat(this.innerData)
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
          this.$set(this, 'innerData', newData)
          this.board.remove(group)
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
            this.board.discardActiveObject()
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
            this.board.remove($widget)
          })
          newData = this.innerData.filter(v => {
            return v.id !== itemId
          })
          newData = newData.concat(newGroupItems)
          this.$set(this, 'innerData', newData)
          this.board.remove($group.widget)
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
     * 刷新画板
    */
    refresh () {
      this.$nextTick(() => {
        this.board.requestRenderAll()
      })
    }
  }
}
</script>
<style>
  .board{
    position: relative;
  }
  .canvas-container{
    position: relative;
    z-index: 3;
  }
</style>

<template>
  <div :class="['ui-book-designer', `ui-book-designer-${type}`]">
    <ui-board class="ui-book-designer__board"
      :width="width"
      :height="height"
      :zoom="zoom"
      :data="data"
      @page-dropactivate="handlePageDropactivate"
      @page-dragenter="handlePageDragenter"
      @page-dragleave="handlePageDragleave"
      @page-drop="handlePageDrop"
      @widget-change="handleWidgetChange"
    ></ui-board>
    <div class="ui-book-designer__fakepages"></div>
  </div>
</template>
<script>
import UiBoard from '../board'

export default {
  name: 'UiBookDesigner',
  components: {
    UiBoard
  },
  props: {
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    zoom: {
      type: Number
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: 'merge',
      validator (val) {
        return ['merge', 'separate'].indexOf(val) >= 0
      }
    }
  },
  computed: {
    isSeparate () {
      return this.type === 'separate'
    }
  },
  methods: {
    handlePageDropactivate (evt) {
      this.$emit('page-dropactivate', evt)
    },
    handlePageDragenter (evt) {
      this.$emit('page-dragenter', evt)
    },
    handlePageDragleave (evt) {
      this.$emit('page-dragleave', evt)
    },
    handlePageDrop (evt) {
      this.$emit('page-drop', evt)
    },
    handleWidgetChange (evt) {
      this.$emit('widget-change', evt)
    }
  }
}
</script>

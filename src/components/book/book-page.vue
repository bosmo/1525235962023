<template>
  <ui-board
    class="ui-book-page"
    :width="width"
    :height="height"
    :zoom="zoom"
    :items="items"
    :bgImageUrl="bgImageUrl"
    :bgImageRepeat="bgImageRepeat"
    :bgImageLeft="bgImageLeft"
    :bgImageTop="bgImageTop"
    :bgColor="bgColor"
    @dropactivate="handleDropactivate"
    @dragenter="handleDragenter"
    @dragleave="handleDragleave"
    @drop="handleDrop"
    @item-selected="handleItemSelected"
    @item-scaling="handleItemChange('scaling', $event)"
    @item-moving="handleItemChange('moving', $event)"
    @item-rotating="handleItemChange('rotating', $event)"
  ></ui-board>
</template>
<script>
import UiBoard from '../board'
export default {
  name: 'UiBookPage',
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
    items: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    handleDropactivate (evt) {
      this.$emit('page-dropactivate', evt)
    },
    handleDragenter (evt) {
      this.$emit('page-dragenter', evt)
    },
    handleDragleave (evt) {
      this.$emit('page-dragleave', evt)
    },
    handleDrop (evt) {
      this.$emit('page-drop', evt)
    },
    handleItemChange (type, evt) {
      this.$emit('item-change', {
        type,
        ...evt
      })
    },
    handleItemSelected (evt) {
      this.$emit('item-selected', evt)
    }
  }
}
</script>

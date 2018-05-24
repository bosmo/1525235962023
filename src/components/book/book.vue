<template>
  <div
    :class="['ui-book']"
    :style="renderStyle()"
  >
    <ui-book-page
      v-for="(page, index) in data"
      :key="index"
      v-bind="page"
      :zoom="zoom"
      @item-change="handlePageItemChange"
    ></ui-book-page>
    <div class="ui-book__fakepages"></div>
  </div>
</template>
<script>
import UiBookPage from './book-page'

export default {
  name: 'UiBook',
  components: {
    UiBookPage
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
    }
  },
  methods: {
    renderStyle () {
      const width = this.width * this.zoom
      const height = this.height * this.zoom
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    },
    handlePageItemChange (evt) {
      this.$emit('item-change', evt)
    }
  }
}
</script>

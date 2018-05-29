<template>
  <div
    :class="['ui-book']"
    :style="renderStyle()"
  >
    <ui-book-page
      v-bind="currentPage"
      :zoom="zoom"
      @item-deselect="handlePageItemDeselect"
      @item-selected="handlePageItemSelected"
      @item-change="handlePageItemChange"
    ></ui-book-page>
    <ui-book-page-select
      :value="currentPageIndex"
      :items="selectPageData"
      @changed="handlePageChanged"
    ></ui-book-page-select>
  </div>
</template>
<script>
import UiBookPage from './book-page'
import UiBookPageSelect from './book-page-select'

export default {
  name: 'UiBook',
  components: {
    UiBookPageSelect,
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
    pages: {
      type: Array,
      default: () => {
        return []
      }
    },
    currentPageIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    selectPageData () {
      const result = []
      if (this.pages) {
        this.pages.forEach((v, i) => {
          result.push({
            text: v.title,
            value: i
          })
        })
      }
      return result
    },
    currentPage () {
      if (this.pages) {
        return this.pages[this.currentPageIndex]
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
    handlePageChanged ({item}) {
      this.$emit('page-index-changed', {
        pageIndex: item.value
      })
    },
    handlePageItemSelected (evt) {
      this.$emit('page-item-selected', evt)
    },
    handlePageItemDeselect (evt) {
      this.$emit('page-item-deselect', evt)
    },
    handlePageItemChange (evt) {
      this.$emit('page-item-change', evt)
    }
  }
}
</script>

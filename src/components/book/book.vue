<template>
  <div class="ui-book">
    <ui-board
      :items="currentPage"
      :width="boardWidth"
      :height="boardHeight"
      :zoom="zoom"
      @item-selected="handleItemSelected"
      @item-deselect="handleItemDeselect"
      @item-scaling="handleItemChange('scaling', $event)"
      @item-moving="handleItemChange('moving', $event)"
      @item-rotating="handleItemChange('rotating', $event)"
    ></ui-board>
    <ui-book-page-select
      :value="pageIndex"
      :items="selectPageData"
      @changed="handlePageIndexChanged"
    ></ui-book-page-select>
  </div>
</template>
<script>
import _ from 'lodash'
import UiBoard from '../board'
import UiBookPageSelect from './book-page-select'

export default {
  name: 'UiBook',
  components: {
    UiBoard,
    UiBookPageSelect
  },
  props: {
    zoom: {
      type: Number
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    pagesData () {
      let data1 = []
      let data2 = []
      let data3 = {}
      _.each(this.data, v => {
        if (v.type === 'cover' || v.type === 'backCover' || v.type === 'backbone') {
          data1.push(v)
        } else {
          if (v.type === 'insideCover' || v.type === 'insideBackCover') {
            data3[v.type] = v
          }
          data2.push(v)
        }
      })
      data2 = _.chunk(data2, 2)
      _.each(data2, v => {
        const hasInsideCover = _.find(v, {type: 'insideCover'})
        const hasInsideBackCover = _.find(v, {type: 'insideBackCover'})
        if (!hasInsideCover) {
          v.unshift(data3['insideCover'])
        }
        if (!hasInsideBackCover) {
          v.unshift(data3['insideBackCover'])
        }
      })
      return _.concat([], [data1], data2)
    },
    currentPage () {
      return this.pagesData[this.pageIndex]
    },
    boardHeight () {
      let result = 0
      _.each(this.currentPage, v => {
        if (v.height > result) {
          result = v.height
        }
      })
      return result
    },
    boardWidth () {
      let result = 0
      _.each(this.currentPage, v => {
        if (_.includes(['cover', 'backCover', 'backbone', 'insideCover', 'insideBackCover'], v.type)) {
          result += v.width
        }
      })
      return result
    },
    selectPageData () {
      return _.map(this.pagesData, (v1, i1) => {
        const titles = _.map(v1, v2 => {
          return v2.title
        })
        return {
          value: i1,
          text: titles.join('~')
        }
      })
    }
  },
  methods: {
    handlePageIndexChanged ({value}) {
      this.$emit('page-index-changed', {
        pageIndex: value
      })
    },
    handleItemSelected (evt) {
      this.$emit('page-item-selected', evt)
    },
    handleItemDeselect (evt) {
      this.$emit('page-item-deselect', evt)
    },
    handleItemChange (type, evt) {
      this.$emit('page-item-change', {
        type,
        ...evt
      })
    }
  }
}
</script>
<style lang="less">
.ui-book{
  display: inline-block;
  .ui-board{
    box-shadow: 0 0 12px rgba(0,0,0,.1);
  }
  .ui-board-region--backbone{
    border-left: 1px dashed #ccc;
    border-right: 1px dashed #ccc;
    box-sizing: border-box;
    position: relative;
    z-index: 3;
    &:before{
      content: '';
      position: absolute;
      left: -100px;
      width: 100px;
      bottom: 0;
      top: 0;
      background-image: -o-linear-gradient(left, rgba(0,0,0,0), #000);
      background-image: -ms-linear-gradient(left, rgba(0,0,0,0), #000);
      background-image: -moz-linear-gradient(left, rgba(0,0,0,0), #000);
      background-image: -webkit-linear-gradient(left, rgba(0,0,0,0), #000);
      opacity: .12;
    }
    &:after{
      content: '';
      position: absolute;
      right: -100px;
      width: 100px;
      bottom: 0;
      top: 0;
      background-image: -o-linear-gradient(right, rgba(0,0,0,0), #000);
      background-image: -ms-linear-gradient(right, rgba(0,0,0,0), #000);
      background-image: -moz-linear-gradient(right, rgba(0,0,0,0), #000);
      background-image: -webkit-linear-gradient(right, rgba(0,0,0,0), #000);
      opacity: .12;
    }
  }
  .ui-board-region--page{
    &:after{
      content: '';
      position: absolute;
      right: 0;
      width: 100px;
      bottom: 0;
      top: 0;
      background-image: -o-linear-gradient(left, rgba(0,0,0,0), #000);
      background-image: -ms-linear-gradient(left, rgba(0,0,0,0), #000);
      background-image: -moz-linear-gradient(left, rgba(0,0,0,0), #000);
      background-image: -webkit-linear-gradient(left, rgba(0,0,0,0), #000);
      opacity: .15;
    }
  }
  .ui-board-region--page + .ui-board-region--page{
    &:after{
      content: '';
      position: absolute;
      left: 0;
      width: 100px;
      bottom: 0;
      top: 0;
      background-image: -o-linear-gradient(right, rgba(0,0,0,0), #000);
      background-image: -ms-linear-gradient(right, rgba(0,0,0,0), #000);
      background-image: -moz-linear-gradient(right, rgba(0,0,0,0), #000);
      background-image: -webkit-linear-gradient(right, rgba(0,0,0,0), #000);
      opacity: .15;
    }
  }
}
</style>

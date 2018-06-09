<template>
  <div class="ui-book-page-select">
    <span v-if="showPrevBtn" class="ui-book-page-select__prev" @click="handlePrevClick"></span>
    <el-popover
      ref="popover"
      class="ui-book-page-select__menu"
      placement="top"
      popper-class="ui-book-page-select__menu-popover"
      width="auto"
      trigger="click"
    >
      <span class="ui-book-page-select__menu-reference" slot="reference">{{currentItem.text}}</span>
      <ul class="ui-book-page-select__menu-list">
        <li
          :class="['ui-book-page-select__menu-item', {'is-active': value === item.value}]"
          v-for="item in items"
          :key="item.value"
          @click="handlePageChange(item)"
        >
          {{item.text}}
        </li>
      </ul>
    </el-popover>
    <span v-if="showNextBtn" class="ui-book-page-select__next" @click="handleNextClick"></span>
  </div>
</template>
<script>
import { Popover } from 'element-ui'

export default {
  name: 'UiBookPageSelect',
  components: {
    ElPopover: Popover
  },
  props: {
    value: {
      type: null
    },
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    currentItem () {
      let item = {}
      if (this.items) {
        this.items.some(v => {
          if (v.value === this.value) {
            item = v
          }
        })
      }
      return item
    },
    currentItemIndex () {
      let index = -1
      if (this.items) {
        this.items.some((v, i) => {
          if (v.value === this.value) {
            index = i
          }
        })
      }
      return index
    },
    showPrevBtn () {
      return this.currentItemIndex > 0
    },
    showNextBtn () {
      return this.currentItemIndex < this.items.length - 1
    }
  },
  methods: {
    handlePageChange ({value}) {
      this.$emit('changed', {
        value
      })
      this.$refs.popover.doClose()
    },
    handlePrevClick () {
      const index = Math.max(0, this.currentItemIndex - 1)
      this.$emit('changed', {
        value: this.items[index]['value']
      })
    },
    handleNextClick () {
      const index = Math.min(this.items.length - 1, this.currentItemIndex + 1)
      this.$emit('changed', {
        value: this.items[index]['value']
      })
    }
  }
}
</script>
<style lang="less">
  .ui-book-page-select{
    margin-top: 12px;
  }
  .ui-book-page-select__prev,
  .ui-book-page-select__next{
    cursor: pointer;
    display: inline-block;
    width: 0;
    height: 0;
    border: 9px solid rgba(63,70,82,.3);
    border-top-color: transparent;
    border-bottom-color: transparent;
    vertical-align: top;
    margin-top: 2px;
  }
  .ui-book-page-select__prev{
    border-left: 0;
  }
  .ui-book-page-select__next{
    border-right: 0;
  }
  .ui-book-page-select__menu{
    display: inline-block;
    vertical-align: top;
    margin-left: 6px;
    margin-right: 6px;
  }
  .ui-book-page-select__menu-reference{
    display: inline-block;
    cursor: pointer;
    color: rgba(63,70,82,.5);
    text-shadow: 1px 1px 0 #fff;
  }
  .ui-book-page-select__menu-popover{
    padding: 0;
    min-width: auto;
  }
  .ui-book-page-select__menu-list{
    list-style: none;
    max-height: 240px;
    min-width: 100px;
    padding: 6px 0;
    margin: 0;
  }
  .ui-book-page-select__menu-item{
    height: 24px;
    line-height: 24px;
    cursor: pointer;
    padding: 6px 18px;
    &:hover{
      background-color: #f3f3f3;
    }
    &.is-active{
      background-color: #ecf5ff;
      color: #66b1ff;
    }
  }
</style>

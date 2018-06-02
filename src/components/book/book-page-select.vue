<template>
  <el-popover
    ref="popover"
    class="ui-book-page-select"
    placement="top"
    width="200"
    trigger="hover"
  >
    <span slot="reference">{{currentItem.text}}</span>
    <ul class="ui-book-page-select__list">
      <li v-for="item in items" :key="item.value" @click="handlePageChange(item)">
        {{item.text}}
      </li>
    </ul>
  </el-popover>
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
    }
  },
  methods: {
    handlePageChange (item) {
      this.$emit('changed', {
        item
      })
      this.$refs.popover.doClose()
    }
  }
}
</script>
<style lang="less">
  .ui-book-page-select{
    display: block;
  }
</style>

<template>
  <div :class="['ui-book-designer', `ui-book-designer-${type}`]">
    <ui-board class="ui-book-designer__board" :width="width" :height="height" :zoom="zoom"></ui-board>
    <div class="ui-book-designer__pages"></div>
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
  }
}
</script>

<template>
  <div>
    <ui-rule-base :width="width" :height="height" :workspaceWidth="workspaceWidth" :workspaceHeight="workspaceHeight"></ui-rule-base>
  </div>
</template>
<script>
import UiRuleBase from './ruler-base'

export default {
  name: 'UiRuler',
  inheritAttrs: false,
  components: {
    UiRuleBase
  },
  props: {
    width: Number,
    height: Number,
    workspaceWidth: {
      type: Number,
      default: 0
    },
    workspaceHeight: {
      type: Number,
      default: 0
    }
  },
  methods: {
  }
}
</script>

<template>
  <div id="app">
    <button @click="handleUnmergeClick">打散</button>
    <button @click="handleGroupClick">组合</button>
    <button @click="handleZoomOut">放大</button>
    <button @click="handleZoomIn">缩小</button>
    <div class="test-board" ref="testBoard">
      <ui-board
        v-if="ready"
        :width="width"
        :height="height"
        :zoom="zoom"
        ref="board"
        :data="data"
        @selected="handleSelected"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PagetTest',
  data () {
    return {
      ready: false,
      zoom: 1,
      realWidth: 3000,
      realHeight: 1500,
      width: 0,
      height: 0,
      data: [
        {
          'type': 'text',
          'id': 'aaa',
          'width': 100,
          'height': 33.89999999999999,
          'left': 344.2622950819672,
          'top': 409.83606557377055,
          'scale': 6.632930964805933,
          'rotate': 0,
          'props': {
            'fontSize': 30,
            'shadow': {
              'color': '#f00',
              'offsetX': 4,
              'offsetY': 5
            },
            'text': 'test'
          }
        },
        {
          'type': 'text',
          'id': 'bbb',
          'width': 100,
          'height': 33.89999999999999,
          'left': 955.1420589320542,
          'top': 500.0000000000001,
          'scale': 6.632930964805933,
          'rotate': 0,
          'props': {
            'fontSize': 30,
            'shadow': {
              'color': '#f00',
              'offsetX': 4,
              'offsetY': 5
            },
            'text': 'test'
          }
        },
        {
          'type': 'text',
          'id': 'ccc',
          'width': 100,
          'height': 33.89999999999999,
          'left': 691.672131147541,
          'top': 716.5573770491803,
          'scale': 9.089132558896974,
          'rotate': 0,
          'props': {
            'fontSize': 30,
            'shadow': {
              'color': '#f00',
              'offsetX': 4,
              'offsetY': 5
            },
            'text': 'test'
          }
        }
      ]
    }
  },
  mounted () {
    // this.zoom = this.$refs.testBoard.clientWidth / this.width
    // this.width *= this.zoom
    // this.height *= this.zoom
    window.addEventListener('resize', () => {
      this.zoomToViewport()
    })
    this.zoomToViewport()
    this.ready = true
  },
  methods: {
    zoomToViewport () {
      const boardParentWidth = this.$refs.testBoard.clientWidth
      const boardParentHeight = this.$refs.testBoard.clientHeight
      let width = this.realWidth
      let height = this.realHeight
      if (this.width > boardParentWidth) {
        width = boardParentWidth
        height = width * this.height / this.width
      }
      if (height > boardParentHeight) {
        let height1 = boardParentHeight
        let width1 = height1 * width / height
        height = height1
        width = width1
      }
      console.log(width)
      console.log(height)
      this.width = width
      this.height = height
      this.zoom = width / this.realWidth
    },
    zoomTo () {

    },
    handlePageItemChange (evt) {
      console.log('afewfw')
    },
    handleZoomOut () {

    },
    handleZoomIn () {

    },
    handleUnmergeClick () {
      this.$refs.board.unmergeSelectionItems()
    },
    handleGroupClick () {
      this.$refs.board.mergeSelectionItems()
    },
    handleSelected ({item, data}) {
      console.log('bbb')
    },
    handleDeselect ({item, data}) {
      for (let i in data) {
        this.$set(item, i, data[i])
      }
    }
  }
}
</script>

<style>
.test-board{
  position: absolute;
  top: 100px;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
.board{
  border: 1px solid #ddd;
  margin-left: auto;
  margin-right: auto;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>

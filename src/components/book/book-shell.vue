<template>
  <div class="ui-book-shell">
    <div class="ui-book-shell__inner">
      <div class="ui-book-shell__main">
        <slot></slot>
      </div>
      <div class="ui-book-shell__fakeleft"></div>
      <div class="ui-book-shell__fakeright"></div>
      <div class="ui-book-shell__fakebottom"></div>
      <div class="ui-book-shell__embossleft"></div>
      <div class="ui-book-shell__embossright"></div>
      <div class="ui-book-shell__spinetop"></div>
      <div class="ui-book-shell__spinebottom"></div>
      <div class="ui-book-shell__divider"></div>
    </div>
    <div class="ui-book-shell__shadowleft"></div>
    <div class="ui-book-shell__shadowright"></div>
  </div>
</template>
<script>
export default {
  name: 'UiBookShell'
}
</script>
<style lang="less">
.ui-book-shell{
  display: inline-block;
  position: relative;
}
.ui-book-shell__inner{
  display: inline-block;
  padding: 0px 16px 5px 16px;
  background-color: #31383b;
  box-shadow: #666 0px 0px 10px;
  position: relative;
  z-index: 2;
}
.ui-book-shell__main{
  display: inline-block;
  margin-top: -4px;
}
.ui-book-shell__fakeleft{
  left: 8px;
  transform-origin: left top;
  transform: skewY(-20deg);
  background: -webkit-repeating-linear-gradient(to right, #aaa, #aaa 1px, #fff 1px, #fff 2px);
  background: -o-repeating-linear-gradient(to right, #aaa, #aaa 1px, #fff 1px, #fff 2px);
  background: -moz-repeating-linear-gradient(to right, #aaa, #aaa 1px, #fff 1px, #fff 2px);
  background: repeating-linear-gradient(to right, #aaa, #aaa 1px, #fff 1px, #fff 2px);
  width: 8px;
  height: calc(100% - 4px);
  position: absolute;
  top: -1px;
  z-index: 3;
}
.ui-book-shell__fakeright{
  right: 8px;
  transform-origin: right top;
  transform: skewY(20deg);
  background: -webkit-repeating-linear-gradient(to right, #aaa, #aaa 1px, #fff 1px, #fff 2px);
  background: -o-repeating-linear-gradient(to right, #aaa, #aaa 1px, #fff 1px, #fff 2px);
  background: -moz-repeating-linear-gradient(to right, #aaa, #aaa 1px, #fff 1px, #fff 2px);
  background: repeating-linear-gradient(to right, #aaa, #aaa 1px, #fff 1px, #fff 2px);
  width: 8px;
  height: calc(100% - 4px);
  position: absolute;
  top: -1px;
  z-index: 3;
}
.ui-book-shell__fakebottom{
  background: -webkit-linear-gradient(to bottom, #aaa, #aaa 50%, #fff 50%, #fff);
  background: -o-linear-gradient(to bottom, #aaa, #aaa 50%, #fff 50%, #fff);
  background: -moz-linear-gradient(to bottom, #aaa, #aaa 50%, #fff 50%, #fff);
  background: linear-gradient(to bottom, #aaaaaa,#aaaaaa 50%,#ffffff 50%,#ffffff);
  background-size: 100% 2px;
  width: calc(100% - 16px);
  position: absolute;
  bottom: 5px;
  height: 6px;
  left: 8px;
  z-index: 1
}
.ui-book-shell__embossleft,
.ui-book-shell__embossright{
  position: absolute;
  overflow: hidden;
  width: 40px;
  height: calc(100% - 5px);
  top: -4px;
  left: auto;
  right: 0px;
  opacity: 0.3;
  z-index: 2
}
.ui-book-shell__embossleft{
  background-image: -o-linear-gradient(left, rgba(0,0,0,0), #000);
  background-image: -ms-linear-gradient(left, rgba(0,0,0,0), #000);
  background-image: -moz-linear-gradient(left, rgba(0,0,0,0), #000);
  background-image: -webkit-linear-gradient(left, rgba(0,0,0,0), #000);
  left: calc(50% - 40px)
}
.ui-book-shell__embossright{
  background-image: -o-linear-gradient(right, rgba(0,0,0,0), #000);
  background-image: -ms-linear-gradient(right, rgba(0,0,0,0), #000);
  background-image: -moz-linear-gradient(right, rgba(0,0,0,0), #000);
  background-image: -webkit-linear-gradient(right, rgba(0,0,0,0), #000);
  left: 50%
}
.ui-book-shell__spinetop{
  position: absolute;
  left: 50%;
  bottom: -1px;
  z-index: 5;
  background: #31383b;
  width: 14px;
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
  height: 8px;
  margin-left: -7px;
}
.ui-book-shell__spinebottom{
  position: absolute;
  width: 20px;
  height: 1px;
  bottom: -1px;
  background: #31383b;
  left: 50%;
  margin-left: -10px;
  z-index: 5;
}
.ui-book-shell__divider{
  background: grey;
  width: 2px;
  position: absolute;
  left: 0;
  height: calc(100% - 7px);
  right: 0;
  bottom: 0;
  top: -14px;
  margin: auto;
  opacity: 0.5;
  z-index: 3;
}

.ui-book-shell__shadowleft,.ui-book-shell__shadowright {
  position: absolute;
  content: "";
  bottom: 15px;
  left: 10px;
  width: 50%;
  top: 60%;
  max-width: 300px;
  background: #777;
  -webkit-box-shadow: 0 17px 10px #777;
  -moz-box-shadow: 0 17px 10px #777;
  box-shadow: 0 17px 10px #777;
  -webkit-transform: rotate(-3deg);
  -moz-transform: rotate(-3deg);
  -o-transform: rotate(-3deg);
  -ms-transform: rotate(-3deg);
  transform: rotate(-3deg)
}

.ui-book-shell__shadowright {
  -webkit-transform: rotate(3deg);
  -moz-transform: rotate(3deg);
  -o-transform: rotate(3deg);
  -ms-transform: rotate(3deg);
  transform: rotate(3deg);
  right: 10px;
  left: auto
}
</style>

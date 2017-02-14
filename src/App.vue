<template>
<div id="app">
  <transition :name="transitionName" mode="out-in">
    <keep-alive>
      <router-view class="router-view"></router-view>
    </keep-alive>
  </transition>
  <router-view name="popup"></router-view>
</div>
</template>

<script>
    export default {
      data () {
        return {
          transitionName: 'slide-left'
        }
      },
      watch: {
        '$route' (to, from) {
          const toDepth = to.path.split('/').length
          const fromDepth = from.path.split('/').length
          this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
      }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
  *{
      padding: 0;
      margin: 0;
  }
  html, body{
    width: 100%;
    height: 100%;
    font-family:  '微软雅黑', Tahoma, Arial, Roboto, "Droid Sans", "Helvetica Neue", "Droid Sans Fallback", "Heiti SC", sans-self;
  }
  textarea,input{
    resize: none;
    font-family:  '微软雅黑', Tahoma, Arial, Roboto, "Droid Sans", "Helvetica Neue", "Droid Sans Fallback", "Heiti SC", sans-self;
  }
  select{
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    border: none;
    outline: none;
    background:#fff;
    font-family:  '微软雅黑', Tahoma, Arial, Roboto, "Droid Sans", "Helvetica Neue", "Droid Sans Fallback", "Heiti SC", sans-self;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
  .router-view {
    position: absolute;
    transition: all .4s cubic-bezier(.55,0,.1,1);
  }
  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(300px, 0);
    transform: translate(300px, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-300px, 0);
    transform: translate(-300px, 0);
  }
</style>

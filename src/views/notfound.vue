<template>
  <div class="nofoundpage">
    <mt-header title="科荣软件" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </div>
    </mt-header>
    <div class="cont">
      <img slot="icon" src="../assets/nofound.png">
      <h1>404</h1>
      <div class="line"></div>
      <p class="descText">抱歉，您访问的页面暂时出了点小问题</p>
      <div class="button">
        <mt-button @click.native="$router.replace({name: 'index'})" size="normal" type="primary">重新加载</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Button, Header } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  export default {
    name: 'noFoundPage',
    data () {
      return {}
    },
    components: {
      'mt-button': Button,
      'mt-header': Header
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .nofoundpage{
    width:100%;
    .mint-header-title{
      font-size:18px;
    }
    .cont{
      margin-top:40px;
      padding-top:45px;
      width:100%;
      img{
        width:100px;
        display:block;
        margin:0px auto 10px;
      }
      h1{
        font-size:100px;
        text-align:center;
        color:#26a2ff;
        font-weight: lighter;
        margin-bottom:10px;
        @media screen and (min-width:360px) {
          font-size:120px;
        }
        @media screen and (min-width:400px) {
          font-size:140px;
        }
      }
      div.line{
        width:66%;
        margin:0 auto;
        background:#c1c1c1;
        height:1px;
      }
      p.descText{
        color:#c1c1c1;
        text-align:center;
        margin:20px 0 35px;
        @media screen and (min-width:360px) {
          font-size:18px;
        }
        @media screen and (min-width:400px) {
          font-size:20px;
        }
      }
      div.button{
        width:100%;
        text-align:center;
        button{
          @media screen and (min-width:360px) {
            width:120px;
            height:50px;
          }
          @media screen and (min-width:400px) {
            width:140px;
            height:55px;
          }  
        }
      }
    }
    .mint-header{
      background-color:#fff;
      color:#333;
      border-bottom:1px #dedede solid;
    }
  }
</style>

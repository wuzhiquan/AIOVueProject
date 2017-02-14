<template>
<div class="login_page">
  <img src="../assets/loginLogo.png" alt="" class="logo">
  <div class="login_box">
    <!-- <h1>科荣软件</h1> -->
    <mt-field placeholder="请输入用户名" type="text" v-model="name"></mt-field>
    <mt-field placeholder="请输入密码" type="password" v-model="password"></mt-field>
    <mt-button size="large" type="primary" @click.native="login">登陆</mt-button>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import { Toast, Indicator, Button, Field } from 'mint-ui'
import 'mint-ui/lib/toast/style.css'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/button/style.css'
import 'mint-ui/lib/field/style.css'
var data = {name: '', password: ''}
export default {
  name: 'login',
  components: {
    'mt-button': Button,
    'mt-field': Field
  },
  data: function () {
    return data
  },
  mounted: function () {
    // 在进入登陆页面的时候去拉取全局的状态数据
    data.name = this.$store.state.user.name
    data.password = this.$store.state.user.password
  },
  methods: {
    ...mapActions(['signin']),
    'login': function (event) {
      Indicator.open({
        text: '登陆中...',
        spinnerType: 'snake'
      })
      this.signin(data).then(data => {
        Indicator.close()
        // code为OK时表示登陆成功
        if (data.code === 'OK') {
          this.$router.replace({name: 'index'})
        } else {
          Toast({message: '登陆失败', duration: 1000})
        }
      }).catch(error => {
        Indicator.close()
        Toast({message: error.message, duration: 1000})
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  $background-color: #fff;
  $button-color: #3bd8ff;
  $border-color: #bbb;
  $font-color: #333;
  .logo{
    max-width: 500px;
    width: 100%;
    padding: 5.7rem 0 1rem 0;
    margin: 0 auto;
    display: block;
  }
  .login_box{
    input::-webkit-input-placeholder {
      color:$border-color;
    }
    input::-moz-placeholder{
      color:$border-color;
    }
    input::-moz-placeholder{
      color:$border-color;
    }
    input:-ms-input-placeholder{
      color:$border-color;
    }
  }
  .login_page{
    width: 100%;
    height: 100%;
    background: $background-color;
    min-height:380px;
    .login_box{
        width: 62.6%;
        margin: 0 auto;
        padding: 0 0 0;
        background: $background-color;
      h1{
        color: $font-color;
        text-align: center;
        margin-bottom: 4rem;
        font-size: 34px;
      }
      .mint-field{
        border-bottom:1px solid $border-color;
      }
      .mint-button--primary{
        background: $button-color;
      }
      .mint-cell-wrapper{
        background: $background-color;
        input{
          background: $background-color;
          color:$font-color;
        }
      }
      .mint-button{
        margin-top: 1.6rem;
      }
    }
  }
</style>

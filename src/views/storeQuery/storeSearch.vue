<template>
  <div class="storeSearchWrap" @touchmove.stop="touchmove($event)">
    <mt-header title="搜索" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </div>
    </mt-header>
    <div class="searchCond">
      <mt-field label="商品名称" v-model="GoodsFullName" placeholder="请输入商品名称"></mt-field>
      <mt-field label="商品编号" v-model="GoodsNumber" placeholder="请输入商品编号"></mt-field>
      <mt-field label="商品规格" v-model="GoodsSpec" placeholder="请输入商品规格"></mt-field>
      <mt-field label="商品批号" v-model="BatchNo" placeholder="请输入商品批号"></mt-field>
      <mt-field label="仓库名称" v-model="StockFullName" placeholder="请输入仓库名称"></mt-field>
      <mt-cell title="结存数量为零不显示">
        <mt-switch v-model="switchValue"></mt-switch>
      </mt-cell>
      <input type="hidden" :value="getLastQty">
      <p class="remind">提示：多个查询请用英文逗号隔开</p>
      <div class="button">
        <span @click="clearAll">清除</span>
        <mt-button @click.native='searchFn' type="primary" size="small">筛选</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Header, Button, Cell, Toast, Field, Switch } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/search/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/field/style.css'
  import 'mint-ui/lib/switch/style.css'
  import { mapActions } from 'vuex'
  export default {
    name: 'workflowSearch',
    data () {
      return {
        switchValue: true,
        StockFullName: '', // 仓库查询
        GoodsNumber: '',  // 商品编号查询
        GoodsFullName: '', // 商品名称查询
        GoodsSpec: '', // 商品规格查询
        BatchNo: '', // 批号查询
        lastQty: 0 // 结存数量查询, 默认为0
      }
    },
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-field': Field,
      'mt-cell': Cell,
      'mt-switch': Switch
    },
    methods: {
      ...mapActions(['popupSelect']),
      'touchmove': function (event) {
        event.preventDefault()
      },
      'searchFn': function () {
        window.console.log(this.$route.params.$emit)
        if (this.$route.params.$emit === undefined) {
          Toast({message: '操作异常，请返回列表重新操作！', duration: 2000})
        } else {
          this.$route.params.$emit('searchFn', this._data)
          this.$router.go(-1)
        }
      },
      'clearAll': function () {
        this.BatchNo = ''
        this.GoodsFullName = ''
        this.GoodsNumber = ''
        this.GoodsSpec = ''
        this.StockFullName = ''
        this.switchValue = true
      }
    },
    computed: {
      getLastQty: function () {
        this.lastQty = this.switchValue ? 0 : 1
      }
    },
    created () {
    },
    beforeRouteEnter (to, from, next) {
      setTimeout(function () {
        var docum = document.getElementsByClassName('mint-loadmore-content')
        var height = window.document.documentElement.clientHeight - 0
        if (docum[0]) {
          docum[0].style.height = height + 'px'
        }
      }, 500)
      // 阻止鼠标滚动事件
      var body = document.getElementsByTagName('body')[0]
      body.setAttribute('onmousewheel', 'return false;')
      next(true)
    },
    beforeRouteLeave (to, from, next) {
      var docum = document.getElementsByClassName('mint-loadmore-content')
      if (docum[0]) {
        docum[0].style.height = 100 + '%'
      }
      // 解除鼠标滚动事件
      var body = document.getElementsByTagName('body')[0]
      body.removeAttribute('onmousewheel')
      next(true)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scope>
  $border-color: #cfcfcf;
  .storeSearchWrap {
    position:absolute;
    bottom:0;
    left:0;
    z-index:100;
    background: rgba(128,128,128,.6);
    height: 100%;
    width: 100%;
    .searchCond {
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
      background:#fff;
      margin-top:40px;
      .button{
        width:100%;
        text-align:center;
        padding: 12px 0;
        position:relative;
        button{
          width:80px;
          height:36px;
        }
        span{
          display:inline-block;
          position:absolute;
          height:36px;
          line-height:36px;
          font-size:14px;
          left: 50%;
          right: 50%;
          margin-left: -85px;
          width:40px;
        }
      }
      .remind{
        font-size:12px;
        padding:4px 16px 0;
        color: #bdbdbd;
      }
      .mint-cell{
        padding:0 16px;
      }
      .mint-cell:last-child{
        background-image:none;
      }
      .mint-cell-wrapper{
        background-image:none;
        padding:0;
        border-bottom:1px solid #e8e8e8;
      }
      .mint-switch-core{
        height:26px;
        width:46px;
        border-radius:18px;
      }
      .mint-switch-core::after{
        height:24px;
        width:24px;
      }
      .mint-switch-core::before{
        height:24px;
        width:44px
      }
    }
  }
</style>

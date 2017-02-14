<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="联系人查询" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.replace({name: 'CRMClientInfo'})">返回</mt-button>
    </div>
      <!-- <div slot="right">
        <mt-button @click="$router.push({name: 'CRMClientInfoDetSearch', params: bus})">查找</mt-button>
      </div> -->
    </mt-header>
  </mt-header>
  <div class="page_cont CRMDetdatalist_page">
    <form @submit.prevent="searchList">
      <div class="searchBar">
        <div class="mint-searchbar-inner">
          <i class="mintui mintui-search"></i>
          <input type="search" placeholder="搜索" class="mint-searchbar-core" v-model="keyWord">
        </div>
        <!-- <span @click="searchList">筛选</span> -->
      </div>
    </form>
    <div class="list_wrap">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" ref="loadmore" :autoFill="false">
        <div class="list_item" v-for='(item, index) in CRMDetdatalist' @click="detailData(item)">
          <p class="userName">
            <span>{{item.UserName}}</span>
            <img src="../../assets/CRM/female.png" alt="" v-if="item.Gender === '女'">
            <img src="../../assets/CRM/male.png" alt="" v-if="item.Gender === '男'">
          </p>
          <p v-if="item.Mobile || item.Telephone"><img src="../../assets/dt-tel.png" alt="" class="itemImg">
            <a :href="'tel:'+item.Mobile" style="text-decoration: none;color:#38c;outline:none;" @click="stopPropagation($event)" v-if="item.Mobile">{{item.Mobile}}</a>
            <a :href="'tel:'+item.Telephone" style="text-decoration: none;color:#38c;outline:none;" @click="stopPropagation($event)" v-else-if="item.Telephone">{{item.Telephone}}</a>
          </p>
          <p v-if="item.ClientName"><img src="../../assets/dt-company.png" alt="" class="itemImg">{{item.ClientName}}</p>
        </div>
      </mt-loadmore> 
    </div>
  </div>
  <transition :name="transitionName" mode="out-in">
    <keep-alive>
      <router-view class="router-view"></router-view>
    </keep-alive>
  </transition>
</div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Button, Header, Cell, Loadmore, Indicator, Toast, Field } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/indicator/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/field/style.css'
  import 'mint-ui/lib/loadmore/style.css'
  import 'mint-ui/lib/search/style.css'
  import Vue from 'vue'
  let bus = new Vue()
  let debounce = require('lodash/debounce')
  export default {
    name: 'CRMClientInfoDetList',
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-cell': Cell,
      'mt-field': Field,
      'mt-loadmore': Loadmore
    },
    data: function () {
      return {
        tableName: 'CRMClientInfoDet',
        transitionName: 'slide-left',
        CRMDetdatalist: [],
        UserName: '', // 联系人
        Mobile: '', // 手机
        Telephone: '', // 电话
        ClientName: '', // 客户名称
        pageNo: 1,
        keyWord: ''
      }
    },
    computed: {
      bus () {
        return bus
      }
    },
    methods: {
      ...mapActions(['reportQuery']),
      // 加载列表数据
      listData: function () {
        Indicator.open({text: '加载中...', spinnerType: 'snake'})
        let cond = {
          tableName: this.tableName,
          pageNo: this.pageNo,
          extraParam: {
            ClientName: this.ClientName,
            Mobile: this.Mobile,
            Telephone: this.Telephone,
            UserName: this.UserName
          }
        }
        this.CRMDetdatalist.splice(0, this.CRMDetdatalist.length)
        this.reportQuery(cond).then((obj) => {
          Indicator.close()
          obj.rows.forEach(item => {
            this.CRMDetdatalist.push(item)
          })
        }).catch(() => {
          Indicator.close()
        })
      },
      // 加载详情页数据
      'detailData': function (item) {
        this.$router.push({
          name: 'CRMClientInfoDetDetail',
          params: {
            tableName: this.tableName,
            keyId: item.keyId,
            ClientName: item.ClientName,
            ModuleId: item.ModuleId
          }
        })
      },
      // 下拉处理
      loadTop (id) {
        this.pageNo = 1
        this.CRMDetdatalist.splice(0, this.CRMDetdatalist.length)
        this.listData()
        this.$refs.loadmore.onTopLoaded(id)
      },
      // 上拉处理
      loadBottom (id) {
        let loadMore = this.$refs.loadmore
        let self = this
        setTimeout(() => {
          self.pageNo++
          let cond = {
            tableName: this.tableName,
            pageNo: this.pageNo,
            extraParam: {
              ClientName: this.ClientName,
              Mobile: this.Mobile,
              Telephone: this.Telephone,
              UserName: this.UserName
            }
          }
          self.reportQuery(cond).then((obj) => {
            console.log(obj)
            let oldList = self.CRMDetdatalist
            let oldListLength = oldList.length
            obj.rows.forEach(item => {
              oldList.push(item)
            })
            loadMore.onBottomLoaded(id)
            if (oldListLength === self.CRMDetdatalist.length) {
              Toast({message: '没有更多了', duration: 1000})
            }
          })
        }, 1000)
      },
      // 阻止冒泡
      stopPropagation: function (event) {
        console.log(event)
        event.stopPropagation()
      },
      searchList: function () {
        this.ClientName = this.keyWord
        this.Mobile = this.keyWord
        this.Telephone = this.keyWord
        this.UserName = this.keyWord
        this.pageNo = 1
        this.CRMDetdatalist.splice(0, this.CRMDetdatalist.length)
        this.listData()
      },
      debounceSearch: debounce(function () {
        this.searchList()
      }, 500)
    },
    created () {
      this.bus.$on('searchFn', data => {
        console.log(data)
        this.ClientName = data.ClientName
        this.Mobile = data.Mobile
        this.Telephone = data.Telephone
        this.UserName = data.UserName
        this.pageNo = 1
        this.CRMDetdatalist.splice(0, this.CRMDetdatalist.length)
        this.listData()
      })
    },
    watch: {
      keyWord: function (newKeyWord) {
        this.debounceSearch()
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.pageNo === 1) {
          vm.listData()
        }
      })
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scope>
  $background-color: #F0F0F0;
  .page_wrap{
    width: 100%;
    height:100%;
    background:$background-color;
    .CRMDetdatalist_page{
      padding-top:2.5rem;
      background:$background-color;
      .searchBar{
        background: #f7f7f7;
        padding: 6px;
        height: 40px;
        box-sizing: border-box;
        position: fixed;
        width: 100%;
        top: 40px;
        z-index: 1;
        .mint-searchbar-inner{
          width: 100%;
          box-sizing: border-box;
          float: left;
          height:28px;
          border-radius:8px;
          input{
            width:100%;
            font-size:14px;
            padding-left: 5px;
          }
        }
        span{
          display: block;
          float: right;
          width: 15%;
          color: #a9a9a9;
          text-align: center;
          height: 100%;
          line-height: 28px;
          font-size:14px;
        }
      }
      .mint-loadmore-top {
        margin-top: -50px;
      }
      .list_wrap{
        padding:0 10px;
        background:#fff;
        margin-top: 40px;
        .list_item{
          box-shadow: none;
          padding: 10px 10px 4px 12px;
          position:relative;
          margin-bottom:1px;
          border-bottom:1px solid #f4f4f4;
          p{
            min-height: 30px;
            margin-bottom: 6px;
            color: #8d8d8d;
            position: relative;
            line-height: 30px;
            padding-left: 35px;
            img.itemImg{
              width: 28px;
              position: absolute;
              left: 0px;
              top: 2px;
            }
          }
          p.userName{
            color:#333;
            padding-left:0;
            img{
              width:24px;
              margin-left:8px;
              position:relative;
              top:6px;
            }
          }
          span{
            font-size: 18px; 
          }
        } 
      }
    }
    .mint-header-title{
      font-size:18px;
    }
    .mint-tab-item-label{
      font-size:14px;
    }
    .mint-header{
      background-color:#fff;
      color:#333;
      border-bottom:1px #dedede solid;
    }
  }
</style>

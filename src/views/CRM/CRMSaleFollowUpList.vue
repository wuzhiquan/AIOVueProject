<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="联系记录" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.replace({name: 'CRMClientInfo'})">返回</mt-button>
    </div>
    </mt-header>
  </mt-header>
  <div class="CRMSaleFollowUpList_page">
    <form @submit.prevent="searchList">
      <div class="searchBar">
        <div class="mint-searchbar-inner">
          <i class="mintui mintui-search"></i>
          <input type="search" placeholder="跟单人/客户名称" class="mint-searchbar-core" v-model="keyWord">
        </div>
      </div>
    </form>
    <div class="list_wrap">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" ref="loadmore" :autoFill="false">
        <div class="list_item" v-for='(item, index) in datalist' @click="detailData(item)">
          <p class="EmpFullName">
            <span>{{item.EmpFullName}}</span>
            <em v-if="item.FollowPhase"></em>
            <span>{{item.FollowPhase}}</span>
            <span style="float:right">{{item.ContactTime}}</span>
            <span style="display:block;font-size: 16px;color: #000;">{{item.ClientName}}</span>
          </p>
          <p class="Content">{{item.Content}}</p>
        </div>
      </mt-loadmore> 
    </div>
  </div>
  <div @click="add" class="palette-button"></div>
</div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Button, Header, Loadmore, Indicator, Toast } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/indicator/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/loadmore/style.css'
  import 'mint-ui/lib/search/style.css'
  let debounce = require('lodash/debounce')
  export default {
    name: 'CRMSaleFollowUpList',
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-loadmore': Loadmore
    },
    data: function () {
      return {
        datalist: [],
        EmpFullName: '', // 跟单人
        ClientName: '', // 客户名称
        pageNo: 1,
        keyWord: ''
      }
    },
    methods: {
      ...mapActions(['reportQuery']),
      // 加载列表数据
      listData: function () {
        Indicator.open({text: '加载中...', spinnerType: 'snake'})
        let cond = {
          tableName: 'CRMSaleFollowUp',
          pageNo: this.pageNo,
          extraParam: {
            EmpFullName: this.EmpFullName,
            ClientName: this.ClientName,
            parentTableName: 'CRMClientInfo'
          }
        }
        this.datalist.splice(0, this.datalist.length)
        this.reportQuery(cond).then((obj) => {
          Indicator.close()
          console.log(obj)
          obj.rows.forEach(item => {
            this.datalist.push(item)
          })
        }).catch(() => {
          Indicator.close()
        })
      },
      // 加载详情页数据
      'detailData': function (item) {
        console.log(item)
        this.$router.push({
          name: 'CRMSaleFollowUpDetail',
          params: {keyId: item.keyId}
        })
      },
      'add': function () {
        this.$router.push({
          name: 'CRMSaleFollowUpAdd'
        })
      },
      // 下拉处理
      loadTop (id) {
        this.pageNo = 1
        this.datalist.splice(0, this.datalist.length)
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
            tableName: 'CRMSaleFollowUp',
            pageNo: this.pageNo,
            extraParam: {
              EmpFullName: this.EmpFullName,
              ClientName: this.ClientName,
              parentTableName: 'CRMClientInfo'
            }
          }
          self.reportQuery(cond).then((obj) => {
            console.log(obj)
            let oldList = self.datalist
            let oldListLength = oldList.length
            obj.rows.forEach(item => {
              oldList.push(item)
            })
            loadMore.onBottomLoaded(id)
            if (oldListLength === self.datalist.length) {
              Toast({message: '没有更多了', duration: 1000})
            }
          })
        }, 1000)
      },
      searchList: function () {
        this.EmpFullName = this.keyWord
        this.ClientName = this.keyWord
        this.pageNo = 1
        this.datalist.splice(0, this.datalist.length)
        this.listData()
      },
      debounceSearch: debounce(function () {
        this.searchList()
      }, 500)
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
<style>
  .palette-button{
    height:62px;
    width:62px;
    border-radius:50%;
    line-height:50px;
    text-align:center;
    position:fixed;
    right:1rem;
    bottom:1rem;
    color:#fff;
    font-size:20px;
    background: url(../../assets/goto.png);
    background-size:100% 100%;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scope>
  $background-color: #F0F0F0;
  .page_wrap{
    width: 100%;
    height:100%;
    background:$background-color;
    .CRMSaleFollowUpList_page{
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
          padding: 10px 6px 10px 6px;;
          position:relative;
          margin-bottom:1px;
          border-bottom:1px solid #f4f4f4;
          p.EmpFullName{
            color:#333;
            padding-left:0;
            margin:0;
            line-height: 24px;
            em{
              display:inline-block;
              width:3px;
              height:3px;
              border-radius:50%;
              background:#838d94;
              position: relative;
              top: -3px;
              margin: 0 4px;
            }
          }
          p.Content{
            line-height:24px;
            color:#3b3b3b;
            font-size:14px;
            margin:6px auto;
            overflow : hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient: vertical;
          }
          span{
            font-size: 13px; 
            color: #838d94;
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

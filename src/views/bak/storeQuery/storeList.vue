<template>
  <div class="page_wrap">
    <mt-header title="库存查询" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </div>
      <div slot="right">
        <mt-button @click="$router.push({name: 'storeSearch', params: bus})">查找</mt-button>
      </div>
    </mt-header>
    <div class="page_cont">
      <p class="firstPageNotData" v-if="firstPageNotData">暂无库存</p>
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" ref="loadmore" :autoFill="false">
        <div class="list_item" v-for="(item,index) in dataList" v-if="item.GoodsFullName">
          <p class="title"><em>{{index + 1}}.</em>{{item.GoodsFullName}}</p>
          <p>商品编号：{{item.GoodsNumber}}</p>
          <p>商品规格：{{item.GoodsSpec}}</p>
          <p>仓库：{{item.StockFullName}}</p>
          <p>批号：{{item.BatchNo}}</p>
          <p class="last_line">
              <span>结存数量：{{item.TotalQty === '' ? 0 : item.TotalQty}}</span>
              <span style="margin-left:5px;">单位：{{item.BaseUnit}}</span>
          </p>
        </div>
      </mt-loadmore>
    </div>
    <transition :name="transitionName" mode="out-in">
      <keep-alive>
        <router-view class="router-view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import { Button, Header, Cell, Loadmore, Indicator, Toast } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/loadmore/style.css'
  import 'mint-ui/lib/indicator/style.css'

  import { mapActions } from 'vuex'
  import Vue from 'vue'
  let bus = new Vue()
  export default {
    name: 'approve',
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-cell': Cell,
      'mt-loadmore': Loadmore
    },
    data: function () {
      return {
        dataList: [],
        firstPageNotData: false,
        transitionName: 'slide-left',
        pageNo: 1,
        pageSize: 10,
        BatchNo: '', // 批号查询
        StockFullName: '', // 仓库查询
        GoodsNumber: '',  // 商品编号查询
        GoodsFullName: '', // 商品名称查询
        GoodsSpec: '', // 商品规格查询
        BaseUnit: '', // 单位查询
        lastQty: 0 // 结存数量查询, 默认为0
      }
    },
    computed: {
      bus () {
        return bus
      }
    },
    methods: {
      ...mapActions(['reportQuery']),
      loadList () {
        let self = this
        Indicator.open({text: '加载中...', spinnerType: 'snake'})
        let cond = {
          reportNumber: 'ViewStoreDetail',
          pageNo: self.pageNo,
          pageSize: self.pageSize,
          extraParam: {
            lastQty: self.lastQty,
            BatchNo: self.BatchNo,
            'tblStock.StockFullName': self.StockFullName,
            'tblGoods.GoodsFullName': self.GoodsFullName,
            'tblGoods.GoodsNumber': self.GoodsNumber,
            'tblGoods.GoodsSpec': self.GoodsSpec,
            'tblGoods.BaseUnit': self.BaseUnit
          }
        }
        self.reportQuery(cond).then((obj) => {
          console.log(obj)
          Indicator.close()
          if (self.pageNo === 1 && (obj.rows.length === 1 || obj.rows.length === 0)) {
            self.firstPageNotData = true
          } else {
            self.firstPageNotData = false
          }
          obj.rows.forEach(item => {
            if (item.GoodsFullName !== '') {
              self.dataList.push(item)
            }
          })
        })
      },
      // 下拉处理
      loadTop (id) {
        this.pageNo = 1
        this.dataList.splice(0, this.dataList.length)
        this.loadList()
        this.$refs.loadmore.onTopLoaded(id)
      },
      // 上拉处理
      loadBottom (id) {
        let loadMore = this.$refs.loadmore
        let self = this
        setTimeout(() => {
          self.pageNo++
          let cond = {
            reportNumber: 'ViewStoreDetail',
            pageNo: self.pageNo,
            pageSize: self.pageSize,
            extraParam: {
              lastQty: self.lastQty,
              BatchNo: self.BatchNo,
              'tblStock.StockFullName': self.StockFullName,
              'tblGoods.GoodsFullName': self.GoodsFullName,
              'tblGoods.GoodsNumber': self.GoodsNumber,
              'tblGoods.GoodsSpec': self.GoodsSpec,
              'tblGoods.BaseUnit': self.BaseUnit
            }
          }
          self.reportQuery(cond).then((obj) => {
            console.log(obj)
            let oldList = self.dataList
            let oldListLength = oldList.length
            obj.rows.forEach(item => {
              if (item.GoodsFullName !== '') {
                oldList.push(item)
              }
            })
            loadMore.onBottomLoaded(id)
            if (oldListLength === self.dataList.length) {
              Toast({message: '没有更多了', duration: 1000})
            }
          })
        }, 1000)
      }
    },
    created () {
      this.loadList()
      this.bus.$on('searchFn', data => {
        window.console.log(data)
        this.BatchNo = data.BatchNo
        this.lastQty = data.lastQty
        this.pageNo = 1
        this.dataList.splice(0, this.dataList.length)
        for (var i = 0; i < data.dataList.length; i++) {
          switch (data.dataList[i].keyName) {
            case 'tblStock.StockFullName':
              this.StockFullName = data.dataList[i].select
              break
            case 'tblGoods.GoodsFullName':
              this.GoodsFullName = data.dataList[i].select
              break
            case 'tblGoods.GoodsNumber':
              this.GoodsNumber = data.dataList[i].select
              break
            case 'tblGoods.GoodsSpec':
              this.GoodsSpec = data.dataList[i].select
              break
            case 'tblGoods.BaseUnit':
              this.BaseUnit = data.dataList[i].select
              break
          }
        }
        this.loadList()
      })
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

<style lang="scss" rel="stylesheet/scss" scope>
  $background-color: #F0F1F5;
  .page_wrap{
    width: 100%;
    height:100%;
    background:$background-color;
    .page_cont{
      padding-top:2.5rem;
      background:$background-color;
    }
    .page_cont{ 
      .mint-loadmore-top {
        margin-top: -50px;
      }
      .firstPageNotData{
        background:#fff;
        color:#8d8d8d;
        padding:20px;
        text-align:center;
      }
      .list_item{
        background:#fff;
        border-bottom:1px solid #e8e8e8;
        padding: 20px 20px 10px;
        position:relative;
        p{
          margin-bottom:10px;
          color:#8d8d8d;
        }
        .title{
          font-size:18px;
          position:relative;
          color:#333;
          em{
            font-style:normal;
            margin-right:5px;
          }
        }
        .last_line{
          position:absolute;
          bottom:10px;
          right:20px;
          color:#333;
        }
      }
    }
    .mint-header-title{
      font-size:18px;
    }
    .mint-tab-item-label{
      font-size:14px;
    }
  }
</style>

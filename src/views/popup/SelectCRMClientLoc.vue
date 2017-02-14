<template>
<div class="page_wrap">
  <mt-header :title="title" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
  </mt-header>
  </mt-header>
  <div class="page_cont_page popup_crmclientloc">
    <div class="searchBar">
      <div class="mint-searchbar-inner">
        <i class="mintui mintui-search"></i>
        <input type="search" placeholder="搜索" class="mint-searchbar-core" v-model="keyword">
      </div>
    </div>
    <div class="list_wrap">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" ref="loadmore" :autoFill="false">
        <div class="list_item" v-for='item in list' @click="submit(item)">
          <div class="clientName">{{ item.CRMClientInfo_ClientName }}</div>
          <div class="addressInfo">
            <div class="address">{{ item.CRMClientInfo_Address }}</div>
            <div class="distanceInfo" v-if="item.CRMClientInfo_AddressLat && item.CRMClientInfo_AddressLng">
              <span class="distance">
                <img src="../../assets/CRM/outAttendance/location.png"> 
                {{ handleDistance(item.CRMClientInfo_Distance) }}
              </span>
            </div>
          </div>
        </div>
      </mt-loadmore> 
    </div>
  </div>
</div>
</template>


<script>
  import * as types from '../../store/modules/crmclientloc/types'
  import { mapActions, mapMutations, mapGetters, mapState } from 'vuex'
  import { Button, Header, Loadmore, Toast } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/loadmore/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/search/style.css'
  let debounce = require('lodash/debounce')
  export default {
    name: 'popup_crmclientloc',
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-loadmore': Loadmore
    },
    data () {
      return {}
    },
    computed: {
      title () {
        return this.$route.params.title || '选择客户'
      },
      keyword: {
        get () {
          return this.$store.state.crmclientloc.cond.keyword
        },
        set (value) {
          this.$store.commit(types.ResetCond, {pageNo: 1, keyword: value})
        }
      },
      ...mapState({
        list: state => state.crmclientloc.list
      })
    },
    methods: {
      ...mapGetters({cbMutationName: types.GetCbMutationName}),
      ...mapActions([types.FetchList]),
      ...mapMutations([types.ResetCond, types.EmptyList, types.IncreaseCondPage, types.DecreaseCondPage]),
      // 下拉刷新
      loadTop (id) {
        this[types.ResetCond]({pageNo: 1, keyword: this.keyword})
        this[types.EmptyList]()
        this[types.FetchList]().then(() => {
          this.$refs.loadmore.onTopLoaded(id)
        })
      },
      // 上拉加载
      loadBottom (id) {
        let oldListLength = this.list.length
        let loadMore = this.$refs.loadmore
        this[types.IncreaseCondPage]()
        this[types.FetchList]().then(() => {
          if (oldListLength === this.list.length) {
            Toast({message: '没有更多了', duration: 1000})
            this[types.DecreaseCondPage]()
          }
          loadMore.onBottomLoaded(id)
        })
      },
      handleDistance (distance) {
        if (distance < 1) {
          return '' + window.Math.round(new window.Number(distance) * 1000) + 'm'
        } else {
          return '' + new window.Number(distance).toFixed(3) + 'km'
        }
      },
      submit (client) {
        this.$store.commit(this.cbMutationName(), client)
        this.$router.go(-1)
      },
      debounceSearch: debounce(function () {
        this[types.EmptyList]()
        this[types.FetchList]()
      }, 500)
    },
    watch: {
      keyword: function (newKeyWord) {
        this.debounceSearch()
      }
    },
    created () {
      this[types.ResetCond]({pageNo: 1, keyword: '', AddressLat: this.$route.params.AddressLat, AddressLng: this.$route.params.AddressLng})
      this[types.EmptyList]()
      this[types.FetchList]()
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scope>
  $background-color: #F0F0F0;
  .page_wrap{
    width: 100%;
    height:100%;
    background:$background-color;
    .popup_crmclientloc{
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
        margin-top: 40px;
        .list_item{
          background:#fff;
          box-shadow: none;
          padding: 15px 12px 15px 10px;
          position:relative;
          margin-bottom:1px;
        }
        .clientName, .address, .distanceInfo {
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        .addressInfo {
          padding-top: 10px;
          font-size: 12px;
          width: 100%;
          overflow: hidden;
          color: #C8C8CD;
          .address {
            width: 75%;
            float: left;
          }
          .distanceInfo {
            width: 24%;
            float: right;
            text-align: right;
          }
          .distance {
            padding-left: 12px;
            position: relative;
            img {
              width: 11px;
              position: absolute;
              left: 0;
            }
          }
        }
      }
    }
    .mint-header-title{
      font-size:18px;
    }
    .mint-header{
      background-color:#fff;
      color:#333;
      border-bottom:1px #dedede solid;
    }
  }
</style>

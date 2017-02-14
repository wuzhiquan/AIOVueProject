<template>
<div class="page_wrap">
  <mt-header title="外勤列表" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
  </mt-header>
  </mt-header>
  <div class="page_cont_page outAttendance">
    <div class="list_wrap">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" ref="loadmore" :autoFill="false">
        <div class="list_item" v-for='item in list' @click="$router.push({name: 'OutAttendancedet', params: {keyId: item.keyId}})">
          <div class="clientName">{{ item.ClientName }}</div>
          <div class="sysInfo">
            <span class="sysName">{{ item.sysName}}</span>
            <span class="type">{{ item.Type }}</span>
            <span class="SignInTime">{{ item.SignInTime }} 签入</span>
            <div class="status" v-if="item.Status == 2">
              <img src="../../assets/CRM/outAttendance/signout.png" alt="">
              已签出
            </div>
          </div>
          <div class="signinInfo">
            <span class="signInAddress">
              {{ item.SignInAddress }}
            </span>
            <span class="signInDistance" v-if="item.SignInDistance < 5500000">
              相距&nbsp;{{ handleDistance(item.SignInDistance) }}
            </span>
            <img src="../../assets/CRM/outAttendance/locInfo.png" style="width:15px;position:absolute;left:0;top:8px;">
          </div>
        </div>
      </mt-loadmore> 
    </div>
  </div>
  <div @click="add" class="palette-button"></div>
</div>
</template>


<script>
  import * as types from '../../store/modules/outAttendance/types'
  import { mapActions, mapMutations, mapState } from 'vuex'
  import { Button, Header, Loadmore, Toast } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/loadmore/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/search/style.css'
  export default {
    name: 'OutAttendance',
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-loadmore': Loadmore
    },
    data () {
      return {}
    },
    computed: {
      ...mapState({
        list: state => state.outAttendance.list
      })
    },
    methods: {
      ...mapActions([types.FetchList, types.CountUnSignout]),
      ...mapMutations([types.ResetCond, types.EmptyList, types.IncreaseCondPage, types.DecreaseCondPage]),
      // 下拉刷新
      loadTop (id) {
        this[types.ResetCond]({pageNo: 1})
        this[types.EmptyList]()
        this[types.FetchList]().then(() => {
          this.$refs.loadmore.onTopLoaded(id)
        }).catch(() => {
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
        }).catch(() => {
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
      add () {
        this[types.CountUnSignout]().then(() => {
          this.$router.push({name: 'OutAttendancesignin'})
        }).catch(() => {
          Toast({message: '有未签出记录，请先签出!', duration: 1000})
        })
      }
    },
    activated () {
      if (this.list.length === 0) {
        this[types.FetchList]()
      }
    },
    created () {
      this[types.ResetCond]({pageNo: 1})
      this[types.EmptyList]()
      this[types.FetchList]()
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
    .outAttendance{
      padding-top:2.5rem;
      background:$background-color;      
      .mint-loadmore-top {
        margin-top: -50px;
      }
      .list_wrap{
        .list_item{
          background:#fff;
          box-shadow: none;
          padding: 16px 5px 16px 16px;
          position:relative;
          margin-bottom:1px;
        }
        .clientName, .sysInfo, .signinInfo, .signInAddress {
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        .sysInfo, .signinInfo {
          position: relative;
          padding-top: 10px;
          font-size: 12px;
          color: #949494;
          span {
            display:inline-block;
          }
        }
        .sysName {
          color: #40A9E5;
          padding-right: 5px;
        }
        .type {
          padding-right: 5px; 
        }
        .status{
          position: absolute;
          right: 0;
          top: 5px;
          font-size: 12px;
          color: black;
          img {
            width: 16px;
            vertical-align:middle;
            margin-bottom: 4px;
          }
        }
        .signinInfo {
          padding-left: 22px;
        }
        .signInAddress {
          width: 70%;
        }
        .signInDistance {
          width: 30%;
          position: absolute;
          padding-left: 10px;
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

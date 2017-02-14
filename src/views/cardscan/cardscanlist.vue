<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="名片管理" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.replace({name: 'index'})">返回</mt-button>
    </div>
      <div slot="right">
        <mt-button @click="openActionSheet">添加</mt-button>
      </div>
    </mt-header>
  </mt-header>
  <div class="page_cont carscanlist_page">
    <div class="list_wrap">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" ref="loadmore" :autoFill="false">
        <div class="list_item" v-for='item in carscanlist' @click="det(item.keyId)" v-if="item.ComContactor">
          <div class="status" v-if="item.Status == 2">
            <img src="../../assets/cardscanStatus.png" alt="">
            {{statusVal(item.Status)}}
          </div>
          <p>
            <img src="../../assets/dt-name.png" alt="">
            {{item.ComContactor}}
          </p>
          <p v-if="item.ComContactorMobile">
            <img src="../../assets/dt-tel.png" alt="">
            <a @click.stop :href="'tel:'+item.ComContactorMobile"
                style="text-decoration: none;color:#38c;outline:none;">
              {{item.ComContactorMobile}}
            </a>
          </p>
          <p v-if="item.ComName">
            <img src="../../assets/dt-company.png" alt="">
            {{item.ComName}}
          </p>
        </div>
      </mt-loadmore> 
    </div>
  </div>
  <div ref="_actionSheet">
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
  </div>
</div>
</template>

<script>
  import * as types from '../../store/modules/cardscan/types'
  import { mapActions, mapMutations, mapGetters, mapState } from 'vuex'
  import { Button, Header, Cell, Loadmore, Actionsheet, Field, Toast } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/actionsheet/style.css'
  import 'mint-ui/lib/field/style.css'
  import 'mint-ui/lib/loadmore/style.css'
  import 'mint-ui/lib/toast/style.css'
  export default {
    name: 'cardscan',
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-cell': Cell,
      'mt-actionsheet': Actionsheet,
      'mt-field': Field,
      'mt-loadmore': Loadmore
    },
    data () {
      return { sheetVisible: false }
    },
    computed: {
      actions () {
        return [
          { name: '手动录单', method: this.addPre },
          { name: '名片扫描', method: this.isWX() ? this.openAlbum : undefined }
        ]
      },
      ...mapState({
        carscanlist: state => state.cardscan.list,
        tableName: state => state.cardscan.cond.tableName
      })
    },
    methods: {
      ...mapGetters(['isWX', types.StatusEnum]),
      ...mapActions([types.FetchList, types.BindAlbum, types.ChooseCamera]),
      ...mapMutations([types.ResetCond, types.EmptyList, types.IncreaseCondPage, types.DecreaseCondPage]),
      // 下拉刷新
      loadTop (id) {
        this[types.ResetCond]({pageNo: 1})
        this[types.EmptyList]()
        this[types.FetchList]().then(() => {
          this.$refs.loadmore.onTopLoaded(id)
        })
      },
      // 上拉加载
      loadBottom (id) {
        let oldListLength = this.carscanlist.length
        let loadMore = this.$refs.loadmore
        this[types.IncreaseCondPage]()
        this[types.FetchList]().then(() => {
          if (oldListLength === this.carscanlist.length) {
            Toast({message: '没有更多了', duration: 1000})
            this[types.DecreaseCondPage]()
          }
          loadMore.onBottomLoaded(id)
        })
      },
      // 进入详情页
      det (keyId, addWay = 7) {
        this.$router.push({
          name: 'cardscandetail',
          params: { keyId, opType: 'detail' },
          query: {addWay}
        })
      },
      // 弹起ActionSheet
      openActionSheet () {
        this.sheetVisible = true
        if (!this.isWX()) { // 不是微信，使用input file上存文件
          let domEle = this.$refs._actionSheet.querySelector('.mint-actionsheet-listitem:nth-child(2)')
          this[types.BindAlbum]({ domEle, cb: obj => this.det(obj.keyId, 2) })
        }
      },
      // 微信上存图片
      openAlbum () {
        let jsApiList = ['chooseImage', 'uploadImage']
        this[types.ChooseCamera]({jsApiList, cb: obj => this.det(obj.keyId, 4)})
      },
      // 手动录单
      addPre () {
        this.$router.push({
          name: 'cardscandetail',
          params: {keyId: '-1', opType: 'add'}
        })
      },
      // 获取状态枚举值
      statusVal (status = 1) {
        return this[types.StatusEnum]()[status]
      }
    },
    created () {
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
    .carscanlist_page{
      padding-top:2.5rem;
      background:$background-color;
      .mint-loadmore-top {
        margin-top: -50px;
      }
      .list_wrap{
        padding:12px;
        .list_item{
          background:#fff;
          border-radius:6px;
          box-shadow: none;
          padding: 16px 20px 4px;
          position:relative;
          margin-bottom:15px;
          p{
            min-height: 30px;
            margin-bottom: 10px;
            color: #8d8d8d;
            position: relative;
            padding-left: 32px;
            line-height: 30px;;
            img{
              width: 28px;
              position: absolute;
              left: -7px;
              top: 2px;
            }
          }
          .status{
            position: absolute;
            right: 15px;
            top: 15px;
            font-size: 12px;
            color: #40A9E5;
            img {
              width: 14px;
              vertical-align:middle;
              margin-bottom: 4px;
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

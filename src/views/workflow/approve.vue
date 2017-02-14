<template>
  <div class="page_wrap" @touchstart.stop="touchstart($event)" @touchend.stop="touchend($event)">
    <mt-header title="审批" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.push({name: 'index'})">返回</mt-button>
      </div>
      <div slot="right">
        <mt-button @click="$router.push({name: 'workflowSearch', params: bus})">查找</mt-button>
      </div>
    </mt-header>
    <div class="page_cont myflow_page">
      <mt-navbar v-model="selectedId" fixed>
        <mt-tab-item v-for="(tab, index) in tabs" :id="tab.id" @click.native="tabChange(index)">{{ tab.title }}</mt-tab-item>
      </mt-navbar>
      <mt-loadmore :bottom-method="loadBottom" :top-method="loadTop" ref="loadmore" :autoFill="false" >
        <mt-tab-container v-model="selectedId">
          <mt-tab-container-item  v-for="(tab, index) in tabs" :id="tab.id">
            <div class="list_item" v-for="(item, index1) in tab.list" @click="detail(item)">
              <div class="left" v-if="index1 % 9 == 0"><img src="../../assets/headpic1.png"></div>
              <div class="left" v-if="index1 % 9 == 1"><img src="../../assets/headpic2.png"></div>
              <div class="left" v-if="index1 % 9 == 2"><img src="../../assets/headpic3.png"></div>
              <div class="left" v-if="index1 % 9 == 3"><img src="../../assets/headpic4.png"></div>
              <div class="left" v-if="index1 % 9 == 4"><img src="../../assets/headpic5.png"></div>
              <div class="left" v-if="index1 % 9 == 5"><img src="../../assets/headpic6.png"></div>
              <div class="left" v-if="index1 % 9 == 6"><img src="../../assets/headpic7.png"></div>
              <div class="left" v-if="index1 % 9 == 7"><img src="../../assets/headpic8.png"></div>
              <div class="left" v-if="index1 % 9 == 8"><img src="../../assets/headpic9.png"></div>
              <div class="middle">
                <p class="main_info">{{ item.applyBy }}<span>{{ item.currNodeName }}</span></p>
                <p class="title">{{ item.templateName }}</p>
                <p class="title">{{ item.applyContent}}</p>
              </div>
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
      </mt-loadmore>
    </div>
    <div @click="$router.push({name: 'workflow'})" class="palette-button"></div>
    <transition :name="transitionName" mode="out-in">
      <keep-alive>
        <router-view class="router-view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import { Button, Header, Navbar, TabItem, TabContainer, TabContainerItem, Cell, Loadmore, Toast, Indicator } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/navbar/style.css'
  import 'mint-ui/lib/tab-item/style.css'
  import 'mint-ui/lib/tab-container/style.css'
  import 'mint-ui/lib/tab-container-item/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/loadmore/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/indicator/style.css'

  import { mapActions } from 'vuex'
  import Vue from 'vue'
  let bus = new Vue()
  export default {
    name: 'approve',
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-navbar': Navbar,
      'mt-tab-item': TabItem,
      'mt-tab-container': TabContainer,
      'mt-tab-container-item': TabContainerItem,
      'mt-cell': Cell,
      'mt-loadmore': Loadmore
    },
    data: function () {
      return {
        tabs: [
                  {title: '待审核', id: 'transing', list: [], cond: {pageNo: 0, approveStatus: 'transing', tempFile: '', keyWord: ''}},
                  {title: '委托我', id: 'consignation', list: [], cond: {pageNo: 0, approveStatus: 'consignation', tempFile: '', keyWord: ''}},
                  {title: '办理中', id: 'transing2', list: [], cond: {pageNo: 0, approveStatus: 'transing2', tempFile: '', keyWord: ''}},
                  {title: '已办结', id: 'finish', list: [], cond: {pageNo: 0, approveStatus: 'finish', tempFile: '', keyWord: ''}}
        ],
        selected: 0,
        startX: 0,
        pageXDistance: window.document.documentElement.clientHeight / 4,
        transitionName: 'slide-left',
        tempFile: '',
        keyWord: ''
      }
    },
    computed: {
      selectedId: {
        get: function () {
          return this.tabs[this.selected].id
        },
        set: function (selectedId) {
          let vm = this
          this.tabs.forEach((item, index) => {
            if (item.id === selectedId) {
              vm.selected = index
              return false
            }
          })
        }
      },
      bus () {
        return bus
      }
    },
    methods: {
      ...mapActions(['myWorkflowQuery']),
      // 滑动开始处理
      'touchstart': function (event) {
        this.startX = event.targetTouches[0].pageX
      },
      // 滑动结束处理
      'touchend': function (event) {
        let distance = event.changedTouches[0].pageX - this.startX
        let to = -1
        if (distance + this.pageXDistance < 0 && this.selected !== this.tabs.length - 1) {
          to = (this.selected + 1) % this.tabs.length
        } else if (distance > this.pageXDistance && this.selected !== 0) {
          to = (this.selected - 1 + this.tabs.length) % this.tabs.length
        }
        if (to >= 0) {
          this.tabChange(to)
        }
      },
      // 上拉处理
      loadBottom (id) {
        let loadMore = this.$refs.loadmore
        let vm = this
        setTimeout(() => {
          let {cond, list: oldList} = vm.tabs[this.selected]
          cond.pageNo++
          cond.tempFile = this.tempFile
          cond.keyWord = this.keyWord
          vm.myWorkflowQuery(cond).then(({list}) => {
            let oldListLength = oldList.length
            list.forEach(item => {
              let id = item.id
              if (oldList.filter(item => item.id === id).length > 0) {
                ;
              } else {
                oldList.push(item)
              }
            })
            loadMore.onBottomLoaded(id)
            if (oldListLength === oldList.length) { Toast({message: '没有更多了', duration: 1000}) }
          }).catch(({message}) => {
            loadMore.onBottomLoaded(id)
            Toast({message: message, duration: 1000})
          })
        }, 1000)
      },
      // 下拉处理
      loadTop (id) {
        let {cond, list: oldList} = this.tabs[this.selected]
        cond.pageNo = 0
        oldList.splice(0, oldList.length)
        let vm = this
        this.tabChange(this.selected, () => { vm.$refs.loadmore.onTopLoaded(id) })
      },
      // tab 切换
      tabChange (index, cb) {
        this.selected = index
        let {cond, list: oldList} = this.tabs[index]
        cond.tempFile = this.tempFile
        cond.keyWord = this.keyWord
        if (cond.pageNo === 0) {
          Indicator.open({text: '加载中...', spinnerType: 'snake'})
          cond.pageNo++
          console.log(cond)
          this.myWorkflowQuery(cond).then(({list}) => {
            Indicator.close()
            list.forEach(item => oldList.push(item))
            if (cb) { cb() }
          }).catch(({message}) => {
            Indicator.close()
            Toast({message: message, duration: 1000})
          })
        }// end if
      },
      // 跳转到审核单据详情页
      'detail' ({tableName, billId, templateName}) {
        this.$router.push({ path: `/workflow/approvedetredirect/${tableName}/${billId}?title=${templateName}&opType=detail` })
      }
    },
    created () {
      this.tabChange(0)
      this.bus.$on('searchFn', data => {
        window.console.log(data)
        this.tempFile = data.dataList[0].select
        this.keyWord = data.keyWord
        for (let i = 0; i < this.tabs.length; i++) {
          this.tabs[i].cond.pageNo = 0
          this.tabs[i].list.splice(0, this.tabs[i].list.length)
        }
        this.tabChange(this.selected)
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
    .myflow_page{
      .mint-loadmore-top {
        margin-top: 0px;
      }
      .mint-navbar.is-fixed{
        top:40px;
      }
      .mint-tab-container{
        margin-top:1px;
      }
      .mint-tab-container-item{
        min-height:320px;
      }
      .mint-tab-container-wrap{
        /*margin-top:51px;*/
      }
      .list_item{
        background:#fff;
        border-bottom:1px solid #e8e8e8;
        padding:1.2rem 0.8rem;
        overflow:hidden;
        .left{
          float:left;
          width:50px;
          height:50px;
          border-radius:50%;
          overflow:hidden;
          img{
            width:100%;
            height:100%;
          }
        }
        .middle{
          padding-left:0.8rem;
          margin-top:6px;
          text-overflow: ellipsis;
          overflow:hidden;
          .main_info{
            font-size:12px;
            color:#9f9f9f;
            padding:0;
            span{
              margin-left:0.4rem;
            }
          }
          p.title{
            margin-top:0.4rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .mint-header-title{
      font-size:18px;
    }
    .is-selected .mint-tab-item-label{
      color: #26a2ff;
    }
    .mint-tab-item-label{
      font-size:14px;
      color:#b2b2b2;
    }
    .palette-button{
      height:62px;
      width:62px;
      border-radius:50%;
      line-height:50px;
      text-align:center;
      /*background:#26a2ff;*/
      position:fixed;
      right:1rem;
      bottom:1rem;
      color:#fff;
      font-size:20px;
      background: url(../../assets/goto.png);
      background-size:100% 100%;
    }
    .mint-header{
      background-color:#fff;
      color:#333;
      border-bottom:1px #dedede solid;
    }
  }
</style>

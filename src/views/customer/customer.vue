  <template>
    <div class="page_wrap" @touchstart.stop="touchstart($event)" @touchend.stop="touchend($event)">
      <mt-header title="我的客户" fixed>
           <div slot="right">
               <mt-button @click="add">添加</mt-button>
           </div>
           <div slot="left">
               <mt-button icon="more" @click="add">返回</mt-button>
           </div>
      </mt-header>

      <mt-actionsheet cancel-text="取消" :actions="actions" v-model="sheetVisible"></mt-actionsheet>
      <!--  -->
      <div class="page_cont myflow_page">
      <mt-navbar v-model="selectedId" fixed>
        <mt-tab-item v-for="(tab, index) in tabs" :id="tab.id" @click.native="tabChange(index)">
         </mt-tab-item>
      </mt-navbar> -->
      <!-- <mt-search autofocus  v-model="value" result="null"> </mt-search> -->

        <mt-loadmore :bottom-method="loadBottom" ref="loadmore" :autoFill="false" >
          <mt-tab-container v-model="selectedId" swipeable>
            <mt-tab-container-item  v-for="(tab, index) in tabs" :id="tab.id">

             
             <div class="list_item" v-for="item in tab.list" @click="detail(item)">             
            
                <div class="left"><img src="../../assets/man.png" alt=""></div>
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
      <div @click="$router.push({name: 'workflow'})" class="palette-button">+</div>
    </div>
  </template>

  <script>
    import { Button, Header, Navbar, TabItem, TabContainer, TabContainerItem, Cell, Loadmore, Toast, Indicator, MessageBox, Field, Actionsheet, Search } from 'mint-ui'
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
    import 'mint-ui/lib/actionsheet/style.css'
    import 'mint-ui/lib/field/style.css'
    import 'mint-ui/lib/search/style.css'
    import { mapActions } from 'vuex'
    export default {
      name: 'customer',
      components: {
        'mt-button': Button,
        'mt-header': Header,
        'mt-navbar': Navbar,
        'mt-tab-item': TabItem,
        'mt-tab-container': TabContainer,
        'mt-tab-container-item': TabContainerItem,
        'mt-cell': Cell,
        'mt-loadmore': Loadmore,
        'mt-messageBox': MessageBox,
        'mt-field': Field,
        'mt-actionsheet': Actionsheet,
        'mt-search': Search
      },
      data: function () {
        return {
          sheetVisible: false,
          value: '',
          actions: [{
            name: '查看',
            method: this.see()
          },
          {
            name: '修改',
            method: this.update()
          },
          {
            name: '删除',
            method: this.delete()
          }],
          tabs: [
                    {title: '我的客户', id: 'transing', list: [], cond: {pageNo: 0, approveStatus: 'transing'}}
          ],
          selected: 0,
          startX: 0,
          pageXDistance: window.document.documentElement.clientHeight / 4
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
        }
      },
      methods: {
        ...mapActions(['myWorkflowQuery']),
        // 查找
        'search': function () {
         // console.log('search')
          MessageBox.prompt(' ', '查找条件').then(({ value, action }) => {})
        },
        // 'delete': function () {
        //  // console.log('search')
        //  // MessageBox.prompt(' ', '确定删除').then(({ value, action }) => {})
        // },
        // 'update': function () {
        //  // console.log('search')
        // },
        'add': function () {
         // console.log('search')
        },
        detail (item) {
        },
        // 滑动开始处理
        'touchstart': function (event) {
          this.startX = event.targetTouches[0].pageX
        },
        // 滑动结束处理
        'touchend': function (event) {
          this.tabChange(this.selected)
        },
        // 下拉处理
        loadBottom (id) {
          let loadMore = this.$refs.loadmore
          let vm = this
          setTimeout(() => {
            let {cond, list: oldList} = vm.tabs[this.selected]
            cond.pageNo++
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
        // 上拉处理
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
          if (cond.pageNo === 0) {
            Indicator.open({text: '加载中...', spinnerType: 'snake'})
            cond.pageNo++
            this.myWorkflowQuery(cond).then(({list}) => {
              Indicator.close()
              list.forEach(item => oldList.push(item))
              if (cb) { cb() }
            }).catch(({message}) => {
              Indicator.close()
              Toast({message: message, duration: 1000})
            })
          }// end if
        }
      },
      created () {
        this.tabChange(0)
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
        margin-top:51px;
        }
        .list_item{
          background:#fff;
          border-bottom:1px solid #BABABA;
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
      .mint-tab-item-label{
        font-size:14px;
      }
      .mint-loadmore-top {
        margin-top: 0px;
      }
      .palette-button{
        height:50px;
        width:50px;
        border-radius:50%;
        line-height:50px;
        text-align:center;
        background:#26a2ff;
        position:fixed;
        right:1rem;
        bottom:1rem;
        color:#fff;
        font-size:20px;
      }
    }
  </style>

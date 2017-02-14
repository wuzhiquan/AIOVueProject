  <template>
    <div class="page_wrap"  >
      <mt-header title="我的客户" fixed>
        <div slot="left">
          <mt-button icon="back" >返回</mt-button> <!--  -->
        </div>
        <div slot="right">
          <mt-button icon="more" @click="detail1()"></mt-button>
        </div>
      </mt-header>
      <mt-actionsheet cancel-text="取消" :actions="action1" v-model="sheetVisible1">
      </mt-actionsheet>
       <mt-loadmore :bottom-method="loadBottom" ref="loadmore" :autoFill="false" >
      <div class="page_cont myflow_page">
      <div class="list_item" v-for="item in listData" @click="detail2(item)" >
        <div class="left"><img src="../../assets/man.png" alt=""></div>
        <div class="middle">
            <p class="title">{{ item.statusId }}</p>
            <p class="title">{{ item.ComFullName}}</p>
          </div>
      </div>
     </div>
     </mt-loadmore>
  </div>
  
  </template>

  <script>
    import { Field, Button, Header, MessageBox, Popup, Actionsheet, Navbar, TabItem, Cell, TabContainer, TabContainerItem, Indicator, Loadmore, Toast } from 'mint-ui'
    import 'mint-ui/lib/field/style.css'
    import 'mint-ui/lib/button/style.css'
    import 'mint-ui/lib/header/style.css'
    import 'mint-ui/lib/popup/style.css'
    import 'mint-ui/lib/actionsheet/style.css'
    import 'mint-ui/lib/navbar/style.css'
    import 'mint-ui/lib/tab-item/style.css'
    import 'mint-ui/lib/cell/style.css'
    import 'mint-ui/lib/tab-container/style.css'
    import 'mint-ui/lib/indicator/style.css'
    import 'mint-ui/lib/tab-container-item/style.css'
    import 'mint-ui/lib/loadmore/style.css'
    import 'mint-ui/lib/toast/style.css'
    import { mapActions } from 'vuex'
    export default {
      name: 'index',
      components: {
        'mt-field': Field,
        'mt-button': Button,
        'mt-header': Header,
        'mt-popup': Popup,
        'mt-actionsheet': Actionsheet,
        'mt-navbar': Navbar,
        'mt-tab-item': TabItem,
        'mt-tab-container': TabContainer,
        'mt-tab-container-item': TabContainerItem,
        'mt-cell': Cell,
        'mt-indicator': Indicator,
        'mt-messageBox': MessageBox,
        'mt-loadmore': Loadmore
      },
      computed: {
      },
      data: function () {
        return {
          sheetVisible1: false,
          selected: 0,
          startX: 0,
          pageXDistance: window.document.documentElement.clientHeight / 4,
          listData: [],
          cond: {pageNo: 1, tableName: 'tblCompany', moduleType: '2'},
          // listData: [{list: [], cond: {pageNo: 0, tableName: 'tblCompany', moduleType: '2'}}],
          action1: [{
            name: '查找',
            method: this.find
          },
          {
            name: '添加',
            method: this.add
          }],
          keyId: ''
        }
      },
      methods: {
        ...mapActions(['reportQuery']),
        ...mapActions(['detail']),
        'getList': function (cb) {
          this.reportQuery({tableName: 'tblCompany', moduleType: '2'}).then((data) => {
            console.log(data)
            this.listData = data.rows
            if (cb) { cb() }
          })
        },
        // 查找
        'find': function () {
         // console.log('search')
          if (this.sheetVisible1) {
            MessageBox.prompt(' ', '查找条件').then(({ value, action }) => {
              Indicator.open({ spinnerType: 'snake', text: '查找中...' })
              // console.log(value)
              this.reportQuery({tableName: 'tblCompany', moduleType: '2', extraParam: {ComNumber: value}}).then((data) => {
                console.log(data)
                this.listData = data.rows
                // console.log(data)
                Indicator.close()
              })
            })
          }
        },
        'add': function () {
         // console.log('search')
          if (this.sheetVisible1) {
            console.log('search')
            this.$router.push({name: 'add'})
          }
        },
        detail1 () {
          this.sheetVisible1 = true
        },
        detail2 ({keyId}) {
          // console.log(keyId)
          // console.log(tableName)
          this.$router.push({ path: `/customer/detail/tblCompany/${keyId}?opType=detail` })
        },
         // 下拉处理
        loadBottom (id) {
          let loadMore = this.$refs.loadmore
          let vm = this
          setTimeout(() => {
            // let {cond, list: oldList} = vm.listData
            let oldList = vm.listData
            // console.log(vm.listData)
            vm.cond.pageNo++
            // console.log(vm.cond)
            vm.reportQuery(vm.cond).then((obj) => {
              let oldListLength = oldList.length
              // console.log(oldListLength)
              obj.rows.forEach(item => {
                let id = item.keyId
                if (oldList.filter(item => item.keyId === id).length > 0) {
                  ;
                } else {
                  oldList.push(item)
                }
              })
              loadMore.onBottomLoaded(id)
              if (oldListLength === oldList.length) { Toast({message: '没有更多了', duration: 1000}) }
            }).catch(({message}) => {
              loadMore.onBottomLoaded(id)
              // console.log(message)
              Toast({message: message, duration: 1000})
            })
          }, 1000)
        },
         // 上拉处理
        loadTop (id) {
          let vm = this
          let oldList = vm.listData
          vm.cond.pageNo = 1
          oldList.splice(0, oldList.length)
          this.getList(vm.$refs.loadmore.onTopLoaded(id))
        }
      },
      created () {
        this.getList()
      }
    }
    </script>

  <style lang="scss" rel="stylesheet/scss" scope>
      $background-color: red;
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
        margin-top:0px;
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
        margin-top:0;
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
     /*   .main_info{
            font-size:12px;
            color:#9f9f9f;
            padding:0;
            span{
              margin-left:0.4rem;
            }
          } */
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
      }


  </style>

<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="客户列表" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.replace({name: 'CRMClientInfo'})">返回</mt-button>
    </div>
    <div slot="right">
      <mt-button @click="$router.push({name: 'CRMClientInfoSearch', params: bus})">查找</mt-button>
    </div>
  </mt-header>
  <div class="page_cont CRMlist_page">
    <div class="switchDiv">
      <p @click="switchModel = !switchModel">
        <span>
          {{modelName}}
          <img src="../../assets/CRM/down.png" width="20" v-if="!switchModel">
          <img src="../../assets/CRM/up.png" width="20" v-if="switchModel">
        </span>
      </p>
      <ul v-if="switchModel">
        <li v-for="option in modelArray" @click="chooseModel(option)">{{option.name}}</li>
      </ul>
    </div>
    <div class="list_wrap">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" ref="loadmore" :autoFill="false">
        <div class="list_item" v-for='(item, index) in dataList' @click="detailData(item)">
          <p class="ClientName">{{item.ClientName}}</p> 
          <p class="SourceInfo_p">
            <span class="SourceInfo" v-if="enumList.ClientSource.filter(field => field.value == item.SourceInfo)[0] && moduleListData.SourceInfo">{{enumList.ClientSource.filter(field => field.value == item.SourceInfo)[0].name}}</span>
            <span class="Status" v-if="enumList.ClientStatus.filter(field => field.value == item.Status)[0] && moduleListData.Status">{{enumList.ClientStatus.filter(field => field.value == item.Status)[0].name}}</span>
            <span class="ClientType" v-if="enumList.ClientStyle.filter(field => field.value == item.ClientType)[0] && moduleListData.ClientType">{{enumList.ClientStyle.filter(field => field.value == item.ClientType)[0].name}}</span>
          </p>
          <p class="createBy" v-if="item.createBy2 && moduleListData.createBy">创建人：{{item.createBy2}}</p>
          <p class="Emergency_p">
            <span class="left" v-if="enumList.ClientEmergency.filter(field => field.value == item.Emergency)[0] && moduleListData.Emergency">紧急程度：<span class="Emergency">{{enumList.ClientEmergency.filter(field => field.value == item.Emergency)[0].name}}</span></span>
            <span class="right" v-if="item.LastContractTime && moduleListData.LastContractTime">上次联系：<span class="LastContractTime">{{item.LastContractTime.substring(0,10)}}</span></span>
          </p>
          <!-- <em class="phone"></em> -->
        </div>
      </mt-loadmore>
    </div>
  </div>
  <div @click="add" class="palette-button"></div>
  <transition :name="transitionName" mode="out-in">
    <router-view class="router-view" :postInfo='tableInfo'></router-view>
  </transition>
</div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Button, Header, Cell, Loadmore, Indicator, Toast, Field } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/actionsheet/style.css'
  import 'mint-ui/lib/indicator/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/field/style.css'
  import 'mint-ui/lib/loadmore/style.css'
  import Vue from 'vue'
  let bus = new Vue()
  export default {
    name: 'CRMClientinfoList',
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-cell': Cell,
      'mt-field': Field,
      'mt-loadmore': Loadmore
    },
    data: function () {
      return {
        tableName: 'CRMClientInfo',
        transitionName: 'slide-left',
        dataList: [],
        ClientNo: '', // 客户编号
        ClientName: '', // 客户名称
        Introduce: '', // 介绍人
        SourceInfo: '', // 客户来源
        Status: '', // 生命周期
        Trade: '', // 客户行业
        ClientType: '', // 客户类型
        NextFollowTime: '', // 下次跟单时间
        Emergency: '', // 紧急程度
        createBy: '', // 所有者
        createTime: '', // 建立时间
        LastContractTime: '', // 上次联系时间
        LastFollowTime: '', // 最后跟单时间
        zycp: '', // 主营产品
        noRelationDay: '', // 未联系天数
        modelArray: [], // 客户资料模板
        selectModel: '1', // 默认选择模板ID
        modelName: '',
        keyId: '',
        sheetVisible: false,
        pageNo: 1,
        switchModel: false,
        moduleListData: {},
        tableInfo: '', // 客户资料模板表名字段的后面数字，用于枚举查询
        enumName: ['ClientStyle', 'ClientStatus', 'ClientSource', 'ClientEmergency'],
        enumList: {}
      }
    },
    computed: {
      tableName () {
        return 'CRMClientInfo'
      },
      bus () {
        return bus
      }
    },
    methods: {
      ...mapActions(['reportQuery', 'detail', 'addPre', 'getEnum']),
      // 加载列表数据
      listData: function () {
        Indicator.open({text: '加载中...', spinnerType: 'snake'})
        let cond = {
          tableName: this.tableName,
          pageNo: this.pageNo,
          extraParam: {
            ClientName: this.ClientName,
            Status: this.Status,
            ClientType: this.ClientType,
            Emergency: this.Emergency,
            SourceInfo: this.SourceInfo,
            ModuleId: this.selectModel
          }
        }
        this.reportQuery(cond).then((obj) => {
          Indicator.close()
          this.dataList = obj.rows
        })
        this.$data.modelArray.splice(0, this.$data.modelArray.length)
        this.reportQuery({reportNumber: 'CRMClientModule'}).then((obj) => {
          for (var i = 0; i < obj.rows.length; i++) {
            let _modelArray = {
              name: obj.rows[i].moduleName,
              value: obj.rows[i].id,
              list: obj.rows[i].listFields,
              tableInfo: obj.rows[i].tableInfo
            }
            this.$data.modelArray.push(_modelArray)
            if (obj.rows[i].id === this.$data.selectModel) {
              this.$data.modelName = obj.rows[i].moduleName
              let vm = this
              obj.rows[i].listFields.split(',').forEach(item => {
                if (item !== '') {
                  vm.moduleListData[item] = item
                }
              })
              this.tableInfo = obj.rows[i].tableInfo.split(':')[0].substring(13)
            }
          }
        })
        this.getEnumList(this.$data.tableInfo)
      },
      getEnumList: function (info) {
        // 加载枚举
        let vm = this
        this.enumName.forEach(function (item, index, e) {
          vm.getEnum(item + info).then(obj => {
            vm.enumList[item] = obj
          })
        })
      },
      // 加载详情页数据
      'detailData': function (item) {
        this.switchModel = false
        this.$router.push({
          name: 'CRMClientInfoDetail',
          params: {
            tableName: this.tableName,
            keyId: item.keyId,
            ModuleId: this.selectModel
          }
        })
      },
      'add': function () {
        this.$router.push({
          name: 'CRMClientInfoAdd',
          params: {
            ModuleId: this.selectModel,
            tableInfo: this.tableInfo
          }
        })
      },
      // 下拉处理
      loadTop (id) {
        this.pageNo = 1
        this.dataList.splice(0, this.dataList.length)
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
              Status: this.Status,
              ClientType: this.ClientType,
              Emergency: this.Emergency,
              SourceInfo: this.SourceInfo,
              ModuleId: this.selectModel
            }
          }
          self.reportQuery(cond).then((obj) => {
            let oldList = self.dataList
            let oldListLength = oldList.length
            obj.rows.forEach(item => {
              oldList.push(item)
            })
            loadMore.onBottomLoaded(id)
            if (oldListLength === self.dataList.length) {
              Toast({message: '没有更多了', duration: 1000})
            }
          })
        }, 1000)
      },
      chooseModel: function (option) {
        this.switchModel = !this.switchModel
        if (option.value === this.selectModel) {
          return
        }
        this.selectModel = option.value
        this.modelName = option.name
        this.pageNo = 1
        this.ClientName = ''
        this.Status = ''
        this.ClientType = ''
        this.Emergency = ''
        this.SourceInfo = ''
        let cond = {
          tableName: this.tableName,
          pageNo: this.pageNo,
          extraParam: {
            ClientName: this.ClientName,
            Status: this.Status,
            ClientType: this.ClientType,
            Emergency: this.Emergency,
            SourceInfo: this.SourceInfo,
            ModuleId: this.selectModel
          }
        }
        Indicator.open({text: '加载中...', spinnerType: 'snake'})
        this.dataList.splice(0, this.dataList.length)
        this.reportQuery(cond).then((obj) => {
          this.dataList = obj.rows
          Indicator.close()
        })
        let vm = this
        vm.moduleListData = {}
        let filterArr = option.list.split(',')
        filterArr.forEach(item => {
          if (item !== '') {
            vm.moduleListData[item] = item
          }
        })
        this.tableInfo = option.tableInfo.split(':')[0].substring(13)
        this.getEnumList(this.$data.tableInfo)
      }
    },
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    },
    created () {
      this.bus.$on('searchFn', data => {
        this.ClientName = data.ClientName
        let map = new Map()
        data.dataList.forEach(function (item, index, e) {
          map.set(item.keyName, item.select)
        })
        this.ClientType = map.get('ClientType')
        this.SourceInfo = map.get('SourceInfo')
        this.Emergency = map.get('Emergency')
        this.Status = map.get('Status')
        this.pageNo = 1
        this.dataList.splice(0, this.dataList.length)
        this.listData()
      })
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
    /*background:#26a2ff;*/
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
  $background-color: #F0F1F5;
  .page_wrap{
    width: 100%;
    height:100%;
    background:$background-color;
    .page_cont.CRMlist_page{
      padding-top:86px;
      background:$background-color;
      .switchDiv{
        text-align: center;
        position: fixed;
        top: 40px;
        height:40px;
        z-index: 1;
        width: 100%;
        p{
          height:46px;
          line-height:44px;
          font-size:16px;
          background: #fff;
          border-bottom:1px solid #efefef;
          span{
            display: inline-block;
            border-radius: 5px;
            border: 1px solid #efefef;
            padding: 0 12px;
            height: 30px;
            line-height: 30px;
            position:relative;
            img{
              position: absolute;
              top: 4px;
              right: -26px;
            }
          }
        }
        ul{
          width:170px;
          margin:0 auto;
          background:#ccc;
          list-style:none;
          border-radius:5px;
          background:#fff;
          border:1px solid #efefef;
          position: relative;
          top: -3px;
          padding:0 5px;
          li{
            border-bottom:1px solid #efefef;
            height:40px;
            line-height:40px;
            color:#757575;
            &:last-child{
              border-bottom:none;
            }
          }
          &:before{
            content: "";
            position: absolute;
            top: -21px;
            left: 50%;
            margin-left:-8px;
            width: 0px;
            height: 0px;
            z-index:1000;
            border: 10px solid transparent;
            border-bottom-color: #efefef;
          }
        }
      }
      .mint-loadmore-top {
        margin-top: -50px;
      }
      .list_wrap{
        .list_item{
          background:#fff;
          padding: 8px 12px 10px;
          margin-bottom:1px;
          position:relative;
          p{
            height:30px;
            line-height:30px;
            font-size:16px;
            span{
              margin-right:6px;
              font-size:14px;
            }
          }
          p.ClientName{
            overflow:hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p.SourceInfo_p{
            span{
              font-size:12px;
              display:inline-block;
              height:20px;
              line-height:20px;
              border: 1px solid #ccc;
              padding:0 6px;
              border-radius:3px;
            }
            span.SourceInfo{
              color:#ffa4a4;
              border-color:#ffa4a4;
            }
            span.Status{
              color:#8ee4ff;
              border-color:#8ee4ff;
            }
            span.ClientType{
              color:#97a8f7;
              border-color:#97a8f7;
            }
          }
          p.Emergency_p{
            color:#B2B1B5;
          }
          p.createBy{
            font-size:14px;
          }
          em.phone{
            background:url('../../assets/CRM/crm-phone.png');
            display:block;
            width:22px;
            height:24px;
            background-size:100% 100%;
            position:absolute;
            right: 16px;
            top: 40px;
          }
        }
      }
    }
    .mint-header-title{
      font-size:18px;
    }
  }
</style>

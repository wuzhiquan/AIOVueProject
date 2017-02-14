<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="销售订单" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.replace({name: 'CRMClientInfo'})">返回</mt-button>
    </div>
    <div slot="right">
      <mt-button @click="$router.push({name: 'SaleorderInfoSearch', params: bus})">查找</mt-button>
    </div>
  </mt-header>
  <!-- 模板先不管 -->
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
    <!-- 界面，也先不管 -->
    <div class="list_wrap">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" ref="loadmore" :autoFill="false">
        <div class="list_item" v-for='(item, index) in dataList' @click="detailData(item)">
          <p class="ClientName">{{item.ComFullName}}</p> <!-- 客户全称 -->
          <p class="SourceInfo_p">
            <span class="SourceInfo" v-if="item.DeptFullName">{{item.DeptFullName}}</span>
            <span class="Status" v-if="item.EmpFullName">{{item.EmpFullName}}</span>
            <span class="ClientType" v-if="item.statusId">{{item.statusId}}</span>
          </p>
          <p class="createBy" v-if="item.ComNumber">客户编号：{{item.ComNumber}}</p>
          <p class="Emergency_p">
            <span class="left" v-if="item.workFlowStatus">审核状态：<span class="Emergency">{{item.workFlowStatus}}</span></span>
            <span class="right" v-if="item.BillDate">单据日期：<span class="LastContractTime">{{item.BillDate}}</span></span>
          </p>
          <!-- <em class="phone"></em> -->
        </div>
      </mt-loadmore>
    </div>
  </div>
  <!-- 添加，也先不管 -->
  <div @click="add()" class="palette-button"></div>
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
        tableName: 'tblSalesOrder',
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
        // 我的
        khlx: '', // 客户类型
        ProduceStatus: '', // 订单状态
        InvoiceType: '', // 发票类型
        SelectCompanySales: '', // 客户
        ReportSelectDepartment: '', // 部门
        ReportSelectEmployee: '', // 经手人
        ReportSelectUser: '', // 制单人
        BillNo: '', // 单据编号
        // 分割线
        statusView: '', // 审核状态
        BillDate: '', // 单据日期
        // BillNo: '', // 单据编号
        ComFullName: '', // 客户全称
        ComFullNamen: '',
        ComNumber: '', // 客户编号
        DeptFullName: '', // 部门
        EmpFullName: '', // 经手人
        TotalTaxAmount: '', // 含税总额
        SaleAmount: '', // 发货金额
        AccName: '', // 收款账户
        AlrAccAmt: '', // 累計收款
        sysName: '', // 制单人
        statusId: '' // 订单状态
        // ReportSelectUser: '', // 发票类型

      }
    },
    computed: {
      tableName () {
        return 'tblSalesOrder'
      },
      bus () {
        return bus
      }
    },
    methods: {
      ...mapActions(['reportQuery', 'detail', 'addPre']),
      // 加载列表数据 先获取数据，先用自己的方法试试看
      listData: function () {
        Indicator.open({text: '加载中...', spinnerType: 'snake'})
        // let cond = {
        //   tableName: this.tableName,
        //   pageNo: this.pageNo,
        //   extraParam: {
        //     ClientName: this.ClientName,
        //     Status: this.Status,
        //     ClientType: this.ClientType,
        //     Emergency: this.Emergency,
        //     SourceInfo: this.SourceInfo,
        //     ModuleId: this.selectModel
        //   }
        // }
        let cond = {
          tableName: this.tableName,
          pageNo: this.pageNo,
          extraParam: {
            // 我的
            khlx: this.khlx, // 客户类型
            statusId: this.ProduceStatus, // 订单状态
            InvoiceType: this.InvoiceType, // 发票类型
            ComFullNamen: this.SelectCompanySales, // 客户
            DeptFullName: this.ReportSelectDepartment, // 部门
            EmpFullName: this.ReportSelectEmployee, // 经手人
            sysName: this.ReportSelectUser, // 制单人
            BillNo: this.BillNo// 单据编号
          }
        }
        // console.log(cond)
        this.reportQuery(cond).then((obj) => {
          Indicator.close()
          this.dataList = obj.rows
          // console.log(obj)
          // console.log(this.dataList)
        })
        // console.log(cond)
        // this.reportQuery(cond).then((obj) => {
        //   Indicator.close()
        //   this.dataList = obj.rows
        //   // console.log(obj.cols)
        // })
        // this.$data.modelArray.splice(0, this.$data.modelArray.length)
        // this.reportQuery({reportNumber: 'CRMClientModule'}).then((obj) => {
        //   // console.log(obj)
        //   for (var i = 0; i < obj.rows.length; i++) {
        //     let _modelArray = {
        //       name: obj.rows[i].moduleName,
        //       value: obj.rows[i].id
        //     }
        //     this.$data.modelArray.push(_modelArray)
        //     if (obj.rows[i].id === this.$data.selectModel) {
        //       this.$data.modelName = obj.rows[i].moduleName
        //     }
        //   }
        //   // console.log(this.$data.modelArray)
        // })
      },
      // 加载详情页数据
      'detailData': function (item) {
        // console.log(item.id)
        // console.log(item.keyId)
        this.$router.push({
          name: 'SaleorderInfoDetail',
          params: {
            tableName: this.tableName,
            keyId: item.keyId,
            ModuleId: this.selectModel
          }
        })
      },
      'add': function () {
        this.$router.push({
          name: 'SaleorderInfoAdd',
          params: {
            tableName: this.tableName,
            ModuleId: this.selectModel
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
              // ClientName: this.ClientName,
              // Status: this.Status,
              // ClientType: this.ClientType,
              // Emergency: this.Emergency,
              // SourceInfo: this.SourceInfo,
              // ModuleId: this.selectModel
            // 我的
              khlx: this.khlx, // 客户类型
              statusId: this.ProduceStatus, // 订单状态
              InvoiceType: this.InvoiceType, // 发票类型
              ComFullNamen: this.SelectCompanySales, // 客户
              DeptFullName: this.ReportSelectDepartment, // 部门
              EmpFullName: this.ReportSelectEmployee, // 经手人
              sysName: this.ReportSelectUser, // 制单人
              BillNo: this.BillNo// 单据编号
            }
          }
          self.reportQuery(cond).then((obj) => {
            // console.log(obj)
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
      // 这个其实没有，可以不做的
      chooseModel: function (option) {
        // console.log(option)
        this.selectModel = option.value
        this.modelName = option.name
        this.pageNo = 1
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
        this.dataList.splice(0, this.dataList.length)
        this.reportQuery(cond).then((obj) => {
          this.dataList = obj.rows
        })
        this.switchModel = !this.switchModel
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
        this.BillNo = data.BillNo// 单据编号
        // console.log(bus)
        console.log(data)
        // console.log(6666)
        let map = new Map()
        data.dataList.forEach(function (item, index, e) {
          map.set(item.keyName, item.select)
        })
        // this.ClientType = map.get('ClientType')
        // this.SourceInfo = map.get('SourceInfo')
        // this.Emergency = map.get('Emergency')
        // this.Status = map.get('Status')
        this.khlx = map.get('khlx')// 客户类型
        this.ProduceStatus = map.get('ProduceStatus')// 订单状态
        this.InvoiceType = map.get('InvoiceType')// 发票类型
        this.SelectCompanySales = map.get('SelectCompanySales') // 客户
        console.log(this.SelectCompanySales)
        this.ReportSelectDepartment = map.get('ReportSelectDepartment') // 部门
        this.ReportSelectEmployee = map.get('ReportSelectEmployee') // 经手人
        this.ReportSelectUser = map.get('ReportSelectUser') // 制单人
        this.pageNo = 1
        this.dataList.splice(0, this.dataList.length)
        this.listData()
      })
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.pageNo === 1) {
          vm.listData()
          // console.log(777)
        }
      })
    }
  }
</script>
<style>
  .palette-button{
    height:50px;
    width:50px;
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

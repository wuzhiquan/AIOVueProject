<template>
  <div class="page_wrap">
    <!-- 顶部 -->
    <mt-header title="客户管理" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.push({name: 'index'})">返回</mt-button>
      </div>
    </mt-header>
    <div class="page_cont CRMClientinfo_page">
      <!-- 放图标区域 -->
      <div class="top_block">
        <p class="gaikuo">客户概括</p>
        <div>
          <img slot="icon" src="../../assets/CRM/crm-allcustomers.png">
          <p>客户总数</p>
          <p class="number">233</p>
        </div>
        <div class="middle">
          <img slot="icon" src="../../assets/CRM/crm-follow.png">
          <p>待跟进</p>
          <p class="number">2</p>
        </div>
        <div>
          <img slot="icon" src="../../assets/CRM/crm-typing.png">
          <p>今日录入</p>
          <p class="number">21</p>
        </div>
      </div>
      <!-- 分类 -->
      <div class="parent_cell">
        <mt-cell title="我的客户" is-link @click.native="$router.push({name: 'CRMClientInfoList', params: {keyId: '-1'}})">
          <img slot="icon" src="../../assets/CRM/crm-customer.png" width="24" height="24">
        </mt-cell>
        <mt-cell title="联系人" is-link @click.native="$router.push({name: 'CRMClientInfoDetList', params: {keyId: '-1'}})">
          <img slot="icon" src="../../assets/CRM/crm-contacts.png" width="24" height="24">
        </mt-cell>
        <mt-cell title="联系记录" is-link @click.native="$router.push({name: 'CRMSaleFollowUpList', params: {keyId: '-1'}})">
          <img slot="icon" src="../../assets/CRM/crm-record.png" width="24" height="24">
        </mt-cell>
        <mt-cell title="服务记录"  is-link @click.native="$router.push({name: 'CRMClientServiceList', params: {keyId: '-1'}})">
          <img slot="icon" src="../../assets/CRM/crm-service.png" width="24" height="24">
        </mt-cell>
      </div>
      <div class="parent_cell">
        <mt-cell title="外勤" is-link @click.native="$router.push({name: 'OutAttendance'})">
          <img slot="icon" src="../../assets/CRM/crm-outAttendance.png" width="24" height="24">
        </mt-cell>
        <!--
        <mt-cell title="附近客户" is-link @click.native="">
          <img slot="icon" src="../../assets/CRM/crm-nearby.png" width="24" height="24">
        </mt-cell>
        -->
      </div>
      <div class="parent_cell">
        <mt-cell title="拍名片" is-link @click.native="$router.push({name: 'cardscanlist'})">
          <img slot="icon" src="../../assets/CRM/crm-takecard.png" width="24" height="24">
        </mt-cell>
      </div>
      <div class="flow_assortment"></div>
    </div>
  </div>
</template>

<script>
  import { Button, Header, Cell, Badge } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/badge/style.css'
  export default {
    name: 'CRMClientInfo',
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-cell': Cell,
      'mt-badge': Badge
    },
    data: function () {
      return {
        showdetail: false,
        show: false
      }
    },
    methods: {
    }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  $background-color: #F0F1F5;
  $block-color:#d7d7d7;
  $font-color:#878787;
  .page_wrap{
    width: 100%;
    height:100%;
    background:$background-color;
    .page_cont.CRMClientinfo_page{
      padding-top:2.5rem;
      background:$background-color;
      .top_block{
        background:white;
        text-align:center;
        margin-bottom: 16px;
        >div{
          width:70px;
          display:inline-block;
          position:relative;
          img{
            width:100%;
          }
          p{
            font-size:14px;
            color:$font-color;
            width:100%;
            text-align:center;
          }
          p.number{
            color:#333;
            font-size:24px;
            margin: 12px 0;
          }
          span.mint-badge{
            position:absolute;
            right:-7px;
            top: -6px;
          }
        }
        .middle{
          margin:0 35px;
        }
        p.gaikuo{
          height:2.87rem;
          border-bottom:1px solid #F3F3F3;
          line-height:2.87rem;
          text-align:left;
          color:#878787;
          padding-left:16px;
          font-size:16px;
        }
      }
      .parent_cell{
        .mint-cell-wrapper{
          padding: 0 15px;
          img{
            margin-right:4px;
          }
        }
        margin-bottom: 16px;
        .child_cell .mint-cell-wrapper{
          padding:0 45px;
          color:$font-color;
          font-size:15px;
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

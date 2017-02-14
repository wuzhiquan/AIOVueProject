<template>
  <div class="page_wrap">
    <!-- 顶部 -->
    <mt-header title="审批" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.push({name: 'approve'})">返回</mt-button>
      </div>
    </mt-header>
    <div class="page_cont workflow_page">
      <!-- 放图标区域 -->
      <div class="top_block">
        <div>
          <img slot="icon" src="../../assets/Bill@2x.png" @click="$router.push({name: 'workflowExpenseaccount', params: {keyId: '-1'}})">
          <p>费用报销</p>
        </div>
        <div class="middle">
          <img slot="icon" src="../../assets/Gression@2x.png" @click="$router.push({name: 'workflowOutleave', params: {keyId: '-1'}})">
          <p>外出申请单</p>
        </div>
        <div>
          <img slot="icon" src="../../assets/Dayoff@2x.png" @click="$router.push({name: 'workflowLeaveorder', params: {keyId: '-1'}})">
          <p>请假单</p>
        </div>
      </div>
      <!-- 分类 -->
      <div class="parent_cell">
        <mt-cell title="财务类"  is-link @click.native="showdetail = !showdetail">
          <img slot="icon" src="../../assets/finance.png" width="24" height="24">
        </mt-cell>
        <div v-if="showdetail">
             <div class="child_cell">
               <mt-cell title="费用报销" @click.native="$router.push({name: 'workflowExpenseaccount', params: {keyId: '-1'}})">
               </mt-cell>
          </div>
        </div>
      </div>
      <div class="parent_cell">
        <mt-cell title="行政人事类"  is-link @click.native="show = !show">
          <img slot="icon" src="../../assets/administration.png" width="24" height="24">
        </mt-cell>
        <transition name="slide-fade">
        <div v-if="show" class="child_cell">
          <mt-cell title="请假单"  @click.native="$router.push({name: 'workflowLeaveorder', params: {keyId: '-1'}})"></mt-cell>
          <mt-cell title="外出申请单" @click.native="$router.push({name: 'workflowOutleave', params: {keyId: '-1'}})"></mt-cell>
          <!-- <mt-cell title="名片扫描" is-link @click.native="$router.push({name: 'cardscan'})"></mt-cell> -->
        </div>
        </transition>
      </div>
      <div class="parent_cell">
        <mt-cell title="伙伴平台" is-link @click.native="">
          <img slot="icon" src="../../assets/cooperation.png" width="24" height="24">
        </mt-cell>
      </div>
      <div class="parent_cell">
        <mt-cell title="开发类" is-link @click.native="">
          <img slot="icon" src="../../assets/exploit.png" width="24" height="24">
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
    name: 'workflow',
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
    .page_cont.workflow_page{
      padding-top:2.5rem;
      background:$background-color;
      .top_block{
        height: 10rem;
        background:white;
        text-align:center;
        margin-bottom: 10px;
        >div{
          width:70px;
          display:inline-block;
          position:relative;
          margin-top:27px;
          img{
            width:100%;
          }
          p{
            font-size:14px;
            color:$font-color;
            width:100%;
            text-align:center;
            margin-top:8px;
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
      }
      .parent_cell{
        .mint-cell-wrapper{
          padding: 0 15px;
          img{
            margin-right:4px;
          }
        }
        margin-bottom: 10px;
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
  }
</style>

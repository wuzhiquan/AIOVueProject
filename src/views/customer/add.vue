<template>
<div class="page_wrap">
   <mt-header title="添加客户" fixed>
       <div slot="left">
         <mt-button icon="back" @click="back">返回</mt-button>
       </div>
   </mt-header>
       <div class="list_item">
    <mt-field label="单位全称" placeholder="请输入单位全称" :attr="{ maxlength: 10 }" class="fi"></mt-field>
    <mt-field label="单位简称" placeholder="请输入单位简称" :attr="{ maxlength: 10 }" class="fi"></mt-field>
    <mt-field label="单位编号" placeholder="请输入单位编号" type="number" class="fi"></mt-field>
    
    <mt-field label="拼 音 码" placeholder="请输入拼 音 码" class="fi" ></mt-field>
   <!--  <mt-field label="客户类型" placeholder="请输入客户类型" class="fi" v-model="ct"></mt-field> -->
 <!--   <select v-model="ct">
   <option  v-for="option in selectOption" :value="option.value" >{{option.name}}</option>
 </select> -->

       <div class="expen_select mint-cell">
            <label>费用类型</label>
            <select v-model="ct">
              <option  v-for="option in selectOption" :value="option.value">{{option.name}}</option>
            </select>
            <i class="mint-cell-allow-right"></i>
          </div>
     
    

<!--        <div class="expen_select mint-cell">
            <label>费用类型</label>
            <select v-model="item.ExpenseaccountType">
              <option  v-for="option in selectOption" :value="option.value">{{option.name}}</option>
            </select>
            <i class="mint-cell-allow-right"></i>
          </div>

 -->

    <mt-field label="公司电话" placeholder="请输入公司电话" type="tel" class="fi"></mt-field>
    <mt-field label="公司传真" placeholder="请输入公司传真" type="number" class="fi"></mt-field>


    <mt-field label="负责人姓名" placeholder="请输入负责人姓名" class="fi"></mt-field>
    <mt-field label="负责人电话" placeholder="请输入负责人电话" type="tel" class="fi"></mt-field>
    <mt-field label="负责人手机" placeholder="请输入负责人手机" type="tel" class="fi"></mt-field>
    <mt-field label="信用额度" placeholder="请输入信用额度" type="number" class="fi"></mt-field>


    <mt-field label="所 有 者" placeholder="请输入所 有 者" class="fi"></mt-field>
    <mt-field label="部    门" placeholder="请输入部 门" class="fi"></mt-field>
    <mt-field label="结算账期" placeholder="请输入结算账期" @click.native="open('picker')" v-model="ApplyDate" class="fi"></mt-field>
    <mt-field label="发票类型" placeholder="请输入发票类型" class="fi"></mt-field>

    <mt-field label="出货地址" placeholder="请输入出货地址" class="fi"></mt-field>
    <mt-field label="公司网址" placeholder="请输入公司网址" type="url" class="fi"></mt-field>
    <mt-field label="公司地址" placeholder="请输入公司地址" class="fi"></mt-field>
    <mt-field label="公司email" placeholder="请输入公司email" type="email" class="fi"></mt-field>
   
    <mt-field label="账 户 1" placeholder="请输入账 户 1" type="number" class="fi"></mt-field>
    <mt-field label="账 户 2" placeholder="请输入账 户 2" type="number" class="fi"></mt-field>
    <mt-field label="账 户 3" placeholder="请输入账 户 3" type="number"class="fi"></mt-field>
  </div>
  <mt-button type="primary" class="primary-button" @click="save">提交</mt-button>

   <mt-datetime-picker ref="picker" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="getDate" ></mt-datetime-picker>
</div>

  
</template>

<script>
  import { Field, Button, Header, MessageBox, DatetimePicker, Picker, Radio } from 'mint-ui'
  import 'mint-ui/lib/field/style.css'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/picker/style.css'
  import 'mint-ui/lib/radio/style.css'
  import 'mint-ui/lib/datetime-picker/style.css'
  /* import { Button, Header, Navbar, TabItem, TabContainer, TabContainerItem, Cell, Loadmore } from 'mint-ui'
  
  import 'mint-ui/lib/tab-container-item/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/loadmore/style.css'

  import { mapActions } from 'vuex' */
  export default {
    name: 'add',
    components: {
      'mt-field': Field,
      'mt-button': Button,
      'mt-header': Header,
      'mt-picker': Picker,
      'mt-radio': Radio,
      'mt-datetime-picker': DatetimePicker,
      'mt-messageBox': MessageBox
    },
    computed: {
      selectOption () {
        return [
         {name: '请选择', value: ''},
         {name: '代理商', value: '1'},
         {name: '直销客户', value: '2'}
        ]
      }
    },
    data: function () {
      return {
        showdetail: false,
        // showDate: new Date(),
        ApplyDate: '',
        ct: '' // customertype客户类型
      }
    },
    methods: {
      save: function () {
        MessageBox.confirm(' ', '确认提交?').then(action => {
          MessageBox('', '提交成功').then(action => { this.$router.go(-1) })
        })
      },
      back: function () {
        this.$router.go(-1)
      },
      open (picker) {
        this.$refs[picker].open()
      },
      getDate (value) {
        var year = value.getFullYear()
        var month = value.getMonth() + 1
        var day = value.getDate()
        month = (month > 9 ? month : ('0' + month))
        day = (day > 9 ? day : ('0' + day))
        var dateStr = year + '-' + month + '-' + day
        this.ApplyDate = dateStr
      }
    },
    created () {
      var time = new Date()
      var year = time.getFullYear()
      var month = time.getMonth() + 1
      var day = time.getDate()
      month = (month > 9 ? month : ('0' + month))
      day = (day > 9 ? day : ('0' + day))
      var dateStr = year + '-' + month + '-' + day
      this.ApplyDate = dateStr
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scope>
$background-color: #F0F1F5;
.page_wrap{
  width: 100%;
  height:100%;
  background:$background-color;
  .list_item{
    background:#fff;
    border-bottom:1px solid #BABABA;
    padding:1.2rem 0.8rem;
    overflow:hidden;
    margin-top:25px;
  }
  .fi{
      border-bottom:1px solid #BABABA;
  }
  .primary-button{
    width: 100%;
    background:#26A2FF;
  }
}
</style>

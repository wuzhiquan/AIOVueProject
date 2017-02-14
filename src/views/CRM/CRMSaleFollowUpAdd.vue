<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="添加联系记录" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
  </mt-header>
  <!-- 内容 -->
  <div class="page_cont CRMSaleFollowUpAdd_page">
    <!-- 主表内容 -->
    <p class="info_text">主表信息</p>
    <div class="main_info">
      <template v-for="field in fieldList">
        <!-- 输入类型 -->
        <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && field.fieldType != 5 && field.fieldType != 6 && field.fieldType != 14" :label="field.display" disableClear :placeholder="'请输入'+field.display" v-model="values[field.fieldName]"></mt-field>
        <!-- 短日期时间类型 -->
        <div v-if="field.inputType == 0 && field.fieldType == 5">
          <div class="fillTimeData">
            <label>{{field.display}}</label>
            <input type="text" readonly @click="openDateTimePicker(field.fieldName)" v-model="values[field.fieldName]" :ref="field.fieldName+'timeData'" placeholder="选择日期">
          </div>
          <mt-datetime-picker :ref="field.fieldName" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" v-model="nowDate" @confirm="getDate"></mt-datetime-picker>
        </div>
        <!-- 长日期时间类型 -->
        <div v-if="field.inputType == 0 && field.fieldType == 6">
          <div class="fillTimeData">
            <label>{{field.display}}</label>
            <input type="text" readonly @click="openDateTimePicker(field.fieldName)" v-model="values[field.fieldName]" :ref="field.fieldName+'timeData'" placeholder="选择日期">
          </div>
          <mt-datetime-picker :ref="field.fieldName" type="datetime" date-format="{value} 日" hourFormat="{value} 时" minuteFormat="{value} 分" v-model="nowDate" @confirm="getDate2"></mt-datetime-picker>
        </div>
        <!-- 枚举类型 -->
        <div class="select_enum mint-cell" v-if="field.inputType == 1">
          <label>{{field.display}}</label>
          <select v-model="values[field.fieldName]">
            <option v-for="option in field.EnumItem" :value="option.value">{{option.name}}</option>
          </select>
          <i class="mint-cell-allow-right"></i>
        </div>
        <!-- 弹窗类型-->
        <template v-if="field.inputType == 2 && field.fieldName == 'ClientId'">
          <mt-field :label="field.display" disableClear readonly :value="CRMClientInfo_ClientName" :placeholder="'请选择'+field.display" @click.native="openPopup(field.fieldName)"></mt-field> 
        </template>
        <!-- <template v-if="field.inputType == 15">
          <mt-field :label="field.display" disableClear readonly :value="EmployeeName" :placeholder="'请选择'+field.display" @click.native="openPopup(field.fieldName)"></mt-field> 
        </template> -->
        <div class="select_enum mint-cell" v-if="field.inputType == 15" @click="chooseEmployee">
          <label>跟单人</label>
          <span>{{tblEmployee_EmpFullName?tblEmployee_EmpFullName:'请选择'}}</span>
          <i class="mint-cell-allow-right"></i>
        </div>
      </template>
    </div>
    <div class="button" style="margin-top:16px;">
      <mt-button size="large" type="primary" @click.native="save">保存</mt-button>
    </div>
  </div>
</div>
</template>

<script>
import {mapActions} from 'vuex'
import {dateformat} from '../../fmt'
import {Button, Field, Header, DatetimePicker, Cell, Indicator, Toast} from 'mint-ui'
import 'mint-ui/lib/button/style.css'
import 'mint-ui/lib/field/style.css'
import 'mint-ui/lib/header/style.css'
import 'mint-ui/lib/datetime-picker/style.css'
import 'mint-ui/lib/cell/style.css'
import 'mint-ui/lib/toast/style.css'
import 'mint-ui/lib/indicator/style.css'
export default {
  name: 'CRMSaleFollowUpAdd',
  components: {
    'mt-button': Button,
    'mt-field': Field,
    'mt-header': Header,
    'mt-datetime-picker': DatetimePicker,
    'mt-cell': Cell
  },
  data: function () {
    return {
      fieldList: [],
      values: {},
      nowDate: new Date(),
      EmployeeName: '',
      CRMClientInfo_ClientName: '',
      tblEmployee_EmpFullName: ''
    }
  },
  methods: {
    ...mapActions(['addPre', 'add', 'getEnum']),
    addPreList () {
      Indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.addPre({tableName: 'CRMSaleFollowUp', parentTableName: 'CRMClientInfo'}).then((obj) => {
        console.log(obj)
        Indicator.close()
        let vm = this
        obj.fieldList.forEach(function (item, index, e) {
          item.fieldName === 'ClientId' ? obj.values[item.fieldName] = '' : obj.values[item.fieldName] = item.defaultValue
          if (item.inputType === 1 && item.refEnumerationName !== '') {
            vm.getEnum(item.refEnumerationName).then(data => {
              data.unshift({name: '请选择', value: ''})
              item.EnumItem = data
            })
          }
        })
        for (let key in vm.$data) {
          vm.$data[key] = obj[key]
        }
        vm.$data.nowDate = new Date()
        vm.$data.EmployeeName = ''
        vm.CRMClientInfo_ClientName = ''
        // 处理表信息
        vm.fieldList = vm.fieldList.filter(field => field.inputType !== 100 && field.display !== field.fieldName)
      })
    },
    'save': function () {
      let values = Object.assign({}, this.$data.values)
      values = window.JSON.stringify(values)
      Indicator.open({
        text: '数据提交中...',
        spinnerType: 'snake'
      })
      this.add({tableName: 'CRMSaleFollowUp', values}).then(({keyId, tableName}) => {
        Indicator.close()
        Toast({message: '提交成功', duration: 1000})
        setTimeout(() => {
          this.$router.replace({name: 'CRMSaleFollowUpList'})
        }, 1000)
      }).catch(({message}) => {
        Indicator.close()
        Toast({message: message, duration: 1000})
      })
    },
    openDateTimePicker: function (ref) {
      this.$refs[ref][0].open()
      this.$data.main_fieldName = ref
    },
    getDate: function (value) {
      let time = dateformat(value, 'yyyy-MM-dd')
      let thisStr = this.$data.main_fieldName
      this.$data.values[thisStr] = time
      this.$refs[thisStr + 'timeData'][0].value = time
    },
    getDate2: function (value) {
      let time = dateformat(value, 'yyyy-MM-dd hh:mm:ss')
      let thisStr = this.$data.main_fieldName
      this.$refs[thisStr + 'timeData'][0].value = time
      this.$data.values[thisStr] = time
    },
    openPopup: function (fieldName) {
      this.$router.push({name: 'SelectCRMClient', params: { prevRouteName: this.$route.name }})
    },
    // 选择跟单人
    chooseEmployee () {
      this.$router.push({name: 'popupEmployee', params: { prevRouteName: this.$route.name }})
    }
  },
  watch: {
    '$route' (to, from) {
      var vm = this
      if (from.name === 'popupEmployee') {
        if (to.params.checked) {
          let checkedEmp = to.params.checked
          console.log(checkedEmp)
          vm.$data.values['EmployeeID'] = checkedEmp.EmployeeID
          vm.$data.tblEmployee_EmpFullName = checkedEmp.tblEmployee_EmpFullName
          vm.$data.values['tblEmployee.EmpFullName'] = checkedEmp.tblEmployee_EmpFullName
        }
      } else if (from.name === 'SelectCRMClient') {
        if (to.params.checked) {
          let checkedEmp = to.params.checked
          vm.$data.values['ClientId'] = checkedEmp.ClientId
          vm.$data.values['f_brother'] = checkedEmp.f_brother
          vm.$data.values['CRMClientInfo.ClientName'] = checkedEmp.CRMClientInfo_ClientName
          vm.$data['CRMClientInfo_ClientName'] = checkedEmp.CRMClientInfo_ClientName
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name !== 'popupEmployee' && from.name !== 'SelectCRMClient') {
        vm.addPreList()
      }
    })
  }
}
</script>
<style>
  .CRMSaleFollowUpAdd_page .mint-cell-wrapper,
  .CRMSaleFollowUpAdd_page .mint-cell:last-child{
    background-image:none;
    padding: 0;
  }
  .CRMSaleFollowUpAdd_page input{
    color:#98979d;
  }
  .CRMSaleFollowUpAdd_page input::-webkit-input-placeholder {
    color:#ddd;
  }
  .CRMSaleFollowUpAdd_page input::-moz-placeholder{
    color:#ddd;
  }
  .CRMSaleFollowUpAdd_page input::-moz-placeholder{
    color:#ddd;
  }
  .CRMSaleFollowUpAdd_page input:-ms-input-placeholder{
    color:#ddd;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  $background-color: #F0F1F5;
  $background-color-block:#fff;
  $p-text-color:#BABABA;
  $p-text-color-light:#26A2FF;
  .page_wrap{
    width: 100%;
    height:100%;
    overflow: hidden;
    background:$background-color;
    .page_cont.CRMSaleFollowUpAdd_page{
      .mint-field,.mint-cell{
        min-height:38px;
        color:#98979d;
      }
      padding: 40px 10px 12px;
      height: 100%;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
      background:$background-color;
      .fillTimeData{
        min-height:38px;
        line-height:38px;
        overflow:hidden;
        label{
          width:105px;
          display:block;
          color:#98979d;
          float:left;
        }
        input{
          border:none;
          outline:none;
          font-size:16px;
          float:left;
          display:inline-block;
          min-height:38px;
          line-height:38px;
          width:160px;
        }
      }
      .main_info{
        padding: 0 1rem;
        background: $background-color-block;
        margin-bottom:1rem;
      }
      .main_info{
        margin-bottom:0;
        border-radius:3px;
        padding:12px 16px;
        box-shadow: 1px 1px 7px #d6d6d6;
        position:relative;
      }
      p.info_text{
        font-size:14px;
        color:$p-text-color;
        padding: 0.6rem 0 0.5rem;
        position:relative;
        span{
          position:absolute;
          right:1.5rem;
          color:$p-text-color-light;
        }
      }
      .select_enum{
        line-height:38px;
        position: relative;
        label{
          width:105px;
          display:inline-block;
        }
        select{
          position: absolute;
          border: none;
          outline: none;
          height:100%;
          width:50%;
          color:#98979d;
          background:$background-color-block;
          font-size:16px;
          appearance:none;
          -moz-appearance:none;
          -webkit-appearance:none;
          right:2.1rem;
        }
      }
    }
    .mint-header-title{
      font-size:18px;
    }
  }
</style>

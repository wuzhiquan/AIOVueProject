<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="服务记录详情" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.push({name: 'CRMClientServiceList'})">返回</mt-button>
    </div>
    <div slot="right">
      <mt-button @click="save">保存</mt-button>
    </div>
  </mt-header>
  <!-- 内容 -->
  <div class="page_cont CRMClientServiceDetail_page">
    <div class="part">
      <div class="CRMService_detail_list" v-for='field in fieldList'>
        <!-- 枚举类型 -->
        <div class="select_enum mint-cell" v-if="field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == values[field.fieldName]).length > 0">
          <label>{{field.display}}</label>
          <select v-model="values[field.fieldName]">
            <option v-for="option in field.EnumItem" :value="option.value">{{option.name}}</option>
          </select>
          <i class="mint-cell-allow-right"></i>
        </div>
        <!-- 弹出框类型 -->
        <template v-if="field.inputType == 2">
          <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2 && values[field2.fieldName]" :label="field2.display" readonly disableClear :value="values[field2.fieldName]" @click.native="openPopup(field.fieldName)"></mt-field> 
        </template>
        <template v-if="field.inputType == 15">
          <mt-field :label="field.display" readonly disableClear :value="EmpFullName" :placeholder="'请选择'+field.display" @click.native="openPopup(field.fieldName)"></mt-field> 
        </template>
        <mt-field :placeholder="'请输入'+field.display" :label="field.display" :value="values[field.fieldName]" v-if="(field.fieldType == 2 || field.inputType == 0) && field.inputType != 1 && field.inputType != 2 && field.fieldName !== 'Content' && field.fieldName !== 'Remark' && field.fieldName !== 'FeedBack' && field.fieldName !== 'Topic' && field.fieldType != 14 && field.fieldType != 5 && field.fieldType != 6 && field.inputType != 15" disableClear v-model="values[field.fieldName]"></mt-field>
        <!-- 长日期 -->
        <div v-if="field.inputType == 0 && field.fieldType == 6">
          <div class="fillTimeData">
            <label>{{field.display}}</label>
            <input type="text" readonly @click="openDateTimePicker(field.fieldName)" v-model="values[field.fieldName]" :ref="field.fieldName+'timeData'" placeholder="选择日期">
          </div>
          <mt-datetime-picker :ref="field.fieldName" type="datetime" date-format="{value} 日" hourFormat="{value} 时" minuteFormat="{value} 分" v-model="nowDate" @confirm="getDate2"></mt-datetime-picker>
        </div>
        <!-- 短日期 -->
        <div v-if="field.inputType == 0 && field.fieldType == 5">
          <div class="fillTimeData">
            <label>{{field.display}}</label>
            <input type="text" readonly @click="openDateTimePicker(field.fieldName)" v-model="values[field.fieldName]" :ref="field.fieldName+'timeData'" placeholder="选择日期">
          </div>
          <mt-datetime-picker :ref="field.fieldName" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" v-model="nowDate" @confirm="getDate"></mt-datetime-picker>
        </div>
      </div>
      <div class="CRMService_detail_list">
        <mt-field placeholder="请输入主题" label="主题" :value="values.Topic" type="textarea" disableClear v-model="values.Topic"></mt-field>
      </div>
      <div class="CRMService_detail_list">
        <mt-field placeholder="请输入服务内容" label="服务内容" :value="values.Content" type="textarea" disableClear v-model="values.Content"></mt-field>
      </div>
      <div class="CRMService_detail_list">
        <mt-field placeholder="请输入客户反馈" label="客户反馈" :value="values.FeedBack" type="textarea" disableClear v-model="values.FeedBack"></mt-field>
      </div>
      <div class="CRMService_detail_list">
        <mt-field placeholder="请输入备注" label="备注" :value="values.Remark" type="textarea" disableClear v-model="values.Remark"></mt-field>
      </div>
      <div class="CRMService_detail_list" v-if="fujian">
        <mt-cell title="附件" :value="fujian">
          <a :href="fujianUrl" style="text-decoration: none;color:#38c;outline:none;">{{fujian}}</a>
        </mt-cell>
      </div>
    </div>
    <div class="delete_button">
      <mt-button type="default" size="large" @click.native="deleteService">删除服务记录</mt-button>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions } from 'vuex'
import {dateformat} from '../../fmt'
import { Toast, Button, Header, Indicator, Cell, Field, DatetimePicker, MessageBox } from 'mint-ui'
import 'mint-ui/lib/toast/style.css'
import 'mint-ui/lib/button/style.css'
import 'mint-ui/lib/header/style.css'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/datetime-picker/style.css'
import 'mint-ui/lib/cell/style.css'
import 'mint-ui/lib/field/style.css'
import 'mint-ui/lib/message-box/style.css'
export default {
  name: 'CRMClientServiceDetail', // 详情页
  components: {
    'mt-button': Button,
    'mt-header': Header,
    'mt-cell': Cell,
    'mt-datetime-picker': DatetimePicker,
    'mt-field': Field
  },
  data: function () {
    return {
      fieldList: [],
      nowDate: new Date(),
      main_fieldName: '',
      values: {},
      EmpFullName: ''
    }
  },
  computed: {
    fujianUrl () {
      let url = ''
      if (this.fujian) {
        url = '/ReadFile?fileName=' + this.fujian + '&realName=' + this.fujian + '&tempFile=false&type=AFFIX&tableName=CRMClientService'
      }
      return url
    },
    fujian () {
      return this.values.fujian ? this.values.fujian : this.values.Attachment
    }
  },
  methods: {
    ...mapActions(['detail', 'reportQuery', 'update', 'del']),
    listData: function () {
      let keyId = this.$route.params.keyId
      let vm = this
      Indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.detail({tableName: 'CRMClientService', keyId: keyId}).then((resolve) => {
        Indicator.close()
        for (let key in vm.$data) {
          vm.$data[key] = resolve[key]
        }
        vm.$data.nowDate = new Date()
        vm.$data.main_fieldName = ''
        vm.$data.EmpFullName = resolve.fieldList.filter(item => item.fieldName === 'EmployeeId')[0].defaultValue
        // 处理主表信息
        vm.fieldList = vm.fieldList.filter(field => field.inputType !== 100 && field.inputType !== 3)
        vm.fieldList.forEach(function (item, index, e) {
          if (item.inputType === 1 && item.EnumItem !== undefined) {
            item.EnumItem.unshift({name: '请选择', value: ''})
          }
        })
      })
    },
    save: function () {
      let values = window.JSON.stringify(this.values)
      let vm = this
      this.update({tableName: 'CRMClientService', values}).then(data => {
        Toast({message: '保存成功', duration: 1000})
        setTimeout(function () {
          vm.$router.push({name: 'CRMClientServiceList'})
        }, 1000)
      }).catch(({message}) => {
        Indicator.close()
        Toast({message: message, duration: 1000})
      })
    },
    // 打开时间类型的DateTimePicker
    openDateTimePicker: function (ref) {
      this.$refs[ref][0].open()
      this.$data.main_fieldName = ref
    },
    // 回填date
    getDate: function (value) {
      let time = dateformat(value, 'yyyy-MM-dd')
      let thisStr = this.$data.main_fieldName
      this.$refs[thisStr + 'timeData'][0].value = time
      this.$data.values[thisStr] = time
    },
    // 回填date
    getDate2: function (value) {
      let time = dateformat(value, 'yyyy-MM-dd hh:mm:ss')
      let thisStr = this.$data.main_fieldName
      this.$refs[thisStr + 'timeData'][0].value = time
      this.$data.values[thisStr] = time
    },
    // 删除用户
    deleteService: function () {
      let keyId = this.$route.params.keyId
      MessageBox.confirm('确定要删除该服务记录?').then(action => {
        Indicator.open({text: '删除中...', spinnerType: 'snake'})
        this.del({tableName: 'CRMClientService', keyId: keyId, defineInfo: '是否删除'}).then((resolve) => {
          Indicator.close()
          this.$router.replace({
            name: 'CRMClientServiceList'
          })
        })
      })
    },
    openPopup: function (fieldName) {
      if (fieldName === 'EmployeeId') {
        this.$router.push({name: 'popupEmployee', params: { prevRouteName: this.$route.name }})
      }
      if (fieldName === 'ClientId') {
        this.$router.push({name: 'SelectCRMClient', params: { prevRouteName: this.$route.name }})
      }
    }
  },
  watch: {
    '$route' (to, from) {
      var vm = this
      if (from.name === 'popupEmployee') {
        if (to.params.checked) {
          let checkedEmp = to.params.checked
          vm.$data.values['EmployeeId'] = checkedEmp.EmployeeID
          vm.$data.EmpFullName = checkedEmp.tblEmployee_EmpFullName
        }
      } else if (from.name === 'SelectCRMClient') {
        if (to.params.checked) {
          let checkedEmp = to.params.checked
          vm.$data.values['ClientId'] = checkedEmp.ClientId
          vm.$data.values['f_brother'] = checkedEmp.f_brother
          vm.$data.values['CRMClientInfo.ClientName'] = checkedEmp.CRMClientInfo_ClientName
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name !== 'popupEmployee' && from.name !== 'SelectCRMClient') {
        vm.listData()
      }
    })
  }
}
</script>
<style>
  .CRMService_detail_list .mint-cell-wrapper{
    background-image: none;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  $background-color: #F0F0F0;
  $background-color-block:#fff;
  $p-text-color:#BABABA;
  $p-text-color-light:#26A2FF;
  .page_wrap{
    .mint-header .mint-button{
      font-size: 14px !important;
    }
    .mint-header{
      font-size: 18px;
    }
    width: 100%;
    height:100%;
    background:$background-color;
    .page_cont.CRMClientServiceDetail_page{
      .part{
        padding:0 12px;
        background:#fff;
        .CRMService_detail_list{
          .mint-cell{
            min-height:55px;
            img{
              margin-right:15px;
            }
          }
          .select_enum{
            line-height:55px;
            position: relative;
            padding: 0 10px;
            label{
              width:105px;
              display:inline-block;
            }
            select{
              border: none;
              outline: none;
              height:99%;
              width:160px;
              color:#98979d;
              background:$background-color-block;
              font-size:16px;
              appearance:none;
              -moz-appearance:none;
              -webkit-appearance:none;
              /*position: absolute;
              right:2.1rem;*/
            }
          }
          .fillTimeData{
            min-height:55px;
            line-height:55px;
            padding:0 10px;
            overflow:hidden;
            label{
              width:105px;
              display:block;
              float:left;
            }
            input{
              border:none;
              outline:none;
              font-size:16px;
              float:left;
              display:inline-block;
              min-height:55px;
              line-height:55px;
              width:160px;
            }
          }
        }
      }
      padding-top:2.5rem;
      background:$background-color;
      .delete_button{
        text-align:center;
        padding:20px 10px 20px;
        button.mint-button--default{
          color:#ff8a7e;
          background:#fff;
        }
        .mint-button::after{
          background:#eee;
        }
      }
    }
    .mint-header-title{
      font-size:18px;
    }
  }
</style>

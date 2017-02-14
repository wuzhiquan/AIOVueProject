<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="联系记录详情" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
    <div slot="right">
      <mt-button @click="save">保存</mt-button>
    </div>
  </mt-header>
  <!-- 内容 -->
  <div class="page_cont CRMDet_detail">
    <div class="part">
      <div class="CRM_detail_list" v-for='field in fieldList'>
        <mt-field v-if="(field.fieldType == 2 || field.inputType == 0) && field.inputType != 1 && field.display !== '关联自定义1' && field.display !== '关联自定义2' && field.display !== '客户名称' && field.display !== '跟单人' && field.display !== '跟进时间' && field.display !== '下次跟进时间'" :label="field.display" :value="values[field.fieldName]">
        </mt-field>
        <div class="select_enum mint-cell" v-if="field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == values[field.fieldName]).length > 0">
          <label>{{field.display}}</label>
          <select v-model="values[field.fieldName]">
            <option v-for="option in field.EnumItem" :value="option.value">{{option.name}}</option>
          </select>
          <i class="mint-cell-allow-right"></i>
        </div>
        <div class="CRM_detail_list" v-if="field.inputType == 2" @click="chooseClient">
          <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2 && values[field2.fieldName]" :label="field2.display" readonly disableClear :value="values[field2.fieldName]"></mt-field> 
        </div>
        <div class="select_enum mint-cell" v-if="field.inputType == 15" @click="chooseEmployee">
          <label>跟单人</label>
          <span>{{tblEmployee_EmpFullName?tblEmployee_EmpFullName:'请选择'}}</span>
          <i class="mint-cell-allow-right"></i>
        </div>
        <div v-if="field.inputType == 0 && field.fieldType == 5">
          <div class="fillTimeData">
            <label>{{field.display}}</label>
            <input type="text" readonly @click="openDateTimePicker(field.fieldName)" v-model="values[field.fieldName]" :ref="field.fieldName+'timeData'" placeholder="选择日期">
          </div>
          <mt-datetime-picker :ref="field.fieldName" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="getDate"></mt-datetime-picker>
        </div>
      </div>
    </div>
    <div class="childDetail">
      <template v-for="childTable in childTableList">
        <div class="detail_info_wrap" v-for="(childTableValues, index) in values[`TABLENAME_${childTable.name}`]">
          <p class="info_text">{{ childTable.display }}{{ index + 1 }}</p>
          <div class="detail_info">
            <template v-for="field in childShowField[childTable.name]">
              <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && childTableValues[field.fieldName]" :label="field.display" readonly disableClear :value="childTableValues[field.fieldName]"></mt-field>
              <mt-field v-if="(field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == childTableValues[field.fieldName]).length > 0)&&field.EnumItem.filter(item => item.value == childTableValues[field.fieldName])[0].name&&field.EnumItem.filter(item => item.value == childTableValues[field.fieldName])[0].name!='请选择'" :label="field.display" readonly disableClear :value="field.EnumItem.filter(item => item.value == childTableValues[field.fieldName])[0].name"></mt-field>
              <template v-if="field.inputType == 2">
                <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2&&childTableValues[field2.fieldName]" :label="field2.display" readonly disableClear :value="childTableValues[field2.fieldName]"></mt-field> 
              </template>
            </template>
          </div>
        </div>
      </template>
    </div>
    <div class="delete_button">
      <mt-button type="default" size="large" @click.native="deleteService">删除服务记录</mt-button>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions } from 'vuex'
import { Button, Header, Indicator, Field, Cell, DatetimePicker, Toast, MessageBox } from 'mint-ui'
import {dateformat} from '../../fmt'
import 'mint-ui/lib/button/style.css'
import 'mint-ui/lib/header/style.css'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/field/style.css'
import 'mint-ui/lib/cell/style.css'
import 'mint-ui/lib/datetime-picker/style.css'
import 'mint-ui/lib/toast/style.css'
import 'mint-ui/lib/message-box/style.css'
export default {
  name: 'CRMSaleFollowUpDetail', // 详情页
  components: {
    'mt-button': Button,
    'mt-header': Header,
    'mt-field': Field,
    'mt-cell': Cell,
    'mt-datetime-picker': DatetimePicker
  },
  data: function () {
    return {
      EmpFullName: '', // 跟单人
      tblEmployee_EmpFullName: '',
      fieldList: [],
      values: {},
      nowDate: new Date(),
      ClientName: '',
      main_fieldName: '',
      keyId: '',
      childShowField: {},
      childTableList: [],
      EmployeeID: ''
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['detail', 'reportQuery', 'update', 'del']),
    listData: function () {
      this.$data.keyId = this.$route.params.keyId
      this.EmpFullName = this.$route.params.EmpFullName
      console.log(this.$data.keyId)
      let vm = this
      Indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.detail({tableName: 'CRMSaleFollowUp', keyId: this.$data.keyId}).then((resolve) => {
        Indicator.close()
        console.log(resolve)
        for (let key in vm.$data) {
          vm.$data[key] = resolve[key]
        }
        vm.$data.ClientName = vm.$route.params.ClientName_edit
        vm.$data.tblEmployee_EmpFullName = vm.$data.values['tblEmployee.EmpFullName']
        vm.$data.nowDate = new Date()
        vm.$data.main_fieldName = ''
        console.log(vm.$data)
        // 处理主表信息
        vm.fieldList = vm.fieldList.filter(field => field.inputType !== 100 && field.inputType !== 3 && field.fieldType !== 14 && field.fieldName in vm.$data.values)
        vm.fieldList.forEach(function (item, index, e) {
          if (item.inputType === 1 && item.EnumItem !== undefined) {
            item.EnumItem.unshift({name: ' ', value: ''})
          }
        })
        console.log(vm.$data)
      })
    },
    // 选择跟单人
    chooseEmployee () {
      this.$router.push({name: 'popupEmployee', params: { prevRouteName: this.$route.name, keyId: this.$data.keyId }})
    },
    chooseClient () {
      this.$router.push({name: 'SelectCRMClient', params: { prevRouteName: this.$route.name }})
    },
    // 打开时间类型的DateTimePicker
    openDateTimePicker: function (ref) {
      this.$refs[ref][0].open()
      this.$data.main_fieldName = ref
    },
    getDate: function (value) {
      let time = dateformat(value, 'yyyy-MM-dd')
      let thisStr = this.$data.main_fieldName
      this.$refs[thisStr + 'timeData'][0].value = time
      this.$data.values[thisStr] = time
    },
    save: function () {
      let values = this.dataToString(this.values)
      console.log(values)
      let vm = this
      this.update({tableName: 'CRMSaleFollowUp', values}).then(data => {
        Toast({message: '保存成功', duration: 1000})
        setTimeout(function () {
          vm.$router.push({name: 'CRMSaleFollowUpList'})
        }, 1000)
      }).catch(({message}) => {
        Indicator.close()
        Toast({message: message, duration: 1000})
      })
    },
    deleteService: function () {
      MessageBox.confirm('确定要删除该服务记录?').then(action => {
        Indicator.open({text: '删除中...', spinnerType: 'snake'})
        let keyId = this.$route.params.keyId
        this.del({tableName: 'CRMSaleFollowUp', keyId: keyId, defineInfo: '是否删除'}).then((resolve) => {
          Indicator.close()
          this.$router.replace({
            name: 'CRMSaleFollowUpList'
          })
        })
      })
    },
    // 处理values数据，全部转化成字符串
    dataToString: function (values) {
      for (let key in values) {
        if (values[key] instanceof Object || key.indexOf('TABLENAME') >= 0) {
          if (values[key].length > 0) {
            values[key].forEach(function (item) {
              for (let key2 in item) {
                item[key2] = item[key2].toString()
              }
            })
          }
        } else {
          values[key] = values[key].toString()
        }
      }
      values = window.JSON.stringify(values)
      return values
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
  .CRM_detail_list .mint-cell-wrapper{
    background-image: none;
  }
  .CRM_detail_list .mint-cell-wrapper .mint-cell-value{
    max-width: 160px;
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
    .page_cont.CRMDet_detail{
      .part{
        padding:0 12px;
        background:#fff;
        .CRM_detail_list{
          .mint-cell{
            min-height:55px;
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
      .childDetail{
        .detail_info_wrap{
          position:relative;
          .detDetail{
            position:absolute;
            right:72px;
            top:11px;
            font-size:14px;
            color:#ff8a7e;
            z-index:1;
            em{
              position:absolute;
              width:18px;
              height:18px;
              background:url(../../assets/CRM/deleteIcon.png);
              background-size:100% 100%;
              left:-22px;
            }
          }
        }
        position:relative;
        span.childDetailEdit{
          position:absolute;
          right:12px;
          top:12px;
          font-size:14px;
          color:#40a9e5;
          em{
            position:absolute;
            display:block;
            width:18px;
            height:18px;
            left: -22px;
            top: -1px;
          }
          .editIcon{
            background:url(../../assets/CRM/editIcon.png);
            background-size:100% 100%;
          }
          .saveIcon{
            background:url(../../assets/crm/saveIcon.png);
            background-size:100% 100%;
          }
        }
        .marBo26{
          padding-bottom:38px;
          border-bottom: 1px solid #e8e8e8;
        }
      }
    }
    .mint-header-title{
      font-size:18px;
    }
  }
</style>

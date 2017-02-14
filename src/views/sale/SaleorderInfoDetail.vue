<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="订单详情" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
  </mt-header>
  <!-- 内容 -->
  <div class="page_cont CRMdetail_page">
    <!-- 主表内容 -->
    <p class="info_text">主表信息</p>
    <div class="main_info" v-if="editMainInfo">
      <p class="ClientName"></p>
      <p class="ClientNo"></p>
      <template v-for="field in fieldList">
        <!-- 输入类型 -->
        <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && values[field.fieldName]" :label="field.display" readonly disableClear :value="values[field.fieldName]"></mt-field>
        <mt-field v-if="(field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == values[field.fieldName]).length > 0) && field.EnumItem.filter(item => item.value == values[field.fieldName])[0].name && field.EnumItem.filter(item => item.value == values[field.fieldName])[0].name!='请选择'" :label="field.display" readonly disableClear :value="field.EnumItem.filter(item => item.value == values[field.fieldName])[0].name"></mt-field>
        <!-- 弹窗类型-->
        <template v-else="field.inputType == 2">
          <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2 && values[field2.fieldName]" :label="field2.display" readonly disableClear :value="values[field2.fieldName]"></mt-field>
        </template>
      </template>
      <span class="detailEdit" @click="detailEdit"><em class="editIcon"></em>编辑</span>
    </div>
    <div class="main_info" v-if="!editMainInfo">
      <div class="ClientName_edit">
<!--         <mt-field placeholder="请输入客户名称" :value="values.ClientName" v-model="values.ClientName" disableClear type="textarea"></mt-field> -->
      </div>
 <!--      <mt-field placeholder="请输入客户编号" :value="values.ClientNo" v-model="values.ClientNo" disableClear label="客户编号"></mt-field> -->
      <div v-for="field in fieldList">
        <!-- 输入类型 -->
        <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && field.fieldType != 5" :label="field.display" disableClear :value="values[field.fieldName]" v-model="values[field.fieldName]" :placeholder="'请输入'+field.display"></mt-field>
        <!-- 时间类型 -->
        <div v-if="field.inputType == 0 && field.fieldType == 5">
          <mt-field :label="field.display" disableClear :value="values[field.fieldName]?values[field.fieldName]:'选择日期'" readonly @click.native="openDateTimePicker(field.fieldName)" v-model="values[field.fieldName]"></mt-field>
          <mt-datetime-picker :ref="field.fieldName" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" v-model="nowDate" @confirm="getDate"></mt-datetime-picker>
        </div>
        <!-- 枚举类型 -->
        <div class="select_enum mint-cell" v-if="field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == values[field.fieldName]).length > 0">
          <label>{{field.display}}</label>
          <select v-model="values[field.fieldName]">
            <option v-for="option in field.EnumItem" :value="option.value">{{option.name}}</option>
          </select>
          <i class="mint-cell-allow-right"></i>
        </div>
        <!-- 弹窗类型-->
        <div v-else="field.inputType == 2">
          <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2" :label="field2.display" readonly disableClear :value="values[field2.fieldName]" @click.native="openPopup(field2.fieldName, `tblSalesOrder`)"></mt-field> 
        </div>
<!--        <template v-else="field.inputType == 2">
          <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2 && childTableValues[field2.fieldName]!=undefined" :label="field2.display" readonly disableClear :value="childTableValues[field2.fieldName]" @click.native="openPopup(field2.fieldName, `TABLENAME_${childTable.name}`, index)"></mt-field> 
        </template> -->

      </div>
      <span class="detailEdit" @click="detailSave"><em class="saveIcon"></em>保存</span>
    </div>
    <!-- 明细表内容 -->
    <div class="childDetail" v-if="childDetailEdit">
      <template v-for="childTable in childTableList">
        <div class="detail_info_wrap" v-for="(childTableValues, index) in values[`TABLENAME_${childTable.name}`]">
          <p class="info_text">{{ childTable.display }}{{ index + 1 }}</p>
          <div class="detail_info">
            <template v-for="field in childShowField[childTable.name]">
              <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && childTableValues[field.fieldName]&&field.fieldName!=='Mobile'&&field.fieldName!=='Telephone'" :label="field.display" readonly disableClear :value="childTableValues[field.fieldName]"></mt-field>
              <div class="mobile">
                <mt-cell v-if="(field.fieldName=='Mobile'||field.fieldName=='Telephone')&&childTableValues[field.fieldName]" :title="field.display">
                  <a :href="'tel://'+childTableValues[field.fieldName]" style="text-decoration: none;color:#38c;outline:none;">{{childTableValues[field.fieldName]}}</a>
                </mt-cell>
              </div>
              <mt-field v-if="(field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == childTableValues[field.fieldName]).length > 0)&&field.EnumItem.filter(item => item.value == childTableValues[field.fieldName])[0].name&&field.EnumItem.filter(item => item.value == childTableValues[field.fieldName])[0].name!='请选择'" :label="field.display" readonly disableClear :value="field.EnumItem.filter(item => item.value == childTableValues[field.fieldName])[0].name"></mt-field>
              <template v-else="field.inputType == 2">
                <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2&&childTableValues[field2.fieldName]" :label="field2.display" readonly disableClear :value="childTableValues[field2.fieldName]"></mt-field> 
              </template>
            </template>
          </div>
        </div>
      </template>
      <span class="childDetailEdit" @click="childDetailEditFn"><em class="editIcon"></em>编辑明细</span>
    </div>
    <div class="childDetail" v-if="!childDetailEdit">
      <template v-for="childTable in childTableList">
        <div class="detail_info_wrap" v-for="(childTableValues, index) in values[`TABLENAME_${childTable.name}`]">
          <p class="info_text">{{ childTable.display }}{{ index + 1 }}</p>
          <span class="detDetail" v-if="values[`TABLENAME_${childTable.name}`].length > 1" @click="detDetailFn(`TABLENAME_${childTable.name}`, index)">删除</span>
          <div class="detail_info">
            <template v-for="field in childShowField[childTable.name]">
              <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && field.fieldType != 5" :label="field.display" disableClear :value="childTableValues[field.fieldName]" v-model="values[`TABLENAME_${childTable.name}`][index][field.fieldName]" :placeholder="'请输入'+field.display"></mt-field>
              <!-- 时间类型 -->
              <div v-if="field.inputType == 0 && field.fieldType == 5">
                <mt-field :label="field.display" disableClear :value="childTableValues[field.fieldName]?childTableValues[field.fieldName]:'选择日期'" readonly @click.native="openDateTimePicker(`TABLENAME_${childTable.name}`+'_|_'+index+'_|_'+field.fieldName)" v-model="values[`TABLENAME_${childTable.name}`][index][field.fieldName]"></mt-field>
                <mt-datetime-picker :ref="`TABLENAME_${childTable.name}`+'_|_'+index+'_|_'+field.fieldName" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" v-model="nowDate" @confirm="getDate"></mt-datetime-picker>
              </div>
              <!-- 枚举类型 -->
              <div class="select_enum mint-cell" v-if="field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == childTableValues[field.fieldName]).length > 0">
                <label>{{field.display}}</label>
                <select v-model="values[`TABLENAME_${childTable.name}`][index][field.fieldName]">
                  <option v-for="option in field.EnumItem" :value="option.value">{{option.name}}</option>
                </select>
                <i class="mint-cell-allow-right"></i>
              </div>
              <template v-else="field.inputType == 2">
                <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2" :label="field2.display" readonly disableClear :value="childTableValues[field2.fieldName]" @click.native="openPopup(field2.fieldName, `TABLENAME_${childTable.name}`)"></mt-field> 
              </template>
            </template>
            <p v-if="index+1 == values[`TABLENAME_${childTable.name}`].length" class="addDetailList" @click="addDetailListFn(`TABLENAME_${childTable.name}`)"><img slot="icon" src="../../assets/add.png" width="24" height="24">添加{{childTable.display}}</p>
          </div>
        </div>
      </template>
      <span class="childDetailEdit" @click="childDetailSaveFn"><em class="saveIcon"></em>保存明细</span>
    </div>
  </div>
</div>
</template>

<script>
import {mapActions} from 'vuex'
import {dateformat} from '../../fmt'
import {Toast, Button, Field, Header, DatetimePicker, Indicator, Cell} from 'mint-ui'
import 'mint-ui/lib/toast/style.css'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/button/style.css'
import 'mint-ui/lib/field/style.css'
import 'mint-ui/lib/header/style.css'
import 'mint-ui/lib/datetime-picker/style.css'
import 'mint-ui/lib/cell/style.css'
export default {
  name: 'SaleorderInfoDetail',
  components: {
    'mt-button': Button,
    'mt-field': Field,
    'mt-header': Header,
    'mt-datetime-picker': DatetimePicker,
    'mt-cell': Cell
  },
  data: function () {
    return {
      opType: '',
      // childShowField: {},
      // childTableList: [],
      // fieldList: [],
      // values: {},
      editMainInfo: true,
      childDetailEdit: true,
      gendenrenIndex: 0,
      TABLENAME_CRMClientInfoEmp: 'TABLENAME_CRMClientInfoEmp',
      nowDate: new Date(),
      main_fieldName: '',
      // 我的
      checkRight: '',
      childShowField: {},
      childTableList: [],
      code: '',
      deleteRight: '',
      fieldList: [],
      flowDepict: [],
      hasCancel: '',
      updateRight: '',
      values: {}
    }
  },
  computed: {
    tableName () {
      // return 'CRMClientInfo'
      return this.$route.params.tableName
    },
    keyId () {
      return this.$route.params.keyId
    }
  },
  methods: {
    ...mapActions(['detail', 'update', 'reportQuery', 'popupSelect']),
    feachData () {
      Indicator.open({text: '数据拉取中...', spinnerType: 'snake'})
      let vm = this
      // 对this.fieldList数据信息进行模板筛选

      this.detail({tableName: this.tableName, keyId: this.keyId}).then(data => {
        // console.log(data)
        for (let key in vm.$data) {
          vm.$data[key] = data[key]
        }
        vm.$data.editMainInfo = true
        vm.$data.childDetailEdit = true
        vm.$data.gendenrenIndex = 0
        vm.$data.TABLENAME_CRMClientInfoEmp = 'TABLENAME_CRMClientInfoEmp'
        vm.$data.nowDate = new Date()
        vm.$data.main_fieldName = ''
        // 处理主表信息
        vm.fieldList = vm.fieldList.filter(field => field.inputType !== 100 && field.inputType !== 3 && field.fieldType !== 14 && field.display !== field.fieldName && field.fieldName !== 'Remark')
        vm.fieldList.forEach(function (item, index, e) {
          if (item.inputType === 1 && item.EnumItem !== undefined) {
            item.EnumItem.unshift({name: '请选择', value: ''})
          }
        })
        // 处理明细表信息
        vm.childTableList.forEach(({name}) => {
          vm.childShowField[name] = vm.childShowField[name].filter(field => field.inputType !== 100 && field.inputType !== 3 && field.display !== field.fieldName)
          vm.childShowField[name].forEach(field => {
            if (field.inputType === 1 && field.EnumItem !== undefined) {
              field.EnumItem.unshift({name: '请选择', value: ''})
            }
          })
        })
        Indicator.close()
      }).catch(({message}) => {
        Indicator.close()
        Toast({ message: message, duration: 1000 })
      })
      // })
    },
    detailEdit: function () {
      this.editMainInfo = false
    },
    detailSave: function () {
      this.saveDataFn('main')
    },
    'childDetailEditFn': function () {
      this.childDetailEdit = false
    },
    'childDetailSaveFn': function () {
      this.saveDataFn('child')
    },
    addDetailListFn: function (item) {
      let addOption = {}
      for (let key in this.$data.values[item][0]) {
        if (key !== 'f_ref') {
          addOption[key] = ''
        } else {
          addOption.f_ref = this.$data.values[item][0].f_ref
        }
      }
      // console.log(addOption)
      this.$data.values[item].push(addOption)
    },
    detDetailFn: function (item, index) {
      this.$data.values[item].splice(index, 1)
    },
    saveDataFn: function (name) {
      // // this.values.Status = this.values.Status.toString()
      // this.values.statusId = this.values.statusId.toString()
      // // this.values.InvoiceType = this.values.InvoiceType.toString()
      // // this.values.id = this.values.id.toString()
      // // console.log(this.values)
      // // let values = this.values
      // // for (let key in values) {
      // //   if (values[key] instanceof Object || key.indexOf('TABLENAME') >= 0) {
      // //     if (values[key].length > 0) {
      // //       values[key].forEach(function (item) {
      // //         for (let key2 in item) {
      // //           item[key2] = item[key2].toString()
      // //         }
      // //       })
      // //     }
      // //   } else {
      // //     values[key] = values[key].toString()
      // //   }
      // // }
      // let valuess = window.JSON.stringify(values)
      // console.log(valuess)
      // let postData = {tableName: this.tableName, valuess}
      // this.update(postData).then(data => {
      //   Toast({message: '保存成功', duration: 1000})
      //   if (name === 'main') {
      //     this.editMainInfo = true
      //   } else {
      //     this.childDetailEdit = true
      //   }
      // }).catch(({message}) => {
      //   Toast({message: message, duration: 1000})
      // })
    },
    openPopup: function (item, table) {
      this.TABLENAME_CRMClientInfoEmp = table
      // console.log(item)
      if (item === 'tblEmployee.EmpFullName') {
        this.$router.replace({name: 'popupEmployee', params: { prevRouteName: this.$route.name, keyId: this.$route.params.keyId, tableName: this.$route.params.tableName }})
      }
      if (item === 'tblCompany.ComFullName') {
        this.$router.replace({name: 'popupCompany', params: { prevRouteName: this.$route.name, keyId: this.$route.params.keyId, tableName: this.$route.params.tableName }})
      }
    },
    openDateTimePicker: function (ref) {
      // console.log(this.$refs)
      this.$refs[ref][0].startDate = new Date(1970, 0, 1)
      this.$refs[ref][0].open()
      this.$data.main_fieldName = ref
    },
    getDate: function (value) {
      let time = dateformat(value, 'yyyy-MM-dd')
      let thisStr = this.$data.main_fieldName
      if (thisStr.indexOf('_|_') >= 0) {
        let thisArr = thisStr.split('_|_')
        let detTable = thisArr[0]
        let index = thisArr[1]
        let fieldName = thisArr[2]
        this.$data.values[detTable][index][fieldName] = time
        // console.log(this.$data.values[detTable][index][fieldName])
      } else {
        this.$data.values[thisStr] = time
      }
    }
  },
  watch: {
    '$route' (to, from) {
      // 如果从列表页进入详情页，就要重新拉取数据
      if (from.name === 'SaleorderInfoList' && to.name === 'SaleorderInfoDetail') {
        this.feachData()
      }
      // 选择跟单人员后回填信息
      var vm = this
      if (from.name === 'popupEmployee') {
        if (to.params.checked) {
          // console.log(to)
          let checkedEmp = to.params.checked
          vm.values['DepartmentCode'] = checkedEmp.DepartmentCode
          vm.values['EmployeeID'] = checkedEmp.EmployeeID
          vm.values['tblDepartment.DeptFullName'] = checkedEmp.tblDepartment_DeptFullName
          vm.values['tblEmployee.EmpFullName'] = checkedEmp.tblEmployee_EmpFullName
          vm.values['id'] = vm.values['id'] ? vm.values['id'] : -1
        }
      }
      if (from.name === 'popupCompany') {
        if (to.params.checked) {
          // console.log(to)
          let checkedEmp = to.params.checked
          // console.log(checkedEmp)
          vm.values['tblCompany.classCode'] = checkedEmp.tblCompany_classCode
          vm.values['tblCompany.ComNumber'] = checkedEmp.tblCompany_ComNumber
          vm.values['tblCompany.ComFullName'] = checkedEmp.tblCompany_ComFullName
          vm.values['id'] = vm.values['id'] ? vm.values['id'] : -1
        }
      }
    }
  },
  created () {
    this.feachData()
  },
  beforeRouteLeave (to, from, next) {
    window.sessionStorage.setItem('scrollTop' + from.name, document.getElementsByClassName('CRMdetail_page')[0].scrollTop)
    next(true)
  },
  beforeRouteEnter (to, from, next) {
    let scrollTop = 0
    if (from.name === 'popupEmployee') {
      scrollTop = window.sessionStorage.getItem('scrollTop' + to.name)
      scrollTop = !scrollTop ? 0 : scrollTop
    } else {
      scrollTop = 0
    }
    next(vm => { document.getElementsByClassName('CRMdetail_page')[0].scrollTop = scrollTop })
  }
}
</script>
<style>
  .mint-msgbox-input input{
    height:26px;
  }
  .CRMdetail_page .main_info .mint-cell-title{
    min-width: 100px;
  }
  .CRMdetail_page .mint-cell-wrapper,
  .CRMdetail_page .mint-cell:last-child{
    background-image:none;
    padding: 0;
  }
  .CRMdetail_page .mobile .mint-cell-wrapper{
    display: block;
  }
  .CRMdetail_page .mobile .mint-cell-title{
    width: 105px;
    float: left;
  }
  .CRMdetail_page .mobile .mint-cell-title span,
  .CRMdetail_page .mobile .mint-cell-value a
  {
    display: block;
    height: 38px;
    line-height: 38px;
  }
  .CRMdetail_page input{
    color:#98979d;
  }
  .CRMdetail_page input::-webkit-input-placeholder {
    color:#ddd;
  }
  .CRMdetail_page input::-moz-placeholder{
    color:#ddd;
  }
  .CRMdetail_page input::-moz-placeholder{
    color:#ddd;
  }
  .CRMdetail_page input:-ms-input-placeholder{
    color:#ddd;
  }
  .CRMdetail_page .ClientName_edit .mint-field.is-textarea .mint-cell-value{
    font-size: 22px;
    color:#000;
    padding: 0;
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
    .page_cont.CRMdetail_page{
      >div.main_info>div>div>div{
        border-radius:3px;
        box-shadow: 1px 1px 7px #d6d6d6;
        padding:12px 16px !important;
      }
      >div.childDetail>div>div{
        border-radius:3px;
        box-shadow: 1px 1px 7px #d6d6d6;
        padding:12px 16px !important;
      }
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
      .main_info,
      .detail_info{
        padding: 0 1rem;
        background: $background-color-block;
        margin-bottom:1rem;
        .addDetailList{
          height:38px;
          line-height:38px;
          position:relative;
          padding-left:25px;
          img{
            position:absolute;
            left:0;
            top:6px;
          }
        }
      }
      .main_info{
        margin-bottom:0;
        border-radius:3px;
        padding:12px 16px;
        box-shadow: 1px 1px 7px #d6d6d6;
        position:relative;
        .createInfo {
          background-image: -webkit-linear-gradient(top, #d9d9d9, #d9d9d9 50%, transparent 50%);
          background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
          background-size: 120% 1px;
          background-repeat: no-repeat;
          background-position: top left;
          background-origin: content-box;
          font-size: 16px;
          padding: 0 10px;
          width: 100%;
          height: 60px;
          position: relative;
          overflow: hidden;
          .creatorInfo {
            box-sizing: border-box;
            height: 40px;
            margin: 10px 0 10px 56px;
            .creator {
              font-weight: bolder;
            }
            .createTime {
              right: 16px;
            }
          }
        }
        .ClientName{
          font-size:22px;
          padding-right: 50px;
          /*white-space: nowrap;
          overflow:hidden;
          text-overflow:ellipsis;*/
        }
        .ClientNo{
          font-size:12px;
          color:#d2d1d6;
          margin:10px 0 4px;
        }
        .ClientName_edit{
          padding-right: 60px;
        }
        span.detailEdit{
          position:absolute;
          top:12px;
          right:16px;
          color:rgb(51, 136, 204);
          font-size:14px;
          em{
            position:absolute;
            display:block;
            width:24px;height:24px;
            left: -22px;
            top: -4px;
          }
          .editIcon{
            background:url(../../assets/CRM/editIcon.png);
            background-size:100% 100%;
          }
          .saveIcon{
            background:url(../../assets/CRM/saveIcon.png);
            background-size:100% 100%;
          }
        }
      }
      .detail_info{
        margin-bottom:0;
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
      .childDetail{
        .detail_info_wrap{
          position:relative;
          .detDetail{
            position:absolute;
            right:16px;
            top:46px;
            font-size:14px;
            color:rgb(51, 136, 204);
            z-index:1;
          }
        }
        position:relative;
        span.childDetailEdit{
          position:absolute;
          right:16px;
          top:10px;
          font-size:14px;
          color:rgb(51, 136, 204);
          em{
            position:absolute;
            display:block;
            width:24px;height:24px;
            left: -22px;
            top: -4px;
          }
          .editIcon{
            background:url(../../assets/CRM/editIcon.png);
            background-size:100% 100%;
          }
          .saveIcon{
            background:url(../../assets/CRM/saveIcon.png);
            background-size:100% 100%;
          }
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
          width:180px;
          color:#98979d;
          background:$background-color-block;
          font-size:16px;
          appearance:none;
          -moz-appearance:none;
          -webkit-appearance:none;
          right:2.1rem;
          /*direction: rtl;
          option{
            direction: ltr;
          }*/
        }
      }
    }
    .mint-header-title{
      font-size:18px;
    }
  }
</style>

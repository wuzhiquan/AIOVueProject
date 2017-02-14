<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="客户详情" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
  </mt-header>
  <!-- 内容 -->
  <div class="page_cont CRMdetail_page">
    <!-- 
    用到的筛选inputType 跟fileType
    inputType = { '0' => 输入; '1' => 固定选项型; '2' => 弹出框选择; '100' => 不输入; '3' => 隐藏; '4' => 多语言; '5' => 复选框; '6' => 隐藏可显示; '7' => 拼音码; '8' => 只读; '10' => 单选框; '11' => 功能方法; '14' => 部门弹出框; '15' => 职员弹出框; '16' => 动态选项型; '17' => 分隔线 }

    fieldType = { '0' => 整型; '1' => 双精度; '2' => 任意字符; '3' => 备注; '4' => 英文字符; '5' => 短日期; '6' => 长日期; '7' => ip地址; '8' => 电邮; '9' => 固话; '10' => 手机; '11' => 电话; '12' => 网址; '13' => 图片; '14' => 附件; '15' => 邮编; '16' => HTML; '17' => 时间; '18' => 长字符; '19' => 密码; '20' => 中字符 }
    -->
    <!-- 主表内容 -->
    <p class="info_text">主表信息</p>
    <!-- 查看部分的主表信息 -->
    <div class="main_info" v-if="editMainInfo">
      <p class="ClientName">{{values.ClientName}}</p>
      <p class="ClientNo" v-if="showClientNo">客户编号：{{values.ClientNo}}</p>
      <template v-for="field in fieldList">
        <!-- 输入类型 -->
        <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && values[field.fieldName]" :label="field.display" readonly disableClear :value="values[field.fieldName]"></mt-field>
        <mt-field v-if="(field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == values[field.fieldName]).length > 0) && field.EnumItem.filter(item => item.value == values[field.fieldName])[0].name && field.EnumItem.filter(item => item.value == values[field.fieldName])[0].name!='请选择'" :label="field.display" readonly disableClear :value="field.EnumItem.filter(item => item.value == values[field.fieldName])[0].name"></mt-field>
        <!-- 弹窗类型-->
        <template v-else="field.inputType == 2">
          <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2 && values[field2.fieldName]" :label="field2.display" readonly disableClear :value="values[field2.fieldName]"></mt-field> 
        </template>
      </template>
      <p class="edit_area">
        <span class="detailEdit" @click="detailEdit"><em class="editIcon"></em>编辑</span>
      </p>
    </div>

    <!-- 编辑部分的主表信息 -->
    <div class="main_info" v-if="!editMainInfo">
      <div class="ClientName_edit">
        <mt-field placeholder="请输入客户名称" :value="values.ClientName" v-model="values.ClientName" disableClear type="textarea"></mt-field>
      </div>
      <mt-field placeholder="请输入客户编号" :value="values.ClientNo" v-model="values.ClientNo" disableClear label="客户编号" v-if="showClientNo"></mt-field>
      <div v-for="field in fieldList">
        <!-- 输入类型 -->
        <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && field.fieldType != 5" :label="field.display" disableClear :value="values[field.fieldName]" v-model="values[field.fieldName]" :placeholder="'请输入'+field.display"></mt-field>
        <!-- 时间类型 -->
        <div v-if="field.inputType == 0 && field.fieldType == 5">
          <div class="fillTimeData">
            <label>{{field.display}}</label>
            <input type="text" readonly @click="openDateTimePicker(field.fieldName)" v-model="values[field.fieldName]" :ref="field.fieldName+'timeData'" placeholder="选择日期">
          </div>
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
          <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2" :label="field2.display" disableClear :value="values[field2.fieldName]"></mt-field> 
        </div>
      </div>
      <p class="edit_area">
        <span class="detailEdit" @click="detailSave"><em class="saveIcon"></em>保存</span>
      </p>
    </div>
    <!-- 明细表部分 -->
    <div class="childDetail">
      <div v-for="childTable in childTableList" class="marBo26">
        <div class="detail_info_wrap" v-for="(childTableValues, index) in values[`TABLENAME_${childTable.name}`]">
          <p class="info_text">{{ childTable.display }}{{ index + 1 }}</p>
          <p v-if="childTableValues.showDetailEdit === 'true'">
            <span class="childDetailEdit" @click="editTABLENAMEInfo(`TABLENAME_${childTable.name}`,index)"><em class="editIcon"></em>编辑</span>
          </p>
          <p v-if="childTableValues.showDetailEdit !== 'true'">
            <span class="childDetailEdit" @click="childDetailSaveFn(`TABLENAME_${childTable.name}`,index)"><em class="saveIcon"></em>保存</span>
          </p>
          <span class="detDetail" v-if="values[`TABLENAME_${childTable.name}`].length > 1 && childTableValues.showDetailEdit !== 'true'" @click="detDetailFn(`TABLENAME_${childTable.name}`, index)"><em></em>删除</span>
          <!-- 查看部分 -->
          <div class="detail_info" v-if="childTableValues.showDetailEdit === 'true'">
            <template v-for="field in childShowField[childTable.name]">
              <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && childTableValues[field.fieldName]&&field.fieldName!=='Mobile'&&field.fieldName!=='Telephone'" :label="field.display" readonly disableClear :value="childTableValues[field.fieldName]"></mt-field>
              <div class="mobile">
                <mt-cell v-if="(field.fieldName=='Mobile'||field.fieldName=='Telephone')&&childTableValues[field.fieldName]" :title="field.display">
                  <a :href="'tel:'+childTableValues[field.fieldName]" style="text-decoration: none;color:#38c;outline:none;">{{childTableValues[field.fieldName]}}</a>
                </mt-cell>
              </div>
              <mt-field v-if="(field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == childTableValues[field.fieldName]).length > 0)&&field.EnumItem.filter(item => item.value == childTableValues[field.fieldName])[0].name&&field.EnumItem.filter(item => item.value == childTableValues[field.fieldName])[0].name!='请选择'" :label="field.display" readonly disableClear :value="field.EnumItem.filter(item => item.value == childTableValues[field.fieldName])[0].name"></mt-field>
              <template v-else="field.inputType == 2">
                <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2&&childTableValues[field2.fieldName]" :label="field2.display" readonly disableClear :value="childTableValues[field2.fieldName]"></mt-field> 
              </template>
            </template>
          </div>
          <!-- 编辑部分 -->
          <div class="detail_info" v-if="childTableValues.showDetailEdit !== 'true'">
            <template v-for="field in childShowField[childTable.name]">
              <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && field.fieldType != 5" :label="field.display" disableClear :value="childTableValues[field.fieldName]" v-model="values[`TABLENAME_${childTable.name}`][index][field.fieldName]" :placeholder="'请输入'+field.display"></mt-field>
              <!-- 时间类型 -->
              <div v-if="field.inputType == 0 && field.fieldType == 5">
                <div class="fillTimeData">
                  <label>{{field.display}}</label>
                  <input type="text" readonly @click="openDateTimePicker(`TABLENAME_${childTable.name}`+'_|_'+index+'_|_'+field.fieldName)" v-model="values[`TABLENAME_${childTable.name}`][index][field.fieldName]" :ref="`TABLENAME_${childTable.name}`+'_|_'+index+'_|_'+field.fieldName+'timeData'" placeholder="选择日期">
                </div>
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
                <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2 && childTableValues[field2.fieldName]!=undefined" :label="field2.display" readonly disableClear :value="childTableValues[field2.fieldName]" @click.native="openPopup(field2.fieldName, `TABLENAME_${childTable.name}`, index)"></mt-field> 
              </template>
            </template>
          </div>
          <p v-if="index+1 == values[`TABLENAME_${childTable.name}`].length" class="addDetailList" @click="addDetailListFn(`TABLENAME_${childTable.name}`)"><img slot="icon" src="../../assets/add.png" width="24" height="24">添加{{childTable.display}}</p>
        </div>
      </div>
    </div>
    <div class="CRM_Detailbutton">
      <mt-button type="default" size="large" @click.native="deleteDetail">删除客户</mt-button>
    </div>
  </div>
</div>
</template>

<script>
import {mapActions} from 'vuex'
import {dateformat} from '../../fmt'
import {Toast, Button, Field, Header, DatetimePicker, Indicator, Cell, MessageBox} from 'mint-ui'
import 'mint-ui/lib/toast/style.css'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/button/style.css'
import 'mint-ui/lib/field/style.css'
import 'mint-ui/lib/header/style.css'
import 'mint-ui/lib/datetime-picker/style.css'
import 'mint-ui/lib/message-box/style.css'
import 'mint-ui/lib/cell/style.css'
export default {
  name: 'CRMClientinfodet',
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
      childShowField: {},
      childTableList: [],
      fieldList: [],
      values: {},
      editMainInfo: true,
      gendenrenIndex: 0,
      TABLENAME_CRMClientInfoEmp: 'TABLENAME_CRMClientInfoEmp',
      nowDate: new Date(),
      main_fieldName: '',
      showClientNo: true
    }
  },
  computed: {
    tableName () {
      return 'CRMClientInfo'
    },
    keyId () {
      return this.$route.params.keyId
    }
  },
  methods: {
    ...mapActions(['detail', 'update', 'reportQuery', 'del']),
    // 加载数据函数
    feachData () {
      Indicator.open({text: '数据拉取中...', spinnerType: 'snake'})
      let vm = this
      // 对this.fieldList数据信息进行模板筛选
      vm.reportQuery({reportNumber: 'CRMClientModule'}).then((obj) => {
        // console.log(obj)
        let modelObj = [] // 先加载模板筛选信息，保存在该数组
        let filterArr = obj.rows.filter(item => item.id === this.$route.params.ModuleId)
        let modelArr = filterArr[0].pageFields.split(',')
        modelArr.forEach(item => {
          if (item !== '') {
            modelObj[item] = item
          }
        })
        console.log(modelObj) // 筛选条件
        // 联系人明细表字段以contact打头，需校验模板
        let modelDetObj = []
        for (let key in modelObj) {
          if (key.indexOf('contact') === 0) {
            let keyName = key.substring(7, key.length)
            modelDetObj[keyName] = keyName
          }
        }
        console.log(modelDetObj)
        // 加载数据
        this.detail({tableName: this.tableName, keyId: this.keyId}).then(data => {
          // 往所有的明细表选项数据中插入一个判断当前明细编辑还是保存的值
          data.childTableList.forEach(({name}) => {
            if (data.values['TABLENAME_' + name].length > 0) {
              data.values['TABLENAME_' + name].forEach(function (item) {
                item.showDetailEdit = 'true'
              })
            }
          })
          for (let key in vm.$data) {
            vm.$data[key] = data[key]
          }
          // 根据返回的接口结果重写data中的数据，注意如果返回的结果中无该key，需要重新定义data，否则是undeined
          vm.$data.editMainInfo = true
          vm.$data.gendenrenIndex = 0
          vm.$data.TABLENAME_CRMClientInfoEmp = 'TABLENAME_CRMClientInfoEmp'
          vm.$data.nowDate = new Date()
          vm.$data.main_fieldName = ''
          modelObj.ClientNo ? (vm.$data.showClientNo = true) : (vm.$data.showClientNo = false)
          // 处理主表信息
          vm.fieldList = vm.fieldList.filter(field => field.inputType !== 100 && field.inputType !== 3 && field.fieldType !== 14 && field.fieldName !== 'ClientName' && field.fieldName !== 'ClientNo' && field.fieldName in vm.$data.values && field.fieldName in modelObj)
          vm.fieldList.forEach(function (item, index, e) {
            if (item.inputType === 1 && item.EnumItem !== undefined) {
              item.EnumItem.unshift({name: '请选择', value: ''})
            }
          })
          // 处理明细表信息
          vm.childTableList.forEach(({name}) => {
            if (name === 'CRMClientInfoDet') {
              console.log(vm.childShowField[name])
              vm.childShowField[name] = vm.childShowField[name].filter(field => field.inputType !== 100 && field.inputType !== 3 && field.fieldName in modelDetObj)
            } else {
              vm.childShowField[name] = vm.childShowField[name].filter(field => field.inputType !== 100 && field.inputType !== 3)
            }
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
      })
    },
    // 主表跟明细表编辑状态的切换
    detailEdit: function () {
      this.editMainInfo = false
    },
    // 保存主表信息
    detailSave: function () {
      this.saveDataFn('main', '', '')
    },
    // 保存明细
    childDetailSaveFn: function (tabel, index) {
      this.saveDataFn('child', tabel, index)
    },
    // 根据values中的字段新增明细list
    addDetailListFn: function (item) {
      let values = this.dataToString(this.values)
      this.update({tableName: this.tableName, values}).then(data => {
        this.$data.values[item][this.$data.values[item].length - 1].showDetailEdit = 'true'
        let addOption = {}
        // f_ref为关联当前详情的key，showDetailEdit为当前明细拥有编辑或保存的判断值
        for (let key in this.$data.values[item][0]) {
          addOption[key] = ''
          addOption.f_ref = this.$data.values[item][0].f_ref // ref_f是关联字段
          addOption.showDetailEdit = 'false'
        }
        this.$data.values[item].push(addOption)
      }).catch(({message}) => {
        Toast({message: '添加失败，页面数据异常不可保存', duration: 1500})
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
    },
    // 删除明细表list个数
    detDetailFn: function (item, index) {
      MessageBox.confirm('确定要删除该明细信息?').then(action => {
        this.$data.values[item].splice(index, 1)
        let values = this.dataToString(this.values)
        Indicator.open({text: '删除中...', spinnerType: 'snake'})
        this.update({tableName: this.tableName, values}).then(data => {
          Indicator.close()
          Toast({message: '删除明细成功', duration: 1000})
        }).catch(({message}) => {
          Indicator.close()
          Toast({message: '删除明细成功', duration: 1000})
        })
      })
    },
    // 打开明细变的编辑
    editTABLENAMEInfo: function (tabel, index) {
      this.$data.values[tabel][index].showDetailEdit = 'fasle'
    },
    // 保存，注意保存失败不改变编辑状态
    saveDataFn: function (name, table, index) {
      let values = this.dataToString(this.values)
      this.update({tableName: this.tableName, values}).then(data => {
        Toast({message: '保存成功', duration: 1000})
        if (name === 'main') {
          this.editMainInfo = true
        } else {
          this.$data.values[table][index].showDetailEdit = 'true'
        }
      }).catch(({message}) => {
        Toast({message: message, duration: 1000})
      })
    },
    // 打开选择员工的弹框
    openPopup: function (item, table, index) {
      this.TABLENAME_CRMClientInfoEmp = table
      this.gendenrenIndex = index
      if (item === 'tblEmployee.EmpFullName' || item === 'tblDepartment.DeptFullName') {
        this.$router.push({name: 'popupEmployee', params: { prevRouteName: this.$route.name, keyId: this.$route.params.keyId, tableName: this.$route.params.tableName }})
      }
    },
    // 打开时间类型的DateTimePicker
    openDateTimePicker: function (ref) {
      this.$refs[ref][0].startDate = new Date(1970, 0, 1)
      this.$refs[ref][0].open()
      this.$data.main_fieldName = ref
    },
    // 回填date，明细表做特殊处理
    getDate: function (value) {
      let time = dateformat(value, 'yyyy-MM-dd')
      let thisStr = this.$data.main_fieldName
      this.$refs[thisStr + 'timeData'][0].value = time
      // 截取明细表中的信息
      if (thisStr.indexOf('_|_') >= 0) {
        let thisArr = thisStr.split('_|_')
        let detTable = thisArr[0]
        let index = thisArr[1]
        let fieldName = thisArr[2]
        this.$data.values[detTable][index][fieldName] = time
      } else {
        this.$data.values[thisStr] = time
      }
    },
    // 删除用户
    deleteDetail: function () {
      MessageBox.confirm('确定要删除该用户数据?').then(action => {
        Indicator.open({text: '删除中...', spinnerType: 'snake'})
        this.del({tableName: this.tableName, keyId: this.keyId, defineInfo: '是否删除'}).then((resolve) => {
          Indicator.close()
          this.$router.replace({
            name: 'CRMClientInfoList'
          })
        })
      })
    }
  },
  watch: {
    '$route' (to, from) {
      // 如果从列表页进入详情页，就要重新拉取数据
      if (from.name === 'CRMClientInfoList' && to.name === 'CRMClientInfoDetail') {
        this.feachData()
      }
      // 选择跟单人员后回填信息
      var vm = this
      if (from.name === 'popupEmployee') {
        if (to.params.checked) {
          let checkedEmp = to.params.checked
          vm.values[vm.TABLENAME_CRMClientInfoEmp][vm.gendenrenIndex]['DepartmentCode'] = checkedEmp.DepartmentCode
          vm.values[vm.TABLENAME_CRMClientInfoEmp][vm.gendenrenIndex]['EmployeeID'] = checkedEmp.EmployeeID
          vm.values[vm.TABLENAME_CRMClientInfoEmp][vm.gendenrenIndex]['tblDepartment.DeptFullName'] = checkedEmp.tblDepartment_DeptFullName
          vm.values[vm.TABLENAME_CRMClientInfoEmp][vm.gendenrenIndex]['tblEmployee.EmpFullName'] = checkedEmp.tblEmployee_EmpFullName
          vm.values[vm.TABLENAME_CRMClientInfoEmp][vm.gendenrenIndex].id = vm.values[vm.TABLENAME_CRMClientInfoEmp][vm.gendenrenIndex].id ? vm.values[vm.TABLENAME_CRMClientInfoEmp][vm.gendenrenIndex].id : -1
        }
      }
    }
  },
  created () {
    this.feachData()
  },
  // 保存当前页面的scrollTop，如果是从弹框页面返回时，应该处于当前的scrollTop
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
    .mint-header.is-fixed{
      z-index:100;
    }
    .page_cont.CRMdetail_page{
      >div.main_info>div>div>div{
        border-radius:3px;
        box-shadow: 1px 1px 7px #d6d6d6;
        padding:12px 16px !important;
      }
      >div.childDetail>div>div>div{
        border-radius:3px;
        box-shadow: 1px 1px 7px #d6d6d6;
        padding:8px 16px 10px !important;
      }
      .mint-field,.mint-cell{
        min-height:38px;
        color:#98979d;
      }
      padding: 40px 10px 0px;
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
      }
      .addDetailList{
        height:38px;
        line-height:38px;
        position:absolute;
        padding-left:25px;
        img{
          position:absolute;
          left:0;
          top:6px;
        }
      }
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
        margin-bottom:0;
        border-radius:3px;
        padding:12px 16px 8px;
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
          /*padding-right: 50px;
          white-space: nowrap;
          overflow:hidden;
          text-overflow:ellipsis;*/
        }
        .ClientNo{
          font-size:12px;
          color:#d2d1d6;
          margin:10px 0 4px;
        }
        .ClientName_edit{
        }
        p.edit_area{
          position:absolute;
          top:-28px;
          right:12px;
          span.detailEdit{
            position:relative;
            color:#40a9e5;
            font-size:14px;
            margin-left:40px;
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
              background:url(../../assets/CRM/saveIcon.png);
              background-size:100% 100%;
            }
          }
        }
        .fillTimeData{
          padding: 0 !important;
          box-shadow: none;
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
          width:160px;
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
      .CRM_Detailbutton{
        text-align:center;
        padding:20px 0 20px;
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
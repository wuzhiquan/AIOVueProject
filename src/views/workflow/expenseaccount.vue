<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="报销单" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
  </mt-header>
  <!-- 内容 -->
  <div class="page_cont detail_page">
    <!-- 主表内容 -->
    <div class="main_info">
      <template v-if="!isEdit">
        <div class="createInfo">
          <p class="creatorImg"><img src="../../assets/man.png" alt=""></p>
          <p class="creatorInfo">
            <span class="creator">{{createByName}}</span><br>
            <span class="flowDepictLink" @click="$router.push({path: '/workflow/approveFlowdepict/'})">
              {{lastWorkFlowNode}}<span style="color:#d9d9d9">&nbsp;&gt;</span>
            </span>
            <span class="createTime"></span>
          </p>
        </div>
      </template>
      <mt-cell title="申请日期" :is-link="isEdit" @click.native="openPicker">
        <span>{{ ApplyDate?ApplyDate:'请选择'}}</span>
      </mt-cell>
      <mt-cell ref="field-EmployeeCode" title="报销人员" :is-link="isEdit" v-model="EmployeeCode" @click.native="chooseEmployee">
        <span>{{ $data['tblEmployee.EmpFullName']?$data['tblEmployee.EmpFullName']:'请选择'}}</span>
      </mt-cell>
      <mt-field ref="field-remark" :readonly="!isEdit" :placeholder="isEdit ? '请输入报销事由' : '无报销事由'" type="textarea" v-model="remark" rows="3"></mt-field>
      <mt-datetime-picker type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="getDate" ref="picker" v-model="showDate"></mt-datetime-picker>
    </div>
    <!-- 明细表内容 -->
    <div class="detail_info_wrap" v-for="(item, index) in TABLENAME_tblexpenseaccountDet">
      <p class="info_text">报销明细{{ index + 1 }}
        <span @click="delDetail(index)" v-if="TABLENAME_tblexpenseaccountDet.length > 1 && isEdit">删除</span>
      </p>
      <div class="detail_info">
        <template v-if="isEdit"> <!-- 编辑状态 -->
          <div class="expen_select mint-cell">
            <label>费用类型</label>
            <select v-model="item.ExpenseaccountType">
              <option  v-for="option in selectOption" :value="option.value">{{option.name}}</option>
            </select>
            <i class="mint-cell-allow-right"></i>
          </div>
        </template>
        <mt-cell title="费用类型" v-if="!isEdit && selectOption.length > 0" :value="''">
        </mt-cell>
        <mt-field :ref="`field-TABLENAME_tblexpenseaccountDet_${index}_EmployeeCode`" label="费用说明" :readonly="!isEdit" :placeholder="isEdit ? '请输入费用说明' : '无费用说明'"  type="text" v-model="item.EmployeeCode"></mt-field>
        <mt-field :ref="`field-TABLENAME_tblexpenseaccountDet_${index}_Business`" label="费用金额" :readonly="!isEdit" placeholder="请输入费用金额" type="number" v-model="item.Business"></mt-field>
      </div>
    </div>
    <!-- 添加明细块 -->
    <template v-if="isEdit">
      <div class="add_detail">
        <mt-cell title="添加明细" @click.native="addDetail">
          <span></span>
          <img slot="icon" src="../../assets/add.png" width="24" height="24">
        </mt-cell>
      </div>
    </template>
    <!-- 显示总金额区域 -->
    <p class="total_fee">总金额：<span>{{totalFee}}</span><span>元</span></p>
  </div>
  <div  class="buttonArea">
    <p class="checkBtn" v-if="opType === 'detail' && updateRight && workFlowNode === '0'" @click="updatePre">修改</p>
    <p class="checkBtn" v-if="opType === 'detail' && checkRight && workFlowNode !== '0'" @click="$router.push({name:'deliver', params: {tableName, keyId, opType: 'fallback'}})">回退</p>
    <p class="checkBtn" v-if="opType === 'detail' && checkRight" @click="$router.push({name:'deliver', params: {tableName, keyId, opType: 'send'}})">转交</p>
    <p class="checkBtn" v-if="opType === 'detail' && hasCancel" @click="cancel">撤回</p>
    <p class="checkBtn" v-if="opType === 'detail' && hurryTrans" @click="hurry">催办</p>
    <p class="checkBtn" v-if="opType !== 'detail'" @click="saveData">保存并送审</p>
  </div>
</div>
</template>

<script>
import {mapActions, mapMutations, mapGetters} from 'vuex'
import {dateformat} from '../../fmt'
import { Button, Field, Header, DatetimePicker, Cell, Indicator, Toast, MessageBox } from 'mint-ui'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import 'mint-ui/lib/button/style.css'
import 'mint-ui/lib/field/style.css'
import 'mint-ui/lib/header/style.css'
import 'mint-ui/lib/datetime-picker/style.css'
import 'mint-ui/lib/cell/style.css'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/toast/style.css'
import 'mint-ui/lib/message-box/style.css'
// 原始数据
let rawData
export default {
  name: 'expenseaccount',
  components: {
    'mt-button': Button,
    'mt-field': Field,
    'mt-header': Header,
    'mt-datetime-picker': DatetimePicker,
    'mt-cell': Cell
  },
  mixins: [validationMixin],
  validations: {
    EmployeeCode: { required },
    remark: { required },
    TABLENAME_tblexpenseaccountDet_Cp: { // 校验明细表的属性
      $each: {
        EmployeeCode: { required },
        Business: { required }
      }
    }
  },
  data: function () {
    return {
      remark: '', // 报销说明
      BillNo: '', // 订单编号
      showDate: new Date(),
      EmployeeCode: '', // 报销人编号
      'tblEmployee.EmpFullName': '',
      DepartmentCode: '', // 部门编号
      ApplyDate: '', // 报销说明
      appendixno: 0,
      originalBorrow: 0.0,
      backBlance: 0.0,
      TABLENAME_tblexpenseaccountDet: [
        {EmployeeCode: '', Business: '', ExpenseaccountType: '', _timestamp: new Date().getTime()}
      ], // 报销明细表
      // 反审核权限
      retCheckRight: false,
      // 审核权限
      checkRight: false,
      // 催办权限
      hurryTrans: false,
      // 撤回权限
      hasCancel: false,
      // 修改权限
      updateRight: false,
      createByName: null,
      createTime: null,
      workFlowNode: null,
      // 当前单据的操作类型
      opType: 'add'
    }
  },
  computed: {
    TABLENAME_tblexpenseaccountDet_Cp () { // 明细表单的属性加_Cp
      let obj = {}
      this.TABLENAME_tblexpenseaccountDet.forEach(item => { obj[item._timestamp] = item })
      return obj
    },
    totalFee () {
      let total = 0.00
      this.TABLENAME_tblexpenseaccountDet.forEach(({ Business }) => { total += Number(Business) })
      return total.toFixed(2)
    },
    selectOption () {
      return [
       {name: '请选择', value: ''},
       {name: '交通费', value: '1'},
       {name: '住宿费', value: '2'},
       {name: '餐饮费', value: '3'},
       {name: '通讯费', value: '4'},
       {name: '补助', value: '5'},
       {name: '其他', value: '6'}
      ]
    },
    tableName () {
      return 'tblexpenseaccount'
    },
    keyId () {
      return this.$route.params.keyId
    },
    isEdit () {
      return this.opType !== 'detail'
    },
    lastWorkFlowNode () {
      return this.workFlowNode === '0' ? '开始' : this.getCurFlowDepictLast().workFlowNode
    }
  },
  methods: {
    ...mapActions(['addPre', 'add', 'update', 'popupSelectInfo', 'getEnum', 'detail', 'cancelTo', 'hurryTransFunc']),
    ...mapMutations(['curFlowDepict']),
    ...mapGetters(['getCurFlowDepictLast']),
    // 获取报销时间
    'getDate': function (value) {
      this.ApplyDate = dateformat(value, 'yyyy-MM-dd')
    },
    // 打开datapicker
    'openPicker': function () {
      this.isEdit && this.$refs.picker.open()
    },
    // 添加明细
    'addDetail': function () {
      this.TABLENAME_tblexpenseaccountDet.push({EmployeeCode: '', Business: '', ExpenseaccountType: '', _timestamp: new Date().getTime()})
    },
    // 删除明细
    delDetail (index) {
      this.TABLENAME_tblexpenseaccountDet.splice(index, 1)
    },
    // 保存数据
    saveData () {
      this.$v.touch
      if (this.$v.$invalid) {
        let unvalidField = Object.keys(this.$v).filter(item => {
          if (item in this.$data || this[item]) {
            return this.$v[item].$invalid
          } else {
            return false
          }
        })[0]
        if (/^TABLENAME_\w+_Cp$/.test(unvalidField)) { // 明细
          let originalUnvalidField = unvalidField.slice(0, unvalidField.length - 3) // 原始的属性名，不带_Cp
          let fields = this.$data[originalUnvalidField][0]
          let invalidItem
          let index = 0
          let vm = this
          let _timestamp
          for (; index < this.$data[originalUnvalidField].length; index++) { // 找出错误的明细
            _timestamp = this.$data[originalUnvalidField][index]._timestamp
            if (vm.$v[unvalidField].$each[_timestamp].$invalid) {
              invalidItem = vm.$v[unvalidField].$each[_timestamp]
              break
            }
          }
          unvalidField = originalUnvalidField + `_${index}_` + Object.keys(invalidItem).filter(item => item in fields && invalidItem[item].$invalid)[0]
        }
        let field = this.$refs['field-' + unvalidField]
        if (Array.isArray(field)) { // 明细
          field = field[0]
        }
        if (field instanceof window.HTMLElement && field.getAttribute('is-link')) {
          Toast({message: '请选择' + field.getAttribute('title'), duration: 1000})
        } else if (field['isLink']) {
          Toast({message: '请选择' + field.title, duration: 1000})
        } else if (field.title) {
          Toast({message: '请输入' + field.title, duration: 1000})
        } else {
          Toast({message: field.placeholder, duration: 1000})
        }
        return
      }
      let values = Object.assign({}, this.$data)
      Indicator.open({
        text: '数据提交中...',
        spinnerType: 'snake'
      })
      let method = 'add'
      if (this.opType === 'update') {
        method = 'update'
        values.id = this.keyId
        values.printCount = 0
      }
      values = window.JSON.stringify(values)
      let postData = {tableName: this.tableName, values}
      this[method](postData).then(({keyId, tableName}) => {
        Indicator.close()
        if (keyId === undefined) {
          keyId = this.keyId
          tableName = this.tableName
        }
        this.$router.replace({
          name: 'deliver',
          params: {
            tableName: tableName,
            keyId: keyId,
            opType: 'send' // 处理转交或者回退的参数，send是转交，fallback是回退
          }
        })
      }).catch(({message}) => {
        Indicator.close()
        Toast({message: message, duration: 1000})
      })
    },
    fetchData () {
      let vm = this
      if (this.opType === 'add') { // 新增时拉取数据
        // 重置data
        for (let key in vm.$data) {
          if (!Array.isArray(rawData[key])) {
            vm.$data[key] = rawData[key]
          } else {
            vm.$data[key].splice(0, vm.$data[key].length)
          }
        }
        // 设置申请时间为今天
        this.getDate()
        // 添加明细
        this.addDetail()
        // 拉取费用类型
        // 拉取默认信息
        this.addPre({tableName: this.tableName}).then(({values}) => {
          vm.EmployeeCode = values.EmployeeCode
          vm['tblEmployee.EmpFullName'] = values['tblEmployee.EmpFullName']
          vm.DepartmentCode = values.DepartmentCode
        })
      } else { // 详情时拉取数据
        this.detail({tableName: this.tableName, keyId: this.keyId}).then(({values, fieldList, retCheckRight, checkRight, hurryTrans, hasCancel, updateRight, flowDepict}) => {
          for (let key in vm.$data) {
            if (key in values) {
              if (Array.isArray(values[key])) {
                vm.$data[key].splice(0, vm.$data[key].length)
                values[key].forEach(item => {
                  item._timestamp = new Date().getTime()
                  vm[key].push(item)
                })
              } else {
                vm.$data[key] = values[key]
              }
            }
          }
          this.retCheckRight = retCheckRight
          this.checkRight = checkRight
          this.hurryTrans = hurryTrans
          this.hasCancel = hasCancel
          this.updateRight = updateRight
          vm.curFlowDepict(flowDepict)
          // 设置费用类型
          Indicator.close()
        }).catch(({message}) => {
          Indicator.close()
          Toast({ message: message, duration: 1000 })
        })
      }
    },
    chooseEmployee () {
      if (this.isEdit) {
        this.$router.push({name: 'popupEmployee', params: { prevRouteName: this.$route.name }})
      }
    },
    // 催办
    hurry () {
      let vm = this
      MessageBox({
        title: '提示',
        message: '请输入催办信息',
        showCancelButton: true,
        showInput: true,
        inputValue: '有费用报销单需要你审核，请查看',
        $type: 'confirm'
      })
      .then(({ value: content, action }) => {
        Indicator.open({text: '催办中...', spinnerType: 'snake'})
        vm.hurryTransFunc({tableName: vm.tableName, keyId: vm.keyId, content}).then(message => {
          Indicator.close()
          Toast({ message, duration: 1000 })
        }).catch(message => {
          Indicator.close()
          Toast({ message, duration: 1000 })
        })
      })
    },
    cancel () {
      let vm = this
      MessageBox.confirm('确定要撤回此单据?').then(action => {
        Indicator.open({text: '撤回中...', spinnerType: 'snake'})
        vm.cancelTo({tableName: vm.tableName, keyId: vm.keyId}).then(message => {
          vm.fetchData()
          Indicator.close()
          Toast({ message, duration: 1000 })
        }).catch(message => {
          Indicator.close()
          Toast({ message, duration: 1000 })
        })
      })
    },
    updatePre () {
      let tableName = this.tableName
      let keyId = this.keyId
      this.$router.push({ path: `/workflow/approvedetredirect/${tableName}/${keyId}?opType=update` })
    }
  },
  created () {
    // 保存原始数据
    rawData = Object.assign({}, this.$data)
    this.opType = this.$route.query.opType ? this.$route.query.opType : 'add'   // 这时候的opType是detail或者add的其中一种
    this.fetchData() // 拉取数据
  },
  watch: {
    '$route' (to, from) {
      // 选择报销人员后回填信息
      if (from.name === 'popupEmployee') {
        if (to.params.checked) {
          let checkedEmp = to.params.checked
          this.EmployeeID = checkedEmp.EmployeeID
          this['tblEmployee.EmpFullName'] = checkedEmp.tblEmployee_EmpFullName
          this.DepartmentCode = checkedEmp.DepartmentCode
        }
      } else if (to.name === 'workflowExpenseaccount') { // 根据query设置opType
        this.opType = to.query.opType ? to.query.opType : 'add'  // 这时候的opType是update或者detail的其中一种
        this.fetchData() // 拉取数据
      }
    }
  }
}
</script>
<style>
  .mint-msgbox-input input{
    height:26px;
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
    background:$background-color;
    overflow: hidden;
    .page_cont.detail_page{
      padding:41px 0 45px 0;
      height: 100%;
      box-sizing: border-box;
      background:$background-color;
      overflow-y: auto;
      overflow-x: hidden;
      .main_info,
      .detail_info,
      .add_detail{
        padding: 0 1rem;
        background: $background-color-block;
        margin-bottom:1rem;
      }
      .main_info{
        margin-bottom:0;
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
          .creatorImg {
            position: absolute;
            width: 40px;
            height: 40px;
            background-color: gray;
            border-radius: 20px;
            margin: 10px 16px 10px 0;
            img {
              width: 100%;
              height: 100%;
              border: 0;
              border-radius: 50%;
            }
          }
          .creatorInfo {
            box-sizing: border-box;
            height: 40px;
            margin: 10px 0 10px 56px;
            .creator {
              font-weight: bolder;
            }
            .flowDepictLink,.createTime {
              display: inline-block;
              font-size: smaller;
            }
            .flowDepictLink {
              color: #26A2FF;
              min-width: 100px;
            }
            .createTime {
              right: 16px;
            }
          }
        }
      }
      .detail_info{
        margin-bottom:0;
        .expen_select{
          padding:0 10px;
          line-height:3rem;
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
            color:$p-text-color;
            background:$background-color-block;
            font-size:16px;
            appearance:none;
            -moz-appearance:none;
            -webkit-appearance:none;
            right:2.1rem;
            direction: rtl;
            option{
              direction: ltr;
            }
          }
        }
      }
      .add_detail{
        .mint-cell-text{
          color:$p-text-color-light;
          font-size:14px;
        }
      }
      .button{
        padding:0 1rem 1rem;
      }
      p.info_text{
        font-size:14px;
        color:$p-text-color;
        padding: 1.2rem 1.5rem 0.5rem;
        position:relative;
        span{
          position:absolute;
          right:1.5rem;
          color:$p-text-color-light;
        }
      }
      p.total_fee{
        padding:1rem;
        text-align:right;
        margin-bottom:1.8rem;
        color:$p-text-color;
        span{
          color:$p-text-color-light;
          font-size:18px;
        }
      }
    }
    .mint-header-title{
      font-size:18px;
    }
    .buttonArea {
      border-top:#e8e8e8 solid 1px;
      bottom: 0;
      right: 0;
      left: 0;
      position: fixed;
      z-index: 1;
      height: 30px;
      line-height: 30px;
      background-image: -webkit-linear-gradient(top, #d9d9d9, #d9d9d9 50%, transparent 50%);
      background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
      background-size: 120% 1px;
      background-repeat: no-repeat;
      background-position: top left;
      background-origin: content-box;
      padding: 5px 0;
      background: #fff;
      text-align: center;
      .checkBtn {
        color: #26A2FF;
        font-size: larger;
        width: 49%;
        display: inline-block;
      }
      .checkBtn:nth-last-child(2){
        border-right: 1px solid #7c8192;
      }
    }
  }
</style>

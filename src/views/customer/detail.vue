<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="客户详情" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
 
  </mt-header>
  <!-- 内容 -->
  <div class="page_cont detail_page">
    <!-- 基本信息 -->
    <div class="main_info">
      <template ><!-- v-if="!isEdit" -->
        <div class="createInfo">
          <p class="creatorImg"><img src="../../assets/man.png" alt=""></p>
          <p class="creatorInfo">
            <span class="creator">{{ComFullName}}</span><br>
            <span class="flowDepictLink" @click="">
              {{ComNumber}}<span style="color:#d9d9d9">&nbsp;&gt;</span>
            </span>
          </p>
        </div>
      </template>
     <!--  数据存在或者可编辑状态，则显示，否则不显示 -->
    <mt-field label="单位简称" type="text" :readonly="!isEdit" v-if='ComName||isEdit' v-model='ComName'></mt-field>
    <mt-field label="拼音码" type="text" :readonly="!isEdit"  v-if='ComFullNamePYM||isEdit' v-model='ComFullNamePYM'></mt-field>
    </div>

    <!-- 客户信息 -->
    <div class="detail_info_wrap" v-if='khlx||ComTel||ComFax||isEdit'>
      <p class="info_text">客户信息</p>
      <div class="detail_info">
        <template > <!-- 编辑状态 -->
          <div class="expen_select mint-cell" >
            <label>客户类型</label>
            <select v-model='khlx' v-if='!isEdit' disabled="">
              <option  v-for="option in selectOption" :value="option.value">
              {{option.name}}
              </option>
            </select>
            <select v-model='khlx' v-if='isEdit'>
              <option  v-for="option in selectOption" :value="option.value">
              {{option.name}}
              </option>
            </select>
            <i class="mint-cell-allow-right"></i>
          </div>
        </template>
        <mt-field label="公司电话" placeholder="请输入公司电话" type="tel" :readonly="!isEdit"  v-if='ComTel||isEdit' v-model='ComTel' ></mt-field>
        <mt-field label="公司传真" placeholder="请输入公司传真" type="number" :readonly="!isEdit"  v-if='ComFax||isEdit' v-model='ComFax' ></mt-field>
      </div>
    </div>
    <div v-else>
     <p class="info_text">客户信息</p>
     <div class="detail_info">
     <mt-field label="无" :readonly="!isEdit" ></mt-field>
     </div>
    </div>

    <!-- 负责人信息 -->
    <div class="detail_info_wrap" v-if='ComContactor||ComContactorTel||ComContactorMobile||isEdit' >
      <p class="info_text">负责人信息</p>
      <div class="detail_info">
        <mt-field label="负责人" placeholder="请输入负责人"  type="text" :readonly="!isEdit"  v-if='ComContactor||isEdit' v-model='ComContactor'></mt-field>
        <mt-field label="负责人电话"  placeholder="请输入负责人电话" type="tel" :readonly="!isEdit"  v-if='ComContactorTel||isEdit' v-model='ComContactorTel'></mt-field>
        <mt-field label="负责人手机" placeholder="请输入负责人手机"  type="tel" :readonly="!isEdit"  v-if='ComContactorMobile||isEdit' v-model='ComContactorMobile'></mt-field>
        <mt-field label="信用额度"  placeholder="请输入信用额度" type="number" :readonly="!isEdit"  v-if='Credit||isEdit' v-model='Credit'></mt-field>
      </div>
    </div>
    <div v-else>
       <p class="info_text">负责人信息</p>
       <div class="detail_info">
       <mt-field label="无" :readonly="!isEdit" ></mt-field>
       </div>
    </div>

    <!-- 所有者信息 -->
    <div class="detail_info_wrap" v-if='tblEmployee_EmpFullName||tblDepartment_DeptFullName||SettleCys||InVoiceType||isEdit'  >
      <p class="info_text">所有者</p>
      <div class="detail_info">
      
      <mt-cell title="所有者" :is-link="isEdit"  v-if='tblEmployee_EmpFullName||isEdit' v-model="tblEmployee_EmpFullName" @click.native="chooseEmployee">
        <span>{{ tblEmployee_EmpFullName?tblEmployee_EmpFullName:'请选择'}}</span>
      </mt-cell>

      <mt-cell title="所属部门" :is-link="isEdit"  v-if='tblDepartment_DeptFullName||isEdit' v-model="tblDepartment_DeptFullName" @click.native="chooseEmployee">
        <span>{{ tblDepartment_DeptFullName?tblDepartment_DeptFullName:'请选择'}}</span>
      </mt-cell>

        <!-- <mt-field label="所属部门"  type="text" :readonly="!isEdit"  v-if='tblDepartment_DeptFullName||isEdit' v-model='tblDepartment_DeptFullName'></mt-field> -->
        <mt-field label="结算账期" type="text" :readonly="!isEdit"  v-if='SettleCys||isEdit' v-model='SettleCys'></mt-field>

         <template > <!-- 编辑状态 -->
          <div class="expen_select mint-cell" >
            <label>发票类型</label>
            <select v-model='InVoiceType' v-if='!isEdit' disabled="">
              <option  v-for="option in selectOption1" :value="option.value">
              {{option.name}}
              </option>
            </select>
            <select v-model='InVoiceType' v-if='isEdit'>
              <option  v-for="option in selectOption1" :value="option.value">
              {{option.name}}
              </option>
            </select>
            <i class="mint-cell-allow-right"></i>
          </div>
        </template>
      </div>
    </div>

     <div v-else>
       <p class="info_text">负责人信息</p>
       <div class="detail_info">
       <mt-field label="无" :readonly="!isEdit" ></mt-field>
       </div>
    </div>
      <!-- 地址信息 -->

    <div class="detail_info_wrap" v-if='ShippingAddress||ComWebsite||ComAddress||ComEmail||isEdit'>
      <p class="info_text">地址信息</p>
      <div class="detail_info">
        <mt-field label="出货地址" type="text"  :readonly="!isEdit" v-if='ShippingAddress||isEdit' v-model='ShippingAddress'></mt-field>
        <mt-field label="公司网址" type="text"  :readonly="!isEdit" v-if='ComWebsite||isEdit' v-model='ComWebsite'></mt-field>
        <mt-field label="公司地址"  type="text"  :readonly="!isEdit" v-if='ComAddress||isEdit' v-model='ComAddress'></mt-field>
        <mt-field label="公司email"  type="email"  :readonly="!isEdit" v-if='ComEmail||isEdit' v-model='ComEmail'></mt-field>
      </div>
    </div>

     <div v-else>
       <p class="info_text">地址信息</p>
       <div class="detail_info">
       <mt-field label="无" :readonly="!isEdit" ></mt-field>
       </div>
    </div>

    <!-- 账户信息 -->

     <div class="detail_info_wrap" v-if='Account1||Account2||Account3||isEdit'>
      <p class="info_text" >账户信息</p>
      <div class="detail_info">
        <mt-field label="账户1" type="text"  :readonly="!isEdit" v-if='Account1||isEdit' v-model='Account1'></mt-field>
        <mt-field label="账户2" type="text"  :readonly="!isEdit" v-if='Account2||isEdit' v-model='Account2'></mt-field>
        <mt-field label="账户3"  type="text"  :readonly="!isEdit" v-if=' Account3||isEdit' v-model=' Account3'></mt-field>
      </div>
    </div>

      <div v-else>
       <p class="info_text">账户信息</p>
       <div class="detail_info">
       <mt-field label="无" :readonly="!isEdit" ></mt-field>
       </div>
    </div>

   <!-- 明细表内容 -->
    <div class="detail_info_wrap" v-for="(item, index) in TABLENAME_tblCompanyEmployeeDet">
      
      <p class="info_text">往单位联系人{{ index + 1 }}
        <span @click="delDetail(index)" v-if="TABLENAME_tblCompanyEmployeeDet.length > 1 && isEdit">删除</span>
      </p>

      <div class="detail_info">
        <mt-field label="联系人" type="text"  :readonly="!isEdit" v-if='item.ContactMan||isEdit' v-model='item.ContactMan'></mt-field>
        
        <template > <!-- 角色 -->
          <div class="expen_select mint-cell" >
            <label>角色</label>
            <select v-model='item.Role' v-if='!isEdit' disabled="">
              <option  v-for="option in selectRole" :value="option.value">
              {{option.name}}
              </option>
            </select>
            <select v-model='item.Role' v-if='isEdit'>
              <option  v-for="option in selectRole" :value="option.value">
              {{option.name}}
              </option>
            </select>
            <i class="mint-cell-allow-right"></i>
          </div>
        </template>


        <template > <!-- 性别 -->
          <div class="expen_select mint-cell" >
            <label>性别</label>
            <select v-model='item.Gender' v-if='!isEdit' disabled="">
              <option  v-for="option in selectGender" :value="option.value">
              {{option.name}}
              </option>
            </select>
            <select v-model='item.Gender' v-if='isEdit'>
              <option  v-for="option in selectGender" :value="option.value">
              {{option.name}}
              </option>
            </select>
            <i class="mint-cell-allow-right"></i>
          </div>
        </template>

<!--         <mt-cell title="生日" if="isEdit||item.BirthDay" @click.native="openPicker(index)">
          <span>{{ item.BirthDay?item.BirthDay:'请选择'}}</span>
        </mt-cell>

<template>
        <mt-datetime-picker type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"  @confirm="getDate" ref="picker" v-model="ApplyDate" ></mt-datetime-picker>
</template> -->
        <mt-field label="电话" type="text"  :readonly="!isEdit" v-if='item.Telephone||isEdit' v-model='item.Telephone'></mt-field>
        <mt-field label="手机" type="text"  :readonly="!isEdit" v-if='item.Mobile||isEdit' v-model='item.Mobile'></mt-field>
        <mt-field label="Email" type="text"  :readonly="!isEdit" v-if='item.ClientEmail||isEdit' v-model='item.ClientEmail'></mt-field>
        <mt-field label="备注" type="text"  :readonly="!isEdit" v-if='item.Remark||isEdit' v-model='item.Remark'></mt-field>
      </div>
    </div>

<!--  <mt-datetime-picker type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"  @confirm="getDate" ref="picker" v-model="item.BirthDay"></mt-datetime-picker> -->


      <!-- 来往单位联系人 -->
     <template v-if="isEdit">
      <div class="add_detail">
        <mt-cell title="添加往单位联系人 " @click.native="addDetail">
          <span></span>
          <img slot="icon" src="../../assets/add.png" width="24" height="24">
        </mt-cell>
      </div>
    </template>
  
    
    <!-- 显示总金额区域 -->
    <p class="total_fee"></p>
  </div>
  <!-- 按钮 -->
  <div  class="buttonArea">
    <p class="checkBtn" v-if="opType === 'detail' && updateRight " @click="updatePre" >修改</p>
    <p class="checkBtn" v-if="opType === 'detail' && deleteRight " @click="deletePre">删除</p>
    <p class="checkBtn" v-if="opType !== 'detail'"  >保存</p><!-- @click="saveData" -->
    <!-- <p class="checkBtn" >保存并送审</p> -->
  </div>
</div>
</template>


<!-- <div class="detail_info">
        <template > 
          <div class="expen_select mint-cell">
            <label>费用类型</label>
            <select >
              <option  v-for="option in selectOption" :value="option.value">{{option.name}}</option>
            </select>
            <i class="mint-cell-allow-right"></i>
          </div>
        </template>
        <mt-cell title="费用类型"  ></mt-cell>
        <mt-field label="费用说明" type="text" ></mt-field>
        <mt-field label="费用金额"  type="number" ></mt-field>
      </div>
    </div> -->
<script>
  import { Field, Button, Header, MessageBox, DatetimePicker, Radio, Indicator, Cell } from 'mint-ui'
  import 'mint-ui/lib/field/style.css'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/radio/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/indicator/style.css'
  import 'mint-ui/lib/datetime-picker/style.css'
  import { mapActions } from 'vuex'
  import {dateformat} from '../../fmt'
  // let rawData
  export default {
    name: 'customerDetail',
    components: {
      'mt-field': Field,
      'mt-button': Button,
      'mt-header': Header,
      'mt-radio': Radio,
      'mt-cell': Cell,
      'mt-indicator': Indicator,
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
      },
      selectOption1 () {
        return [
         {name: '请选择', value: ''},
         {name: '收据凭证', value: '3'},
         {name: '普通发票', value: '1'},
         {name: '增值税发票', value: '2'}
        ]
      },
      selectRole () {
        return [
         {name: '请选择', value: ''},
         {name: '法人', value: '1'},
         {name: '总经理', value: '2'},
         {name: '部门经理', value: '3'},
         {name: '组长', value: '4'},
         {name: '副总经理', value: '5'},
         {name: '副部长', value: '6'},
         {name: '主管', value: '7'},
         {name: '副主管', value: '8'},
         {name: '董事长', value: '9'},
         {name: '代理商', value: '10'},
         {name: '职员', value: '11'},
         {name: '其他', value: '12'},
         {name: '老板', value: '5136'},
         {name: '总监', value: '14'},
         {name: '产品经理', value: '15'}
        ]
      },
      selectGender () {
        return [
         {name: '请选择', value: ''},
         {name: '男', value: '1'},
         {name: '女', value: '2'}
        ]
      },
      tableName () {
        return 'tblCompany'
      },
      keyId () {
        return this.$route.params.keyId
      },
      isEdit () {
        return this.opType !== 'detail' // detail_info
      }
    },
    data: function () {
      return {
        showDate: new Date(),
        keyId: '',
        ComFullName: '',
        ComNumber: '',
        ComFullNamePYM: '',
        ComName: '',
        khlx: '',
        ComTel: '',
        ComFax: '',
        ComContactor: '',
        ComContactorTel: '',
        ComContactorMobile: '',
        Credit: '',
        tblEmployee_EmpFullName: '',
        tblDepartment_DeptFullName: '',
        SettleCys: '',
        InVoiceType: '',
        ShippingAddress: '',
        ComWebsite: '',
        ComAddress: '',
        ComEmail: '',
        Account1: '',
        Account2: '',
        Account3: '',
        //
        showdetail: false,
        ApplyDate: '',
        ct: '', // customertype客户类型
        checkRight: false,
        deleteRight: false,
        hasCancel: false,
        hurryTrans: false,
        retCheckRight: false,
        updateRight: false,
        opType: 'detail',
        TABLENAME_tblCompanyEmployeeDet: [
        {ContactMan: '', Role: '', Gender: '', BirthDay: new Date().getTime(), Telephone: '', Mobile: '', ClientEmail: '', Remark: ''}
        ]
      }
    },
    methods: {
      ...mapActions(['detail', 'hurryTransFunc', 'cancelTo', 'del']),
      // 初始化
      fetchData () {
        Indicator.open({text: '数据拉取中...', spinnerType: 'snake'})
        let vm = this
        // console.log(this.opType)
        this.detail({tableName: this.tableName, keyId: this.keyId}).then((
{checkRight, childShowField, childTableList, deleteRight, fieldList, hasCancel, hurryTrans, retCheckRight, updateRight, values}) => {
          for (let key in vm.$data) {
            if (key in values) {
              vm.$data[key] = values[key]
            }
          }
          console.log(vm.$data)
          // console.log(values)
          this.retCheckRight = retCheckRight
          this.checkRight = checkRight
          this.hurryTrans = hurryTrans
          this.hasCancel = hasCancel
          this.updateRight = updateRight
          this.deleteRight = deleteRight
        })
        Indicator.close()
      },
      // 选择员工
      chooseEmployee () {
        if (this.isEdit) {
          this.$router.replace({name: 'popupEmployee', params: { prevRouteName: this.$route.name }})
        }
      },
      // 保存
      save () {
        MessageBox.confirm(' ', '确认提交?').then(action => {
          MessageBox('', '提交成功').then(action => { this.$router.go(-1) })
        })
      },
      // 选择日期
      openPicker (index) {
        // console.log(this.$refs.picker[index])
        // console.log(this.$refs.picker[index])
        this.isEdit && this.$refs.picker[index].open()
      },
      // 获取报销时间
      getDate (value) {
        this.ApplyDate = dateformat(value, 'yyyy-MM-dd')
        // console.log(value)
        // console.log(BirthDay)
        // BirthDay = value
        // this.ApplyDate = dateformat(value, 'yyyy-MM-dd')
      },
      // 修改
      updatePre () {
        // let tableName = this.tableName
        let keyId = this.keyId
        this.$router.push({ path: `/customer/detail/tblCompany/${keyId}?opType=update` })
      },
      // 删除
      deletePre () {
        // let keyId = this.keyId
        MessageBox.confirm(' ', '确认删除?').then(action => {
          this.del({tableName: this.tableName, keyId: this.keyId})
          MessageBox('', '删除成功').then(action => { this.$router.go(-1) })
        })
      },
      // 添加明细
      addDetail () {
        console.log(6666)
        this.TABLENAME_tblCompanyEmployeeDet.push({ContactMan: '', Role: '', Gender: '', BirthDay: new Date().getTime(), Telephone: '', Mobile: '', ClientEmail: '', Remark: ''})
      },
       // 删除明细
      delDetail (index) {
        this.TABLENAME_tblCompanyEmployeeDet.splice(index, 1)
      }// ,
      // getDate (value) {
      //   var year = value.getFullYear()
      //   var month = value.getMonth() + 1
      //   var day = value.getDate()
      //   month = (month > 9 ? month : ('0' + month))
      //   day = (day > 9 ? day : ('0' + day))
      //   var dateStr = year + '-' + month + '-' + day
      //   this.ApplyDate = dateStr
      // }
    },
    created () {
      this.fetchData()
    },
    watch: {
      '$route' (to, from) {
        // 选择报销人员后回填信息
        if (from.name === 'popupEmployee') {
          if (to.params.checked) {
            let checkedEmp = to.params.checked
            console.log(checkedEmp)
            this.tblEmployee_EmpFullName = checkedEmp.tblEmployee_EmpFullName
            this.tblDepartment_DeptFullName = checkedEmp.tblDepartment_DeptFullName
          }
        } else if (from.name === 'customerDetail') {
          if (to.query.opType === 'update') {
            this.opType = 'add'
            this.fetchData()
          }
          if (to.query.opType === 'detail') {
            this.opType = 'detail'
            this.fetchData()
          }
        } else if (from.name === 'customerindex') {
          this.opType = 'detail'
          this.fetchData()
        }
        // console.log(to.name)
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
        color:$p-text-color-light;
        padding: 1.2rem 1.5rem 0.5rem;
        position:relative;
        span{
          position:absolute;
          right:1.5rem;
          color:$p-text-color-light;
        }
      }
      p.total_fee{
        padding:0 1rem;
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

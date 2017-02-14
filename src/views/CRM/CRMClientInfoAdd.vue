<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="添加客户" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
  </mt-header>
  <!-- 内容 -->
  <div class="page_cont CRMAdd_page">
    <!-- 
    用到的筛选inputType 跟fileType
    inputType = { '0' => 输入; '1' => 固定选项型; '2' => 弹出框选择; '100' => 不输入; '3' => 隐藏; '4' => 多语言; '5' => 复选框; '6' => 隐藏可显示; '7' => 拼音码; '8' => 只读; '10' => 单选框; '11' => 功能方法; '14' => 部门弹出框; '15' => 职员弹出框; '16' => 动态选项型; '17' => 分隔线 }

    fieldType = { '0' => 整型; '1' => 双精度; '2' => 任意字符; '3' => 备注; '4' => 英文字符; '5' => 短日期; '6' => 长日期; '7' => ip地址; '8' => 电邮; '9' => 固话; '10' => 手机; '11' => 电话; '12' => 网址; '13' => 图片; '14' => 附件; '15' => 邮编; '16' => HTML; '17' => 时间; '18' => 长字符; '19' => 密码; '20' => 中字符 }
    -->
    <!-- 主表内容 -->
    <p class="info_text">主表信息</p>
    <div class="main_info">
      <template v-for="field in addModelArray">
        <!-- 输入类型 -->
        <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && field.fieldType != 5 && field.fieldType != 14" :label="field.display" disableClear :placeholder="'请输入'+field.display" v-model="values[field.fieldName]"></mt-field>
        <!-- 时间类型 -->
        <div v-if="field.inputType == 0 && field.fieldType == 5">
          <div class="fillTimeData">
            <label>{{field.display}}</label>
            <input type="text" readonly @click="openDateTimePicker(field.fieldName)" v-model="values[field.fieldName]" :ref="field.fieldName+'timeData'" placeholder="选择日期">
          </div>
          <!-- <mt-field :label="field.display" disableClear :value="values[field.fieldName]?values[field.fieldName]:'选择日期'" readonly @click.native="openDateTimePicker(field.fieldName)" v-model="values[field.fieldName]"></mt-field> -->
          <mt-datetime-picker :ref="field.fieldName" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" v-model="nowDate" @confirm="getDate"></mt-datetime-picker>
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
        <template v-else="field.inputType == 2">
          <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2" :label="field2.display" disableClear :value="values[field2.fieldName]"></mt-field> 
        </template>
      </template>
    </div>
    <!-- 明细表内容 -->
    <div class="childDetail">
      <div class="detail_info_wrap" v-for="(item, index) in values['TABLENAME_CRMClientInfoDet']">
        <p class="info_text">联系人明细{{ index + 1 }}
          <span @click="delDetail(index)" v-if="values['TABLENAME_CRMClientInfoDet'].length > 1">删除</span>
        </p>
        <div>
          <div  class="detailList" v-for="field in addDetailArray" v-if="(field.inputType == 0 || field.inputType == 8) && field.fieldType != 5 && field.inputType != 1">
            <!-- 输入类型 -->
            <mt-field v-if="(field.inputType == 0 || field.inputType == 8) && field.fieldType != 5 && field.inputType != 1" :label="field.display" disableClear :value="values[field.fieldName]" :placeholder="'请输入'+field.display" v-model="values['TABLENAME_CRMClientInfoDet'][index][field.fieldName]"></mt-field>
          </div>
          <div class="add_detail">
            <mt-cell title="添加明细" @click.native="addDetail">
              <span></span>
              <img slot="icon" src="../../assets/add.png" width="24" height="24">
            </mt-cell>
          </div>
        </div>
      </div>
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
  name: 'CRMClientInfoAdd',
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
      fieldList: [],
      values: {
        TABLENAME_CRMClientInfoDet: [{UserName: ''}]
      },
      dataList: [],
      nowDate: new Date(),
      addModelArray: [], // 主表信息
      addDetailArray: [], // 明细表信息
      productionArray: [], // 产品信息
      modelArray: [], // 存需要编辑的的字段
      selectModel: '1', // 默认选择模板ID
      tableName: 'CRMClientInfo',
      strLen: 0
    }
  },
  methods: {
    ...mapActions(['detail', 'reportQuery', 'addPre', 'add', 'getEnum']),
    addModel (ModuleId) {
      Indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.addPre({tableName: this.tableName}).then((obj) => {
        let temArray = obj.fieldList
        // console.log(temArray)
        let vm = this
        let tableInfo = vm.$route.params.tableInfo
        temArray.forEach(function (item, index, e) {
          if (item.inputType === 1) {
            if (item.refEnumerationName.indexOf('ClientStatus') >= 0) {
              vm.strLen = item.refEnumerationName.substring(12, item.refEnumerationName.length).length
            }
            item.refEnumerationName = item.refEnumerationName.substring(0, item.refEnumerationName.length - vm.strLen)
            // console.log(item.refEnumerationName)
            vm.getEnum(item.refEnumerationName + tableInfo).then(obj => {
              obj.unshift({name: '请选择', value: ''})
              item.EnumItem = obj
            })
          }
        })
        let temDetailArray = obj.childShowField.CRMClientInfoDet
        this.reportQuery({reportNumber: 'CRMClientModule'}).then((obj) => {
          this.dataList = obj.rows
          Indicator.close()
          console.log(obj.rows)
          let modelStr = '' // 主表信息
          let groupStr = '' // 分组信息
          for (var i = 0; i < obj.rows.length; i++) {
            if (obj.rows[i].id === ModuleId) {
              modelStr = obj.rows[i].pageFields
              groupStr = obj.rows[i].groups
            }
          }
          let modelArray = []
          modelArray = modelStr.split(',')
          let groupArray = []
          groupArray = groupStr.split(';')
          console.log(groupArray)
          if (groupArray[3]) {
            let productionObj = {}
            let production = groupArray[3].substring(7, groupArray[3].length).split(',')
            production.forEach(function (item) {
              productionObj[item] = item
            })
            // console.log(productionObj)
            this.productionArray = temArray.filter(field => field.fieldName in productionObj)
            console.log(this.productionArray)
          }
          // 对主表信息进行过滤
          let modelObj = {}
          modelArray.forEach(item => { modelObj[item] = item })
          this.addModelArray = temArray.filter(field => field.fieldName in modelObj)
          let vm = this
          // console.log(this.addModelArray)
          this.addModelArray.forEach(function (item) {
            vm.values[item.fieldName] = item.defaultValue
          })
          // 对明细表信息进行过滤,特征：都是以contact开头的字段
          let detailArary = []
          modelArray.forEach(item => {
            if (item.substring(0, 7) === 'contact') {
              detailArary.push(item.substring(7))
            }
          })
          let detailObj = {}
          detailArary.forEach(item => { detailObj[item] = item })
          this.addDetailArray = temDetailArray.filter(field => field.fieldName in detailObj)
          this.addDetailArray.forEach(function (item) {
            vm.values['TABLENAME_CRMClientInfoDet'][0][item.fieldName] = ''
          })
        })
      })
    },
    'save': function () {
      let values = Object.assign({}, this.$data.values)
      values.ModuleId = this.$route.params.ModuleId
      values = window.JSON.stringify(values)
      Indicator.open({
        text: '数据提交中...',
        spinnerType: 'snake'
      })
      this.add({tableName: this.tableName, values}).then(({keyId, tableName}) => {
        Indicator.close()
        Toast({message: '提交成功', duration: 1000})
        setTimeout(() => {
          this.$router.replace({
            name: 'CRMClientInfoList'
          })
        }, 1000)
      }).catch(({message}) => {
        Indicator.close()
        Toast({message: message, duration: 1000})
      })
    },
    openDateTimePicker: function (ref) {
      this.$refs[ref][0].startDate = new Date(1970, 0, 1)
      this.$refs[ref][0].open()
      this.$data.main_fieldName = ref
    },
    getDate: function (value) {
      let time = dateformat(value, 'yyyy-MM-dd')
      let thisStr = this.$data.main_fieldName
      this.$data.values[thisStr] = time
      this.$refs[thisStr + 'timeData'][0].value = time
    },
    // 删除明细
    delDetail (index) {
      this.values['TABLENAME_CRMClientInfoDet'].splice(index, 1)
    },
    // 添加明细
    'addDetail': function () {
      let newDet = {}
      this.addDetailArray.forEach(function (item) {
        newDet[item.fieldName] = ''
      })
      this.values['TABLENAME_CRMClientInfoDet'].push(newDet)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      var ModuleId = vm.$route.params.ModuleId
      vm.addModel(ModuleId)
    })
  }
}
</script>
<style>
  .mint-msgbox-input input{
    height:26px;
  }
  .CRMAdd_page .main_info .mint-cell-title{
    min-width: 100px;
  }
  .CRMAdd_page .mint-cell-wrapper,
  .CRMAdd_page .mint-cell:last-child{
    background-image:none;
    padding: 0;
  }
  .CRMAdd_page .mobile .mint-cell-wrapper{
    display: block;
  }
  .CRMAdd_page .mobile .mint-cell-title{
    width: 105px;
    float: left;
  }
  .CRMAdd_page .mobile .mint-cell-title span,
  .CRMAdd_page .mobile .mint-cell-value a
  {
    display: block;
    height: 38px;
    line-height: 38px;
  }
  .CRMAdd_page input{
    color:#98979d;
  }
  .CRMAdd_page input::-webkit-input-placeholder {
    color:#ddd;
  }
  .CRMAdd_page input::-moz-placeholder{
    color:#ddd;
  }
  .CRMAdd_page input::-moz-placeholder{
    color:#ddd;
  }
  .CRMAdd_page input:-ms-input-placeholder{
    color:#ddd;
  }
  .CRMAdd_page .ClientName_edit .mint-field.is-textarea .mint-cell-value{
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
    .page_cont.CRMAdd_page{
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
          >div{box-shadow: 1px 1px 7px #d6d6d6;padding-left:16px;padding-right:16px;background:#fff;border-radius:3px;}
          position:relative;
          .detDetail{
            position:absolute;
            right:16px;
            top:46px;
            font-size:14px;
            color:rgb(51, 136, 204);
            z-index:1;
          }
          .detailList{
            background:$background-color-block;
          }
          .add_detail{
            background:$background-color-block;
          }
        }
        position:relative;
        span.childDetailEdit{
          position:absolute;
          right:16px;
          top:10px;
          font-size:14px;
          color:rgb(51, 136, 204);
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
    }
    .mint-header-title{
      font-size:18px;
    }
  }
</style>

<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header :title="$route.query.title" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
  </mt-header>
  <!-- 内容 -->
  <div class="page_cont detail_page">
    <!-- 主表内容 -->
    <div class="main_info">
      <div class="createInfo">
        <p class="creatorImg"><img src="../../assets/man.png" alt=""></p>
        <p class="creatorInfo">
          <span class="creator">{{values.createByName}}</span><br>
          <span class="flowDepictLink" @click="$router.push({path: '/workflow/approveFlowdepict/'})">
              {{lastWorkFlowNode}}<span style="color:#d9d9d9">&nbsp;&gt;</span>
            </span>
            <span class="createTime"></span>
        </p>
      </div>
      <template v-for="field in fieldList">
        <!-- 输入类型 -->
        <mt-field  v-if="field.inputType == 0 || field.inputType == 8" :label="field.display" readonly disableClear :value="values[field.fieldName]"></mt-field>
        <mt-field  v-if="field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == values[field.fieldName]).length > 0" :label="field.display" readonly disableClear :value="field.EnumItem.filter(item => item.value == values[field.fieldName])[0].name"></mt-field>
        <!-- 弹窗类型-->
        <template v-else="field.inputType == 2">
          <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2" :label="field2.display" readonly disableClear :value="values[field2.fieldName]"></mt-field> 
        </template>
      </template>
      <mt-cell title="附件" :value="fujian" v-if="fujian">
        <a :href="fujianUrl" style="text-decoration: none;color:#38c;outline:none;">{{fujian}}</a>
      </mt-cell>
    </div>
    <!-- 明细表内容 -->
    <template v-for="childTable in childTableList">
        <div class="detail_info_wrap" v-for="(childTableValues, index) in values[`TABLENAME_${childTable.name}`]">
          <p class="info_text">{{ childTable.display }}明细{{ index + 1 }}</p>
          <div class="detail_info">
            <template v-for="field in childShowField[childTable.name]">
              <mt-field  v-if="field.inputType == 0 || field.inputType == 8" :label="field.display" readonly disableClear :value="childTableValues[field.fieldName]"></mt-field>
              <mt-field  v-if="field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == childTableValues[field.fieldName]).length > 0" :label="field.display" readonly disableClear :value="field.EnumItem.filter(item => item.value == childTableValues[field.fieldName])[0].name"></mt-field>
              <template v-else="field.inputType == 2">
                <mt-field v-for="field2 in field.PopupDis" v-if="field2.inputType == 2" :label="field2.display" readonly disableClear :value="childTableValues[field2.fieldName]"></mt-field> 
              </template>
            </template>
          </div>
        </div>
    </template>
  </div>
  <div class="buttonArea">
    <p class="checkBtn" v-if="checkRight && values.workFlowNode !== '0'" @click="$router.push({name:'deliver', params: {tableName, keyId, opType: 'fallback'}})">回退</p>
    <p class="checkBtn" v-if="checkRight" @click="$router.push({name:'deliver', params: {tableName, keyId, opType: 'send'}})">转交</p>
    <p class="checkBtn" v-if="hasCancel" @click="cancel">撤回</p>
    <p class="checkBtn" v-if="hurryTrans" @click="hurry">催办</p>
  </div>
</div>
</template>

<script>
import {mapActions, mapMutations, mapGetters} from 'vuex'
import {Toast, Button, Field, Header, DatetimePicker, Indicator, Cell, MessageBox} from 'mint-ui'
import 'mint-ui/lib/toast/style.css'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/button/style.css'
import 'mint-ui/lib/field/style.css'
import 'mint-ui/lib/header/style.css'
import 'mint-ui/lib/datetime-picker/style.css'
import 'mint-ui/lib/cell/style.css'
import 'mint-ui/lib/message-box/style.css'
export default {
  name: 'approvedet',
  components: {
    'mt-button': Button,
    'mt-field': Field,
    'mt-header': Header,
    'mt-datetime-picker': DatetimePicker,
    'mt-cell': Cell
  },
  data: function () {
    return {
      checkRight: false,
      deleteRight: false,
      hasCancel: false,
      hurryTrans: false,
      retCheckRight: false,
      updateRight: false,
      opType: '',
      childShowField: {},
      childTableList: [],
      fieldList: [],
      flowDepict: [],
      values: {}
    }
  },
  computed: {
    tableName () {
      return this.$route.params.tableName
    },
    keyId () {
      return this.$route.params.keyId
    },
    lastWorkFlowNode () {
      return this.workFlowNode === '0' ? '开始' : this.getCurFlowDepictLast().workFlowNode
    },
    fujianUrl () {
      let url = ''
      if (this.fujian) {
        url = '/ReadFile?fileName=' + this.fujian + '&realName=' + this.fujian + '&tempFile=false&type=AFFIX&tableName=' + this.tableName
      }
      return url
    },
    fujian () {
      return this.values.fujian ? this.values.fujian : this.values.Attachment
    }
  },
  methods: {
    ...mapActions(['detail', 'hurryTransFunc', 'cancelTo']),
    ...mapMutations(['curFlowDepict']),
    ...mapGetters(['getCurFlowDepictLast']),
    feachData () {
      Indicator.open({text: '数据拉取中...', spinnerType: 'snake'})
      let vm = this
      // 加载数据
      this.detail({tableName: this.tableName, keyId: this.keyId}).then(data => {
        for (let key in vm.$data) {
          vm.$data[key] = data[key]
        }
        vm.curFlowDepict(vm.flowDepict)
        // 处理主表信息
        vm.fieldList = vm.fieldList.filter(field => field.inputType !== 100 && field.inputType !== 3 && field.fieldType !== 14 && field.display !== field.fieldName && field.fieldName in vm.$data.values)
        // 处理明细表信息
        vm.childTableList.forEach(({name}) => {
          vm.childShowField[name] = vm.childShowField[name].filter(field => field.inputType !== 100 && field.inputType !== 3 && field.display !== field.fieldName)
        })
        Indicator.close()
      }).catch(({message}) => {
        Indicator.close()
        Toast({ message: message, duration: 1000 })
      })
    },
    hurry () {
      let vm = this
      let _title = vm.$route.query.title
      MessageBox({
        title: '提示',
        message: '请输入催办信息',
        showCancelButton: true,
        showInput: true,
        inputValue: '有' + _title + '需要你审核，请查看',
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
    }
  },
  watch: {
    '$route' (to, from) {
      // 如果从我的工作流页面进来，就要重新拉取数据
      if (from.name === 'approve' && to.name === 'approvedetDefault') {
        this.feachData()
      }
    }
  },
  created () {
    this.feachData()
  }
}
</script>
<style>
  .mint-msgbox-input input{
    height:26px;
  }
  .main_info .mint-cell-title{
    min-width: 100px;
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
    .page_cont.detail_page{
      padding: 40px 0 60px 0;
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
    }
    .buttonArea {
      border-top:#e8e8e8 solid 1px;
      bottom: 0;
      right: 0;
      left: 0;
      position: fixed;
      z-index: 1;
      height: 40px;
      line-height: 40px;
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
    .mint-header-title{
      font-size:18px;
    }
  }
</style>

<template>
  <div class="page_wrap">
    <!-- 顶部 -->
    <mt-header :title="pageTitle" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </div>
      <!-- <div slot="right">
        <mt-button @click="save">确定</mt-button>
      </div> -->
    </mt-header>
    <div class="page_cont deliver_page">
      <p class="p_text" style="color:#000">当前步骤：<span style="color:#ed6d6d">{{currNodeName}}</span></p>
      <!-- 转交意见 -->
      <mt-field placeholder="请输入审批意见" type="textarea" rows="4" v-model="deliverance"></mt-field>
      <div class="forwardTime" v-if="showForwardTime">
        <mt-field label="办理时限" placeholder="输入实数" type="number" v-model="oaTimeLimit"></mt-field>
        <div class="oaTimeLimitUnit mint-cell">
          <select name="oaTimeLimitUnit" v-model="oaTimeLimitUnit">
            <option value="0">天</option>
            <option value="1">时</option>
            <option value="2">分</option>
          </select>
          <i class="mint-cell-allow-right"></i>
        </div>
      </div>
      <!-- 转交人 -->
      <p class="p_text">选择{{pageTitle}}步骤</p>
      <p class="p_text" style="padding:5px 10px 5px;">下一步骤：<span style="color:#26a2ff;">{{nextNodeName}}</span></p>
      <div class="parent_cell" v-for="(item, index) in dataList" :keyId="item.keyId" v-if="item.isopTypeNode">
        <mt-cell :title="item.name" is-link @click.native="showSelect(index)" :value="changeFormat(item.cellValue)"></mt-cell>
        <mt-checklist v-model="item.cellValue" :options="item.options" v-if="item.show" align="right" @click.native="selectChecker(index,$event)"></mt-checklist>
      </div>
      <div class="button">
        <mt-button size="large" type="primary" @click.native="deliverToU">确定</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Button, Header, Cell, Field, Checklist, Toast } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/field/style.css'
  import 'mint-ui/lib/checklist/style.css'
  import 'mint-ui/lib/toast/style.css'
  import { mapActions } from 'vuex'
  export default {
    name: 'deliver',
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-cell': Cell,
      'mt-field': Field,
      'mt-checklist': Checklist
    },
    data: function () {
      return {
        deliverance: '', // 意见
        currNodeName: '',
        currNode: '',
        designId: '',
        dataList: [],
        nextStep: '',
        index: 0,
        showForwardTime: false,
        oaTimeLimit: '',
        oaTimeLimitUnit: '0',
        nextNodeName: '请选择步骤',
        pageTitle: ''
      }
    },
    methods: {
      ...mapActions(['deliverPre']),
      ...mapActions(['deliverTo']),
      showSelect: function (index) {
        // 根据是否有办理时限显示办理时限
        if (this.dataList[index].forwardTime) {
          this.showForwardTime = true
        } else {
          this.showForwardTime = false
        }
        // 控制节点打开和关闭
        if (this.dataList[index].show === false) {
          for (let i = 0; i < this.dataList.length; i++) {
            this.dataList[i].show = false
          }
        }
        this.dataList[index].show = !this.dataList[index].show
        this.index = index
        // 打开节点默认全选审批人
        if (this.dataList[index].cellValue.length === 0) {
          for (let j = 0; j < this.dataList.length; j++) {
            if (j === index) {
              this.dataList[index].cellValue = this.dataList[index].allCellValue
            } else {
              this.dataList[j].cellValue = []
            }
          }
        }
        this.nextNodeName = this.dataList[index].name
      },
      selectChecker: function (index, event) {
        // 选择审批人后清空其他节点的审批人
        for (let i = 0; i < this.dataList.length; i++) {
          if (i !== index) {
            this.dataList[i].cellValue.splice(0, this.dataList[i].cellValue.length)
          }
        }
      },
      changeFormat: function (orgin) {
        // 审批人多于2个人时,显示...
        let array = orgin.map(item => item)
        if (array.length > 2) {
          array.splice(2, array.length - 2)
          return array.join(',') + '...'
        } else {
          return array.join(',')
        }
      },
      deliverToU: function () {
        /*
        if (this.nextNodeName === '请选择步骤') {
          this.showSelect(0)
        }
        */
        let prevRouteName = this.$route.params.prevRouteName
        // 定义转交数据
        let deliverData = {
          deliverance: this.deliverance,
          currNode: this.currNode,
          designId: this.designId,
          tableName: this.$route.params.tableName,
          keyId: this.$route.params.keyId,
          nextStep: this.dataList[this.index].keyId
          // oaTimeLimit: parseInt(this.oaTimeLimit),
          // oaTimeLimitUnit: parseInt(this.oaTimeLimitUnit)
        }
        if (this.showForwardTime) {
          deliverData.oaTimeLimit = (this.oaTimeLimit === '' ? 0 : Number(this.oaTimeLimit))
          deliverData.oaTimeLimitUnit = parseInt(this.oaTimeLimitUnit)
        }
        // 转交人编号
        let deliverChecker = []
        let cellShow = this.dataList[this.index].cellValue
        let cellCheckerCode = this.dataList[this.index].nodeDatas
        for (let m = 0; m < cellShow.length; m++) {
          for (let n = 0; n < cellCheckerCode.length; n++) {
            if (cellShow[m] === cellCheckerCode[n].checkerName) {
              deliverChecker.push(cellCheckerCode[n].checkerCode)
            }
          }
        }
        deliverData.checkPerson = deliverChecker.join(';')
        console.log(deliverData)
        let reg = /^\d*\.{0,1}\d+$/g
        // if (deliverData.deliverance === '') {
        //   Toast({message: '请输入审批意见！', duration: 1000})
        // } else
        if (deliverData.oaTimeLimit !== undefined && deliverData.oaTimeLimit === 0 && reg.test(deliverData.oaTimeLimit) === true) {
          Toast({message: '请输入正确格式的时限', duration: 1000})
        } else {
          let self = this
          self.deliverTo(deliverData).then(obj => {
            console.log(obj)
            Toast({message: '转交成功', duration: 1000})
            console.log(prevRouteName)
            if (prevRouteName === 'SalesOrder') {
              setTimeout(function () {
                self.$router.replace({name: 'SalesOrder'})
              }, 1000)
            } else {
              setTimeout(function () {
                self.$router.replace({name: 'approve'})
              }, 1000)
            }
          }).catch(({message}) => {
            Toast({message: message, duration: 1000})
          })
        }
      },
      getDeliverPre: function () {
        // 查询条件
        let queryData = {
          tableName: this.$route.params.tableName,
          keyId: this.$route.params.keyId
        }
        // 执行转交或者回退，send是转交，fallback是回退
        let opType = this.$route.params.opType
        // 填充页面数据
        let self = this
        this.showForwardTime = false
        this.nextNodeName = '请选择步骤'
        self.deliverPre(queryData).then(obj => {
          console.log(obj)
          self.currNodeName = obj.currNode.display
          self.currNode = obj.currNode.keyId
          self.designId = obj.designId
          self.dataList.splice(0, self.dataList.length)
          obj.nextNodes.forEach(function (item, index, array) {
            // 只显示转交部分
            let options = [] // 节点显示选项
            let cellValues = [] // 节点全选时的全部审批人名字
            let _checkPerson = [] // 节点全选时的全部审批人编号
            let nodeDatas = [] // 编号加名字数据
            var fixed
            // 是否固定转交人
            if (item.approvePeople === 'fix') {
              fixed = true
            } else {
              fixed = false
            }
            for (let i = 0; i < item.checkPeople.length; i++) {
              let option = {
                label: item.checkPeople[i][1],
                value: item.checkPeople[i][1],
                disabled: fixed
              }
              options.push(option)
              cellValues.push(item.checkPeople[i][1])
              _checkPerson.push(item.checkPeople[i][0])
              let nodeData = {
                checkerCode: item.checkPeople[i][0],
                checkerName: item.checkPeople[i][1]
              }
              nodeDatas.push(nodeData)
            }
            // 定义dataList数据
            let nextNode = {
              name: item.display,
              keyId: item.keyId,
              show: false,
              options: options,
              allCellValue: cellValues,
              cellValue: [],
              checkPersonArr: _checkPerson,
              nodeDatas: nodeDatas,
              forwardTime: item.forwardTime,
              isopTypeNode: true
            }
            self.dataList.push(nextNode)
          })
          if (opType === 'send') {
            this.pageTitle = '转交'
            for (let i = 0; i < this.dataList.length; i++) {
              this.dataList[i].keyId.indexOf('back') >= 0 ? (this.dataList[i].isopTypeNode = false) : (this.dataList[i].isopTypeNode = true)
            }
          } else if (opType === 'fallback') {
            this.pageTitle = '回退'
            for (let i = 0; i < this.dataList.length; i++) {
              this.dataList[i].keyId.indexOf('back') < 0 ? (this.dataList[i].isopTypeNode = false) : (this.dataList[i].isopTypeNode = true)
            }
          }
        }).catch(({message}) => {
          Toast({message: message, duration: 1000})
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.getDeliverPre()
        vm.deliverance = ''
        vm.oaTimeLimit = ''
      })
    }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  $background-color: #F0F1F5;
  $block-color:#d7d7d7;
  $font-color:#878787;
  .page_wrap{
    width: 100%;
    height:100%;
    background:$background-color;
    .deliver_page{
      padding:2.5rem 0 1rem;
      background:$background-color;
      label.mint-checklist-title{
        margin:0;
      }
      .mint-cell-wrapper{
        padding:0 22px;
      }
      .p_text{
        font-size:12px;
        color:$font-color;
        padding: 14px 10px 5px;
      }
      .mint-checklist .mint-cell{
        min-height: 36px;
        .mint-cell-wrapper{
          font-size:14px;
          color:$font-color;
        }
      }
      .mint-checkbox-core {
        width:16px;
        height:16px;
      }
      .mint-cell:last-child{
        background-image:none;
      }
      .mint-checkbox-core::after{
        top: 2px;
        left: 5px;
      }
      .button{
        margin-top: 1rem;
        padding:0 1rem 1rem;
      }
      .mint-checklist-label{
        height: 18px;
        line-height: 18px;
      }
      .forwardTime{
        overflow:hidden;
        padding-top:15px;
        .oaTimeLimitUnit{
          padding-right:22px;
          box-sizing: border-box;
          float:left;
          width:30%;
          height:48px;
          overflow:hidden;
          select{
            width:80px;
            height:100%;
            line-height:48px;
            direction: rtl;
            padding-right:22px;
            box-sizing: border-box;
            font-size:16px;
            option{
              direction: ltr;
            }
          }
        }
        .mint-cell.mint-field{
          width:70%;
          float:left;
          .mint-cell-wrapper{
            background-image:none;
          }
        }
      }
      .mint-checkbox-input[disabled] + .mint-checkbox-core{
        background-color: #888;
        border-color: #666;
      }
    }
    .mint-header-title{
      font-size:18px;
    }
  }
</style>

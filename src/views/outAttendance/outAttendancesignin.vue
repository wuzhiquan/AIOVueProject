<template>
  <div class="page_wrap outAttendancesignin">
    <mt-header title="外勤签入" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </div>
      <mt-button slot="right" @click="signin">确定</mt-button>
    </mt-header>
    <div class="page_cont">
      <div style="padding: 8px 0;text-align:center;background-color:#eaf7ff" @click="locate">
        <img src="../../assets/CRM/outAttendance/locate.png" 
            style="width:15px;vertical-align:middle;">
        <div :class="{locate: true, chose: address && true}">
          {{ address || '选择地址' }}
        </div>
        <img src="../../assets/CRM/outAttendance/relocate.png"
            style="width:15px;vertical-align:middle;" class="relocate">
      </div>
      <div  class="contentWrapper"  v-bind:style="{backgroundImage:signinBgUrl}">
        <a class="cell" @click="chooseClient">
          <div :class="{cell_bd: true, chose: ClientId && true}">
            {{ ClientName || '选择客户' }}
          </div>
          <div class="cell_ft">
            <img src="../../assets/CRM/outAttendance/location.png" style="width:15px;">
            <span>{{ handleDistance(SignInDistance) }}</span>
          </div> 
        </a>
        <a class="cell" @click="chooseEmp">
          <div :class="{cell_bd: true, chose: EmployeeID && true}">
            {{ EmpFullName || '选择抄送人' }}
          </div>
          <div class="cell_ft"></div> 
        </a>
        <div class="select">
          <div class="title">选择外勤类型</div> 
          <div class="options">
            <span v-for="option in typeOptions" :class="{option: true, chose: type == option.value}" @click="choseType(option.value)">
              {{ option.name }}
            </span>
          </div>
        </div>
        <div class="remark_wrapper">
          <textarea class="remark" placeholder="加上您的备注..." rows="4" v-model="Remark"></textarea>
          <div class="uploader" style="display:none;">
            <ul class="uploader-files">
              <li class="uploader-file" style="background-image: url(https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1794894692,1423685501&fm=116&gp=0.jpg);">
                <p class="delImgWrapper">
                  <img class="delImag" src="../../assets/CRM/outAttendance/delImg.png">
                </p>
              </li>
              <li class="uploader-file" style="background-image: url(https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1794894692,1423685501&fm=116&gp=0.jpg);">
                <p class="delImgWrapper">
                  <img class="delImag" src="../../assets/CRM/outAttendance/delImg.png">
                </p>                
              </li>
              <li class="uploader-file" style="background-image: url(https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1794894692,1423685501&fm=116&gp=0.jpg);">
                <p class="delImgWrapper">
                  <img class="delImag" src="../../assets/CRM/outAttendance/delImg.png">
                </p>                
              </li>
            </ul>
            <div class="uploader-addBtn">
              <img src="../../assets/CRM/outAttendance/addImg.png" style="width:100%;">
            </div>
          </div>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
  import * as types from '../../store/modules/outAttendance/types'
  import * as locateTypes from '../../store/modules/locate/types'
  import * as empTypes from '../../store/modules/employee/types'
  import * as clientTypes from '../../store/modules/crmclientloc/types'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import { Header, Button, Badge, Toast } from 'mint-ui'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/badge/style.css'
  import 'mint-ui/lib/toast/style.css'
  let signinBg = require('../../assets/CRM/outAttendance/signinbg.png')
  export default {
    name: 'OutAttendancesignin',
    components: {
      'mt-header': Header,
      'mt-button': Button,
      'mt-badge': Badge
    },
    data () {
      return {
        typeOptions: []
      }
    },
    computed: {
      ...mapState({
        address: state => state.outAttendance.detail.values.SignInAddress,
        type: state => state.outAttendance.detail.values.Type,
        EmployeeID: state => state.outAttendance.detail.values.EmployeeID,
        EmpFullName: state => state.outAttendance.detail.values['tblEmployee.EmpFullName'],
        ClientId: state => state.outAttendance.detail.values.ClientId,
        ClientName: state => state.outAttendance.detail.values['CRMClientInfo.ClientName'],
        SignInDistance: state => state.outAttendance.detail.values.SignInDistance,
        SignInLat: state => state.outAttendance.detail.values.SignInLat,
        SignInLng: state => state.outAttendance.detail.values.SignInLng
      }),
      Remark: {
        get () {
          return this.$store.state.outAttendance.detail.values.Remark
        },
        set (Remark) {
          this.$store.commit(types.ChangeDetailValues, {Remark})
        }
      },
      signinBgUrl () {
        return `url(${signinBg})`
      }
    },
    methods: {
      locate () {
        this[locateTypes.SetCbMutationName](types.SignInChoseLocCBFill)
        this.$router.push({name: 'OutAttendanceLocate'})
      },
      chooseEmp () {
        this[empTypes.SetCbMutationName](types.PopupEmployeeCBFill)
        this.$router.push({name: 'Employee', params: {title: '选择抄送人'}})
      },
      chooseClient () {
        if (!this.SignInLat || !this.SignInLng) {
          Toast({message: '请先选择地址', duration: 1000})
          return
        }
        this[clientTypes.SetCbMutationName](types.PopupClientCBFill)
        let params = {title: '选择客户', AddressLat: this.SignInLat, AddressLng: this.SignInLng}
        this.$router.push({name: 'SelectCRMClientLoc', params})
      },
      choseType (Type) {
        this[types.ChangeDetailValues]({Type})
      },
      handleDistance (distance) {
        if (distance === undefined || distance >= 5500000) {
          return ''
        } else if (distance < 1) {
          return '' + window.Math.round(new window.Number(distance) * 1000) + 'm'
        } else {
          return '' + new window.Number(distance).toFixed(3) + 'km'
        }
      },
      signin () {
        this[types.Add]().then(() => {
          this.$router.go(-1)
        })
      },
      ...mapActions(['getEnum', types.AddPre, types.Add]),
      ...mapMutations([types.ChangeDetailValues, locateTypes.SetCbMutationName, empTypes.SetCbMutationName, clientTypes.SetCbMutationName])
    },
    watch: {
      $route (to, from) {
        if (to.name === 'OutAttendancesignin') {
          let exist = ['Employee', 'OutAttendanceLocate', 'SelectCRMClientLoc'].indexOf(from.name) >= 0
          !exist && this[types.AddPre]()
        }
      }
    },
    created () {
      this[types.AddPre]()
      this.getEnum('tblOutAttendanceType').then(types => {
        types.forEach(type => {
          this.typeOptions.push(type)
        })
      })
    }
  }
</script>
<style type="text/css">
  .outAttendancedet .mint-header-title {
    font-size: 16px;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  $border-color: #e7e7e7;
  $color: #949494;
  $primary-color: #40A9E5;
  * {
    vertical-align: middle;
  }
  .page_wrap {
    width: 100%;
    height:100%;
    background: white;
    .mint-header {
      color:#333;
      background-color:#fff;
      border-bottom:1px #dedede solid;
    }
  }
  .page_cont {
    padding:40px 0 10px 0;
    .locate {
      display:inline-block;
      width:80%;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      color: $color;
      &.chose {
        color: black;
        font-size: smaller;
      }
    }
    .contentWrapper {
      padding: 0px 20px;
      background-position-x: center;
      background-repeat: no-repeat;
      background-size: 336px 172px;
    }
    .cell {
      padding: 28px 5px 16px 15px;
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      border-bottom:1px solid $border-color;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      color: $color;
      .cell_bd {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        text-align: center;
        &.chose {
          color: black;
        }
      }
      .cell_ft {
        padding-right: 13px;
        position: relative;
        text-align: right;
        font-size: smaller;
        &:after {
          content: " ";
          display: inline-block;
          height: 6px;
          width: 6px;
          border-width: 2px 2px 0 0;
          border-color: #C8C8CD;
          border-style: solid;
          -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
          transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
          position: relative;
          top: -2px;
          position: absolute;
          top: 50%;
          margin-top: -4px;
          right: 2px;          
        }
      }
    }
    .select {
      padding: 32px 15px;
      text-align: center;
      border-bottom:1px solid $border-color;
      .title {
        color: $color;
      }
      .options {
        padding-top: 28px;
        .option {
          margin: 0 10px 16px 0;
          text-align: center;
          display: inline-block;
          border-radius: 18px;
          font-size: 14px;
          padding: 5px 13px;
          border:1px solid #cdcdcd;
          color: black;
          &.chose {
            color: $primary-color;
            border-color: $primary-color;
          }
        }
      }
    }
    .remark_wrapper {
      padding-top: 15px;
    }
    .remark {
      display: block;
      border: 0;
      resize: none;
      width: 100%;
      color: inherit;
      font-size: 1em;
      line-height: inherit;
      outline: 0;      
    }
    .uploader {
      overflow:hidden;
      .uploader-files {
        list-style: none;
      }
      .uploader-file, .uploader-addBtn {
        float: left;
        margin: 10px 0 0 20px;
        width: 60px;
        height: 60px;
        background: no-repeat 50%;
        background-size: cover;
      }
      .uploader-file:nth-child(1) {
        margin-left: 10px;
      }
      .delImgWrapper {
        height: 100%;
        position: relative;
        .delImag {
          position: absolute;
          width: 20px;
          top: -10px;
          left: -10px;
        }
      }
    }
  }
</style>

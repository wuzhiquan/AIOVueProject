<template>
  <div class="page_wrap outAttendancedet">
    <mt-header title="外勤详情" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </div>
      <div slot="right" style="position: absolute;left: 62%;top: 15px;font-size:smaller;">
        {{ createByName }}
      </div>
    </mt-header>
    <div class="page_cont">
      <div class="items-wrapper">
        <div class="title">
          <img src="../../assets/CRM/outAttendance/client.png">
          外勤客户
        </div>
        <div class="ClientName item">{{ ClientName }}</div>
      </div>
      <div class="items-wrapper">
        <div class="title">
          <img src="../../assets/CRM/outAttendance/time.png">
          外勤时间
        </div>
        <div class="item">
          <span class="item-hd">签入时间</span>
          <span class="item-bd time">{{ SignInTime }}</span>
        </div>
        <div class="item" v-if="Status == 2">
          <span class="item-hd">签出时间</span>
          <span class="item-bd time" style="width:50%;">{{ SignOutTime }}</span>
          <span class="item-ft">耗时&nbsp;{{ calTimeDiff(SignInTime, SignOutTime) }}小时</span>
        </div>
      </div>
      <div class="items-wrapper">
        <div class="title">
          <img src="../../assets/CRM/outAttendance/locs.png">
          外勤地址
        </div>
        <div class="item">
          <span class="item-hd">签入地址</span>
          <span class="item-bd">{{ SignInAddress }}</span>
        </div>
        <div class="item" style="margin-top: 0">
          <span class="item-hd">&nbsp;</span>
          <span class="item-bd">
            <span class="signinInfo" v-if="SignInDistance < 5500000">
              距离公司&nbsp;{{ handleDistance(SignInDistance) }}&nbsp;
            </span>
            <span class="signoutInfo" v-if="Status == 2">
              距离签出&nbsp;{{ handleDistance(SignOutDistance) }}
            </span>            
          </span>
        </div>
        <div class="item" v-if="Status == 2">
          <span class="item-hd">签出地址</span>
          <span class="item-bd">{{ SignOutAddress }}</span>
        </div>
      </div>
      <div class="cellsWrapper">
        <div class="cell">
          <span class="cell-hd">抄送人</span>
          <span class="cell-bd">{{ EmpFullName }}</span>
        </div>
        <div class="cell">
          <span class="cell-hd">外勤类型</span>
          <span class="cell-bd">{{ typeName(type) }}</span>
        </div>
        <div class="cell">
          <span class="cell-hd">备注</span>
          <span class="cell-bd">{{ Remark }}</span>
        </div>
      </div>
      <mt-button type="primary" size="large" v-show="Status == 1 && canSignOut" @click="signout">签出</mt-button>      
      <div>
    </div>
  </div>
</template>

<script>
  import * as types from '../../store/modules/outAttendance/types'
  import * as locateTypes from '../../store/modules/locate/types'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import { Header, Button, Badge, Toast, MessageBox } from 'mint-ui'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/badge/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/message-box/style.css'
  export default {
    name: 'OutAttendancedet',
    components: {
      'mt-header': Header,
      'mt-button': Button,
      'mt-badge': Badge
    },
    data () {
      return {
        typeOptions: [],
        canSignOut: false
      }
    },
    computed: {
      ...mapState({
        address: state => state.outAttendance.detail.values.SignInAddress,
        type: state => state.outAttendance.detail.values.Type,
        Status: state => state.outAttendance.detail.values.Status,
        EmpFullName: state => state.outAttendance.detail.values['tblEmployee.EmpFullName'],
        ClientName: state => state.outAttendance.detail.values['CRMClientInfo.ClientName'],
        SignInDistance: state => state.outAttendance.detail.values.SignInDistance,
        SignInAddress: state => state.outAttendance.detail.values.SignInAddress,
        SignInTime: state => state.outAttendance.detail.values.SignInTime,
        SignInLat: state => state.outAttendance.detail.values.SignInLat,
        SignInLng: state => state.outAttendance.detail.values.SignInLng,
        SignOutAddress: state => state.outAttendance.detail.values.SignOutAddress,
        SignOutTime: state => state.outAttendance.detail.values.SignOutTime,
        SignOutDistance: state => state.outAttendance.detail.values.SignOutDistance,
        SignOutLat: state => state.outAttendance.detail.values.SignOutLat,
        SignOutLng: state => state.outAttendance.detail.values.SignOutLng,
        Remark: state => state.outAttendance.detail.values.Remark,
        createBy: state => state.outAttendance.detail.values.createBy,
        createByName: state => state.outAttendance.detail.values.createByName
      })
    },
    methods: {
      locate () {
        this[locateTypes.SetCbMutationName](types.SignInChoseLocCBFill)
        this.$router.push({name: 'OutAttendanceLocate'})
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
      signout () {
        this[locateTypes.SetCbMutationName](types.SignOutChoseLocCBFill)
        this.$router.push({name: 'OutAttendanceLocate'})
      },
      typeName (type) {
        type = type + ''
        let temp = this.typeOptions.filter(item => item.value === type)
        if (temp.length > 0) {
          return temp[0].name
        } else {
          return ''
        }
      },
      calTimeDiff (signInTime, signOutTime) {
        signInTime = signInTime.replace(/-/g, '/')
        signInTime = new window.Date(signInTime)
        signOutTime = signOutTime.replace(/-/g, '/')
        signOutTime = new window.Date(signOutTime)
        let millionSeconds = signOutTime.getTime() - signInTime.getTime()
        return (millionSeconds / (3600 * 1000)).toFixed(1)
      },
      validateSignOut () {
        this.getSessEmp().then(sessEmp => {
          if (sessEmp.id === this.createBy) {
            this.canSignOut = true
          }
        })
      },
      ...mapActions(['getEnum', types.Detail, types.Update, 'getSessEmp']),
      ...mapMutations([locateTypes.SetCbMutationName])
    },
    watch: {
      $route (to, from) {
        if (to.name === 'OutAttendancedet') {
          let exist = ['OutAttendanceLocate'].indexOf(from.name) >= 0
          if (!exist) {
            this[types.Detail](this.$route.params.keyId).then(() => {
              this.validateSignOut()
            })
          } else if (this.SignOutLng > 0) {
            MessageBox.confirm('确定要签出?').then(() => {
              this[types.Update]().then(() => {
                this.$router.go(-1)
              })
            })
          }
        }
      }
    },
    created () {
      this[types.Detail](this.$route.params.keyId).then(() => {
        this.validateSignOut()
      })
      this.getEnum('tblOutAttendanceType').then(types => {
        types.forEach(type => {
          this.typeOptions.push(type)
        })
      }).catch(({message}) => {
        Toast({message, duration: 1000})
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
  $border-color: #e8e8e8;
  $color: #C8C8CD;
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
    padding: 40px 10px 0 10px;
    .items-wrapper {
      padding-top: 22px;
      font-size: 12px;
      .title {
        color: #8a8a8a;
        position: relative;
        padding-left: 30px;
        img {
          position: absolute;
          width: 21px;
          left: 0;
          top: -4px;
        }
      }
      .ClientName {
        font-size: 16px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;        
      }
      .signinInfo, .signoutInfo {
        color: #b6b6b6
      }
    }
    .item {
      margin-top: 10px;
      white-space:nowrap;
      &:first-child {
        margin-top: 16px;
      }
      .item-hd {
        display:inline-block;
        color: #b6b6b6;
        width: 20%;
      }
      .item-bd {
        display:inline-block;
        width: 80%;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      .item-ft {
        color: #b6b6b6;
      }
      .time {
        color: #6fd0ff;
        font-size: 16px;
      }
    }
    .cellsWrapper {
      margin-top: 32px;
    }
    .cell {
      padding: 12px 0;
      border-bottom: 1px solid #efefef;
      &:first-child {
        border-top: 1px solid #efefef;
      }
      .cell-hd {
        display:inline-block;
        color: #b6b6b6;
        width: 20%;
      }
      .cell-bd {
        display:inline-block;
        text-align: right;
        width: 70%;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
    }
  }
</style>

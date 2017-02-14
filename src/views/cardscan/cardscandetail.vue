<template>
  <div class="page_wrap">
    <mt-header :title="title" fixed>
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </div>
      <mt-button icon="more" slot="right" v-if="!isEdit" @click.native="popup"></mt-button>
    </mt-header>
    <div class="page_cont card_detail">
      <form>
        <p class="card_infos_title">个人信息</p>
        <div class="card_info">
            <img slot="icon" src="../../assets/dt-name.png">
            <input type="text" v-model="ComContactor" ref="ComContactor">
        </div>
        <div class="card_info">
            <img slot="icon" src="../../assets/dt-tel.png">
            <input type="text" v-model="ComContactorMobile" v-if="isEdit">
            <a @click.stop :href="`tel:${ComContactorMobile}`" v-else>
              {{ComContactorMobile}}
            </a>
        </div>
        <div class="card_info">
            <img slot="icon" src="../../assets/dt-email.png">
            <input type="text" v-model="ComEmail" ref="ComEmail">
        </div>
        <p class="card_infos_title">公司信息</p>
        <div class="card_info">
            <img slot="icon" src="../../assets/dt-phone.png">
            <input type="text" v-model="ComTel" v-if="isEdit">
            <a @click.stop :href="`tel:${ComTel}`" v-else>
              {{ComTel}}
            </a>            
        </div>
        <div class="card_info">
            <img slot="icon" src="../../assets/dt-company.png">
            <input type="text" v-model="ComName" ref="ComName">
        </div>
        <div class="card_info">
            <img slot="icon" src="../../assets/dt-Bitmap.png">
            <textarea v-model="ComAddress" rows="2" ref="ComAddress"></textarea>
        </div>
      </form>
      <div class="button-group">
        <template v-if="!isEdit">
          <mt-button type="primary" size="large" @click.native="updatePre">修改</mt-button>
          <mt-button type="primary" size="large" @click.native="openActionSheet" v-if="addWay==7">
            继续添加
          </mt-button>
          <div ref="chooseFileBtnWrapper"> 
            <mt-button type="primary" size="large" v-if="addWay==2">
              继续添加
            </mt-button>
          </div>
          <mt-button type="primary" size="large" @click.native="openAlbum" v-if="addWay==4">
            继续添加
          </mt-button>
        </template>
        <mt-button v-else type="primary" size="large" @click.native="save">保存</mt-button>
      </div>
    </div>
    <div ref="_actionSheet">
      <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
    </div>
    <mt-popup v-model="popupVisible" position="top">
      <mt-button type="default" size="large" v-if="Status+'' == '1'" @click.native="transfer">转入CRM</mt-button>
      <mt-button type="danger" size="large" @click.native="del">删除</mt-button>
    </mt-popup>    
  </div>
</template>

<script>
  import * as types from '../../store/modules/cardscan/types'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { Button, Header, MessageBox, Actionsheet, Toast, Popup } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/message-box/style.css'
  import 'mint-ui/lib/actionsheet/style.css'
  import 'mint-ui/lib/toast/style.css'
  import 'mint-ui/lib/popup/style.css'
  let rawData
  export default {
    name: 'cardscandetail',
    components: {
      'mt-button': Button,
      'mt-header': Header,
      'mt-actionsheet': Actionsheet,
      'mt-popup': Popup
    },
    data () {
      return {
        ComContactor: '', // 联系人
        ComContactorMobile: '', // 电话
        ComName: '', // 公司名
        ComTel: '', // 公司电话
        ComEmail: '', // 邮箱
        ComAddress: '', // 地址
        opType: 'add',
        sheetVisible: false,
        popupVisible: false,
        Status: '1'
      }
    },
    computed: {
      ...mapState({
        tableName: state => state.cardscan.cond.tableName
      }),
      keyId () {
        return this.$route.params.keyId
      },
      isEdit () {
        return this.opType !== 'detail'
      },
      title () {
        let typeMap = {'add': '添加名片', 'update': '修改名片', 'detail': '名片详情'}
        return typeMap[this.opType]
      },
      actions () {
        return [
          { name: '手动录单', method: this.addPre },
          { name: '名片扫描', method: this.isWX() ? this.openAlbum : undefined }
        ]
      },
      addWay () {
        return this.$route.query.addWay ? this.$route.query.addWay : 7
      }
    },
    methods: {
      ...mapActions(['detail', types.Update, types.Add, types.Del, types.TransferToCRM, types.BindAlbum, types.ChooseCamera]),
      ...mapGetters(['isWX']),
      fetchData () {
        this.opType = this.$route.params.opType ? this.$route.params.opType : 'add'
        if (this.opType === 'add') {
          for (let key in this.$data) {
            this.$data[key] = rawData[key]
          }
        } else {
          this.detail({tableName: this.tableName, keyId: this.keyId}).then(({values}) => {
            for (let key in this.$data) {
              if (key in values) {
                this.$data[key] = values[key]
              }
            }
            this.$data.Status = this.$data.Status + ''
            if (this.$data.Status !== '2') {
              this.$data.Status = '1'
            }
          }).catch(({message}) => {
            Toast({message, duration: 1000})
            this.$router.go(-1)
          })
        }
      },
      updatePre () {
        let keyId = this.keyId
        this.$router.push({
          name: 'cardscandetail',
          params: { keyId, opType: 'update' }
        })
      },
      save () {
        let data = Object.assign({}, this.$data)
        if (this.opType === 'add') {
          this[types.Add](data).then(keyId => {
            this.det(keyId, 7)
          })
        } else {
          data.id = this.keyId
          this[types.Update](data).then(() => {
            this.$router.go(-1)
          })
        }
      },
      transfer () {
        this[types.TransferToCRM](this.keyId).then(() => {
          this.$router.go(-1)
        })
      },
      del () {
        MessageBox.confirm('确定要删除这张名片?').then(() => {
          this[types.Del](this.keyId).then(() => {
            this.$router.go(-1)
          })
        })
      },
      // 弹起ActionSheet
      openActionSheet () {
        this.sheetVisible = true
        if (!this.isWX()) { // 不是微信，使用input file上存文件
          let domEle = this.$refs._actionSheet.querySelector('.mint-actionsheet-listitem:nth-child(2)')
          this[types.BindAlbum]({ domEle, cb: obj => this.det(obj.keyId, 2) })
        }
      },
      // 微信上存图片
      openAlbum () {
        let jsApiList = ['chooseImage', 'uploadImage']
        this[types.ChooseCamera]({jsApiList, cb: obj => this.det(obj.keyId, 4)})
      },
      // 手动录单
      addPre () {
        this.$router.replace({
          name: 'cardscandetail',
          params: {keyId: '-1', opType: 'add'}
        })
      },
      // 进入详情页
      det (keyId, addWay) {
        this.$router.replace({
          name: 'cardscandetail',
          params: { keyId, opType: 'detail' },
          query: {addWay}
        })
      },
      // 展开头部的更多操作的按钮
      popup () {
        this.popupVisible = true
      }
    },
    created () {
      rawData = Object.assign({}, this.$data)
      this.fetchData()
    },
    watch: {
      $route (to) {
        to.name === 'cardscandetail' && this.fetchData()
      }
    },
    deactivated () {
      this.$data.popupVisible = false
    },
    updated () {
      for (let key in this.$refs) {
        this.$refs[key] !== undefined && this.$refs[key].removeAttribute('readonly')
      }
      if (this.opType === 'detail') {
        for (let key in this.$refs) {
          this.$refs[key] !== undefined && this.$refs[key].setAttribute('readonly', 'readonly')
        }
        if (this.addWay + '' === '2') {
          let domEle = this.$refs.chooseFileBtnWrapper.lastChild
          this[types.BindAlbum]({ domEle, cb: obj => this.det(obj.keyId, 2) })
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  $background-color: #F0F0F0;
  $background-color-block:#fff;
  $p-text-color:#BABABA;
  $p-text-color-light:#26A2FF;
  .page_wrap{
    .mint-header{
      font-size: 14px;
      .mint-header-title{
        font-size:18px;
      }
    }
    width: 100%;
    height:100%;
    background:$background-color;
    .page_cont.card_detail{
      padding-top:2.5rem;
      background:$background-color;
      .card_infos_title{
        background:#f0f0f0;
        padding-left: 20px;
        color:#bebebe;
        font-size:14px;
        height:28px;
        line-height:28px;
      }
      form{
        padding:0;
        background:#fff;
        box-shadow:none;
        .card_info{
          padding:16px 0 16px 68px;
          border-bottom:1px solid #e8e8e8;
          min-height: 34px;
          position:relative;
          input{
            height:32px;
            border:none;
            outline:none;
            width:100%;
            font-size:16px;
          }
          img{
            width: 34px;
            height:34px;
            left:18px;
            position:absolute;
          }
          textarea{
            font-size:16px;
            line-height:24px;
            width:100%;
            border:none;
            outline:none;
          }
          a{
            width: 100%;
            line-height:32px;
            text-decoration: none;
            color:#38c;
            outline:none;
          }
        }
      }
    }
    .button-group {
      padding: 0 15px 15px 15px;
      &>* {
        margin-top: 15px;
      }
    }
    .mint-popup {
      top: 30px;
      left: 80%;
      width: 100px;
      padding: 10px;
      border-radius: 8px;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      z-index:2;
      &:before {
        display: inline-block;
        width: 0;
        height: 0;
        border: solid transparent;
        border-width: 10px;
        border-bottom-color: #fff;
        content: '';
        position: absolute;
        top: -18px;
        right: 5px;
      }
      button:nth-child(2) {
        margin-top: 10px;
      }
    }
  }
</style>

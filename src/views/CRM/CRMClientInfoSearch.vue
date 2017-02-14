<template>
  <div class="workFlowSearchWrap" @touchmove.stop="touchmove($event)">
    <div class="searchBar">
      <div class="mint-searchbar-inner">
        <i class="mintui mintui-search"></i>
        <input type="search" placeholder="客户名称" class="mint-searchbar-core" v-model="ClientName">
      </div>
      <span @click="$router.go(-1)">取消</span>
    </div>
    <div class="searchCond">
      <div class="search_select mint-cell" v-for="item in dataList">
        <label>{{item.selectName}}</label>
        <select v-model="item.select">
          <option  v-for="option in item.selectOptions" :value="option.value">{{option.name}}</option>
        </select>
        <i class="mint-cell-allow-right"></i>
      </div>
      <div class="button">
        <mt-button @click.native='searchFn' type="primary" size="small">筛选</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Button, Cell, Toast } from 'mint-ui'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/search/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/toast/style.css'
  import { mapActions } from 'vuex'
  export default {
    name: 'workflowSearch',
    data () {
      return {
        ClientName: '',
        dataList: []
      }
    },
    props: ['postInfo'],
    components: {
      'mt-button': Button,
      'mt-cell': Cell
    },
    methods: {
      ...mapActions(['getEnum']),
      'searchFn': function () {
        window.console.log(this.$route.params.$emit)
        if (this.$route.params.$emit === undefined) {
          Toast({message: '操作异常，请返回列表重新操作！', duration: 2000})
          // this.$router.replace({name: 'approve'})
        } else {
          this.$route.params.$emit('searchFn', this._data)
          // this.$parent._data.workflowType = this.dataList[0].select
          this.$router.go(-1)
        }
      },
      'touchmove': function (event) {
        event.preventDefault()
      },
      'getEnumList': function () {
        this.getEnum('ClientStyle' + this.postInfo).then(obj => {
          obj.unshift({name: '请选择', value: ''})
          let _dataList = {
            selectName: '客户类型', selectOptions: obj, select: '', keyName: 'ClientType'
          }
          this.dataList.push(_dataList)
        })
        this.getEnum('ClientStatus' + this.postInfo).then(obj => {
          obj.unshift({name: '请选择', value: ''})
          let _dataList = {
            selectName: '生命周期', selectOptions: obj, select: '', keyName: 'Status'
          }
          this.dataList.push(_dataList)
        })
        this.getEnum('ClientSource' + this.postInfo).then(obj => {
          obj.unshift({name: '请选择', value: ''})
          let _dataList = {
            selectName: '客户来源', selectOptions: obj, select: '', keyName: 'SourceInfo'
          }
          this.dataList.push(_dataList)
        })
        this.getEnum('ClientEmergency' + this.postInfo).then((obj) => {
          obj.unshift({name: '请选择', value: ''})
          let _dataList = {
            selectName: '紧急程度', selectOptions: obj, select: '', keyName: 'Emergency'
          }
          this.dataList.push(_dataList)
        })
      }
    },
    created () {
      this.getEnumList()
    },
    beforeRouteEnter (to, from, next) {
      // 阻止鼠标滚动事件
      var body = document.getElementsByTagName('body')[0]
      body.setAttribute('onmousewheel', 'return false;')
      next(true)
    },
    beforeRouteLeave (to, from, next) {
      // 解除鼠标滚动事件
      var body = document.getElementsByTagName('body')[0]
      body.removeAttribute('onmousewheel')
      next(true)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scope>
  .workFlowSearchWrap {
    position:fixed;
    top:0;
    left:0;
    z-index:100;
    background: rgba(128,128,128,.6);
    height: 100%;
    width: 100%;
    .searchBar{
      background: #f7f7f7;
      padding: 6px;
      height: 40px;
      box-sizing: border-box;
      .mint-searchbar-inner{
        width: 85%;
        box-sizing: border-box;
        float: left;
        height:28px;
        border-radius:8px;
        input{
          width:100%;
          font-size:14px;
          padding-left: 5px;
        }
      }
      span{
        display: block;
        float: right;
        width: 15%;
        color: #a9a9a9;
        text-align: center;
        height: 100%;
        line-height: 28px;
      }
    }
    .searchCond {
      background:#fff;
      .search_select{
        padding:0 22px;
        line-height:3rem;
        border-bottom:1px solid #d9d9d9;
        position: relative;
        label{
          width:25%;
          display:inline-block;
        }
        select{
          position: absolute;
          border: none;
          outline: none;
          height:100%;
          width:60%;
          font-size:16px;
          right:2.1rem;
          direction: rtl;
          box-sizing: border-box;
          color:#9f9f9f;
          option{
            direction: ltr;
          }
        }
      }
      .button{
        width:100%;
        text-align:center;
        padding: 12px 0;
        button{
          width:80px;
        }
      }
      .mint-cell:last-child{
        background-image:none;
      }
    }
  }
</style>

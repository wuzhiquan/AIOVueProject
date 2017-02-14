<template>
  <div class="workFlowSearchWrap" @touchmove.stop="touchmove($event)">
    <div class="searchBar">
      <div class="mint-searchbar-inner">
        <i class="mintui mintui-search"></i>
        <input type="search" placeholder="批号查询" class="mint-searchbar-core" v-model="BatchNo">
      </div>
      <span @click="$router.go(-1)">取消</span>
    </div>
    <div class="searchCond">
      <div class="search_select mint-cell">
        <label>结存数量</label>
        <select v-model="lastQty">
          <option value="0">显示结存数量不为0库存</option>
          <option value="1">显示结存数量为0库存</option>
        </select>
        <i class="mint-cell-allow-right"></i>
      </div>
      <div class="search_select mint-cell" v-for="item in dataList">
        <label>{{item.selectName}}</label>
        <select v-model="item.select" @change="selectChange($event)">
          <option  v-for="option in item.selectOptions" :value="option.value" v-show="option.name">{{option.name}}</option>
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
        BatchNo: '',
        dataList: [],
        lastQty: 0
      }
    },
    components: {
      'mt-button': Button,
      'mt-cell': Cell
    },
    methods: {
      ...mapActions(['popupSelect']),
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
      'popupSelectData': function () {
        // 仓库选项
        this.popupSelect({selectName: 'ReportSelectStock_v2', pageSize: 1000}).then(obj => {
          console.log(obj)
          let selectOptions = [{name: '全部', value: ''}]
          for (let i = 0; i < obj.length; i++) {
            let selectOption = {
              name: obj[i].tblStock_StockFullName,
              // value: obj[i].StockCode,
              value: obj[i].tblStock_StockFullName
            }
            selectOptions.push(selectOption)
          }
          console.log(selectOptions)
          let _dataList = {
            selectName: '仓库', selectOptions: selectOptions, select: '', keyName: 'tblStock.StockFullName'
          }
          this.dataList.push(_dataList)
        }).catch(({message}) => {
          console.log(message)
        })
        // 商品名称
        this.popupSelect({selectName: 'ReportSelectGoods_v2', pageSize: 1000}).then(obj => {
          console.log(obj)
          let selectOptions = [{name: '全部', value: ''}]
          let selectOptions2 = [{name: '全部', value: ''}]
          let selectOptions3 = [{name: '全部', value: ''}]
          let selectOptions4 = [{name: '全部', value: ''}]
          for (let i = 0; i < obj.length; i++) {
            let selectOption = {
              name: obj[i].tblGoods_GoodsFullName,
              value: obj[i].tblGoods_GoodsFullName
            }
            let selectOption2 = {
              name: obj[i].tblGoods_GoodsNumber,
              value: obj[i].tblGoods_GoodsNumber
            }
            let selectOption3 = {
              name: obj[i].tblGoods_GoodsSpec,
              value: obj[i].tblGoods_GoodsSpec
            }
            let selectOption4 = {
              name: obj[i].tblGoods_BaseUnit,
              value: obj[i].tblGoods_BaseUnit
            }
            selectOptions.push(selectOption)
            selectOptions2.push(selectOption2)
            selectOptions3.push(selectOption3)
            selectOptions4.push(selectOption4)
          }
          console.log(selectOptions.length)
          console.log(selectOptions2.length)
          console.log(selectOptions3.length)
          console.log(selectOptions4.length)
          let _dataList = {
            selectName: '商品名称', selectOptions: selectOptions, select: '', keyName: 'tblGoods.GoodsFullName'
          }
          let _dataList2 = {
            selectName: '商品编号', selectOptions: selectOptions2, select: '', keyName: 'tblGoods.GoodsNumber'
          }
          let _dataList3 = {
            selectName: '商品规格', selectOptions: selectOptions3, select: '', keyName: 'tblGoods.GoodsSpec'
          }
          let _dataList4 = {
            selectName: '单位', selectOptions: selectOptions4, select: '', keyName: 'tblGoods.BaseUnit'
          }
          this.dataList.push(_dataList)
          this.dataList.push(_dataList2)
          this.dataList.push(_dataList3)
          this.dataList.push(_dataList4)
        }).catch(({message}) => {
          console.log(message)
        })
      },
      'selectChange': function (e) {
        console.log(e)
      }
    },
    created () {
      this.popupSelectData()
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
      background: #d4d4d4;
      padding: 6px;
      height: 40px;
      box-sizing: border-box;
      .mint-searchbar-inner{
        width: 80%;
        box-sizing: border-box;
        float: left;
        height:28px;
        border-radius:8px;
        input{
          width:100%;
        }
      }
      span{
        display: block;
        float: right;
        width: 20%;
        color: #0076ff;
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

<template>
  <div class="SelectCRMClient_wrap">
    <div class="searchBar">
      <div class="mint-searchbar-inner">
        <i class="mintui mintui-search"></i>
        <input type="search" placeholder="搜索关键字" class="mint-searchbar-core" v-model="keyword">
      </div>
      <span @click="$router.go(-1)">取消</span>
    </div>
    <div v-for="values in characters" style="padding-left:20px;box-sizing: border-box;">
      <mt-cell :title="values.CRMClientInfo_ClientName" @click.native="check(values)"></mt-cell>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Header, Button, Cell, Indicator } from 'mint-ui'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/indicator/style.css'
  import 'mint-ui/lib/search/style.css'
  let debounce = require('lodash/debounce')
  export default {
    name: 'SelectCRMClient',
    data () {
      return {
        characters: [],
        keyword: ''
      }
    },
    computed: {
      prevRouteName () {
        return this.$route.params.prevRouteName
      },
      keyId () {
        return this.$route.params.keyId
      },
      tableName () {
        return this.$route.params.tableName
      }
    },
    components: {
      'mt-header': Header,
      'mt-button': Button,
      'mt-cell': Cell
    },
    methods: {
      ...mapActions(['popupSelect']),
      fetchData () {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'snake'
        })
        let keyword = this.keyword
        this.popupSelect({tableName: 'CRMClientService', fieldName: 'ClientId', extraParam: {'keyword': keyword}, pageSize: 50}).then((data) => {
          Indicator.close()
          console.log(data)
          this.characters = data
        })
      },
      check (Client) {
        console.log(Client)
        let prevRouteName = this.prevRouteName
        let tableName = this.tableName
        let keyId = this.keyId
        this.$router.replace({name: prevRouteName, params: {checked: Client, tableName, keyId}})
      },
      debounceSearch: debounce(function () {
        this.fetchData()
      }, 500)
    },
    watch: {
      keyword: function (newkeyword) {
        this.debounceSearch()
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.fetchData()
        vm.keyword = ''
      })
    }
  }
</script>
<style type="text/css">
  .SelectCRMClient_wrap .mint-cell-wrapper{
    background-image: none;
    border-bottom: 1px solid #f4f4f4;
    padding-left:0px;
    font-size:14px;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  .SelectCRMClient_wrap {
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
    .mint-header-title {
      font-size: 18px;
    }
    .mint-indexlist {
      margin-top: 40px;
    }
  }
</style>

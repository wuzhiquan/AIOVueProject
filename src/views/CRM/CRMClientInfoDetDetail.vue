<template>
<div class="page_wrap">
  <!-- 顶部 -->
  <mt-header title="联系人详情" fixed>
    <div slot="left">
      <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
    </div>
  </mt-header>
  <!-- 内容 -->
  <div class="page_cont CRMDet_detail">
    <div class="part">
      <div class="CRM_detail_list" v-if="ClientName">
        <mt-cell title="客户名称">
          <img slot="icon" src="../../assets/dt-company.png" width="24" height="24">
          <span>{{ClientName}}</span>
        </mt-cell>
      </div>
      <div class="CRM_detail_list" v-for='field in fieldList'>
        <mt-cell v-if="field.fieldName == 'UserName'" :title="field.display">
          <img slot="icon" src="../../assets/dt-company.png" width="24" height="24">
          <span>{{values[field.fieldName]}}</span>
        </mt-cell>
        <mt-cell v-if="field.fieldName == 'Mobile'" :title="field.display">
          <img slot="icon" src="../../assets/dt-tel.png" width="24" height="24">
          <a :href="'tel:'+values[field.fieldName]" style="text-decoration: none;color:#38c;outline:none;">{{values[field.fieldName]}}</a>
        </mt-cell>
        <mt-cell v-if="field.fieldName == 'Telephone'" :title="field.display">
          <img slot="icon" src="../../assets/dt-phone.png" width="24" height="24">
          <a :href="'tel:'+values[field.fieldName]" style="text-decoration: none;color:#38c;outline:none;">{{values[field.fieldName]}}</a>
        </mt-cell>
        <mt-cell v-if="field.fieldName == 'ClientEmail'" :title="field.display">
          <img slot="icon" src="../../assets/dt-email.png" width="24" height="24">
          <span>{{values[field.fieldName]}}</span>
        </mt-cell>
        <mt-cell v-if="field.fieldName == 'QQ'" :title="field.display">
          <img slot="icon" src="../../assets/CRM/qq.png" width="24" height="24">
          <span>{{values[field.fieldName]}}</span>
        </mt-cell>
      </div>
    </div>
    <p style="height:40px;"></p>
    <div class="part">
      <div class="CRM_detail_list" v-for='field in fieldList'>
        <mt-cell v-if="(field.fieldType == 2 || field.inputType == 0) && field.inputType != 1 && field.fieldName !== 'UserName' && field.fieldName !== 'Mobile' && field.fieldName !== 'Telephone' && field.fieldName !== 'ClientEmail' && field.fieldName !== 'QQ'" :title="field.display">
          <span>{{values[field.fieldName]}}</span>
        </mt-cell>
        <mt-cell v-if="field.inputType == 1 && field.EnumItem !== undefined && field.EnumItem.filter(item => item.value == values[field.fieldName]).length > 0" :title="field.display">
          <span v-for="option in field.EnumItem" v-if="option.value == values[field.fieldName]">{{option.name}}</span>
        </mt-cell>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions } from 'vuex'
import { Button, Header, Indicator, Cell } from 'mint-ui'
import 'mint-ui/lib/button/style.css'
import 'mint-ui/lib/header/style.css'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/cell/style.css'
export default {
  name: 'CRMClientInfoDetDetail', // 详情页
  components: {
    'mt-button': Button,
    'mt-header': Header,
    'mt-cell': Cell
  },
  data: function () {
    return {
      UserName: '', // 联系人
      fieldList: [],
      values: {},
      ClientName: ''
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['detail', 'reportQuery']),
    listData: function () {
      let keyId = this.$route.params.keyId
      let ModuleId = this.$route.params.ModuleId
      let modelObj = []
      this.reportQuery({reportNumber: 'CRMClientModule'}).then((obj) => {
        modelObj = obj.rows.filter(item => item.id === ModuleId)
        if (modelObj.length >= 0) {
          let tableInfo = modelObj[0].tableInfo.split(':')[1]
          console.log(tableInfo) // 表名
          let vm = this
          Indicator.open({text: '加载中...', spinnerType: 'snake'})
          this.detail({tableName: tableInfo, keyId: keyId}).then((resolve) => {
            Indicator.close()
            console.log(resolve)
            for (let key in vm.$data) {
              vm.$data[key] = resolve[key]
            }
            vm.$data.ClientName = vm.$route.params.ClientName
            console.log(vm.$data)
            // 处理主表信息
            vm.fieldList = vm.fieldList.filter(field => field.inputType !== 100 && field.inputType !== 3 && field.fieldType !== 14 && field.fieldName in vm.$data.values)
            vm.fieldList.forEach(function (item, index, e) {
              if (item.inputType === 1 && item.EnumItem !== undefined) {
                item.EnumItem.unshift({name: ' ', value: ''})
              }
            })
            console.log(vm.$data)
          })
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      // 如果从列表页进入详情页，就要重新拉取数据
      if (from.name === 'CRMClientInfoDetList' && to.name === 'CRMClientInfoDetDetail') {
        this.listData()
      }
    }
  },
  created () {
    this.listData()
  }
}
</script>
<style>
  .CRM_detail_list .mint-cell-wrapper{
    background-image: none;
  }
  .CRM_detail_list .mint-cell-wrapper .mint-cell-value{
    max-width: 160px;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  $background-color: #F0F0F0;
  $background-color-block:#fff;
  $p-text-color:#BABABA;
  $p-text-color-light:#26A2FF;
  .page_wrap{
    .mint-header .mint-button{
      font-size: 14px !important;
    }
    .mint-header{
      font-size: 18px;
    }
    width: 100%;
    height:100%;
    background:$background-color;
    .page_cont.CRMDet_detail{
      .part{
        padding:0 12px;
        background:#fff;
        .CRM_detail_list{
          .mint-cell{
            min-height:55px;
            img{
              margin-right:15px;
            }
          }
        }
      }
      padding-top:2.5rem;
      background:$background-color;
    }
    .mint-header-title{
      font-size:18px;
    }
  }
</style>

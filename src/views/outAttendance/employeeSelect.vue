<template>
  <div class="wrap employeeSelect">
    <mt-header fixed :title="title">
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </div>
      <mt-button slot="right" v-show="chosenEmp.length > 0" @click="submit">确定</mt-button>
    </mt-header>
    <mt-index-list :height="indexListHeight">
      <mt-index-section v-for="{key, values} in characters" :index="key" v-show="values.length > 0">
        <div class="empWrapper" v-for="emp in values" @click="check(emp.index)">
          <div class="emp">
            <span :class="{empChecked: true, isChecked: emp.checked == true}"></span>
            <span class="empName">{{ emp.tblEmployee_EmpFullName }}</span>
            <span class="empDept">{{ emp.tblDepartment_DeptFullName}}</span>
          </div>
        </div>
      </mt-index-section>
     </mt-index-list>
  </div>
</template>

<script>
  import * as types from '../../store/modules/employee/types'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { Header, Button, IndexList, IndexSection, Cell } from 'mint-ui'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/index-list/style.css'
  import 'mint-ui/lib/index-section/style.css'
  import 'mint-ui/lib/cell/style.css'
  export default {
    name: 'employeeSelect',
    data () {
      return {
      }
    },
    computed: {
      indexListHeight () {
        return window.document.documentElement.clientHeight - 40
      },
      title () {
        return this.$route.params.title || '选择职员'
      },
      ...mapGetters({characters: types.GetCharactersList, chosenEmp: types.GetChosenEmp, cbMutationName: types.GetCbMutationName})
    },
    created () {
      this[types.FetchList]()
    },
    components: {
      'mt-header': Header,
      'mt-button': Button,
      'mt-index-list': IndexList,
      'mt-index-section': IndexSection,
      'mt-cell': Cell
    },
    methods: {
      ...mapActions([types.FetchList]),
      ...mapMutations({check: types.ToggleCheckedStatus}),
      submit () {
        this.$store.commit(this.cbMutationName, this.chosenEmp)
        this.$router.go(-1)
      }
    }
  }
</script>

<style type="text/css">
  .employeeSelect .mint-header-title {
    font-size: 16px;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  .wrap {
    height: 100%;
    width: 100%;
    .mint-header {
      color:#333;
      background-color:#fff;
      border-bottom:1px #dedede solid;
    }
    .mint-indexlist {
      margin-top: 40px;
    }
    .empWrapper {
      background:#fff;
      border-bottom:1px solid #e8e8e8;
      padding:10px 15px 10px 0;
      margin-left: 15px;
      &:last-child {
        border: none;
      }
      .emp {
        overflow: hidden;
        .empChecked {
          display: inline-block;
          background-color: #fff;
          border-radius: 50%;
          border: 1px solid #ccc;
          position: relative;
          width: 20px;
          height: 20px;
          vertical-align: middle;
          margin-right: 10px;
          &:after {
            border: 2px solid transparent;
            border-left: 0;
            border-top: 0;
            content: " ";
            top: 4px;
            left: 6px;
            position: absolute;
            width: 4px;
            height: 8px;
            -webkit-transform: rotate(45deg) scale(0);
            transform: rotate(45deg) scale(0);
            -webkit-transition: -webkit-transform .2s;
            transition: -webkit-transform .2s;
            transition: transform .2s;
            transition: transform .2s,-webkit-transform .2s;            
          }
          &.isChecked {
            background-color: #26a2ff;
            border-color: #26a2ff;
            &:after {
              border-color: #fff;
              -webkit-transform: rotate(45deg) scale(1);
              transform: rotate(45deg) scale(1);
            }
          }
        }
        .empDept {
          font-size: 12px;
          margin-left: 5px;
          color: #7e7e7e;
        }
      }
    }
  }
</style>

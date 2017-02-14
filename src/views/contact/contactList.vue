<template>
  <div class="wrap">
    <mt-header fixed title="通讯录">
      <div slot="left">
        <mt-button icon="back" @click.native="$router.push({name: 'index'})">
      </div>
    </mt-header>
    <div class="page_cont contactList_page">
      <mt-index-list :height="indexListHeight">
        <mt-index-section v-for="{key, values} in characters" :index="key" v-show="values.length > 0">
          <div class="contactList" v-for="employee in values" @click="check(employee)">
            <img src="../../assets/contactHead.png" alt="">
            <p>
              {{employee.tblEmployee_EmpFullName}}
              <span>{{employee.tblDepartment_DeptFullName}}</span>
              <a class="mobile" :href="'tel:'+employee.tblEmployee_Mobile">{{employee.tblEmployee_Mobile}}</a>
            </p>
          </div>
        </mt-index-section>
      </mt-index-list>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Header, Button, IndexList, IndexSection, Indicator } from 'mint-ui'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/index-list/style.css'
  import 'mint-ui/lib/index-section/style.css'
  import 'mint-ui/lib/indicator/style.css'
  export default {
    name: 'contact',
    data () {
      return {
        characters: [],
        value: '',
        result: []
      }
    },
    computed: {
      indexListHeight () {
        return window.document.documentElement.clientHeight - 40
      },
      prevRouteName () {
        return this.$route.params.prevRouteName
      }
    },
    created () {
      this.initData()
      this.fetchData()
    },
    components: {
      'mt-header': Header,
      'mt-button': Button,
      'mt-index-list': IndexList,
      'mt-index-section': IndexSection
    },
    methods: {
      ...mapActions(['popupSelect']),
      fetchData () {
        let vm = this
        Indicator.open({
          text: '加载中...',
          spinnerType: 'snake'
        })
        this.popupSelect({selectName: 'Employee', pageSize: 999}).then((data) => {
          console.log(data)
          Indicator.close()
          vm.characters.forEach(({values}) => { values.splice(0, values.length) })
          data.forEach(employee => {
            // console.log(employee)
            let index = employee.tblEmployee_EmpFullNamePYM.charCodeAt(0) - 97
            if (isNaN(index) || index < 0) {
              // vm.characters[26].values.push(employee)
            } else {
              vm.characters[index].values.push(employee)
            }
          })
          vm.characters.forEach(ch => ch.values.sort((a, b) => a.tblEmployee_EmpFullName.localeCompare(b.tblEmployee_EmpFullName)))
        })
      },
      initData () {
        for (let i = 0; i < 26; i++) {
          this.characters.push({key: String.fromCharCode(i + 65), values: []})
        }
        // 没有拼音码的存放在这里
        // this.characters.push({key: '#', values: []})
      },
      check (employee) {
        console.log(employee)
        // let prevRouteName = this.prevRouteName
        // this.$router.replace({name: prevRouteName, params: {checked: employee}})
      }
    }
  }
</script>
<style>
  .contactList_page p.mint-indexsection-index{
    padding:5px 12px;
    background: #f7f7f7;
    color:#bdbdbd;
  }
  .contactList_page .mint-cell-wrapper{
    background-image:none;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  $background-color: #F0F1F5;
  $background-color-block:#fff;
  $p-text-color:#BABABA;
  $p-text-color-light:#26A2FF;
  .wrap {
    height: 100%;
    width: 100%;
    .mint-header-title {
      font-size: 18px;
    }
    .mint-indexlist {
      margin-top: 1px;
    }
    .page_cont.contactList_page{
      padding-top:2.5rem;
      background:$background-color;
      .mint-cell:last-child{
        background-image:none;
      }
      ul{
        .contactList{
          overflow:hidden;
          padding:5px 12px 0px 12px;;
          background:#fff;
          img{
            width:30px;
            float:left;
            margin-right:15px;
          }
          p{
            height:30px;
            line-height:30px;
            padding-bottom:5px;
            border-bottom:1px solid #e8e8e8;
            span{
              font-size:12px;
              margin-left:5px;
              color:#7e7e7e;
            }
            a.mobile{
              font-size:12px;
              float:right;
              margin-left:0px;
              text-decoration: none;
              color:#38c;outline:none;
            }
          }
          &:last-child{
            p{
              border:none;
            }
          }
        }
      }
    }
    .mint-search{
      height:100%;
    }
    .mint-header{
      background-color:#fff;
      color:#333;
      border-bottom:1px #dedede solid;
    }
  }
</style>

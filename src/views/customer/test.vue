<template>
  <div class="wrap">
    <mt-header fixed title="选择职员">
      <div slot="left">
        <mt-button icon="back" @click.native='$router.go(-1)'>
      </div>
    </mt-header>
    <mt-index-list :height="indexListHeight">
      <mt-index-section v-for="{key, values} in characters" :index="key" v-show="values.length > 0">
        <mt-cell v-for="employee in values" :title="employee.tblEmployee_EmpFullName" @click.native="check(employee)">
        </mt-cell>
      </mt-index-section>
     </mt-index-list>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Header, Button, IndexList, IndexSection, Cell, Indicator } from 'mint-ui'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/button/style.css'
  import 'mint-ui/lib/index-list/style.css'
  import 'mint-ui/lib/index-section/style.css'
  import 'mint-ui/lib/cell/style.css'
  import 'mint-ui/lib/indicator/style.css'
  export default {
    name: 'test',
    data () {
      return {
        characters: []
      }
    },
    computed: {
      indexListHeight () {
        return window.document.documentElement.clientHeight - 40
      }
    },
    created () {
      this.initData()
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    components: {
      'mt-header': Header,
      'mt-button': Button,
      'mt-index-list': IndexList,
      'mt-index-section': IndexSection,
      'mt-cell': Cell
    },
    methods: {
      ...mapActions(['popup']),
      fetchData () {
        let vm = this
        Indicator.open({
          text: '加载中...',
          spinnerType: 'snake'
        })
        this.popup({selectName: 'Employee'}).then(({cond, data}) => {
          Indicator.close()
          data.forEach(employee => {
            let index = employee.tblEmployee_EmpFullNamePYM.charCodeAt(0) - 97
            if (isNaN(index)) {
              ;
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
      },
      check (employee) {
        this.$router.replace({name: 'expenseaccount', params: {checked: employee}})
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .wrap {
    height: 100%;
    .mint-header-title {
      font-size: 18px;
    }
    .mint-indexlist {
      margin-top: 40px;
    }
  }
</style>

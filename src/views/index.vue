<template>
  <div class="index_page">
    <div class="page_top">
      <div class="part_one">
        <img src="../assets/headPic.png" alt="" class="head_pic">
        <div class="my_info">
          <div class="greeting">
            <em v-if="imgType === 'sun'">
              <img src="../assets/sun.png"/>
            </em>
            <em v-else-if="imgType === 'tea'">
              <img src="../assets/tea.png"/>
            </em>
            <em v-else="imgType === 'moon'">
              <img src="../assets/moon.png"/>
            </em>
            <span>{{greetingWord}}</span>
          </div>
          <p class="my_name">{{name}}</p>
        </div>
      </div>
      <div class="part_two">
        <div class="depart">
          <img src="../assets/departPic.png" alt="">
          <span>{{title}}</span>
        </div>
        <div class="oval">
          <img src="../assets/Oval.png" alt="">
          <span>{{department}}</span>
        </div>
      </div>
    </div>
    <div class="workbench">
      <p class="title">我的工作台</p>
      <ul class="workBlock" id="workBlock">
        <li @click="$router.push({name: 'approve'})">
          <div>
            <img src="../assets/shenpi.png" alt="">
            <p>审批</p>
          </div>
        </li>
        <li @click="$router.push({name: 'storeList'})">
          <div>
            <img src="../assets/kucunchaxun.png" alt="">
            <p>库存查询</p>
          </div>
        </li>
        <li @click="$router.push({name: 'contactList'})">
          <div>
            <img src="../assets/tongxunlu.png" alt="">
            <p>通讯录</p>
          </div>
        </li>
        <li @click="$router.push({name: 'cardscanlist'})">
          <div>
            <img src="../assets/tupiansaomiao.png" alt="">
            <p>名片管理</p>
          </div>
        </li>
        <li @click="$router.push({name: 'CRMClientInfo'})">
          <div>
            <img src="../assets/kehu.png" alt="">
            <p>客户管理</p>
          </div>
        </li>
        <li>
          <div>
            <img src="../assets/allmenu.png" alt="">
            <p>所有</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  export default {
    name: 'index',
    data () {
      return {
        greetingWord: '早上好',
        imgType: 'sun',
        titleEnum: []
      }
    },
    computed: {
      ...mapState({
        name: state => state.user.name,
        titleId: state => state.user.titleId,
        department: state => state.user.departmentName
      }),
      title () {
        let index = this.titleEnum.findIndex(item => item.value === this.titleId)
        return index !== -1 ? this.titleEnum[index].name : ''
      }
    },
    methods: {
      'getName' () {
        var name = JSON.parse(window.localStorage.getItem('user')).name
        this.name = name
      },
      'greeting' () {
        var hour = (new Date()).getHours()
        if (hour < 12) {
          this.greetingWord = '早上好'
          this.imgType = 'sun'
        } else if (hour >= 12 && hour < 19) {
          this.greetingWord = '下午好'
          this.imgType = 'tea'
        } else {
          this.greetingWord = '晚上好'
          this.imgType = 'moon'
        }
      },
      ...mapActions(['getSessEmp', 'getEnum'])
    },
    mounted () {
      var lis = document.getElementById('workBlock').getElementsByTagName('li')
      function action () {
        var width = (window.document.documentElement.clientWidth - 12) / 2
        width = width > 300 ? 300 : width
        for (var i = 0; i < lis.length; i++) {
          lis[i].style.width = width + 'px'
          lis[i].style.height = width + 'px'
          if (i % 2 === 0) {
            lis[i].style.marginRight = '12px'
          }
        }
      }
      action()
      window.onresize = function () {
        action()
      }
    },
    activated () {
      this.getSessEmp().then(() => {
        if (this.titleEnum.length === 0) {
          this.getEnum('duty').then(titleEnum => {
            titleEnum.forEach(item => {
              this.titleEnum.push(item)
            })
          })
        }
      })
      this.greeting()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  $font-color: #7e7e7e;
  $background:#f0f0f0;
  .index_page{
    min-height:100%;
    width:100%;
    background:$background;
    .page_top{
      background:#fff;
      overflow:hidden;
      box-sizing: border-box;
      padding: 20px 15px 0;
      .part_one{
        height:65px;
        padding-bottom:15px;
        border-bottom: 1px solid #e8e8e8;
        .head_pic{
          width:65px;
          float:left;
        }
        .my_info{
          float:left;
          margin-left:20px;
          .my_name{
            font-size:26px;
            margin-top:5px;
          }
        }
        .greeting{
          width:100%;
          float:right;
          position: relative;
          color:$font-color;
          font-size:14px;
          left:20px;
          margin:7px 0 4px 0;
          em{
            display:block;
            height:16px;
            width:16px;
            position:absolute;
            left:-20px;
            top:1px;
            img{
              width:100%;
            }
          }
        }
      }
      .part_two{
        height:30px;
        padding:12px 12px 18px;
        overflow:hidden;
        >div{
          float:left;
          width:50%;
          box-sizing: border-box;
          overflow:hidden;
          img{
            width:30px;
            float:left;
          }
          span{
            display:inline-block;
            height:30px;
            line-height:30px;
            float:left;
            margin-left:8px;
            max-width:90px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            @media screen and (min-width:360px) {
              max-width:114px;
            }
            @media screen and (min-width:400px) {
              max-width:130px;
            }
          }
        }
      }
    }
    .workbench{
      .title {
        padding: 12px 20px;
        color:$font-color;
        font-size:14px;
      }
      ul{
        overflow:hidden;
        list-style:none;
        max-width:612px;
        margin:0 auto;
        li{
          border-radius:5px;
          float:left;
          width:48%;
          background:#fff;
          max-height:250px;
          margin-bottom:12px;
          box-sizing: border-box;
          position: relative;
          div{
            width:64px;
            height:100px;
            text-align:center;
            position:absolute;
            top:0;
            bottom:0;
            left:0;
            right:0;
            margin:auto;
            img{
              width:100%;
            }
            p{
              margin-top:8px;
              font-weight: 300;
            }
            @media screen and (min-width:360px) {
              width:74px;
              height:102px;
            }
            @media screen and (min-width:400px) {
              width:74px;
              height:110px;
            }
          }
        }
      }
    }
  }
</style>

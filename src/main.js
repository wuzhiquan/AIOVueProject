import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import routes from './routes'
import store from './store'
// import Fastclick from 'fastclick'
Vue.use(VueRouter)
Vue.mixin({
  beforeRouteLeave (to, from, next) {
    window.sessionStorage.setItem('scrollTop' + from.name, document.body.scrollTop)
    next(true)
  },
  beforeRouteEnter (to, from, next) {
    let scrollTop = window.sessionStorage.getItem('scrollTop' + to.name)
    scrollTop = !scrollTop ? 0 : scrollTop
    next(vm => { window.scroll(0, scrollTop) })
  }
})
// 创建一个路由对象用于管理页面的路由
const router = new VueRouter({
  mode: 'history',
  // 应用的基路径
  base: '/mobilevue',
  routes: routes
})
// 检查页面是否需要用户登陆
router.beforeEach(({meta, name}, from, next) => {
  // Fastclick.attach(document.body)
  var {auth = true} = meta
  var isLogin = Boolean(store.state.user.id) // true用户已登录， false用户未登录
  if (auth && !isLogin && name !== 'login') {
    store.dispatch('getSessEmp').then(() => {
      next()
    }).catch((msg) => {
      window.console.log(msg)
    })
    return
  }
  next()
})

router.afterEach(() => {
  // 检查是否是企业微信，如果是需要重新加载一次页面，reloadFlag的设置需要配合后台
  if (store.getters.isWX && store.state.wxinfo.reloadFlag) {
    window.__aioApp__.$router.push({ name: 'wxredirect', params: {state: 'wxwork', target: store.state.wxinfo.originalHref} })
    return
  }
})
window.__aioApp__ = new Vue({
  el: '#app',
  router,
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件, 且子组件能通过 this.$store 访问到
  store,
  render: h => h(App)
})

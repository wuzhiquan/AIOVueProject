import Vue from 'vue'
import Vuex from 'vuex'
import cardscan from './modules/cardscan'
import locate from './modules/locate'
import employee from './modules/employee'
import outAttendance from './modules/outAttendance'
import crmclientloc from './modules/crmclientloc'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 当前的登陆用户
    user: JSON.parse(window.localStorage.getItem('user')) || {},
    // 当前审核单据的审核流程
    curFlowDepict: [],
    // state参数，区别来源于微信服务号，微信企业号，企业微信
    wxinfo: { wxstate: window.sessionStorage.getItem('wxstate') || '', url: '', status: false, originalHref: window.location.href, reloadFlag: window.sessionStorage.getItem('reloadFlag') || false }
  },
  getters,
  mutations,
  actions,
  modules: {
    cardscan,
    locate,
    employee,
    outAttendance,
    crmclientloc
  }
})

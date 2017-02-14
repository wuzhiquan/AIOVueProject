import Vue from 'vue'
import * as types from './mutation-types'

// 根级别的mutation
export default {
  [types.SIGNIN] (state, user) {
    // 将登陆用户信息持久到本地存储
    window.localStorage.setItem('user', JSON.stringify(user))
    Object.assign(state, {user: user})
  },
  [types.UPDATEUSERINFO] (state, user) {
    let newUser = Object.assign({}, state.user)
    for (let [k, v] of Object.entries(user)) {
      newUser[k] = v
    }
    Object.assign(state, {user: newUser})
  },
  [types.SIGNOUT] ({user}) {
    // 从本地存储移除登陆用户信息
    window.localStorage.removeItem('user')
    Object.keys(user).forEach(k => Vue.delete(user, k))
  },
  [types.CURFLOWDEPICT] (state, flowDepict = []) {
    // 更新当前审核单据的审核流程
    state.curFlowDepict.splice(0, state.curFlowDepict.length)
    flowDepict.forEach(item => state.curFlowDepict.push(item))
  },
  wxinfo (state, wxinfo) {
    // 更新微信信息
    wxinfo.originalHref = state.wxinfo.originalHref
    Object.assign(state, {wxinfo})
  }
}

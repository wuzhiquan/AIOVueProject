import axios from 'axios' // AJAX 库
import qs from 'qs' // 用来处理AJAX提交的数据
import { Toast } from 'mint-ui'
import 'mint-ui/lib/toast/style.css'
/**
 * AJAX 请求
 * @param  {Sting}   url           地址
 * @param  {Object}   data         携带的数据
 * @param  {Function} cb           成功时执行的回调函数
 * @param  {Function}   [errCb=error    =>            Toast({message: error.message, duration: 2000})] 失败时执行的回调函数
 * @param  {String}   [method='post'] 方法
 * @return {null}
 */
const commitData = (url, data, cb, errCb = error => Toast({message: error.message, duration: 2000}), isFormdata = false
    , method = 'post') => {
  if (!isFormdata) {
    axios({
      method: method,
      url: url,
      headers: {'returntype': 'ajax/json', 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
      data: qs.stringify(data) // 通过使用qs这个库，将所有的数据通过表单的方式提交
    }).then(response => {
      let retData = response.data
      if (retData.code === 'NOLOGIN') { // 未登陆
        if (window.__aioApp__.$route.name !== 'index') {
          Toast({message: '请先去登陆', duration: 2000})
        }
        cb(retData)
        // 判断有没有微信的标识，如果有需要重新打开页面，进行微信登陆
        // wxstate的设置需要结合后台，目前在mhome.jsp页面里面设置
        let wxstate = window.sessionStorage.getItem('wxstate')
        if (!wxstate) {
          window.__aioApp__.$router.push({ name: 'login' })
        } else {
          window.__aioApp__.$router.push({ name: 'wxredirect', params: {state: wxstate} })
        }
      } else {
        cb(retData)
      }
    }).catch(errCb)
  } else {
    axios.post(url, data).then(cb).catch(errCb)
  }
}

export default {
  commitData
}

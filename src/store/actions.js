import * as types from './mutation-types'
import common from '../api/common'
import md5 from 'md5'
import {MessageBox} from 'mint-ui'
import 'mint-ui/lib/message-box/style.css'
/**
 *  登陆，密码需要进行md5
 * @param  {Function} commit           根应用状态的commit
 * @param  {Object} state            根应用状态，在这里用于获取里面的用户登陆信息
 * @param  {Object} [user=localUser] 提交的用户登陆信息
 * @return {Object}                  Promise
 */
const signin = ({ commit, state: {user: localUser} }, user = localUser) => {
  let hexedPassword = String(localUser.password)
  if (localUser.password !== user.password) {
    hexedPassword = md5(user.password)
  }
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=LOGIN', {name: user.name, password: hexedPassword}, data => {
      // code为OK时表示登陆成功
      if (data.code === 'OK') {
        user.id = data.id || 'signined'
        // 持久的本地存储的密码是md5的
        user.password = hexedPassword
        commit(types.SIGNIN, user)
      }
      resolve(data)
    }, error => reject(error))
  })
}

/**
 * 退出
 * @param  {Function} commit           根应用状态的commit
 * @param  {Object} user   移除的用户登陆信息
 * @return {null}
 */
const signout = ({ commit }, user) => commit(types.SIGNOUT, user)

/**
 * 获取登陆用户信息
 * @param  {Function} commit           根应用状态的commit
 * @return {Object}           Promise
 */
const getSessEmp = ({commit, state: {user}}) => {
  return new Promise((resolve, reject) => {
    if (user.departmentName) {
      resolve(user)
      return
    }
    common.commitData('/MobileAjax?op=getSessEmp', {}, ({code, msg, obj}) => {
      if (code === 'OK') {
        commit(types.UPDATEUSERINFO, obj)
        resolve(obj)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 获取单据详情
 * @param  {Function} commit           根应用状态的commit
 * @param  {String} tableName        表名
 * @param  {String} keyId            单据id
 * @return {Object}           Promise
 */
const detail = function ({ commit }, {tableName, keyId}) {
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=detail', {tableName, keyId}, ({code, msg, obj}) => {
      if (code === 'OK') {
        if ('values' in obj) { // 针对反斜杠单独处理，如果以后引起性能问题，把这里去掉
          let valuesJSONStr = window.JSON.stringify(obj.values)
          valuesJSONStr = valuesJSONStr.replace(/&#92;/g, '\\\\')
          obj.values = window.JSON.parse(valuesJSONStr)
        }
        resolve(obj)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 列表查询
 * @param  {Function} commit           根应用状态的commit
 * @param  {Number} [pageNo=1]    页码
 * @param  {Number} [pageSize=10] 每页数量
 * @param  {String} tableName     数据表列表(数据表列表和普通报表必须传其一)
 * @param  {String} reportNumber  普通报表(数据表列表和普通报表必须传其一)
 * @param  {String} moduleType    模块名称，数据表列表可能需要传入
 * @param  {String} [src='menu']  每次列表查询都要传这个参数，否则查询条件的变动不起作用
 * @param  {Object} extraParam    提交查询的条件参数
 * @return {Object}               Promise
 */
const reportQuery = function ({ commit }, {pageNo = 1, pageSize = 10, tableName, reportNumber, moduleType, src = 'menu', extraParam}) {
  let url = '/MobileAjax?op=report'
  if (tableName) {
    url += '&tableName=' + tableName
  } else if (reportNumber) {
    url += '&reportNumber=' + reportNumber
  } else {
    window.alert('接口参数错误，数据表列表(tableName)和普通报表(reportNumber)必须传其一')
    return
  }
  let query = {pageNo, pageSize, moduleType, src, ...extraParam}
  return new Promise((resolve, reject) => {
    common.commitData(url, query, ({code, msg, obj}) => {
      if (code === 'OK') {
        /**
         * obj的结构如下：
         *  condition:查询条件，格式 : [["字段名","值"],["字段名","值"]]
         *    cols:显示的列,格式：[["字段中文名","显示宽度","字段类型","分组名称","字段英文名"],["字段中文名","显示宽度","字段类型","分组名称","字段英文名"]]
         *    rows：数据行，格式: [{"字段英文名":"值","字段英文名":"值"}]（注意：数组中是一个对象）
         */
        resolve(obj)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 查询是否具有添加权限（在列表页面需要调用此接口来判断是否显示添加按钮）
 * @example
 *   // return true
 *   $store.dispatch('canAdd','tblStock').then(msg => {console.log(obj)})
 * @param  {Function} commit           根应用状态的commit
 * @param  {String} tableName       表名称
 * @param  {String} parentTableName 父表名称
 * @param  {String} moduleType      同一表不同模块
 * @return {Object}                 Promise
 */
const canAdd = function ({ commit }, {tableName, parentTableName, moduleType}) {
  let query = {tableName, parentTableName, moduleType}
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=canAdd', query, ({code, msg}) => {
      if (code === 'OK') {
        // msg 是布尔值，true代表具有添加权限
        resolve(msg)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 *  添加单据前准备数据
 * @param  {Function} commit           根应用状态的commit
 * @param {String} tableName       表名称
 * @param {String} parentTableName 父表名称
 * @param  {String} moduleType      同一表不同模块
 * @param {String} f_brother       兄弟表的父单据ID
 * @param {String} parentCode      父目录classCode
 * @param {Object} addData         其它参数如通过链接带入的默认值等
 * @return {Object}                 Promise
 */
const addPre = function ({ commit }, {tableName, parentTableName, moduleType, f_brother, parentCode, addData}) {
  let query = {tableName, parentTableName, moduleType, f_brother, parentCode, ...addData}
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=addPrepare', query, ({code, obj, msg}) => {
      if (code === 'OK') {
        // obj 的结构说明参考aio接口
        resolve(obj)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 添加单据
 * @param  {Function} commit           根应用状态的commit
 * @param {String} tableName       表名
 * @param {String} parentTableName 父表名
 * @param {String} [saveType='']   'saveDraft':存草稿；'':正式单据
 * @param {String} values          提交的单据数据的json字符串，其中明细表数据的key为TABLENAME_表名，value为数组
 * @param {String} defineInfo      自定义中有弹出可选确认框，会自动带出一个字定义标识代码，按原文传入。默认为空
 */
const add = function ({ commit, dispatch }, {tableName, parentTableName, saveType = '', values, defineInfo = ''}) {
  let addData = {tableName, parentTableName, saveType, values, defineInfo}
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=add', addData, ({code, obj, msg}) => {
      if (code === 'OK') {
        resolve({keyId: obj.keyId, tableName})
      } else if (code === 'CONFIRM') {
        //  需要进一步确认，msg[0]为需要确认的文字，msg[1]，msg[2]对应是否后执行的defineInfo，这时候需要把defineInfo传入重新执行add，
        msg = msg.split('#;#')
        msg[0].replace(/\\n/g, '<br/>')
        MessageBox.confirm(msg[0]).then(action => {
          addData.defineInfo = msg[1]
          return dispatch('add', addData)
        }).catch(action => {
          addData.defineInfo = msg[2]
          return dispatch('add', addData)
        })
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 修改单据
 * @param  {Function} commit           根应用状态的commit
 * @param {String} tableName       表名
 * @param {String} parentTableName 父表名
 * @param {String} [saveType='']   'saveDraft':存草稿；'':正式单据
 * @param {String} values          提交的单据数据的json字符串，其中明细表数据的key为TABLENAME_表名，value为数组
 * @param {String} defineInfo      自定义中有弹出可选确认框，会自动带出一个字定义标识代码，按原文传入。默认为空
 */
const update = function ({ commit, store }, {tableName, parentTableName, saveType = '', values, defineInfo = ''}) {
  let addData = {tableName, parentTableName, saveType, values, defineInfo}
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=update', addData, ({code, obj, msg}) => {
      if (code === 'OK') {
        resolve({})
      } else if (code === 'CONFIRM') {
        //  需要进一步确认，msg[0]为需要确认的文字，msg[1]，msg[2]对应是否后执行的defineInfo，这时候需要把defineInfo传入重新执行add，
        msg = msg.split('#;#')
        msg[0].replace(/\\n/g, '<br/>')
        MessageBox.confirm(msg[0]).then(action => {
          addData.defineInfo = msg[1]
          return store.dispatch('add', addData)
        }).catch(action => {
          addData.defineInfo = msg[2]
          return store.dispatch('add', addData)
        })
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 删除单据
 * @param  {Function} commit           根应用状态的commit
 * @param  {Object} store            根应用状态的store
 * @param  {String} tableName        表名
 * @param  {String} keyId            单据id
 * @param  {String} [defineInfo=''}] 自定义中有弹出可选确认框，会自动带出一个字定义标识代码，按原文传入。默认为空
 * @return {Object}                  Promise
 */
const del = function ({ commit, store }, {tableName, keyId, defineInfo = ''}) {
  let delData = {tableName, keyId, defineInfo}
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=delete', delData, ({code, msg}) => {
      if (code === 'OK') {
        resolve(msg)
      } else if (code === 'CONFIRM') {
        //  需要进一步确认，msg[0]为需要确认的文字，msg[1]，msg[2]对应是否后执行的defineInfo，这时候需要把defineInfo传入重新执行add，
        msg = msg.split('#;#')
        msg[0].replace(/\\n/g, '<br/>')
        MessageBox.confirm(msg[0]).then(action => {
          delData.defineInfo = msg[1]
          return store.dispatch('del', delData)
        }).catch(action => {
          delData.defineInfo = msg[2]
          return store.dispatch('del', delData)
        })
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 *  拉取我的工作流
 * @param  {String} [approveStatus='transing'] 审核状态(transing:待审；consignation:委托我的，transing2：办理中；finish：已办结)
 * @param  {String} keyWord                    关键字
 * @param  {Number} [pageNo=1]           第几页
 * @param  {Number} [pageSize=10]        每页的大小
 * @return {Object}                            Promise
 */
const myWorkflowQuery = function ({ commit }, {approveStatus, tempFile, keyWord, pageNo = 1, pageSize = 10}) {
  let query = {approveStatus, keyWord, pageNo, tempFile}
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=myworkflow', query, ({code, obj}) => {
      if (code === 'OK') {
        resolve({list: obj.list})
      } else {
        reject(new Error('拉取我的工作流失败'))
      }
    }, error => reject(error))
  })
}

/**
 * 审核单据撤回
 * @param  {Function} commit           根应用状态的commit
 * @param  {String} tableName        表名
 * @param  {String} keyId            单据id
 * @return {Object}           Promise
 */
const cancelTo = function ({ commit }, {tableName, keyId}) {
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=cancelTo', {tableName, keyId}, ({code, msg}) => {
      if (code === 'OK') {
        resolve(msg)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 审核单据反审核
 * @param  {Function} commit           根应用状态的commit
 * @param  {String} tableName        表名
 * @param  {String} keyId            单据id
 * @return {Object}           Promise
 */
const retCheck = function ({ commit }, {tableName, keyId}) {
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=retCheck', {tableName, keyId}, ({code, msg}) => {
      if (code === 'OK') {
        resolve(msg)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 审核单据催办
 * @param  {Function} commit           根应用状态的commit
 * @param  {String} tableName        表名
 * @param  {String} keyId            单据id
 * @param  {String} [content='']  催办信息
 * @param  {Number} [wakeType=4}] 通知类型
 * @return {Object}           Promise
 */
const hurryTransFunc = function ({ commit }, {tableName, keyId, content = '', wakeType = 4}) {
  let hurryTransData = {tableName, keyId, content, wakeType}
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=hurryTrans', hurryTransData, ({code, msg}) => {
      if (code === 'OK') {
        resolve(msg)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 审核单据转交前准备数据
 * @param  {Function} commit           根应用状态的commit
 * @param  {String} tableName        表名
 * @param  {String} keyId            单据id
 * @return {Object}           Promise
 */
const deliverPre = function ({ commit }, {tableName, keyId}) {
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=deliverToPrepare', {tableName, keyId}, ({code, msg, obj}) => {
      if (code === 'OK') {
        resolve(obj)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 审核单据转交
 * @param  {Function} commit           根应用状态的commit
 * @param  {String} tableName        表名
 * @param  {String} keyId            单据id
 * @param  {String} [type='']       类型
 * @param  {String} nextStep        下一个审核步骤
 * @param  {String} currNode        当前审核步骤
 * @param  {String} designId        工作流设计版本id
 * @param  {String} checkPerson     下一个审核步骤的审核人（多个审核人使用分号凭借）
 * @param  {String} deliverance     审核意见
 * @param  {Number} oaTimeLimit     下一步办理时限（整数）
 * @param  {Number} oaTimeLimitUnit  下一步办理时限单位（0：天，1：时，2：分）
 * @return {[type]}                 [description]
 */
const deliverTo = function ({ commit }, { tableName, keyId, type = '', nextStep, currNode, designId, checkPerson, deliverance, oaTimeLimit, oaTimeLimitUnit }) {
  let deliverToData = { tableName, keyId, type, nextStep, currNode, designId, checkPerson, deliverance, oaTimeLimit, oaTimeLimitUnit }
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=deliverTo', deliverToData, ({code, msg}) => {
      if (code === 'OK') {
        resolve(msg)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 取枚举信息
 * @example
 *   // return [{"name":"默认分类","value":"1"},{"name":"分类一","value":"2"},{"name":"分类二","value":"3"}]
 *   $store.dispatch('getEnum','TaskType').then(obj => {console.log(obj)})
 * @param  {Function} commit           根应用状态的commit
 * @param  {String} enumName 枚举选项名称
 * @return {Object}          Promise
 */
const getEnum = function ({ commit }, enumName) {
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=getEnum&enum=' + enumName, {}, ({code, obj, msg}) => {
      if (code === 'OK') {
        // obj是数组对象
        resolve(obj)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 取弹出窗显示字段信息和回传参数
 * @param  {Function} commit           根应用状态的commit
 * @param  {String} tableName      表名
 * @param  {String} fieldName      字段名
 * @param  {String} selectName      弹出窗名字，未指定，则按表名和字段名自动选择弹出窗
 * @param  {String} MOID           本模块的ID可以不提供本参数,在非单据的弹出窗中必须提供本参数
 * @param  {String} moduleType     本模块的类型，提供本参数，可以不提供
 * @return {Object}                Promise
 */
const popupSelectInfo = function ({ commit }, {tableName, fieldName, selectName, MOID, moduleType}) {
  let query = {tableName, fieldName, selectName, MOID, moduleType}
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=popupInfo', query, ({code, obj: {showfields, tabParam}, msg}) => {
      if (code === 'OK') {
        resolve({showfields, tabParam})
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 取弹出窗数据
 * @param  {Function} commit           根应用状态的commit
 * @param  {String} tableName      表名
 * @param  {String} fieldName      字段名
 * @param  {String} selectName      弹出窗名字，未指定，则按表名和字段名自动选择弹出窗
 * @param  {String} MOID           本模块的ID可以不提供本参数,在非单据的弹出窗中必须提供本参数
 * @param  {String} moduleType     本模块的类型，提供本参数，可以不提供
 * @param  {Number} [pageNo=1]     页码
 * @param  {Number} [pageSize=10] 每页数量
 * @param {String} [keyword] 关键字
 * @param {Object}  extraParam 额外的查询参数
 * @return {Object}                Promise
 */
const popupSelect = function ({ commit }, {tableName, fieldName, selectName, MOID, moduleType, pageNo = 1, pageSize = 10, keyword, extraParam}) {
  let query = {tableName, fieldName, selectName, MOID, moduleType, pageNo, pageSize, keyword, ...extraParam}
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=popup', query, ({code, obj: {result}, msg}) => {
      if (code === 'OK') {
        resolve(result)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

const execDefine = function ({ commit, dispatch }, {defineName, tableName, keyId, buttonTypeName = '', defineInfo = ''}) {
  let execDefineData = {defineName, tableName, keyId, buttonTypeName, defineInfo}
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=execDefine', execDefineData, ({code, obj, msg}) => {
      window.console.log('aa')
      if (code === 'OK') {
        resolve(keyId)
      } else if (code === 'CONFIRM') {
        //  需要进一步确认，msg[0]为需要确认的文字，msg[1]，msg[2]对应是否后执行的defineInfo，这时候需要把defineInfo传入重新执行add，
        msg = msg.split('#;#')
        msg[0].replace(/\\n/g, '<br/>')
        MessageBox.confirm(msg[0]).then(action => {
          if (msg[1]) {
            execDefineData.defineInfo = msg[1]
            dispatch('execDefine', execDefineData).then(keyId => {
              resolve(keyId)
            }).catch(error => reject(error))
          } else {
            resolve()
          }
        }).catch(action => {
          if (msg[2]) {
            execDefineData.defineInfo = msg[2]
            dispatch('execDefine', execDefineData).then(keyId => {
              resolve(keyId)
            }).catch(error => reject(error))
          } else {
            resolve()
          }
        })
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 拉取首页，可以通过调用此接口验证用户是否已经登陆
 * @param  {Function} commit 根应用状态的commit
 * @return {Object}                Promise
 */
const getHome = function ({ commit }) {
  return new Promise((resolve, reject) => {
    common.commitData('/MobileAjax?op=getHome', {}, ({code, obj, msg}) => {
      if (code === 'OK') {
        resolve(obj)
      } else {
        reject(new Error(msg))
      }
    }, error => reject(error))
  })
}

/**
 * 获取微信
 * @param  {Function}  commit    根应用状态的commit
 * @param  {Object}  state:    根应用状态，在这里用于获取里面的用户登陆信息
 * @param  {Array}   jsApiList jsapi数组
 * @param  {Boolean} odebug     是否开启调试
 * @return {Object}                  Promise
 */
const getWX = function ({ commit, state: { wxinfo: {wxstate, url, status, originalHref} } }, { jsApiList = [], debug = false }) {
  return new Promise((resolve, reject) => {
    if (!wxstate) { reject(new Error('请在微信或企业微信内打开本网页')) }
    let curURL = window.location.href.split('#')[0]
    if (!url || curURL !== url || !status) {
      commit('wxinfo', {wxstate, url: curURL, status: false})
      let param = {wxstate, url: curURL}
      let checkIOS = !!(window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
      if (checkIOS) { // 在ios里面，对于spa页面，签名的url必须是刷新页面的url
        param.url = originalHref.split('#')[0]
      }
      common.commitData('/MobileAjax?op=getJsticket', param, ({code, obj, msg}) => {
        if (code === 'OK') {
          delete obj.url
          window.wx.config({...obj, jsApiList, debug})
          window.wx.ready(() => {
            commit('wxinfo', {wxstate, url: curURL, status: true})
            resolve(window.wx)
          })
          window.wx.error(res => {
            reject(new Error(window.JSON.stringify(res)))
          })
        } else {
          reject(new Error(msg))
        }
      })
    } else {
      resolve(window.wx)
    }
  })
}

/**
 * 图片压缩
 * @param  {Function}  commit    根应用状态的commit
 * @param  {File} imgFile        文件
 * @return {Object}               Promise
 */
const compressImg = function ({ commit }, imgFile) {
  // 暂时设置上存默认图片大小
  let maxSize = 50 * 1024
  window.console.log('enter')
  return new Promise((resolve, reject) => {
    if (imgFile.size < maxSize) {
      resolve(imgFile)
    } else {
      let com_rate = maxSize / imgFile.size
      let reader = new window.FileReader()
      let image = new window.Image()
      reader.onload = (event) => {
        image.src = event.target.result
      }
      image.onload = () => {
        let rate = window.Math.sqrt(com_rate)
        image.width *= rate
        image.height *= rate
        let canvas = window.document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image, 0, 0, image.width, image.height) // 将图像绘制到canvas上
        let data = canvas.toDataURL('image/jpeg')
        data = data.split(',')[1]
        data = window.atob(data)
        let ia = new window.Uint8Array(data.length)
        for (let i = 0; i < data.length; i++) {
          ia[i] = data.charCodeAt(i)
        }
        resolve(new window.Blob([ia], { type: 'image/jpeg' }))
      }
      reader.readAsDataURL(imgFile)
    }
  })
}
// 根级别的action
export default {
  signin,
  signout,
  getSessEmp,
  detail,
  reportQuery,
  canAdd,
  addPre,
  add,
  update,
  del,
  myWorkflowQuery,
  cancelTo,
  retCheck,
  hurryTransFunc,
  deliverPre,
  deliverTo,
  getEnum,
  popupSelectInfo,
  popupSelect,
  execDefine,
  getHome,
  getWX,
  compressImg
}

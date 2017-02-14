import * as types from './types'
import { Indicator, Toast } from 'mint-ui'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/toast/style.css'
import common from '../../../api/common'
export default {
  // 名片扫描
  [types.Scan]: function ({ commit }, formData) {
    return new Promise((resolve, reject) => {
      Indicator.open({
        text: '名片识别中',
        spinnerType: 'snake'
      })
      common.commitData('/MobileAjax?op=cardscan', formData, (response) => {
        Indicator.close()
        let ret = response.data
        Toast({message: ret.msg, duration: 1000})
        if (ret.code === 'success') { // 名片识别成功
          ret.obj.keyId = ret.obj.id
          commit(types.AddBeforeList, ret.obj)
          resolve(ret.obj)
        } else {
          Toast({message: ret.msg, duration: 1000})
        }
      }, ({message}) => {
        Indicator.close()
        Toast({message, duration: 1000})
      }, true)
    })
  },
  [types.Add]: function ({ commit, dispatch, state: { cond: {tableName} } }, addedCard) {
    return new Promise((resolve, reject) => {
      Indicator.open({
        text: '数据提交中...',
        spinnerType: 'snake'
      })
      let values = Object.assign({}, addedCard)
      values = window.JSON.stringify(values)
      dispatch('add', {tableName, values}).then(({keyId}) => {
        Indicator.close()
        Toast({message: '录入成功', duration: 1000})
        commit(types.AddBeforeList, addedCard)
        resolve(keyId)
      }).catch(({message}) => {
        Indicator.close()
        Toast({message, duration: 1000})
      })
    })
  },
  [types.Update]: function ({ commit, dispatch, state: { cond: {tableName} }, getters }, updatedCard) {
    return new Promise((resolve, reject) => {
      Indicator.open({
        text: '数据提交中...',
        spinnerType: 'snake'
      })
      let values = Object.assign({}, updatedCard)
      values = window.JSON.stringify(values)
      dispatch('update', {tableName, values}).then(() => {
        Indicator.close()
        Toast({message: '修改成功', duration: 1000})
        let index = getters[types.ListKeyIds][updatedCard.id]
        index >= 0 && commit(types.UpdateToList, {index, cardscan: updatedCard})
        resolve(updatedCard.id)
      }).catch(({message}) => {
        Indicator.close()
        Toast({message, duration: 1000})
      })
    })
  },
  [types.FetchList]: function ({ state: {cond, list}, dispatch, getters, commit }) {
    Indicator.open({text: '加载中...', spinnerType: 'snake'})
    return new Promise((resolve, reject) => {
      dispatch('reportQuery', cond).then(({rows}) => {
        Indicator.close()
        rows.forEach(item => {
          if (item.keyId in getters[types.ListKeyIds]) {
            let index = getters[types.ListKeyIds][item.keyId]
            commit(types.UpdateToList, {index, cardscan: item})
          } else {
            commit(types.AddAfterList, item)
          }
        })
        resolve()
      }).catch(({message}) => {
        Indicator.close()
        Toast({message, duration: 1000})
      })
    })
  },
  [types.BindAlbum]: function ({ dispatch }, { domEle, cb }) {
    if (domEle.lastChild.type) { // 判断是否已经添加过input file, 如果有，需要删除
      domEle.removeChild(domEle.lastChild)
    } else {
      domEle.style.position = 'relative'
    }
    let inputFile = window.document.createElement('input')
    inputFile.type = 'file'
    inputFile.className = '_actionSheetInputFile'
    inputFile.accept = 'image/jpg,image/jpeg,image/png,image/gif'
    let inputFileStyle = {
      position: 'absolute',
      'z-index': 1,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      '-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
    }
    for (let attr in inputFileStyle) {
      inputFile.style[attr] = inputFileStyle[attr]
    }
    inputFile.onchange = () => {
      dispatch('compressImg', inputFile.files[0]).then(file => {
        let formData = new window.FormData()
        formData.append('file', file)
        dispatch(types.Scan, formData).then(obj => {
          cb && cb(obj)
        })
      })
    }
    domEle.appendChild(inputFile)
  },
  [types.ChooseCamera]: function ({ dispatch, getters }, { jsApiList, cb }) {
    dispatch('getWX', {jsApiList: jsApiList}).then(wx => {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success (res) {
          if (res.localIds && res.localIds.length) {
            wx.uploadImage({
              localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success (res) {
                let formData = new window.FormData()
                formData.append('serverId', res.serverId)
                formData.append('wxstate', getters['getWXState'])
                dispatch(types.Scan, formData).then(obj => {
                  cb && cb(obj)
                })
              }
            })
          }
        },
        fail () {
          window.alert(window.JSON.stringigy(arguments))
        }
      })
    }).catch(({message = '微信打开摄像头失败'}) => {
      Toast({message, duration: 1000})
    })
  },
  [types.Del]: function ({ state: { cond: { tableName } }, dispatch, getters, commit }, keyId) {
    return new Promise((resolve, reject) => {
      Indicator.open({text: '删除中...', spinnerType: 'snake'})
      dispatch('del', {tableName, keyId}).then(() => {
        Indicator.close()
        let index = getters[types.ListKeyIds][keyId]
        index >= 0 && commit(types.DelFromList, index)
        Toast({message: '删除成功', duration: 1000})
        resolve()
      }).catch(() => {
        Indicator.close()
        Toast({message: '删除失败', duration: 1000})
        reject()
      })
    })
  },
  [types.TransferToCRM]: function ({ state: { cond: { tableName } }, dispatch, getters, commit }, keyId) {
    return new Promise((resolve, reject) => {
      Indicator.open({
        text: '正在转入CRM客户资料...',
        spinnerType: 'snake'
      })
      dispatch('execDefine', {tableName, keyId, defineName: 'cardscanToCrm'}).then((keyId) => {
        Indicator.close()
        if (keyId) {
          let index = getters[types.ListKeyIds][keyId]
          index >= 0 && commit(types.UpdateStatusToList, {index, Status: 2})
          Toast({message: '转入成功', duration: 1000})
          resolve(keyId)
        }
        reject()
      }).catch(({message}) => {
        Indicator.close()
        Toast({message, duration: 1000})
        reject()
      })
    })
  }
}

import * as types from './types'
import { Indicator, Toast } from 'mint-ui'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/toast/style.css'
export default {
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
  [types.FetchList]: function ({ state: {cond: extraParam, list}, dispatch, getters, commit }) {
    Indicator.open({text: '加载中...', spinnerType: 'snake'})
    return new Promise((resolve, reject) => {
      dispatch('popupSelect', {selectName: 'SelectCRMClientLoc', extraParam}).then(result => {
        Indicator.close()
        window.console.log(result)
        result.forEach(item => {
          if (item.ClientId in getters[types.ListKeyIds]) {
            let index = getters[types.ListKeyIds][item.ClientID]
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
  }
}

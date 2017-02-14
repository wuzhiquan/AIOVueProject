import * as types from './types'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/toast/style.css'
export default {
  [types.FetchList]: function ({ commit, dispatch }) {
    commit(types.InitCharactersList)
    return new Promise((resolve, reject) => {
      dispatch('popupSelect', { selectName: 'Employee', pageSize: 999 }).then((data) => {
        commit(types.SubstituteList, data)
        commit(types.UpdateCharactersList)
        resolve()
      }).catch(err => {
        window.console.log(err)
      })
    })
  }
}

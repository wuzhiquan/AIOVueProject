import * as types from './types'
export default {
  /**
   * 返回列表数据keyIds
   * @param  {Array} list 应用状态里面的列表数据
   * @return {Object}              keyIds
   */
  [types.ListKeyIds]: ({ list }) => {
    let keyIds = {}
    for (let i = 0; i < list.length; i++) {
      keyIds[list[i].ClientId] = i
    }
    return keyIds
  },
  [types.GetCbMutationName]: ({cbMutationName}) => cbMutationName
}

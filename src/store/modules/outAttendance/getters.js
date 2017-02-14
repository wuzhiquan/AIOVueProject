import * as types from './types'
export default {
  [types.ListKeyIds]: ({ list }) => {
    let keyIds = {}
    for (let i = 0; i < list.length; i++) {
      keyIds[list[i].keyId] = i
    }
    return keyIds
  }
}

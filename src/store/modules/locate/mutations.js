import * as types from './types'
export default {
  [types.SetCbMutationName]: (state, newCbMutationName) => {
    state.cbMutationName = newCbMutationName
  }
}


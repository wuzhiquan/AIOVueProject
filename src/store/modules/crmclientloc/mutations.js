import * as types from './types'
export default {
  [types.AddBeforeList]: ({ list }, cardscan) => {
    list.unshift(cardscan)
  },
  [types.AddAfterList]: ({ list }, cardscan) => {
    list.push(cardscan)
  },
  [types.UpdateToList]: ({ list }, {index, cardscan}) => {
    for (let key in cardscan) {
      list[index][key] = cardscan[key]
    }
  },
  [types.EmptyList]: ({ list }) => {
    list.splice(0, list.length)
  },
  [types.ResetCond]: (state, cond) => {
    for (let key in cond) {
      state.cond[key] = cond[key]
    }
  },
  [types.IncreaseCondPage]: ({ cond }, step = 1) => {
    cond.pageNo += step
  },
  [types.DecreaseCondPage]: ({ cond }, step = 1) => {
    cond.pageNo -= step
    if (cond.pageNo <= 0) {
      cond.pageNo = 1
    }
  },
  [types.SetCbMutationName]: (state, newCbMutationName) => {
    state.cbMutationName = newCbMutationName
  }
}

import * as types from './types'
export default {
  /**
   * 添加进列表数据
   * @param  {Array} list  应用状态里面的列表数据
   * @param  {Object} cardscan     待增加的名片
   */
  [types.AddBeforeList]: ({ list }, cardscan) => {
    list.unshift(cardscan)
  },
  [types.AddAfterList]: ({ list }, cardscan) => {
    list.push(cardscan)
  },
  /**
   * 更新进列表数据
   * @param  {Array} list  应用状态里面的列表数据
   * @param  {Int} index    索引
   * @param  {Object} cardscan 待更新的名片
   */
  [types.UpdateToList]: ({ list }, {index, cardscan}) => {
    for (let key in cardscan) {
      list[index][key] = cardscan[key]
    }
  },
  [types.EmptyList]: ({ list }) => {
    list.splice(0, list.length)
  },
  [types.DelFromList]: ({ list }, index) => {
    list.splice(index, 1)
  },
  /**
   * 重置列表查询条件
   * @param  {state} state 应用状态
   * @param  {Object} cond 新条件
   */
  [types.ResetCond]: (state, cond) => {
    for (let key in cond) {
      state.cond[key] = cond[key]
    }
  },
  [types.UpdateStatusToList]: ({ list }, {index, Status}) => {
    list[index].Status = Status
  },
  [types.IncreaseCondPage]: ({ cond }, step = 1) => {
    cond.pageNo += step
  },
  [types.DecreaseCondPage]: ({ cond }, step = 1) => {
    cond.pageNo -= step
    if (cond.pageNo <= 0) {
      cond.pageNo = 1
    }
  }
}

import getters from './getters'
import mutations from './mutations'
import actions from './actions'
export default {
  state: {
    // 列表数据
    list: [],
    // 列表数据的查询条件
    cond: { pageNo: 1, tableName: 'tblOutAttendance' },
    detail: {
      checkRight: false,
      deleteRight: false,
      hasCancel: false,
      hurryTrans: false,
      retCheckRight: false,
      updateRight: false,
      opType: '',
      fieldList: [],
      flowDepict: [],
      values: {}
    }
  },
  getters,
  mutations,
  actions
}

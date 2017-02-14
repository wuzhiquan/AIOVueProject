import getters from './getters'
import mutations from './mutations'
import actions from './actions'
export default {
  state: {
    // 列表数据
    list: [],
    // 列表数据的查询条件
    cond: { pageNo: 1, pageSize: 20, keyword: '', AddressLat: 22.537753, AddressLng: 113.95166 },
    cbMutationName: ''
  },
  getters,
  mutations,
  actions
}

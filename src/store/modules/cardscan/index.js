import getters from './getters'
import mutations from './mutations'
import actions from './actions'
export default {
  state: {
    // 列表数据
    list: [],
    // 列表数据的查询条件
    cond: { pageNo: 1, tableName: 'tblcardscan' },
    // 导入状态的枚举
    statusEnum: {'1': '未转CRM', '2': '已转CRM'}
  },
  getters,
  mutations,
  actions
}

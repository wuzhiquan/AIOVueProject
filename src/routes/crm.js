const CardScanList = r => require(['../views/cardscan/cardscanlist.vue'], r)
const CardScandetail = r => require(['../views/cardscan/cardscandetail.vue'], r)
const CRMClientInfo = r => require(['../views/CRM/CRMClientInfo.vue'], r)
const CRMClientInfoList = r => require(['../views/CRM/CRMClientInfoList.vue'], r)
const CRMClientInfoDetail = r => require(['../views/CRM/CRMClientInfoDetail.vue'], r)
const CRMClientInfoSearch = r => require(['../views/CRM/CRMClientInfoSearch.vue'], r)
const CRMClientInfoAdd = r => require(['../views/CRM/CRMClientInfoAdd.vue'], r)
const CRMClientInfoDetList = r => require(['../views/CRM/CRMClientInfoDetList.vue'], r)
const CRMClientInfoDetDetail = r => require(['../views/CRM/CRMClientInfoDetDetail.vue'], r)
const CRMSaleFollowUpList = r => require(['../views/CRM/CRMSaleFollowUpList.vue'], r)
const CRMClientServiceList = r => require(['../views/CRM/CRMClientServiceList.vue'], r)
const CRMSaleFollowUpDetail = r => require(['../views/CRM/CRMSaleFollowUpDetail.vue'], r)
const CRMClientServiceDetail = r => require(['../views/CRM/CRMClientServiceDetail.vue'], r)
const CRMClientServiceAdd = r => require(['../views/CRM/CRMClientServiceAdd.vue'], r)
const CRMSaleFollowUpAdd = r => require(['../views/CRM/CRMSaleFollowUpAdd.vue'], r)
// 外勤列表
const OutAttendance = r => require(['../views/outAttendance/OutAttendance.vue'], r)
// 外勤签入
const OutAttendancesignin = r => require(['../views/outAttendance/OutAttendancesignin.vue'], r)
// 外勤详情
const OutAttendancedet = r => require(['../views/outAttendance/OutAttendancedet.vue'], r)
// 外勤签入签出选择地址
const MapLocate = r => require(['../views/outAttendance/mapLocate.vue'], r)
export default [
  // 名片扫描列表
  {path: '/cardscan/cardscanlist', component: CardScanList, name: 'cardscanlist'},
  // 名片详情
  {path: '/cardscan/cardscandetail/:keyId/:opType', component: CardScandetail, name: 'cardscandetail'},
  // 客户管理
  {path: '/CRM/CRMClientInfo', component: CRMClientInfo, name: 'CRMClientInfo'},
  // 客户列表
  {path: '/CRM/CRMClientInfoList', component: CRMClientInfoList, name: 'CRMClientInfoList', children: [{path: 'search', component: CRMClientInfoSearch, name: 'CRMClientInfoSearch'}]},
  // 客户详情
  {path: '/CRM/CRMClientInfoDetail/tableName=:tableName/keyId=:keyId/ModuleId=:ModuleId', component: CRMClientInfoDetail, name: 'CRMClientInfoDetail'},
  // 客户添加
  {path: '/CRM/CRMClientInfoAdd', component: CRMClientInfoAdd, name: 'CRMClientInfoAdd'},
  // 客户联系人查询
  {path: '/CRM/CRMClientInfoDetList', component: CRMClientInfoDetList, name: 'CRMClientInfoDetList'},
  // 客户联系人详情
  {path: '/CRM/CRMClientInfoDetDetail', component: CRMClientInfoDetDetail, name: 'CRMClientInfoDetDetail'},
  // 联系记录
  {path: '/CRM/CRMSaleFollowUpList', component: CRMSaleFollowUpList, name: 'CRMSaleFollowUpList'},
  // 联系记录详情
  {path: '/CRM/CRMSaleFollowUpDetail/keyId=:keyId', component: CRMSaleFollowUpDetail, name: 'CRMSaleFollowUpDetail'},
  // 服务记录
  {path: '/CRM/CRMClientServiceList', component: CRMClientServiceList, name: 'CRMClientServiceList'},
  // 服务记录详情
  {path: '/CRM/CRMClientServiceDetail/keyId=:keyId', component: CRMClientServiceDetail, name: 'CRMClientServiceDetail'},
  // 服务记录添加
  {path: '/CRM/CRMClientServiceAdd', component: CRMClientServiceAdd, name: 'CRMClientServiceAdd'},
  // 联系记录添加
  {path: '/CRM/CRMSaleFollowUpAdd', component: CRMSaleFollowUpAdd, name: 'CRMSaleFollowUpAdd'},
  // 外勤列表
  {path: '/outAttendance', component: OutAttendance, name: 'OutAttendance'},
  // 外勤签入
  {path: '/outAttendance/signin', component: OutAttendancesignin, name: 'OutAttendancesignin'},
 // 外勤签出
  {path: '/outAttendance/det/:keyId', component: OutAttendancedet, name: 'OutAttendancedet'},
  // 外勤签入签出选择地址
  {path: '/outAttendance/locate', component: MapLocate, name: 'OutAttendanceLocate'}
]

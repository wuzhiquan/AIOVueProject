import crm from './crm'
import oa from './oa'
import popup from './popup'
const Index = r => require(['../views/index.vue'], r)
const NotFound = r => require(['../views/notfound.vue'], r)
const Login = r => require(['../views/login.vue'], r)
const ContactList = r => require(['../views/contact/ContactList.vue'], r)
const StoreList = r => require(['../views/storeQuery/storeList.vue'], r)
const StoreSearch = r => require(['../views/storeQuery/storeSearch.vue'], r)
// ERP模块的销售订单
const SaleorderInfoList = r => require(['../views/sale/SaleorderInfoList.vue'], r)
const SaleorderInfoSearch = r => require(['../views/sale/SaleorderInfoSearch.vue'], r)
const SaleorderInfoDetail = r => require(['../views/sale/SaleorderInfoDetail.vue'], r)
const SaleorderInfoAdd = r => require(['../views/sale/SaleorderInfoAdd.vue'], r)
// const CustomerINDEX = r => require(['../views/customer/index.vue'], r)
// 页面路由
const routes = [
  {path: '', redirect: {name: 'index'}},
  // 重新打开页面，进行微信登陆
  {
    path: '/mhome.jsp',
    name: 'wxredirect',
    redirect: ({params: {state, target}}) => {
      if (!target) {
        target = `/mobilevue?state=${state}`
      }
      window.open(target, '_self')
    }
  },
  // 首页
  {path: '/index', component: Index, name: 'index'},
  // 登陆页
  {path: '/login', component: Login, name: 'login', meta: {auth: false}},
  // 通讯录
  {path: '/contact/contactList', component: ContactList, name: 'contactList'},
  // 库存查询列表
  {path: '/store/storeList', component: StoreList, name: 'storeList', children: [{path: 'search', component: StoreSearch, name: 'storeSearch'}]},
  // ERP模块的销售订单列表
  {path: '/sale/SaleorderInfoList', component: SaleorderInfoList, name: 'SaleorderInfoList', children: [{path: 'search', component: SaleorderInfoSearch, name: 'SaleorderInfoSearch'}]},
  // ERP模块的销售订单详情
  {path: '/sale/SaleorderInfoDetail/tableName=:tableName/keyId=:keyId/ModuleId=:ModuleId', component: SaleorderInfoDetail, name: 'SaleorderInfoDetail'},
  // ERP模块的销售订单添加
  {path: '/sale/SaleorderInfoAdd/tableName=:tableName/keyId=:keyId', component: SaleorderInfoAdd, name: 'SaleorderInfoAdd'},
  ...crm,
  ...oa,
  ...popup
]
// 404 页
routes.push({path: '*', component: NotFound, name: 'notfound', meta: {auth: false}})

export default routes

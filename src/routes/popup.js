const PopupEmployee = r => require(['../views/popup/Employee.vue'], r)
const popupCompany = r => require(['../views/sale/popupCompany.vue'], r)
const SelectCRMClient = r => require(['../views/popup/SelectCRMClient.vue'], r)
const SelectCRMClientLoc = r => require(['../views/popup/SelectCRMClientLoc.vue'], r)
// 选择多个职员
const Employee = r => require(['../views/outAttendance/employeeSelect.vue'], r)
export default [
  // ERP模块的销售订单客户弹框
  {path: '/sale/popupCompany', component: popupCompany, name: 'popupCompany'},
  // 选择员工
  {path: '/popup/employee', component: PopupEmployee, name: 'popupEmployee'},
  // 选择CRM客户
  {path: '/popup/SelectCRMClient', component: SelectCRMClient, name: 'SelectCRMClient'},
  // 选择CRM客户(带经纬度)
  {path: '/popup/SelectCRMClientLoc', components: {popup: SelectCRMClientLoc}, name: 'SelectCRMClientLoc'},
  // 选择多个员工
  {path: '/popup/employeechoose', components: {popup: Employee}, name: 'Employee'}
]

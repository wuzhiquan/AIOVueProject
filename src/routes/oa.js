const Workflow = r => require(['../views/workflow/workflow.vue'], r)
const Approve = r => require(['../views/workflow/approve.vue'], r)
const Approvedet = r => require(['../views/workflow/approvedet.vue'], r)
const Deliver = r => require(['../views/workflow/deliver.vue'], r)
const Leaveorder = r => require(['../views/workflow/leaveorder.vue'], r)
const Outleave = r => require(['../views/workflow/outleave.vue'], r)
const Expenseaccount = r => require(['../views/workflow/expenseaccount.vue'], r)
const ApproveFlowdepict = r => require(['../views/workflow/approveFlowdepict.vue'], r)
const WorkflowSearch = r => require(['../views/popup/workflowSearch.vue'], r)
export default [
  // 添加审批入口
  {path: '/workflow/add', component: Workflow, name: 'workflow'},
  // 我的工作流
  {path: '/workflow/approve', component: Approve, name: 'approve', children: [{path: 'search', component: WorkflowSearch, name: 'workflowSearch'}]},
  // 审核单据详情
  {
    path: '/workflow/approvedetredirect/:tableName/:keyId',
    name: 'approvedet',
    redirect: ({params: {tableName, keyId}}) => { return { path: `/workflow/approvedet/${tableName}/${keyId}` } }
  },
  // 添加费用报销
  {path: '/workflow/approvedet/tblexpenseaccount/:keyId', component: Expenseaccount, name: 'workflowExpenseaccount'},
  // 添加请假单
  {path: '/workflow/approvedet/FlowNqingjiadan2/:keyId', component: Leaveorder, name: 'workflowLeaveorder'},
  // 添加外出申请单
  {path: '/workflow/approvedet/FlowNwaichushenqingdan2/:keyId', component: Outleave, name: 'workflowOutleave'},
  // 默认详情页
  {path: '/workflow/approvedet/:tableName/:keyId', component: Approvedet, name: 'approvedetDefault'},
  // 显示审核流程
  {path: '/workflow/approveFlowdepict', component: ApproveFlowdepict, name: 'approveFlowdepict'},
  // 添加转交页面
  {path: '/workflow/deliver/tableName=:tableName/keyId=:keyId/opType=:opType', component: Deliver, name: 'deliver'}
]

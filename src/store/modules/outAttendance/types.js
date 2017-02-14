// actions
// 添加前准备数据
export const AddPre = 'crm/outAttendance/addPre'
// 拉取详情
export const Detail = 'crm/outAttendance/detail'
// 添加（签入）
export const Add = 'crm/outAttendance/add'
// 修改（签出）
export const Update = 'crm/outAttendance/update'
// 拉取列表
export const FetchList = 'crm/outAttendance/fetchList'
// 查询该用户未签出的数量，如果大于1，则不准添加
export const CountUnSignout = 'crm/outAttendance/countUnSignout'
// mutaions
// 修改detail的值
export const ChangeDetail = 'crm/outAttendance/changeDetail'
// 修改detail的values值
export const ChangeDetailValues = 'crm/outAttendance/changeDetailValues'
// 签入选中地址回填数据
export const SignInChoseLocCBFill = 'crm/outAttendance/signInChoseLocCBFill'
// 签出选中地址回填数据
export const SignOutChoseLocCBFill = 'crm/outAttendance/signOutChoseLocCBFill'
// 弹窗选择职员后回填数据
export const PopupEmployeeCBFill = 'crm/outAttendance/popupEmployeeCBFill'
// 弹窗选择客户后回填数据
export const PopupClientCBFill = 'crm/outAttendance/popupClientCBFill'
export const AddBeforeList = 'crm/outAttendance/addBeforeList'
export const AddAfterList = 'crm/outAttendance/addAfterList'
export const UpdateToList = 'crm/outAttendance/updateToList'
export const EmptyList = 'crm/outAttendance/emptyList'
export const ResetCond = 'crm/outAttendance/resetCond'
// getters
export const ListKeyIds = 'crm/outAttendance/listKeyIds'
export const IncreaseCondPage = 'crm/outAttendance/increaseCondPage'
export const DecreaseCondPage = 'crm/outAttendance/decreaseCondPage'


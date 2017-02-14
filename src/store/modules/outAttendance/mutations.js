import * as types from './types'
export default {
  // 更改详情
  [types.ChangeDetail]: ({ detail }, newDetail) => {
    for (let [k, v] of Object.entries(newDetail)) {
      detail[k] = v
    }
  },
  // 更改详情的values值
  [types.ChangeDetailValues]: ({ detail: { values } }, newValues) => {
    for (let [k, v] of Object.entries(newValues)) {
      values[k] = v
    }
  },
  // 回填职员数据
  [types.PopupEmployeeCBFill]: ({ detail: { values } }, employees) => {
    let EmployeeID = ''
    let EmpFullName = ''
    employees.forEach(employee => {
      EmployeeID += employee.EmployeeID + ';'
      EmpFullName += employee.tblEmployee_EmpFullName + ' '
    })
    EmployeeID = EmployeeID.slice(0, EmployeeID.length - 1)
    values.EmployeeID = EmployeeID
    values['tblEmployee.EmpFullName'] = EmpFullName
  },
  [types.PopupClientCBFill]: ({ detail: { values } }, client) => {
    values.ClientId = client.ClientId
    values.SignInDistance = client['CRMClientInfo_Distance']
    values['CRMClientInfo.ClientName'] = client['CRMClientInfo_ClientName']
  },
  // 签入选择地址后回填数据
  [types.SignInChoseLocCBFill]: ({ detail: { values } }, {address, lat, lng}) => {
    values.SignInAddress = address
    values.SignInLng = lng
    values.SignInLat = lat
  },
  // 签出选择地址后回填数据
  [types.SignOutChoseLocCBFill]: ({ detail: { values } }, {address, lat, lng}) => {
    values.SignOutAddress = address
    values.SignOutLng = lng
    values.SignOutLat = lat
  },
  [types.AddBeforeList]: ({ list }, attendance) => {
    list.unshift(attendance)
  },
  [types.AddAfterList]: ({ list }, attendance) => {
    list.push(attendance)
  },
  [types.UpdateToList]: ({ list }, {index, attendance}) => {
    for (let key in attendance) {
      list[index][key] = attendance[key]
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
  }
}


import * as types from './types'
import { Indicator, Toast } from 'mint-ui'
import 'mint-ui/lib/indicator/style.css'
import 'mint-ui/lib/toast/style.css'
import {dateformat} from '../../../fmt'
let calDistance = function getdistance (point1, point2) {
  let lng_a = point1.lng
  let lat_a = point1.lat
  let lng_b = point2.lng
  let lat_b = point2.lat
  let pk = 180 / 3.14169
  let a1 = lat_a / pk
  let a2 = lng_a / pk
  let b1 = lat_b / pk
  let b2 = lng_b / pk
  let t1 = Math.cos(a1) * Math.cos(a2) * Math.cos(b1) * Math.cos(b2)
  let t2 = Math.cos(a1) * Math.sin(a2) * Math.cos(b1) * Math.sin(b2)
  let t3 = Math.sin(a1) * Math.sin(b1)
  let tt = Math.acos(t1 + t2 + t3)
  return (6366000 * tt) / 1000
}
export default {
  [types.AddPre]: ({ commit, dispatch }) => {
    dispatch('addPre', {tableName: 'tblOutAttendance'}).then(obj => {
      obj.fieldList.forEach(item => {
        if ((item.fieldType > 3 && item.fieldType !== 6 && item.fieldType !== 13) || item.width === 0 || item.fieldName === item.display) {
          return false
        }
        obj.values[item.fieldName] = item.defaultValue ? item.defaultValue : undefined
      })
      obj.values['keyId'] = undefined
      obj.values['tblEmployee.EmpFullName'] = ''
      obj.values['CRMClientInfo.ClientName'] = ''
      obj.values['createByName'] = ''
      commit(types.ChangeDetail, obj)
    })
  },
  [types.Detail]: ({state: {cond: {tableName}}, commit, dispatch}, keyId) => {
    return new Promise((resolve, reject) => {
      dispatch('detail', {tableName, keyId}).then(obj => {
        obj.fieldList.forEach(item => {
          if ((item.fieldType > 3 && item.fieldType !== 6 && item.fieldType !== 13) || item.width === 0 || item.fieldName === item.display) {
            return false
          }
        })
        commit(types.ChangeDetail, obj)
        resolve()
      })
    })
  },
  [types.FetchList]: function ({ state: {cond, list}, dispatch, getters, commit }) {
    Indicator.open({text: '加载中...', spinnerType: 'snake'})
    return new Promise((resolve, reject) => {
      dispatch('reportQuery', cond).then(({rows}) => {
        Indicator.close()
        rows.forEach(item => {
          if (item.keyId in getters[types.ListKeyIds]) {
            let index = getters[types.ListKeyIds][item.keyId]
            commit(types.UpdateToList, {index, attendance: item})
          } else {
            commit(types.AddAfterList, item)
          }
        })
        resolve()
      }).catch(({message}) => {
        Indicator.close()
        Toast({message, duration: 5000})
      })
    })
  },
  [types.CountUnSignout]: function ({ state: {cond: {tableName}}, dispatch }) {
    return new Promise((resolve, reject) => {
      dispatch('reportQuery', {tableName, pageSize: 1}).then(({rows}) => {
        if (rows.length === 0 || rows[0].UnSignout === '0') {
          resolve()
        } else {
          reject()
        }
      }).catch(({message}) => {
        Indicator.close()
        Toast({message, duration: 5000})
      })
    })
  },
  [types.Add]: function ({ commit, dispatch, state: { cond: {tableName}, detail: {values} } }) {
    return new Promise((resolve, reject) => {
      Indicator.open({
        text: '数据提交中...',
        spinnerType: 'snake'
      })
      let added = Object.assign({}, values)
      added.SignInTime = dateformat()
      added = window.JSON.stringify(added)
      dispatch('add', {tableName, values: added}).then(({keyId}) => {
        Indicator.close()
        Toast({message: '签入成功', duration: 1000})
        values.keyId = keyId
        commit(types.ResetCond, {pageNo: 1})
        commit(types.EmptyList)
        dispatch(types.FetchList)
        resolve(keyId)
      }).catch(({message}) => {
        Indicator.close()
        Toast({message, duration: 1000})
      })
    })
  },
  [types.Update]: function ({ commit, dispatch, state: { cond: {tableName}, detail: {values} } }) {
    return new Promise((resolve, reject) => {
      Indicator.open({
        text: '数据提交中...',
        spinnerType: 'snake'
      })
      let added = Object.assign({}, values)
      added.SignOutTime = dateformat()
      added.Status = '2'
      added.Type += ''
      let point1 = {lat: added.SignInLat, lng: added.SignInLng}
      let point2 = {lat: added.SignOutLat, lng: added.SignOutLng}
      added.SignOutDistance = calDistance(point1, point2)
      added = window.JSON.stringify(added)
      dispatch('update', {tableName, values: added}).then(() => {
        Indicator.close()
        Toast({message: '签出成功', duration: 1000})
        commit(types.ResetCond, {pageNo: 1})
        commit(types.EmptyList)
        dispatch(types.FetchList)
        resolve()
      }).catch(({message}) => {
        Indicator.close()
        Toast({message, duration: 1000})
      })
    })
  }
}

import * as types from './types'
export default {
  [types.SubstituteList]: ({ list }, newEmps) => {
    list.splice(0, list.length)
    newEmps.forEach(emp => {
      emp.checked = false
      list.push(emp)
    })
  },
  [types.ToggleCheckedStatus]: ({ list }, index) => {
    list[index].checked = !(list[index].checked)
  },
  [types.InitCharactersList]: ({ charactersList }) => {
    if (charactersList.length > 0) {
      charactersList.splice(0, charactersList.length)
    }
    for (let i = 0; i < 26; i++) {
      charactersList.push({key: window.String.fromCharCode(i + 65), values: []})
    }
  },
  [types.UpdateCharactersList]: ({ charactersList, list }) => {
    for (let i = 0; i < list.length; i++) {
      let index = list[i].tblEmployee_EmpFullNamePYM.charCodeAt(0) - 97
      if (isNaN(index) || index < 0) {
        continue
      } else {
        list[i].index = i
        charactersList[index].values.push(list[i])
      }
    }
    charactersList.forEach(ch => ch.values.sort((a, b) => a.tblEmployee_EmpFullName.localeCompare(b.tblEmployee_EmpFullName)))
  },
  [types.SetCbMutationName]: (state, newCbMutationName) => {
    state.cbMutationName = newCbMutationName
  }
}


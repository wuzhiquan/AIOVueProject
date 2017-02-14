import * as types from './types'
export default {
  [types.GetCharactersList]: ({charactersList}) => charactersList,
  [types.GetCbMutationName]: ({cbMutationName}) => cbMutationName,
  [types.GetChosenEmp]: ({list}) => list.filter(item => item.checked)
}


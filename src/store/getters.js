// 根级别的 getter
export default {
  // 获取审核流的最后一条记录
  getCurFlowDepictLast: ({ curFlowDepict }) => curFlowDepict.length === 0 ? { workFlowNode: '开始' } : curFlowDepict[curFlowDepict.length - 1],
  // 判断是否是微信
  isWX: ({wxinfo}) => {
    // 由于当前在ios下微信的sdk拍照兼容不是很好，暂时屏蔽
    let checkIOS = !!(window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
    return wxinfo.wxstate && !checkIOS
  },
  // 获取wxstate
  getWXState: ({wxinfo}) => {
    return wxinfo.wxstate
  }
}

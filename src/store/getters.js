export default {
  // 获取购物车中的商品总数
  cartsLen (state) {
    let result = 0
    for (let i = 0; i < state.carts.length; i++) {
      if (state.carts[i].selected) {
        result += state.carts[i].num
      }
    }
    return result
  },
  // 获取购物车中的商品总价
  total (state) {
    let result = 0
    for (let i = 0; i < state.carts.length; i++) {
      if (state.carts[i].selected) {
        result += (state.carts[i].num * state.carts[i].price)
      }
    }
    return result
  },
  // 是否全选
  isAllSelected (state) {
    let isAllSelected = true
    for (let i = 0; i < state.carts.length; i++) {
      if (!state.carts[i].selected) {
        isAllSelected = false
        break
      }
    }
    return isAllSelected
  }
}

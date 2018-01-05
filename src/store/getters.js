export default {
  total (state) {
    let result = 0
    let carts = state.carts
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].checked) {
        result += (carts[i].num * carts[i].product_price)
      }
    }
    return result
  },
  cartsLen (state) {
    let result = 0
    let carts = state.carts
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].checked) {
        result += carts[i].num
      }
    }
    return result
  }
}
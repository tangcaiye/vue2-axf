export default {
  computedCategories: [{ cids: [], products: []}],
  // 用户信息
  user: {
    selectSite: {}
  },
  // 本地购物车
  carts: [],
  // 控制tabBar显示隐藏
  tabBarShow: true,
  // 存储该用户的地址信息
  sites: [],
  // 所选的城市
  selectedCity: '',
  // 所选的地址
  selectedSite: '',
  // 所选的x,
  selectedX: 0,
  // 所选的y,
  selectedY: 0,
  // 购物车按钮的位置
  cartPos: {},
  // 本地的收藏列表
  favors: []
}

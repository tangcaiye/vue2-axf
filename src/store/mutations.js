export default {
  // 设置home首页的bannar数据
  SET_BANNAR (state, data) {
    state.bannar = data
  },
  // 设置classifys(全部分类)
  SET_CLASSIFYS (state, data) {
    state.classifys = data
  },
  // 保存用户信息
  SAVE_USER (state, data) {
    state.userInfo = data
  },
  // 切换所选城市
  CHANGE_CITY (state, data) {
    state.selectCity = data
  },
  // 切换所选地区
  CHAGNE_SITE (state, data) {
    state.selectSite = data
  },
  // 切换location
  CHANGE_LOCATION (state, data) {
    state.location = data
  },
  // 登陆成功后将获取的用户地址列表保存起来
  SAVE_SITES (state, data) {
    state.sites = data
  },
  // 添加地址到地址列表中
  ADD_SITE (state, data) {
    // 将这个地址设置为该用户的所选地址
    state.sites.push(data)
    state.userInfo.selectedSite = data
  },
  // 更改在地址列表中所选的地址
  CHANGE_SELECTED_SITE (state, site) {
    state.userInfo.selectedSite = site
  },
  // 更改地址列表中的地址
  CHANG_SITES (state, site) {
    for (var i = 0; i < state.sites.length; i++) {
      if (state.sites[i].id === Number(site.id)) {
        state.sites[i] = site
        break
      }
    }
  },
  // 向购物车添加
  ADD_PRODUCT_NUM (state, product) {
    state.carts.push(product)
  },
  // 更新购物车中的数据
  UP_CART_NUM (state, product) {
    for (var i = 0; i < state.carts.length; i++) {
      if (state.carts[i].product_id === Number(product.product_id)) {
        state.carts[i].num = product.num
        break
      }
    }
  },
  // 更新购物车中的数据
  DOWN_CART_NUM (state, product) {
    for (var i = 0; i < state.carts.length; i++) {
      if (state.carts[i].product_id === Number(product.product_id)) {
        state.carts[i].num = product.num
        break
      }
    }
  },
  // 从购物车列表中将商品移除
  REMOVE_CART_PROJUCT (state, product) {
    for (var i = 0; i < state.carts.length; i++) {
      if (state.carts[i].product_id === Number(product.product_id)) {
        state.carts.splice(i, 1)
        break
      }
    }
  },
  // 将出数据库中获取的购物车数据保存到vuex中
  SAVE_CARTS (state, carts) {
    state.carts = carts
    // 更新全部分类的数据
    let classifys = state.classifys
    for (let i = 0; i < carts.length; i++) {
      for (let j = 0; j < classifys.length; j++) {
        for (let z = 0; z < classifys[j].products.length; z++) {
          if (Number(carts[i].product_id) === Number(classifys[j].products[z].product_id)) {
            classifys[j].products[z].num = carts[i].num
            break
          }
        }
      }
    }
  },
  CART_ACTIVE_TRUE (state) {
    state.cartActive = true
  },
  CART_ACTIVE_FALSE (state) {
    state.cartActive = false
  },
  // 保存tabBar中cart的位置
  CART_POS (state, pos) {
    state.cartPos = pos
  },
  // 更新商品
  UP_PRODUCT_NUM (state, product) {
    let classifys = state.classifys
    /* eslint no-labels: ["error", { "allowLoop": true }] */
    label:
    for (let i = 0; i < classifys.length; i++) {
      for (let j = 0; j < classifys[i].products.length; j++) {
        if (Number(product.product_id) === Number(classifys[i].products[j].product_id)) {
          classifys[i].products[j].num = product.num
          break label
        }
      }
    }
  },
  DOWN_PROJUCT_NUM (state, product) {
    let classifys = state.classifys
    /* eslint no-labels: ["error", { "allowLoop": true }] */
    label:
    for (let i = 0; i < classifys.length; i++) {
      for (let j = 0; j < classifys[i].products.length; j++) {
        if (Number(product.product_id) === Number(classifys[i].products[j].product_id)) {
          classifys[i].products[j].num = product.num
          break label
        }
      }
    }
  },
  CHANGE_ALL_SELECTED (state, bol) {
    for (var i = 0; i < state.carts.length; i++) {
      state.carts[i].selected = bol
    }
  }
}

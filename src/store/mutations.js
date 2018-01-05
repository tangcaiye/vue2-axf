export default {
  SAVE_COMPUTED_CATEGORIES (state, data) {
    state.computedCategories = data
  },
  // 注册
  LOGIN (state, data) {
    state.user = data
  },
  // 本地购物车没有这个商品的时候的处理
  ADD_CART (state, data) {
    state.carts.push(data)
  },
  // 更新本地购物车商品的数量-增加
  UPDATA_NUM (state, id) {
    for (let i = 0; i < state.carts.length; i++) {
      if (state.carts[i].id === id) {
        state.carts[i].num++
        break
      }
    }
  },
  // 更新本地购物车商品的数量-减少
  SUB_CART (state, id) {
    for (let i = 0; i < state.carts.length; i++) {
      if (state.carts[i].id === id) {
        state.carts[i].num--
        break
      }
    }
  },
  // 从本地购物车中删除商品
  DEL_CART (state, id) {
    for (let i = 0; i < state.carts.length; i++) {
      if (state.carts[i].id === id) {
        state.carts.splice(i, 1)
        break
      }
    }
  },
  // 保存从数据库中获取的购物车数据
  SAVE_CARTS (state, data) {
    // 是将数据库中的购物车数据添加到本地购物车中
    state.carts = data
    // 更新本地的原始数据的num?
    let computedCategories = state.computedCategories
    for (let i = 0; i < computedCategories.length; i++) {
      let products = computedCategories[i].products
      for (let j = 0; j < products.length; j++) {
        for (let z = 0; z < data.length; z++) {
          if (products[j].id === data[z].product_id) {
            products[j].num = data[z].num
            break
          }
        }
      }
    }
  },
  // 重置carts中的数量
  RESET_CARTS (state, product) {
    // 更新本地的原始数据的num
    let computedCategories = state.computedCategories
    label:
    for (let i = 0; i < computedCategories.length; i++) {
      let products = computedCategories[i].products
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === product.product_id) {
          products[j].num = product.num
          break label
        }
      }
    }
  },
  // 更新商品的选中状态
  CHANGE_CHECKED (state, product) {
    let index = state.carts.indexOf(product)
    state.carts[index].checked = !state.carts[index].checked
  },
  // 更改全部按钮的选中状态为false
  CHECKED_ALL_FALSE (state) {
    let carts = state.carts
    for (let i = 0; i < carts.length; i++) {
      carts[i].checked = false
    }
  },
  // 更改全部按钮的选中状态为true
  CHECKED_ALL_TRUE (state) {
    let carts = state.carts
    for (let i = 0; i < carts.length; i++) {
      carts[i].checked = true
    }
  },
  // 将从数据库中读取的地址列表保存到vuex的sites中
  SAVE_SITES (state, data) {
    state.sites = data
  },
  // 更改所选城市
  CHANGE_SELECTED_CITY (state, city) {
    state.selectedCity = city
  },
  SAVE_SELECTED_SITE (state, site) {
    state.selectedSite = site
  },
  SAVE_SELECTED_SITEOBJ (state, siteObj) {
    state.selectedSite = siteObj.name
    state.selectedX = siteObj.location.lng
    state.selectedY = siteObj.location.lat
  },
  // 保存新建的地址对象
  SAVE_SITE (state, siteObj) {
    state.sites.push(siteObj)
  },
  // 更新用户对象(更新用户所选地址)
  UPDATA_USER (state, user) {
    state.user = user
  },
  // 更新地址信息
  UPDATA_SITE (state, siteObj) {
    for (let i = 0; i < state.sites.length; i++) {
      if (state.sites[i].id === Number(siteObj.id)) {
        state.sites[i] = siteObj
      }
    }
  },
  CART_POS (state, cartPos) {
    state.cartPos = cartPos
  },
  // 保存登陆获取收藏列表
  SAVE_FAVORS (state, favors) {
    state.favors = favors
  },
  // 添加收藏对象(带id的)到收藏列表
  ADD_FAVOR (state, favorObj) {
    state.favors.push(favorObj)
  },
  // 删除收藏对象
  SUB_FAVOR (state, index) {
    state.favors.splice(index, 1)
  },
  // 删除收藏列表
  DEL_FAVORS (state, favors) {
    let localFavors = state.favors
    for (let i = 0; i < localFavors.length; i++) {
      for (let j = 0; j < favors.length; j++) {
        if (localFavors[i].id === favors[j].id) {
          localFavors.splice(i, 1)
          // 因为对localFavors执行删除操作会让localFavors的Length重新生成，下标改变.删除对象的下一个(i+1)的下标会变成删除对象的下标(i)，所以需要i--
          i--
          break
        }
      }
    }
  }
}

import http from 'axios'
import api from '@/api'
export default {
  // 对提交的手机号进行处理
  submit ({commit}, userObj) {
    // 验证手机号在数据库是否存在
    return http.get(api.host + '/users?phone=' + userObj.phone)
      .then(res => {
        // 判断这个接口是否返回了数据，如果返回就是存在，没返回就是没有这个手机号
        if (res.data.length > 0) {
          // 提取该用户的购物车数据
          http.get(api.host + '/users/' + res.data[0].id + '/carts')
            .then(res => {
              commit('SAVE_CARTS', res.data)
            })
          // 提取该用户的地址列表
          http.get(api.host + '/users/' + res.data[0].id + '/sites')
            .then(res => {
              commit('SAVE_SITES', res.data)
            })
          // 提取该用户的收藏列表
          http.get(api.host + '/users/' + res.data[0].id + '/favors')
            .then(res => {
              commit('SAVE_FAVORS', res.data)
            })
          // 登陆成功，将用户信息保存到vuex的user状态下
          commit('LOGIN', res.data[0])
          return {"msg": "登陆成功"}
        } else {
          // 注册
          // 追加一个selectSite(所选地址)的属性
          userObj.selectSite = {}
          return http.post(api.host + '/users', userObj)
            .then(res => {
              if (res.data.id > 0) {
                // 注册成功将数据保存到vuex的state中，以备后用
                commit('LOGIN', res.data)
                return { "msg": "注册成功" }
              } else {
                return { "msg": "注册失败" }
              }
            })
        }
      })
  },
  /* 
  * 添加到购物车
  * @param product 商品对象，必须拥有product_id属性
  */
  addCart (store, product) {

    /*if (product.cartBol && product.num > 0) {
      // 更新数量,数量+1
      // 克隆一下本地购物车对应的商品
      let newLocalCartProduct = Object.assign({}, product)
      newLocalCartProduct.num++
      return http.patch(api.host + '/carts/' + newLocalCartProduct.id, {
        num: newLocalCartProduct.num
      })
        .then(res => {
          // 更改成功
          if (res.data.id > 0) {
            // 通知本地购物车更新
            store.commit('UPDATA_NUM', res.data.id)
            return { "msg": "更新数量成功" }
          } else {
            return { "msg": "更新数量失败" }
          }
        })
    }*/
    // 首先验证该商品在本地购物车中是否已经存在
    let localCarts = store.state.carts
    let user = store.state.user
    // 假设不存在，需要添加
    let addBol = true
    for (let i = 0; i < localCarts.length; i++) {
      // id->商品在购物车表中的id
      if (localCarts[i].product_id === product.product_id) {
        // 找到了，存在
        addBol = false
        // 更新数量,数量+1
        // 克隆一下本地购物车对应的商品
        let newLocalCartProduct = Object.assign({}, localCarts[i])
        newLocalCartProduct.num++
        // 更新数据库
        return http.patch(api.host + '/carts/' + newLocalCartProduct.id, {
          num: newLocalCartProduct.num
        })
          .then(res => {
            // 更改成功
            if (res.data.id > 0) {
              // 通知本地购物车更新
              store.commit('UPDATA_NUM', res.data.id)
              return {"msg": "更新数量成功"}
            } else {
              return {"msg": "更新数量失败"}
            }
          })
      }
    }
    if (addBol) {
      // 不存在，需要添加,构造需要添加到购物车中的商品对象
      /* 
        数据结构
        {
          商品在购物中表的 id,
          商品的id product_id,
          用户id user_id,
          商品的数量,
          商品的图片,
          商品的名称,
          商品的价格,
          是否选择
        }
      */
      let productToCartObj = {
        product_id: product.product_id,
        userId: user.id,
        product_img: product.imgs.min,
        product_name: product.name,
        product_price: product.price,
        checked: true,
        num: 1
      }
      // 添加到数据库中的购物车
      return http.post(api.host + '/carts', productToCartObj)
        .then(res => {
          if (res.data.id > 0) {
            // 添加成功
            // 添加到本地购物车中
            store.commit('ADD_CART', res.data)
            return {"msg": "添加成功"}
          } else {
            // 添加失败
            return {"msg": "添加失败"}
          }
        })
    }
  },
  /* 
  * 从购物车中减少数量
  * @param product 商品对象，必须拥有product_id属性
  */
  subCart (store, product) {
    let localCarts = store.state.carts
    // 获取需要更改数量的购物对象
    let cartObj = {}
    // 循环遍历提取该商品对应本地购物车中的商品对象
    for (let i = 0; i < localCarts.length; i++) {
      if (product.product_id === localCarts[i].product_id) {
        cartObj = localCarts[i]
      }
    }
    if (cartObj.num > 1) {
      // 更改-》减少
      let num = cartObj.num
      num--
      // 发请求更新num数值
      return http.patch(api.host + '/carts/' + cartObj.id, {
        num: num
      })
        .then(res => {
          if (res.data.id > 0) {
            // 更新本地购物车
            store.commit('SUB_CART', res.data.id)
            return { "msg": "减少数量成功", "del": 0 }
          } else {
            return { "msg": "减少数量失败" }
          }
        })
    } else {
      // 从本地和数据库中删除该商品
      return http.delete(api.host + '/carts/' + cartObj.id)
        .then(res => {
          // 先从本地购物车删除该商品
          store.commit('DEL_CART', cartObj.id)
          return { "msg": "删除商品成功" , "del": 1 }
        })
    }
  },
  // 更改购物车中商品的选中状态
  changeChecked (store, product) {
    // 更新数据库中的商品的状态
    return http.patch(api.host + '/carts/' + product.id, {
      checked: !product.checked
    })
      .then(res => {
        if (res.data.id > 0) {
          // 更新本地购物车状态
          store.commit('CHANGE_CHECKED', product)
          return {"msg": "切换状态成功"}
        } else {
          return {"msg": "切换状态失败"}
        }
      })
  },
  // 购物车商品勾选状态全部取消
  checkedAllFalse (store) {
    let carts = store.state.carts
    let completeNum = 0
    function promiseCheckedAllFalse () {
      return new Promise(function (resolve, reject) {
        for (let i = 0; i < carts.length; i++) {
          http.patch(api.host + '/carts/' + carts[i].id, {
            checked: false
          })
            .then(res => {
              completeNum++
              // 全部更改完成
              if (completeNum >= carts.length - 1) {
                resolve({"msg": "全部取消成功"})
              }
            })
        }
      })
    }
    return promiseCheckedAllFalse()
      .then(res => {
        // 更新本地购物车
        store.commit('CHECKED_ALL_FALSE')
        return res
      })
  },
  // 购物车商品勾选状态全部选中
  checkedAllTrue (store) {
    let carts = store.state.carts
    let completeNum = 0
    function promiseCheckedAllTrue() {
      return new Promise(function (resolve, reject) {
        for (let i = 0; i < carts.length; i++) {
          http.patch(api.host + '/carts/' + carts[i].id, {
            checked: true
          })
            .then(res => {
              completeNum++
              // 全部更改完成
              if (completeNum >= carts.length - 1) {
                resolve({ "msg": "全部勾选成功" })
              }
            })
        }
      })
    }
    return promiseCheckedAllTrue()
      .then(res => {
        // 更新本地购物车
        store.commit('CHECKED_ALL_TRUE')
        return res
      })
  },
  // 保存地址对象
  saveSite (store, siteObj) {
    // 先将地址对象存储到数据库，并返回在数据库中的id
    return http.post(api.host + '/sites', siteObj)
      .then(res => {
        // 通过判断返回的结果是否包含id来判断是否存储成功
        if (res.data.id > 0) {
          // 更改用户当前所选地址
          http.patch(api.host + '/users/' + store.state.user.id, {
            selectSite: res.data
          })
            .then(res => {
              // 更新本地user对象
              store.commit('UPDATA_USER', res.data)
            })
          // 保存到vuex中
          store.commit('SAVE_SITE', res.data)
          return {'msg': '添加成功'}
        } else {
          return {'msg': '添加失败'}
        }
      })
  },
  // 更改所选的地址
  changeSelectedSite (store, siteObj) {
    
    // 更改用户当前所选地址
    return http.patch(api.host + '/users/' + store.state.user.id, {
      selectSite: siteObj
    })
      .then(res => {
        if (res.data.id > 0){
          // 更新本地的所选地址
          // 更新本地user对象
          store.commit('UPDATA_USER', res.data)
          return { 'msg': '更新所选地址成功' }
        } else {
          return {'msg': '更新所选地址失败'}
        }
      })
  },
  // 更新地址信息
  updataSite (store, siteObj) {
    if (Number(siteObj.id) === Number(store.state.user.selectSite.id)) {
      // 也需要更新用户所选择的地址信息
      store.dispatch('changeSelectedSite', siteObj)
    }
    return http.put(api.host + '/sites/' + siteObj.id, siteObj)
      .then(res => {
        if (res.data.id > 0) {
          // 更新本地地址信息
          store.commit('UPDATA_SITE', res.data)
          return {'msg': '更新地址信息成功'}
        } else {
          return {'msg': '更新地址信息失败'}
        }
      })
  },
  // 添加收藏
  addFavor (store, product) {
    /* 
      {
        用户id，这个收藏的商品是哪个用户的, user_id
        商品的id, product_id
        商品图片，img(小图)
        商品名称，name
        商品的单位，unit
        商品的价格，price
      }
    */
    // 构造收藏对象
    let favorObj = {
      user_id: store.state.user.id,
      product_id: product.id,
      img: product.imgs.min,
      name: product.name,
      unit: product.unit,
      price: product.price
    }
    return http.post(api.host + '/favors', favorObj)
      .then(res => {
        if (res.data.id > 0) {
          // 将数据库返回的带id收藏对象添加到本地收藏列表
          store.commit('ADD_FAVOR', res.data)
          return {'msg': '添加收藏成功'}
        } else {
          return {'msg': '添加收藏失败'}
        }
      })
  },
  // 删除收藏对象
  subFavor (store, productId) {
    // 通过商品id得出商品对应的收藏id
    let favors = store.state.favors
    let favorId = 0
    // 要删除收藏对象的下标
    let favorIndex = 0
    for (let i = 0; i < favors.length; i++) {
      if (favors[i].product_id === productId) {
        favorIndex = i
        favorId = favors[i].id
        break
      }
    }
    return http.delete(api.host + '/favors/' + favorId)
      .then(res => {
        store.commit('SUB_FAVOR', favorIndex)
        return {'msg': '删除收藏成功'}
      })
  },
  // 删除勾选的商品收藏
  delFavors(store, favors) {
    // 因为要执行删除是一个列表，所以使用promise来监听是否完成
    function promiseDelFavors() {
      // 删除列表的数量
      let delNum = 0
      return new Promise(function (resolve, reject) {

        for (let i = 0; i < favors.length; i++) {
          http.delete(api.host + '/favors/' + favors[i].id)
            .then(res => {
              delNum++
              if (delNum >= favors.length) {
                // 全部删除完成
                resolve({'msg': '删除收藏列表成功'})
              }
            })
        }
      })
    }
    return promiseDelFavors()
      .then(res => {
        // 删除本地的收藏列表
        store.commit('DEL_FAVORS', favors)
        return res
      })
  }
}

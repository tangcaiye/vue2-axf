// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
// 引入更新rem的js
import '@/styles/reset.js'
// 引入通用css
import '@/styles/index.less'
// 引入vuex
import store from './store'


// 引入路由
import router from './router'
// 路由拦截器(导航守卫),控制tabBar的显示隐藏
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  let path = to.path
  if (path === '/' || path === '/category' || path === '/cart' || path === '/mine') {
    store.state.tabBarShow = true
  } else {
    store.state.tabBarShow = false
  }
  next()
})

// 引入mintui
import { Swipe, SwipeItem, Indicator, Lazyload, MessageBox } from 'mint-ui'

Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.prototype.loading = Indicator
Vue.prototype.$msg = MessageBox
Vue.use(Lazyload)

// 使用自己写的插件
import addCart from '@/plugin/addCart'
Vue.use(addCart)

// 引入http库
import axios from 'axios'
Vue.prototype.$http = axios

// 引入fastclick
import fastclick from 'fastclick'
// 官方推荐将fastclick绑定到body下，这样在body下的元素都不会有300ms的延迟
fastclick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

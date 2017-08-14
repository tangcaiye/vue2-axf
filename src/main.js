// 引入babel-polyfill解决为Babel 默认只转换新的 JavaScript 语法，而不转换新的 API的问题,不需要引入babel-runtime
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入fastclick-》解决300ms延迟的问题
import fastclick from 'fastclick'
// vuex
import store from './store'
// 引入mint ui
import {Lazyload, CellSwipe, MessageBox} from 'mint-ui'
// 图片懒加载
Vue.use(Lazyload)
// 引入可滑动的单元格，并设置为全局组件
Vue.component(CellSwipe.name, CellSwipe)
// 将MessageBox添加为实例方法
Vue.prototype.$msgbox = MessageBox

// rem初始化
import 'common/reset'

// 引入axios
import axios from 'axios'
Vue.prototype.$http = axios

// 引入通用样式
import 'common/styles/index.less'

// 引入自己编写的插件->loading
import Toast from './plugins/toast/toast'
Vue.use(Toast)
// 引入自己编写的插件->添加到购物车时的动画
import AddCart from './plugins/addCart/addCart'
Vue.use(AddCart)
// 头部进度条插件->用于切换页面时候
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 官方推荐将fastclick绑定到body下，这样在body下的元素都不会有300ms的延迟
fastclick.attach(document.body)
Vue.config.productionTip = false

// 导航钩子控制tabBar的显示隐藏
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/' || to.path === '/category' || to.path === '/cart' || to.path === '/mine') {
    store.state.tabBarShow = true
  } else {
    store.state.tabBarShow = false
  }
  next()
})
router.afterEach((to, from) => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

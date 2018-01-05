<template>
  <div id="app">
    <TabBar v-show="tabBarShow"/>
    <!-- 缓存组件,created只触发一次啦 -->
    <keep-alive>
      <router-view  v-if="!$route.meta.notKeepAlive"></router-view>
    </keep-alive>
    <!-- 设置不缓存的页面 -->
    <router-view v-if="$route.meta.notKeepAlive"></router-view>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar/TabBar'
import api from '@/api'
export default {
  name: 'app',
  created () {
    this.loading.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
    })
    let that = this
    // 异步转同步，需要依赖babel-polyfill
    async function getData () {
      // 获取分类
      let result = await that.$http.get(api.host + '/categories')
      that.categories = result.data
      // 获取所有的商品数据
      let res = await that.$http.get(api.host + '/products')
      that.products = res.data
      // 对数据结构重新组织
      that.computedCategories()
      that.loading.close()
    }
    getData()
  },
  components: {
    TabBar
  },
  methods: {
    computedCategories () {
      let products = this.products
      let categories = this.categories
      for (let i = 0; i < products.length; i++) {
        for (let j = 0; j < categories.length; j++) {
          // 找到商品相对应的分类
          if (categories[j].id === products[i].categoryId) {
            categories[j].products.push(products[i])
          }
        }
      }
      this.$store.commit('SAVE_COMPUTED_CATEGORIES', categories)
    }
  },
  computed: {
    tabBarShow () {
      return this.$store.state.tabBarShow
    }
  }
}
</script>

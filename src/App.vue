<template>
  <div id="app">
    <!-- 设置缓存的页面 -->
    <keep-alive>
      <router-view v-if="!$route.meta.notKeepAlive"></router-view>
    </keep-alive>
    <!-- 设置不缓存的页面 -->
    <router-view v-if="$route.meta.notKeepAlive"></router-view>
    <tab-bar v-if="tabBarShow"></tab-bar>
  </div>
</template>

<script>
import TabBar from 'components/TabBar/TabBar'
export default {
  created () {
    // 初始化操作
    // 首页的bannar数据,
    this.$toast('加载中')
    this.$store.dispatch('setBannar')
      .then(data => {
        if (data.status) {
          // 获取并设置分类数据
          return this.$store.dispatch('setClassifys')
        }
      })
      .then(data => {
        if (data.status) {
          this.$hideToast()
        }
      })
  },
  name: 'app',
  components: {
    TabBar
  },
  computed: {
    tabBarShow () {
      return this.$store.state.tabBarShow
    }
  }
}
</script>

<style>
</style>

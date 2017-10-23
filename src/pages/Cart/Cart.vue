<template>
  <div class="page-cart">
    <header-gray header-title="购物车"></header-gray>
    <cart-has v-if="hasProduct"></cart-has>
    <cart-void v-else></cart-void>
  </div>
</template>
<script type="text/javascript">
import HeaderGray from 'components/Header-gray/Header-gray'
import CartHas from './Cart-has'
import CartVoid from './Cart-void'
export default {
  created () {
    // 通过获取用户信息中是否有数据来判断用户是否登录
    let userInfo = this.$store.state.userInfo
    if (userInfo.phone === undefined) {
      // 跳转到Login页
      this.$router.push('/login')
    } else {
      // 获取购物车商品数量
      let cartsLen = this.$store.getters.cartsLen
      if(cartsLen != 0) {
          this.hasProduct = true
      }
      // 登陆后再判断是否有地址信息-》如果一个都没有，跳转到编辑地址页
      let sites = this.$store.state.sites
      if (!(sites.length > 0)) {
        this.$router.push('/site')
      }
    }
  },
  data () {
    return {
      hasProduct: false
    }
  },
  components: {
    CartHas,
    CartVoid,
    HeaderGary
  },
}
</script>
<style lang="less" scoped>

</style>

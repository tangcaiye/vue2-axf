<template>
  <nav>
    <router-link to="/" class="home">
      <span></span>
      首页
    </router-link>
    <router-link to="/category" class="current" ref="cateEl">
      <span></span>
      闪送超市
    </router-link>
    <router-link to="/cart" class="cart"  ref="cartEl">
      <var v-if="cartsLen > 0" :class="{'active': tabBarActive}">{{cartsLen}}</var>
      <span></span>
      购物车
    </router-link>
    <router-link to="/mine" class="mine">
      <span></span>
      我的
    </router-link>
  </nav>
</template>
<script>
export default {
  data () {
    return {
      tabBarActive: false
    }
  },
  // dom结构创建完成执行
  mounted () {
    // 获取cart标签的位置
    let cartPos = this.$refs.cartEl.$el.getBoundingClientRect()
    this.$store.commit('CART_POS', cartPos)
  },
  // 计算内部不能写异步代码
  computed: {
    cartsLen () {
      return this.$store.getters.cartsLen
    },
    cartPos () {
      return this.$store.state.cartPos
    },
    tabBarShow () {
      return this.$store.state.tabBarShow
    }
  },
  watch: {
    cartsLen () {
      this.tabBarActive = true
      setTimeout(() => {
        this.tabBarActive = false
      }, 300)
    },
    tabBarShow () {
      // 监听tabBarShow的变化,如果为true了的话就获取位置信息
      if (!this.cartPos.width) {
        let cartPos = this.$refs.cartEl.$el.getBoundingClientRect()
        this.$store.commit('CART_POS', cartPos)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../../styles/var.less");
@import url("../../styles/mixin.less");
nav{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 5rem;
  background-color: #fff;
  display: flex;
  a{
    flex: 1;
    height: 4rem;
    padding-top: 1rem;
    text-align: center;
    color: #777;
    position: relative;
    span{
      display: block;
      width: 100%;
      height: 2rem;
      background-size: auto 2rem;
      background-position: center 0;
      margin-bottom: .5rem;
      background-repeat: no-repeat;
    }
  }
}
nav>a.home>span{
  background-image: url("./images/home.png");
}
nav>a.current>span{
  background-image: url("./images/current.png");
}
nav>a.cart>span{
  background-image: url("./images/cart.png");
}
nav>a.mine>span{
  background-image: url("./images/mine.png");
}
@-webkit-keyframes navs{
  0%{
    -webkit-background-size: auto .6rem;
    background-size: auto .6rem;
  }
  20%{
    -webkit-background-size: auto 2.2rem;
    background-size: auto 2.2rem;
  }
  40%{
    -webkit-background-size: auto 1.8rem;
    background-size: auto 1.8rem;
  }
  60%{
    -webkit-background-size: auto 2.06rem;
    background-size: auto 2.06rem;
  }
  80%{
    -webkit-background-size: auto 1.94rem;
    background-size: auto 1.94rem;
  }
  100%{
    -webkit-background-size: auto 2rem;
    background-size: auto 2rem;
  }
}
@keyframes navs{
  0%{
    -webkit-background-size: auto .6rem;
    background-size: auto .6rem;
  }
  20%{
    -webkit-background-size: auto 2.2rem;
    background-size: auto 2.2rem;
  }
  40%{
    -webkit-background-size: auto 1.8rem;
    background-size: auto 1.8rem;
  }
  60%{
    -webkit-background-size: auto 2.06rem;
    background-size: auto 2.06rem;
  }
  80%{
    -webkit-background-size: auto 1.94rem;
    background-size: auto 1.94rem;
  }
  100%{
    -webkit-background-size: auto 2rem;
    background-size: auto 2rem;
  }
}
nav>a.home.router-link-exact-active>span{
  background-image: url("./images/home-active.png");
}
nav>a.current.router-link-exact-active>span{
  background-image: url("./images/current-active.png");
}
nav>a.cart.router-link-exact-active>span{
  background-image: url("./images/cart-active.png");
}
nav>a.mine.router-link-exact-active>span{
  background-image: url("./images/mine-active.png");
}
nav>a.router-link-exact-active>span{
  animation: navs 1s;
}
nav>a.cart>var{
  position: absolute;
  right: 0.8rem;
  top: 0.5rem;
  background-color: #f40;
  color: #fff;
  line-height: 2.3rem;
  height: 2rem;
  width: 2rem;
  text-align: center;
  font-size: 1rem;
  border-radius: 50%;
  .scale(1);
  -webkit-transition: all 0.3s cubic-bezier(0.28,-0.42, 0.37, 1.55);
  -o-transition: all 0.3s cubic-bezier(0.28,-0.42, 0.37, 1.55);
  transition: all 0.3s cubic-bezier(0.28,-0.42, 0.37, 1.55);
}
nav>a.cart>var.active{
  .scale(1.5)
}
</style>


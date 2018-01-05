<template>
  <div class="home">
    <HeaderYellow/>
    <div class="main">
      <!-- bannar轮播图 -->
      <div class="bannar">
        <mt-swipe :auto="4000">
          <mt-swipe-item v-for="(item, index) in bannar" :key="item.id">
            <img v-lazy="item.bannar_img">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <!-- 首页商品列表 -->
      <ul class="acts-category">
        <li class="acts-category-item" v-for="(item, index) in computedCategories" :key="item.id">
          <!-- 列表的标题 -->
          <div class="acts-category-title">
            <span :style="{color: item.color, 'border-color': item.color}">{{item.name}}</span>
            <a href="#/category">更多&gt;</a>
          </div>
          <img class="category-item-banner" :src="item.category_img">
          <ul class="acts-category-item-goodsList">
            <router-link tag="li" v-for="(product, ind) in item.products" :key="product.id" v-if="ind < 3" :to="'/product-item/' + product.id">
              <img v-lazy="product.imgs.min" :ref="'home' + product.id">
              <p class="category-name">{{product.name}}</p>
              <div class="product-specifics">
                <div class="product-specifics-left">
                  <p>{{product.unit}}ml</p>
                  <p>￥{{product.price}}</p>
                </div>
                <!-- 添加到购物车按钮 -->
                <div class="product-specifics-right" @click.stop="addCart(product)">+</div>
              </div>
            </router-link>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import HeaderYellow from '@/components/Header-yellow/Header-yellow'
import api from '@/api'
export default {
  data () {
    return {
      bannar: [],
    }
  },
  created () {
    // 获取bannar
    this.$http.get(api.host + '/bannar')
      .then(res => {
        this.bannar = res.data
      })
  },
  components: {
    HeaderYellow
  },
  computed: {
    computedCategories () {
      return this.$store.state.computedCategories
    },
    // 用户信息对象
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    // 添加到购物车
    addCart (product) {
      // 首先验证是否登陆
      if (this.user.id) {
        // 已经登陆或者注册过了
        // 将商品添加到购物车
        // 追加product_id属性
        product.product_id = product.id
        this.$store.dispatch('addCart', product)
          .then(res => { 
            // this.$msg('提示', res.msg)
            // 获取点击对象所对应图片的位置信息
            let pos = this.$refs['home' + product.id][0].getBoundingClientRect()
            // 获取购物车按钮的位置信息
            let cartPos = this.$store.state.cartPos
            let obj = {
              src: product.imgs.min,
              width: pos.width,
              height: pos.height,
              start: {
                left: pos.left,
                top: pos.top
              },
              end: {
                left: cartPos.left,
                top: cartPos.top
              }
            }
            this.$addCart(obj)
            // 更新或者添加成功了之后让num++
            product.num++
          })
      } else {
        // 没登录
        this.$msg('提示', '未登录,请登录')
          .then(action => {
            this.$router.push('/login')
          })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.bannar{
  height: 14rem;
  img{
    width: 100%;
  }
}
.acts-category-item{
  background-color: #fff;
  padding: 1.4rem 0.9rem;
} 
.acts-category-title{
  overflow: hidden;
}
.acts-category-title>span{
  float: left;
  border-left: 0.8rem solid #eb4084;
  color: #eb4084;
  text-indent: 0.6rem;
  font-size: 1.4rem;
}
.acts-category-title>a{
  float: right;
  color: #a6a6a6;
  font-size: 1.3rem;
}
.category-item-banner{
  width: 100%;
  margin: 0.9rem 0;
}
.acts-category-item-goodsList{
  overflow: hidden;
}
.acts-category-item-goodsList>li{
  width: 31.33333%;
  padding: 1% 1%;
  float: left;
  text-align: center;
  font-size: 1.2rem;
}
.acts-category-item-goodsList>li:nth-child(3n-1){
  width: 33.33333%;
  border-left: 0.1rem solid #e5e5e5;
  border-right: 0.1rem solid #e5e5e5;
  box-sizing: border-box;
}
.acts-category-item-goodsList>li>img{
  width: 7.4rem;
  height: 7.4rem;
}
.product-specifics{
  overflow: hidden;
  margin-top: 2rem;
}
.product-specifics-left{
  float: left;
  text-align: left;
}
.product-specifics-right{
  float: right;
  width: 3rem;
  height: 3rem;
  border: 0.1rem solid #dee0dd;
  border-radius: 50%;
  font-size: 2rem;
  color: #ff3910;
  text-align: center;
  line-height: 3rem;
}
.product-specifics-left>p:nth-child(1){
  color: #acacac;
}
.product-specifics-left>p:nth-child(2){
  color: #e44619;
}
.category-name{
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow: hidden;
  vertical-align: top;
  text-align: -webkit-match-parent;
}
</style>



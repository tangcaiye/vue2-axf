<template>
  <div class="product-item">
    <HeaderGray :headerTitle="productInfo.name" back="true" />
    <div class="main">
      <div class="wraper">
        <div class="product-item-block">
          <div class="mod-banner-wrap-outer">
            <img v-lazy="productInfo.imgs.big" ref="bigImg">
          </div>
          <div class="mod-pub-product">
            <div class="product-title-no-short">
              <p class="product-name">{{productInfo.name}}</p>
            </div>
            <div class="product-shopping">
              <span class="product-price">￥<var>{{productInfo.price}}</var></span>
            </div>
          </div>
        </div>
        <div class="product-properties">
          <div class="title">商品详情</div>
          <div class="property-item">
            <span class="leading-word">品<span class="text-hidden">中中</span>牌</span>
            <span class="content-word">{{productInfo.brand}}</span>
          </div>
          <div class="property-item">
            <span class="leading-word">产品规格</span>
            <span class="content-word">{{productInfo.unit}}g</span>
          </div>
        </div>
      </div>
      <div class="product-properties">
        <div class="title">图文详情</div>
        <p>{{productInfo.details}}</p>
      </div>
      <img width="100%" src="./images/productDetailDefault.jpg" alt="">
    </div>
    <!-- 底部添加商品按钮组 -->
    <div class="pub-footer spline-top">
      <!-- 收藏按钮 -->
      <div class="favor" :class="{'selectd': favorBol}" @click="favor">收藏</div>
      <div class="operates">
        添加商品：
        <div class="product-operates">
          <span class="inner product-operates-sub" @click.stop="subCart()">-</span>
          <span class="product-operates-item">{{productInfo.num}}</span>
          <span class="inner product-operates-add" @click.stop="addCart()">+</span>
        </div>
      </div>
    </div>
    <!-- 购物车按钮 -->
    <div class="cart-btn theme-bg" ref="cartBtn" @click="goCart">
      <div class="cart-btn-num"  :class="{'active': tabBarActive}" v-if="cartsLen>0">{{cartsLen}}</div>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import HeaderGray from '@/components/Header-gray/Header-gray'

// 用于避免在进行对收藏进行添加移除操作的时候重复执行
let favorBol2 = true

export default {
  // 当组件创建成功的时候执行,且执行一次
  activated () {
    favorBol2 = true
    // console.log(this.$route.params.id)
    // 获取商品的id
    let productId = this.$route.params.id
    // 判断用户是否已经登陆，如果已经登陆就从本地商品列表中读取(有数量的)，如果没有登陆就直接走请求获取
    if (this.user.id > 0) {
      // 根据id获取商品信息
      let computedCategories = this.computedCategories
      label:
      for (let i = 0; i < computedCategories.length; i++) {
        let products = computedCategories[i].products
        for (let j = 0; j < products.length; j++) {
          if (products[j].id === Number(productId)) {
            this.productInfo = products[j]
            break label
          }
        }
      }

      // 读取本地收藏列表
      this.favorBol = false
      let favors = this.favors
      for (let i = 0; i < favors.length; i++) {
        if (favors[i].product_id === Number(productId)) {
          // 该商品在收藏列表中存在
          this.favorBol = true
        }
      }
    } else {
      this.$http.get(api.host + '/products/' + productId)
        .then(res => {
          // console.log(res.data)
          this.productInfo = res.data
        })
    }
  },
  components: {
    HeaderGray
  },
  data () {
    return {
      productInfo: {
        imgs: {}
      },
      // 购物车按钮的动画
      tabBarActive: false,
      // 控制收藏按钮的是否选中
      favorBol: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    computedCategories () {
      return this.$store.state.computedCategories
    },
    cartsLen () {
      return this.$store.getters.cartsLen
    },
    favors () {
      return this.$store.state.favors
    }
  },
  watch: {
    cartsLen () {
      this.tabBarActive = true
      setTimeout(() => {
        this.tabBarActive = false
      }, 300)
    }
  },
  methods: {
    // 添加收藏
    favor () {
      if (this.user.id > 0) {
        if (favorBol2) {
          favorBol2 = false
          if (this.favorBol) {
            // 已经收藏-》删除
            this.$store.dispatch('subFavor', this.productInfo.id)
              .then(res => {
                this.favorBol = false
                favorBol2 = true
                this.$msg('提示', res.msg)
              })
          } else {
            // 没收藏-》添加
            this.$store.dispatch('addFavor', this.productInfo)
              .then(res => {
                this.favorBol = true
                favorBol2 = true
                this.$msg('提示', res.msg)
              })
          }
        }
        
      } else {
        this.$msg('提示', '未登录,请登录')
          .then(action => {
            this.$router.push('/login')
          })
      }
    },
    goCart () {
      this.$router.push('/cart')
    },
    // 从购物车中减少该商品的数量
    subCart () {
      let product = this.productInfo
      if (this.user.id) {
        if (product.num > 0) {
          // 追加product_id属性
          product.product_id = product.id
          this.$store.dispatch('subCart', product)
            .then(res => {
              // this.$msg('提示', res.msg)
              product.num--
            })
        }
      } else {
        // 没登录
        this.$msg('提示', '未登录,请登录')
          .then(action => {
            this.$router.push('/login')
          })
      }
    },
    // 添加到购物车
    addCart () {
      let product = this.productInfo
      // 首先验证是否登陆
      if (this.user.id) {
        // 已经登陆或者注册过了
        // 将商品添加到购物车
        // 追加product_id属性
        product.product_id = product.id
        this.$store.dispatch('addCart', product)
          .then(res => { 
            // this.$msg('提示', res.msg)
            // 走动画
            // 获取点击对象所对应图片的位置信息
            let pos = this.$refs.bigImg.getBoundingClientRect()
            // 获取购物车按钮的位置信息
            // let cartPos = this.$store.state.cartPos
            let cartPos = this.$refs.cartBtn.getBoundingClientRect()
            let obj = {
              src: product.imgs.big,
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
@import url("../../styles/var.less");
@import url("../../styles/mixin.less");
.main{
  bottom: 5rem;
}
.wraper{
  background-color: #f8f8f8;
  font-size: 1.4rem;
}
.product-item-block{
  margin-bottom: 0.5rem;
  background-color: #fff;
}
.mod-banner-wrap-outer{
  padding: 1rem;
}
.bannerContainer{
  width: 100%;
}
.product-name{
  padding: 0 1rem;
  color: #292d33;
  font-size: 2.3rem;
  line-height: 3rem;
  text-align: center;
  white-space: normal;
}
.product-shopping{
  padding: 1rem 0 3rem 0;
  text-align: center;
  color: #f40;
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 2.9rem;
  var{
    font-size: 2.2rem;
    font-weight: 700;
  }
}
.product-properties{
  padding: 1.5rem;
}
.title{
  margin-bottom: 1.5rem;
  background: url('./images/title_bg.png') center center no-repeat;
  -webkit-background-size: auto .2rem;
  background-size: auto .2rem;
  text-align: center;
  color: #e0bd6a;
}
.product-properties{
  background-color: #fff;
  margin-bottom: .5rem;
}
.property-item{
  line-height: 3rem;
}
.leading-word{
  width: 4em;
  display: inline-block;
  color: #848c99;
}
.content-word{
  padding-left: 1.5rem;
  color: #333;
}
.product-properties{
  p{
    line-height: 1.5;
    color: #e53333;
    font-size: 14px;
  }
}
.mod-banner-wrap-outer{
  img{
    width: 30rem;
    height: 30rem;
  }
}
.favor{
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: url("./images/favor.png") top center no-repeat;
  width: 4rem;
  line-height: 1.8rem;
  padding-top: 1.8rem;
  background-size: 1.8rem auto;
  font-size: 1rem;
  text-align: center;
}
.favor.selectd{
  background-image: url("./images/favor-select.png");
}
.operates{
  padding-left: 5rem;
  font-size: 1.4rem;
}
.product-operates{
  float: right;
  // width: 70%;
  overflow: hidden;
  position: absolute;
  left: 12rem;
  top: 50%;
  line-height: 0;
  transform: translateY(-50%);
}
.product-operates>.inner{
  display: inline-block;
  font-size: 2.4rem;
  width: 2.9rem;
  height: 2.9rem;
  line-height: 3.4rem;
  color: #d73e00;
  text-align: center;
  /*padding: 0.8rem;*/
  border: 0.1rem solid #dcbd9e;
  border-radius: 50%;
}
.product-operates-item{
  display: inline-block;
  height: 2.9rem;
  line-height: 2.9rem;
  vertical-align: top;
  font-size: 1.6rem;
  margin: 0 0.5rem;
}
.inner.product-operates-sub{
  line-height: 2.8rem;
  font-size: 4.4rem;
}
.inner.product-operates-add{
  font-size: 3rem;
  vertical-align: top;
}
.cart-btn{
  position: absolute;
  width: 5.4rem;
  height: 5.4rem;
  background:@color-background url('./images/cart-btn.png') center center no-repeat;
  background-size: 80%;
  z-index: 3;
  right: .6rem;
  bottom: .7rem;
  border-radius: 50%;
  border: .3rem solid #f7f7f7b2;
}
.cart-btn-num{
  position: absolute;
  right: 0;
  top: 0;
  border-radius: 50%;
  background-color: #f40;
  color: #ffffff;
  line-height: 1.8rem;
  width: 1.8rem;
  text-align: center;
  font-size: 1rem;
  .scale(1);
  -webkit-transition: all 0.3s cubic-bezier(0.28,-0.42, 0.37, 1.55);
  -o-transition: all 0.3s cubic-bezier(0.28,-0.42, 0.37, 1.55);
  transition: all 0.3s cubic-bezier(0.28,-0.42, 0.37, 1.55);
}
.cart-btn-num.active{
  .scale(1.5)
}
</style>



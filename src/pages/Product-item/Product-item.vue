<template>
  <div class="product-item">
    <header-gray :headerTitle="productDetail.title" back="true"></header-gray>
    <div class="main">
      <div class="wraper">
        <div class="product-item-block">
          <div class="mod-banner-wrap-outer">
            <img class="bannerContainer" v-lazy="productDetail.imgs.big">
          </div>
          <div class="mod-pub-product">
            <div class="product-title-no-short">
              <p class="product-name">{{productDetail.title}}</p>
            </div>
            <div class="product-shopping">
              <span class="product-price">￥<var>{{productDetail.price}}</var></span>
            </div>
          </div>
        </div>
        <div class="product-properties">
            <div class="title">商品详情</div>
            <div class="property-item">
              <span class="leading-word">品<span class="text-hidden">中中</span>牌</span>
              <span class="content-word">咪咪</span>
            </div>
            <div class="property-item">
              <span class="leading-word">产品规格</span>
              <span class="content-word">20g</span>
            </div>
          </div>
      </div>
      <div class="product-properties">
        <div class="title">图文详情</div>
        <p>{{productDetail.details}}</p>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import HeaderGray from 'components/Header-gray/Header-gray'
export default {
  created () {
    // 获取商品详情的id
    let id = this.$route.params.id
    this.id = id
  },
  data () {
    return {
      id: 0
    }
  },
  components: {
    HeaderGray
  },
  computed: {
    // 获取商品详情数据
    productDetail () {
      let classifys = this.$store.state.classifys
      // 通过判断classifys的长度来判断classifys是否已经加载过来了
      if (classifys.length > 0) {
        for (let i = 0; i < classifys.length; i++) {
          for (let j = 0; j < classifys[i].products.length; j++) {
            if (Number(classifys[i].products[j].product_id) === Number(this.id)) {
              return classifys[i].products[j]
            }
          }
        }
      } else {
        return {
          imgs: {}
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.main{
  bottom: 0;
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
</style>






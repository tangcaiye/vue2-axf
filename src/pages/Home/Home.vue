<template>
  <div class="home">
    <header-yellow></header-yellow>
    <!-- 主体部分 -->
    <div class="main">
      <div class="bannar">
        <router-link to="/">
          <img v-lazy="bannar.img">
        </router-link>
      </div>
      <ul class="acts-category">
        <li class="acts-category-item" v-for="(item,index) in classifys">
          <div class="acts-category-title">
            <span>{{item.classify_title}}</span>
            <a href="#/category">更多&gt;</a>
          </div>
          <img class="category-item-banner" :src="item.imgs.small">
          <ul class="acts-category-item-goodsList">
            <!-- v-if限制显示的数量 -->
            <router-link tag="li" v-for="(pro,ind) in item.products" :key="pro.product_id" :to="'/product-item/'+pro.product_id" v-if="ind < 3">
              <img v-lazy="pro.imgs.small" :ref="'item'+ind+index">
              <p class="category-name">{{pro.title}}</p>
              <div class="product-specifics">
                <div class="product-specifics-left">
                  <p>{{pro.unit}}ml</p>
                  <p>￥{{pro.price}}</p>
                </div>
                <div class="product-specifics-right" @click="addNum(pro, ind, index)">+</div>
              </div>
            </router-link>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script type="text/javascript">
import HeaderYellow from 'components/Header-yellow/Header-yellow'
export default {
  created () {},
  data () {
    return {}
  },
  components: {
    HeaderYellow
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    // 提取bannar
    bannar () {
      return this.$store.state.bannar
    },
    // 提取全部分类
    classifys () {
      return this.$store.state.classifys
    }
  },
  methods: {
    addNum (item, ind, index) {
      if (this.userInfo.id !== undefined) {
        // 添加到购物车的动画效果
        let pos = this.$refs['item' + ind + index][0].getBoundingClientRect()//这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
        let cartPos = this.$store.state.cartPos
        let obj = {
          src: item.imgs.small,
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
  
        this.$store.dispatch('addNum', item)
          .then((data) => {
            if (data.status) {
              this.$store.dispatch('changeCartActive')
            }
          })
      } else {
        this.$msgbox('提示', '未登录')
          .then(() => {
            this.$router.push('/login')
          })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.bannar{
  width: 100%;
  a{
    display: block;
    img{
      width: 100%;
    }
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
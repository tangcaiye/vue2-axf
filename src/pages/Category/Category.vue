<template>
  <div class="home">
    <HeaderYellow/>
    <div class="main">
      <!-- 分类列表 -->
      <div class="category">
        <ul class="categories">
          <li v-for="(item, index) in computedCategories" :key="item.id" @click="changeCategories(index)">
            <span :class="{'active': activeCategory === index}">{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="productList" @click="hideProductList">
        <div class="product-filter" :class="{'active': allCategories || ranking}">
          <!-- 全部分类和综合排序按钮 -->
          <div class="filter-titles">
            <div @click.stop="changeAllCategories" :class="{'active': allCategories}">
              <span>{{activeCid}}</span><var>&nbsp;</var>
            </div>
            <div @click.stop="changeRanking" :class="{'active': ranking}">
              <span>{{activeRanking}}</span><var>&nbsp;</var>
            </div>
          </div>
          <!-- 显示隐藏的全部分类 -->
          <div class="filter-items" v-show="allCategories">
            <ul>
              <li :class="{'active': activeCid === '全部分类'}" @click="changeCid('全部分类', 'all')">全部分类</li>
              <li v-for="(item, index) in computedCategories[activeCategory].cids" :key="item.cid_id" :class="{'active': activeCid === item.name}" @click="changeCid(item.name, index)">{{item.name}}</li>
            </ul>
          </div>
          <!-- 显示隐藏的综合排序 -->
          <div class="filter-items" v-show="ranking">
            <ul>
              <li v-for="(item, index) in rankingList" :key="item" :class="{'active': activeRanking===item}" @click="changeActiveRanking(item)">{{item}}</li>
            </ul>
          </div>
        </div>
        <ul class="productList-wrap">
          <router-link tag="li" :to="'/product-item/' + item.id" v-for="(item, index) in sortProducts" :key="item.id">
            <dl>
              <dt>
                <img v-lazy="item.imgs.min" :ref="'pro' + item.id">
              </dt>
              <dd class="nowrap product-item-title">
                {{item.name}}
              </dd>
              <dd class="product-specifics-wrap">
                <div class="product-specifics">
                  <span>{{item.unit}}ml</span>
                  <var>￥{{item.price}}</var>
                </div>
                <div class="product-operates">
                  <span class="inner" @click.stop="subCart(item)">-</span>
                  <span class="product-operates-item">{{item.num}}</span>
                  <span class="inner" @click.stop="addCart(item)">+</span>
                </div>
              </dd>
            </dl>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderYellow from '@/components/Header-yellow/Header-yellow'
export default {
  data () {
    return {
      // 激活的大分类, 保存的是分类的下标
      activeCategory: 0,
      // 激活的子分类, 保存的是子分类的名称
      activeCid: '全部分类',
      // 激活的子分类的下标,默认为all为全部分类
      activeCidIndex: 'all',
      // 控制全部分类列表显示隐藏的
      allCategories: false,
      // 综合排序的方式
      rankingList: ['综合排序', '价格最低', '价格最高'],
      // 激活的排序方式
      activeRanking: '综合排序',
      // 控制排序方式列表的显示隐藏
      ranking: false
    }
  },
  components: {
    HeaderYellow
  },
  computed: {
    computedCategories () {
      return this.$store.state.computedCategories
    },
    // 激活的分类商品数据
    activeCategoryProducts () {
      return this.computedCategories[this.activeCategory].products
    },
    // 根据激活的子分类下标返回商品数据
    activeCidProducts () {
      if (this.activeCidIndex === 'all') {
        return this.activeCategoryProducts
      } else {
        let index = this.activeCidIndex
        return this.activeCategoryProducts.filter(item => item.cidsIndex === Number(index))
      }
    },
    // 对显示的商品列表进行排序
    sortProducts () {
      if (this.activeRanking === '综合排序') {
        return this.activeCidProducts
      } else if (this.activeRanking === '价格最低') {
        return this.activeCidProducts.sort((a, b) => a.price - b.price)
      } else {
        return this.activeCidProducts.sort((a, b) => b.price - a.price)
      }
    },
    // 用户信息对象
    user () {
      return this.$store.state.user
    },
    cartPos () {
      return this.$store.state.cartPos
    }
  },
  methods: {
    // 从购物车中减少该商品的数量
    subCart (product) {
      if (this.user.id) {
        if (product.num > 0) {
          // 追加product_id属性
          product.product_id = product.id
          this.$store.dispatch('subCart', product)
            .then(res => {
              this.$msg('提示', res.msg)
              // 让当前商品的数量--
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
            // 走动画
            // 获取点击对象所对应图片的位置信息
            let pos = this.$refs['pro' + product.id][0].getBoundingClientRect()
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
    },
    // 更改激活的分类
    changeCategories (index) {
      this.activeCategory = index
      // 激活的子分类初始化
      this.activeCid = '全部分类'
      // 激活的排序方式初始化
      this.activeRanking = '综合排序'
    },
    // 切换全部分类列表的显示隐藏
    changeAllCategories () {
      this.allCategories = !this.allCategories
      this.ranking = false
    },
    // 切换激活的子分类
    changeCid (name, index) {
      this.activeCid = name
      this.activeCidIndex = index
    },
    // 切换激活的排序方式
    changeActiveRanking (item) {
      this.activeRanking = item
    },
    // 切换排序的显示隐藏
    changeRanking () {
      this.ranking = !this.ranking
      this.allCategories = false
    },
    // 让蒙版隐藏
    hideProductList () {
      this.ranking = false
      this.allCategories = false
    }
  }
}
</script>
<style lang="less" scoped>
.category{
  overflow: scroll;
  position: relative;
  height: 100%;
}
.categories{
  float: left;
  width: 23.4375%;
  font-size: 1.3rem;
}
.categories>li{
  padding: 0.3rem 0;
  text-align: center;
  box-sizing: border-box;
  border-bottom: 0.1rem solid #d9d9d9;
}
.categories>li>span{
  display: block;
  height: 3.4rem;
  line-height: 3.4rem;
  padding-left: 0.6rem;
}
.categories>li>span.active{
  border-left: 0.6rem solid #f0d001;
  padding-left: 0;
}
.productList{
  /*float: right;*/
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 76%;
}
.product-filter{
  display: flex;
  display: -webkit-flex;
  flex-direction:column;
  -webkit-flex-direction:column;
  position: absolute;
  z-index: 2;
  width: 100%;
}
.product-filter.active{
  height: 100%;
}
.filter-titles{
  height: 1.8rem;
  padding: 1.1rem 0;
  background-color: rgba(255,255,255,0.8);
  width: 100%;
  border-bottom: 0.1rem solid #e1dbdd;
}
.filter-titles>div{
  float: left;
  width: 50%;
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: center;
  font-size: 1.2rem;
}
.filter-titles>div:nth-child(1){
  box-sizing:border-box;
  border-right: 0.1rem solid #d5d5d5;
}
.filter-titles>div>var{
  display: inline-block;
  width: 1.3rem;
  height: 1.8rem;
  line-height: 1.8rem;
  background: url("./images/icon-down.png") center center no-repeat;
  -webkit-background-size: 1rem 0.6rem;
  background-size: 1rem 0.6rem;
  -webkit-transition: 0.5s ease;
  -o-transition: 0.5s ease;
  transition: 0.5s ease;
  -webkit-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
}
.filter-titles>div.active>var{
  -webkit-transform: rotate(-180deg);
  -ms-transform: rotate(-180deg);
  -o-transform: rotate(-180deg);
  transform: rotate(-180deg);
}
.filter-items{
  flex:1;
  -webkit-flex:1;
  width: 100%;

  background-color: rgba(0,0,0,0.2);
}
.filter-items>ul{
  overflow: hidden;
  padding-bottom: 1rem;
  background-color: rgba(255,255,255,1);
}
.filter-items>ul>li{
  padding: 0.7rem 0.9rem;
  border: 0.1rem solid #e0e0e0;
  /*border: 0.1rem solid #e6d056;*/
  border-radius: 0.4rem;
  float: left;
  margin: 0.8rem 0 0 0.8rem;
  
}
.filter-items>ul>li.active{
  background-color: #fff9d9;
  border-color: #e6d056;
}
.productList-wrap{
  position: absolute;
  top: 4.1rem;
  bottom: 0;
  width: 100%;
  overflow-y: scroll;
  background-color: #fff;
}
.productList-wrap>li{
  border-bottom: 0.1rem solid #e1dbdd;
  padding: 0.8rem 1rem;
}
.productList-wrap>li>dl{
  overflow: hidden;
}
.productList-wrap>li>dl>dt{
  float: left;
  width: 8rem;
  height: 8rem;
  margin-right: 1rem;
  overflow: hidden;
  text-align: center;
}
.productList-wrap>li>dl>dt>img{
  width: 100%;
}
.productList-wrap>li>dl>dd{
  font-size: 1.2rem;
}
.product-item-title{
  margin-bottom: 2.9rem;
}
.product-specifics-wrap{
  overflow: hidden;
}
.product-specifics{
  float: left;
  width: 30%;
  overflow: hidden;
}
.product-specifics>span{
  display: block;
  color: #858585;
  margin-bottom: 1rem;
}
.product-specifics>var{
  color: #f40;
}
.product-operates{
  float: right;
  width: 70%;
  overflow: hidden;
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
  height: 2.8rem;
  line-height: 2.8rem;
  vertical-align: top;
  font-size: 1.2rem;
  margin: 0 0.5rem;
}
</style>



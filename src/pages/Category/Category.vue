<template>
  <div class="home">
    <header-yellow></header-yellow>
    <div class="main">
      <div class="category">
        <ul class="categories">
          <li v-for="(item,index) in classifys" @click="changeClassifys(item.classify_id)"><span :class="{'active': activeClassifysId === item.classify_id}">{{item.classify_title}}</span></li>
        </ul>
      </div>
      <div class="productList" @click="hideProductList()">
        <div class="product-filter" :class="{'active': ranking||allCategories}">
          <div class="filter-titles">
            <div :class="{'active': allCategories}" @click.stop="changeAllCategories()"><span>全部分类</span><var>&nbsp;</var></div>
            <div :class="{'active': ranking}" @click.stop="changeRanking()"><span>综合排序</span><var>&nbsp;</var></div>
          </div>
          <!-- 全部分类 -->
          <div class="filter-items" v-show="allCategories">
            <ul>
              <li :class="{'active': allCategoriesIndex === 'all'}" @click="changeCids('all')">全部分类</li>
              <li v-for="(item, index) in activeClassifysProduct.cids" :class="{'active': allCategoriesIndex === index}" @click="changeCids(index)">{{item.name}}</li>
            </ul>
          </div>
          <!-- 综合排序 -->
          <div class="filter-items" v-show="ranking">
            <ul>
              <li v-for="(item, index) in rankingList" :class="{'active': activeRankingIndex === index}" @click="changeRankingIndex(index)">{{item}}</li>
            </ul>
          </div>
        </div>
        <ul class="productList-wrap">
          <router-link tag="li" v-for="(item,index) in filterClassifysProduct" :key="item.product_id" :to="'/product-item/'+item.product_id">
            <dl>
              <dt>
                <img v-lazy="item.imgs.small" :ref="'item'+index">
              </dt>
              <dd class="nowrap product-item-title">{{item.title}}</dd>
              <dd class="product-specifics-wrap">
                <div class="product-specifics">
                  <span>{{item.unit}}ml</span>
                  <var>￥{{item.price}}</var>
                </div>
                <div class="product-operates">
                  <span class="inner" @click.stop="subNum(item, index)">-</span>
                  <span class="product-operates-item">{{item.num}}</span>
                  <span class="inner" @click.stop="addNum(item, index)">+</span>
                </div>
              </dd>
            </dl>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import HeaderYellow from 'components/Header-yellow/Header-yellow'
export default {
  created () {
    // 分类数据
  },
  data () {
    return {
      // 激活的分类id
      activeClassifysId: 1,
      // 控制全部分类显示隐藏
      allCategories: false,
      // 激活的分类下标
      allCategoriesIndex: 'all',
      // 控制综合排序显示隐藏
      ranking: false,
      // 默认的排序方式
      rankingList: ['综合排序', '价格最低', '价格最高'],
      // 激活的排序方式
      activeRankingIndex: 0
    }
  },
  components: {
    HeaderYellow
  },
  computed: {
    // 获取用户信息
    userInfo () {
      return this.$store.state.userInfo
    },
    // 获取激活的分类数据
    activeClassifysProduct () {
      // 数据是异步获取的，刚开始可能没有数据，所以判断一下，防止错误
      if (this.classifys.length > 0) {
        return this.classifys.filter(item => Number(item.classify_id) === this.activeClassifysId)[0]
      } else {
        return {}
      }
    },
    // 通过allCategoriesIndex来筛选数据和activeRankingIndex来排序
    filterClassifysProduct () {
      // 升序和降序
      function sortNumberUp (a, b) {
        return a.price - b.price
      }
      function sortNumberDown (a, b) {
        return b.price - a.price
      }
      // 如果还没获取到商品的数据就返回一个空对象
      if (this.activeClassifysProduct.products === undefined) {
        return {}
      }
      // 保存筛选的结果
      var result = []
      // 1.首先过滤
      // 如果allCategoriesIndex不为all才进行过滤
      if (this.allCategoriesIndex === 'all') {
        result = this.activeClassifysProduct.products
      } else {
        // 提取子分类的关键字的下标值
        let keyIndex = this.allCategoriesIndex

        var products = this.activeClassifysProduct.products
        for (var i = 0; i < products.length; i++) {
          // 比较商品的子分类index跟关键字index是否一样
          if (products[i].cids === keyIndex) {
            result.push(products[i])
          }
        }
      }
      // 2.排序
      // 获取排序关键字,根据不同关键字进行对应的排序
      switch (this.activeRankingIndex) {
        case 0:
          // 不排序
          return result
        case 1:
          // 升序
          return result.sort(sortNumberUp)
        case 2:
          // 降序
          return result.sort(sortNumberDown)
      }
    },
    // 从vuex中提取classifys
    classifys () {
      return this.$store.state.classifys
    }
  },
  methods: {
    // 切换全部分类
    changeAllCategories () {
      // 取反
      this.allCategories = !this.allCategories
      // 将综合排序切换为隐藏
      this.ranking = false
    },
    // 切换综合排序列表的显示隐藏
    changeRanking () {
      this.ranking = !this.ranking
      // 将全部分类隐藏
      this.allCategories = false
    },
    // 切换全部分类项的下标
    changeCids (index) {
      this.allCategoriesIndex = index
    },
    // 切换排序的方式下标
    changeRankingIndex (index) {
      this.activeRankingIndex = index
    },
    // 隐藏
    hideProductList () {
      // 隐藏全部分类和综合排序，同时给全部分类和综合排序按钮加了阻止冒泡的修饰符
      this.ranking = false
      this.allCategories = false
    },
    // 切换分类
    changeClassifys (id) {
      // 设置id
      this.activeClassifysId = id
      // 重置
      this.allCategories = false
      this.ranking = false
      this.allCategoriesIndex = 'all'
      this.activeRankingIndex = 0
    },
    // 减少数量
    subNum (item, index) {
      if (this.userInfo.id !== undefined) {
        if (item.num > 0) {
          this.$store.dispatch('downNum', item)
            .then((data) => {
              if (data.status) {
                this.$store.dispatch('changeCartActive')
              }
            })
        }
      } else {
        this.$msgbox('提示', '未登录')
          .then(() => {
            this.$router.push('/login')
          })
      }
    },
    // 增加数量
    addNum (item, index) {
      if (this.userInfo.id !== undefined) {
        // 添加到购物车的动画效果
        let pos = this.$refs['item' + index][0].getBoundingClientRect()
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
.category{
  overflow: hidden;
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
}
.categories>li>span.active{
  border-left: 0.6rem solid #f0d001;
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
<template>
  <div class="favor">
    <header-gray back="true" headerTitle="商品收藏"></header-gray>
    <span class="extend-click header-icon save" @click="edit">{{editBol?'完成':'编辑'}}</span>
    <div class="main" :style="{'bottom': editBol?'4.9rem':'0'}">
      <ul class="products">
        <li class="product-item-wrap" v-for="item in favors" :key="item.id" @click="selectProduct(item)">
          <div v-if="editBol" class="checkbox" :class="{'selected': item.selected}"></div>
          <dl class="product-item">
            <dt class="product-image">
              <img v-lazy="item.img">
            </dt>
            <dd class="product-name">{{item.name}}</dd>
            <dd class="product-promotion">&nbsp;</dd>
            <dd class="product-specifics theme-font-gray">{{item.unit}}g</dd>
            <dd class="product-price-current theme-font">￥{{item.price}}</dd>
          </dl>
        </li>
      </ul>
    </div>
    <div class="footer" v-show="editBol">
      <span class="selectAll" :class="{'selectAll-true':selectAllBol}" @click="changeSelectAll">全选</span>
      <span class="theme-btn" @click="del">删除</span>
    </div>
  </div>
</template>
<script>
import HeaderGray from '@/components/Header-gray/Header-gray'
export default {
  components: {
    HeaderGray
  },
  activated () {
    this.editBol = false
    if (this.user.id > 0) {
      this.getFavors()
    } else {
      this.$msg('提示', '未登录,请登录')
          .then(action => {
            this.$router.push('/login')
          })
    }
  },
  data () {
    return {
      // 控制当前编辑状态
      editBol: false,
      // 收藏列表
      favors: []
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    // 全选按钮的选中状态
    selectAllBol () {
      // 假设全部都是勾选的
      let resultBol = true
      let favors = this.favors
      for (let i = 0; i < favors.length; i++) {
        // 如果出现哪个的selected为false说明假设不成立
        if (!favors[i].selected) {
          resultBol = false
        }
      }
      return resultBol
    }
  },
  methods: {
    // 删除收藏列表
    del () {
      // 获取收藏状态为勾选的商品，然后传到后台进行删除
      let delFavors = this.favors.filter(item => item.selected)
      // 删除列表至少要有一个
      if (delFavors.length > 0) {
        this.$store.dispatch('delFavors', delFavors)
          .then(res => {
            this.$msg('提示', res.msg)
            // 重新获取收藏列表
            this.getFavors()
            // 切换到不可编辑的状态
            this.editBol = false
          })
      }
    },
    // 获取收藏列表
    getFavors () {
      // 因为需要添加选择的状态，这个状态是不需要跟数据库和本地收藏列表同步，只需要获取原始收藏列表就可以，所以获取本地收藏列表保存到组件的data中
      // 防止影响到本地收藏列表所以需要克隆,因为是数组嵌套的对象，所以用深克隆
      let favors = JSON.parse(JSON.stringify(this.$store.state.favors))
      // 为每个收藏对象添加selected属性
      for (let i = 0; i < favors.length; i++) {
        favors[i].selected = false
      }
      this.favors = favors
    },
    // 切换全选状态
    changeSelectAll () {
      // 查看当前的全选状态，如果是勾选的那就全部取消,如果没有勾选，那就全部勾选
      let favors = this.favors
      if (this.selectAllBol) {
        for (let i = 0; i < favors.length; i++) {
          favors[i].selected = false
        }
      } else {
        for (let i = 0; i < favors.length; i++) {
          favors[i].selected = true
        }
      }
    },
    // 切换当前编辑状态是可编辑的还是不可编辑
    edit () {
      this.editBol = !this.editBol
    },
    selectProduct (item) {
      // 判断编辑状态来决定点击的时候是跳转页面还是切换选择
      if (this.editBol) {
        // 切换商品的勾选状态,通过判断对象是否有selected属性来返回bol值
        item.selected = !item.selected
      } else {
        // 跳转到详情页
        this.$router.push('/product-item/' + item.product_id)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("../../styles/var.less");
.footer{
  position: fixed;
  background-color: #fff;
  height: 5rem;
  left: 0;
  right: 0;
  bottom: 0;
  padding-left: 2rem;
}
.products{
  padding-left: 1.4rem;
  background: #fff;
}
.product-item-wrap{
  padding-left: 2rem;
  border-bottom: 1px solid @border-color;
  position: relative;
}
.checkbox{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2rem;
  background: #fff url("./images/checkbox.png") right center no-repeat;
  background-size: 1.8rem 1.8rem;
}
.checkbox.selected{
  background-image: url("./images/checkbox-selectd.png");
}
.product-item{
  padding: 1rem;
  font-size: 1.2rem;
  line-height: 2rem;
  box-sizing: border-box;
}
.product-image{
  float: left;
  margin-right: .5rem;
}
.save{
  position: absolute;
  top: 0;
  right: .6rem;
  text-align: center;
  width: 6rem;
  height: 4.4rem;
  line-height: 4.4rem;
  font-size: 1.4rem;
  z-index: 2;
  color: #777;
}
.selectAll{
  display: inline-block;
  width: 5rem;
  padding-left: 2.5rem;
  font-size: 1.4rem;
  line-height: 5rem;
  -webkit-background-size: 1.8rem 1.8rem;
  background-size: 1.8rem 1.8rem;
  background-repeat: no-repeat;
  background-position: left center;
}
.selectAll-false{
  background-image: url("./images/checkbox.png");
}
.selectAll-true{
  background-image: url('./images/checkbox-selectd.png');
}
</style>


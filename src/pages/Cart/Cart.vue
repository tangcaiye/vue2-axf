<template>
  <div class="page-cart">
    <HeaderGray headerTitle="购物车"/>
    <div class="main" v-show="carts.length>0">
      <table class="receive" width="100%">
        <tr>
          <th width="28%">
            <!-- 两个英文字符等于一个中文字的宽度 -->
            收<span class="text-hidden">a</span>货<span class="text-hidden">a</span>人
          </th>
          <td>{{user.selectSite.linkman}} {{user.selectSite.sex === 0 ? '先生': '女士'}}</td>
          <router-link to="/site" tag="td" width="17%" rowspan="3" class="more extend-click">修改</router-link>
        </tr>
        <tr>
          <th>
            电<span class="text-hidden">中</span><span class="text-hidden">中</span>话
          </th>
          <td>{{user.selectSite.phone}}</td>
        </tr>
        <tr>
          <th>收货地址</th>
          <td>{{user.selectSite.city}} {{user.selectSite.site}} {{user.selectSite.detailSite}}</td>
        </tr>
      </table>
      <div class="cart-groups-wraper">
        <div class="cart-group">
          <div class="group-name">
            <span>闪送超市</span>
            <var>凑单专区</var>
          </div>
          <p class="group-proptext">¥0起送，22:00前满¥30免运费，22:00后满¥50免运费</p>
          <p class='group-receive more spline-top'>
            收货时间&nbsp;&nbsp;<select class="group-receive-select">
              <optgroup label="今天">
                <option value="30分钟送达">30分钟送达</option>
                <option value="15:00-16:00">15:00-16:00</option>
                <option value="16:00-17:00">16:00-17:00</option>
                <option value="17:00-18:00">17:00-18:00</option>
                <option value="18:00-19:00">18:00-19:00</option>
              </optgroup>
              <optgroup label="明天">
                <option value="明天 09:00-10:00">明天 09:00-10:00</option>
                <option value="明天 10:00-11:00">明天 10:00-11:00</option>
                <option value="明天 11:00-12:00">明天 11:00-12:00</option>
                <option value="明天 12:00-13:00">明天 12:00-13:00</option>
              </optgroup>
              <optgroup label="后天">
                <option value="后天 09:00-10:00">后天 09:00-10:00</option>
                <option value="后天 10:00-11:00">后天 10:00-11:00</option>
                <option value="后天 11:00-12:00">后天 11:00-12:00</option>
                <option value="后天 12:00-13:00">明天 12:00-13:00</option>
              </optgroup>
            </select>
            <span class="group-receive-ext">可预订</span>
          </p>
          <div class="group-comment spline-top spline-bottom f14 pl14">
            <span class="group-comment-txt">收货备注&nbsp;&nbsp;</span>
            <div class="group-comment-input-wrap">
              <input type="text" placeholder="可输入100字以内特殊要求内容" class="group-comment-input"/>
            </div>
          </div>
          <table width="100%">
            <router-link tag="tr" class="spline-bottom" v-for="item in carts" :to="'/product-item/' + item.product_id" :key="item.id" v-if="item.num>0">
              <td class="group-item-checkbox" :class="{'active': item.checked}" @click.stop="changeChecked(item)">&nbsp;</td>
              <td class="group-item-img">
                <img v-lazy="item.product_img">
              </td>
              <td class="group-item-detail">
                <div>{{item.product_name}}</div>
                <div class="product-specifics-wrap">
                  <div class="product-specifics">
                    <span>￥{{item.product_price}}</span>
                  </div>
                  <div class="product-operates">
                    <span class="inner" @click.stop="subCart(item)">-</span>
                    <span class="product-operates-item">{{item.num}}</span>
                    <span class="inner" @click.stop="addCart(item)">+</span>
                  </div>
                </div>
              </td>
            </router-link>
          </table>
          <div class="group-footer spline-bottom pl14 f14">
          <span class="selectAll" :class="{'selectAll-true': checkedAll, 'selectAll-false': !checkedAll}" @click="changeCheckedAll">全选</span>
          共：<span class="redfont">￥{{total.toFixed(2)}}</span>
          <span class="group-btn yellowbg">选好了</span>
        </div>
        </div>
      </div>
    </div>
    <!-- 购物车没有商品的时候显示 -->
    <div class="main" v-show="!(carts.length>0)">
      <div class="empty-notice theme-font-gray">
        <div class="notice-icon"></div>
        亲，购物车空空的耶~ <br>
        <router-link tag="span" class="theme-spline" to="/category">去逛逛</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderGray from '@/components/Header-gray/Header-gray'
export default {
  components: {
    HeaderGray
  },
  created () {
    if (!this.user.id) {
      this.$msg('提示', '未登录，请登录')
        .then(action => {
          this.$router.push('/login')
        })
    } else {
      if (!(this.sites.length > 0)) {
        this.$msg('提示', '没有选择地址，请选择地址')
          .then(action => {
            this.$router.push('/site')
          })
      }
    }
  },
  computed: {
    // 本地地址列表
    sites () {
      return this.$store.state.sites
    },
    // 本地购物车
    carts () {
      return this.$store.state.carts
    },
    user () {
      return this.$store.state.user
    },
    // 总价
    total () {
      return this.$store.getters.total
    },
    // 返回全选按钮的bol值
    checkedAll () {
      // 假设都是勾选的
      let checkedAll = true
      for (let i = 0; i < this.carts.length; i++) {
        if (!this.carts[i].checked) {
          checkedAll = false
          break
        }
      }
      return checkedAll
    }
  },
  methods: {
    // 更改购物车全选按钮的状态
    changeCheckedAll () {
      // 通过判断checkedAll的值来决定是执行全部取消还是全部勾选
      if (this.checkedAll) {
        // 全部取消
        this.$store.dispatch('checkedAllFalse') 
          .then(res => {
            this.$msg('提示', res.msg)
          })
      } else {
        // 全部勾选
        this.$store.dispatch('checkedAllTrue')
          .then(res => {
            this.$msg('提示', res.msg)
          })
      }
    },
    // 更改购物车商品的勾选状态
    changeChecked (product) {
      this.$store.dispatch('changeChecked', product)
        .then(res => {
          this.$msg('提示', res.msg)
        })
    },
    addCart (product) {
      // 将商品添加到购物车
      product.cartBol = true
      this.$store.dispatch('addCart', product)
        .then(res => { 
          this.$msg('提示', res.msg)
          // 更新本地商品的数量
          this.$store.commit('RESET_CARTS', product)
        })
    },
    subCart (product) {
      product.cartBol = true
      // 如果subCart内部是删除的操作的话，product也会删除掉，所以需要克隆一下以备份,第二是因为不能直接修改product的num,product是vuex的state。修改需要走mutations.
      let cloneProduct = Object.assign({}, product)
      this.$store.dispatch('subCart', product)
        .then(res => {
          cloneProduct.num--
          this.$store.commit('RESET_CARTS', cloneProduct)
          this.$msg('提示', res.msg)
        })
      
    }
  }
}
</script>
<style lang="less" scoped>
.empty-notice{
  padding-top: 20%;
  text-align: center;
  line-height: 4rem;
  font-size: 1.4rem;
}
.notice-icon{
  width: 8rem;
  height: 8rem;
  border-radius: 4rem;
  background: url('./images/empty_addrlist.png') center center no-repeat;
  background-size: contain;
  margin: 0 auto;
}
.theme-spline{
  border: 1px solid #e0e0e0;
  padding: .4rem 3rem;
  border-radius: .3rem;
}
.page-cart{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 5rem;
}
.main{
  bottom: 0;
}
.receive{
  font-size: 1.4rem;
  font-weight: 400;
  background-image: url("./images/cart-bg.png"),url("./images/cart-bg.png");
  background-position: left top,left bottom;
  background-repeat: repeat-x;
  -webkit-background-size: auto 0.3rem;
  background-size: auto 0.3rem;
  background-color: #fff;
  margin-bottom: 1rem;
}
.receive th{
  padding: .7rem 1rem .7rem 1.5rem;
  text-align: left;
}
.cart-group{
  padding-top: 0.5rem;
  font-size: 1.2rem;
  background-color: #fff;
}
.cart-group .group-name{
  padding-left: 1.4rem;
  overflow: hidden;
  padding-right: 1.2rem;
}
.cart-group .group-name>span{
  float: left;
  color: #999;
}
.cart-group .group-name>var{
  float: right;
  height: 2.4rem;
  line-height: 2.4rem;
  border: 0.1rem solid #ff3800;
  border-radius: 1.2rem;
  width: 7rem;
  text-align: center;
  color: #e64f1a;
}
.cart-group .group-name>span:before{
  content: '';
  display: inline-block;
  width: .4rem;
  height: 1.2rem;
  border-radius: .2rem;
  margin-right: .5rem;
  background-color: #ffd600;
  vertical-align: -0.2rem;
}
.group-proptext{
  color: #999;
  padding-left: 1.4rem;
  height: 2rem;
  line-height: 2rem;
}
.group-receive{
  padding-left: 1.4rem;
  font-size: 1.4rem;
  height: 5rem;
  line-height: 5rem;
}
.group-receive-ext{
  float: right;
}
.group-receive-select{
  color: #e64f1a;
  outline: none;
  border: none;
  font-size: 1.4rem;
  background-color: transparent;
}
.group-comment{
  height: 5rem;
  line-height: 5rem;
  display: -webkit-flex;
  display: flex;
}
.group-comment-txt{
  float: left;
}
.group-comment-input-wrap{
  flex:1;
  padding-right: 2.2rem;
}
.group-comment-input{
  height: 3.2rem;
  border: 1px solid #cecece;
  border-radius: .5rem;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  text-indent: .5rem;
  font-size: 1.4rem;
}
.group-item-checkbox{
  background: url("./images/checkbox.png") center center no-repeat;
  -webkit-background-size: 1.8rem 1.8rem;
  background-size: 1.8rem 1.8rem;
  width: 5rem;
}
.group-item-checkbox.active{
  background-image: url("./images/checkbox-selectd.png");
}
.group-item-img{
  width: 5rem;
}
.group-item-img>img{
  width: 100%;
}
.product-operates{
  text-align: right;
}
.group-item-detail{
  padding-right: 1.2rem;
}
.group-item-detail>div{
  height: 4rem;
  line-height: 4rem;
}
.group-footer{
  height: 5rem;
  line-height: 5rem;
}
.selectAll{
  display: inline-block;
  width: 5rem;
  padding-left: 2.5rem;
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
.group-btn{
  height: 100%;
  float: right;
  width: 10rem;
  text-align: center;
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



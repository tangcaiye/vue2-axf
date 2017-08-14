<template>
  <div class="mine">
    <div class="userinfo theme-bg">
      <div class="user">
        <p class="user-phone">18600805498</p>
        <p class="user-level theme-font">V0</p>
      </div>
    </div>
    <div class="favorite theme-bg">
      <div class="goodsFavorite item">
        <span class="inner">商品收藏</span>
      </div>
      <div class="split"></div>
      <div class="shopFavorite item">
        <span class="inner">商品收藏</span>
      </div>
    </div>
    <div class="mine-content">
      <div class="mine-order">
        <div class="padding spline-bottom more">
          <span class="theme-font-gray fr">
            查看全部订单
          </span>
          我的订单
        </div>
        <ul class="order-types">
          <li class="order-type order-type-11">代付款</li>
          <li class="order-type order-type-12">待收货</li>
          <li class="order-type order-type-13">待评价</li>
          <li class="order-type order-type-14">退款/售后</li>
        </ul>
      </div>
      <div class="block">
        <table width="100%">
          <tr>
            <td width="25%" class="mine-item mine-item-pointsShop">积分商城</td>
            <td width="25%" class="mine-item mine-item-coupon">优惠券</td>
            <td width="25%" class="mine-item mine-item-addrlist">收货地址</td>
            <td width="25%" class="mine-item mine-item-aftersale">客服/反馈</td>
          </tr>
          <tr>
            <td width="25%" class="mine-item mine-item-about">关于我们</td>
          </tr>
        </table>
      </div>
      <div class="block theme-btn-light">
        退出当前账号
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default{
  created () {
    // 通过获取用户信息中是否有数据来判断用户是否登录
    let userInfo = this.$store.state.userInfo
    if (userInfo.phone === undefined) {
      // 跳转到Login页
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
@import url("../../common/styles/variable.less");
@import url("../../common/styles/mixin.less");

.mine{
  font-size: @font-size-medium;
}
.mine-item{
  line-height: 2rem;
  font-size: 1.2rem;
  padding-top: 6rem;
  padding-bottom: 2rem;
  text-align: center;
  border-bottom: 1px solid #EFEFEF;
  background: center 3rem no-repeat;
  -webkit-background-size: 3rem;
  background-size: 3rem;
}
.order-types{
  overflow: hidden;
}
.order-type{
  position: relative;
  float: left;
  width: 25%;
  padding-top: 13%;
  text-align: center;
  line-height: 3rem;
  font-size: 1.2rem;
  background: center 40% no-repeat;
  -webkit-background-size: auto 25%;
  background-size: auto 25%;
}
.order-type-11{
  background-image: url("./images/order-type-11.png");
}
.order-type-12{
  background-image: url("./images/order-type-12.png");
}
.order-type-13{
  background-image: url("./images/order-type-13.png");
}
.order-type-14{
  background-image: url("./images/order-type-14.png");
}
.mine-item-pointsShop{
  background-image: url("./images/mine-item-pointsShop.png");
}
.mine-item-coupon{
  background-image: url("./images/mine-item-coupon.png");
}
.mine-item-addrlist{
  background-image: url("./images/mine-item-addrlist.png");
}
.mine-item-aftersale{
  background-image: url("./images/mine-item-aftersale.png");
}
.mine-item-about{
  background-image: url("./images/mine-item-about.png");
}
.mine-order{
  background-color: #fff;
  font-size: @font-size-medium;
}
.mine-content{
  position: absolute;
  padding-top: 1rem;
  top: 13.5rem;
  left: 0;
  right: 0;
  bottom: 4.9rem;
  background-color: #efefef;
  overflow-y: auto;
  overflow-x: hidden;
}
.split{
  width: 1px;
  height: 60%;
  -ms-align-self: center;
  align-self: center;
  background-color: #fff;
}
.goodsFavorite{
  .inner{
    background: url("./images/favorite.png") left center no-repeat;
    -webkit-background-size: auto 1.8rem;
    background-size: auto 1.8rem;
    padding-left: 3rem;
    line-height: 2rem;
  }
}
.shopFavorite{
  .inner{
    background: url("./images/shop_favorite.png") left center no-repeat;
    -webkit-background-size: auto 1.8rem;
    background-size: auto 1.8rem;
    padding-left: 3rem;
    line-height: 2rem;
  }
}
.favorite{
  display: flex;
  display: -webkit-flex;
  height: 3.5rem;
  /*文本基线对齐(项目的第一行文字的基线对齐)*/
  -ms-align-items: stretch;
  align-items: stretch;
  color: #fff;
  font-size: @font-size-small;
  background-color: #f3c800;
}

.userinfo{
  height: 10rem;
  position: relative;
}
.user{
  height: 6rem;
  padding-left: 9rem;
  padding-top: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  background: url("./images/head_portrait.png") 1.5rem bottom no-repeat;
  -webkit-background-size: auto 6rem;
  background-size: auto 6rem;
  &:after{
    background: url("./images/user_info_bg.png") 0 0 no-repeat;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    content: '';
    position: absolute;
    width: 1.1rem;
    height: 1.9rem;
    top: 50%;
    right: 2rem;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  };
}
.user-phone{
  margin: 0.7rem 0;
  line-height: 1;
}
.user-level{
  background: url("./images/user_level_bg.png") left center no-repeat;
  -webkit-background-size: auto 100%;
  background-size: auto 100%;
  line-height: 2.8rem;
  padding-left: 2.9rem;
  font-size: 1rem;
}





</style>
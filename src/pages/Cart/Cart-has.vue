<template>
      <div class="main">
      <table class="receive" width="100%">
        <tr>
          <th width="28%">
            <!-- 两个英文字符等于一个中文字的宽度 -->
            收<span class="text-hidden">a</span>货<span class="text-hidden">a</span>人
          </th>
          <td>{{userInfo.selectedSite.linkman}}&nbsp;{{userInfo.selectedSite.sex?"女士":"先生"}}</td>
          <td width="17%" rowspan="3" class="more extend-click" @click="goToSitePage()">修改</td>
        </tr>
        <tr>
          <th>
            电<span class="text-hidden">中</span><span class="text-hidden">中</span>话
          </th>
          <td>{{userInfo.selectedSite.phone}}</td>
        </tr>
        <tr>
          <th>收货地址</th>
          <td>{{userInfo.selectedSite.city}}{{userInfo.selectedSite.site}}</td>
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
        <mt-datetime-picker
          ref="picker"
          type="time"
          v-model="pickerValue"
          @confirm="handleConfirm">
        </mt-datetime-picker>
        <div class="group-comment spline-top spline-bottom f14 pl14">
          <span class="group-comment-txt">收货备注&nbsp;&nbsp;</span>
          <div class="group-comment-input-wrap">
            <input type="text" placeholder="可输入100字以内特殊要求内容" class="group-comment-input"/>
          </div>
        </div>
        <table width="100%">
          <tr class="spline-bottom" v-for="(item, index) in carts">
            <td class="group-item-checkbox" :class="{active: item.selec ted}" @click="switchSelect(item)">&nbsp;</td>
            <td class="group-item-img">
              <img v-lazy="item.imgs.small">
            </td>
            <td class="group-item-detail">
              <div>{{item.title}}</div>
              <div class="product-specifics-wrap">
                <div class="product-specifics">
                  <span>￥{{item.price}}</span>
                </div>
                <div class="product-operates">
                  <span class="inner" @click="subNum(item, index)">-</span>
                  <span class="product-operates-item">{{item.num}}</span>
                  <span class="inner" @click="addNum(item, index)">+</span>
                </div>
              </div>
            </td>
          </tr>
        </table>
        <div class="group-footer spline-bottom pl14 f14">
          <!-- <span class="selectAll" ng-class="{true:'selectAll-true',false:'selectAll-false'}[allCheckedBol]" ng-click="changeAllChecked()">全选</span> -->
          <span class="selectAll" :class="{'selectAll-true': isAllSelected, 'selectAll-false': !isAllSelected}" @click="allSelected()">全选</span>
          共：<span class="redfont">￥{{total.toFixed(1)}}</span>
          <span class="group-btn yellowbg">选好了</span>
        </div>
      </div>
      </div>
    </div>
</template>
<script>
export default {
    methods: {
    // 跳转到地址列表页
    goToSitePage () {
      this.$router.push('/site')
    },
    subNum (item) {
      if (item.num > 0) {
        item.cartBol = true
        this.$store.dispatch('downNum', item)
          .then((data) => {
            if (data.status) {
              this.$store.dispatch('changeCartActive')
            }
          })
      }
    },
    addNum (item) {
      item.cartBol = true
      this.$store.dispatch('addNum', item)
        .then((data) => {
          if (data.status) {
            this.$store.dispatch('changeCartActive')
          }
        })
    },
    // 切换元素的选择按钮
    switchSelect (item) {
      this.$store.dispatch('switchSelect', item)
        .then((data) => {
          if (data.status) {
            this.$store.dispatch('changeCartActive')
          }
        })
    },
    // 切换全选
    allSelected () {
      let isAllSelected = this.$store.getters.isAllSelected
      this.$store.dispatch('changeAllSelected', !isAllSelected)
    }
  },
  components: {
    HeaderGray
  },
  computed: {
    userInfo () {
      let userInfo = this.$store.state.userInfo
      if (userInfo.phone === undefined) {
        return {
          selectedSite: {}
        }
      } else {
        return userInfo
      }
    },
    carts () {
      return this.$store.state.carts
    },
    // 总价
    total () {
      return this.$store.getters.total
    },
    // 是否全选
    isAllSelected () {
      return this.$store.getters.isAllSelected
    }
  }
}
</script>
<style  lang="less" scoped>
.page-cart{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
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

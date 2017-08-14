<template>
  <div class="login">
    <header-gray header-title="验证手机" back="true"></header-gray>
    <div class="main">
      <div class="login">
        <div class="pic theme-bg" :class="{'pic-hide': picHide}">
          <p class="pic-word">为了方便您及时查询订单信息，鲜蜂侠需要验证您的手机号为查询帐号</p>
        </div>
        <div class="inputs">
          <div class="phone-padding spline-bottom">
            <input class="phone" type="tel" placeholder="手机号码" v-model="phone" @focus="picHidefocus()" @blur="picHideBlue()">
          </div>
        </div>
        <div class="theme-bg login-submit" @click="login()">确定</div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import HeaderGray from 'components/Header-gray/Header-gray'
// 引入mint-ui的MessageBox消息提示框
import { MessageBox } from 'mint-ui'
var timer = null
export default {
  data () {
    return {
      // 控制显示隐藏
      picHide: false,
      // 手机号的值
      phone: ''
    }
  },
  methods: {
    // 当input聚焦的时候
    picHidefocus () {
      clearTimeout(timer)
      this.picHide = true
    },
    // 失焦的时候触发
    picHideBlue () {
      timer = setTimeout(() => {
        this.picHide = false
      }, 2000)
    },
    /*
      登录,如果数据库中有这个手机号那么就读取数据保存到vuex中，
      如果没有这个手机号就自动注册
    */
    login () {
      let _this = this
      // 获取手机号的值,并进行校验
      let reg = /^1[34578]\d{9}$/
      if (!reg.test(this.phone)) {
        MessageBox({
          title: '错误提示',
          message: '手机号格式填写错误，必须是11位的纯数字'
          // showCancelButton: true
        })
      } else {
        this.$store.dispatch('login', this.phone)
          .then(function (data) {
            MessageBox({
              title: '提示',
              message: data.msg
            })
            .then(function () {
              // 在用户点击确定后判断状态来决定是否要回到首页
              if (data.status) {
                // 成功->跳转到上一个页面
                _this.$router.go(-1)
              }
            })
          })
      }
    }
  },
  components: {
    HeaderGray
  }
}
</script>
<style lang="less" scoped>
.main{
  bottom: 0;
}
.pic{
  height: 6.9rem;
  background-image: url("./images/pic.png");
  background-repeat: no-repeat;
  background-position: 1rem bottom;
  -webkit-background-size: auto 80%;
  background-size: auto 80%;
  position: relative;
  overflow: hidden;
  -webkit-transition: height .4s;
  -o-transition: height .4s;
  transition: height .4s;
}
.pic-word{
  position: absolute;
  top: 1.7rem;
  width: 62%;
  right: 0;
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: #000;
}
.inputs{
  background-color: #fff;
}
.phone-padding{
  padding: 0 1.5rem;
}
.phone{
  font-size: 1.4rem;
  outline: none;
  height: 4rem;
  line-height: 4rem;
  width: 100%;
  border: 0;
}
.login-submit{
  margin: 2rem .6rem;
  height: 4rem;
  line-height: 4rem;
  text-align: center;
  font-size: 1.6rem;
}
.pic-hide{
  height: 0px !important;
}
</style>

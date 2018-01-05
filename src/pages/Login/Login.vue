<template>
  <div class="login">
    <HeaderGray headerTitle="验证手机" back="true" />
    <div class="main">
      <div class="login">
        <div class="pic theme-bg" :class="{'pic-hide': picHide}">
          <p class="pic-word">为了方便您及时查询订单信息，鲜蜂侠需要验证您的手机号为查询帐号</p>
        </div>
        <div class="inputs">
          <div class="phone-padding spline-bottom">
            <input class="phone" v-model="phone" type="tel" placeholder="手机号码" @focus="picHidefocus" @blur="picHideBlue">
          </div>
        </div>
        <div class="theme-bg login-submit" @click="login">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderGray from '@/components/Header-gray/Header-gray'
export default {
  data () {
    return {
      // 控制显示隐藏
      picHide: false,
      phone: ''
    }
  },
  components: {
    HeaderGray
  },
  methods: {
    picHidefocus () {
      this.picHide = true
    },
    picHideBlue () {
      setTimeout(() => {
        this.picHide = false
      }, 1000)
    },
    // 提交按钮
    login () {
      let phone = this.phone
      let reg = /^1[34578]\d{9}$/g
      if (reg.test(phone)) {
        // 验证通过
        let userObj = {
          phone: phone
        }
        let that = this
        async function submitData () {
          let res = await that.$store.dispatch('submit', userObj)
          let action = await that.$msg('提示', res.msg)
          // 登陆成功获取注册成功都会跳转页面到首页
          that.$router.push('/')
        }
        submitData()
      } else {
        this.$msg('提示', '手机号输入错误')
      }
    }
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


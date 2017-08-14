<template>
  <div class="add-site">
    <header-gray headerTitle="添加地址" back="true"></header-gray>
    <span class="extend-click header-icon save" @click="save()">保存</span>
    <div class="main">
      <div class="edit-form whitebg">
        <table class="addr-edit" width="100%">
          <tbody>
            <tr class="spline-top spline-bottom">
              <th>联系人</th>
              <td>
                <input type="text" class="addr-input" placeholder="收货人姓名" v-model="linkman">
              </td>
            </tr>
            <tr class="spline-top">
              <th>&nbsp;</th>
              <td>
                <span @click="sex=0" class="theme-radio" :class="{checked: sex==0}">先生</span>
                <span @click="sex=1" class="theme-radio" :class="{checked: sex==1}">女士</span>
              </td>
            </tr>
            <tr class="spline-top">
              <th>手机号码</th>
              <td>
                <input type="text" placeholder="鲜蜂侠联系您的电话" v-model="phone">
              </td>
            </tr>
            <tr class="spline-top">
              <th>所在城市</th>
              <td class="more">
                <select class="select-city" @change="bindChange()" v-model="city">
                  <option value="">请选择城市</option>
                  <option v-for="(item,index) in citys" :value="item">{{item}}</option>
                </select>
              </td>
            </tr>
            <tr class="spline-top">
              <th>所在地区</th>
              <td class="more">
                <input type="text" placeholder="请选择您的住宅小区、大厦或学校" @click.prevent="selectSite()" :value="site">
              </td>
            </tr>
            <tr class="spline-top">
              <th>详细地址</th>
              <td>
                <input type="text" placeholder="请输入楼号门牌号等详细信息" v-model="detailSite">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import HeaderGray from 'components/Header-gray/Header-gray'
import api from '@/api'
// 弹出框
import { MessageBox } from 'mint-ui'
export default {
  created () {
    // 获取城市列表数据
    let sendUrl = api.host + 'citys'
    this.$http.get(sendUrl)
      .then(data => {
        this.citys = data.data
      })
    this.city = this.$store.state.selectCity
    this.site = this.$store.state.selectSite
  },
  data () {
    return {
      // 城市列表
      citys: [],
      // 所选城市,默认为0
      city: '',
      // 所选地址
      site: '',
      // 所选性别
      sex: 0,
      // 联系人
      linkman: '',
      // 手机号码
      phone: '',
      // 详细地址
      detailSite: ''
    }
  },
  components: {
    HeaderGray
  },
  methods: {
    // 选择地区
    selectSite () {
      if (this.city !== '') {
        this.$router.push('/select-site')
      } else {
        MessageBox({
          title: '提示',
          message: '请先选择城市'
        })
      }
    },
    // 切换地区
    bindChange () {
      // console.log(event.target.value)
      this.$store.commit('CHANGE_CITY', event.target.value)
    },
    // 保存地址
    save () {
      // 构造地址对象
      if (this.linkman && this.phone && this.city && this.site && this.detailSite) {
        let siteObj = {
          linkman: this.linkman,
          sex: this.sex,
          phone: this.phone,
          city: this.city,
          site: this.site,
          detailSite: this.detailSite,
          // 用户id
          userId: this.$store.state.userInfo.id,
          // 当前位置的坐标
          location: this.$store.state.location
        }
        // 添加地址
        this.$store.dispatch('addSite', siteObj)
          .then((data) => {
            MessageBox({
              title: '提示',
              message: data.msg
            })
            // 点击消息之后的提示
            .then(() => {
              if (data.status) {
                // 更改用户所选的地址
                siteObj.id = data.id
                this.$store.dispatch('changeSelectedSite', siteObj)
                this.$router.push('/site')
              }
            })
          })
      } else {
        MessageBox({
          title: '提示',
          message: '内容不能为空'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.main{
  bottom: 0;
  font-size: 1.4rem;
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
}
.select-city{
  width: 90%;
}
.addr-edit{
  th{
    padding: 1rem 0 1rem 1.5rem;
    text-align: left;
    width: 7rem;
    line-height: 2rem;
    font-weight: 400;
  }
  td{
    input{
      width: 90%;
    }
  }
}
</style>

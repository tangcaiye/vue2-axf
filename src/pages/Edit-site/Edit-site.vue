<template>
  <div class="add-site">
    <header-gray headerTitle="修改地址" back="true"></header-gray>
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
// 判断是不是从selectSitePage这个页面过来的
let selectSitePageBol = false
// 弹出框
import { MessageBox } from 'mint-ui'
export default {
  // 进入这个组件的时候触发,不能访问this
  beforeRouteEnter (to, from, next) {
    if (from.path === '/select-site') {
      selectSitePageBol = true
    } else {
      selectSitePageBol = false
    }
    next()
  },
  created () {
    // 获取城市列表数据
    let sendApi = api.host + 'citys'
    this.$http.get(sendApi)
      .then(data => {
        this.citys = data.data
      })
    // this.city = this.$store.state.selectCity
    // this.site = this.$store.state.selectSite
    // 获取要修改的地址对象
    let editId = this.$route.params.id
    let editSiteApi = api.host + 'sites/' + editId
    this.editId = editId
    this.$http.get(editSiteApi)
      .then(data => {
        this.detailSite = data.data.detailSite
        this.sex = data.data.sex
        this.linkman = data.data.linkman
        this.phone = data.data.phone

        // 如果是从selectSitePage页跳转过来的就获取vuex的值,如果是其他页面过来的就获取数据库中的值
        if (selectSitePageBol) {
          // 地址,城市,坐标
          let selectCity = this.$store.state.selectCity
          let selectSite = this.$store.state.selectSite
          let location = this.$store.state.location
          this.city = selectCity
          this.site = selectSite
          this.location = location
        } else {
          this.city = data.data.city
          this.site = data.data.site
          this.location = data.data.location
          // 更新
          this.$store.commit('CHANGE_CITY', this.city)
          this.$store.commit('CHAGNE_SITE', this.site)
          this.$store.commit('CHANGE_LOCATION', this.location)
        }
      })
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
      detailSite: '',
      // 编辑的地址id
      editId: 0
    }
  },
  components: {
    HeaderGray
  },
  methods: {
    // 选择地区
    selectSite () {
      if (this.city !== '') {
        if (this.editId > 0) {
          this.$router.push('/select-site?id=' + this.editId)
        } else {
          MessageBox('没有id值')
        }
      } else {
        MessageBox({
          title: '提示',
          message: '请先选择城市'
        })
      }
    },
    // 切换地区
    bindChange () {
      if (event.target.value !== '') {
        this.$store.commit('CHANGE_CITY', event.target.value)
      }
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
          location: this.$store.state.location,
          // 地址的id
          id: this.editId
        }
        // 修改地址
        this.$store.dispatch('changeSite', siteObj)
          .then(data => {
            MessageBox({
              title: '提示',
              message: data.msg
            })
            // 点击消息之后的提示
            .then(() => {
              if (data.status) {
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

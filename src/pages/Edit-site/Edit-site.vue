<template>
  <div class="add-site">
    <HeaderGray headerTitle="修改地址" back="true"></HeaderGray>
    <span class="extend-click header-icon save" @click="saveSite">保存</span>
    <div class="main">
      <div class="edit-form whitebg">
        <table width="100%" class="addr-edit">
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
                <span @click="sex=0" class="theme-radio" :class="{checked: sex===0}">先生</span>
                <span @click="sex=1" class="theme-radio" :class="{checked: sex===1}">女士</span>
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
                <select class="select-city" v-model="city" @change="bindChange">
                  <option value="">请选择城市</option>
                  <option v-for="(item,index) in citys" :key="index" :value="item.city">{{item.city}}</option>
                </select>
              </td>
            </tr>
            <!-- 点击跳转到地图页面 -->
            <tr class="spline-top">
              <th>所在地区</th>
              <td class="more">
                <input type="text" placeholder="请选择您的住宅小区、大厦或学校" @click.prevent="selectSite" :value="selectedSite">
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
<script>
import api from '@/api'
import HeaderGray from '@/components/Header-gray/Header-gray'
// 用于判断上一个是不是选择地址页
let selectSiteBol = false
export default {
  components: {
    HeaderGray
  },
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    if (from.path === '/select-site') {
      selectSiteBol = true
    } else {
      selectSiteBol = false
    }
    next()
  },
  // 因为城市列表都是一样的，所以只需要提取一次,所以使用created
  created () {
    if (!(this.user.id > 0)) {
      this.$msg('提示', '未登录，请登录')
        .then(action => {
          this.$router.push('/login')
        })
    }
    // 读取城市列表
    this.$http.get(api.host + '/citys')
      .then(res => {
        this.citys = res.data
        // 获取传过来的id,并通过id填充内容
        let siteId = this.$route.params.id
        let sites = this.sites
        for (let i = 0; i < sites.length; i++) {
          if (sites[i].id === Number(siteId)) {
            this.$store.commit('CHANGE_SELECTED_CITY', this.city)
            break
          }
        }
      })
  },
  // 组件激活的
  activated () {
    console.log(this.$route)
    let sites = this.sites
    // 获取传过来的id,并通过id填充内容
    let siteId = this.$route.params.id
    for (let i = 0; i < sites.length; i++) {
      if (sites[i].id === Number(siteId)) {
        this.linkman = sites[i].linkman
        this.sex = sites[i].sex
        this.phone = sites[i].phone
        this.detailSite = sites[i].detailSite
        this.$store.commit('CHANGE_SELECTED_CITY', sites[i].city)
        this.city = sites[i].city
        // this.$store.commit('SAVE_SELECTED_SITE', sites[i].site)
        if (!selectSiteBol) {
          this.$store.commit('SAVE_SELECTED_SITEOBJ', {
            name: sites[i].site,
            location: {
              lng: sites[i].x,
              lat: sites[i].y
            }
          })
        }
      }
    }
  },
  data () {
    return {
      linkman: '',
      sex: '',
      phone: '',
      // 当前所选的城市
      city: '',
      citys: [],
      // 所在的地区
      // site: '',
      // 详细地址
      detailSite: ''
    }
  },
  methods: {
    saveSite () {
      // 判断是否有用户id(是否登陆)
      if (this.user.id) {
        if (this.linkman !== '' && this.detailSite !== '' && this.sex !== '' && this.selectedCity !== '' && this.selectedSite !== '') {
          // 创建地址对象
          let siteObj = {
            linkman: this.linkman,
            // 性别：0先生，1女士
            sex: this.sex,
            phone: this.phone,
            city: this.selectedCity,
            site: this.selectedSite,
            detailSite: this.detailSite,
            userId: this.user.id,
            x: this.selectedX,
            y: this.selectedY,
            id: this.$route.params.id
          }
          // 将地址对象添加到数据库和vuex中
          this.$store.dispatch('updataSite', siteObj)
            .then(res => {
              return this.$msg('提示', res.msg)
            })
            .then(action => {
              // 跳转到地址列表页(/site)
              this.$router.push('/site')
            })
        } else {
          this.$msg('提示', '内容不能为空')
        }
      } else {
        // 没有用户id
        this.$msg('提示', '未登录，请登录')
          .then(action => {
            this.$router.push('/login')
          })
      }
    },
    selectSite () {
      // 判断是否选择了城市
      if (this.selectedCity !== '') {
        // 跳转到地图页(选择位置)(百度地图页)
        this.$router.push('/select-site')
      } else {
        this.$msg('提示', '请先选择城市')
      }
    },
    bindChange () {
      // 更新所选城市
      this.$store.commit('CHANGE_SELECTED_CITY', event.target.value)
      // 重置所选地址
      this.$store.commit('SAVE_SELECTED_SITE', '')
    }
  },
  computed: {
    selectedCity () {
      return this.$store.state.selectedCity
    },
    selectedSite () {
      return this.$store.state.selectedSite
    },
    user () {
      return this.$store.state.user
    },
    selectedX () {
      return this.$store.state.selectedX
    },
    selectedY () {
      return this.$store.state.selectedY
    },
    sites () {
      return this.$store.state.sites
    }
  },
  // 组件停用时触发
  deactivated () {
    this.linkman = ''
    this.phone = ''
    this.detailSite = ''
    this.sex = ''
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



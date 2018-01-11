<template>
  <div class="select-site">
    <HeaderGray back="true">
      <input type="search" class="title-form" placeholder="请输入地址" maxlength="10" v-model="searchKey" @input="bindsearch">
    </HeaderGray>
    <div class="main">
      <!--百度地图容器-->
      <div style="width:100%;height:21rem;border:#ccc solid 1px;font-size:12px" id="map"></div>
      <!-- 候选地址列表 -->
      <div class="pois-list">
        <ul>
          <li class="spline-bottom" v-for="(item, index) in results" :key="item.uid" @click="addSite(item)">
            <p class="pois-item-name">{{item.name}}</p>
            <p class="theme-font-gray">{{item.address}}</p>
          </li>
        </ul>
      </div>
      <div class="sug-list" v-show="searchResults.length > 0">
        <ul>
          <li class="spline-bottom" v-for="item in searchResults" :key="item.street_id" @click="addSite(item)">
            <p class="pois-item-name">{{item.name}}</p>
            <p class="theme-font-gray">{{item.address}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
/* 
http://api.map.baidu.com/place/v2/search?query=ATM机&region=北京&output=json&ak=您的ak //GET请求
*/
import api from '@/api'
import _ from 'underscore'
import jsonp from 'jsonp'
import HeaderGray from '@/components/Header-gray/Header-gray'
let ak = 'VM1vQhGjq8KwvOPgI5WSM3NWPCaLNksa'
export default {
  components: {
    HeaderGray
  },
  data () {
    return {
      citys: [],
      x: 0,
      y: 0,
      // 关键字
      key: '',
      // 搜索的城市列表
      results: [],
      // 搜索输入框返回的地址列表
      searchResults: [],
      // 搜索的关键字
      searchKey: ''
    }
  },
  // 应该在dom结构创建完成后执行初始化地图的操作
  mounted () {
    let that = this
    if (this.selectedCity === '') {
      this.$msg('提示', '您没有选择城市')
        .then(action => {
          this.$router.push('/add-site')
        })
    } else {
      // 已经选择了城市,就要判断是否选择了地址
      if (this.selectedSite === '') {
        // 没有地址,就用该城市对应的默认地址
        // 读取城市列表
        this.$http.get(api.host + '/citys')
          .then(res => {
            this.citys = res.data
            // console.log(this.citys, this.selectedCity)
            for (let i = 0; i < this.citys.length; i++) {
              if (this.citys[i].city === this.selectedCity) {
                this.key = this.citys[i].name
                this.x = this.citys[i].x
                this.y = this.citys[i].y
              }
            }
            // 初始化地图
            initBMap()
            // 初始化候选地址列表
            initSiteList()
          })
      } else {
        // 有地址
        this.key = this.selectedSite
        this.x = this.selectedX
        this.y = this.selectedY
        
        // 初始化候选地址列表
        initSiteList()
        // 初始化地图
        initBMap()
      }
    }
    // 初始化候选地址列表
    function initSiteList () {
      let bMapApi = `http://api.map.baidu.com/place/v2/search?query=${that.key}&region=${that.selectedCity}&output=json&ak=${ak}`
      jsonp(bMapApi, (err, data) => {
        if (err) {
          console.log(err)
        } else {
          that.results = data.results
        }
      })
    }
    //创建和初始化地图函数：
    function initBMap() {
      function initMap() {
        createMap();//创建地图
        setMapEvent();//设置地图事件
        addMapControl();//向地图添加控件
        addMapOverlay();//向地图添加覆盖物
      }
      function createMap() {
        map = new BMap.Map("map");
        map.centerAndZoom(new BMap.Point(that.x, that.y), 15);
      }
      function setMapEvent() {
        map.enableScrollWheelZoom();
        map.enableKeyboard();
        map.enableDragging();
        map.enableDoubleClickZoom()
      }
      function addClickHandler(target, window) {
        target.addEventListener("click", function () {
          target.openInfoWindow(window);
        });
      }
      function addMapOverlay() {
        var markers = [
          { content: "", title: "灵芝地铁站", imageOffset: { width: -46, height: -21 }, position: { lat: that.y, lng: that.x } }
        ];
        for (var index = 0; index < markers.length; index++) {
          var point = new BMap.Point(markers[index].position.lng, markers[index].position.lat);
          var marker = new BMap.Marker(point, {
            icon: new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png", new BMap.Size(20, 25), {
              imageOffset: new BMap.Size(markers[index].imageOffset.width, markers[index].imageOffset.height)
            })
          });
          var label = new BMap.Label(markers[index].title, { offset: new BMap.Size(25, 5) });
          var opts = {
            width: 200,
            title: markers[index].title,
            enableMessage: false
          };
          var infoWindow = new BMap.InfoWindow(markers[index].content, opts);
          // marker.setLabel(label);
          addClickHandler(marker, infoWindow);
          map.addOverlay(marker);
        };
      }
      //向地图添加控件
      function addMapControl() {
        var navControl = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: 3 });
        map.addControl(navControl);
      }
      var map;
      initMap()
    }
  },
  methods: {
    // 点击候选列表选择地址
    addSite (siteObj) {
      // 存储到vuex的selectedSite
      console.log(siteObj)
      this.$store.commit('SAVE_SELECTED_SITEOBJ', siteObj)
      // 切换到上一个页面
      // this.$router.push('/add-site')
      this.$router.go(-1)
    },
    bindsearch: _.debounce(function (e) {
      var input = e.target.value
      // 发请求获取搜索关键字的地址列表
      // 限制请求的频率,每隔300ms发一次
      // 拼接接口
      let bMapApi = `http://api.map.baidu.com/place/v2/search?query=${input}&region=${this.selectedCity}&output=json&ak=${ak}`
      console.log(bMapApi)
      // 发请求
      jsonp(bMapApi, (err, data) => {
        if (err) {
          console.log(err)
        } else {
          this.searchResults = data.results
        }
      })
    }, 300)
  },
  computed: {
    // 所选择的城市
    selectedCity () {
      return this.$store.state.selectedCity
    },
    // 所选的地址
    selectedSite () {
      return this.$store.state.selectedSite
    },
    // 所选的经纬度
    selectedX () {
      return this.$store.state.selectedX
    },
    selectedY () {
      return this.$store.state.selectedY
    }
  }
}
</script>
<style lang="less" scoped>
.title-form{
  border: 1px solid #e0e0e0;
  border-radius: .3rem;
  height: 2.6rem;
  line-height: 2.6rem;
  padding-left: 2.4rem;
  background: url('./images/search.png') .6rem center no-repeat;
  -webkit-background-size: 1.3rem;
  background-size: 1.3rem;
  text-align: left;
}
.pois-list{
  position: absolute;
  top: 21rem;
  bottom: 0;
  left: 0;
  right: 0;
  padding-left: 1.5rem;
  background-color: #fff;
  overflow-y: scroll;
  li{
    cursor: pointer;
    padding: .5rem 0;
    font-size: 1.4rem;
    .pois-item-name{
      line-height: 3rem; 
    }
    &:first-child{
        .pois-item-name{
          color:#f40;
          padding-left: 1.6rem;
          background: url("./images/pois.png") left center no-repeat;
          -webkit-background-size: auto 60%;
          background-size: auto 60%;
        }
      }
  }
}
.sug-list{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding-left: 1.5rem;
  background-color: #fff;
  overflow-y: scroll;
  li{
    cursor: pointer;
    padding: .5rem 0;
    font-size: 1.4rem;
    .pois-item-name{
      line-height: 3rem; 
    }
  }
}
</style>



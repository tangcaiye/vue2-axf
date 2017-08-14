<template>
  <div class="select-site">
    <header-gray back="true">
      <input type="search" class="title-form" placeholder="请输入地址" maxlength="10" @input="bindsearch()">
    </header-gray>
    <!--百度地图容器-->
    <div style="width:100%;height:21rem;border:#ccc solid 1px;font-size:12px" id="map"></div>
    <!-- 候选地址列表 -->
    <div class="pois-list">
      <ul>
        <li class="spline-bottom" v-for="(item, index) in places" @click="changeSite(item)">
          <p class="pois-item-name">{{item.name}}</p>
          <p class="theme-font-gray">{{item.address}}</p>
        </li>
      </ul>
    </div>
    <!-- 根据搜索框内容变化而生成的列表 -->
    <div class="sug-list" v-if="searchPlaces.length>0">
      <ul>
        <li class="spline-bottom" v-for="(item, index) in searchPlaces" @click="changeSite(item)">
          <p class="pois-item-name">{{item.name}}</p>
          <p class="theme-font-gray">{{item.address}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script type="text/javascript">
import HeaderGray from 'components/Header-gray/Header-gray'
import jsonp from 'jsonp'
export default {
  created () {
    let _this = this
    // 初始化百度地图
    /* eslint-disable*/
    function initBMap () {
      //创建和初始化地图函数：
      function initMap(){
        createMap();//创建地图
        setMapEvent();//设置地图事件
        addMapControl();//向地图添加控件
        addMapOverlay();//向地图添加覆盖物
      }
      function createMap(){ 
        map = new BMap.Map("map"); 
        map.centerAndZoom(new BMap.Point(_this.location.lng, _this.location.lat),18);
      }
      function setMapEvent(){
        map.enableScrollWheelZoom();
        map.enableKeyboard();
        map.enableDragging();
        map.enableDoubleClickZoom()
      }
      function addClickHandler(target,window){
        target.addEventListener("click",function(){
          target.openInfoWindow(window);
        });
      }
      function addMapOverlay(){
        var markers = [
          {content:"sss",title:"ss",imageOffset: {width:-46,height:-21},position:{lat:_this.location.lat,lng:_this.location.lng}}
        ];
        for(var index = 0; index < markers.length; index++ ){
          var point = new BMap.Point(markers[index].position.lng,markers[index].position.lat);
          var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://api.map.baidu.com/lbsapi/createmap/images/icon.png",new BMap.Size(20,25),{
            imageOffset: new BMap.Size(markers[index].imageOffset.width,markers[index].imageOffset.height)
          })});
          map.addOverlay(marker);
        };
      }
      //向地图添加控件
      function addMapControl(){
        var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
        map.addControl(navControl);
      }
      var map;
        initMap();
    }
    /* eslint-disable*/
    // 获取选择的城市和地区
    this.city = this.$store.state.selectCity
    this.site = this.$store.state.selectSite
    this.location = this.$store.state.location
    if (this.site === '') {
      // 默认值
      this.city = '深圳市'
      this.site = '裕安居'
      this.location = {
        lat: 22.584674,
        lng: 113.913995
      }
    }
    // 拼接路径并发请求获取关键字对应的地址列表
    // 百度地图文档地址：http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-placeapi
    let placeApi = `http://api.map.baidu.com/place/v2/search?q=${this.site}&region=${this.city}&output=json&ak=${this.ak}`
    jsonp(placeApi, (err, data) => {
      if (!err) {
        // 地址列表
        this.places = data.results
        initBMap()
      }
    })
    // 根据所选的城市和地区返回经纬度-》这种方式返回的数据很少
    /*
    api:http://api.map.baidu.com/geocoder/v2/?callback=renderOption&output=json&address=百度大厦&city=北京市&ak=您的ak
    文档地址:http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding
     */
    /*let geocoderApi = `http://api.map.baidu.com/geocoder/v2/?output=json&address=${this.site}&city=${this.city}&ak=${this.ak}`
    console.log(geocoderApi)
    jsonp(geocoderApi, (err, data) => {
      if (!err) {
        this.location = data.result.location
        initBMap()
      }
    })*/
  },
  data () {
    return {
      city: '',
      site: '',
      places: [],
      location: {
        // 纬度
        lat: 0,
        // 经度
        lng: 0
      },
      searchPlaces: [],
      ak: 'vNl46fKP7bXXcmrmasZkasEt'
    }
  },
  components: {
    HeaderGray
  },
  methods: {
    // 根据输入的内容返回地址列表
    bindsearch () {
      // 拼接百度搜索api
      this.city = this.$store.state.selectCity
      let placeApi = `http://api.map.baidu.com/place/v2/search?q=${event.target.value}&region=${this.city}&output=json&ak=${this.ak}`
      jsonp(placeApi, (err, data) => {
        if (!err) {
          this.searchPlaces = data.results
        }
      })
    },
    // 更改选择的地址
    changeSite (item) {
      // 更改选择的地址
      this.$store.commit('CHAGNE_SITE', item.name)
      this.$store.commit('CHANGE_CITY', this.city)
      this.$store.commit('CHANGE_LOCATION', item.location) 
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less">
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
  top: 25.5rem;
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
  top: 4.5rem;
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

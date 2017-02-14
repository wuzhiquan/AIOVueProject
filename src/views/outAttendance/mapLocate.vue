<template>
  <div class="page_wrap mapLocate">
    <mt-header title="选择地址">
      <div slot="left">
        <mt-button icon="back" @click="$router.go(-1)">返回</mt-button>
      </div>
      <mt-button slot="right" v-show="choseIndex != -1" @click="submit">确定</mt-button>
    </mt-header>
    <div class="mapWrapper">
      <el-amap  :zoom="zoom" :map-manager="amapManager" :plugin="plugins" :center="center">
        <el-amap-marker v-for="marker in markers" :position="marker.position" :content="marker.content" :offset="marker.offset" :zIndex="marker.zIndex" :visible="marker.visible">
        </el-amap-marker>
      </el-amap>
    </div>
    <div class="locateNote">300米范围之内</div>
    <div class="addressWrapper">
      <ul v-infinite-scroll="loadMore" 
          infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <li v-for="(poi, index) in pois" class="poi" @click="chosePoi(index)">
            <p class="poiName">{{ poi.name }}</p>
            <p class="poiAddress">{{ poi.address }}</p>
            <span :class="{radio: true, active: index === choseIndex}"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import * as types from '../../store/modules/locate/types'
  import { mapGetters } from 'vuex'
  import Vue from 'vue'
  import AMap from 'vue-amap'
  import { Header, Button, InfiniteScroll } from 'mint-ui'
  import 'mint-ui/lib/header/style.css'
  import 'mint-ui/lib/button/style.css'
  let locPic = require('../../assets/CRM/outAttendance/loc.png')
  let positionPic = require('../../assets/CRM/outAttendance/position2.png')
  Vue.use(AMap)
  AMap.initAMapApiLoader({
    key: '122de17c47f148d2ecb229fa74d62d99',
    plugin: ['Geolocation', 'ToolBar', 'PlaceSearch']
  })
  let vm
  let placeSearch
  let amapManager = new AMap.AMapManager()
  Object.entries = x =>
    Object.keys(x).reduce((y, z) =>
        y.push([z, x[z]]) && y, [])
  export default {
    name: 'outAttendancedet',
    components: {
      'mt-header': Header,
      'mt-button': Button
    },
    directives: {
      'infinite-scroll': InfiniteScroll
    },
    data () {
      return {
        loading: false,
        zoom: 16,
        amapManager: amapManager,
        markers: [
          {
            position: [113.951669, 22.537753],
            offset: [-11, -11],
            content: `<img src="${locPic}" style="width:23px;">`,
            visible: false,
            zIndex: 100
          },
          {
            position: [113.951669, 22.537753],
            offset: [-31, -60],
            content: `<img src="${positionPic}" style="width:62px;">`,
            visible: false,
            zIndex: 101
          }
        ],
        // 选中的poi的索引
        choseIndex: -1,
        pois: [],
        plugins: [
          {
            pName: 'Geolocation',
            enableHighAccuracy: true,
            timeout: 10000,
            zoomToAccuracy: true,
            buttonPosition: 'RB',
            showCircle: false,
            showMarker: false,
            events: {
              init (instance) {
                instance.getCurrentPosition()
              },
              complete: (data) => {
                let {province, city, district} = data.addressComponent
                let addressPrefix = province + city + district
                vm.markers[0].position[0] = data.position.lng
                vm.markers[0].position[1] = data.position.lat
                vm.markers[0].visible = true
                let center = new window.AMap.LngLat(data.position.lng, data.position.lat)
                placeSearch.searchNearBy('', center, 300,
                  (status, rs) => {
                    if (status === 'complete') {
                      vm.pois.splice(0, vm.pois.length)
                      rs.poiList.pois.forEach(poi => {
                        poi.address = addressPrefix + poi.address
                        vm.pois.push(poi)
                      })
                      if (rs.poiList.pois.length > 0) {
                        vm.chosePoi(0)
                      }
                    }
                  }
                )
              },
              error () {
                window.console.log(arguments)
              }
            }
          },
          {
            pName: 'ToolBar',
            position: 'LB'
          },
          {
            pName: 'PlaceSearch',
            pageSize: 50,
            type: '公司企业|政府机构及社会团体|科教文化服务|生活服务|商务住宅',
            events: {
              init (instance) {
                placeSearch = instance
              }
            }
          }
        ]
      }
    },
    computed: {
      center () {
        return this.markers[0].position
      },
      ...mapGetters([types.GetCbMutationName])
    },
    methods: {
      loadMore () {
      },
      chosePoi (index) {
        index = window.parseInt(index)
        this.choseIndex = index
        vm.markers[1].position.splice(0, vm.markers[1].position.length)
        vm.markers[1].position.push(vm.pois[index].location.lng)
        vm.markers[1].position.push(vm.pois[index].location.lat)
        vm.markers[1].visible = true
      },
      submit () {
        var {name, address, location: {lat, lng}} = this.pois[this.choseIndex]
        this.$store.commit(this[types.GetCbMutationName], {name, address, lat, lng})
        this.$router.go(-1)
      }
    },
    created () {
      vm = this
    }
  }
</script>
<style type="text/css">
  .mapLocate .mint-header-title {
    font-size: 16px;
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  $border-color: #e8e8e8;
  $color: #C8C8CD;
  $primary-color: #40A9E5;
  .page_wrap {
    width: 100%;
    height: 100%;
    background: white;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    overflow: hidden;
    flex-flow: column;
    .mint-header {
      color:#333;
      background-color:#fff;
      border-bottom:1px #dedede solid;
    }
    .mapWrapper {
      height: 45%;
    }
    .locateNote {
      padding: 5px;
      height: 8px;
      line-height: 8px;
      font-size: 10px;
      color: $color;
      text-align: center;
    }
    .addressWrapper {
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      flex: 1;
      margin: 0 10px;
      overflow: scroll;
      ul {
        list-style: none outside none;
      }
    }
    .poi {
      border-bottom: 1px #dedede solid;
      padding: 10px 20px 10px 0;
      position: relative;
      .poiName, .poiAddress {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-bottom: 5px;
      }
      .poiAddress {
        color: #b1b7bb;
        font-size: smaller;
        font-size: 12px;
      }
      .radio {
        position: absolute;
        right: 0;
        top: 30%;
        width: 20px;
        height: 20px;
        &:after {
          border: 2px solid transparent;
          border-left: 0;
          border-top: 0;
          content: " ";
          top: 3px;
          left: 6px;
          position: absolute;
          width: 6px;
          height: 14px;
          -webkit-transform: rotate(45deg) scale(1);
          transform: rotate(45deg) scale(1);
          -webkit-transition: -webkit-transform .2s;
          transition: -webkit-transform .2s;
          transition: transform .2s;
          transition: transform .2s,-webkit-transform .2s;
        } 
        &.active:after {
          border-color: #2c94ff;
        }
      }
    }
  }
</style>

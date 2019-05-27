
<template>
  <div class="map-page" :style="'padding-top:'+headHeight+'rpx'">  
    <head-back title="添加位置" @goBack="goBack" v-if="indexPage==2"></head-back>
    <div class="info-content"> 
        <map
        id="myMap"
        :style="'height:100%;width:100%;position:fixed;top:0rpx;left:0;right:0;bottom:0;'"
        :longitude="form.longitude" :latitude="form.latitude"
        scale='16'
        show-location 
        :subkey="mapKey"  
        @regionchange="bindcontroltap"  @begin="bindcontroltap"  @end="bindcontroltap"
        v-if="indexPage==1"> 
          <cover-view class="cover-head clear-both" :style="'height:'+headHeight+'rpx;padding-top:'+headPadding+'rpx;'"  @click="goBack" >
            <cover-image src="/static/image/map-back.png" class="img float-left"></cover-image> 
            <cover-view class="pad-left float-left">
                添加位置</cover-view>
          </cover-view>  
          <cover-view class="cover-box" :style="'top:'+headHeight+'rpx;'" @click="openSearch">
            <cover-view class="cover-input">
              <cover-image src="/static/image/map-search.png" class="map-search"></cover-image> 
              <cover-view class="text">
                搜索位置</cover-view>
            </cover-view >
          </cover-view >
          <cover-image src="/static/image/markers.png" class="markers-cover"></cover-image> 
          <!--详细地址-->
          <cover-view class="cover-content" @click="addLocation" v-if="form.latitude&&form.longitude">
            <cover-view class="content-main"  >
              <cover-view class="icon-box">
                <cover-image src="/static/image/Fill.png" class="icon"></cover-image> 
              </cover-view>
              <cover-view class="main-text">
                <cover-view class="title-name">{{form.city}}</cover-view> 
                <cover-view class="address">{{form.address}}</cover-view> 
              </cover-view> 
              <cover-view class="right-box">
                <cover-image src="/static/image/Fill-right.png" class="icon"></cover-image> 
              </cover-view>
            </cover-view> 
            <cover-image class="arrow-bottom" src="/static/image/map-bottom-icon.png" ></cover-image> 
          </cover-view> 

        </map> 
        <div v-if="indexPage==2" class="search-content"   :style="'height:'+searchSchoolHeight+'rpx;width: 100%;'">
          <div class="header-search" :style="'top:'+headHeight+'rpx'">
            <search-input @search="searchKeyword" placeholder="输入地址名称"></search-input>  
          </div>
          <div class="search-list" >
            <div class="item" v-for="(item,index) in searchSiteArr" :class="{'item-active':selectActive==index}" :key="item" @click="selectItme(item,index)">
              <i-icon  type="coordinates_fill" size="28" color="#4A90E2" class="icon"/> 
              <div class="site-content">
                <div class="title-site">{{item.title}}</div>
                <div class="detail-site">{{item.address}}</div>
              </div> 
            </div> 
          </div> 
          <div class="text-center more-search" v-if="!searchSiteArr||searchSiteArr.length==0">暂无数据,换个关键词试一试</div> 
        </div> 
    </div>
 
  </div>
</template>

<script>
import * as api from '@/utils/api' ;  
import headBack from '@/components/head-back.vue' ;     
import searchInput from '@/components/search-input';
import {mapKey} from '@/utils/config.js';
import QQMapWX from '@/utils/qqmap-wx-jssdk.min';
import userStore from './../../common/index/store';
let qqmapsdk;
const app = getApp()  
export default { 
  onLoad(){ 
    let vm = this;   
    app.aldstat.sendEvent('添加位置'); // 事件名称规范: 不超过255个字符 
    this.searchSchoolHeight=parseInt(wx.getStorageSync('systemInfo').windowHeight)*2-this.headHeight; 
    qqmapsdk = new QQMapWX({
        key: vm.mapKey
    });
    this.indexPage=1;
    if(userStore.state.location.latitude&&userStore.state.location.longitude){
      this.form.latitude=userStore.state.location.latitude;
      this.form.longitude=userStore.state.location.longitude;
    }else{
      this.getLocation();
    }
    this.getAddress({latitude:this.form.latitude,longitude:this.form.longitude}); 
  },
  onShow: function () {   
    
  }, 
  components:{
    headBack,
    searchInput
  }, 
  data () {
    return {   
      mapKey:mapKey,
      indexPage:1,
      searchSchoolHeight:0,
      headHeight:wx.getStorageSync('headHeight'),
      headPadding:wx.getStorageSync('headPadding'),  
      searchSiteArr:[],
       
      form:{
        latitude: 30.654648,
        longitude: 104.065699, 
        address:'',
        city:'',
        district:'',
        nation:'',
        province:'',
      }, 
      selectActive:-1,
    }
  },  
 
  methods: {   
    goBack(){ 
      if(this.indexPage==2){
        this.indexPage=1;
      }else{
        wx.navigateBack({ delta: 1 });  
      } 
    },  
    //授权地址
    getLocation(){ 
      let vm = this; 
      wx.getLocation({
        type: 'wgs84',
        success (res) {  
          console.log(res);
          userStore.state.location=res; 
          this.form.latitude=res.latitude;
          this.form.longitude=res.longitude;
        },
        fail(res){ 
        }
      }); 
    },
    addLocation(){
      let vm = this;
      let body={
        lat:vm.form.latitude,
        lng:vm.form.longitude,
        address:vm.form.address,
        city:vm.form.city
      }
      api.addLocation(body).then(res=>{
        if(res.data.code==300000){
          vm.goBack();
        }
      })
    },
    checkSetting(){
      let vm = this;
      wx.getSetting({
        success (res) {
          if(res.authSetting["scope.userLocation"]){
            //  return true
          }else{ 
            wx.openSetting({
              success (res) { 
                if(!res.authSetting["scope.userLocation"]){ 
                  wx.showModal({
                    title: '用户未授权',
                    content: '如需正常添加地址，请开启地理位置授权服务',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) { 
                        // vm.checkSetting();
                      }
                    }
                  }) 
                }else{
                  // return true
                } 
              } 
            }) 
          }
        }
      })
    },
    openSearch(){
      this.indexPage=2;
      this.selectActive=-1;
      this.searchSiteArr=[];
    },
    searchKeyword(val){
      let vm = this;   
      this.checkSetting()
      api.getSiteDeatil({
        keyword: val,
        region:"",
        region_fix:1, 
        key:vm.mapKey
      }).then(res=>{ 
        if(res.data.status==0) vm.searchSiteArr=res.data.data;
      }).catch(err=>{
         vm.searchSiteArr=[];
      })
      // qqmapsdk.search({
      //   keyword: val,
      //   boundary:region('北京',1),
      //   page_size: 40,
      //   success: function (res) {
      //     console.log(res);
      //     if(res.status==0) vm.searchSiteArr=res.data;
      //   },
      //   fail: function (res) {
      //       vm.searchSiteArr=[];
      //   }, 
      // });
    },
    selectItme(item,index){ 
      let vm = this; 
      vm.selectActive=index; 
      let itemArr={
        latitude:item.location.lat,
        longitude:item.location.lng
      }; 
      vm.getAddress(itemArr);
      setTimeout(()=>{
        vm.indexPage=1;
      },300);
    },
    getAddress(res){ 
      let vm = this; 
      // 调用接口
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function (a) { 
          console.log(a);
          let result=a.result;
          vm.form={
            latitude:result.location.lat,
            longitude:result.location.lng,
            address:result.address_component.province+','+result.address_component.city+','+result.formatted_addresses.recommend,
            city:result.address_component.city,
            district:result.address_component.district,
            nation:result.address_component.nation,
            province:result.address_component.province,
          } 
        },
        fail(err){
          console.log(err);
            // vm.form.address='四川省成都市';
            // console.log('拒绝授权');
        }
      })
    }, 
    bindcontroltap(e){   
      if (e.mp.type == 'end' && (e.mp.causedBy == 'scale' || e.mp.causedBy == 'drag')) {
        // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed 
        var that = this; 
        this.mapCtx = wx.createMapContext("myMap");
        this.mapCtx.getCenterLocation({
          type: 'gcj02',
          success: function(res) { 
            if(res.latitude&&res.longitude){  
              that.getAddress(res); 
            } 
          }
        })
      } 
    },
  },
  onShareAppMessage: function(res) {  
    let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid;
    let path = `pages/common/index/main?sharRuuid=${meRuuid}`;  
    return this.onShareAppMessage('',path);
  }, 
}
</script> 
 
<style lang="scss" scoped>
.map-page{
  width:100%;
  height:100%; 
  .info-content{
    position:relative;
    .cover-head{
      position:fixed;
      top:0;
      width:100%;
      padding-left:20rpx; 
      box-sizing:border-box;
      background:#fff;
      .img{
        height:37rpx;
        width:20rpx;
      }
      .pad-left{
        display:inline-block;
        font-size:30rpx;
        margin-left:6rpx;
        padding-left:20rpx;
      }
    }
    .cover-box{ 
      width:100%;
      position:fixed; 
      padding:0 36rpx 0;
      box-sizing:border-box;
      padding-top:52rpx;
      .cover-input{
        box-sizing:border-box;
        width:100%;
        height:116rpx; 
        background:rgba(255,255,255,1);
        box-shadow:0rpx 2rpx 8rpx 0rpx rgba(153,178,217,0.59);
        border-radius:14rpx;
        opacity:0.98;  
        display:flex;
        align-items:center;
        padding-left:42rpx;
        .map-search{
          width:36rpx;
          height:36rpx;
          margin-right:20rpx;
        }
        .text{
          display:inline-block;
          color:#808892;
          font-size:36rpx;
        }
      } 
    }
    .markers-cover{
      width:24rpx;
      height:56rpx;
      position:fixed;
      top:50%;
      left:50%;
      margin-top:-28rpx;
      margin-left:-12rpx;
    }
    .cover-content{
      width:598rpx;
      height:146rpx;
      position:fixed;
      top:50%;
      left:50%;
      margin-top:-170rpx;
      margin-left:-299rpx;
      .content-main{
        display:flex;
        height:124rpx;
        width:100%;
        background:#4A90E2;
        border-radius:12rpx;
        .icon-box{
          flex:0 0 124rpx;
          display:flex;
          align-items:center;
          background:#337BCF;
          border-radius:12rpx 0px 0px 12rpx;
          .icon{
            width:80rpx;
            height:40rpx;
            margin:auto;
          }
        }
        .right-box{
          flex:0 0 50rpx;
          display:flex;
          align-items:center;  
          border-radius:  0px 12rpx 12rpx 0px;
          .icon{
            width:18rpx;
            height:30rpx;
            margin:auto;
          }
        }
        .main-text{
          flex:1;
          padding:20rpx 0 0 20rpx;
          color:#fff; 
          .title-name{ 
            font-size:36rpx;
            font-weight:500;
            margin-bottom:10rpx;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
          }
          .address{
            font-size:24rpx; 
            font-weight:400;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
          }
        }
      }
      /* 向下的箭头 */ 
      .arrow-bottom {
        width: 48rpx;
        height: 24rpx; 
        margin:-2rpx auto 0;
      }
    }
    .search-content{
      width: 100%; 
      overflow:auto;
      .header-search{
        width:100%;
        height:98rpx;
        margin-bottom:20rpx;
        position:fixed;
        z-index:100;
      }
      .search-list{  
        padding:98rpx 0; 
        .item{ 
          padding:20rpx 40rpx; 
          color:#808892; 
          font-size:28rpx;
          box-sizing:border-box;
          display:flex;
          alias-items:center;
          .icon{
            flex:0 0 30rpx;
          }
          .site-content{
            flex:1;
            padding-left:10rpx; 
            .title-site{

            }
            .detail-site{
              font-size:24rpx;
            }
          } 
        }
        .item-active{
          background:#fff;
          color:#4E5761;
        } 
      }
      .more-search{
        font-size:24rpx;
        color:#495060;
        padding:40rpx 0;
      }
    }
  } 
}
 
</style>


<template>
  <div class="set-page">
    <div class="info-content">
      <div class="smart-group">
        <span class="site-title">位置设置</span>
        <div class="site-list" v-for="(item,index) in siteListArr" :key="item" @click.stop="selectAddress(item,index)">
          <div class="coordinates ">
            <image  v-if="item.is_cur_location==1" class="plane-icon" src="/static/image/set-site-location.png" style="width:36rpx;height:48rpx;"></image>
            <image v-else class="plane-icon" src="/static/image/plane-icon.png"></image>
          </div>
          <div class="name">
            <div v-if="item.is_cur_location==1" style="padding-top:10rpx;">我的当前位置</div>
            <div class="city">{{item.city}}</div>
            <div>{{item.address}}</div>
          </div>
          <div class="right">
            <i-icon type="right" size="30" color="#4A90E2" v-if="item.is_select==1"/>
            <span v-if="item.is_select!=1&&selectSiteLoadding==index" class="refresh-loading"></span>
          </div>
        </div>

        <div class="add-site" @click="checkSetting">添加一个新位置</div>
      </div>
      <div class="smart-photo-text">更改您的地理位置，查看其它城市的用户。</div>
      <div class="smart-group ">
        <span class="title">管理我的个人资料</span>
        <div class="clear-both smart-item">
          <span class="smart-item-title" style="color:rgba(128,136,146,1);">显示我的年龄</span>
          <p class="float-right"><switch color="#FF5470"  :checked="vipSwitchForm.switchAge" @change="switchAgeChange"/></p>
        </div>
        <div class="clear-both smart-item">
          <span class="smart-item-title" style="color:rgba(128,136,146,1);">显示我的距离</span>
          <p class="float-right"><switch color="#FF5470"  :checked="vipSwitchForm.distance" @change="distanceChange"/></p>
        </div>
      </div>
      <div class="smart-group ">
        <span class="title">给我推荐</span>
        <div class="clear-both smart-item">
          <span class="smart-item-title">男</span>
          <p class="float-right"> <switch color="#FF5470" :checked="manSex" @change="manSexChange" /></p>
        </div>
        <div class="clear-both smart-item">
          <span class="smart-item-title">女</span>
          <p class="float-right"> <switch color="#FF5470" :checked="womanSex" @change="womanSexChange" /></p>
        </div>
      </div>
      <div class="smart-group " v-if="distanceNum" style="padding-left:28rpx;padding-right:48rpx;">
        <div class="clear-both">
          <span class="title">最大距离</span>
          <span class="float-right max-number">{{distanceNum}}公里</span>
        </div>
        <div class="clear-both smart-item">
          <slider @changing="distanceChanging" @change="distanceChanged" min="2" max="160" backgroundColor="#E1E6EB" selectedColor="#FF5470" blockSize="26" :value="distanceNum"  v-if="rangeShow"/>
          <!-- <zy-slider  sliderType="one" :minValue="distanceNum" :maxValue="160" min="2" max="160"   selectedColor="#FF5470"   backgroundColor="#E1E6EB"  @lowValueChange="distanceChange" ></zy-slider> -->
        </div>
      </div>

      <div class="smart-group"  v-if="agelow&&ageheigh">
        <div class="clear-both">
          <span class="title">年龄范围</span>
          <span class="float-right max-number">{{agelow}}-{{ageheigh}}岁</span>
        </div>
        <div class="clear-both smart-item"  style="width:100%;">
          <!-- <zy-slider id="zy-slider" sliderType="two"  :minValue="agelow" :maxValue="ageheigh" min="18" max="60"   selectedColor="#FF5470"   backgroundColor="#E1E6EB"  @lowValueChange="lowValueChangeAction"  @heighValueChange="heighValueChangeAction" ></zy-slider> -->
          <range-slider width="600" height='80' block-size='50' min='18' max='60' :values='areaVal'
          @rangechange='heighValueChangeAction' barHeight="5" activeColor="#FF5470" backgroundColor="#E1E6EB" v-if="rangeShow">
            <view class="rangeBtn" slot='minBlock'></view> //左边滑块的内容
            <view class="rangeBtn" slot='maxBlock'></view> //右边滑块的内容
          </range-slider>
        </div>
      </div>
      <div class="smart-photo-text">我们会根据您的这些偏好来推荐配对。</div>
      <!--<div class="smart-group ">-->
        <!--<span class="title">最佳精选</span>-->
        <!--<div class="clear-both smart-item">-->
          <!--<span class="smart-item-title">启用最佳精选</span>-->
          <!--<p class="float-right"> <switch color="#FF5470" :checked="bestChoice" @change="bestChoiceChange" /></p>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="smart-photo-text">我们会根据您的这些偏好来推荐配对。</div>-->

      <!-- <div class="out-login text-center" @click="outLogin">注销账户</div> -->
    </div>
    <!--配对成功-->
    <div v-if="chargeVipShow">
      <charge-vip 
        :current="operationData.current"
        @close="chargeVipClose" >
      </charge-vip>
    </div>
  </div>
</template>

<script>
  import * as api from '@/utils/api' ;
  import headBack from '@/components/head-back.vue' ;
  import chargeVip from '@/components/pop-up-box/charge-vip.vue' ;
  import QQMapWX from '@/utils/qqmap-wx-jssdk.min';
  import {mapKey} from '@/utils/config.js';
  import userStore from './../pages/common/index/store';
  let qqmapsdk;
  const app = getApp()
  export default {
    onLoad(){
      let vm = this;
      this.rangeShow=true;
      this.getSetInfo();
      qqmapsdk = new QQMapWX({
        key: vm.mapKey
      });
      userStore.state.is_edit_data=true;
    },
    onShow:function(){
      this.rangeShow=false;
      this.getSiteList();
      this.getSetInfo().then(
        ()=>{
          setTimeout(()=>{
            this.rangeShow=true;
            this.areaVal=[this.agelow,this.ageheigh];
          },100);
        }
      );
      this.is_vip=userStore.state.userInfo.is_vip;
      if(this.is_vip){
        this.vipSwitchForm={
          switchAge:true, //显示我的年龄
          distance:true, //显示我的距离
        }
      }
    },
    mounted() {
      this.getSiteList();
    },
    components:{
      headBack,
      chargeVip
    },
    data(){
      return{
        mapKey:mapKey,
        headHeight:wx.getStorageSync('headHeight'),
        headPadding:wx.getStorageSync('headPadding'),
        agelow:null,
        ageheigh:null,
        distanceNum:null,
        siteListArr:[],
        selectSiteLoadding:-1,
        manSex:false,
        womanSex:false,
        bestChoice:false,
        form:{
          age_range:'',//年龄范围
          max_distance:'',//最大距离
          recommand_sex:null,//需求性别 1.男 2.女 3.不限
          best_choice:null,//最佳精选 1.开启 2.关闭
        },
        chargeVipShow:false,
        operationData:{
          // vipType:0,  //通用 超级喜欢  置顶
          // can_share:false,
          current:0,
        },
        areaVal:'[18,18]',
        is_vip:false,
        vipSwitchForm:{
          switchAge:true, //显示我的年龄
          distance:true, //显示我的距离
        },
        rangeShow:false,
      }
    },
    methods: {
      //计算虚拟dom的参数
      computeDom(dom){
        return new Promise(function (resolve, reject) {
            var query = wx.createSelectorQuery();
            query.select(dom).boundingClientRect();
            query.selectViewport().scrollOffset();
            query.exec((res) => {
                resolve(res[0]);
            });
        });
      }, 
      /**获取用户信息 */
      fetchInfo(){
        let vm = this;
        api.getUserDetail().then(res=>{
          if(res.data.code==300000){
            userStore.state.userInfo=res.data.data;
            vm.is_vip=res.data.data.is_vip;
            if(res.data.data.is_vip){
              vm.vipSwitchForm={
                switchAge:true, //显示我的年龄
                distance:true, //显示我的距离
              }
            }
          }
        })
      },
      //位置列表
      getSiteList(){
        let vm = this;
        api.getLocationList().then(res=>{
          if(res.data.code==300000){
            vm.siteListArr=res.data.data;
          }
        })
      },
      selectAddress(item,index){
        let vm = this;
        if(this.selectSiteLoadding==-1){
          this.selectSiteLoadding=index;
          let body={
            id:item.id
          };
          api.updateLocation(body).then(res=>{
            if(res.data.code==300000){
              vm.fetchInfo();
              vm.selectSiteLoadding=-1;
              vm.siteListArr.forEach((sItem,sIndex)=>{
                if(item.id==sItem.id){
                  sItem.is_select=1;
                }else{
                  sItem.is_select=0;
                }
              })
            }
          }).catch(err=>{
            vm.selectSiteLoadding=-1;
          })
        }
      },
      checkSetting(){
        let vm = this;
        if(vm.form.is_vip){
          wx.getSetting({
            success (res) {
              if(res.authSetting["scope.userLocation"]){
                vm.getLocation();
                vm.jumpPage();
              }else{
                wx.openSetting({
                  success (res) {
                    if(!res.authSetting["scope.userLocation"]){
                      // wx.showModal({
                      //   title: '用户未授权',
                      //   content: '如需正常使用小程序，请开启地理位置授权服务',
                      //   showCancel: false,
                      //   success: function (res) {
                      //     if (res.confirm) {
                      //       // vm.checkSetting();
                      //     }
                      //   }
                      // })
                    }else{
                      vm.getLocation();
                      vm.jumpPage();
                    }
                  }
                })
              }
            }
          })
        }else{
          vm.chargeVipShow=true; 
          vm.operationData.current=1; 
        }
      },
      //授权地址
      getLocation(){
        let vm = this;
        wx.getLocation({
          type: 'wgs84',
          success (res) {
            console.log(res);
            vm.getAddress(res);
          },
          fail(res){
          }
        });
      },
      getAddress(res){
        let vm = this;
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (ad) {
            console.log(ad);
            let result=ad.result;
            let body={
              lat:result.location.lat,
              lng:result.location.lng,
              address:result.address,
              city:result.address_component.city
            }
            api.uploadLocation(body).then(res=>{console.log(res) })
          },
          fail(res){
            console.log('拒绝授权');
          }
        })
      },
      getSetInfo(){
        let vm = this;
        return api.getUserSetting().then(res=>{
          if(res.data.code==300000){
            vm.form=res.data.data;
            let ageRange=res.data.data.age_range.split('-');
            ageRange[0]!='NaN'?vm.agelow=parseInt(ageRange[0]):vm.agelow=18;
            ageRange[1]!='NaN'?vm.ageheigh=parseInt(ageRange[1]):vm.ageheigh=40;

            vm.distanceNum=res.data.data.max_distance;
            
            vm.areaVal=[vm.agelow,vm.ageheigh];

            if(vm.form.recommand_sex==1){   
              vm.manSex=true;
            }else if(vm.form.recommand_sex==2){
              vm.womanSex=true;
            }else{
              vm.womanSex=true;
              vm.manSex=true;
            }
            vm.form.best_choice==1?vm.bestChoice=true:vm.bestChoice=false;
          }
        })
      },
      updatedSetInfo() {
        let vm = this;
        let body={
          age_range:this.agelow+'-'+this.ageheigh,
          max_distance:this.distanceNum,
        };
        if(this.manSex&&!this.womanSex){
          body.recommand_sex=1;
        }else if(!this.manSex&&this.womanSex){
          body.recommand_sex=2;
        }else if(this.manSex&&this.womanSex){
          body.recommand_sex=3;
        }
        if(this.bestChoice){
          body.best_choice=1;
        }else{
          body.best_choice=2;
        }
        api.updateUserSetting(body).then(res=>{
          if(res.data.code==300000){
            console.log('保存成功');
          }
        })
      },
      manSexChange(e){
        this.manSex=e.mp.detail.value;
        console.log(this.manSex);
        if(!this.manSex&&!this.womanSex){
          this.womanSex=true;
          console.log(this.womanSex);
        }
        this.userInfoChange();
      },
      womanSexChange(e){
        this.womanSex=e.mp.detail.value;
        if(!this.manSex&&!this.womanSex){
          this.manSex=true;
        }
        this.userInfoChange();
      },
      bestChoiceChange(e){
        this.bestChoice=e.mp.detail.value;
        this.userInfoChange();
      },
      /* *距离 */
      distanceChanging(e) {
        this.distanceNum=e.mp.detail.value;
        // this.distanceNum=parseInt(e.mp.detail.maxValue);
        // this.distanceAreaVal="[0,"+this.distanceNum+"]";
        // console.log(e.mp.detail.lowValue)
      },
      distanceChanged(e){
        this.userInfoChange();
      },
      /** * 年龄范围 */
      lowValueChangeAction (e) {
        this.agelow=e.mp.detail.lowValue;
        // console.log(this.agelow)
        // this.throttle(this.userInfoChange(),1000,10000);
      },

      heighValueChangeAction (e) {
        this.agelow=parseInt(e.mp.detail.minValue);
        this.ageheigh=parseInt(e.mp.detail.maxValue);
        this.areaVal=[this.agelow,this.ageheigh];
        // this.ageheigh=e.mp.detail.heighValue;
        this.userInfoChange();
      },
      //防止请求频繁
      throttle(method,delay,duration){
      var timer=null;
      var begin=new Date();
      return function() {
          var context=this, args=arguments;
          var current=new Date();
          clearTimeout(timer);
          if(current-begin>=duration){
            method.apply(context,args);
            begin=current;
          }else{
            timer=setTimeout(function(){
              method.apply(context,args);
            },delay);
          }
        }
      },
      jumpPage(){
        let url = `./../../user-info/map-page/main`;
        wx.navigateTo({url});
      },
      //退出登录
      outLogin(){
        wx.setStorageSync('refresh_token', '');
        wx.setStorageSync('h_token', '');
        let url = `./../../login-page/login/main`;
        wx.reLaunch({url});
      },
      //关闭充值
      chargeVipClose(){
        this.chargeVipShow=false;
      },
      userInfoChange(){
        this.updatedSetInfo();
        let body={
          age_range:this.agelow+'-'+this.ageheigh,
          max_distance:this.distanceNum,
        };
        if(this.manSex&&!this.womanSex){
          body.recommand_sex=1;
        }else if(!this.manSex&&this.womanSex){
          body.recommand_sex=2;
        }else if(this.manSex&&this.womanSex){
          body.recommand_sex=3;
        }
        if(this.bestChoice){
          body.best_choice=1;
        }else{
          body.best_choice=2;
        }
        body.updateBoll=true;
        userStore.state.setForm=body;
      },

      //显示我的年龄
      switchAgeChange(){
        if(this.is_vip){
          this.vipSwitchForm.switchAge=!this.vipSwitchForm.switchAge;
        }else{
          this.setVipShow=true;
          this.operationData.current=5; 
        } 
      
      },
      //显示我的距离
      distanceChange(){
        if(this.is_vip){
          this.vipSwitchForm.distance=!this.vipSwitchForm.distance;
        }else{
          this.setVipShow=true;
          this.operationData.current=5; 
        }  
      },
    } ,
    onUnload(){
      this.updatedSetInfo();
      let body={
        age_range:this.agelow+'-'+this.ageheigh,
        max_distance:this.distanceNum,
      };
      if(this.manSex&&!this.womanSex){
        body.recommand_sex=1;
      }else if(!this.manSex&&this.womanSex){
        body.recommand_sex=2;
      }else if(this.manSex&&this.womanSex){
        body.recommand_sex=3;
      }
      if(this.bestChoice){
        body.best_choice=1;
      }else{
        body.best_choice=2;
      }
      body.updateBoll=true;
      userStore.state.setForm=body;
    },
  }
</script>
<style>
  picker{
    display: block;
    width: 100%;
    font-size: 50rpx;
  }
  .rangeBtn{
    width:48rpx;
    height:48rpx;
    border-radius:50%;
    background:#fff;
    border:1px solid #f0f0f0;
    box-shadow: 0 0 4rpx 0 #ddd;
  }
</style>
<style lang="scss" scoped>
  .set-page{
    width:100%;
    height:100%;
    overflow-y: auto;
    .info-content{
      width:100%;
      height:100%;
      padding:0 30rpx;
      margin-top:42rpx;
      .set-hit{
        padding:34rpx 0 30rpx;
        font-size:36rpx;
        color:#4D4D4D;
        font-weight: 500 ;
      }
      .smart-group{
        width:100%;
        margin-bottom:20rpx ;
        padding: 30rpx 24rpx 30rpx 38rpx ;
        background:#fff;
        border-radius:10rpx;
        border:1rpx solid #E1E6EB;
        .site-title{
          font-size:36rpx;
          color:#4D4D4D;
          font-weight: 500 ;
        }
        .site-list{
          display:flex;
          align-items:center;
          padding:30rpx 30rpx  0  20rpx;
          .coordinates{
            flex:0 0 70rpx;
            .plane-icon{
              width:38rpx;
              height:40rpx;
            }
          }
          .name{
            flex:1;
            color:#4E5761;
            font-size:26rpx;
            font-weight:500;
            .city{
              color:#000;
              font-size:28rpx;
            }
          }
          .right{
            flex:0 0 60rpx;
          }
        }
        .add-site{
          padding:30rpx 30rpx 30rpx 88rpx;
          color:#4A90E2;
          font-size:28rpx;
          font-weight:500;
          &:active{
            opacity:.8;
          }
        }
        .title{
          font-size:34rpx;
          color:#FF5470;
          font-weight: 400 ;
        }
        .max-number{
          color:#4E5761;
          font-size:34rpx;
          font-weight:500
        }
        .smart-item{
          margin-top:35rpx;
          box-sizing: border-box;
          .smart-item-title{
            font-size:28rpx;
            font-weight: 500 ;
            color:#4E5761;
            padding-left:38rpx;
          }
        }

      }
      .smart-photo-text{
        font-size:28rpx;
        color:#808892;
        margin:12rpx 40rpx 10rpx 40rpx;
      }
      .out-login{
        width:100%;
        height:88rpx;
        margin:108rpx auto 60rpx;
        line-height:88rpx;
        color:#808892;
        font-size:36rpx;
        background:#fff;
        border-radius:10rpx;
        border:1rpx solid rgba(225,230,235,1);
        &:active{
          opacity:.8;
        }
      }
    }
  }

</style>

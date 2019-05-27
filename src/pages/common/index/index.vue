
<template>
  <div class="home-page" :style="'padding-top:'+headHeight+'rpx;'" v-if="indexPageShow">
    <head-back mode="tabs" @clickTab="clickTabs" :currentTab="currentTab" :tabsList="tabsList"></head-back>
     <!--页面内容 -->
    <swiper class="tab-box" :current="currentTab" duration="300" @change="switchTab" style="height:100%;">
        <swiper-item >
          <!--用户列表-->
          <div  class="main-tab-content   main-im" >
            <div class="user-content" v-if="userDataArr.length>0">
              <div class="directToast" v-if="stepShow!=='step4'">
                <div class="step step1" v-if="stepShow=='step1'"  @touchstart="stepstart1($event)" @touchend="stepend1($event)">
                  <div class="singleDiv">
                    <img src="/static/image/step1.png" alt="">
                    <span>左右滑，换照片</span>
                  </div>
                </div>
                <div class="step step2" v-else-if="stepShow=='step2'"  @touchstart="stepstart2($event)" @touchend="stepend2($event)">
                  <div class="singleDiv">
                    <img src="/static/image/step2.png" alt="">
                    <span>上下滑，换用户</span>
                  </div>
                </div>
                <div class="step step3" v-else-if="stepShow=='step3'">
                  <div class="singleDiv" @click.stop="stepFocus(nowUserList)">
                    <img src="/static/image/step3.png" alt="">
                    <span>轻点喜欢TA</span>
                  </div>
                </div>
              </div>
              <div class="swiper-box"  v-if="nowUserList.photo">
                <!--当前选中的指示点-->
                <div class="indicator-box" v-if="nowUserList.photo.length!=1">
                  <div class="indicator-group">
                    <span v-for="(item,index) in nowUserList.photo" :key="item" :class="{'active':userItemCurrent==index}"  ></span>
                  </div>
                </div>
                <!--基本信息-->
                <div class="user-info">
                  <div class="text float-left" :style="{'padding-top':nowUserList.is_vip?'':'20rpx'}" @click.stop="lookNewDetail(nowUserList,1)" >
                    <div class="vip-cap-box clear-both" v-if="nowUserList.is_vip">
                      <image src="/static/image/vip-cap.png" class="vip-cap float-left"></image>
                    </div>
                    <span class="name">{{nowUserList.nickname}}</span>
                    <span>{{nowUserList.age}}</span>
                    <!-- <image src="/static/image/vip-sign.png" class="vip-sign"></image> -->
                  </div>
                  <div class="float-right text-center add-heart"  @click.stop="stepFocus(nowUserList,1)">
                    <div class="heart-item" v-if="!nowUserList.isLike">
                      <img class="img" :class="{'add-heart-active':heartActive}" src="/static/image/heart-mode.png"/>
                      <p>喜欢</p>
                    </div>
                    <div class="heart-item" v-if="nowUserList.isLike">
                      <img class="img" src="/static/image/add-heart.png"/>
                      <p>已喜欢</p>
                    </div>
                  </div>
                </div>
                <swiper
                  :indicator-dots="false"
                  :autoplay="false"
                  :vertical="true"
                  :current="userGroupCurrent"
                  :duration="80"
                  :easing-function="easeInCubic"
                  @change="swiperBoxChange($event,nowUserList)"
                  :style="'height:100%;width:100%;'" >
                  <block  v-for="(itemList,listIndex) in userDataArr" :key="itemList"  v-if="itemList.photo">
                    <swiper-item :item-id="itemList.ruuid" class="user-info-box" @touchstart='touchstartBest($event,listIndex)' @touchend='touchendBest($event,listIndex)'>
                      <div class="user-group" @click.stop="lookNewDetail(nowUserList)" >
                        <swiper
                          :indicator-dots="false"
                          :autoplay="false"
                          :duration="80"
                          :current="userItemCurrent"
                          @change="bindchange"
                          :style="'height:100%;width:100%;'"
                        >
                          <block v-for="item in itemList.photo" :key="item">
                            <swiper-item class="swiper-img-box">
                              <div class="swiper-img-position" >
                                <image-loader :src="item.link+'?x-oss-process=image/resize,w_450'" image-style="width:100%; height:100%; box-shadow:0rpx 4rpx 6rpx 0rpx rgba(239,241,246,0.36); border-radius:24rpx;" ></image-loader>
                                <p class="modal"></p>
                              </div>
                            </swiper-item>
                          </block>
                        </swiper>
                      </div>
                    </swiper-item>
                  </block>
                </swiper>
              </div>
            </div>
            <div  class="user-list-null" v-if="userDataArr.length==0">
              <div class="user-header">
                <div class="wave text-center">
                  <div class="circle"></div>
                  <div class="circle"></div>
                  <div class="circle"></div>
                  <image mode="aspectFill" class="content-img" :src="userInfo.head_pic?userInfo.head_pic+'?x-oss-process=image/resize,w_100':'https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/head-img-undefined.png'" ></image>
                </div>
              </div>
              <div class="text-hit text-center">您附近没有用户，展开发现设置，查看更多的人</div>
              <div class="find-btn text-center" @click.stop="openSetSearch">发现设置</div>
                
              <div class="search-user-list-footer" v-if="searchUserListShow">
                <div class="search-content">
                  <div class="title text-center">
                    发现设置
                    <i-icon type="close" size="30" color="#d8d8d8" class="float-right close-search" @click.stop="searchUserListShow=false"/>
                  </div>
                  <div class="main">
                    <div class="group" style="padding-left:64rpx;padding-right:48rpx;">
                      <div class="group-title">
                        <span style="color:#FF5470;">最大距离</span>
                        <span class="float-right scope">{{distanceNum}}公里</span>
                      </div>
                      <div class="clear-both" style="width:100%;">
                        <slider @changing="distanceChanging" @change="distanceChanged" min="2" max="160" backgroundColor="#E1E6EB" selectedColor="#FF5470" blockSize="26" :value="distanceNum"  v-if="rangeShow"/>
                        <!-- <zy-slider  sliderType="one" :minValue="distanceNum" :maxValue="160" min="2" max="160"   selectedColor="#FF5470"   backgroundColor="#E1E6EB"  @lowValueChange="distanceChange" ></zy-slider> -->
                      </div>
                    </div>

                    <div class="group">
                      <div class="group-title">
                        <span style="color:#FF5470;">年龄范围</span>
                        <span class="float-right scope">{{agelow}}-{{ageheigh}}</span>
                      </div>
                      <div >
                        <range-slider width="600" height='80' block-size='50' min='18' max='60' :values='areaVal' @rangechange='heighValueChangeAction' barHeight="5" activeColor="#FF5470" backgroundColor="#E1E6EB" v-if="rangeShow">
                          <view class="rangeBtn" slot='minBlock'></view> //左边滑块的内容
                          <view class="rangeBtn" slot='maxBlock'></view> //右边滑块的内容
                        </range-slider>
                        <!-- <zy-slider id="zy-slider" sliderType="two"  :minValue="agelow" :maxValue="ageheigh" min="18" max="60"   selectedColor="#FF5470"   backgroundColor="#E1E6EB"  @lowValueChange="lowValueChangeAction"  @heighValueChange="heighValueChangeAction" ></zy-slider> -->
                      </div>
                    </div>
                    <div class="search-btn text-center" @click.stop="updatedSetInfo">更新</div>
                  </div>
                </div>
                <div class="search-modal" @click.stop="searchUserListShow=false"></div>
              </div>
            </div>
          </div>
        </swiper-item>
        <swiper-item >
          <!--精选萝卜-->
          <scroll-view  scroll-y class="main-tab-content"   @scrolltolower="bindscrolltolower">
            <div style="width:100%;height:100%;verflow:auto;">
              <c-bestlist
                :bestUserList="bestDataList"
                :isLikeRight="isLikeRight"
                :bestSuperLikeNum="bestSuperLikeNum"
                @change="changeBestSelect"
                @lookDetail="lookDetail"
              ></c-bestlist>
            </div>
          </scroll-view>
          <div class="text-center" style="font-size:30rpx;color:#4E5761;padding:40rpx 0;" v-if="bestDataList.length==0">今日暂无</div>
        </swiper-item>
    </swiper>
    <div class="focusActive" v-show="focusActive">
      <image src="/static/image/like.gif" alt="" class="img"/>
    </div>
    <login-null v-if="modalShow" mode="modal" @close="closeModal"></login-null>
    <div v-if="chargeVipShow">
      <charge-vip @close="chargeVipClose" :type="vipType"></charge-vip>
    </div> 
  </div>
</template>
<script>
import * as api from '@/utils/api' ;
import QQMapWX from '@/utils/qqmap-wx-jssdk.min';
import {mapKey} from '@/utils/config.js';
import headBack from '@/components/head-back.vue' ; 
import chargeVip from '@/components/pop-up-box/charge-vip.vue' ;  
import loginNull from '@/components/login-null.vue' ;  
import {startWebSocket} from '@/utils/imeventhandler';
import '@/utils/getApp';
import userStore from './store' ;
let qqmapsdk;
const app = getApp()
export default {
  onLoad(){
    // this.checkUserList()
    this.rangeShow=true;
    console.log(wx.getStorageSync('systemInfo'));
    let vm = this;
    let pages = getCurrentPages();//页面栈数组 
    let optionsData = pages[pages.length - 1].options;//当前页面路由传递的参数 
    app.globalData.userDataInfo={
      type:optionsData.type || '',  //如何进入的 user->进入用户详情  news->进入帖子详情  vip->用户拉新 否则为空
      sharRuuid:optionsData.sharRuuid || '', //全局保存推荐人ruuid   
      userId:optionsData.userId || '',  //被查看用户的id
      artId:optionsData.artId || '',  //被查看帖子的id
    };  
    console.log(app.globalData.userDataInfo);
    // wx.hideTabBar({});// 隐藏tabbar    
    // wx.showTabBar({}) // 显示tabbar 
    vm.onLoadFun();        
  },
  onShow: function () {
    let vm = this;
    //用户基本信息
    if(userStore.state.is_edit_data){
      if(userStore.state.setForm.recommand_sex&&userStore.state.setForm.best_choice){
        let ageRange=userStore.state.setForm.age_range.split('-');
        ageRange[0]!='NaN'&&ageRange[0]?this.agelow=parseInt(ageRange[0]):this.agelow=18;
        ageRange[1]!='NaN'&&ageRange[1]?this.ageheigh=parseInt(ageRange[1]):this.ageheigh=40;
        this.distanceNum=userStore.state.setForm.max_distance;
        // this.updatedSetInfo();  //保存设置
      }
      if(userStore.state.setForm.updateBoll){
        this.checkUserList();  //保存设置
        userStore.state.setForm.updateBoll=false;
      }
    };
    
    if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
      this.is_login=true;
      this.modalShow=false;
      //获取用户设置信息
      this.rangeShow=false;
      this.getSetInfo().then(
        ()=>{
          setTimeout(()=>{
            this.rangeShow=true;
            this.areaVal=[this.agelow,this.ageheigh];
          },100); 
        }
      );
      if(userStore.state.userInfo.head_pic){
        this.userInfo=userStore.state.userInfo;
      }else{
        this.fetchInfo();
      } 
      this.getBestList();//刷新精选萝卜 
      //是否注册用户进入
      if(app.globalData.userStore.firstEntry){ 
        //获取地址 
        this.getLocation();
        qqmapsdk = new QQMapWX({
          key: vm.mapKey
        }); 
      } 
    }else{
      this.is_login=false;
    }

    if(userStore.state.currentList!=={}){
      this.currentList=userStore.state.currentList;
      userStore.state.currentList={};
      this.userDataArr.forEach((it,index)=>{
        if(it.ruuid==this.currentList.ruuid){
          this.userDataArr.splice(index,1,this.currentList);
        }
      });
    } 
    
  },

  data () {
    return {
      indexPageShow:false,
      currentTab:0, //当前页面
      headHeight:wx.getStorageSync('headHeight'),
      headPadding:wx.getStorageSync('headPadding'),
      mapKey:mapKey,
      //发现设置
      agelow:18,
      ageheigh:40,
      distanceNum:160,
      searchUserListShow:false, 
      tabsList:[{name:'新萝卜'},{name:'精选萝卜'}],
      userGroupCurrent:0,
      userItemCurrent:0,
      nowUserList:{},
      userDataArrPre:[],//预备新萝卜列表
      userDataArr:[],//新萝卜列表
      userSaveDataArr:[],// 保存上次的新萝卜列表
      bestDataList:[],  //精选列表
      userInfo:{},
      stepShow:'step4',//引导
      focusActive:false,
      heartActive:false,
      lookDetailShow:true,  //防止连点
      is_login:false,
      modalShow:false,
      rangeShow:false,
      areaVal:'[18,18]',
      chargeVipShow:false, //vip
      vipType:'share', 
    }
  },

  components:{
    headBack,
    loginNull,
    chargeVip
  },  
  methods: {
    //初始化数据
    onLoadFun(){
      let vm = this;
      wx.showTabBar({}) // 显示tabbar
      this.checkLoginState(); 
      vm.indexPageShow=true;  
      // //每日精选页
      // this.getBestList();
      if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){ 
        //是否注册用户进入
        if(app.globalData.userStore.firstEntry){
          this.stepShow='step1';
        } 
        //查看是否有消息记录
        app.globalData.subscriber.on('MSG_USER_DATA_LIST', (data)=>{ 
            let msgData = app.globalData.recentChatList;
            let totalNum = 0;
            Object.keys(app.globalData.recentChatList).forEach((key)=>{  
              totalNum=app.globalData.recentChatList[key].countA+app.globalData.recentChatList[key].countB; 
              if(totalNum>0){
                wx.showTabBarRedDot({index:2});
              }
            })
        })
        app.globalData.subscriber.on('UPDATE_MSG_LIST', (data)=>{ 
          wx.showTabBarRedDot({index:2}); 
        }) 
        //推送消息
        app.globalData.subscriber.on('PUSH_MESSAGE_LIST', (data)=>{
          if(data){ 
            wx.showTabBarRedDot({index:2});
          }  
        })
      }    
    },
    //判断是否是分享进入小程序
    chackSharePage(){
      if(app.globalData.userDataInfo.type=='user'){
        wx.navigateTo({url:`./../../share-page/share-user-detail/main?userId=${app.globalData.userDataInfo.userId}`});
        return;
      }else  if(app.globalData.userDataInfo.type=='news'){
        wx.navigateTo({url:`./../../share-page/share-news-detail/main?artId=${app.globalData.userDataInfo.artId}`});
        return;
      }else if(app.globalData.userDataInfo.type=='vip'){
        this.vipType='help';
        this.chargeVipShow=true; 
        return;
      }
    },
    //登录是否是否过期
    checkLoginState() {
      let vm = this;
      wx.checkSession({
        success: function(res) {
          console.log('登录中');
          vm.checkOpenId();
        },
        fail: function(res) {
          console.log('登录过期');
          vm.loginWx();
        }
      })
    },
    //获得openId
    checkOpenId() {
      let vm = this;
      if (!wx.getStorageSync('openId')) {
        vm.loginWx();
      }else{ 
        vm.checkUserLogin(wx.getStorageSync('openId'));
      } 
    },
    //登录微信
    loginWx() {
      let vm = this; 
      wx.login({
        success: function(res) { 
          api.wxServer({ code: res.code }).then(res => { 
            wx.setStorageSync('openId', res.data.data.openid);  
            if(!wx.getStorageSync('refresh_token')||!wx.getStorageSync('h_token')||wx.getStorageSync('is_tourist')!=2){
              vm.checkUserLogin(res.data.data.openid);
            } 
            console.log(res.data.data.openid);
          }).catch(res => {
            wx.showToast({ icon: 'none', title: res.message })  
          });
        }
      });
    },
    checkUserLogin(val){
      let vm = this;
      let body={
        identifier:val,
        identity_type:5, 
      }
      api.userLogin(body).then(res=>{ 
        if(res.data.code==300000){
          let account={
              accid:res.data.data.accid,
              password:res.data.data.password,
              uuid:res.data.data.uuid,
              deviceToken:wx.getStorageSync('openId')+wx.getStorageSync('phone')
            }; 
          wx.setStorageSync('account', JSON.stringify(account)); 
          wx.setStorageSync('refresh_token', res.data.data.refresh_token);
          wx.setStorageSync('h_token', res.data.data.token);
          wx.setStorageSync('is_tourist', res.data.data.is_tourist);   
          vm.fetchInfo();
          setTimeout(()=>{
            startWebSocket()  //连接聊天服务器  
          },100) 
          vm.getBestList();//刷新精选萝卜 
          if(res.data.data.is_tourist==2){
            vm.is_login=true;
            //获取地址 
            vm.getLocation();
            qqmapsdk = new QQMapWX({
              key: vm.mapKey
            });
          }  else {
            vm.checkUserList();
          }
          if(app.globalData.userDataInfo.userId!=res.data.data.uuid){
            vm.chackSharePage();//判断分享
          } 
        } else if(res.data.code==300101){
          vm.registerCasual(val);
        }
      })
    },
    //注册临时用户
    registerCasual(val){
      let vm = this;
      let body={
        identity_type:5,
        identifier:val,
        recommender_uuid:app.globalData.userDataInfo.sharRuuid, //分享人的ruuid, //推荐人的ruuid
        openid:val,
      };
      api.register(body).then(res=>{
        if(res.data.code==300000){
          let account={
              accid:res.data.data.accid,
              password:res.data.data.password,
              uuid:res.data.data.uuid,
              deviceToken:wx.getStorageSync('openId')+wx.getStorageSync('phone')
            }; 
          wx.setStorageSync('account', JSON.stringify(account)); 
          wx.setStorageSync('refresh_token', res.data.data.refresh_token);
          wx.setStorageSync('h_token', res.data.data.token);
          wx.setStorageSync('is_tourist', res.data.data.is_tourist); 
          if(res.data.data.is_tourist==2){
            vm.is_login=true;
          }
          vm.fetchInfo();
          vm.getBestList();//刷新精选萝卜
          vm.checkUserList(); 
          if(app.globalData.userDataInfo.userId!=res.data.data.uuid){
            vm.chackSharePage();//判断分享
          }  
        }
      })
    },
    checkSetting(){
      let vm = this;
      wx.getSetting({
        success (res) {
          if(res.authSetting["scope.userLocation"]){
            vm.getLocation();
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
                  //       vm.checkSetting();
                  //     }
                  //   }
                  // })
                }else{
                  vm.getLocation();
                }
              }
            })
          }
        }
      })
    },
    //授权地址
    getLocation(){
      let vm = this;
      wx.getLocation({
        type: 'wgs84',
        success (res) {
          userStore.state.location=res;
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
          // console.log(ad);
          let result=ad.result;
          let body={
            lat:result.location.lat,
            lng:result.location.lng,
            address:result.address,
            city:result.address_component.city
          }
          api.uploadLocation(body).then(res=>{
            // //用户列表
            vm.checkUserList();
          })
        },
        fail(res){
          console.log(res)
            // vm.form.address='四川省成都市';
            console.log('拒绝授权');
        }
      })
    }, 
    //监听当前滑动的页面
    switchTab(e){
      this.currentTab=e.mp.detail.current;
    },
    //tabs切换
    clickTabs(item,index){
      console.log(item,index);
      this.currentTab=index;
       if(index==0){
         app.aldstat.sendEvent('index:匹配');
       }else if(index==1){
         app.aldstat.sendEvent('index:精选');
       }
    },
    //监听照片轮播图
    bindchange(e){
      if (e.mp.detail.source == "touch") {
        //防止swiper控件卡死
        if (e.mp.detail.current == 0 && this.userItemCurrent>1 ) {
          this.userItemCurrent=this.userItemCurrent;
        } else {
          this.userItemCurrent=e.mp.detail.current;
        }
      }
    },
    swiperBoxChange(e,item){
      let vm = this;
      let itemDeta=e.mp.detail;
      if (itemDeta.source == "touch") {
        //防止swiper控件卡死
        if (itemDeta.current == 0 && vm.userGroupCurrent>1 ) {
          vm.userGroupCurrent=vm.userGroupCurrent;
        } else {
          vm.userGroupCurrent=itemDeta.current;
        }
        vm.userItemCurrent=0;
      }
      let body={
        ruuid:item.ruuid,
        type:2,
        enter_page:1,  // 1.普通 2.每日精选 3.喜欢我的人
        super_like:item.super_like || false,
        is_top:item.is_top || false,
      }
      api.userpageOperation(body).then(
        (res)=>{
          if(res.data.code==300000){
            console.log('已看过')
          }
        },
        (err)=>{
          console.log(err);
        }
      );
      vm.userDataArr.forEach((item,index)=>{
        if(item.ruuid==itemDeta.currentItemId){
          vm.nowUserList=item;
        }
      });
      ///判断是否加载预备列表
      if(e.target.current==4&&this.userDataArrPre.length==0){
        this.checkPreUserList();
      }
      //滚动到最后一张的时候
      if(e.target.current==this.userDataArr.length-1){
        this.userSaveDataArr=[];
        this.userSaveDataArr=this.userDataArr;
        let start=this.userDataArr.length-1;
        let newArr=[];
        newArr=this.userDataArr.slice(start);
        newArr.push(...this.userDataArrPre);
        this.userDataArr=[];
        setTimeout(()=>{
          this.userDataArr=newArr;
          this.userGroupCurrent=0;
          if(this.userDataArrPre.length>4){
            this.userDataArrPre=[];
          };
        },100);
      }
    },

    //每日精选页
    getBestList(){
      let vm = this;
      api.getDailyselection().then(res=>{
        if(res.data.data&&res.data.code==300000){
          vm.bestDataList=res.data.data;
        }else{
          vm.bestDataList=[];
        }
      })
    },
    //获取用户列表
    checkUserList(){
      let vm = this;
      api.getUserPageList().then(res=>{
        vm.userDataArr=[];
        if(res.data.data&&res.data.code==300000){ 
          res.data.data.forEach((item,index)=>{
            if(item.photo){
              vm.userDataArr.push(item)
            }
          })
          if(vm.userDataArr.length>0){
            vm.nowUserList=vm.userDataArr[0];
          }
        }else{
          vm.userDataArr=[];
        }
      })
    },
    checkPreUserList(){
      let vm = this;
      api.getUserPageList().then(res=>{
        if(res.data.data&&res.data.code==300000){
          vm.userDataArrPre=res.data.data
        }else{
          vm.userDataArrPre=[];
        }
      })
    },
    //每日精选详情
    lookDetail(e){
      app.aldstat.sendEvent('index:个人中心');
      let item=e.mp.detail;
      if(item.is_show){
        wx.navigateTo({url:`./../user-detail-page/main?ruuid=${item.ruuid}`});
      }else{
        if(!this.is_login){
          this.modalShow=true;
        }else{
          this.vipType='share';
          this.chargeVipShow=true; 
        }  
      }
    },
    lookNewDetail(item){
      if(this.lookDetailShow){
        app.aldstat.sendEvent('index:个人中心');
        userStore.state.currentList=item;
        wx.navigateTo({url:`./../user-detail-page/main?ruuid=${item.ruuid}`}); 
      } 
    },

    // //发现设置
    // distanceChange(e) {
    //     this.distanceNum=e.mp.detail.lowValue;
    // },
    // /** * 年龄范围 */
    // lowValueChangeAction (e) {
    //     this.agelow=e.mp.detail.lowValue;
    // },

    // heighValueChangeAction (e) { 
    //   this.ageheigh=e.mp.detail.heighValue;  
    // }, 
    //打开发现设置
    openSetSearch(){
      if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
        this.searchUserListShow=true;  
      }else{
        this.modalShow=true;
      }
    },
    //保存设置 (设置年龄，距离)
    updatedSetInfo() {
      let vm = this;
      vm.userDataArr=[];
      let body={
        age_range:this.agelow+'-'+this.ageheigh,
        max_distance:this.distanceNum,
      };
      if(userStore.state.setForm.recommand_sex){
        body.recommand_sex=userStore.state.setForm.recommand_sex;
      }
      if(userStore.state.setForm.best_choice){
        body.best_choice=userStore.state.setForm.best_choice;
      }
      vm.searchUserListShow=false;
      api.updateUserSetting(body).then(res=>{
        app.aldstat.sendEvent('index:发现设置');
        userStore.state.is_edit_data=false;
        if(res.data.code==300000){
          vm.checkUserList();
        }
      })
    },
    //获取用户设置信息
    getSetInfo(){
      let vm = this;
      return api.getUserSetting().then(res=>{
        if(res.data.code==300000&&res.data.data){
          let ageRange=res.data.data.age_range.split('-');
          ageRange[0]!='NaN'&&ageRange[0]?vm.agelow=parseInt(ageRange[0]):vm.agelow=18;
          ageRange[1]!='NaN'&&ageRange[1]?vm.ageheigh=parseInt(ageRange[1]):vm.ageheigh=40;
          vm.distanceNum=res.data.data.max_distance;
          vm.areaVal=[vm.agelow,vm.ageheigh];
          userStore.state.setForm.age_range=vm.agelow+'-'+vm.ageheigh;
          userStore.state.setForm.max_distance=vm.distanceNum;
        }
      })
    },
    /**获取用户信息 */
    fetchInfo(){
      let vm = this;
      api.getUserDetail().then(res=>{
        if(res.data.code==300000&&res.data.data){
          userStore.state.userInfo=res.data.data;
          vm.userInfo=res.data.data;
        }
      })
    },
    // 触摸开始
    touchstartBest(e,index){
      this.touchStartClient=e.clientY;
    },
    // 触摸结束
    touchendBest(e,index){
      if(index==0&&e.mp.changedTouches[0].clientY-this.touchStartClient>150&&this.userSaveDataArr.length!==0){
        this.userDataArrPre=this.userDataArr.slice(1);
        this.userDataArr=[];
        this.userDataArr=this.userSaveDataArr;
        this.userSaveDataArr=[];
        this.userGroupCurrent=this.userDataArr.length-2;
        this.nowUserList=this.userDataArr[this.userDataArr.length-2];
        console.log(this.userDataArrPre,this.userDataArr,this.userSaveDataArr)
      }
    },
    //引导
    stepstart1(e){
      this.stepStartClientX=e.clientX;
    },
    stepend1(e){
      this.stepEndClientX=e.mp.changedTouches[0].clientX;
      if(this.stepShow=="step1"&&(this.stepStartClientX-this.stepEndClientX>0||this.stepStartClientX-this.stepEndClientX<0)){
        if(!this.nowUserList.photo){
          this.nowUserList.photo=[]
        }
        if(this.nowUserList.photo.length>1){
          this.userItemCurrent=1;
        }
        this.stepShow="step2";
      }
    },
    stepstart2(e){
      this.stepStartClientY=e.clientY;
    },
    stepend2(e){
      this.stepEndClientY=e.mp.changedTouches[0].clientY;
      if(this.stepShow=="step2"&&(this.stepStartClientY-this.stepEndClientY>30||this.stepStartClientY-this.stepEndClientY<-30)){
        if(this.userDataArr.length>1){
          this.userGroupCurrent=1;
        }
        this.stepShow="step3";
      }
    },
    stepFocus(item,enterPage){
      let me=this;
      if(!this.is_login){
        this.modalShow=true;
        return;
      }
      if(this.lookDetailShow){
        this.lookDetailShow=false;
        app.aldstat.sendEvent('index:喜欢');
        if(!this.focusActive){
          me.userDataArr.forEach((it,index)=>{
            if(it.ruuid==item.ruuid){
              me.userDataArr[index].isLike=true;
            }
          });
          this.focusActive=true;
          if(app.globalData.userStore.firstEntry){
            me.stepShow="step4";
            app.globalData.userStore.firstEntry=false;
          }
          setTimeout(function(){
            me.focusActive=false;
            me.lookDetailShow=true;
            me.lookNewDetail(item);
          },1000)
          let body={
            ruuid:item.ruuid,
            type:1,
            enter_page:enterPage,  // 1.普通 2.每日精选 3.喜欢我的人
            super_like:item.super_like || false,
            is_top:item.is_top || false,
          }
          api.userpageOperation(body).then(res=>{
            
          });
          return;
        }
      }
      // if(item.isLike){
      //   this.focusActive=false;
      //   setTimeout(()=>{
      //     this.nowUserList.isLike=false;
      //   })

      //   me.userDataArr.forEach((it,index)=>{
      //     if(it.ruuid==item.ruuid){
      //       item.isLike=false;
      //       me.userDataArr.splice(index,1,item);
      //     }
      //   });
      //   //取消喜欢
      //   api.cancelLike({ruuid:item.ruuid}).then(
      //     ()=>{

      //     }
      //   )
      //   return;
      // }
    },

    //每日精选
    changeBestSelect(e){
      this.stepFocus(e.mp.detail,2)
    },
    //关闭登录框
    closeModal(){
      this.modalShow=false;
    },
    /* *距离 */
    distanceChanging(e) {
      this.distanceNum=e.mp.detail.value;
    },
    distanceChanged(e){
      // this.updatedSetInfo();
    },
    /** * 年龄范围 */
    heighValueChangeAction (e) {
      this.agelow=parseInt(e.mp.detail.minValue);
      this.ageheigh=parseInt(e.mp.detail.maxValue);
      this.areaVal=[this.agelow,this.ageheigh];
      // this.updatedSetInfo();
    },
    //关闭vip分享
    chargeVipClose(){
      this.chargeVipShow=false;
    },
  },
  onShareAppMessage: function(res) {  
    let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid;
    if(res.from=='button'){   
      let title = `${this.userInfo.nickname}邀您帮忙加速，领取免费无限体验通行卡，点击帮他加速一下`; 
      let path = `pages/common/index/main?sharRuuid=${meRuuid}&type=vip`; 
      return this.onShareAppMessage(title,path); 
    }else{
      let path = `pages/common/index/main?sharRuuid=${meRuuid}`;  
      return this.onShareAppMessage('',path);
    }
    
  }, 
}
</script>

<style lang="scss" scoped>
.rangeBtn{
  width:48rpx;
  height:48rpx;
  border-radius:50%;
  background:#fff;
  border:1px solid #f0f0f0;
  box-shadow: 0 0 4rpx 0 #ddd;
}
.home-page{
  width:100%;
  height:100vh;
  background:#fff;
  // .main-tab-box{
  //   width:100%;
  //   height:100%;
    // overflow:hidden;
    // position:relative;
    // .main-tab-content{
    //   height:100%;
    //   width:100%;
      // overflow-y: scroll;
      // position:absolute;
    // }
    // .main-tab-one{
    //   transform:translate(-100%, 0px) translateZ(0px);
    //   transition:all .4s;
    // }
    // .main-tab-two{
    //   transform:translate(100%, 0px) translateZ(0px);
    //   transition:all .4s;
    // }
    // .main-tab-index{
    //   transform:translate(0px, 0px) translateZ(0px);
    //   transition:all .4s;
    // }
  // }
  .main-tab-content{
    height:100%;
    width:100%;
    position:absolute;
  }
  .user-content{
    width:100%;
    padding:20rpx;
    position: relative;
    .directToast{
      width:700rpx;
      height:84vh;
      position: absolute;
      border-radius:24rpx;
      top:0;
      bottom:0;
      left:0;
      right:0;
      margin:auto;
      z-index:9999;
      background: rgba(0,0,0,.7);
      .step{
        width:100%;
        height:100%;
        position: absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        .singleDiv{
          span{
            width:252rpx;
            height:50rpx;
            font-size:36rpx;
            font-family:FiraSans-Regular;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:44rpx;
          }
        }
      }
      .step1{
        width:100%;
        height:100%;
        position: absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        display:flex;
        align-items: center;
        justify-content: center;
        .singleDiv{
          width:260rpx;
          height:240rpx;
          text-align:center;
          img{
            width:202rpx;
            height:176rpx;
            display:block;
          }
          span{
            margin-top:14rpx;
          }
        }
      }
      .step2{
        position: absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        display:flex;
        align-items: center;
        justify-content: center;
        .singleDiv{
          width:260rpx;
          height:280rpx;
          text-align:center;
          img{
            width:168rpx;
            height:200rpx;
            display:block;
            margin:0 auto;
          }
          span{
            margin-top:14rpx;
          }
        }
      }
      .step3{
        position: relative;
        width:100%;
        height:100%;
        .singleDiv{
          width:320rpx;
          height:250rpx;
          position: absolute;
          bottom:28rpx;
          right:30rpx;
          img{
            width:244rpx;
            height:194rpx;
            display:block;
            position:absolute;
            right:0;
            bottom:0;
          }
          span{
            width:100%;
            position:absolute;
            top:0;
            left:0;
          }
        }
      }
    }
    .swiper-box{
      width:700rpx;
      height:84vh;
      margin:auto;
      box-shadow:0rpx 4rpx 6rpx 0rpx rgba(239,241,246,0.36);
      border:1rpx solid #fff;
      border-radius:24rpx;
      background:#EFF1F6;
      position:relative;
      .indicator-box{
        width:100%;
        position:absolute;
        top:22rpx;
        z-index:1000;
        .indicator-group{
          width:70%;
          margin:auto;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:16rpx 16rpx 0;
          span{
            flex:1;
            display:inline-block;
            height:6rpx;
            margin-right:20rpx;
            border-radius:3rpx;
            background:rgba(0,0,0,.2);
            &:last-child{
              margin-right:0;
            }
          }
          .active{
            background:#fff;
          }
        }
      }
      .user-info{
        position:absolute;
        bottom:0;
        width:100%;
        height:186rpx;
        z-index:200;
        padding:0 22rpx 0 34rpx;

        .text{
          width:65vw;
          font-size:64rpx;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:#fff;
          // padding-top:20rpx;
          .vip-cap-box{ 
            padding-left:10rpx;
            .vip-cap{
              width:52rpx;
              height:52rpx;
            }
          } 
          .name{
            max-width:50vw;
            margin-right:24rpx;
          }
          span{
            display:inline-block;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          
          // .vip-sign{
          //   width:78rpx;
          //   height:48rpx;
          //   margin-bottom:15rpx;
          //   margin-left:10rpx;
          // }
        }
        .add-heart{
          width:128rpx;
          height:128rpx;
          border-radius: 50%;
          background:#fff;
          // margin-top:30rpx;
          .heart-item{
            position:relative;
            width:100%;
            height:100%;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            .img{
              display:block;
              min-width:52rpx;
              min-height:44rpx;
              max-width:52rpx;
              max-height:44rpx;
              margin-top:20rpx;
              // transform: scale(1) !important;
              // transition: all .2s !important;
            }
            .add-heart-active{
              transform: scale(1.2) !important;
              transition: all .2s !important;
            }
            p{
              width:100%;
              font-size:22rpx;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(78,87,97,1);
              line-height:32rpx;
            }
          }
        }
      }
      .user-info-box{
        position:relative;
        border-radius:24rpx;
        .user-group{
          width:100%;
          height:100%;
          .swiper-img-box{
            width:100%;
            border-radius:24rpx;
            .swiper-img-position{
              width:100%;
              height:100%;
              border-radius:24rpx;
              position:relative;
              .modal{
                width:100%;
                height:449rpx;
                position:absolute;
                bottom:0;
                background:linear-gradient(360deg,rgba(0,0,0,0.5) 0%,rgba(86,86,86,0.36) 57%,rgba(255,255,255,0) 100%);
                border-radius:24rpx;
              }
              // .img{

              // }
            }
          }
        }
      }

    }
  }

  .user-list-null{
    width:100%;
    height:100%;
    .user-header{
      width:512rpx;
      height:512rpx;
      margin:13.5vh auto 0;
      .wave {
        position: relative;
        width:512rpx;
        height:512rpx;
        text-align: center;
        line-height: 456px;
        font-size: 28px;
        color: #FF5470;
        // border:1rpx solid #474D5D;
        border-radius:50%;
        .circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          width: calc(100%); /* 减去边框的大小 */
          height: calc(100%);/* 减去边框的大小 */
          border: 2px solid #FF5470;
          border-color: #FF5470;
          &:first-child {
            animation: circle-opacity 2s infinite;
          }
          &:nth-child(2) {
            animation: circle-opacity 2s infinite;
            animation-delay: 1s;
          }
          &:nth-child(3) {
            animation: circle-opacity 2s infinite;
            animation-delay: 1.5s;
          }
          @keyframes circle-opacity{
            from {
                opacity: 1;
                transform: scale(0);
            }
            to {
                opacity: 0;
                transform: scale(1);
            }
          }
        }
        .content-img{
          position:absolute;
          top:50%;
          left:50%;
          width:144rpx;
          height:144rpx;
          border-radius:50%;
          margin-top:-72rpx;
          margin-left:-72rpx;
          z-index:10;

        }
      }
    }
    .text-hit{
      padding:0 170rpx;
      margin:80rpx auto 66rpx;
      font-size:28rpx;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:#808892;
    }
    .find-btn{
      width:548rpx;
      height:90rpx;
      line-height:90rpx;
      margin:auto;
      color:#fff;
      font-size:28rpx;
      font-weight:600;
      background:linear-gradient(162deg,rgba(253,114,146,1) 0%,rgba(253,94,44,1) 100%);
      border-radius:45rpx;
    }
    .search-user-list-footer{
      position:fixed;
      top:0;
      bottom:0;
      left:0;
      right:0;
      width:100%;
      height:100%;
      z-index:20;
      .search-modal{
        width:100%;
        height:100%;
        background:rgba(0,0,0,.6);
        z-index:9;
      }
      .search-content{
        position:absolute;
        bottom:0;
        width:100%;
        height:750rpx;
        background:#fff;
        z-index:10;
        border-top-left-radius:30rpx;
        border-top-right-radius:30rpx;
        .title{
          width:100%;
          height:128rpx;
          line-height:128rpx;
          color:#354052;
          font-size:32rpx;
          padding-right:30rpx;
          border-bottom:1rpx solid #D3D7DC;
          .close-search{
            &:active{
              opacity:.7;
            }
          }
        }
        .main{
          width:100%;
          .group{
            padding:0 70rpx;
            margin:52rpx auto 4rpx;
            .group-title{
              span{
                font-size:36rpx;
                font-family:PingFangSC-Medium;
                font-weight:500;
              }
              .scope{
                color:#4E5761;
              }
            }
          }
          .search-btn{
            position:absolute;
            bottom:48rpx;
            left:50%;
            margin-left:-44%;
            width:88%;
            height:88rpx;
            line-height:88rpx;
            border-radius:44rpx;
            color:#FFf;
            background:#FF5E66;
            font-size:32rpx;
            &:active{
              opacity:.7;
            }
          }
        }
      }
    }
  }
}

</style>

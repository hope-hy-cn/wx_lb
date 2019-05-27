<template>
<scroll-view scroll-y="true" scroll-with-animation="true" style="height:100vh;"   @scroll="scroll" >
  <div class="user-detail-page"> 
    <!-- <head-back  @goBack="goBack"  :title="scrollIndex==0?'':userInfo.nickname"  :background="scrollIndex==0?'transprent':'#fff'" :color="scrollIndex==0?'#fff':'#4e5761'"></head-back> -->
    <div class="head-back" @click="goBack"  :style="'height:'+headHeight+'rpx;padding-top:'+headPadding+'rpx;'">  
      <div class="icon-box">
        <image src="/static/image/home-icon.png" class="home-cion"></image>
      </div> 
    </div>
    <!--头部信息-->
    <div class="head-box"> 
      <div class="head-bg-img"> 
        <image mode="aspectFill" src="/static/image/detail-bg.png" alt="" class="img"/>
      </div>
      <div class="head-user-info">    
        <div class="head-img"> 
          <div class="vip-cap-box" v-if="userInfo.is_vip">
            <image src="/static/image/vip-cap.png" class="vip-cap"></image>
          </div>
          <!-- <image mode="aspectFill" :src="userInfo.photo[0].link+'?x-oss-process=image/resize,w_50'" alt="" class="img"/> -->
          <image-loader :src="headerLink?headerLink+'?x-oss-process=image/resize,w_100':'/static/image/user.png'" width="100%" height="100%" image-style="border-radius:50%;"></image-loader>
        </div>
        <div class="text-center name">{{userInfo.nickname}}<span v-if="userInfo.nickname&&userInfo.age">，</span>{{userInfo.age}} <span class="on-line" v-if="onlineBool"></span></div>
        <div class="text-center introduce">{{userInfo.introduce}}</div>
        <!-- <div class="text-center text-info">{{userInfo.sex==1?'男':'女'}} · {{userInfo.age}} <span v-if="userInfo.age&&userInfo.constellation"> · </span>{{userInfo.constellation?userInfo.constellation:''}}<span v-if="userInfo.constellation&&userInfo.city"> · </span>{{userInfo.city}}</div>
        <div class="text-center text-info">{{userInfo.industry}}<span v-if="userInfo.industry&&userInfo.school"> · </span>{{userInfo.school}}</div> -->
      </div>
    </div>  
    
    <div class="tag-list">
      <p class="tag-item" :class="{'tag-item-active':titleHighlight==0}" @click="changeTabbar(0)">主页</p>
      <p class="tag-item" :class="{'tag-item-active':titleHighlight==1}" @click="changeTabbar(1)">个人资料</p>
    </div>

    <!-- content-box -->
    <div class="content-box" :class="{'items-one-active':titleHighlight==1}" :style="'height:'+contentHeight+';overflow:hidden;'">
      <div class="content-items" style="overflow:hidden;">
        <!--主页-->
        <div class="homepage">
          <div class="content-group">  
            <div class="title">我的相册</div>
            <div class="photo-box"> 
              <scroll-view scroll-x class="scroll-view"> 
                <div class="photo-img" @click="previewImage(item)" v-for="(item,index) in  imgUrls" :key="index">
                  <!-- <image mode="aspectFill" :src="item.link" alt="" class="img"/> -->
                  <image-loader :src="item.link+'?x-oss-process=image/resize,w_400'" width="100%" height="100%" image-style="border-radius:6rpx;"></image-loader>
                </div>
              </scroll-view> 
            </div>
          </div> 
          <div style="margin-top:24rpx;"> 
            <block v-for="(item,index) in artData" :key="index">
              <news-list :dataItem="item"  @leaveWord="leaveWord" @jumpTopic="jumpTopic(item)"  @isLogin="checkIsLogin" @share="shareItem"> </news-list> 
            </block> 
          </div>
        </div>
      </div>

      <!--资料-->
      <div class="content-items">
        <div class="basicData" style="box-sizing:border-box;">
          <div class="rz-group">
            <div class="title">基本资料</div>  
            <div class="main-info singleInfoList">
              <div class="listItem" v-for="(item,index) in userInfoList" :key="index">{{item}}</div>
            </div> 
          </div> 
          <!-- 认证信息 -->
          <div class="rz-group">
            <div class="title">认证信息</div>  
            <div class=" main-info">
              <i-cell-group > 
                <i-cell title="身份证" i-class="user-cell" @click.stop="jumpCaUrl(userCaDetailInfo,'id')"> 
                  <image slot="icon" class="cell-icon-img"   src="/static/image/sfz-active.png" v-if="userCaDetailInfo.id.is_ca&&userCaDetailInfo.id.detail"></image> 
                  <image slot="icon" class="cell-icon-img"   src="/static/image/sfz.png"  v-else></image> 
                  <div slot="footer" :class="{'footer-pd-rt':!userCaDetailInfo.id.detail||user_ca_state.id_state==2}" @click.stop="jumpCaUrl(userCaDetailInfo,'id')">
                      <div class="id-text"  v-if="userCaDetailInfo.id.is_ca&&userCaDetailInfo.id.detail">
                        <div v-if="user_ca_state.id_state==2">
                          <span class="name">{{userCaDetailInfo.id.name}}**</span>&nbsp;&nbsp;
                          <span class="card-no">{{userCaDetailInfo.id.id_card}}****</span>
                        </div> 
                        <div class="null-text" v-else>Ta已认证，请您认证后查看<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div>
                      </div> 
                      <p class="null-text" v-else>该用户尚未认证</p> 
                  </div>
                </i-cell> 
                <i-cell title="学历" i-class="user-cell" @click.stop="jumpCaUrl(userCaDetailInfo,'education')">
                  <image slot="icon" class="cell-icon-img"   src="/static/image/xueli-active.png" v-if="userCaDetailInfo.education.is_ca&&userCaDetailInfo.education.detail"></image> 
                  <image slot="icon" class="cell-icon-img"   src="/static/image/xueli.png" v-else></image> 
                  <div slot="footer" :class="{'footer-pd-rt':!userCaDetailInfo.education.detail ||user_ca_state.education==2}" @click.stop="jumpCaUrl(userCaDetailInfo,'education')">
                      <div class="id-text"  v-if="userCaDetailInfo.education.is_ca&&userCaDetailInfo.education.detail">
                        <div v-if="user_ca_state.education==2 ">
                          <span class="name">{{userCaDetailInfo.education.education}}·{{userCaDetailInfo.education.school}}</span> 
                        </div> 
                        <div class="null-text" v-else>Ta已认证，请您认证后查看<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div> 
                      </div>
                      <p class="null-text" v-else>该用户尚未认证</p> 
                  </div>
                </i-cell> 
                <i-cell title="微信"  i-class="user-cell" @click.stop="jumpCaUrl(userCaDetailInfo,'wechat')">
                  <image slot="icon" class="cell-icon-img"   src="/static/image/wx-info-active.png" v-if="userCaDetailInfo.wechat.is_ca&&userCaDetailInfo.wechat.detail"></image> 
                  <image slot="icon" class="cell-icon-img"   src="/static/image/wx-info.png" v-else></image> 
                  <div slot="footer" :class="{'footer-pd-rt':!userCaDetailInfo.wechat.detail||user_ca_state.wechat==2}" @click.stop="jumpCaUrl(userCaDetailInfo,'wechat')">
                      <div class="id-text"  v-if="userCaDetailInfo.wechat.is_ca&&userCaDetailInfo.wechat.detail">
                        <div v-if=" user_ca_state.wechat==2">
                          <span class="wechat-btn" @click.stop="fetchWx">索要微信</span> 
                        </div> 
                        <div class="null-text" v-else>Ta已认证，请您认证后查看<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div>
                      </div>
                      <p class="null-text" v-else>该用户尚未认证</p>  
                  </div>
                </i-cell>
                
                <!-- 手机号认证 -->
                <button class="get-phone" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-if="!user_ca_state.phone&&userCaDetailInfo.phone.is_ca">
                  <i-cell title="手机"  i-class="user-cell 111" >
                    <image slot="icon" class="cell-icon-img"   src="/static/image/phone-active.png" v-if="userCaDetailInfo.phone.is_ca"></image> 
                    <image slot="icon" class="cell-icon-img"   src="/static/image/phone.png" v-else></image> 
                    <div slot="footer" :class="{'footer-pd-rt':!userCaDetailInfo.phone.detail||user_ca_state.phone}" >
                        <!-- <div class="id-text"  v-if="userCaDetailInfo.phone.is_ca" >  -->
                            <div v-if="user_ca_state.phone">
                              <span class="name">{{userCaDetailInfo.phone.detail}}</span> 
                            </div> 
                            <div class="null-text" v-else>Ta已认证，请您认证后查看<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div> 
                        <!-- </div>  -->
                        <!-- <p class="null-text" v-else>该用户尚未认证</p>  -->
                    </div>
                  </i-cell>  
                </button>  
                <i-cell title="手机"  i-class="user-cell 222"  v-if="!userCaDetailInfo.phone.is_ca">
                  <image slot="icon" class="cell-icon-img"   src="/static/image/phone-active.png" v-if="userCaDetailInfo.phone.is_ca"></image> 
                  <image slot="icon" class="cell-icon-img"   src="/static/image/phone.png" v-else></image> 
                  <div slot="footer" :class="{'footer-pd-rt':!userCaDetailInfo.phone.detail ||user_ca_state.phone}">
                      <div class="id-text"  v-if="userCaDetailInfo.phone.is_ca" > 
                          <div v-if="user_ca_state.phone">
                            <span class="name">{{userCaDetailInfo.phone.detail}}</span> 
                          </div> 
                      </div> 
                      <p class="null-text" v-else>该用户尚未认证</p> 
                  </div>
                </i-cell> 

                <i-cell title="手机"  i-class="user-cell 333"  v-if="userCaDetailInfo.phone.is_ca&&user_ca_state.phone">
                  <image slot="icon" class="cell-icon-img"   src="/static/image/phone-active.png"></image>  
                  <div slot="footer" class="footer-pd-rt">
                      <div class="id-text">
                        <span class="name">{{userCaDetailInfo.phone.detail}}</span>  
                      </div>  
                  </div>
                </i-cell>
                
                <i-cell title="房产信息"  i-class="user-cell"  @click.stop="jumpCaUrl(userCaDetailInfo,'house')">
                  <image slot="icon" class="cell-icon-img"   src="/static/image/house-active.png" v-if="userCaDetailInfo.house.is_ca&&userCaDetailInfo.house.detail"></image> 
                  <image slot="icon" class="cell-icon-img"   src="/static/image/house.png" v-else></image> 
                  <div slot="footer" :class="{'footer-pd-rt':!userCaDetailInfo.house.detail||user_ca_state.house==2}" @click.stop="jumpCaUrl(userCaDetailInfo,'house')">
                      <div class="id-text"  v-if="userCaDetailInfo.house.is_ca&&userCaDetailInfo.house.detail" > 
                          <div v-if="user_ca_state.house==2">
                            <span class="name">已购房</span> 
                          </div> 
                          <div class="null-text" v-else>Ta已认证，请您认证后查看<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div> 
                      </div> 
                      <p class="null-text" v-else>该用户尚未认证</p> 
                  </div>
                </i-cell> 
                <i-cell title="车辆信息" i-class="user-cell"  @click.stop="jumpCaUrl(userCaDetailInfo,'car')">
                  <image slot="icon" class="cell-icon-img"   src="/static/image/Cert-car-active.png" v-if="userCaDetailInfo.car.is_ca&&userCaDetailInfo.car.detail"></image> 
                  <image slot="icon" class="cell-icon-img"   src="/static/image/Cert-car.png" v-else></image> 
                  <div slot="footer" :class="{'footer-pd-rt':!userCaDetailInfo.car.detail||user_ca_state.car==2}"  @click.stop="jumpCaUrl(userCaDetailInfo,'car')">
                      <div class="id-text"  v-if="userCaDetailInfo.car.is_ca&&userCaDetailInfo.car.detail">  
                          <div v-if="user_ca_state.car==2">
                            <span class="name">已购车</span> 
                          </div> 
                          <div class="null-text" v-else>Ta已认证，请您认证后查看<i-icon type="enter" size="16" i-class="right-icon" color="#BBBEC2"/></div>  
                      </div>
                      <p class="null-text" v-else>该用户尚未认证</p>
                  </div>
                </i-cell> 
              </i-cell-group>
            </div> 
          </div> 
        </div>
      </div>
    </div>

    <!-- 操作 -->
    <div class="footer-box text-center"> 
      <div class="img-box" @click="clickLike">
        <div class="heart-item" v-if="!isLike" >
          <img class="img" src="/static/image/heart-mode.png"/>
          <p>喜欢</p>
        </div>
        <div class="heart-item" v-if="isLike" >
          <img class="img" src="/static/image/add-heart.png"/>
          <p>已喜欢</p>
        </div>
        <!-- <image src="/static/image/detail-like.png" class="icon" :class="{'icon-active':likeIcon}"></image> -->
      </div>
      <p class="img-box" @click="clickChat">
        <image src="/static/image/detail-chat2.png" class="icon" :class="{'icon-active':chatIcon}"></image>
      </p> 
    </div>
    <div class="focusActive" v-show="focusActive">
      <image src="/static/image/like.gif" alt="" class="img"/>
    </div>
    <login-null v-if="modalShow" mode="modal" @close="closeModal"></login-null>

    <div class="menu-box" v-if="shareMenu">
      <div class="menu-modal" @click.stop="closeShare"></div>
      <div class="menu-content">
          <button class="text-center items" open-type="share" @click.stop="closeShare">转发</button>
          <!-- <div class="text-center items">查看详情</div> -->
          <div class="text-center items" @click.stop="closeShare">取消</div>
      </div>
    </div> 

  </div>
</scroll-view>
</template>

<script> 
import * as api from '@/utils/api' ;    
import newsStore from './../../common/news/store'; 
import loginNull from '@/components/login-null.vue' ;  
import headBack from '@/components/head-back.vue' ;     
import newsList from '@/components/news-list.vue' ; 
import indexStore from './../../common/index/store'  
const app = getApp()  
export default { 
  onLoad(opt){       
    let vm = this;  
    vm.scrollIndex=0;
    vm.headerLink='';
    vm.userInfo={};  
    vm.imgUrls= [];  
    vm.artData=[];  //日志列表  
    if(opt.userId){ 
      vm.ruuid=opt.userId;
      vm.getUserpageArt(opt.userId);
      vm.getUserDetail(opt.userId);
      vm.getMyCaInfo(opt.userId); 
    }else{
      wx.navigateBack({delta: 1})
    } 
    // let userId="robot-c900e2ae-1f5b-41ac-9396-46d4845d23e8";
    // vm.getUserpageArt(userId);
    // vm.getUserDetail(userId);
    // vm.getMyCaInfo(userId);

    //每次进来固定在主页详情
    this.titleHighlight=0; 
  },
  onShow: function () {  
    let vm = this;   
    if(this.ruuid){
      this.getMyCaInfo(this.ruuid);
    }
    if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
      this.is_login=true;   
      this.modalShow=false;
    } else { 
      this.is_login=false;   
    }  
  }, 
  components:{ 
    headBack,
    newsList, 
    loginNull
  }, 
  data () {
    return {  
      scrollIndex:0,  
      titleHighlight:0, //title下标
      headHeight:wx.getStorageSync('headHeight'),
      headPadding:wx.getStorageSync('headPadding'), 
      // headBackground:'transprent',
      ruuid:'',
      headerLink:'',  //头像
      userInfo:{},
      imgUrls: [],  
      artData:[],  //日志列表
      likeIcon:false,
      chatIcon:false,
      focusActive:false,
      userCaDetailInfo: {
          "id": {
            "is_ca": false,
            "detail": "",
            "name": "",
            "id_card": ""
          },
          "phone": {
            "is_ca": false,
            "detail": ""
          },
          "wechat": {
            "is_ca": false,
            "detail": ""
          },
          "education": {
            "is_ca": false,
            "detail": "",
            "education": "",
            "school": ""
          },
          "car": {
            "is_ca": false,
            "detail": ""
          },
          "house": {
            "is_ca": false,
            "detail": ""
          }, 
      },
      can_look:false, //是否有查看权限
      user_ca_state:{
        car:0,
        education:0,
        house:0,
        id_state:0,
        wechat:0,
        phone:'',
      }, //是否在审核中
      contentHeight:'auto', 
      userInfoList:[],
      isLike:false,//是否喜欢
      onlineBool:false,
      is_login:false,
      modalShow:false, 
      shareData:{},
      shareMenu:false,
    }
  },  
  methods: {   
    jumpTopic(item){
      if(!this.is_login){
        this.modalShow=true;
        return;
      }
      wx.navigateTo({url:`./../../news-pages/tag-list/main?topicid=${item.topic_id}&topic=${item.topic}`});
    },
    goBack(){  
      let url = `./../../common/index/main`;
      wx.switchTab({url});  
    },   
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
    //获取查看用户的资料
    getUserDetail(uid){ 
      let vm = this; 
      api.getShareUserInfo({ruuid:uid}).then(res=>{
        if(res.data.code==300000){
          if(res.data.data){ 
            vm.getUserOnline(res.data.data.accid);
            vm.userInfo=res.data.data;
            vm.isLike=res.data.data.is_liked;
            vm.userInfoList=[];
            vm.userInfoFilter();
            vm.imgUrls=res.data.data.photo;
            vm.headerLink=res.data.data.head_pic; 
          } 
        }
      })
    },
    userInfoFilter(){
      const {age,marital_status,constellation,city,height,weight,industry,income,zodiac,education,nation}=this.userInfo;
      //年龄
      if(age){
        this.userInfoList.push(age+'岁')
      }
      //婚姻状况
      if(marital_status==0){
        this.userInfoList.push('未婚')
      }else if(marital_status==1){
        this.userInfoList.push('结婚')
      }else if(marital_status==2){
        this.userInfoList.push('离婚')
      }
      //星座
      if(constellation){
        this.userInfoList.push(constellation)
      }
      //所在地
      if(city){
        this.userInfoList.push(city)
      }
      //身高
      if(height){
        this.userInfoList.push(height+'cm')
      }
      //体重
      if(weight){
        this.userInfoList.push(weight+'kg')
      }
      //收入
      if(income){
        this.userInfoList.push(income)
      }
      //属性
      if(zodiac){
        this.userInfoList.push('属'+zodiac)
      }
      //教育程度
      if(education){
        this.userInfoList.push(education)
      }
      //种族
      if(nation){
        this.userInfoList.push(nation)
      }
      //职业
      if(industry){
        this.userInfoList.push(industry)
      }
    },
    //点击喜欢 
    clickLike(){
      app.aldstat.sendEvent('detail:分享给好友');
      let vm = this;
      if(!vm.is_login){
        vm.modalShow=true;
      }else{
         if(!vm.likeIcon&&!this.isLike){
          vm.likeIcon=true;
          vm.isLike=true;
          vm.focusActive=true;
          let likeTime=setTimeout(()=>{
            vm.likeIcon=false;
            clearTimeout(likeTime);
          },200)
          let operationTime=setTimeout(()=>{
            vm.focusActive=false;
            let body={
              ruuid:vm.userInfo.ruuid,
              type:1,
              enter_page:1,  // 1.普通 2.每日精选 3.喜欢我的人
              super_like:vm.userInfo.super_like || false,
              is_top:vm.userInfo.is_top || false,
            }
            api.userpageOperation(body).then(res=>{
              if(res.data.code==300000){

              }
            });
            indexStore.state.currentList.isLike=true;
            clearTimeout(operationTime);
          },1000)
          return
        }
        if(this.isLike){
          let me=this;
          wx.showModal({
            title: '提示',
            content: '真的要取消喜欢吗？',
            success(res) {
              if (res.confirm) {
                me.isLike=false;
                me.likeIcon=false;
                api.cancelLike({ruuid:vm.userInfo.ruuid}).then(
                  ()=>{
                    
                  }
                );
                indexStore.state.currentList.isLike=false;
                return;
              } else if (res.cancel) {
                return;
              }
            }
          })
        }
      }  
    },
    //点击聊天 
    clickChat(){
      let body={
        accid:this.userInfo.accid,
        head_pic:this.userInfo.head_pic,
        nick_name:this.userInfo.nickname,
        ruuid:this.userInfo.ruuid, 
        pair_type:0,
        pair_time:0,
        countA:-1,
        countB:-1,
        status:!this.userInfo.is_liked?0:this.userInfo.is_super_like?1:2,
      }
      if(app.globalData.recentChatList[this.userInfo.accid]){
        body.countA=app.globalData.recentChatList[this.userInfo.accid].countA?app.globalData.recentChatList[this.userInfo.accid].countA:0;
        body.countB=app.globalData.recentChatList[this.userInfo.accid].countB?app.globalData.recentChatList[this.userInfo.accid].countB:0;
        app.globalData.recentChatList[this.userInfo.accid].countA=0;
        app.globalData.recentChatList[this.userInfo.accid].countB=0; 
      }
      if(!this.chatIcon){
        this.chatIcon=true;
        let chatTime=setTimeout(()=>{
          this.chatIcon=false;
          if(!this.is_login){
            this.modalShow=true;
          }else{
            wx.navigateTo({url:`./../../chat-page/chat-p2p-page/main?item=${JSON.stringify(body)}`});
          } 
          clearTimeout(chatTime);
        },200)
      }
    }, 
    //获取用户日志
    getUserpageArt(ruuid){
      let vm = this;
      let body={
        ruuid:ruuid,
        page:1,
        size:3
      };
      api.fetchUserpageArt(body).then(res=>{
        if(res.data.code==300000){
          res.data.data.data?vm.artData=res.data.data.data:vm.artData=[]; 
        }
      });
    }, 
    //跳转日志详情
    leaveWord(item){
      if(!this.is_login){
        this.modalShow=true;
        return;
      }
      newsStore.state.newsDataItem=item;
      wx.navigateTo({url:`./../../news-pages/news-detail/main`});
    },
    //获取在线状态
    getUserOnline(val){
      let vm = this;
      api.fetchUserOnline({accid:val}).then(res=>{
        if(res.data.code==300000){
          vm.onlineBool=res.data.data;
        }
      })
    },
    //获取认证信息
    getMyCaInfo(val){
      let vm = this;
      api.fetchCaLook({other_uuid:val}).then(res=>{
        if(res.data.code==300000&&res.data.data){
          vm.userCaDetailInfo=res.data.data.ca_detail;
          vm.can_look=res.data.data.can_look; 
          vm.user_ca_state=res.data.data.user_state;
        }
      })
    },
    //获取手机号
    getPhoneNumber (e) {  
      let vm = this;
      if(e.mp.detail.errMsg=='getPhoneNumber:fail user deny'){
        console.log('用户拒绝授权手机号');
      }else{ 
        let body={ 
          openid:wx.getStorageSync('openId'),
          encrypt_data:e.mp.detail.encryptedData,
          iv:e.mp.detail.iv 
        };
        api.getDecode(body).then(res=>{ 
          if(res.data.code==300000){ 
            //  vm.updatPhone(res.data.data.phoneNumber);
             api.updateCaLook({phone:res.data.data.phoneNumber}).then(res=>{
               if(res.data.code==300000){
                 vm.getMyCaInfo();
                }
             });
          }else{
            wx.showToast({
                title: res.data.err,
                icon: 'none'
            })
          } 
        })
      }  
    },
    //跳转认证
    jumpCaUrl(item,type){
      let vm = this; 
      if(type=="id"){
        if(item.id.is_ca&&item.id.detail){ 
          if(vm.user_ca_state.id_state==0){
            wx.navigateTo({url:`./../../user-info/verify-page/id-verify/main`});
          }else if(vm.user_ca_state.id_state==1){
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '身份证信息正在审核中', 
            })
          } 
        }
      }else if(type=="education"){
        if(item.education.is_ca&&item.education.detail){
          if(vm.user_ca_state.education==1){
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '学历信息正在审核中', 
            })
          }else if(vm.user_ca_state.education==0||vm.user_ca_state.education==3){
            wx.navigateTo({url:`./../../user-info/verify-page/academic-verify/main`});
          } 
        }
      }else if(type=="wechat"){
        if(item.wechat.is_ca&&item.wechat.detail){
          if(vm.user_ca_state.wechat==1){
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '微信信息正在审核中', 
            })
          }else if(vm.user_ca_state.wechat==0||vm.user_ca_state.wechat==3){
            wx.navigateTo({url:`./../../user-info/verify-page/wx-verify/main`});
          } 
        }
      }else if(type=="house"){
        if(item.house.is_ca&&item.house.detail){
          if(vm.user_ca_state.house==1){
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '房产信息正在审核中', 
            })
          }else if(vm.user_ca_state.house==0||vm.user_ca_state.house==3){
            wx.navigateTo({url:`./../../user-info/verify-page/house-verify/main`});
          }  
        }
      }else if(type=="car"){
        if(item.car.is_ca&&item.car.detail){
          if(vm.user_ca_state.car==1){
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '房产信息正在审核中', 
            })
          }else if(vm.user_ca_state.car==0||vm.user_ca_state.car==3){
            wx.navigateTo({url:`./../../user-info/verify-page/car-verify/main`});
          } 
        }
      }
    },
    //索取微信
    fetchWx(){
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: '功能正在维护中...', 
      })
    },
    //浏览大图
    previewImage(item){
      let vm = this; 
      let urls = [];
      let body={
        ruuid:vm.ruuid,
        link:item.link,
        id:item.id,
      }
      api.photowallView(body).then(res=>{

      })
      vm.imgUrls.forEach((list,index)=>{
        urls.push(list.link);
      });
      wx.previewImage({
        current: item.link, // 当前显示图片的http链接
        urls: urls, // 需要预览的图片http链接列表 
      })
    },
    //切换 tabbar
    changeTabbar(val){
      if(val==1){
        app.aldstat.sendEvent('detail:详细资料');
      } 
      if(this.can_look){
        if(val==1&&!this.is_login){
          this.modalShow=true;
          return;
        }
        this.titleHighlight=val;
        if(val==1){
          let me=this;
          this.computeDom('.basicData').then(
            (res)=>{
              me.contentHeight=res.height+20+'px';
            }
          );
        }else{
          let me=this;
          me.contentHeight='auto';
          // this.computeDom('.homepage').then(
          //   (res)=>{
          //     me.contentHeight=res.height+20+'px';
          //   }
          // );
        };
      }else{
        this.titleHighlight=val;
        // if(val==1&&this.is_login){
          
          // if(this.user_ca_state.id_state==1){
          //   wx.showModal({
          //     title: '提示',
          //     showCancel:false,
          //     content: '身份证信息正在审核中', 
          //   })
          // }else if(this.user_ca_state.id_state==0||this.user_ca_state.id_state==3){
          //   wx.showModal({
          //     title: '提示',
          //     content: '认证身份证后才可查看他人资料',
          //     confirmText:'去认证',
          //     success(res) {
          //       if (res.confirm) {
          //         wx.navigateTo({url:`./../../user-info/verify-page/id-verify/main`});
          //       } else if (res.cancel) {
          //         console.log('用户点击取消')
          //       }
          //     }
          //   })
          // }else{
          //   this.titleHighlight=val;
          // } 
        // }else if(val==1&&!this.is_login){
        //   this.modalShow=true;
        // } 
      } 
    },
    //页面滚动效果
    scroll (e) {
      let sTop = e.mp.detail.scrollTop;   
      if(sTop>50){
        this.scrollIndex=1; 
        // this.headBackground='#fff'
      } else {
        // this.headBackground='transprent'
        this.scrollIndex=0; 
      }   
    },
    //用户未登录
    checkIsLogin(){
      this.modalShow=true;
    },
     //关闭登录框
    closeModal(){
      this.modalShow=false;
    },
    //分享
    shareItem(item){ 
      this.shareData=item; 
      this.shareMenu=true;    
    },
    closeShare(){ 
      this.shareMenu=false;       
    },
  },
  onShareAppMessage: function(res) {  
    let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid; 
    if(res.from=='button'){   
      let title = this.shareData.content;
      let imgLink = this.shareData.pics?this.shareData.pics[0]:'';
      let path = `pages/common/index/main?sharRuuid=${meRuuid}&artId=${this.shareData.art_id}&type=news`; 
      return this.onShareAppMessage(title,path,imgLink);  
    }else{ 
      let age= this.userInfo.age!=''?`${this.userInfo.age}岁`:'';
      let city=  this.userInfo.city!=''?`家住${this.userInfo.city}。`:'。';
      let introduce=  this.userInfo.introduce!=''?`${this.userInfo.introduce}。`:'';
      let title = `${this.userInfo.nickname},${age}${city}来看看你们合不合得来！`;
      let imgLink = this.imgUrls[0].link;
      let path = `pages/common/index/main?sharRuuid=${meRuuid}&userId=${this.userInfo.ruuid}&type=user`;   
      return this.onShareAppMessage(title,path,imgLink);
    } 
  }, 
  onUnload(){
     app.globalData.userDataInfo={
      type: '',  //如何进入的 user->进入用户详情  news->进入帖子详情 否则为空
      sharRuuid: '', //全局保存推荐人ruuid   
      userId:  '',  //被查看用户的id
      artId: '',  //被查看帖子的id
    };
  },
}
</script> 
 
<style lang="scss" scoped> 
.user-detail-page{
  background:#F3F5F7;
  padding-bottom: 210rpx;
  .head-back{
    background:#fff;
    position:fixed;
    top:0;
    z-index:5000;
    width:100%;
    padding-left:10rpx;
    border-bottom:1rpx solid #F3F5F7;
    .icon-box{
      display: inline-block;
      padding:10rpx 80rpx 10rpx 18rpx
    }
    .home-cion{
      width:40rpx;
      height:36rpx;
    }
  }
  .head-box{
    .head-bg-img{
      width:100%;
      height:24vh;
      .img{
        width:100%;
        height:100%;
      }
    }
    .head-user-info{
      padding-top:124rpx;
      padding-bottom:58rpx;
      background:#fff;
      position: relative;
      .head-img{
        width:191rpx;
        height:191rpx;
        position: absolute;
        top:-98rpx;
        left:50%;
        margin-left:-98rpx;
        border-radius: 50%;
        border:5rpx solid #fff;
        .img{
          width:100%;
          height:100%;
          border-radius: 50%;
        }
      }
      .name{
        font-size:48rpx;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:#354052;
        .on-line{
          display:inline-block;
          width:16rpx;
          height:16rpx;
          margin-bottom:10rpx; 
          border-radius: 50%;
          background:linear-gradient(44deg,rgba(47,248,167,1) 0%,rgba(62,221,212,1) 100%);
        }
      }
      .introduce{
        font-size:28rpx;
        font-family:PingFangSC-Light;
        font-weight:300;
        color:#A1A7AE;
        padding:0 100rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        margin-top:6rpx;
      }
      .text-info{
        font-size:30rpx; 
        color:#4E5761;
        margin-top:16rpx;
      }
    }
  }

  .content-group{
    width:100%;
    background:#fff;
    // margin-top:24rpx;
    padding:30rpx 0;
    .title{
      padding:0 44rpx;
      font-size:30rpx;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:#354052;
    }
    .photo-box{
      width:100%;
      margin-top:24rpx; 
      padding-left:30rpx;
      overflow: hidden;
      .scroll-view{
        width: 100%; 
        white-space: nowrap;
      }
      .photo-img{
        display:inline-block;
        width:264rpx;
        height:372rpx;  
        margin-right:16rpx;
        .img{
          width:100%;
          height:100%;
          border-radius:6rpx;
        }
      }
    }
  }
  .footer-box{
    width:100%;
    position: fixed;
    bottom:0;
    left:0;  
    display:flex;
    justify-content:center;
    align-items:center;
    .img-box{
      width:176rpx;
      height:176rpx;
      display:inline-block;
      &:last-child{
        margin-left:76rpx;
      }
      .icon{
        width:100%;
        height:100%;
        transform:scale(1);
        transition: transform .2s;
      }
      .icon-active{
        transform:scale(1.2) !important;
        transition: transform .2s !important;
      }
      .heart-item{
          position:relative;
          width:128rpx;
          height:128rpx;
          background:rgba(255,255,255,1);
          box-shadow:0px 10rpx 24rpx 0px rgba(53,73,93,0.26);
          border-radius:50%;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          margin-top:18rpx;
          .img{ 
            display:block;
            width:52rpx;
            height:44rpx;
            margin-top:4rpx;
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
}
.main-info{
  width:100%;
  .tab-attr{ 
    width:100%;
    padding:0 30rpx;
    span{
      display:inline-block;
      color:#413C44;
      background:#F0EFF6;
      font-size:26rpx;
      padding:10rpx 26rpx;
      margin:10rpx;
      border-radius:8rpx;  
    }
  }
}
.singleInfoList{
  overflow:hidden;
  box-sizing: border-box;
  padding:0 36rpx;
  margin-top:28rpx;
  .listItem{
    display: flex;
    justify-content: center;
    align-items:center;
    height:48rpx;
    line-height:48rpx;
    padding:0 30rpx;
    margin-right:24rpx;
    margin-bottom:28rpx;
    background:rgba(240,239,246,1);
    border-radius:6rpx;
    float:left;
    font-size:26rpx;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(65,60,68,1);
  }
}
.menu-box{
    position: fixed;
    top:0;
    right:0;
    left:0;
    bottom:0;
    z-index:10001;
    .menu-modal{
        position: fixed;
        top:0;
        right:0;
        left:0;
        bottom:0; 
        background:rgba(0,0,0,.5); 
    }
    .menu-content{
        position: fixed;
        bottom:0;
        left: 0;
        z-index:10003; 
        width:100%;
        background:#EEEEEE; 
        animation: menu-fade-in .1s linear;
        .items{
            height:100rpx;
            line-height: 100rpx;
            background:#fff;
            border-bottom:1rpx solid #E1E6EB;
            &:last-child{
                border-bottom:0;
                margin-top:10rpx;
            }
            &:active{
                opacity: .6;
            }
        }
    }
}
@keyframes menu-fade-in {
  0% {  
    transform:translateY(500px)
  }   
  100% {  
    transform:translateY(0px)
  } 
}
</style>

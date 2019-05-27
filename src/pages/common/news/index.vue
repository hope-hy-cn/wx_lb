
<template>
  <div class="home-page">
    <head-back mode="tabs" @clickTab="clickTabs" :tabsList="tabsList" :currentTab="currentList"></head-back>
    <div class="swiper-container" :style="'padding-top:'+headHeight+'rpx'">
      <swiper
      class="swiper-main"
      :current="currentList"
      @change="currenChange($event)"
      >
        <swiper-item style="overflow-y: auto;">
          <best-news @jumpDetail="jumpDetail" @leaveWord="leaveWord" :currentPage="currentList" @isLogin="checkIsLogin" @share="shareItem"></best-news>
        </swiper-item>
        <swiper-item style="overflow-y: auto;">
          <recommend-list @jumpDetail="jumpDetail" @leaveWord="leaveWord" :currentPage="currentList" @isLogin="checkIsLogin" @share="shareItem"></recommend-list>
        </swiper-item>
        <swiper-item style="overflow-y: auto;">
          <div v-if="is_login" style="width: 100%;height: 100%;">
            <focus-list @jumpDetail="jumpDetail" @leaveWord="leaveWord" :currentPage="currentList" @isLogin="checkIsLogin" @share="shareItem" @bestClick="bestClick"></focus-list>
          </div>
          <login-null v-else></login-null>
        </swiper-item>
      </swiper>
      <div class="dispatchBtn" @click.stop="releaseDynamics" v-if="is_login">
        <img src="/static/image/addActive.png"/>
      </div>
      <div class="focusActive" v-if="focusActive">
        <image src="/static/image/like.gif" alt="" class="img"/>
      </div>
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
</template>
<script>
import * as api from '@/utils/api' ;
import headBack from '@/components/head-back.vue' ;
import bestNews from '@/components/best-news.vue';
import recommendList from '@/components/recommend-list.vue';
import focusList from '@/components/focus-list.vue'; 
import loginNull from '@/components/login-null.vue' ;  
import userStore from './../index/store.js';
import store from './store.js';
const app = getApp();
export default { 
  onLoad(){    
    let vm = this;  
    if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
      app.globalData.subscriber.on('UPDATE_MSG_LIST', (data)=>{ 
        wx.showTabBarRedDot({index:2}); 
      }); 
      if(JSON.parse(wx.getStorageSync('account'))){
        this.me_ruuid=JSON.parse(wx.getStorageSync('account')).uuid;
      }
    }  
  }, 
  onShow(){
    this.shareMenu=false;
    //从发布页出来
    if(store.state.isFresh){
      this.currentList=0;
    };
    if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
      this.is_login=true;   
      this.modalShow=false;
    } else { 
      this.is_login=false;   
    } 
  },
  data(){
    return {
      headHeight:wx.getStorageSync('headHeight'),
      headPadding:wx.getStorageSync('headPadding'),
      me_ruuid:'',
      tabsList:[{name:'最新'},{name:'推荐'},{name:'关注'}], 
      currentList:1,//当前页
      is_login:false,
      modalShow:false,
      shareData:{},
      shareMenu:false,
      bestVipBox:false, //vipbox
    };
  },
  components:{
    headBack,
    bestNews,
    recommendList,
    focusList,
    loginNull
  },  
  methods: { 
    //tabs切换
    clickTabs(item,index){
      this.currentList=index;
      // if(this.currentList==0){
      //   app.aldstat.sendEvent('news:最新');
      // }else if(this.currentList==1){
      //   app.aldstat.sendEvent('news:推荐');
      // }else if(this.currentList==2){
      //   app.aldstat.sendEvent('news:关注');
      // }
      if(this.currentList==0){
        app.aldstat.sendEvent('news:推荐');
      }
    },
    //接收列表组件，跳转日志详情
    leaveWord(item){
      store.commit('setItem',item);
      // store.state.newsDataItem=item;
      wx.navigateTo({url:`./../../news-pages/news-detail/main`});
    },
    //swiper切换
    currenChange(e){
      this.currentList=e.target.current;
      // if(this.currentList==0){
      //   app.aldstat.sendEvent('news:最新');
      // }else if(this.currentList==1){
      //   app.aldstat.sendEvent('news:推荐');
      // }else if(this.currentList==2){
      //   app.aldstat.sendEvent('news:关注');
      // }
      if(this.currentList==0){
        app.aldstat.sendEvent('news:推荐');
      }
    },
    releaseDynamics(){
      if(!this.is_login){
        this.modalShow=true;
      }else{
        wx.navigateTo({url:'./../../news-pages/my-dispatch-page/main'});
      }
    },
    //跳转详情
    jumpDetail(item){
      if(item.author_uuid){
        if(this.me_ruuid==item.author_uuid){
          wx.switchTab({url:`./../my-detail-page/main`});
        }else{
          wx.navigateTo({url:`./../user-detail-page/main?ruuid=${item.author_uuid}`});
        }
      }else{
        console.log('隐姓埋名');
      }
    },
    //去登录
    toLogin(){
      wx.navigateTo({url:`./../../login-page/login/main`});
    },
    //用户未登录
    checkIsLogin(){
      this.modalShow=true;
    },
    //分享
    shareItem(item){
      this.shareData=item; 
      this.shareMenu=true; 
      // setTimeout(()=>{
      //   wx.hideTabBar({});// 隐藏tabbar 
      // },50)
      
    },
    closeShare(){ 
      this.shareMenu=false; 
      // setTimeout(()=>{
        // wx.showTabBar({});// 显示tabbar   
      // },100) 
    },
    //判断是否是点入的vip弹框
    bestClick(){
      this.bestVipBox=true;
    },
    //关闭登录框
    closeModal(){
      this.modalShow=false;
    },
  }, 
  onShareAppMessage: function(res) {   
    let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid;
    if(res.from=='button'){    
      if(this.bestVipBox){
        let title = `${userStore.state.userInfo.nickname}邀您帮忙加速，领取免费无限体验通行卡，点击帮他加速一下`; 
        let path = `pages/common/index/main?sharRuuid=${meRuuid}&type=vip`; 
        this.bestVipBox=false;
        return this.onShareAppMessage(title,path);  
      }else{
        let title = this.shareData.content;
        let imgLink = this.shareData.pics?this.shareData.pics[0]:this.shareData.share_img;
        let path = `pages/common/index/main?sharRuuid=${meRuuid}&artId=${this.shareData.art_id}&type=news`; 
        return this.onShareAppMessage(title,path,imgLink);  
      }  
    }else{ 
      let path = `pages/common/index/main?sharRuuid=${meRuuid}`;  
      return this.onShareAppMessage('',path);
    } 
  }, 
   
}
</script>

<style lang="scss" scoped>
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

<template>
  <div class="user-books" :style="'padding-top:'+headHeight+'rpx'">
    <head-back title="影·音·书"  @goBack="goBack" ></head-back>
    <i-tabs :current="current"  color="#FF5E66" @change="handleChange">
      <i-tab key="1" i-class="tab-items" :title="'音乐('+musicDataList.length+')'"></i-tab>
      <i-tab key="2" i-class="tab-items" :title="'电影('+movieDataList.length+')'"></i-tab> 
      <i-tab key="3" i-class="tab-items" :title="'书籍('+bookDataList.length+')'"></i-tab>  
    </i-tabs>
    <div class="content" :style="{'padding-top':otherUid?'20rpx':0}">
      <div v-if="!otherUid">
        <div class="add-card" @click="searchCard" v-if="(musicDataList.length!=0&&current=='1')||(movieDataList.length!=0&&current=='2')||(bookDataList.length!=0&&current=='3')">
          <i-icon type="add" color="#1D2438" size="15"/>&nbsp;添加
        </div>
      </div> 
      <div v-if="current=='1'">
        <books-card height="166rpx;" flex="0 0 166rpx;" @clear="openVisible" v-for="(item,index) in musicDataList"  :title="item.name" :textMain="item.performer" :url="item.cover"   :item="item" :key="item"></books-card>
        <div class="null-img text-center" v-if="musicDataList.length==0">
          <image class="img"  src="https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/undraw_music.png"></image> 
          <div class="text" >{{otherUid?'该用户还未添加':'你还没有喜欢的音乐'}}</div>
          <div class="btn"  @click="searchCard"  v-if="!otherUid">添加</div>
        </div> 
      </div>
      <div v-if="current=='2'">

        <books-card  @clear="openVisible" v-for="(item,index) in movieDataList" :title="item.name" :textMain="item.director" :url="item.cover"  :textInfo="item.principal" :item="item" :key="item"></books-card>
        <div class="null-img text-center"  v-if="movieDataList.length==0">
          <image class="img"  src="https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/undraw_movie.png"></image> 
          <div class="text">{{otherUid?'该用户还未添加':'你还没有喜欢的电影'}}</div>
          <div class="btn"  @click="searchCard"  v-if="!otherUid">添加</div>
        </div> 
      </div>
      <div v-if="current=='3'"> 
        <books-card @clear="openVisible" v-for="(item,index) in bookDataList" :title="item.name" :textMain="item.author" :url="item.cover"  :textInfo="item.publishOrg" :item="item" :key="item"></books-card>
        <div class="null-img text-center"  v-if="bookDataList.length==0">
          <image class="img"  src="https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/undraw_book.png"></image> 
          <div class="text">{{otherUid?'该用户还未添加':'你还没有喜欢的书籍'}}</div>
          <div class="btn"  @click="searchCard"  v-if="!otherUid">添加</div>
        </div> 
      </div>
      
    </div>
    <!--<modal-box :visible="visible" :content="'确定删除'+clearTitle+'？'" subText="删除" @handleClick="handleClick" ></modal-box>-->
  </div>
</template>

<script> 
import * as api from '@/utils/api'  
import headBack from '@/components/head-back'
// import modalBox from '@/components/modal-box'  
import booksCard from '@/components/books-card'
import userInfo from './../../common/index/store'
const app = getApp()  
export default {
  onLoad(opt){   
    app.aldstat.sendEvent('影音书'); // 事件名称规范: 不超过255个字符 
    this.current=opt.tabsId;
    if(opt.other_uid){ 
      this.otherUid=opt.other_uid;
    }else{
      this.otherUid='';
    }   
  },
  onShow(){
    
    this.getDataList(this.otherUid);
  }, 
  data () {
    return {    
        headPadding:wx.getStorageSync('headPadding'), 
        headHeight:wx.getStorageSync('headHeight'),  
        current:'1',
        otherUid:'',
        musicDataList:[],
        movieDataList:[],
        bookDataList:[], 
        // visible:false,
        prdId:'', //删除id
        clearTitle:'',
    }
  },
  
  components: {
    headBack,
    booksCard,
    // modalBox
  },   
  methods: { 
    //返回上一级
    goBack(){
      wx.navigateBack({ delta: 1 }); 
    },  
    //tabs切换
    handleChange(e){  
      this.current=e.mp.detail.key 
    },
    //获取列表
    getDataList(ruuid=''){
      let vm = this; 
      let body={
        other_uuid:ruuid
      }
      api.getMovieMusicBookList(body).then(res=>{
        vm.musicDataList=[];
        vm.movieDataList=[];
        vm.bookDataList=[]; 
        setTimeout(()=>{
          if(res.data.code==300000){ 
            if(res.data.data.musics){
              vm.musicDataList=res.data.data.musics;
            }else{
              vm.musicDataList=[];
            }
            if(res.data.data.movies){
              vm.movieDataList=res.data.data.movies;
            }else{
              vm.movieDataList=[];
            }
            if(res.data.data.books){
              vm.bookDataList=res.data.data.books;
            }else{
              vm.bookDataList=[];
            }
            
          }
        },100); 
      })
    },
    //添加
    searchCard(){
      wx.navigateTo({url:`./../user-books-search/main?current=${this.current}`}) 
    },
    //删除
    openVisible(item){ 
      let vm = this; 
      if(!vm.otherUid){ 
        vm.clearTitle=item.name;
        vm.prdId=item.id; 
        // if(vm.photoList.length==1){ 
          wx.showModal({
            title: '提示',
            content: `确定删除${vm.clearTitle}？`,
            confirmText:'删除',
            success: function (res) {
              if (res.confirm) { 
                vm.clearList();
              }
            }
          })
        // } 
      } 
    },
    clearList(){ 
      let vm = this;
       let body={
          "id": this.prdId,
          "category": this.current=='2'? 0 : this.current=='1' ? 1 : 2
       }
       api.deleteMovieMusicBook(body).then(res=>{
         if(res.data.code==300000){ 
           vm.fetchInfo();
            wx.showToast({ title:'删除成功', icon: 'none'})
            vm.getDataList();  
         }
       })
    }, 
    /**获取用户信息 */
    fetchInfo(){
      let vm = this;
      api.getUserDetail().then(res=>{
        if(res.data.code==300000){ 
          userInfo.state.userInfo=res.data.data;  
        }
      })
    }, 
    // handleClick(val){
    //   this.visible=false; 
    //   if(val==='sub'){
    //     this.clearList();
    //   } 
    // }
  },
  onShareAppMessage: function(res) {  
    let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid;
    let path = `pages/common/index/main?sharRuuid=${meRuuid}`;  
    return this.onShareAppMessage('',path);
  }, 
}
</script>
<style>
.user-books .tab-items{
  padding:0 20rpx;
}
</style>
<style scoped lang="scss">  
.user-books{
  width:100%;
  height:100%;   
  .content{
    height:100%;
    padding:0 24rpx;
    .add-card{
      padding:24rpx 10rpx;
      font-size:30rpx;
    }
    .null-img{
      width:320rpx;
      height:340rpx;
      position:absolute;
      top:50%;
      left:50%;
      margin-top:-170rpx;
      margin-left:-160rpx;
      .img{
         width:320rpx;
         height:200rpx; 
      } 
      .text{
        font-size:26rpx;
        color:#BBBEC2;
        margin-top:20rpx;
      }
      .btn{
        width:160rpx;
        height:72rpx;
        line-height:72rpx;
        font-size:30rpx;
        color:#84838D;
        background:#fff;
        border-radius:36rpx;
        margin:20rpx auto 0;
        &:active{
          opacity:.8;
        }
      }
    }
  }
}
</style>

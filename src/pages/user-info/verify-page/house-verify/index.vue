<template>
  <div class="edit-info" :style="'padding-top:'+headHeight+'rpx'">
    <head-back title="房产认证"  @goBack="goBack" ></head-back>
    <div class="content">
      <div class="group-title">信息仅供此次认证使用，将严格保密</div> 
      <div class="main">
        <div class="main-box">
          <div class="house-img" @click="addCode(1)">
            <image  mode="scaleToFill"  :src="imgOnePage?imgOnePage:'/static/image/fcz01.png'" class="img"  />
          </div>
          <div class="title text-center">拍照房产证 第 1 页</div> 
        </div> 
        <div class="main-box">
          <div class="house-img" @click="addCode(2)">
            <image  mode="scaleToFill"  :src="imgtwoPage?imgtwoPage:'/static/image/fcz02.png'" class="img"  />
          </div>
          <div class="title text-center">拍照房产证 第 2 页</div> 
        </div> 
      </div> 
      <div class="footer-btn ">
        <div   class="sub-btn text-center" :class="{'null-btn':!imgtwoPage||!imgOnePage}" @click="postUrl"><span class="refresh-loading" v-if="!clickPoint"></span>提交</div>
      </div>
    </div> 
    <!-- loading -->
    <div class="loading-box" v-if="loadingShow" @click.stop="loadingShow=false">
      <div style="display: inline-block;">
        <image src="/static/image/succees-active.png" class="img"></image>
        <div class="text">提交成功</div>
      </div>
    </div>

  </div>
</template>

<script> 
import * as api from '@/utils/api' 
import {baseUrl} from '@/utils/config' 
import headBack from '@/components/head-back'
export default {
  onShow(){
    this.clickPoint=true;
  },
  data () {
    return {    
        headPadding:wx.getStorageSync('headPadding'), 
        headHeight:wx.getStorageSync('headHeight'),  
        imgOnePage:'',
        imgtwoPage:'',
        postIndex:0,  //提交的次数
        linkList:[],
        clickPoint:true,
        loadingShow:false,
    }
  },
  
  components: {
    headBack
  },   
  methods: { 
    //返回上一级
    goBack(){
      wx.navigateBack({ delta: 1 }); 
    },
    addCode(val){
      let vm = this;
      wx.chooseImage({
        count: 1,
        sizeType: [ 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          if(val==1){
            vm.imgOnePage=tempFilePaths[0];
          }else{
            vm.imgtwoPage=tempFilePaths[0];
          }  
        }
      })
    },
    postUrl(){ 
      let vm = this;
      let pic_links=[];
      if(!vm.imgOnePage){
        wx.showToast({
            icon: "none",
            title:'请上传房产证第1页'
        });
        return;
      }else if(!vm.imgtwoPage){
        wx.showToast({
            icon: "none",
            title:'请上传房产证第2页'
        });
        return;
      }else{
        pic_links[0]=vm.imgOnePage;
        pic_links[1]=vm.imgtwoPage;
      }
      if(parseInt(vm.postIndex)+1<=pic_links.length){
        vm.postwxupload(pic_links[vm.postIndex]);
      }
    },
    postwxupload(src){
      let vm = this;
      if(vm.clickPoint){
        wx.uploadFile({
          url: `${baseUrl}public/file/wxupload`,
          filePath: src, 
          name: 'file',
          header: { "Content-Type": "multipart/form-data"},
          formData: { 
              'name':src,
              'source': 'CA',
              'file_name':'House'
          },
          success: function (res) {   
            vm.linkList.push(JSON.parse(res.data).link);
            vm.postIndex++; 
            vm.postUrl();
            if(vm.postIndex==2){
              vm.clickPoint=false;
              api.updateCaLook({house_front_pic:vm.linkList[0],house_reverse_pic:vm.linkList[1]}).then(msg=>{
                vm.clickPoint=true;
                if(msg.data.code==300000){ 
                  vm.loadingShow=true;
                  setTimeout(()=>{
                    vm.loadingShow=false;
                    vm.goBack();
                  },500) 
                  // wx.showToast({
                  //     icon: "none",
                  //     title:`上传成功`
                  // }); 
                } 
              }).catch(err=>{
                vm.clickPoint=true;
                vm.postIndex=0;
              }); 
            } 
          }, 
          complete: function () {
              wx.hideToast();  //隐藏Toast
          }
        })
        .onProgressUpdate((res) => {  
          wx.showToast({
              icon: "loading",
              title:`上传${res.progress}%`
          });
        }); 
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
<style>
page{
  background:#F0EFF6;
}
 
</style>
<style scoped lang="scss">

.edit-info{
  width:100%;
  height:100%;
  padding-bottom:20rpx;
  .content{ 
     .group-title{
        background:#F0EFF6;
        color:#413C44;
        padding:26rpx 44rpx;
        font-size:26rpx;
     }
     .main{ 
       width:100%;
       background:#fff;  
       padding-bottom:66rpx;
       .main-box{
         padding-top:66rpx;
       }
       .house-img{
          display:block;
          margin:0 auto;
          width:508rpx;
          height:320rpx;
          .img{
            width:100%;
            height:100%;
            border-radius:10rpx;
          }
       }
       .title{
          font-size:26rpx;
          color:#84838D;
          margin-top:16rpx; 
       } 
     }
     .footer-btn{
       margin-top:48rpx;
      .sub-btn{ 
        width:80%;
        height:90rpx;
        line-height:90rpx;
        font-size:30rpx;
        border:0 ; 
        border-radius:45rpx;
        margin:0 auto ;
        background:linear-gradient(162deg,rgba(253,114,146,1) 0%,rgba(253,94,44,1) 100%);
        color:#fff ;
        &:active{
          opacity:.9; 
        }
      }
      .null-btn{
        background:rgba(254,151,156,.5);
      }
     }
  } 
}
// loading
.loading-box{
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  width:100%;
  height:100%;
  z-index:20;
  background:rgba(0,0,0,.5); 
  display:flex;
  align-items: center;
  justify-content: center;
  .img{
    width:128rpx;
    height:128rpx;
    animation: living .5s linear;
  }
  @keyframes living {
      0%{
          transform: scale(0.5);
          opacity: 0;  
      }
      50%{
          transform: scale(1.2);  
          opacity: .5;   /*圆形放大的同时，透明度逐渐减小为0*/
      }
      100%{
          transform: scale(1);
          opacity: 1;
      }
  } 
  .text{
    font-size:30rpx;
    color:#fff;
  }
}
</style>

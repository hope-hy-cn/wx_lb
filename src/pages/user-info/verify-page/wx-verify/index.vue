<template>
  <div class="edit-info" :style="'padding-top:'+headHeight+'rpx'">
    <head-back title="微信认证"  @goBack="goBack" ></head-back> 
    <div class="content"> 

        <div class="input-group">
          <div class="input-group-box">
            <div class="main-name">微信号</div> 
            <input class="realInput" type="text" maxlength="30" v-model="wxCode"  placeholder="请输入微信号" placeholder-style="color:#A7A6B4;"/> 
          </div>   
        </div>  

        <div class="main"> 
          <div class="main-box">
            <div class="main-name">微信二维码</div>
            <div class="wx-code" @click="addCode">
              <image  mode="scaleToFill"  :src="imgUrl?imgUrl:'/static/image/erweima.png'" class="img"  />
            </div>
            <div class="title text-center">上传微信</div>
            <div class="text text-center">只有通过微信认证用户才可以查看您的微信</div>
          </div> 
        </div>   
          
      <div class="footer-btn "> 
        <div  class="sub-btn text-center" :class="{'null-btn':imgUrl==''&&wxCode==''}"  @click="subMsg"><span class="refresh-loading" v-if="!clickPoint"></span>提交</div>
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
        wxCode:'',  //微信号  
        imgUrl:'', //图片链接
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
    //切换tabs
    tabChange(val){
      this.tabsIndex=val;
    },
    //提交
    subMsg(){
      let vm =this;
      if(vm.imgUrl==''&&vm.wxCode!=''){
        vm.postDataInfo(vm.wxCode,'');
      } else { 
        vm.postIdUpload(vm.imgUrl);
      } 
    },
    //选择图片
    addCode(){
      let vm = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original','compressed'],
        sourceType: ['album','camera'],
        success (res) { 
          console.log(res);
          vm.imgUrl=res.tempFilePaths[0] 
        }
      })
    },
    postIdUpload(src){
      let vm = this; 
      if(vm.clickPoint){
        vm.clickPoint=false;
        wx.uploadFile({
          url: `${baseUrl}public/file/wxupload`,
          filePath: src, 
          name: 'file',
          header: { "Content-Type": "multipart/form-data"},
          formData: { 
              'name':src,
              'source': 'CA',
              'file_name':'wxCode'
          },
          success: function (res) {  
            vm.clickPoint=true;
            vm.postDataInfo(vm.wxCode,JSON.parse(res.data).link);
          },
          fail:function () {
              vm.clickPoint=true; 
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
    postDataInfo(wxNo,url){
      let vm = this;
      let body={
        wechat:wxNo,
        wechat_qr_code:url,
      }  
      if(vm.clickPoint){
        vm.clickPoint=false;
        api.updateCaLook(body).then(msg=>{
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
  .tabs-group{
    width:100%;
    height:88rpx;
    display:flex;
    align-items:center;
    justify-content:center;
    background:#fff;
    font-size:32rpx;
    .tabs-item{
      flex:1;
    }
    .tabs-item-active{
      color:#6DA6E9;
    }
  }
  .content{ 
     .input-group{
       height:216rpx;
       padding:48rpx; 
       background:#fff;
       margin-bottom:24rpx;
       .input-group-box{
          padding:0 12rpx;
          .main-name{  
            margin-bottom:36rpx;
          } 
          .realInput{  
            background:#fff;
            width:100%;
            color:#1D2438;
            font-size:30rpx; 
            border-bottom:1rpx solid #EDEEF1;
            padding:14rpx 0;
          } 
       }
        
      }
      .main-name{
        color:#413C44;
        font-size:30rpx; 
      }
     .main{
        height:640rpx;
        width:100%;
        background:#fff;
        display:flex;
        align-items:center;
        justify-content:center;  
        .main-name{ 
          padding-left:60rpx; 
          margin-bottom:56rpx;
        }
       .main-box{
         flex:1;
       }
       .wx-code{
          display:block;
          margin:0 auto;
          width:320rpx;
          height:320rpx;
          .img{
            width:100%;
            height:100%;
            border-radius:10rpx;
          }
       }
       .title{
          font-size:30rpx;
          color:#413C44;
          margin-top:50rpx;
          margin-bottom:12rpx;
       }
       .text{
         font-size:26rpx;
         color:#84838D;
         
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

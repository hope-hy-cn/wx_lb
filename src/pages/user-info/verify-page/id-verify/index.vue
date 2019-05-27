<template>
  <div class="edit-info" :style="'padding-top:'+headHeight+'rpx'">
    <head-back title="身份认证"  @goBack="goBack" ></head-back>
    <div class="content">
      <div class="group-title">请拍摄你的身份证</div> 
      <div class="main">
        <div class="main-box">
          <div class="car-group">
            <div class="car-img text-right" @click="selectId(1)">
              <image   :src="oneImgUrl?oneImgUrl:'/static/image/idcode-front.png'" class="img" /> 
              <image class="shui-yin img" v-if="oneImgUrl" src="/static/image/shuiyin.png" /> 
            </div>
            <div class="car-img text-left">
              <image   src="/static/image/idcode-front-eg.png" class="img" /> 
            </div>
          </div> 
          <div class="title text-center">身份证<span style="color:#4A90E2;">正面</span>照</div> 
        </div> 
        <div class="main-box">
          <div class="car-group">
            <div class="car-img text-right"  @click="selectId(2)">
              <image   :src="twoImgUrl?twoImgUrl:'/static/image/idcode-reverse.png'" class="img"  />
              <image class="shui-yin img" v-if="twoImgUrl" src="/static/image/shuiyin.png" /> 
            </div>
            <div class="car-img  text-left">
              <image   src="/static/image/idcode-reverse-eg.png" class="img"  />
            </div>
          </div> 
          <div class="title text-center">手持身份证<span style="color:#4A90E2;">正面</span>照</div> 
        </div> 
      </div> 
      <div class="group-title">以上信息仅供此次认证使用，将严格保密</div> 
      <div class="input-group">
        <div class="input-item" > 
          <input class="realInput" type="text" maxlength="20" v-model="form.name"  :placeholder="cardNamePld" placeholder-style="color:#A7A6B4;"/>
        </div> 
        <!--<div class="input-item br-top" > 
          <input class="realInput" type="text" maxlength="20" v-model="form.nation"  placeholder="请输入民族" placeholder-style="color:#A7A6B4;"/>
        </div> -->
        <div class="input-item br-top" > 
          <input class="realInput" type="text" v-model="form.idCard"  :placeholder="cardIdPld" placeholder-style="color:#A7A6B4;"/>
        </div> 
      </div>
      <div class="footer-btn ">
        <div class="sub-btn text-center" :class="{'null-btn':!oneImgUrl||!twoImgUrl||form.name==''||form.idCard==''}" @click="subMsg"><span class="refresh-loading" v-if="!clickPoint"></span>提交</div>
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
     this.wrongCategory=true;
     this.postIndex=0;
  },
  data () {
    return {    
        headPadding:wx.getStorageSync('headPadding'), 
        headHeight:wx.getStorageSync('headHeight'),
        oneImgUrl:'',
        twoImgUrl:'', 
        postIndex:0,  //提交的次数
        linkList:[], 
        wrongCategory:true,  //是否是正确的身份证
        form:{
          name:'',
          nation:'',
          idCard:'',
        }, 
        clickPoint:true,
        cardNamePld:'请输入您的真实姓名',
        cardIdPld:'请输入您的身份证号',
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
    //提交数据
    subMsg(){
      let vm = this;
      let pic_links=[];
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
      if(vm.wrongCategory){
        if(!vm.oneImgUrl){
          wx.showToast({icon:'none',title:'请上传身份证正面照'}); 
          return false; 
        }else if(!vm.twoImgUrl){
          wx.showToast({icon:'none',title:'请上传身份证背面照'}); 
          return false; 
        }else if(!vm.form.name) { 
          wx.showToast({icon:'none',title:'请输入姓名'}); 
          return false; 
        }else  if(!reg.test(vm.form.idCard)) { 
          wx.showToast({icon:'none',title:'请输入正确的身份证号码'}); 
          return false; 
        }else{
          pic_links[0]=vm.oneImgUrl;
          pic_links[1]=vm.twoImgUrl;
          if(parseInt(vm.postIndex)+1<=pic_links.length){ 
            vm.postIdUpload(pic_links[vm.postIndex]);
          }
        }
      }else{
        wx.showToast({ title:'请上传正确的身份证照片', icon: 'none' })
      } 
    },
    postIdUpload(src){
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
              'file_name':'Id'
          },
          success: function (res) {  
            console.log(res.data);
            vm.linkList.push(JSON.parse(res.data).link);
            vm.postIndex++;  
            vm.subMsg();
            if(vm.postIndex==2){
              vm.clickPoint=false;
              api.updateCaLook({id_name:vm.form.name,nation:vm.form.nation,id_card:vm.form.idCard,id_front_pic:vm.linkList[0],id_reverse_pic:vm.linkList[1]}).then(msg=>{
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
          fail: function () {
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
    //调用相机
    selectId(val){
      let vm = this;
      wx.chooseImage({ 
        count: 1, 
        sizeType: ['compressed'],  
        sourceType: ['camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success (res) { 
          console.log(res.tempFilePaths[0]);
          if(val==1){ 
            vm.oneImgUrl=res.tempFilePaths[0];
             vm.getIdCard(res.tempFilePaths[0]);
          }else{
            vm.twoImgUrl=res.tempFilePaths[0];
          } 
        }
      })
    },
    //  //压缩并获取图片 
    // getCanvasImg(val,url){
    //   var vm = this; 
    //   const ctx = wx.createCanvasContext('attendCanvasId');
    //   ctx.drawImage(url[0], 0, 0, 800, 425);
    //   ctx.draw(true, function () {
    //     wx.canvasToTempFilePath({ 
    //       canvasId: 'attendCanvasId',
    //         success: function success(res) {
         
            
    //         console.log(res.tempFilePath);
    //       }, fail: function (e) { 
    //     }
    //     });
    //   }); 
    // }, 
    //调用识别接口
    getIdCard(src){
      let vm = this; 
      vm.cardNamePld='姓名读取中...';
      vm.cardIdPld='身份证号读取中...';  
      wx.uploadFile({
        url: `${baseUrl}public/file/tobase64`,
        filePath: src, 
        name: 'file',
        header: { "Content-Type": "multipart/form-data"},
        formData: { 
           'name':src,
        },
        success: function (res) {  
          if(JSON.parse(res.data).code==300000){ 
            vm.cardNamePld='姓名读取中...';
            vm.cardIdPld='身份证号读取中...';
            let base64Url=JSON.parse(res.data).data.base64;
            wx.request({
              url: 'https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json', //仅为示例，并非真实的接口地址
              data: {
                configure:{"side":"face"},
                image: base64Url
              },
              method:'POST',
              header: {
                "Authorization":"APPCODE e8aed24b5a5b46e49394ae3db6e6b3e9"
              },
              success:function(res) {
                console.log(res); 
                if(res.statusCode==200){
                  vm.wrongCategory=true;
                  vm.form={
                    name:res.data.name,
                    nation:res.data.nationality,
                    idCard:res.data.num,
                  } 
                }else if(res.statusCode==463){
                  vm.wrongCategory=false;
                  wx.showToast({ title:'请上传正确的身份证照片', icon: 'none' })
                  
                } else {
                  vm.wrongCategory=true;
                  wx.showToast({ title:'识别失败，请手动输入或重新拍照', icon: 'none' })
                } 
                vm.cardNamePld='请输入您的真实姓名';
                vm.cardIdPld='请输入您的身份证号';
              },
              fail:function(err){ 
                vm.wrongCategory=true;
                wx.showToast({ title:'识别失败，请手动输入或重新拍照', icon: 'none' })
                vm.cardNamePld='请输入您的真实姓名';
                vm.cardIdPld='请输入您的身份证号';
              },
            }) 
          }else{
            vm.wrongCategory=true;
            wx.showToast({ title:'识别失败，请手动输入或重新拍照', icon: 'none' }) 
          } 
        },
        fail:function(err){ 
          vm.wrongCategory=true;
          wx.showToast({ title:'识别失败，请手动输入或重新拍照', icon: 'none' })
          vm.cardNamePld='请输入您的真实姓名';
          vm.cardIdPld='请输入您的身份证号';
        }
      })
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
       .car-group{
          display:flex;
          align-items:center;
          justify-content:center;
          .car-img{
            flex:1;
            padding:0 10rpx;
            position:relative;
            .img{
              width:320rpx;
              height:190rpx;
              border-radius:10rpx;
            }
            .shui-yin{
              position:absolute;
              top:0;
              right:0; 
            }
          }
        }
       
       .title{
          font-size:26rpx;
          color:#84838D;
          margin-top:16rpx; 
       } 
     }
     .input-group{
        background:#fff;
        .input-item{
          width:100%;
          height:88rpx;
          display:flex;
          align-items:center; 
          .realInput{ 
            font-size:26rpx;
            padding-left:40rpx; 
            width:100%;
            height:100%;
            // line-height:88rpx;
          }
        }
     }
     .br-top{
        border-top:1rpx solid #EAE6DF;
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

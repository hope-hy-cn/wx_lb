<template>
  <div class="edit-info" :style="'padding-top:'+headHeight+'rpx'">
    <head-back title="学历认证"  @goBack="goBack" ></head-back>
    <div class="content">
      <div class="group-title">信息仅供此次认证使用，将严格保密</div> 
      <div class="input-group">
        <div class="input-item" > 
          <input class="realInput" type="text" maxlength="20" v-model="form.name"  placeholder="请输入学校名称" placeholder-style="color:#A7A6B4;"/>
        </div> 
        <div class="input-item br-top" @click="xlPicker=true"> 
          <input class="realInput" type="text" v-model="form.idCard" disabled="true" placeholder="请选择学历" placeholder-style="color:#A7A6B4;"/>
        </div> 
      </div>
      <div class="main" v-if="credShow!=4&&credShow!=5">
        <div class="main-box" @click="selectId">
          <div class="car-img">
            <image mode="scaleToFill" :src="imgUrl?imgUrl:'/static/image/xuelizhengshu.png'" class="img"  />
          </div>
          <div class="title text-center">拍照学历证书</div> 
        </div> 
      </div>  
      <div class="footer-btn ">
        <div class="sub-btn text-center" :class="{'null-btn':form.name==''||form.idCard==''||(!imgUrl&&credShow!=4&&credShow!=5)}" @click="subMsg"><span class="refresh-loading" v-if="!clickPoint"></span>提交</div>
      </div>
    </div> 
     <!--学历选择-->
    <div v-if="xlPicker">
      <public-picker type="one" @submit="xlChange" @closeDate="closeJob" :oneData="pickerArr" :show="xlPicker"></public-picker>
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
        form:{
          name:'',
          idCard:'',
        },
        imgUrl:'', //图片链接
        xlPicker:false,  //学历选择
        pickerArr:['博士及以上','硕士研究生','本科','大专','高中','初中及以下'],
        credShow:4,
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
    //学历选择
    xlChange: function (e) {
      console.log(e.mp.detail); 
      this.credShow=e.mp.detail.oneIndex;
      this.form.idCard=e.mp.detail.oneValue;
    },
    closeJob(){
      this.xlPicker=false;
    },
    //提交数据
    subMsg(){
      let vm = this; 
      if(vm.form.name==''){
        wx.showToast({icon:'none',title:'请输入学校名称'}); 
        return false; 
      }else if(vm.form.idCard=='') { 
        wx.showToast({icon:'none',title:'请选择学历'}); 
        return false; 
      }else if(this.credShow==4||this.credShow==5){
        if(vm.clickPoint){
          vm.clickPoint=false;
          let body={ 
            education:vm.form.idCard,
            school:vm.form.name
          }; 
          api.updateCaLook(body).then(msg=>{
            vm.clickPoint=true;
            if(msg.data.code==300000){ 
              vm.goBack();
              wx.showToast({
                  icon: "none",
                  title:`上传成功`
              }); 
            } 
          }).catch(err=>{
            vm.clickPoint=true;  
          }); 
        } 
      }else if(!vm.imgUrl&&this.credShow!=4&&this.credShow!=5){
        wx.showToast({icon:'none',title:'请上毕业证书'}); 
        return false; 
      }else{
        vm.postIdUpload(vm.imgUrl);
      } 
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
              'file_name':'Education'
          },
          success: function (res) {  
            let body={
              education_pic:JSON.parse(res.data).link,
              education:vm.form.idCard,
              school:vm.form.name
            };
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
    selectId(){
      let vm = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success (res) { 
          vm.imgUrl=res.tempFilePaths[0] 
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
    .input-group{
      background:#fff;
      .input-item{
        width:100%;
        height:88rpx;
        display:flex;
        align-items:center; 
        border-bottom:1rpx solid #EAE6DF;
        .realInput{ 
          width:100%;
          height:100%;
          font-size:26rpx;
          padding-left:40rpx; 
        }
      }
     } 
     .main{ 
       width:100%;
       background:#fff;  
       padding-bottom:66rpx;
       .main-box{
         padding-top:66rpx;
       }
       .car-img{
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

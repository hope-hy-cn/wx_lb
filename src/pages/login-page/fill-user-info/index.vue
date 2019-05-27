
<template>
  <div class="fill-user-info" :style="'padding-top:'+headHeight+'rpx'">  
    <head-back title="" @goBack="goBack" :iconShow="pageIndex!=1"></head-back>
    
    <div class="page-group">
      
      <!--我的名字-->
      <div v-if="pageIndex==1" >
        <div class="group-title text-center">我的名字</div> 
        <input  placeholder="名字" maxlength="10"     :animation="nameAnimation" class="nameInput" placeholder-style="color:#D3D7DC;"  v-model="form.nickname" :style="{'border-color':form.nickname?'#FF5470':'#D3D7DC'}" />   
        <div class="err-text text-center">这将是您在平台的显示昵称</div>
        <div class="sub-btn text-center code-btn" :style="{'background':form.nickname?'linear-gradient(to  right, #FD7292, #FD5E2C)':'#D9D9D9'}" @click="nextPage" >下一步</div> 
      </div >

       <!--性别--> 
      <div v-if="pageIndex==2" > 
        <div class="group-title text-center">我是</div> 
        <div class="sex-box" :animation="sexAnimation">
          <span class="text-center" :class="{'active-color':form.sex==1}" @click="selectSex(1)">男</span>
          <span class="float-right text-center" :class="{'active-color':form.sex==2}" @click="selectSex(2)">女</span>
        </div>  
        <div class="err-text text-center"  >性别确认后，不可更改</div>
        <div class="sub-btn text-center code-btn" :style="{'background':form.sex?'linear-gradient(to  right, #FD7292, #FD5E2C)':'#D9D9D9'}" @click="nextPage" >下一步</div> 
      </div > 

       <!--我的生日是--> 
      <div v-if="pageIndex==3" > 
        <div class="group-title text-center">我的生日是</div> 
         
        <div class="nameInput text-center"  :animation="dateAnimation"  style="height:auto;" :style="{'color':form.birthday?'#4E5761':'#D9D9D9','border-color':form.birthday?'#FF5470':'#D3D7DC'}"  @click="showDatePicker">{{form.birthday?form.birthday:'选择生日'}}</div>  
        
        <div class="err-text text-center"  >您的年龄将公开显示</div>
        <div class="sub-btn text-center code-btn" :style="{'background':form.birthday?'linear-gradient(to  right, #FD7292, #FD5E2C)':'#D9D9D9'}" @click="nextPage" >下一步</div> 
      </div > 

       <!--我是最佳照片--> 
      <div v-if="pageIndex==4" > 
        <div class="group-title text-center">我是最佳照片</div>    
          <div class="photo-main" :animation="photoAnimation">
            <div class="bg"></div> 
            <div class="img-box" @click="gotoShow">
              <div class="module-box" v-if="LoadingShow"> {{progressLoading}}% </div>
              <image mode="aspectFill" :src="temporary_link" class="img" v-if="temporary_link"></image> 
              <div class="add-img" v-else>
                <div class="jia text-center">+</div>
                <div class="text  text-center">添加你的照片</div>
              </div>
            </div>
          </div>
        <div class="sub-btn text-center code-btn" style="background:linear-gradient(to  right, #FD7292, #FD5E2C); margin:136rpx auto 0;" @click="nextPage" v-if="form.head_pic_link">完成</div> 
      </div >   
    </div> 
    
 
    <date-picker
      id="date-picker"
      :value="datePickerValue" 
      :isShow="datePickerIsShow"
      @sureclick="datePickerOnSureClick"
      @cancelclick="datePickerOnCancelClick" />  
  </div>
</template>

<script>
import * as api from '@/utils/api' ;
import userStore from './../../common/index/store' ;    
import headBack from '@/components/head-back.vue' ;   
import {baseUrl} from '@/utils/config' ;  
import {startWebSocket} from '@/utils/imeventhandler' ;     
const app = getApp()  
export default { 
  onLoad(opt){     
    this.pageIndex=1;   
    let loginType=parseInt(opt.loginType);
    if(loginType==1){
      this.form.identity_type=loginType;
      this.form.identifier= wx.getStorageSync('openId');
    }
    // else{
    //   this.form.identity_type=loginType;
    //   this.form.identifier= wx.getStorageSync('phone');
    // }
    this.nameFocus=false;
    //imserver 
    // startWebSocket()
  },
  onShow: function () {     
    this.form.nickname=this.removeEmoji(app.globalData.userStore.loginForm.nickname);
    this.form.sex=app.globalData.userStore.loginForm.sex;
    this.form.birthday=app.globalData.userStore.loginForm.birthday;
    // this.form.head_pic_link=app.globalData.userStore.temporary_link; //头像 
    // this.temporary_link=app.globalData.userStore.temporary_link; //临时头像 
  }, 
  components:{
    headBack
  }, 
  data () {
    return {  
      pageIndex:1,
      headHeight:wx.getStorageSync('headHeight'),
      headPadding:wx.getStorageSync('headPadding'), 
      form:{
        nickname:'',
        sex:'',
        birthday:'',
        head_pic_link:'', //头像 
        identity_type:'', //登陆类型 1.微信 2.手机
        identifier:'', //账号 openid或手机号
      }, 
      nameFocus:false,  
      // 生日 
      datePickerValue: [1990, '06', '15'],
      datePickerIsShow: false,
      temporary_link:'', //临时头像
      nameAnimation:'',//姓名框动画
      sexAnimation:'', //性别动画
      dateAnimation:'', //生日动画
      photoAnimation:'', //照片动画
      clickBtnpload:true, //防止连点 
       LoadingShow:false,
      progressLoading:0,  
    }
  },  
 
  methods: {   
    goBack(){
      let vm = this; 
      if(this.pageIndex==1){
        // wx.navigateBack({ delta: 1 }); 
        vm.datePickerIsShow=false;
      }else if(this.pageIndex==2){
        vm.sexAnimation=vm.sliderightshow(1000,1);  
        vm.nameAnimation=vm.sliderightshow(0,1);  
        let cTime=setTimeout(()=>{
          vm.pageIndex--; 
          vm.datePickerIsShow=false;
          clearTimeout(cTime);
        },300) 
      }else if(this.pageIndex==3){
        
        vm.dateAnimation=vm.sliderightshow(1000,1);  
        vm.sexAnimation=vm.sliderightshow(0,1); 
        let cTime=setTimeout(()=>{
          vm.pageIndex--;  
          vm.datePickerIsShow=false;
          clearTimeout(cTime);
        },300) 
      }else if(this.pageIndex==4){ 
        vm.photoAnimation=vm.sliderightshow(1000,1);  
        vm.dateAnimation=vm.sliderightshow(0,1);  
        let cTime=setTimeout(()=>{
          vm.pageIndex--;  
          // vm.datePickerIsShow=true;
          clearTimeout(cTime);
        },300) 
      }   
    },   
    //下一步
    nextPage(){
      let vm = this; 
      if(vm.pageIndex==1){
        if(vm.form.nickname){
          vm.nameFocus=false;
          vm.nameAnimation=vm.sliderightshow(-1000,1); 
          vm.sexAnimation=vm.sliderightshow(0,1); 
          app.globalData.userStore.loginForm.nickname=vm.form.nickname;
          app.aldstat.sendEvent('login：名字');  
          setTimeout(()=>{
            vm.pageIndex++;
            vm.datePickerIsShow=false; 
          },300)
        } 
      }else if(vm.pageIndex==2){
        vm.nameFocus=false;
        if(vm.form.sex){
          vm.sexAnimation=vm.sliderightshow(-1000,1); 
          vm.dateAnimation=vm.sliderightshow(0,1); 
          app.globalData.userStore.loginForm.sex=vm.form.sex;
          app.aldstat.sendEvent('login：性别');  
          setTimeout(()=>{
            vm.pageIndex++;
            // vm.datePickerIsShow=true; 
          },300)
        }
      }else if(vm.pageIndex==3){
        if(vm.form.birthday){
          vm.dateAnimation=vm.sliderightshow(-1000,1); 
          vm.photoAnimation=vm.sliderightshow(0,1); 
          app.globalData.userStore.loginForm.birthday=vm.form.birthday;
          app.aldstat.sendEvent('login：生日');  
          setTimeout(()=>{
            vm.pageIndex++;
            vm.datePickerIsShow=false
          },300)
        }
      }else{
        vm.datePickerIsShow=false;
        if(vm.clickBtnpload){ 
          vm.clickBtnpload=false; 
          vm.userRegister(); 
        } 

      }
    },
    postImgFile(){
      let vm = this;
      vm.progressLoading=0;
      vm.LoadingShow=true;
      wx.uploadFile({
        url: `${baseUrl}public/file/wxupload`,
        filePath: vm.temporary_link, 
        name: 'file',
        header: { "Content-Type": "multipart/form-data"}, 
        formData: { 
            'name':vm.temporary_link,
            'source':'photo',
        },
        success: function (res) { 
          app.aldstat.sendEvent('login：照片上传');  
          vm.LoadingShow=false;
          if(res){
            // app.globalData.userStore.loginForm.head_pic_link=JSON.parse(res.data).link;
            vm.form.head_pic_link=JSON.parse(res.data).link;
            
          } 
        },
        fail:function(err){ 
          vm.LoadingShow=false;
          wx.showModal({
            title: '提示',
            content: '上传失败,请重新上传',
            showCancel: false
          })
        }
      })
      .onProgressUpdate((res) => {  
        vm.progressLoading=res.progress;
      });  
    },
    //注册
    userRegister(){
      let vm = this; 
      vm.form.openid=wx.getStorageSync('openId');
      api.register(vm.form).then(res=>{
        app.aldstat.sendEvent('login：完成'); 
        vm.clickBtnpload=true;
        if(res.data.code==300000){
          let account={
              accid:res.data.data.accid,
              password:res.data.data.password,
              uuid:res.data.data.uuid,
              deviceToken:wx.getStorageSync('openId')+wx.getStorageSync('phone')
            }; 
          wx.setStorageSync('account', JSON.stringify(account)); 
          app.globalData.userStore.firstEntry=true; 
          wx.setStorageSync('refresh_token', res.data.data.refresh_token);
          wx.setStorageSync('h_token', res.data.data.token);
          wx.setStorageSync('is_tourist', res.data.data.is_tourist); 
          setTimeout(()=>{
            wx.navigateBack({ delta: 1 });
          },100) 
        }else if(res.data.code==300114){
          wx.showModal({
            title: '提示',
            content: '该用户名已存在，请重新输入用户名',
            showCancel: false
          })
        } 
      }).catch(err=>{
        vm.clickBtnpload=true;
      })
    },
    //选择性别
    selectSex(val){
      this.form.sex=val;
    },
    //生日
    showDatePicker (e) { 
        this.datePickerIsShow=true 
    }, 
    datePickerOnSureClick(e) {
      // console.log('datePickerOnSureClick');
      // console.log(e); 
      this.form.birthday=`${e.mp.detail.value[0]}-${e.mp.detail.value[1]}-${e.mp.detail.value[2]}`;
      this.datePickerValue=e.mp.detail.value; 
      this.datePickerIsShow=false; 
    }, 
    datePickerOnCancelClick(event) {
      // console.log('datePickerOnCancelClick');
      // console.log(event); 
      this.datePickerIsShow=false 
    }, 
    //选择照片
    gotoShow: function(){
      var vm = this
      wx.chooseImage({
        count: 1, 
        sizeType: ['compressed'], // compressed 压缩 
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function(res){ 
          console.log(res.tempFilePaths[0]);
          vm.temporary_link=res.tempFilePaths[0];
          vm.postImgFile();
          // wx.navigateTo({url:`./../../photo-canvas/share-image/main?imgUrl=${res.tempFilePaths[0]}&type=head`}) 
        },
        fail: function() {
          // wx.showModal({
          //     title: '提示',
          //     content: '上传失败,请重新选择',
          //     showCancel: false
          // })
        }
      })
    },
    removeEmoji(content){
        return content.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
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
.fill-user-info{
  width:100%;
  height:100vh;
  .group-title{
    color:#4A4A4A;
    font-size:36rpx;
    padding-top:70rpx; 
    font-family:PingFangSC-Medium;
    font-weight:500;
  }
  .page-group{
     width:100%;
     height:100%;
     background:#fff;
    .nameInput{
      display:block;
      width:480rpx;
      height:102rpx;
      line-height:102rpx;
      margin:124rpx auto 0;
      padding:0 12rpx;
      font-size:64rpx;
      border-bottom:4rpx solid;
    }
    .err-text{ 
      font-size:28rpx;
      margin-top:32rpx;
      color:#808892;
    } 
    .sub-btn{
      width:548rpx;
      height:90rpx;
      line-height:90rpx;
      border-radius:45rpx;
      color:#fff;
      font-size:28rpx;
      margin:34rpx auto 0;
      &:active{
        opacity:.7;
      }
    }
    .code-phone{
      font-size:28rpx;
      color:#878B8F;
      margin-top:16rpx;
      span{
        color:#FF5470;
      }
    }
    .sex-box{
      width:540rpx;
      margin:124rpx auto 0;
      span{
        display:inline-block;
        width:220rpx;
        height:90rpx;
        line-height:90rpx;
        font-size:28rpx;
        background:#d9d9d9;
        color:#fff;
        border-radius:45px;
      }
      .active-color{
        background:linear-gradient(to  right, #FD7292, #FD5E2C);
      }
    }
    .photo-main{
      width:434rpx;
      height:528rpx;
      margin:108rpx auto 0; 
      position:relative;
      .bg,.img-box{
        width:434rpx;
        height:528rpx;
        position:absolute;
        top:0;
        border-radius:10rpx;
      }
      .bg{ 
        background:rgba(243,245,247,1); 
        border:1rpx solid rgba(222,230,240,1);
        transform-origin:100% 100%;   
        transform: rotate(-10deg);
      }
      .img-box{
        background:rgba(255,255,255,1); 
        border:1rpx solid rgba(211,215,220,1);
        display:flex;
        align-items:center;
        justify-content:center;
        position:relative;
        .module-box{
          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          width:100%;
          height:100%;
          background:rgba(0,0,0,.4);
          display:flex;
          align-items:center;
          justify-content:center;
          color:#fff;
        }
        .img{
          width:100%;
          height:100%;
          border-radius:10rpx;
        }
        .add-img{
          .jia{
            width:128rpx;
            height:128rpx;
            line-height:128rpx;
            background:linear-gradient( rgba(255, 73, 146, 1),rgba(255, 64, 108, 1), rgba(253, 94, 44, 1));
            border-radius:50%;
            color:#fff;
            font-size:60rpx;
            margin:0 auto 28rpx;
          }
          .text{
            font-size:36rpx;
            color:#D3D7DC;
          }
        }
      }
    }
  }
}
</style>

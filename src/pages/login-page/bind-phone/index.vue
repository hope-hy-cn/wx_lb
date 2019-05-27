
<template>
  <div class="bind-phone" :style="'padding-top:'+headHeight+'rpx'">  
    <head-back title="" @goBack="goBack"></head-back>
    <!--输入手机号-->
    <div class="page-group" v-if="pageIndex==1">
      <div class="group-title text-center">输入手机号</div> 
      <input type="number" placeholder="手机号" maxlength="11" class="phoneInput" placeholder-style="color:#D3D7DC;" :focus="phoneFocus"  v-model="form.phone" :style="{'border-color':form.phone?'#FF5470':'#D3D7DC'}" @input="inputPhone" @blur="regPhone"/> 
      <div class="err-text text-center" :style="{'color':regPhoneNum?'#FF5470':'#fff'}" >请输入正确的手机号</div>
      <div class="sub-btn text-center code-btn" :style="{'background':phoneInputShow?'linear-gradient(to  right, #FD7292, #FD5E2C)':'#D9D9D9'}" @click="callPhone"><span class="refresh-loading" v-if="sendLoading"></span><span v-else>{{countdown==60?'发送验证码':'重新获取验证码'+countdown+'s'}}</span></div>
    </div> 
    <!--输入验证码-->
    <div class="page-group" v-if="pageIndex==2">
      <div class="group-title text-center">输入验证码</div> 
      <div class="code-phone text-center">验证码已发送到&nbsp;&nbsp;<span>{{form.phone}}</span></div>  

      <group class="write-input" v-if="!sendLoading">
        <input ref="input" class="realInput" type="number" maxlength="4"
                v-model="form.codeNum" :focus="focusInput" @input="delNum" @blur="blurInput" @click="clickInput"/>
        <ul class="inputUl text-center">
          <li :class="{'code-cative':disInput.length==1||disInput.length==0}"> 
            <input maxlength="1" disabled v-model="disInput[0]"/> 
          </li> 
          <li :class="{'code-cative':disInput.length==2}"> 
            <input maxlength="1" disabled v-model="disInput[1]"/> 
          </li> 
          <li :class="{'code-cative':disInput.length==3}"> 
            <input maxlength="1" disabled v-model="disInput[2]"/> 
          </li> 
          <li :class="{'code-cative':disInput.length==4}"> 
            <input maxlength="1" disabled v-model="disInput[3]"/> 
          </li>  
        </ul>    
      </group> 
      <div class="loading-code" v-if="sendLoading"><span class="refresh-loading"></span></div>
      <div class="err-text text-center" :style="{'color':regCodeShow?'#FF5470':'#fff'}">验证码错误</div>
      <div class="down-time-text text-center" v-if="!againCode"  @click="callPhone">重新获取验证码({{countdown}}s)</div>
      <div class="sub-btn text-center code-btn" style='background:linear-gradient(to  right, #FD7292, #FD5E2C)' @click="callPhone"  v-if="againCode">重新获取验证码</div> 
    </div> 

  </div>
</template>

<script>
import * as api from '@/utils/api' ; 
import headBack from '@/components/head-back.vue' ;    
import userStore from './../../common/index/store' ;    
const app = getApp();  
export default { 
  onLoad(opt){   
    this.pageIndex=1;
    this.form={
      phone:'',
      codeNum:'',//用户输入的验证码
    };
    if(opt.bindType){
      this.bindType=opt.bindType;
    }
  },
  onShow: function () {   
    this.phoneFocus=true;//手机号自动聚焦
    this.sendLoading=false;
    this.regCodeShow=false; //验证码错误提示
    this.disInput=[]; 
    this.form.codeNum='';
    this.countdown=60;
    clearTimeout(this.timeParme);
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
        phone:'',
        codeNum:'',//用户输入的验证码
      },
      temporaryPhone:'',
      phoneFocus:true,  //手机号自动聚焦
      regPhoneNum:false, //手机号错误提示
      phoneInputShow:false, //判断是否输入11位
      sendLoading:false, 
      //验证码
      focusInput:false,
      regCodeShow:false, //验证码错误提示
      disInput:[], //判断是否输入四位
      countdown:60,
      timeParme:'',  //定时器 
      againCode:false,// 是否重新发送验证码
      codeLoadingShow:false,
      bindType:'',
    }
  },  
 
  methods: {   
    goBack(){
      this.sendLoading=false;
      if(this.pageIndex==1){
        if(this.bindType=='bind'){
          wx.navigateBack({ delta: 1 });  
        }else{
          let url = `./../login/main`;
          wx.redirectTo({url});
        } 
      }else if(this.pageIndex==2){
        this.pageIndex=1; 
        this.phoneFocus=true;//手机号自动聚焦
        // this.disInput=[];  
        // this.countdown=60;
        // clearTimeout(this.timeParme);
      }  
    }, 
    regPhone(){
      let reg=/^1(3|4|5|7|8)\d{9}$/;
      if(!(reg.test(this.form.phone))){  
        this.regPhoneNum=true; 
        return false; 
      } else{ 
        this.regPhoneNum=false; 
        return true;
      }
    },
    //获取验证码
    callPhone(){ 
      if(this.regPhone()&&!this.sendLoading){
        let vm = this;
        if((vm.temporaryPhone!=vm.form.phone)&&vm.countdown==60){
          vm.sendLoading=true;
          api.fetSend({phone:vm.form.phone}).then(res=>{
            app.aldstat.sendEvent('login:获取验证码'); // 事件名称规范: 不超过255个字符 
            if(res.data.code==300000){
              vm.temporaryPhone=vm.form.phone; //临时保存电话号码
              vm.phoneFocus=false;//手机号自动聚焦
              vm.sendLoading=false;
              vm.pageIndex=2;
              vm.againCode=false;
              vm.focusInput=true;
              vm.settime(); 
            } 
          }).catch(err=>{
            vm.sendLoading=false;
          })
        }else{
          this.pageIndex=2; 
        } 
      }
    },
    //输入手机号
    inputPhone(){  
      if(this.form.phone.length==11){
        if(this.temporaryPhone!=this.form.phone){
          this.disInput=[];  
          this.countdown=60;
          clearTimeout(this.timeParme);
        } 
        if(this.regPhone()) this.phoneInputShow=true;
      }else{
        this.phoneInputShow=false;
      }
    },
    //输入验证码
    delNum () {  
      let vm = this;  
      let inputValue=vm.form.codeNum; //用户输入的验证码
      vm.disInput=inputValue; 
      if (vm.disInput.length==4) {
        let body={
          identifier: vm.form.phone, 
          identity_type:2, 
          credential:vm.form.codeNum
        };
        if(vm.bindType=='bind'){ 
          vm.sendLoading=true;
          api.bindAccount(body).then(res=>{
            app.aldstat.sendEvent('login:发送验证码'); // 事件名称规范: 不超过255个字符 
            let sendTime=setTimeout(()=>{
              vm.sendLoading=false;
              clearTimeout(sendTime);
            },800) 
            if(res.data.code==300000){
              app.globalData.userStore.userInfo.phone=vm.form.phone;
              wx.navigateBack({ delta: 1 });  
            }
          }).catch(err=>{
            vm.sendLoading=false;
            wx.showToast({
              title: '服务器错误',
              icon: 'none'
            })
          });
        }else{ 
          vm.sendLoading=true;
          api.userLogin(body).then(res=>{
            let sendTime=setTimeout(()=>{
              vm.sendLoading=false;
              clearTimeout(sendTime);
            },800) 
            wx.setStorageSync('phone',  vm.form.phone); 
            if(res.data.code==300000){
              let account={
                accid:res.data.data.accid,
                password:res.data.data.password,
                uuid:res.data.data.uuid,
                deviceToken:wx.getStorageSync('openId')+vm.form.phone
              };  
              wx.setStorageSync('account', JSON.stringify(account));  
              wx.setStorageSync('refresh_token', res.data.data.refresh_token);
              wx.setStorageSync('h_token', res.data.data.token);
              wx.setStorageSync('is_tourist', res.data.data.is_tourist); 
              clearTimeout(vm.timeParme);  
              if(app.globalData.userDataInfo.share_login&&app.globalData.userDataInfo.userRuuid){
                app.globalData.userDataInfo.share_login=false;
                let url = `./../../share-page/share-detail/main?userRuuid=${app.globalData.userDataInfo.userRuuid}`;
                wx.redirectTo({url});
              } else {
                let url = `./../../common/index/main`;
                wx.switchTab({url});    
              }
            }else if(res.data.code==300101){
              //未注册
              clearTimeout(vm.timeParme);  
              let url = `./../fill-user-info/main?loginType=2`;
              wx.redirectTo({url});   
            }else if(res.data.code==300103){
              wx.showToast({
                title: '验证码错误',
                icon: 'none'
              })
            }else{
              vm.codeNum='';
              vm.disInput=[];
              // vm.countdown=60;
              // vm.againCode=true; 
            }
          }).catch(err=>{
            vm.sendLoading=false;
            wx.showToast({
              title: '服务器错误',
              icon: 'none'
            })
          });
        } 
      } 
    },
    //倒计时
    settime() {
      console.log(this.countdown);
      let vm = this;
      if (vm.countdown == 1) { 
        vm.againCode=true;
        vm.countdown = 60; 
      } else {
        vm.againCode=false;
        vm.countdown--;
        vm.timeParme=setTimeout(function() {
            vm.settime()
        },1000)
      }
    },
    blurInput(){
      console.log('blurInput');
      this.focusInput=false;
    },
    clickInput(){
      console.log('clickInput');
      this.focusInput=true;
    },

  },
  onShareAppMessage: function(res) { 
    let selfOpenId = wx.getStorageSync('openId');
    let path = `pages/common/index/main?openId=${selfOpenId}`;
    return this.onShareAppMessage('',path);
  }, 

}
</script>
 
<style lang="scss" scoped>
.bind-phone{
  width:100%;
  height:100vh;
  .group-title{
    color:#4A4A4A;
    font-size:36rpx;
    padding-top:70rpx;
    font-weight:500;
  }
  .page-group{
     width:100%;
     height:100%;
     background:#fff;
    .phoneInput{
      display:block;
      width:480rpx;
      height:102rpx;
      line-height:102rpx;
      margin:124rpx auto 0;
      padding:12rpx;
      font-size:64rpx;
      border-bottom:4rpx solid;
    }
    .err-text{ 
      font-size:32rpx;
      margin-top:32rpx;
    }
    .down-time-text{
      font-size:32rpx;
      color:#D3D7DC;
      font-family:PingFangSC-Regular;
      font-weight:400;
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

    .write-input {
      margin-top:100rpx;
      position: relative;
      display: flex;
      .inputUl{
        width:100%; 
      } 
      li {
        display: inline-block;
        width: 100rpx;
        height: 100rpx; 
        border-bottom:4rpx solid #354052;
        list-style-type: none;
        line-height: 1 !important;
        min-height: 100rpx !important;
        margin: 0 20rpx;  
        input {
          -webkit-appearance: none;
          -moz-appearance: none;
          -ms-appearance: none;
          resize: none;
          outline: none;
          border: 0; 
          width: 100rpx;
          height:100rpx;
          text-align: center;
          font-weight:500;
          color:#4E5761;
          font-size:64rpx;
          background: none !important;
        }
      }
      .code-cative{
        border-bottom:4rpx solid #FF5470;
      }
      .realInput {
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        resize: none;
        outline: none;
        border: 0;
        z-index: 50;
        position: absolute;
        padding: 60rpx 0;
        background: none;
        display: block;
        // margin-left: -30%;
        top: 34rpx;
        opacity: 0;
        caret-color: transparent;
        color: transparent;
        text-indent: -5rem;
        font-size: .63rem;
        min-height:0;
        height:0;
        width: 100%;
        top: 1rpx;
      }
    }
    .loading-code{
      width:100%;
      height:100rpx;
      margin-top:100rpx;
      display:inline-block;
      align-items:center;
      justify-content:center;
      span{
        display:block;
        margin:auto;
      }
    }


  }
}
</style>

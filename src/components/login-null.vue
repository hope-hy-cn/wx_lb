<!--头部样式-->
<template> 
    <div>
        <div  class="text-center not_login" v-if="mode=='common'">
            <div>您还未登录，请前往登录</div>
            <button class="to_login" open-type="getUserInfo" @getuserinfo="agreeGetUser">去登录</button>
        </div> 
        <div  v-if="mode=='modal'" class="login_box"> 
            <div class="modal-box" @click.stop="closeModal"></div>  
            <div class="modal-content">
                <div class="title text-center">提示</div>
                <div class="text text-center">您还未登录，请前往登录</div> 
                <button class="modal-footer text-center" open-type="getUserInfo" @getuserinfo="agreeGetUser">使用微信登录</button> 
            </div>
        </div>
    </div>
</template>

<script>
import * as api from '@/utils/api' ; 
const app = getApp()  
export default {
    props: {
        mode:{
            default:'common', //modal,
            type:String,
        }
    },
    data () {
        return {  
            headHeight:wx.getStorageSync('headHeight'),
            headPadding:wx.getStorageSync('headPadding')
        }
    },
    methods:{ 
        //用户授权注册
        agreeGetUser(e) { 
            let vm = this;
            if (e.mp.detail.errMsg == 'getUserInfo:fail auth deny') {
                // wx.showModal({
                //   title: '用户未授权',
                //   content: '如需正常使用小程序，需要获取你的基本信息，请您开启授权服务',
                //   showCancel: false,
                // })
            } else {  
                console.log(e.mp.detail);
                app.globalData.userStore.loginForm.nickname=e.mp.detail.userInfo.nickName;
                app.globalData.userStore.loginForm.sex=e.mp.detail.userInfo.gender; 
                let body={
                    identity_type:1,
                    identifier:wx.getStorageSync('openId')
                }
                api.userLogin(body).then(res => {    
                    app.aldstat.sendEvent('login:微信登陆');  
                    if(res.data.code==300000){ 

                    }else if(res.data.code==300101){
                        //未注册 
                        let url = `./../../login-page/fill-user-info/main?loginType=1`;
                        wx.navigateTo({url});   
                    } else {
                        wx.showToast({
                            title: res.data.err,
                            icon: 'none'
                        }) 
                    }
                }).catch(res => { 
                    console.log(res);
                    wx.showModal({
                        title: '提示',
                        content: '授权失败，请重新授权',
                        showCancel: false,
                    })
                }); 
            }
        },
        closeModal(){
            this.$emit('close');
        },
    }, 
}
</script>

<style scoped lang="scss">
 .not_login{
  padding-top:45%;
  font-size:30rpx;
  color:#808892;
}
.to_login{
  display:inline-block;
//   padding:12rpx 30rpx;
  color:#fff;
  font-size:32rpx;
  margin-top:30rpx;
  border-radius: 6rpx;
  background:linear-gradient(180deg,rgba(255,131,101,1) 0%,rgba(255,74,112,1) 100%);
  &:active{
    opacity:.8;
  }
}
.login_box{
    
    .modal-box{
        position: fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        z-index:10000;
        background: rgba(0,0,0,.5); 
    }
    .modal-content{
        width:500rpx;
        height:300rpx; 
        border-radius: 16rpx;
        color:#413C44;
        font-size:32rpx; 
        position: fixed;
        top:50%;
        left:50%; 
        margin-top:-125rpx;
        margin-left:-250rpx;
        background:#fff;
        z-index:10002; 
        .title{
            padding:20rpx; 
            color:#FF5470;
        }
        .text{
            color:#333;
            margin:20rpx auto 0; 
            padding:16rpx 0;  
        }
    }
    .modal-footer{
        height:100rpx;
        line-height:100rpx;
        width:100%; 
        position: absolute;
        bottom:0; 
        color:#fff;
        font-size:32rpx; 
        border-top-right-radius: 0;
        border-top-left-radius: 0;
        border-bottom-right-radius: 6rpx;
        border-bottom-left-radius: 6rpx;
        background:linear-gradient(180deg,rgba(255,131,101,1) 0%,rgba(255,74,112,1) 100%);
    }
}
</style>

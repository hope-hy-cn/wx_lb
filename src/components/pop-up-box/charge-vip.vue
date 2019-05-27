<!--配对成功-->
<template>
    <div class="match-success">
        <div class="relative">
            <div class="content-box" :class="{'content-box-active':contentTansition,'help-content':type=='help','top-content':type=='top'}" >
                <!--通用-->
                <div  v-if="type=='share'">
                    <div class="swiper-box" > 
                        <swiper
                            :indicator-dots="false"  
                            :circular="true"
                            :duration="800" 
                            :autoplay="vipSwiperAutoplay"
                            :current="vipCurrent" 
                            @change="userSwiperChange"
                            style="height:100%;width:100%;"
                            > 
                            <block v-for="(item,index) in swiperArr" :key="item">
                                <swiper-item  class="swiper-item"> 
                                    <div class="title text-center">{{item.title}}</div>
                                    <div class="icon-box">
                                        <image class="icon" :src='item.icon'/>
                                    </div>
                                    <!-- <div class="vip-name text-center"></div>  -->
                                </swiper-item>
                            </block>   
                        </swiper> 
                    </div>   
                    <div class="help-user text-center">
                        <div class="user-item" v-for="(item,index) in vipInviteData" :key="item">
                            <image mode="aspectFill" :src="item.head_pic" class="img" v-if="item.head_pic"></image>
                            <div class="user-null" v-if="!item.head_pic">+</div>
                        </div> 
                    </div>
                    <div class="hint-text text-center" v-if="inviteUserNum==0">邀请好友，体验无限特权</div>
                    <div class="hint-text text-center" v-if="inviteUserNum>0">已有 {{inviteUserNum}} 位好友助力</div>
                    <div class="footer-btn text-center">
                        <div class="btn-box">
                           <button  class="sub-btn text-center" style="margin-left:0" open-type="share" data-name="pageShare" > 马上邀请 </button > 
                        </div> 
                    </div>

                </div>
                <div  v-if="type=='help'">  
                    <div class="help-title-box">
                        <div class="title text-center">快来帮个忙<br>领无限体验通行卡</div>
                        <div class="text text-center">享免费超级特权</div>
                    </div>
                    <div class="hint-text text-center" v-if="inviteUserNum>0">已有 {{inviteUserNum}} 位好友助力</div>
                    <div class="help-user text-center ">
                        <div class="user-item" v-for="(item,index) in vipInviteData" :key="item">
                            <image mode="aspectFill" :src="item.head_pic" class="img" v-if="item.head_pic"></image>
                            <div class="user-null" v-if="!item.head_pic">+</div>
                        </div> 
                    </div>  
                    <div class="footer-btn text-center"  v-if="!speedClick">
                        <div class="btn-box">
                           <button class="sub-btn text-center"  open-type="getUserInfo" @getuserinfo="agreeGetUser"> 帮他加速一下 </button > 
                        </div> 
                    </div>
                    <div class="footer-btn text-center" v-if="speedClick">
                        <div class="footer-success">加速成功</div>
                        <div class="hint" v-if="closeTime>0">页面 {{closeTime}}s 自动关闭</div> 
                    </div>
                </div>  
                <div  v-if="type=='top'">  
                    <div class="top-title-box">
                        <div class="title text-center">置顶推荐<br>一秒变成万人迷</div> 
                    </div> 
                    <div class="describe text-center">
                        每月一次首页鲜萝卜优先展示，提高曝光 率，增加收信系数，交友更加容易
                    </div>
                    <div class="top-date-box">
                        <div class="over text-center" v-if="!dateShow">推荐结束，下个月再来</div>
                        <div class="data text-center" v-if="dateShow">
                            <div class="title">倒计时 </div>
                            <div class="time">{{topDate}}</div>
                        </div>
                    </div>
                </div>    

                <div class="close-btn"  @click.stop="closeMatchSuccess">
                    <div class="icon-position">
                        <image class="close-img" src="/static/image/vip-close.png"> </image>
                    </div> 
                </div> 

            </div>
             
            <!--模态框-->
            <div class="vip-modul"  @click="closeMatchSuccess"></div>
        </div> 
    </div> 
</template>

<script>  
import * as api from '@/utils/api'; 
const app = getApp();
export default {
    props: { 
        //类型
        type:{
            default:'share', //share 通用分享  help 帮助助力 top置顶
            type:String 
        }, 
        //轮播下标
        current:{ 
            default:0,  
            type:Number, 
        },   
        topDate:{
            default:'',
            type:String
        }, 
        dateShow:{
            default:false,
            type:Boolean
        } 
    },
    components: {  

    },
    data(){
        return { 
            contentTansition:false,
            vipCurrent:0,
            vipSwiperAutoplay:false,
            swiperArr:[
                {
                    icon:'/static/image/vip-like-icon.png',
                    title:'啊哦～ 浏览次数用完了', 
                },
                {
                    icon:'/static/image/vip-site-icon.png',
                    title:'啊哦～ 自由定位未开通', 
                },
                {
                   icon:'/static/image/vip-fans-icon.png',
                    title:'啊哦～ 你不能查看访客', 
                },
                {
                    icon:'/static/image/vip-mark-icon.png',
                    title:'VIP专属身份标示', 
                },
                {
                    icon:'/static/image/vip-top-icon.png',
                    title:'置顶推荐', 
                }
            ],
            closeTime:5,
            speedClick:false,  //点击了加速
            chooseItem:2,
            siginData:{},
            setTimeData : null,
            newDate:new Date(),
            vipInviteData:[
                {nick_name:"",head_pic: ""},
                {nick_name:"",head_pic: ""},
                {nick_name:"",head_pic: ""},
                {nick_name:"",head_pic: ""},
                {nick_name:"",head_pic: ""}
            ],
            inviteUserNum:0,  //邀请用户数量
            vipForm:{
                can_help:false,  //
                is_help:false,  //
                is_self:false,  //
            },
        }
    }, 
    mounted() {
        let vm = this; 
        this.vipCurrent=this.current;
        if(this.type!='top'){
           this.fetchShareData(); //邀请用户   
        }  
        let cTime=setTimeout(()=>{
            vm.contentTansition=true;
            clearTimeout(cTime);
        },200)
    },
    methods:{ 

        //帮助助力
        agreeGetUser(e){
            let vm = this;  
            if (e.mp.detail.errMsg == 'getUserInfo:fail auth deny') {
                // wx.showModal({
                //   title: '用户未授权',
                //   content: '如需正常使用小程序，需要获取你的基本信息，请您开启授权服务',
                //   showCancel: false,
                // })
            } else {   
                console.log(e.mp.detail.userInfo);
                app.globalData.userStore.loginForm.nickname=e.mp.detail.userInfo.nickName;
                app.globalData.userStore.loginForm.sex=e.mp.detail.userInfo.gender; 
                let body={
                    wx_name:e.mp.detail.userInfo.nickName,
                    head_pic:e.mp.detail.userInfo.avatarUrl,
                    ru_uid:app.globalData.userDataInfo.sharRuuid,
                } 
                api.shareSpeed(body).then(res=>{
                    if(res.data.code==300000){ 
                        for(var i =0 ; i<vm.vipInviteData.length; i++){
                            if(!vm.vipInviteData[i].head_pic){
                                vm.vipInviteData[i].wx_name=e.mp.detail.userInfo.nickName;
                                vm.vipInviteData[i].head_pic=e.mp.detail.userInfo.avatarUrl; 
                                break;
                            }
                        }
                        vm.speedClick=true;
                        vm.closeTime=5;
                        vm.settime();
                    }else if(res.data.code==300118){
                        wx.showToast({
                            title: '无法帮Ta加速',
                            icon: 'none'
                        })
                    }
                }); 
            } 
        },
        //倒计时
        settime() { 
            let vm = this;
            if (vm.closeTime > 0) {  
                vm.closeTime--;
                vm.timeParme=setTimeout(function() {
                    vm.settime();
                },1000) 
            } else { 
                vm.closeMatchSuccess();
            }
        }, 
        userSwiperChange(e){ 
            this.vipCurrent=e.mp.detail.current;
        },
        closeMatchSuccess(){
            clearInterval(this.setTimeData);
            this.$emit('close');
        }, 
        //获取邀请用户
        fetchShareData(){
            let vm =this;
            let meRuuid = this.type=="help"?app.globalData.userDataInfo.sharRuuid:JSON.parse(wx.getStorageSync('account')).uuid; 
            api.getShareList({ruuid:meRuuid}).then(res=>{
                let resData=res.data.data;
                if(res.data.code==300000&&resData){
                    vm.vipForm={
                        can_help:resData.can_help,  
                        is_help:resData.is_help,  
                        is_self:resData.is_self,  
                    }
                    if(resData.data){
                        vm.inviteUserNum=resData.data.length;
                        resData.data.forEach((item,index)=>{
                        if(index<=5){
                            vm.vipInviteData[index]=item;
                        }else{
                            vm.moreInviteData.push(item);
                        }
                        }) 
                    } 
                }
            });
        },
        //选择价格
        choosePrice(val){
            this.chooseItem=val;
            // this.getSingKey();
        }, 
        //分享
        shareBtn(){
             
        },
        topBtn(){
            clearInterval(vm.setTimeData);
            this.$emit('topBtn');
        },
    }
}
</script>

<style scoped lang="scss">
.match-success{
    position:fixed;
    top:0;
    right:0;
    bottom:0;
    left:0;
    width:100%;
    height:100%; 
    z-index:20000; 
    color:#fff;
    .relative{
        width:100%;
        height:100%;
        position:relative;
        .close-btn{
            position:absolute;
            bottom:-132rpx;
            left:50%;
            width:96rpx;
            height:132rpx;
            margin-left:-48rpx;
            z-index:10; 
            .icon-position{
                width:100%;
                height:100%;
                position: relative;
                &:active{
                    opacity:.8;
                }
                &::before{
                    content:'';
                    position:absolute;
                    top:0;
                    left:50%;
                    margin-left:-1rpx;
                    height:96rpx;
                    width:2rpx;
                    background:#fff;
                    z-index: 11;
                }
                .close-img{
                    position: absolute;
                    bottom:0;
                    left:0;
                    width:96rpx;
                    height:96rpx; 
                    z-index: 12; 
                }
                
            }
        }
    }

    .content-box{   
        height:920rpx;
        width:640rpx;
        position:absolute;
        top:-100%;
        left:50%;
        margin-left:-320rpx;
        margin-top:-520rpx;
        background:#fff;
        border-radius:20rpx;
        z-index:20002;
        transition:all .5s; 
        .swiper-box{
            height:518rpx;
            width:100%; 
            border-radius:20rpx 20rpx 0 0;
            position:relative; 
            transition:all .3s;
            
            .swiper-item{
                padding-top:92rpx; 
                .title{
                    font-size:36rpx;
                    font-weight:500;
                    color:#4B5264; 
                    font-family: PingFangSC-Medium, sans-serif;
                    font-weight:500;
                }
                .icon-box{
                    width:302rpx;
                    height:276rpx;
                    margin:76rpx auto 72rpx;
                    .icon{
                        width:100%;
                        height:100%;
                    }
                }
                .vip-name{
                    font-size:32rpx; 
                    font-weight:500;
                }
                .vip-text{
                    font-size:32rpx; 
                    font-weight:500;
                }
            } 
        }
        .help-user{
            width:100%;
            margin-top:46rpx;
            .user-item{
                width:64rpx;
                height:64rpx;
                display:inline-block; 
                border-radius: 50%;
                margin-right:14rpx;
                &:last-child{
                    margin-right:0;
                }
                .user-null{
                    width:100%;
                    height:100%;
                    // line-height: 64rpx;
                    background:#E4E3EA;
                    color:#fff;
                    font-size:40rpx;
                    border-radius: 50%;
                }
                .img{
                    width:100%;
                    height:100%;
                    border-radius: 50%;
                    vertical-align: middle;
                }
            }
        } 
        .hint-text{
            font-size:28rpx;
            color:#808892;
            margin-top:28rpx;
        }
        .footer-btn{
            width:100%;
            .btn-box{
                display:block;
                width:360rpx;
                margin:38rpx auto 0; 
                .sub-btn{ 
                    width:360rpx;
                    height:84rpx;
                    line-height:84rpx;
                    background:linear-gradient(34deg,rgba(255,120,73,1) 0%,rgba(255,65,120,1) 100%);
                    border-radius:42rpx;  
                    font-size:26rpx;
                    color:#fff;
                    &:active{
                        opacity:.8;
                    }
                } 
            }
            
        } 
    }
    .help-content{
        height:748rpx;
        margin-top:-374rpx; 
        .help-title-box{
            width:100%;
            padding-top:84rpx;
            padding-bottom:76rpx;
            .title{
                font-size:48rpx;
                font-family: PingFangSC-Medium, sans-serif;
                font-weight:500;
                color:#FF5470;
            }
            .text{
                font-size:32rpx;
                font-family: PingFangSC-Regular, sans-serif;
                font-weight:400;
                color:#808892;
                margin-top:6rpx;
            }
        }
        .help-user{ 
            margin-top:34rpx;
        }
        .footer-btn{
            margin-top:74rpx;
            .footer-success{
                font-size:36rpx;
                font-family: PingFangSC-Medium, sans-serif;
                font-weight:500;
                color:#23A2E7;
            }
            .hint{
                font-size:28rpx;
                font-family: PingFangSC-Regular, sans-serif;
                font-weight:400;
                color:#808892;
            }
        }
    }
    .top-content{
        height:542rpx;
        margin-top:-271rpx; 
        .top-title-box{
            width:100%; 
            padding-top:76rpx;
            padding-bottom:38rpx;
            .title{
                font-size:48rpx;
                font-family: PingFangSC-Medium, sans-serif;
                font-weight:500;
                color:#FF5470;
            }
        }
        .describe{
            padding:0 68rpx;
            width:100%;
            font-size:28rpx;
            font-family: PingFangSC-Regular, sans-serif;
            font-weight:400;
            color:#808892;
        }
        .top-date-box{
            width:100%;
            font-family: PingFangSC-Medium, sans-serif;
            .over{
                font-size:28rpx;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:#23A2E7;
                padding-top:78rpx;
            }
            .data{
                font-size:36rpx; 
                font-weight:500;
                padding-top:48rpx;
                .title{ 
                    color:#808892;
                }
                .time{ 
                    color:#23A2E7;
                }
            } 
        }
    }
    .content-box-active{
        top:50%;
        transition:all .3s;
    }
    .vip-modul{
        position:absolute;
        top:0;
        left:0;
        height:100%;
        width:100%;
        background:rgba(50,50,50,0.7);
        z-index:20001;
    }
}

</style>

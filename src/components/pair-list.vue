<!--头部样式-->
<template> 
    <div class="pair-group" >
        <div class="pair-head">
            <div class="head-img-box" @click.stop="jumpLink"> 
                <image src="/static/image/vip-cap.png" class="vip-cap" v-if="groupItem.is_vip"></image> 
                <img :src="groupItem.head_pic?groupItem.head_pic+'?x-oss-process=image/resize,w_100':'https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/head-img-undefined.png'" mode="aspectFill"  alt="" class="head-img">
            </div>
            <div class="head-info-box">
                <div class="name"  @click.stop="jumpLink">{{groupItem.nickname}} <img src="/static/image/shoucang.png" alt="" class="shouchang-icon" v-if="groupItem.status==1"></div>
                <div class="info">{{groupItem.update_type==0?'新的配对！':groupItem.update_type==1?'已添加新照片':groupItem.update_type==2?'个性签名已更新':groupItem.update_type==3?'已更新影音书':''}}</div>
            </div>
            <div class="more-span"  @click.stop="handleCancel1">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div class="pair-content" :style="'height:'+windowWidth+'px'">
            <!--新配对-->
            <div  class="pair-swiper pair-item-position" v-if="groupItem.update_type==0"> 
                <swiper
                :indicator-dots="true"  
                :duration="1000"
                indicator-color="#FFFFFF"
                indicator-active-color="#FF5470"
                :current="photoCurrent" 
                @change="userSwiperChange"
                style="height:100%;width:100%;"
                > 
                <swiper-item  class="pair-swiper-item" v-for="(photoItem,index) in groupItem.photo" :key="photoItem" >
                    <image mode="aspectFill" :src="photoItem.link+'?x-oss-process=image/resize,w_600'" style="height:100%;width:100%"/> 
                    <!--<image-loader  :src="photoItem.link" image-style="width:100%; height:100%;" ></image-loader>-->
                </swiper-item>  
                </swiper>  
                <!-- <div class="hiet_text text-center" >已配对！</div> --> 
            </div>
            <!--更新个人内容-->
            <div style="height:100%;" class="pair-item-position" v-if="groupItem.update_type==3||groupItem.update_type==2||groupItem.update_type==1">
                <img :src="groupItem.update_type==1?groupItem.update_content+'?x-oss-process=image/resize,w_600':groupItem.head_pic+'?x-oss-process=image/resize,w_600'" mode="aspectFill"  alt="" class="pair-photo-img"> 
                <div class="modal-box"  v-if="groupItem.update_type==2">
                    <!--更新了个性签名-->
                    <div class="signature">
                        <div class="signature-title text-center">个性签名</div>
                        <div class="signature-content">{{groupItem.update_content}}</div>
                    </div>
                </div>  
                <div class="modal-box"  v-if="groupItem.update_type==3">  
                    <!--更新了影音书-->
                    <div class="signature">
                        <div class="signature-title text-center">{{groupItem.update_content}}</div>
                        <!--<div class="signature-content">
                            <div class="oldcobbers-items"> 
                                哲学，励志，名人自白书，还有一些技能书籍。对工作，事业认真且有计划，生活比较随性
                            </div>
                            <div class="oldcobbers-items"> 
                                哲学，励志，名人自白书，还有一些技能书籍。对工作，事业认真且有计划，生活比较随性
                            </div>
                            <div class="oldcobbers-items"> 
                                哲学，励志，名人自白书，还有一些技能书籍。对工作，事业认真且有计划，生活比较随性
                            </div>
                        </div>-->
                    </div> 
                </div>

                <!--没留言-->
                <!-- <div class="comment-input-box" v-if="!groupItem.comment">
                    <div class="comment-input">
                        <input type="text" class="input" confirm-type="send" v-model="groupItem.inputValue" :class="{'input-acitve':inputActive}" :focus="inputFocus" @blur="inputBlur" @click="inputFocus=true" @confirm="bindconfirm(groupItem) " >
                    </div>
                    <div class="comment-head-box">
                        <img src="/static/image/pair-liuyan.png" mode="aspectFill"  alt="" class=" comment-head-img" v-if="!inputActive" @click.stop="selectInput(true)">
                        <img :src="meLink?meLink+'?x-oss-process=image/resize,w_100':'https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/head-img-undefined.png'" mode="aspectFill"  alt="" class=" comment-head-img"  v-if="inputActive" @click.stop="selectInput(false)">
                    </div> 
                </div> -->
                <!--有留言-->
                <!-- <div class="comment-input-box"  v-if="groupItem.comment">
                    <div class="content-box" @click.stop="jumpChating">
                        <div class="content">
                            <div class="text"> {{groupItem.comment}}  </div>
                            <div class="time" v-if="groupItem.comment_time">已发送 · {{groupItem.comment_time}}</div>
                        </div>
                        <div class="right-icon">
                            <i-icon type="enter" size="24" color="#fff" />
                        </div>
                    </div> 
                    <div class="comment-head-box">
                        <img :src="meLink?meLink+'?x-oss-process=image/resize,w_100':'https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/head-img-undefined.png'" mode="aspectFill"  alt="" class=" comment-head-img" >
                    </div>  
                </div> -->

            </div> 
        </div>
        <div class="pair-detail " >
            <!--没留言-->
            <div class="comment-input-box" v-if="!groupItem.comment">
                <div class="comment-input">
                    <input type="text" class="input" confirm-type="send" v-model="groupItem.inputValue" :class="{'input-acitve':inputActive}" :focus="inputFocus" @blur="inputBlur" @click="inputFocus=true" @confirm="bindconfirm(groupItem) " >
                </div>
                <div class="comment-head-box">
                    <img src="/static/image/pair-liuyan.png" mode="aspectFill"  alt="" class=" comment-head-img" v-if="!inputActive" @click.stop="selectInput(true)">
                    <img :src="meLink?meLink+'?x-oss-process=image/resize,w_100':'https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/head-img-undefined.png'" mode="aspectFill"  alt="" class=" comment-head-img"  v-if="inputActive" @click.stop="selectInput(false)">
                </div> 
            </div>
            <!--有留言-->
            <div class="comment-input-box"  v-if="groupItem.comment">
                <div class="content-box input-acitve" @click.stop="jumpChating">
                    <div class="content">
                        <div class="text"> {{groupItem.comment}}  </div>
                        <div class="time" v-if="groupItem.comment_time">已发送 · {{groupItem.comment_time}}</div>
                    </div>
                    <div class="right-icon">
                        <i-icon type="enter" size="24" color="#fff" />
                    </div>
                </div> 
                <div class="comment-head-box">
                    <img :src="meLink?meLink:'https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/head-img-undefined.png'" mode="aspectFill"  alt="" class=" comment-head-img" >
                </div>  
            </div>
            <div class="detial-items" v-if="groupItem.school">
                <img src="/static/image/home-school.png" alt="" class="school">
                <span>{{groupItem.school}}</span>
            </div>
            <div class="detial-items">
                <img src="/static/image/home-location.png" alt="" class="location">
                <span>{{groupItem.distance>1?groupItem.distance+' km':'1 km以内'}}</span>
            </div>
            <div class="time">{{groupItem.update_time_text}}{{groupItem.update_type==0?' 新配对好友':groupItem.update_type==1?' 更新了相册':groupItem.update_type==2?' 更新了签名':groupItem.update_type==3?' 更新了影音书':''}}</div>
        </div>
    </div>   
</template>

<script>
import * as apiPair from '@/utils/api' ; 
export default {
    props: {
        groupItem:{
            default:{},
            type:Object
        },  
        meLink:{
            default:'',
            type:String
        },
    },
    data () {
        return {  
            windowWidth:wx.getStorageSync('systemInfo').windowWidth, 
            photoCurrent:0,
            // commentInput:'',  //inputValue
            inputActive:false, //是否唤起input框
            inputFocus:false,  //是否聚焦 
            actions1: ['分享','聊天','查看个人资料','取消配对'],
            postLink:'',
        }
    },
    watch:{
        groupItem(a,b){ 
            let platform = wx.getSystemInfoSync().platform;
            if (platform == 'android') {
                if(this.groupItem.status==1){
                    this.actions1 = ['聊天','查看个人资料','取消关注','关闭'];
                }else{
                this.actions1 = ['聊天','查看个人资料','收藏','取消关注','关闭']; 
                } 
            } else {
                if(this.groupItem.status==1){
                    this.actions1 = ['聊天','查看个人资料','取消关注'];
                }else{
                this.actions1 = ['聊天','查看个人资料','收藏','取消关注'];
                }  
            }
        },
    },
    mounted() { 
        
    },
    methods:{
        jumpLink(){  
            this.$emit('jumpDetail',this.groupItem); 
        }, 
        userSwiperChange(e){ 
            this.photoCurrent=e.mp.detail.current;
        },
        selectInput(val){
            this.inputActive=val;
            this.inputFocus=val;
            if(val){
                this.groupItem.update_type==0?this.postLink=this.groupItem.photo[this.photoCurrent].link:this.groupItem.update_type==1?this.postLink=this.groupItem.update_content:this.groupItem.update_type==2||this.groupItem.update_type==3?this.postLink=this.groupItem.head_pic:'';
            }
        },
        inputBlur(){
            this.inputFocus=false;
            // console.log(111);
        }, 
        //跳转聊天
        jumpChating(){
            this.$emit('jumpChating',this.groupItem); 
        },
        //评论 //点击确认键
        bindconfirm(item){
            // this.$emit('bindconfirm',item,this.indexItem,this.commentInput,this.postLink);  
            let vm = this;
            if(this.groupItem.inputValue){
                let body={
                    log_id:item.log_id,
                    ruuid:item.ruuid,
                    link:vm.postLink,
                    comment:vm.groupItem.inputValue,
                }   
                apiPair.postComment(body).then(res=>{ 
                    console.log(res);
                    if(res.data.code==300000){ 
                        let itemData = item;
                        itemData.comment = vm.groupItem.inputValue;
                        vm.$emit('confirm',itemData);  
                        item.comment=vm.groupItem.inputValue;  
                        // vm.groupItem.inputValue="";
                    }
                })
            }else{
                wx.showModal({
                    title: '提示',
                    content: '评论内容不能为空',
                    showCancel:false,
                    success(res) {
                        if (res.confirm) {
                        // console.log('用户点击确定')
                        } 
                    }
                })
            }
        },
        handleCancel1(){
            let that = this;
            let platform = wx.getSystemInfoSync().platform; 
            if(that.groupItem.status==1){
                if (platform == 'android') {
                that.actions1 = ['聊天','查看个人资料','取消关注','关闭'];
                } else { 
                    that.actions1 = ['聊天','查看个人资料','取消关注']; 
                } 
            } 
            wx.showActionSheet({
                itemList: that.actions1, 
                success: function (res) {//res.tapIndex点击的列表项 
                    console.log("点击了列表项：" + that.actions1[res.tapIndex]) 
                    if(that.groupItem.status==1){
                        if(res.tapIndex==0){
                        that.$emit('jumpChatPage',that.groupItem); 
                        }else if(res.tapIndex==1){
                            that.$emit('jumpDetail',that.groupItem); 
                        }else if(res.tapIndex==2){
                            wx.showModal({
                                title: '提示',
                                content: '取消配对后，将无法查看对方动态', 
                                success(res) {
                                    if (res.confirm) {
                                        that.$emit('cancelPair',that.groupItem); 
                                    } 
                                }
                            }) 
                        }else if(res.tapIndex==3){
                            console.log('关闭');
                        }
                    }else{
                        if(res.tapIndex==0){
                            that.$emit('jumpChatPage',that.groupItem); 
                        }else if(res.tapIndex==1){
                            that.$emit('jumpDetail',that.groupItem); 
                        }else if(res.tapIndex==2){ 
                            that.$emit('superLike',that.groupItem); 
                            // if (platform == 'android') {
                            //     that.actions1 = ['聊天','查看个人资料','取消关注','关闭'];
                            // } else { 
                            //     that.actions1 = ['聊天','查看个人资料','取消关注']; 
                            // } 
                        }else if(res.tapIndex==3){
                            wx.showModal({
                                title: '提示',
                                content: '取消配对后，将无法查看对方动态', 
                                success(res) {
                                    if (res.confirm) {
                                        that.$emit('cancelPair',that.groupItem); 
                                    } 
                                }
                            }) 
                        }else if(res.tapIndex==4){
                            console.log('关闭');
                        }
                    } 
                },
                fail: function (res) {

                } 
            }) 
        }, 
    }, 
}
</script>

<style scoped lang="scss">
.pair-group{
    background:#fff;
    .pair-head{
        height:168rpx;
        width:100%;
        display:flex;
        align-items:center;
        justify-content:center;
        padding-left:44rpx;
        .head-img-box{
            flex:0 0 92rpx;
            height:92rpx;
            position: relative; 
            .vip-cap{
                position: absolute;
                top:-22rpx;
                left:50%;
                margin-left:-16rpx;
                width:32rpx;
                height:32rpx;
            } 
            .head-img{
                width:100%;
                height:100%;
                border-radius:50%;
            }
        }
        .head-info-box{
            flex:1; 
            font-family:PingFangSC-Medium;
            font-weight:500;
            padding-left:14rpx;
            .name{ 
                padding-right:20rpx;
                display:inline-block;
                font-size:36rpx;
                color:#354052;
            }
            .shouchang-icon{
                width:26rpx;
                height:24rpx;
                margin-left:6rpx; 
            }
            .info{ 
                font-size:28rpx;
                color:#808892;
            }
        }
        .more-span{
            flex:0 0 120rpx;
            padding:40rpx 0;
            &:active{
                opacity:.7;
            }
            span{
                display:inline-block;
                width:16rpx;
                height:16rpx;
                margin-right:8rpx;
                border-radius:50%;
                background:#E1E6EB;
            } 
        }
    }
    .pair-swiper{
        width:100%;
        height:100%;
        z-index:99;
        .hiet_text{
            width:100%;
            height:298rpx;
            line-height:298rpx;
            background:linear-gradient(180deg,rgba(77,77,77,0) 0%,rgba(30,30,30,1) 100%);
            position:absolute;
            bottom:0;
            font-size:100rpx;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#fff; 
            z-index:20;
        }
        .pair-swiper-item{
            display:flex;
            align-items:center;
            justify-content:center; 
            z-index:10;
        }
    }
    .pair-content{
        width:100%;  
        .pair-item-position{
            position:relative; 
            width:100%;  
            
        }
        .pair-photo-img{
            width:100%;
            height:100%;
        }
        .modal-box{
            position:absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
            z-index:2;
            background:linear-gradient(180deg,rgba(255,61,61,.6) 0%,rgba(255,51,123,.6) 100%); 
            padding-top:104rpx; 
            box-sizing:border-box;
            .signature{
                width:100%;
                height:100%;
                color:#fff; 
                z-index:6;
                .signature-title{
                    font-size:56rpx; 
                    font-weight:500;
                }
                .signature-content{
                    font-size:32rpx;
                    padding:0 58rpx;
                    margin-top:60rpx;
                    
                }
                .oldcobbers-items{
                    width:100%;
                    margin-top:20rpx;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
            }
        } 
    }
    .pair-detail{
        padding-left:40rpx;
        margin-top:16rpx;
        position: relative;
        .comment-input-box{
            width:100%;
            position:absolute;
            top:-74rpx;
            right:0;
            padding:0 42rpx;  
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:100;
            .comment-input{
                flex:1;
                height:102rpx;  
                border-radius:51rpx 51rpx 10rpx 51rpx;
                margin-right:26rpx;
                position:relative;
                .input{
                    position:absolute;
                    bottom:0;
                    right:0;
                    width:0;
                    height:100%;
                    padding:0;
                    box-sizing:border-box;
                    font-size:30rpx;
                    background:#fff;
                    box-shadow:0 4rpx 8rpx 0 rgba(0,0,0,0.22);
                    border-radius:51rpx 51rpx 10rpx 51rpx;
                    transition:all .1s;
                    z-index:10;
                }
                .input-acitve{
                    width:100%;
                    padding:18rpx 30rpx;
                    transition:all .2s;
                    margin-bottom:30rpx;
                }
            }
            .content-box{ 
                flex:1;
                min-height:102rpx;
                max-height:160rpx;
                width:100%;
                margin-right:26rpx; 
                padding:18rpx 48rpx; 
                background:#4A90E2;
                color:#fff;
                box-shadow:0px 4px 8px 0px rgba(0,0,0,0.22);
                border-radius:51px 51px 10px 51px;
                font-size:28rpx;
                display:flex;
                align-items:center;
                justify-content:center;
                margin-top:-40rpx;
                .content{
                    flex:1;
                    width:100%;
                    
                    .text{
                        width:100%;
                        text-overflow: -o-ellipsis-lastline;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    .time{
                        font-size:20rpx;
                    }
                }
                .right-icon{
                    flex:0 0 60rpx;
                }
            } 
            .comment-head-box{
                flex:0 0 128rpx;
                height:128rpx;
                border-radius:50%; 
                background:#fff;
                z-index:19;
                .comment-head-img{
                    width:100%;
                    height:100%;
                    border-radius:50%;
                    z-index:20;
                }
            } 
        }
        .detial-items{
            font-size:28rpx;
            font-family:PingFangSC-Light;
            font-weight:300;
            color:#4E5761; 
            margin-bottom:6rpx;
            .school{
                width:32rpx;
                height:26rpx;
                margin-right:6rpx; 
                margin-top:3rpx; 
                margin-bottom:10rpx;
                vertical-align: middle;
            }
            .location{
                height:32rpx;
                width:26rpx;
                margin-left:4rpx;
                margin-right:6rpx;
                vertical-align: middle;
                margin-bottom:10rpx;
            }
        }
        .time{
            font-size:20rpx;
            color:#A1A7AE;
            padding-left:4rpx;
            margin-top:6rpx;
        }
    }
    .pair-detail-margin{
        margin-top:80rpx;
    }
}
</style>

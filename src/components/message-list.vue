<!--头部样式-->
<template>
    <div>
        <div class="message-group" @click="jumpLink(item)" @touchend="touchend" @longtap="longTap" >
            <div class="message-head">
                <img :src="item.head_pic?item.head_pic+'?x-oss-process=image/resize,w_100':'https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/head-img-undefined.png'" mode="aspectFill"  alt="" class="head-img">
                <!--<span class="on-line"></span>-->
            </div>
            <div class="message-info-box" >
                <div class="message-info">
                    <div class="message-info-title">
                        <span class="name">{{item.nick_name}}</span>
                        <img src="/static/image/like-other.png" alt="" class="like-other info-icon" v-if="item.pair_type==3">
                        <img src="/static/image/lightning.png" alt="" class="lightning info-icon" v-if="item.pair_type==1"> 
                        <img src="/static/image/super-like-other.png" alt="" class="super-like-other info-icon" v-if="item.pair_type==2">  
                        <span class="total float-right text-center" v-if="item.totalNum">{{item.totalNum}}</span>
                    </div>
                    <div class="message-im-text">
                        {{item.msgCategory==1?item.content:'[图片]'}} 
                    </div>
                </div>
            </div> 
        </div>  
    </div>  
</template>

<script>
export default {
    props: { 
        item:{
            default:{},
            type:Object
        },
    },
    data () {
        return {  
            lockTap:false, 
        }
    },
    methods:{
        jumpLink(item){
            if (this.lockTap) {
                return;
            }
            this.$emit('jumpLink',item,'imList'); 
        },
        touchend(){
            if (this.lockTap) { 
                setTimeout(() => {
                    this.lockTap=false;
                }, 100);
            }
        }, 
        longTap(e){
            this.lockTap=true ;
            console.log(e)
        }
    }, 
}
</script>

<style scoped lang="scss">
.message-group{
    width:100%;
    height:198rpx;
    padding-left:30rpx;
    display:flex;
    align-items:center;
    justify-content:center;
    .message-head{
        flex:0 0 160rpx;
        height:160rpx;
        position:relative;
        .head-img{
            width:100%;
            height:100%;
            border-radius:50%;
        }
        .on-line{
            position:absolute;
            bottom:0;
            right:0;
            width:36rpx;
            height:36rpx;
            background:#50E370;
            border:2rpx solid #fff;
            border-radius:50%;
        }
    }
    .message-info-box{
        flex:1; 
        height:198rpx;
        border-bottom:1rpx solid #E1E6EB;
        margin-left:18rpx;
        display:flex;
        align-items:center;
        justify-content:center;
    }
    .message-info{ 
        .message-info-title{
            width:100%;
            padding-right:30rpx;
            .name{
                font-size:36rpx;
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:#354052;
            }
            .info-icon{
                margin-left:20rpx;
                vertical-align: middle;
            }
            .like-other{
                width:62rpx;
                height:40rpx;
            }
            .lightning{ 
                width:22rpx;
                height:36rpx;
            }
            .super-like-other{ 
                width:36rpx;
                height:36rpx;
            }
            .total{
                min-width:38rpx;
                min-height:38rpx;
                line-height:38rpx;
                background:#FF8C54;
                border-radius:50%;
                font-size:22rpx; 
                color:#fff;
            }
        }
        .message-im-text{ 
            width:520rpx;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            margin-top:18rpx;
            color:#808892;
            font-size:28rpx;
            font-family:PingFangSC-Medium;
            font-weight:500;  
        }
    }
}
</style>

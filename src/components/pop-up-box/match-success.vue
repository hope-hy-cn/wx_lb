<!--配对成功-->
<template>
    <div class="match-success">
        <div class="text-center title">配对成功</div>
        <div class="text-center ">你和<span>“{{item.nick_name}}”</span>相互喜欢了对方</div>
        <div class="pairs-of text-center together">
            <div class="user-left user-img ">
                <img  mode="aspectFill"  :src="item.head_pic" alt="" class="head-img">
            </div>
            <div class="user-right user-img ">
                <img  mode="aspectFill"  :src="meLink" alt="" class="head-img">
            </div>
            <div class="heart-box">
                <img src="/static/image/heart-success.png" alt="" class="heart-icon">
            </div>
        </div>
        <div class="match-input"> 
            <input type="text" v-model="msgValue" placeholder="打个招呼吧！" class="input">
            <div class="input-btn text-center" @click.stop="postSend">发送</div>
        </div>
        <div class="to-see text-center" @click.stop="closeMatchSuccess">继续查看</div>
    </div> 
</template>

<script>  
export default {
    props: {
        // isShow:{
        //     default:false,
        //     type:Boolean
        // }, 
        meLink:{
            default:'',
            type:String
        },
        item:{
            default:{},
            type:Object
        },
    },
    components: {  

    },
    data(){
        return { 
            msgValue:''
        }
    }, 
    methods:{  
        closeMatchSuccess(){
            this.$emit('close');
        },
        postSend(){
            this.$emit('postSend',this.msgValue,this.item);
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
    background:rgba(50,50,50,0.7);
    z-index:20000;
    padding-top:14vh;
    color:#fff;
    .title{
        margin-bottom:12rpx;
    }
    .pairs-of{
        .user-img{
            display:inline-block;
            width:280rpx;
            height:280rpx;
            border:4rpx solid #fff;
            border-radius:50%;
            margin-top:56rpx;
            .head-img{
                width:100%;
                height:100%;
                border-radius:50%;
            } 
        }
        .user-left{
            transform:translate(10px, 0px) translateZ(0px); 
        }
        .user-right{
            transform:translate(-10px, 0px) translateZ(0px); 
        }
        
    }
    .together{
        position:relative;
        .user-left{
            -webkit-animation: scaleDraw-left 1.5s linear 1;
            animation: scaleDraw-left 1.5s linear 1;
        }
        .user-right{
            -webkit-animation: scaleDraw-right 1.5s linear 1;
            animation: scaleDraw-right 1.5s linear 1; 
        }
        @keyframes scaleDraw-left {  
            0%{
                transform:translate(-60%, 0px) translateZ(0px); 
            } 
            25%{
                transform:translate(0px, 0px) translateZ(0px); 
            }
            40%{
                transform:translate(-20%, 0px) translateZ(0px); 
            }
            60%{
                transform:translate(0px, 0px) translateZ(0px); 
            }
            80%{
                transform:translate(-10px, 0px) translateZ(0px); 
            }
            100%{
                transform:translate(10px, 0px) translateZ(0px); 
            }
        } 
        @keyframes scaleDraw-right {  
            0%{
                transform:translate(60%, 0px) translateZ(0px); 
            } 
            25%{
                transform:translate(0px, 0px) translateZ(0px); 
            }
            40%{
                transform:translate(20%, 0px) translateZ(0px); 
            }
            60%{
                transform:translate(0px, 0px) translateZ(0px); 
            }
            80%{
                transform:translate(10px, 0px) translateZ(0px); 
            }
            100%{
                transform:translate(-10px, 0px) translateZ(0px); 
            }
        } 
        .heart-box{
            position:absolute;
            top:126rpx;
            left:50%;
            margin-left:-72rpx;
            width:144rpx;
            height:144rpx;
            background:#fff;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            .heart-icon{
                width:64rpx;
                height:54rpx;
                transform: scale(1);
                -webkit-animation: scaleDraw-heart 1.5s linear 1;
                animation: scaleDraw-heart 1.5s linear 1; 
            }
            @keyframes scaleDraw-heart {  
                0%{
                    transform: scale(1);
                } 
                25%{
                    transform: scale(1.5); 
                }
                40%{
                    transform: scale(1);
                }
                60%{
                    transform: scale(1.3); 
                }
                80%{
                    transform: scale(1.2);  
                }
                100%{
                    transform: scale(1);  
                }
            }
        }
    }
    .match-input{ 
        width:620rpx;
        margin:80rpx auto 0;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:32rpx;
        border-radius:16rpx;
        background:#fff;
        .input{
            flex:1;
            width:100%;
            height:100%;
            padding:30rpx 28rpx;
            color:#4E5761;
        }
        .input-btn{
            flex:0 0 138rpx;
            border-left:1rpx solid #E1E6EB;
            color:#23A2E7;
            padding:4rpx 0;
            &:active{
                opacity:.7;
            }
        }
    }
    .to-see{
        color:#fff;
        font-size:32rpx;
        font-family:PingFangSC-Regular;
        font-weight:400;
        margin-top:6vh;
    }
}

</style>

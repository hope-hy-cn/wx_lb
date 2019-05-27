
<template>
    <div class="news-list"> 
        <div class="header">
            <div  class="header-img" @click.stop="jumpDetail(dataItem)"> 
                <!-- <image-loader :src="" width="100%" height="100%" image-style="border-radius:50%;"></image-loader> -->
                <image mode="aspectFill" :src="dataItem.author_head?dataItem.author_head+'?x-oss-process=image/resize,w_100':'/static/image/user.png'" style="width:100%;height:100%;border-radius:50%;"></image>
            </div>
            <div  class="header-text" @click.stop="jumpDetail(dataItem)">
                <div class="name">{{dataItem.author_name?dataItem.author_name:'匿名用户'}}</div>
                <div class="date">{{dataItem.create_time}}</div>
            </div>
            <div  class="hearder-btn" @click.stop="attention(dataItem)" v-if="page=='detail'&&!dataItem.author_is_like">
                <p class="btn text-center">关注</p>
            </div>
            <div class="more-focus" v-if="more">
                <div class="moreImg" @click.stop="checkMore">
                    <img src="/static/image/more-focus.png" alt="">
                </div>
                <div :class="['moreList',{'active':isMore}]">
                    <div class="listItem" @click.stop="deleteItem(dataItem)">
                        删除
                    </div>
                </div>
            </div>
        </div> 
        <div class="main-text-box clear-both"  @click.stop="leaveWord(dataItem)">   
            <div class="main-text" :class="{'main-text-clamp':page=='list'}">{{dataItem.content}}</div>
            <!--<div class="look-more float-right" v-if="page=='list'">展开更多>></div> -->
        </div>
        <div class="news-photo" v-if="photo.length>0" :style="{'padding':page=='list'?'30rpx 32rpx;':'30rpx 0;'}">
            <!-- 一张 -->
            <div class="one-length" :style="'height:'+screenWidth+'px'" v-if="photo.length==1"    @click="previewImage(photo[0])">
                <image-loader :src="photo[0]+'?x-oss-process=image/resize,w_600'" width="100%" height="100%" :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
            </div>

            <!-- 两张 -->
            <div class="two-length" v-if="photo.length==2"> 
                <div class="img-box"   @click="previewImage(photo[0])">
                    <image-loader :src="photo[0]+'?x-oss-process=image/resize,w_500'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                </div>
                <div class="img-box"   @click="previewImage(photo[1])">
                    <image-loader :src="photo[1]+'?x-oss-process=image/resize,w_500'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                </div>  
            </div>

            <!-- 三张 -->
            <div class="three-length"  v-if="photo.length==3">
                <div class="left-box"   @click="previewImage(photo[0])">  
                    <image-loader :src="photo[0]+'?x-oss-process=image/resize,w_400'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                </div>
                <div class="right-box"> 
                    <p class="right-img-box"   @click="previewImage(photo[1])">
                        <image-loader :src="photo[1]+'?x-oss-process=image/resize,w_300'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                    </p>
                    <p class="right-img-box"   @click="previewImage(photo[2])">
                        <image-loader :src="photo[2]+'?x-oss-process=image/resize,w_300'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                    </p>
                </div> 
            </div>
            
            <!-- 四张 -->
            <div class="four-length"  v-if="photo.length==4">
                <div class="top-box"  @click="previewImage(photo[0])"> 
                    <image-loader :src="photo[0]+'?x-oss-process=image/resize,w_500'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                </div>
                <div class="bottom-box"> 
                    <p class="bottom-img-box"  @click="previewImage(photo[1])">
                        <image-loader :src="photo[1]+'?x-oss-process=image/resize,w_300'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                    </p>
                    <p class="bottom-img-box"  @click="previewImage(photo[2])">
                        <image-loader :src="photo[2]+'?x-oss-process=image/resize,w_300'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                    </p>
                    <p class="bottom-img-box"  @click="previewImage(photo[3])">
                        <image-loader :src="photo[3]+'?x-oss-process=image/resize,w_300'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                    </p>
                </div>
            </div>
 
             <!-- 五、六、七张 -->
            <div class="seven-length" :style="{'height':photo.length==5?'740rpx':photo.length==6?'710rpx':'646rpx'}" v-if="photo.length==5||photo.length==6||photo.length==7">
                <div class="top-box"> 
                    <div class="top-left-box"  @click="previewImage(photo[0])">
                        <image-loader :src="photo[0]+'?x-oss-process=image/resize,w_500'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                    </div>
                    <div class="top-right-box">
                        <p class="right-img-box"  @click="previewImage(photo[1])">
                            <image-loader :src="photo[1]+'?x-oss-process=image/resize,w_300'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                        </p>
                        <p class="right-img-box"  @click="previewImage(photo[2])">
                            <image-loader :src="photo[2]+'?x-oss-process=image/resize,w_300'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                        </p>
                    </div>
                </div>
                <div class="bottom-box" :class="{'six-bottom-box':photo.length==6,'seven-bottom-box':photo.length==7}"> 
                    <p class="bottom-img-box" @click="previewImage(photo[3])" >
                       <image-loader :src="photo[3]+'?x-oss-process=image/resize,w_300'"  width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                    </p>
                    <p class="bottom-img-box"  @click="previewImage(photo[4])">
                        <image-loader :src="photo[4]+'?x-oss-process=image/resize,w_300'"  width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                    </p> 
                    <p class="bottom-img-box" v-if="photo.length>=6"  @click="previewImage(photo[5])">
                        <image-loader :src="photo[5]+'?x-oss-process=image/resize,w_300'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                    </p> 
                    <p class="bottom-img-box" v-if="photo.length==7"  @click="previewImage(photo[6])">
                        <image-loader :src="photo[6]+'?x-oss-process=image/resize,w_300'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader> 
                    </p> 
                </div>
            </div>

            <!-- 八张-->
            <div class="eight-length"  v-if="photo.length==8">    
                <div class="img-items" v-for="(item,index) in photo" :key="index" :style="{'height':page=='list'?'162rpx;':'178rpx;','width':page=='list'?'162rpx;':'178rpx;'}">   
                    <div style="height:100%;width:100%" @click="previewImage(item)">
                        <image-loader :src="item+'?x-oss-process=image/resize,w_200'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader>
                    </div> 
                </div> 
            </div>

            <!-- 九张-->
            <div class="nine-length"  v-if="photo.length==9">     
                <div class="img-items" v-for="(item,index) in photo" :key="index" :style="{'height':page=='list'?'220rpx;':'240rpx;','width':page=='list'?'220rpx;':'240rpx;'}">   
                    <div style="height:100%;width:100%" @click="previewImage(item)">
                        <image-loader :src="item+'?x-oss-process=image/resize,w_200'" width="100%" height="100%"  :image-style="page=='list'?'border-radius:6rpx;':''"></image-loader>
                    </div> 
                </div> 
            </div>

        </div>
        <div class="topic" v-if="dataItem.topic" @click.stop="jumpTopic(dataItem)">
            <image src="/static/image/hash-hover.png" class="img"></image>
            <span> {{dataItem.topic}}</span>
        </div>
        <!-- 底部操作按钮 -->                                                           
        <div class="operation">  
            <!-- <div class="box"> -->
                <div class="good-item" @click.stop="thumb(dataItem)">
                    <image :src="dataItem.is_like?'/static/image/good-active.png':'/static/image/good.png'" class="img" :class="{'good-img':goodShow}"></image>
                    <span class="num">{{dataItem.like_cnt}}</span>
                </div>
                <div class="leave-word text-center" @click.stop="leaveWord(dataItem,'setWords')">
                    <image src="/static/image/leave-word.png" class="img"></image>
                    <span class="num">{{dataItem.reply_cnt}}</span>
                </div>
                <div class="share text-right">
                    <button  class="text-right share-btn" open-type="share" v-if="page=='detail'">
                        <image src="/static/image/news-share.png" class="img"></image>
                        <!-- <span class="num">{{dataItem.reply_cnt}}</span> -->
                    </button> 
                    <button  class="text-right share-btn" @click.stop="shareItem(dataItem)" v-if="page=='list'">
                        <image src="/static/image/news-share.png" class="img"></image>
                        <!-- <span class="num"></span> -->
                    </button> 
                </div>
            <!-- </div> -->
        </div>
        
    </div> 
</template>

<script>
import * as api from '@/utils/api' ;   
const app = getApp();
export default {
    props: { 
        page:{       //list:普通列表页，detail:详情页
            default:'list',   
            type:String
        }, 
        more:{
            default:false,   
            type:Boolean
        },
        dataItem:{
            default:{},   
            type:Object
        }, 
    }, 
    data(){
        return { 
            screenWidth:wx.getStorageSync('systemInfo').screenWidth,
            attentionShow:false,
            goodShow:false,
            photo:[],
            isMore:false,
            
        }
    }, 
    watch:{
        dataItem(newName, oldName){
            if(this.dataItem.pics){
                this.photo=this.dataItem.pics;
            } else{
                this.photo=[];
            } 
        },
    },
    mounted() { 
        if(this.dataItem.pics){
            this.photo=this.dataItem.pics;
        } else{
            this.photo=[];
        }   
        if(this.dataItem.create_at){ 
            this.dataItem.create_time=this.getDateDiff(this.dataItem.create_at);
        } 
    },
    methods:{
        clearCard(val){ 
           this.$emit('clear',val); 
        },
        handleClick(val){ 
            this.$emit('addList',val);
        },
        //图片预览
        previewImage(item){ 
            wx.previewImage({
                current: item, // 当前显示图片的http链接
                urls: this.photo // 需要预览的图片http链接列表
            })
        },
        //跳转详情
        jumpDetail(item){
            app.aldstat.sendEvent('news:日志详情');
            this.$emit('jumpDetail',item)
        },
        //关注
        attention(item){ 
            let vm =this;
            // vm.$emit('keep',item)
            // if(!vm.attentionShow){
            //     vm.attentionShow=true;
            //     vm.dataItem.author_is_like=true; 
            //     setTimeout(()=>{
            //         vm.attentionShow=false;  
            //     },300); 
            // } 
            if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
                app.aldstat.sendEvent('news:关注');
                api.userpageOperation({
                    ruuid:item.author_uuid,
                    type:1,
                    enter_page:0,
                }).then(res=>{
                    if(res.data.code==300000){
                        vm.dataItem.author_is_like=true; 
                    }
                }).catch(err=>{
                    console.log(err);
                });
            } else {
                this.$emit('isLogin',item); 
            } 
        },
        // 点赞
        thumb(item){
            let vm =this; 
            if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
                app.aldstat.sendEvent('news:点赞');
                
                if(!vm.goodShow){  
                    // vm.$emit('thumb',item); 
                    if(!item.is_like){
                        vm.goodShow=true;  
                        let ctime=setTimeout(()=>{
                            vm.goodShow=false;  
                            clearTimeout(ctime);
                        },200) 
                    } 
                    api.postArtLike({
                        article_id:item.art_id,
                        is_like:item.is_like?0:1
                    }).then(res=>{
                        if(res.data.code==300000){
                            item.is_like=!item.is_like;
                            item.is_like?item.like_cnt++:item.like_cnt--;
                        }
                    })
                } 
            } else {    
                this.$emit('isLogin',item); 
            } 
        },
        //留言
        leaveWord(item,type){
            app.aldstat.sendEvent('news:评论');
            this.$emit('leaveWord',item,type)
        },
        //分享
        shareItem(item){  
            this.$emit('share',item)  
        }, 
        //跳转 话题
        jumpTopic(item){
            app.aldstat.sendEvent('news:话题');
            this.$emit('jumpTopic',item)
        },
        //查看更多
        checkMore(){
            this.isMore=!this.isMore;
        },
        deleteItem(item){
            this.isMore=false;
            let me=this;
            wx.showModal({
                title: '提示',
                content: '确认删除当前日志',
                showCancel: true,
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        me.$emit('deleteItem',{isDelete:true,item:item});
                    } else if(res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            });
        },
    }
}
</script>

<style scoped lang="scss">
    .news-list{
        width:100%;
        // height:100%;
        background:#fff;
        padding-top:38rpx;
        margin-bottom:16rpx;
        .header{
            width:100%;
            height:65rpx;
            padding:0 32rpx 0  44rpx; 
            margin-bottom:24rpx;
            display: flex;
            align-items:center;
            justify-content: center;
            .header-img{
                flex:0 0 64rpx;
                height:64rpx;
                // .img{
                //     width:100%;
                //     height:100%;
                //     border-radius:50%;
                // }
            }
            .header-text{
                flex:1;
                padding:0 16rpx;
                .name{
                    font-size:30rpx;
                    color:#354052;
                }
                .date{
                    font-size:20rpx;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:#A1A7AE;
                }
            }
            .hearder-btn{
                flex:0 0 112rpx;
                .btn{
                    width:100%;
                    height:48rpx;
                    line-height:48rpx;
                    background:transparent;
                    border-radius:28rpx;
                    border:1rpx solid #FF5470;
                    color:#FF5470;
                    font-size:24rpx;
                    &:active{
                        background:#FF5470; 
                        border:1rpx solid #fff;
                        color:#fff;
                    }
                } 
            }
            .more-focus{
                width:40rpx;
                height: 36rpx;
                position: relative;
                .moreImg{
                    width: 100%;
                    height:100%;
                    img{
                        display: block;
                        width:8rpx;
                        height: 36rpx;
                        margin:0 auto;
                    }
                }
                .moreList{
                    width:160rpx;
                    height:0rpx;
                    position: absolute;
                    top: 0;
                    right: 0;
                    margin-top:45rpx;
                    background: #fff;
                    box-shadow:0rpx 6rpx 10rpx 2rpx rgba(239,241,246,.8);
                    border:1rpx solid rgba(239,241,246,1);
                    border-radius:8rpx;
                    overflow: hidden;
                    opacity: 0;
                    .listItem{
                        width: 100%;
                        height:80rpx;
                        line-height:80rpx;
                        text-align: center;
                        font-size: 28rpx;
                        color:#0D0E15;
                    }
                }
                .moreList.active{
                    height:80rpx;
                    transition:all 0.1s;
                    opacity: 1;
                }

                
            }
        }
        .main-text-box{
            font-size:28rpx;
            padding:0 32rpx;
            .main-text{ 
                color:#0D0E15; 
            }
            .look-more{ 
                color:#3E93FF;
            }
            .main-text-clamp{
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 5;
                -webkit-box-orient: vertical; 
            } 
        }
        .news-photo{
            width:100%;
            height:100%;
            padding:30rpx 0; 
            .one-length{
                width:100%;
                .img{
                    width:100%;
                    height:100%;
                }
            }

            .two-length{
                height:390rpx;
                width:100%;
                display: flex;
                align-items: center;
                justify-content: center;
                .img-box{
                    width:100%;
                    height:100%;
                    &:last-child{
                        margin-left:12rpx;
                    }
                }
            }

            .three-length{
                height:456rpx;
                display:flex;
                align-items: center;
                justify-content: center;
                .left-box{
                    flex:1;
                    height:100%;
                    margin-right:12rpx;
                }
                .right-box{
                    flex:0 0 248rpx;
                    display:flex;
                    flex-direction:column; 
                    .right-img-box{
                        flex:1;
                        height:222rpx;
                        width:100%;
                        &:last-child{
                            margin-top:12rpx;
                        }
                    }
                }
                .img{
                    width:100%;
                    height:100%;
                }
            }

            .four-length{
                height:774rpx;
                display:flex;
                flex-direction:column; 
                .top-box{
                    flex:1;
                    width:100%;
                    height:520rpx;
                    .img{
                        width:100%;
                        height:100%;
                    }
                }
                .bottom-box{
                    flex:1;
                    display:flex;
                    align-items: center;
                    justify-content: center;
                    margin-top:14rpx;
                    .bottom-img-box{
                        flex:1;
                        height:240rpx;
                        margin-right:14rpx;
                        &:last-child{
                            margin-right:0;
                        }
                        .img{
                            width:100%;
                            height:100%;
                        }
                    }
                }

            }
            
            .seven-length{
                // height:740rpx;  
                .top-box{  
                    width:100%;
                    height:456rpx; 
                    display:flex;
                    align-items: center;
                    justify-content: center;
                    .top-left-box{
                        flex:1;
                        height:456rpx;
                        margin-right:12rpx; 
                        .img{
                            width:100%;
                            height:100%;
                        }
                    }
                    .top-right-box{
                        flex:0 0 248rpx;
                        height:456rpx;
                        display:flex;
                        flex-direction:column;
                        .right-img-box{
                            flex:1;
                            height:222rpx;
                            &:last-child{
                                margin-top:12rpx;
                            }
                            .img{
                                width:100%;
                                height:100%;
                            }
                        }  
                    }
                }
                .bottom-box{  
                    display:flex;
                    align-items: center;
                    justify-content: center;
                    margin-top:12rpx;
                    .bottom-img-box{
                        flex:1;
                        height:272rpx;
                        margin-right:12rpx;
                        &:last-child{
                            margin-right:0;
                        } 
                        .img{
                            width:100%;
                            height:100%;
                        }
                    }
                }
                .six-bottom-box{
                    .bottom-img-box{
                        height:242rpx;
                    }
                }
                .seven-bottom-box{
                    .bottom-img-box{
                        height:178rpx;
                    }
                }
            }
            
            .eight-length {
                display:flex;
                flex-wrap:wrap;
                align-items:center;
                justify-content:center;
                .img-items{
                    // width:178rpx; 
                    margin-right:12rpx;
                    margin-bottom:12rpx;
                    &:nth-child(4n){
                        margin-right:0;
                    }
                    .img{
                        width:100%;
                        height:100%;
                    }
                } 
            }

            .nine-length{
                display:flex;
                flex-wrap:wrap;
                align-items:center;
                justify-content:center;
                .img-items{
                    // width:240rpx;
                    // height:240rpx;
                    margin-right:12rpx;
                    margin-bottom:12rpx; 
                    &:nth-child(3n){
                        margin-right:0;
                    }
                    .img{
                        width:100%;
                        height:100%;
                    }
                } 
            }

        } 
        .topic{
            padding-left:40rpx; 
            .img{
                width:24rpx;
                height:24rpx;
                vertical-align: middle;
            }
            span{
                font-size:28rpx; 
                color:#808892;
            }
        }
        .operation{ 
            height:96rpx;
            margin:18rpx 32rpx 0; 
            border-top:1rpx solid #F1F3F6;
            display: flex;
            align-items: center;
            justify-content: center;
            // .box{
               .good-item{
                   flex:1;
                //    display:inline-block;
                   padding:10rpx 0 10rpx 76rpx;
                   .img{
                        width:40rpx;
                        height:40rpx;
                        vertical-align: middle; 
                        transform: rotate(0deg) scale(1) !important;
                        transition: transform .2s !important;
                   }
                   .good-img{ 
                        transform: rotate(-15deg) scale(1.1) !important;
                        transition: transform .2s !important;
                   }
               } 
               .leave-word{
                   flex:1;
                //    display:inline-block;
                //    margin-left:78rpx;
                   padding:10rpx 30rpx 10rpx 0;
                   &:active{
                        transform:scale(1.1) ;
                        transition: transform .1s ;
                    }
                   .img{
                       width:42rpx;
                       height:38rpx;
                       vertical-align: middle;
                   }
               }
               .share{
                    flex:1; 
                    padding-right:76rpx; 
                    .share-btn{
                        margin-left:0;
                        padding:0;
                        background:transparent;
                        border:0;
                        border-radius:0;
                        &:active{ 
                            transform:scale(1.1) ;
                            transition: transform .1s ;
                        }
                    }
                    .img{
                       width:36rpx;
                       height:36rpx;
                       vertical-align: middle;
                   }
               }
               .num{
                   font-size:24rpx;
                    font-family:Helvetica;
                    color:#808892;
                    margin-left:20rpx;
               } 
            // }
            // &::after {
            //     width:100%; 
            //     content: " ";
            //     height: 1px;
            //     border-top: 1px solid #ededed;
            //     color: #D9D9D9;
            //     -webkit-transform-origin: 0 0;
            //     transform-origin: 0 0;
            //     -webkit-transform: scaleY(0.5);
            //     transform: scaleY(0.5); 
            // }
        } 
    }


</style>

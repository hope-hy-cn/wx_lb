<template>
    <div class="focusCont">
        <scroll-view
        id="pageScroll"
        scroll-y
        @touchstart="touchStart"
        @touchend="touchEnd"
        @scrolltolower="scrolltolower"
        lower-threshold="100"
        >
        <div id="innerScrollCont" :style="'height:'+innerHeight">
            <scroll-view
            id="tagScroll"
            scroll-x
            v-if="listPage.tagArr.length>0&&listPage.listArr.length>0"
            >
            <div class="tagItem" v-for="(it,idx) in listPage.tagArr" :key="idx">
                <img src="/static/image/hash-hover.png" alt="">{{it}}
            </div>
            </scroll-view>
            <div v-if="listPage.tagArr.length>0&&listPage.listArr.length>0" style="height:82rpx;"></div>
            <div class="wait text-center" style="height:100rpx;" v-if="reFresh">
                <span class="refresh-loading"></span>
            </div>
            <news-list v-for="(it,idx) in listPage.listArr" :key="idx" :dataItem='it' @jumpDetail="jumpDetail"  @leaveWord="leaveWord" @jumpTopic="jumpTopic" @isLogin="isLogin"  @share="shareItem"></news-list>
            <div style="height:102rpx;width:100%;">
                <div class="wait" style="height:100rpx;" v-if="!reFresh && listPage.listArr.length>0&&!isNetErr">{{isLoadEnd?'已经到底了':'正在加载更多'}}</div>
                <div class="netErr wait" style="height:100rpx;" @click="repeatRequest" v-if="isNetErr">网络错误，点击重试</div>
            </div>
            <div class="noDataCont" v-if="listPage.listArr.length==0">
                <div class="topArea">
                    <img src="/static/image/zhan-wei.png" alt="">
                    <span>快去关注其他萝卜吧他们的动态会在此显示</span>
                </div>
                <div class="recommend" v-if="bestDataList.length>0">
                    <div class="recommInner">
                    <h1>精选萝卜</h1>
                    <c-bestlist
                        :bestUserList="bestDataList"
                        :isLikeRight="isLikeRight"
                        :bestSuperLikeNum="bestSuperLikeNum"
                        @change="changeBestSelect"
                        @lookDetail="lookDetail"
                    ></c-bestlist>
                    </div>
                </div>
            </div>
        </div>
        </scroll-view>
        <div v-if="chargeVipShow">
            <charge-vip @close="chargeVipClose"></charge-vip>
        </div> 
    </div>
</template>
<script>
import * as api from '@/utils/api' ;
import newsList from '@/components/news-list.vue' ;
import chargeVip from '@/components/pop-up-box/charge-vip.vue' ;  
export default {
    data(){
        return{
            currentList:2,//当前页
            listPage:{
                listArr:[],
                tagArr:[],
                pageInfo:{
                    page:1,
                    size:10,
                    total:0,
                },
                scrollData:{
                    pageHeight:0,
                    startClientY:0,
                    endClientY:0,
                }
            },
            bestDataList:[],  //精选列表
            focusActive:false,
            reFresh:false,
            isLoad:false,
            isLoadEnd:false,
            winHeight:0,
            screenHeight:0,
            bottomBarHeight:0,
            innerHeight:'auto',
            isNetErr:false,
            chargeVipShow:false, //vip
        }
    },
    onLoad(){
        let vm=this;
        wx.getSystemInfo({
            success: function(res) {
                vm.winHeight = res.windowHeight;
                vm.screenHeight=res.screenHeight;
                vm.bottomBarHeight=vm.screenHeight-vm.winHeight;
            }
        });
        this.getBestList();
        // 自动刷新
        this.loadState(1);
        this.listPage.pageInfo.page=1;
        this[this.filterGetListType(2)](this.listPage.pageInfo);

    },
    onShow(){
        this.getBestList();
    },
    props:['currentPage'],
    watch:{
        currentPage(val){
            if(val==this.currentList){
                this.listPage.listArr=[];
                this.innerHeight='0';
                this.loadState(1);
                this.listPage.pageInfo.page=1;
                this[this.filterGetListType(2)](this.listPage.pageInfo)
            }else{
                this.listPage.listArr=[];
            }
        }
    },
    components:{
        newsList,
        chargeVip
    },
    methods:{
        isLogin(item){
          this.$emit('isLogin',item);   
        },
        //分享
        shareItem(item){ 
            this.$emit('share',item)
        },
        //跳转标签页
        jumpTopic(item){
            wx.navigateTo({url:`./../../news-pages/tag-list/main?topicid=${item.topic_id}&topic=${item.topic}`});
        },
        //查看用户详情
        jumpDetail(item){
            this.$emit('jumpDetail',item)
        },
        //查看日志详情
        leaveWord(item){
            this.$emit('leaveWord',item)
        },
        loadState(num){
            if(num==1){
                this.reFresh=true;
                this.isLoad=false;
                this.isLoadEnd=false;
            }else if(num==2){
                this.reFresh=false;
                this.isLoad=true;
                this.isLoadEnd=false;
            }else if(num==3){
                this.reFresh=false;
                this.isLoad=true;
                this.isLoadEnd=true;
            }else if(num==0){
                this.reFresh=false;
                this.isLoad=false;
                this.isLoadEnd=false;
                this.isNetErr=false;
            }
        },
        //每日精选
        changeBestSelect(e){
            let item=e.mp.detail;
            wx.navigateTo({url:`./../user-detail-page/main?ruuid=${item.ruuid}`});
        },
        //每日精选详情
        lookDetail(e){
            let item=e.mp.detail;
            if(item.is_show){
                wx.navigateTo({url:`./../user-detail-page/main?ruuid=${item.ruuid}`});
            }else{
              this.chargeVipShow=true;  
              this.$emit('bestClick');
            } 
            // let item=e.mp.detail;
            // if(item.is_show){
            //     this.$emit('jumpDetail',item)
            // }
        },
        //每日精选页
        getBestList(){
            let vm = this;
            api.getDailyselection().then(res=>{
                if(res.data.data){
                    vm.bestDataList=res.data.data.slice(0,6);
                }else{
                    vm.bestDataList=[];
                }
            })
        },
        //获取关注的列表
        getFocusList(data,num){
        return api.focusList(data).then(
            (res)=>{
                if(res.data.code==300000&&res.data.data){ 
                    if(res.data.data.data){
                        let resData=res.data;
                        if(this.reFresh){
                            this.listPage.listArr=[];
                            // this.innerHeight='0';
                            let timer=setTimeout(()=>{
                                this.innerHeight='auto';
                                this.listPage.listArr=resData.data.data;
                                clearTimeout(timer);
                            },100);
                        }else{
                            let timer=setTimeout(()=>{
                                this.innerHeight='auto';
                                this.listPage.listArr.push(...resData.data.data);
                                clearTimeout(timer);
                            },100);
                        }
                        this.loadState(0);
                        this.listPage.pageInfo.total=resData.data.info.total_page;
                        if(this.listPage.pageInfo.total==this.listPage.pageInfo.page){
                            this.isLoadEnd=true;
                        }
                    }else{
                        this.loadState(0);
                        this.innerHeight='auto';
                        return;
                    }
                }else{
                    this.loadState(0);
                    this.innerHeight='auto';
                    return;
                }
            },
            (err)=>{
                this.loadState(0);
                this.isNetErr=true;
                this.innerHeight='auto';
                console.log(err);
            }
        )
        },
        //获取当前也列表的方法
        filterGetListType(num){
            if(num=='0'){
                return 'getNewList'
            }else if(num=='1'){
                return 'getRecommendList'
            }else if(num=='2'){
                return 'getFocusList'
            }
        },
        //滑动开始
        touchStart(e){
            //获取开始滑动距离屏幕的位置
            this.listPage.scrollData.startClientY = e.clientY;
        },
        // 滑动结束
        touchEnd(e){
            //获取结束滑动距离屏幕的位置
            let clientData=this.listPage.scrollData;
            clientData.endClientY = e.mp.changedTouches[0].clientY;
            //上拉刷新条件
            if(e.target.offsetTop < this.winHeight-40 && (clientData.endClientY - clientData.startClientY >= 200)){
                this.loadState(1);
                this.listPage.pageInfo.page=1;
                this[this.filterGetListType(2)](this.listPage.pageInfo);
            }
        },
        //下拉加载
        scrolltolower(){
            console.log('到底了')
            if(this.isLoadEnd){
                return
            }else{
                if(!this.isLoad){
                    this.isLoad=true;
                    let currentPageInfo=this.listPage.pageInfo;
                    if(currentPageInfo.page>=currentPageInfo.total){
                        this.loadState(3);
                        return;
                    }else{
                        this.loadState(2);
                        currentPageInfo.page+=1;
                        let time_=setTimeout(()=>{
                            this[this.filterGetListType(2)](currentPageInfo);
                            clearTimeout(time_);
                        },50)
                    }
                }
            }
        },
        repeatRequest(){
            console.log('网络重新请求');
            if(this.isLoadEnd){
                return
            }else{
                if(!this.isLoad){
                    this.isLoad=true;
                    let currentPageInfo=this.listPage.pageInfo;
                    if(currentPageInfo.page>=currentPageInfo.total){
                        this.loadState(3);
                        return;
                    }else{
                        this.loadState(2);
                        currentPageInfo.page+=1;
                        this[this.filterGetListType(2)](currentPageInfo);
                    }
                }
            }
        },
        //关闭vip分享
        chargeVipClose(){
            this.chargeVipShow=false;
        },
    },
}
</script>
<style lang="scss" scoped>
.focusCont{
    width:100%;
    height:100%;
}
#innerScrollCont{
  overflow-y: scroll;
}
#pageScroll{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    #tagScroll{
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 82rpx;
        line-height: 82rpx;
        box-sizing: border-box;
        padding: 0 36rpx;
        overflow:hidden;
        white-space:nowrap;
        background:#fff;
        .tagItem{
            font-size:28rpx;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(78,87,97,1);
            margin-right: 40rpx;
            display: inline-block;
            overflow: hidden;
            img{
                width: 20rpx;
                height: 25rpx;
                display: block;
                margin-right: 4rpx;
                float: left;
                margin-top: 30rpx;
            }
        }
    }
    .noDataCont{
        .topArea{
            width: 100%;
            height: 556rpx;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            img{
                display: block;
                width: 274rpx;
                height: 209rpx;
            }
            span{
                display: block;
                width: 270rpx;
                font-size:24rpx;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(128,136,146,1);
                line-height:34rpx;
                margin-top:42rpx;
                text-align:center;
                box-sizing:border-box;
            }
        }
        .recommend{
            width: 100%;
            background: #fff;
            .recommInner{
                width:100%;
                height:100%;
                overflow:auto;
                h1{
                    font-size:30rpx;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(53,64,82,1);
                    box-sizing: border-box;
                    padding:0 44rpx;
                    padding-top:30rpx;
                }
            }
        }
    }
}
.wait{
    height:82rpx;
    width: 100%;
    text-align: center;
    font-size: 28rpx;
    line-height: 82rpx;
    color:#999;
    background: #f0f0f0;
}
</style>

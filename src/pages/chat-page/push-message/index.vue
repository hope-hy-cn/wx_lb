
<template>
  <div class="message-page" :style="'padding-top:'+headHeight+'rpx;'" >
    <head-back title="互动通知"  @goBack="goBack" :iconShow="true"></head-back> 
    <scroll-view scroll-y   class="content-box" @scrolltolower="bindscrolltolower">  
      <block>
        <div class="msg-list" v-for="(item,index) in pushMsgData" :key="item" @click.stop="lookNoticeMsg(item)"  @touchend="touchend" @longtap="longTap(item,index)">
          <div class="message-group" >
            <div class="message-head"> 
                <image-loader   :src="item.head_pic?item.head_pic:'https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/head-img-undefined.png'" image-style="width:112rpx; height:112rpx; border-radius:50%;"></image-loader>
                <span class="on-line" v-if="item.online_state"></span>
            </div>
            <div class="message-info-box" >
                <div class="message-info">
                    <div class="message-info-title">
                        <span class="name">{{item.nick_name}}</span>  
                        <p class="data-time float-right">{{item.time_text}}</p>
                    </div>
                    <div class="message-im-text"> 
                        <p class="text">
                          <!-- {{item.msgCategory==2?'[图片]':item.msgCategory==5?item.category:item.content}}  -->
                          {{item.content}}
                        </p>
                        <p class="num " > 
                          <span class="total float-left text-center" v-if="item.read==0"> </span>
                        </p> 
                    </div>
                </div>
            </div> 
          </div>
        </div>  
      </block> 
      <div class="msg-list-null text-center" v-if="dataListNull">无动态资料</div>  
      <div class="msg-list-null text-center" v-if="pushMsgPage==pushMsgTotalPage">到底啦</div>       
      <div class="text-center" style="padding:30rpx;" v-if="(pushMsgPage!=pushMsgTotalPage)&&!dataListNull">
        <span class="refresh-loading"></span>
        <span style="display:inline-block;line-height:50rpx;font-size:26rpx;color:#999;">加载更多</span> 
      </div> 
    </scroll-view >
     
    
  </div>
</template>

<script>
import * as api from '@/utils/api' ;    
import headBack from '@/components/head-back.vue' ;    
const app = getApp()  
export default { 
  onLoad(){    
    let vm = this;   
    let platform = wx.getSystemInfoSync().platform;
    if (platform == 'android') {
      this.actionsArr = ['删除','关闭']; 
    } else {
      this.actionsArr = ['删除']; 
    } 
    vm.fetchPushMsgData();
    //推送消息
    app.globalData.subscriber.on('PUSH_MESSAGE_LIST', (data)=>{
      if(data){
        let resData={};
        resData=JSON.parse(data.content).props
        resData.time_text=vm.getDateDiff(JSON.parse(data.content).props.update_time); 
        vm.pushMsgData.unshift(resData);
      }  
    })  
  },
  onShow: function () {   
    let vm = this; 
    
  },
         
  data () {
    return {    
      headHeight:wx.getStorageSync('headHeight'),
      headPadding:wx.getStorageSync('headPadding'),
      pushMsgPage:1,
      pushMsgSize:20,
      pushMsgTotalPage:0,
      pushMsgData:[],
      dataListNull:false,
      loadingShow:false, //是否显示加载更多
      lockTap:false,
      actionsArr:['删除'],
    }
  }, 
  components:{
    headBack, 
  },  
  methods: {  
    //返回上一级
    goBack(){
      wx.navigateBack({ delta: 1 }); 
    }, 
    fetchPushMsgData(val){
      let vm = this;
      let body={
        page:this.pushMsgPage,
        size:this.pushMsgSize,
      }
      vm.loadingShow=false;
      api.getNoticeList(body).then(res=>{
        let resData=res.data.data;
        vm.loadingShow=true;
        if(res.data.code==300000&&resData){
          let newData=[];
          vm.pushMsgPage=resData.info.page_num;
          vm.pushMsgTotalPage=resData.info.total_page;
          if(resData.data){
            resData.data.forEach((item,index)=>{
              item.update_time?item.time_text=vm.getDateDiff(item.update_time):item.time_text='';
              newData.push(item);
            })
            if(val=='more'){
              vm.pushMsgData.push(newData);
            }else{
              vm.pushMsgData=newData;
            } 
          }  
        }else{
          vm.dataListNull=true;
        }
      });
    },
    //查看通知
    lookNoticeMsg(item){
      let vm = this;
      if (this.lockTap) {
        return;
      }
      if(item.category==1||item.category==2){
        wx.navigateTo({url:`./../../share-page/share-news-detail/main?artId=${item.rid}&headType=detail`}); 
      }
      api.lookNoticeMsg({notice_id:item.notice_id}).then(res=>{
        if(res.data.code==300000){
          item.read=1;
        }
      })
    },
    touchend(){
        if (this.lockTap) { 
          setTimeout(() => {
              this.lockTap=false;
          }, 100);
        }
    }, 
    longTap(item,index){
      let vm = this;
      this.lockTap=true;
      console.log(item); 
      wx.showActionSheet({
        itemList: vm.actionsArr, 
        success: function (res) {//res.tapIndex点击的列表项 
          console.log("点击了列表项：" + vm.actionsArr[res.tapIndex])
          if(res.tapIndex==0){
            api.deleteNoticeMsg({notice_id:item.notice_id}).then(res=>{
              if(res.data.code==300000){
                vm.pushMsgData.splice(index,1); 
              }
            })
          } else if(res.tapIndex==2){
              
          } 
        },
        fail: function (res) {

        } 
      }) 
    },

    //滚动到底部
    bindscrolltolower(){   
      if(this.loadingShow&&this.pushMsgPage<this.pushMsgTotalPage){ 
        this.pushMsgPage++;
        this.fetchPair('more');
      } 
    },
  },

}
</script>
 
<style lang="scss" scoped>
.message-page{
  width:100%;
  height:100vh;
  background:#fff; 
  .content-box{
    height:100%;
    box-sizing: border-box;
    padding-top:18rpx;
  }
  .msg-list{
    width:100%;
    &:active{
      background:#F8F8F8;
    }
    .message-group{
      width:100%;
      height:144rpx;
      padding-left:30rpx;
      display:flex;
      align-items:center;
      justify-content:center;
      .message-head{
        flex:0 0 112rpx;
        height:112rpx;
        position:relative;
        // .head-img{
        //     width:100%;
        //     height:100%;
        //     border-radius:50%;
        // }
        .on-line{
          position:absolute;
          bottom:0;
          right:0;
          width:32rpx;
          height:32rpx;
          background:#50E370;
          border:2rpx solid #fff;
          border-radius:50%;
        }
    }
    .message-info-box{
      flex:1; 
      height:144rpx;
      border-bottom:1rpx solid #E1E6EB;
      margin-left:6rpx;
      padding-left:22rpx;
      display:flex;
      align-items:center;
      justify-content:center;
    }
    .message-info{ 
      width:100%;
        .message-info-title{
          width:100%;
          padding-right:36rpx;
          .name{
            width:300rpx;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            font-size:30rpx;
            font-family: PingFangSC-Regular, sans-serif;
            font-weight:500;
            color:#354052;
          }
          .info-icon{
              margin-left:20rpx;
              vertical-align: middle;
          }
          .shouchang-icon{
            width:26rpx;
            height:24rpx;
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
          .data-time{ 
            font-size:26rpx;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#808892;
          }
      }
        .message-im-text{ 
          display: flex;
          align-items: center;
          margin-top:18rpx;
          .text{
            width:500rpx;
            flex:1;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap; 
            color:#808892;
            font-size:28rpx;
            font-family:PingFangSC-Medium;
            font-weight:500; 
            padding-right:10rpx;
          }
          .num{
            flex:0 0 50rpx;
            .total{ 
              width:12rpx;
              height:12rpx;
              border-radius: 50%;
              background:#FF5A5A; 
            } 
          } 
        }
      }
    }
  }
}
.msg-list-null{
  font-size:24rpx;
  padding:80rpx 0 40rpx ;
  color:#D3D7DC;
}
</style>


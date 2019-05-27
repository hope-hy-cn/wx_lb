
<template>
  <div class="message-page" :style="'padding-top:'+headHeight+'rpx;'" >
    <head-back mode="tabs" @clickTab="clickTabs" :currentTab="currentTab" :tabsList="tabsList"></head-back> 
    <swiper class="tab-box" :current="currentTab" duration="300" @change="switchTab" style="height:100%;"> 
      <swiper-item >
        <!--消息-->
        <scroll-view scroll-y   class="msg-tab-content msg-im" >  
          <block  v-if="is_login">
            <div class="msg-list"  @click.stop="jumpPage('./../../chat-page/push-message/main')">
              <div class="message-group" >
                <div class="message-head"> 
                    <image-loader   src="/static/image/push-message.png" image-style="width:112rpx; height:112rpx; border-radius:50%;"></image-loader> 
                </div>
                <div class="message-info-box" >
                    <div class="message-info">
                        <div class="message-info-title">
                            <span class="name">互动通知</span>  
                            <p class="data-time float-right">{{pushMsgData.time_text}}</p>
                        </div>
                        <div class="message-im-text">
                            <!-- {{item.msgCategory==2?'[图片]':item.msgCategory==5?item.category:item.content}}  -->
                            <p class="text">
                              {{pushMsgData.content?pushMsgData.nick_name+pushMsgData.content:'暂无通知'}}
                            </p>
                            <p class="num " >
                              <span class="total float-left text-center" v-if="pushMsgTotal">
                                {{pushMsgTotal>99?'99+':pushMsgTotal}}
                              </span>
                            </p> 
                        </div>
                    </div>
                </div> 
              </div>
            </div> 
            <div class="msg-list"  v-for="(item,index) in msgUserDataList" :key="item" @click="jumpChat(item)"  @touchend="touchend" @longtap="longTap(item,index)">
              <div class="message-group">
                <div class="message-head"> 
                    <div class="vip-cap-box" v-if="item.is_vip">
                      <image src="/static/image/vip-cap.png" class="vip-cap"></image>
                    </div>
                    <image-loader   :src="item.head_pic?item.head_pic:'https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/head-img-undefined.png'" image-style="width:112rpx; height:112rpx; border-radius:50%;"></image-loader>
                    <span class="on-line" v-if="item.online"></span>
                </div>
                <div class="message-info-box" >
                    <div class="message-info">
                        <div class="message-info-title">
                            <span class="name">{{item.nick_name}}</span>
                            <img src="/static/image/shoucang.png" alt="" class="shouchang-icon  info-icon " v-if="item.status==1"> 
                            <p class="data-time float-right">{{item.time_text}}</p>
                        </div>
                        <div class="message-im-text"> 
                            <p class="text">
                              {{item.msgCategory==2?'[图片]':item.msgCategory==5?item.category:item.content}} 
                            </p>
                            <p class="num " >
                              <span class="total float-left text-center" v-if="item.totalNum">
                                {{item.totalNum>99?'99+':item.totalNum}}
                              </span>
                            </p> 
                        </div>
                    </div>
                </div> 
              </div>
            </div> 
            <div class="msg-list-null text-center" v-if="msgUserDataList.length==0">无聊天用户</div> 
          </block>  
          <login-null v-else></login-null>  
        </scroll-view>
      </swiper-item>
      <swiper-item >
          <!--推送-->
          <scroll-view  scroll-y class="msg-tab-content" @scrolltolower="bindscrolltolower"  > 
            <block  v-if="is_login">
              <div class="pair-page">
                <div v-for="(item,index) in pairDataList"  :key="index">
                  <pair-list  
                  :groupItem="item"  
                  :meLink="meLink"
                  @confirm="bindconfirm"
                  @jumpDetail="jumpDetail"  
                  @jumpChatPage="pairChatPage"
                  @superLike="superLikeItem"
                  @cancelPair="cancelPair"
                  @jumpChating="jumpChating"
                  ></pair-list> 
                </div>  
                <div style="font-size:24rpx;padding:80rpx 0 40rpx;color:#D3D7DC;" class="text-center " v-if="pairDataListNull">暂无数据</div>
              </div>   
              <div class="text-center" style="padding:30rpx;" v-if="(pairPageIndex!=pairTotalPage)&&!pairDataListNull">
                <span class="refresh-loading"></span>
                <span style="display:inline-block;line-height:50rpx;font-size:26rpx;color:#999;">加载更多</span> 
              </div> 
            </block>
            <login-null v-else></login-null>  
          </scroll-view>
      </swiper-item>
      <swiper-item >
          <!--收藏-->
          <scroll-view  scroll-y class="msg-tab-content" @scrolltolower="bindscrolltolower"  > 
            <div v-if="is_login">

              <div class="msg-list"  v-for="(item,index) in supeerLikeData" :key="item" @click="superLikeJumpChat(item)" @touchend="superLikeTouchend" @longtap="superLikeLongTap(item,index)">
                <div class="message-group">
                  <div class="message-head"> 
                      <div class="vip-cap-box" v-if="item.is_vip">
                        <image src="/static/image/vip-cap.png" class="vip-cap"></image>
                      </div>
                      <image-loader   :src="item.head_pic?item.head_pic:'https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/image/head-img-undefined.png'" image-style="width:112rpx; height:112rpx; border-radius:50%;"></image-loader>
                      <span class="on-line" v-if="item.online_state"></span>
                  </div>
                  <div class="message-info-box" >
                      <div class="message-info">
                          <div class="message-info-title">
                              <span class="name">{{item.nick_name}}</span> 
                          </div>
                          <div class="message-im-text"> 
                              <p class="text">
                                <span v-if="item.constellation">{{item.constellation}}。</span>
                                <span v-if="item.distance">离我{{item.distance}}km</span>
                              </p> 
                          </div>
                      </div>
                  </div> 
                </div>
              </div> 
                
              <div class="msg-list-null text-center" v-if="supeerLikeData.length==0">无收藏用户</div> 
              <div class="msg-list-null text-center" v-if="superLikePage>=superLikeTotalPage&&supeerLikeData.length!=0">到底了</div> 
            </div>
            <login-null v-else></login-null>
          </scroll-view>
      </swiper-item>
    </swiper>   
    
  </div>
</template>

<script>
import * as api from '@/utils/api' ;    
import headBack from '@/components/head-back.vue' ;  
import pairList from '@/components/pair-list.vue' ;   
import loginNull from '@/components/login-null.vue' ;   
import userStore from "./../index/store" ; 
import messageStore from "./store" ; 
const app = getApp()  
export default { 
  onLoad(opt){   
    let vm = this;  
    let platform = wx.getSystemInfoSync().platform;
    if (platform == 'android') {
        this.actions1 = ['删除记录','查看个人资料','关闭'];
        this.superActions = ['查看个人资料','取消收藏','关闭'];
    } else {
        this.actions1 = ['删除记录','查看个人资料'];
        this.superActions = ['查看个人资料','取消收藏'];
    }  
    if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
      app.globalData.subscriber.on('MSG_USER_DATA_LIST', this.updateRecentChat);     
      app.globalData.subscriber.on('UPDATE_MSG_LIST', (data)=>{
          this.getMsgDataList();  //获取消息列表接口
      })  
      //推送消息
      app.globalData.subscriber.on('PUSH_MESSAGE_LIST', (data)=>{
        if(data){
          vm.pushMsgData=JSON.parse(data.content).props
          vm.pushMsgData.time_text=vm.getDateDiff(JSON.parse(data.content).props.update_time);
          vm.pushMsgTotal++; 
          wx.showTabBarRedDot({index:2});
        }  
      })  
      //消息页(推送)
      this.fetchPair();   
      //收藏
      this.fetchSuperLikeData();
      
      setInterval(()=>{
        vm.fetchUserOnline();
      },1000*180)
    }   
  },
  onShow: function () {   
    let vm = this; 
    vm.meLink=userStore.state.userInfo.head_pic;
    if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
      this.is_login=true;  
      //推送消息
      app.globalData.subscriber.on('PUSH_MESSAGE_LIST', (data)=>{
        if(data){ 
          wx.showTabBarRedDot({index:2});
        }  
      }) 
      //消息排序
      this.getMsgDataList(); 
      //推送
      this.fetchPushMsgData();
      //查看是否在会话页收藏过
      if((messageStore.state.keepStatusUid&&messageStore.state.keepStatus==1)&&vm.pairDataList.length>0){ 
        vm.pairDataList.forEach((item,index)=>{
          if(item.ruuid==messageStore.state.keepStatusUid){
            vm.pairDataList[index].status=1;
          } 
        })  
      }
    } else { 
      this.is_login=false;    
    } 
    //判断是不是个人主页跳转过来的
    if(userStore.state.msgJumpTab==1){
      this.currentTab=1;
    }else{
      this.currentTab=0;
    }
  },
         
  data () {
    return {   
      
      currentTab:0,
      is_login:false,
      headHeight:wx.getStorageSync('headHeight'),
      headPadding:wx.getStorageSync('headPadding'),
      tabsList:[{name:'消息'},{name:'已关注'},{name:'收藏'} ],
      meLink:'',
      unreadMsgNum:0, //消息数量  
      IM_DATA_LIST:[],  //im消息列表
      GET_MESSAGE_LIST:[],  //所有聊过天的人  
      msgUserDataList:[],    //排序后的消息列表
      //推送
      pairPageIndex:1, //当前第几页
      pairTotalPage:0, //总页数
      pairLoadingShow:false, //是否显示加载更多
      pairDataList:[],  
      pairDataListNull:false,  //列表为空
      supeerLikeData:[],
      superLikePage:1,
      superLikeSize:20,
      superLikeTotalPage:0,
      pushMsgData:{}, //互动通知
      pushMsgTotal:0,
      lockTap:false, 
      actions1: ['删除记录'],
      superLockTap:false, //super长按
      superActions:['查看个人资料','取消收藏'],
    }
  }, 
  components:{
    headBack,
    pairList,
    loginNull
  },  
  methods: { 
    //监听当前滑动的页面
    switchTab(e){ 
      userStore.state.msgJumpTab=0;
      this.currentTab=e.mp.detail.current;
      if(this.currentTab==2){
        //收藏
        this.fetchSuperLikeData();
      }
    }, 
    //tabs切换
    clickTabs(item,index){  
      this.currentTab=index;
      if(index==0){
        if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
          this.getMsgDataList();   
        }  
        app.aldstat.sendEvent('message:会话列表');  
      }else if(index==1){
        if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
          this.fetchPair();  
        } 
        app.aldstat.sendEvent('message:动态列表');  
      } 
    },
    //消息列表联系人
    updateRecentChat(res){
        // console.log('消息列表联系人',res);
        this.IM_DATA_LIST=res;
        this.getMsgDataList();  //获取消息列表接口 
    },
    //新配对/消息列表接口
    getMsgDataList(){
      let vm = this
      api.getMsglPairList().then(res=>{ 
        if(res.data.code===300000){ 
          vm.new_like_num=res.data.data.new_like_num; 
          if(res.data.data.message_list){
            vm.GET_MESSAGE_LIST=res.data.data.message_list;
          }else{
            vm.GET_MESSAGE_LIST=[];
          }
          vm.sortChatList();  //消息排序
        }
      })
    },
    //获取用户在线状态
    fetchUserOnline(){
      let vm = this;
      let meAccid = JSON.parse(wx.getStorageSync('account')).accid;
      api.fetchRecentOnline({accid:meAccid}).then(res=>{
        if(res.data.code==10000&&res.data.data){
          if(vm.msgUserDataList.length>0){
            vm.msgUserDataList.forEach((item,index)=>{ 
              item.online=res.data.data.accid_list[item.accid];
            }) 
          } 
        }
      });
    },
        //排序
    sortChatList() { 
      let self= this;
      if (self.GET_MESSAGE_LIST.length != 0) {
        let chatList = []; 
        self.unreadMsgNum=0;
          self.GET_MESSAGE_LIST.forEach((list,listIndex)=>{
            if(listIndex==0){
              console.log('聊天数据',app.globalData.recentChatList); 
            } 
            if(app.globalData.recentChatList[list.accid]){  
              list.nickName=app.globalData.recentChatList[list.accid].nickName;
              list.msgCategory=app.globalData.recentChatList[list.accid].msgCategory; 
              if(list.msgCategory==5){ 
                let contentType=''; 
                if(typeof(app.globalData.recentChatList[list.accid].content) == 'string') {  
                  contentType=JSON.parse(app.globalData.recentChatList[list.accid].content).category
                }else{ 
                  contentType=app.globalData.recentChatList[list.accid].content.category;
                }
                contentType==1?list.category='[打招呼]':list.category='[评论]';
              }else{ 
                list.content=app.globalData.recentChatList[list.accid].content;
              }
              list.sendTime=app.globalData.recentChatList[list.accid].sendTime;  
              list.time_text=self.getDateDiff(new Date(parseInt(list.sendTime)),'getTime');
              list.countA=app.globalData.recentChatList[list.accid].countA;
              list.countB=app.globalData.recentChatList[list.accid].countB; 
              list.totalNum=list.countA+list.countB; 
              self.unreadMsgNum=self.unreadMsgNum+list.totalNum;
              if(self.unreadMsgNum>0){
                wx.showTabBarRedDot({index:2});
              }else{
                wx.hideTabBarRedDot({index:2});
              }
              list.inShow=true;
              list.online=false; //在线状态
              chatList.push(list) 
            } 
          })
          console.log('排序chatList',chatList); 
          // console.log('app.globalData.recentChatList',app.globalData.recentChatList); 
          chatList.sort((a, b) => {
            return parseInt(b.sendTime) - parseInt(a.sendTime)
          })  
          self.msgUserDataList=chatList; 
          self.$forceUpdate();
          self.fetchUserOnline(); //获取在线状态
      }else{
        self.msgUserDataList=[];
      } 
    }, 
    jumpChat(item){ 
      if (this.lockTap) {
        return;
      }
      item.totalNum=0; 
      let body={
        accid:item.accid,
        head_pic:item.head_pic,
        nick_name:item.nick_name,
        ruuid:item.ruuid,
        status:item.status,
        pair_type:item.pair_type,
        pair_time:item.pair_time || 0,
      }
      body.countA=item.countA?item.countA:0;
      body.countB=item.countB?item.countB:0;
      app.globalData.recentChatList[item.accid].countA=0;
      app.globalData.recentChatList[item.accid].countB=0; 
      // console.log('jumpChat',body);
      wx.navigateTo({url:`./../../chat-page/chat-p2p-page/main?item=${JSON.stringify(body)}`});
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
      if(item.accid){
        let accidItem=item.accid.split("-");
        if (accidItem[0]=='admin') {
          return;
        }
      } 
      this.lockTap=true; 
      let meAccid = JSON.parse(wx.getStorageSync('account')).accid;  
      wx.showActionSheet({
          itemList: vm.actions1, 
          success: function (res) {//res.tapIndex点击的列表项 
              console.log("点击了列表项：" + vm.actions1[res.tapIndex])
              if(res.tapIndex==0){
                wx.showModal({
                    title: '提示',
                    content: '确定删除聊天记录？', 
                    success(res) {
                      if(res.confirm) {
                        api.cleanP2pMsg({accid1:item.accid,accid2:meAccid}).then(res=>{
                          vm.msgUserDataList.splice(index,1);
                        });
                      } 
                    }
                })
                
              }else if(res.tapIndex==1){
                wx.navigateTo({url:`./../user-detail-page/main?ruuid=${item.ruuid}`}); 
              }else if(res.tapIndex==2){
                  
              } 
          },
          fail: function (res) {

          } 
      }) 
    },
    //互动通知列表
    fetchPushMsgData(){
      let vm = this;
      let body={
        page:1,
        size:1,
      } 
      api.getNoticeList(body).then(res=>{
        let resData=res.data.data; 
        if(res.data.code==300000&&resData){
          if(resData.data){
            vm.pushMsgData=resData.data[0];
            vm.pushMsgData.time_text=vm.getDateDiff(resData.data[0].update_time);
          } 
          vm.pushMsgTotal=resData.unread_cnt;
          if(vm.pushMsgTotal>0){
            wx.showTabBarRedDot({index:2});
          }
        } 
      });
    },
    //跳转互动通知详情
    jumpPage(url){
      wx.navigateTo({url:url});
    },
    //获取配对列表
    fetchPair(val=''){
      let vm = this;
      let body={
        page:vm.pairPageIndex,
        size:15,
      }; 
      vm.pairLoadingShow=false;
      api.getPairlist(body).then(res=>{
        if(res.data.code===300000){ 
          vm.pairLoadingShow=true;
          vm.pairTotalPage=res.data.data.info.total_page; 
          vm.pairPageIndex=res.data.data.info.page_num; 
          if(res.data.data.data){ 
            if(val=='more'){
              res.data.data.data.forEach((item,index)=>{
                item.update_time_text=vm.getDateDiff(item.update_time);
                item.comment_time=vm.getDateDiff(item.comment_time);
                vm.pairDataList.push(item)
              })
            }else{
              let arrData=[];
              res.data.data.data.forEach((item,index)=>{
                item.update_time_text=vm.getDateDiff(item.update_time);
                item.comment_time=vm.getDateDiff(item.comment_time);
                arrData.push(item)
              })
              vm.pairDataList=arrData;
            }
          } else{
            vm.pairDataListNull=true;
          }
        }
      })
    },
    //跳转详情
    jumpDetail(item){ 
      wx.navigateTo({url:`./../user-detail-page/main?ruuid=${item.ruuid}`});
    },  
    //评论
    bindconfirm(item){ 
      console.log(item);
      let contentJson=JSON.stringify({category:2,props:{link:item.photo[0].link,msg:item.inputValue}});
      if(!(app.globalData.recentChatList[(item.accid)])){
        app.globalData.recentChatList[(item.accid)] = 
          {
          nickName:item.nickname,
          avatar:item.head_pic,
          content:contentJson,
          sendTime:(new Date()).valueOf(),
          msgCategory: 5,
          countA:0,
          countB:0,
          }
      } else {
        app.globalData.recentChatList[(item.accid)].content =contentJson;
        app.globalData.recentChatList[(item.accid)].msgCategory=5;
        app.globalData.recentChatList[(item.accid)].sendTime = (new Date()).valueOf();
        app.globalData.recentChatList[(item.accid)].countB++;
      }
    },

    //动态跳转聊天
    pairChatPage(item){ 
      let vm = this;
      let selfUid = JSON.parse(wx.getStorageSync('account'));   
      let data = {
        message_id:0,
        sender:item.accid,
        receiver:selfUid.accid,
        chat_category:3,
        page:1,
        size:10,
      }  
      api.getMsgsHistory(data).then(res=>{
        if(res.data.code==10000&&(res.data.data.data&&res.data.data.data!=[])){
          let body={
            accid:item.accid,
            head_pic:item.head_pic,
            nick_name:item.nickname,
            ruuid:item.ruuid, 
            pair_type:item.pair_type,
            pair_time:0,
            status:item.status,
          } 
          if(app.globalData.recentChatList[item.accid]){
            body.countA=app.globalData.recentChatList[item.accid].countA?app.globalData.recentChatList[item.accid].countA:0;
            body.countB=app.globalData.recentChatList[item.accid].countB?app.globalData.recentChatList[item.accid].countB:0;app.globalData.recentChatList[item.accid].countA=0;app.globalData.recentChatList[item.accid].countB=0;
            wx.navigateTo({url:`./../../chat-page/chat-p2p-page/main?item=${JSON.stringify(body)}`});
          }else{
            let itemData=item;
            itemData.nick_name=item.nickname;
            vm.jumpChating(itemData);
          } 
        }else{ 
          let itemData=item;
          itemData.nick_name=item.nickname;
          vm.jumpChating(itemData); 
        }
      })
    },
    //收藏
    superLikeItem(item){
      let vm = this;
      let body={
        ruuid:item.ruuid,
        type:3,
        enter_page:0,
        super_like:false,
        is_top:false,
      };
      api.userpageOperation(body).then(res=>{
        if(res.data.code==300000){
          item.status=1;
        }
      })
    },
    //取消配对
    cancelPair(val){
      let vm = this;
      api.postCancelPair({ruuid:val.ruuid}).then(res=>{
        if(res.data.code==300000){
          let itemArr=[];
          vm.pairDataList.forEach((item,index)=>{
            if(item.ruuid!=val.ruuid){
              itemArr.push(item);
            }
          })
          setTimeout(()=>{
            vm.pairDataList=itemArr;
          },100) 
        }
      })
    },
    //收藏跳转聊天
    superLikeJumpChat(item){
      if (this.superLockTap) {
        return;
      }
      let dataItem=item;
      dataItem.nickname=item.nick_name;
      this.pairChatPage(dataItem);
    },
    superLikeTouchend(){
      if (this.superLockTap) { 
        setTimeout(() => {
            this.superLockTap=false;
        }, 100);
      }
    }, 
    //长按收藏
    superLikeLongTap(item,index){
      let vm = this; 
      this.superLockTap=true; 
      wx.showActionSheet({
        itemList: vm.superActions, 
        success: function (res) {
          console.log("点击了列表项：" + vm.superActions[res.tapIndex])
          if(res.tapIndex==0){
            wx.navigateTo({url:`./../user-detail-page/main?ruuid=${item.ruuid}`}); 
          }else if(res.tapIndex==1){
            vm.cancelLike(item,index);
          }else if(res.tapIndex==2){
              
          } 
        },
        fail: function (res) {

        } 
      })
    },
    //取消收藏
    cancelLike(item,index){
      let vm = this;
      api.cancelSuperLike({ruuid:item.ruuid}).then(res=>{
        if(res.data.code==300000){
          vm.supeerLikeData.splice(index,1); 
        }
      });
    },
    //收藏
    fetchSuperLikeData(val){
      let vm = this;
      let body={
        page:vm.superLikePage,
        size:vm.superLikeSize,
      };
      api.getSuperLikeList(body).then(res=>{
        let resData=res.data.data;
        if(res.data.code==300000&&resData.data){
          if(val=='more'){
            vm.supeerLikeData.push(resData.data);
          }else{
            vm.supeerLikeData=resData.data;
          } 
          vm.superLikeTotalPage=resData.info.total_page;
          vm.superLikePage=resData.info.page_num;
        } 
      });
    },
    //跳转聊天
    jumpChating(item){  
      let body={
        accid:item.accid,
        head_pic:item.head_pic,
        nick_name:item.nick_name || item.nickname,
        ruuid:item.ruuid, 
        pair_type:item.pair_type,
        pair_time:0,
        status:item.status,
      } 
      body.countA=0;
      body.countB=0; 
      console.log('jumpChat',body);
      wx.navigateTo({url:`./../../chat-page/chat-p2p-page/main?item=${JSON.stringify(body)}`});
    },
    //滚动到底部
    bindscrolltolower(){  
      console.log('滚动到底部');
      if((this.pairLoadingShow&&this.pairPageIndex<this.pairTotalPage)&&this.currentTab==1){
        console.log(this.pairPageIndex,this.pairTotalPage);
        this.pairPageIndex++;
        this.fetchPair('more');
      }else if((this.superLikePage<this.superLikeTotalPage)&&this.currentTab==2){
        this.superLikePage++;
        this.fetchSuperLikeData('more');
      }
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
.message-page{
  width:100%;
  height:100vh;
  background:#fff;
  .message-title{
    position:fixed;
    left:0;
    width:100%;
    height:116rpx;
    display:flex;
    align-items:center;
    justify-content:center;
    background:#fff;
    border-bottom:1rpx solid #E1E6EB;
    z-index:1000;
    .title-items{
      flex:1;
      font-size:36rpx;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:#D3D7DC;
      line-height:50rpx;
      padding:30rpx 0; 
    }
    .items-border-right{
      border-right:4rpx solid #E1E6EB;
    }
    .title-highlight{
      color:#FF5470;
    }
  } 
     
    .msg-tab-content{
      height:100%;
      width:100%;
      // overflow-y: scroll;
      // position:absolute;  
    }
    // .msg-tab-one{
    //   transform:translate(-100%, 0px) translateZ(0px); 
    //   transition:all .4s;
    // }
    // .msg-tab-two{
    //   transform:translate(100%, 0px) translateZ(0px); 
    //   transition:all .4s;
    // }
    // .msg-tab-index{
    //   transform:translate(0px, 0px) translateZ(0px); 
    //   transition:all .4s; 
    // }

    .msg-im{
      height:100%;
      width:100vw;
      padding-top:18rpx;
      .msg-search-box{
        display:flex;
        align-items: center;
        // margin-top:116rpx;
        margin-bottom:52rpx;
        .search-icon{
          flex:0 0 110rpx;
          height:112rpx;
          line-height: 112rpx; 
          padding-top:9rpx;
          .icon{ 
            width:40rpx;
            height:42rpx;
          }
        }
        .search-input{
          flex:1;
          padding:26rpx 14rpx; 
          font-size:32rpx;
          border-bottom:1rpx solid #E1E6EB;
        }
        input::-webkit-input-placeholder{
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#D3D7DC;
        }
      }  
      .new-pair{
        overflow:hidden;
        background:#fff;
        white-space:nowrap;   
        margin-bottom:32rpx;
        .scroll-view{ 
          .praise-total{
            width:160rpx;
            display:inline-block;
            margin-right:32rpx;
            font-size:32rpx;
            .pair-box{
              width:160rpx;
              height:172rpx;
              position: relative;
              .img{
                width:100%;
                height:100%;
                border-radius: 50%;
              }
              .pair-num{
                position: absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
                background:transparent;
                line-height: 162rpx; 
                color:#fff; 
                font-family:PingFangSC-Medium;
                font-weight:500; 
              }
              .like-other{
                position:absolute;
                left: 50%;
                bottom:-16rpx;
                margin-left:-31rpx;
                width:62rpx;
                height:40rpx;
              }
              .lightning{
                position:absolute;
                left: 50%;
                bottom:-16rpx;
                margin-left:-11rpx;
                width:22rpx;
                height:36rpx;
              }
              .super-like-other{
                position:absolute;
                left: 50%;
                bottom:-16rpx;
                margin-left:-18rpx;
                width:36rpx;
                height:36rpx;
              }
            }
            .user-pair{
              width:160rpx;
              height:160rpx;
            }
            .text{
              margin-top:6rpx;
              color:#4E5761;
            }
            .name{
              width:100%;
              margin-top:18rpx;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
            }
            &:first-child{
              margin-left:30rpx;
            }
          }

        }
      }
      .msg-list{
        width:100%;
        &:active{
          background:#F8F8F8;
        }
      }
      
      

    } 
    .pair-page{
      //  margin-top:116rpx;
      padding-bottom:30rpx;
    }

 
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
    .vip-cap-box{
      position: relative;
      .vip-cap{
        position: absolute;
        top:-22rpx;
        left:50%;
        margin-left:-16rpx;
        width:32rpx;
        height:32rpx;
      }
    }
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
        flex:0 0 80rpx;
        .total{ 
          min-width:38rpx;
          min-height:38rpx;
          line-height:38rpx;
          background:#FF5A5A;
          border-radius:50%;
          font-size:22rpx; 
          color:#fff;
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


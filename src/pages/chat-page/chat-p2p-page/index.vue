<template>
  <div class="chatting-page"  :style="'padding-top:'+headPadding+'px'"  @click="chatingWrapperClick">
    
    <head-back :title="title"  @goBack="goBack" :iconShow="true"></head-back>
     
    <!-- <div class="cover" v-if="firstTime">
        <div v-if="vipType!=0" class="head">在超级特权的帮助下</div>
        <div class="head">您已与{{otherOne.nickName}}配对</div>
        <div class="time">{{pairTime}}</div>
        <div class="portrait">
          <image mode="aspectFill" class="headImg" :src="otherOne.avatar"  ></image>
          <image v-if="vipType == 3" class="icon1" :src="'/static/image/like-other.png'"  ></image>
          <image v-if="vipType == 2" class="icon2" :src="'/static/image/super-like-other.png'"  ></image>
          <image v-if="vipType == 1" class="icon3" :src="'/static/image/lightning.png'"  ></image>
      </div>
    </div> -->

     <!--加载界面转圈圈-->
     <div class="cover" v-if="showCover">
        <span style="margin:420rpx auto"  class="refresh-loading"></span>
     </div>

    
 <!--聊天界面-->
<scroll-view v-if="msgList.length > 0" scroll-y  style="height:100%;"  @scrolltoupper="onPageScroll"  :scroll-top="scrollTop"> 
        <div class="text-center more-loading" v-if="!historyAllDone&&historyLoading">
        <view class="refresh-loading "></view>
      </div>
       <div @click.stop="blankClick" class='record-wrapper' id="recordWrapper" :style="'padding-bottom:'+padBottom+'rpx'"> 
           <div v-for="(message,index) in msgList" :key="index">
            <div v-if="message.msgCategory == 5&&message.content.category == 2" class="specialMsg">
              <image mode="widthFix" :src="message.content.props.link"  ></image>
              <span>{{message.content.props.msg}}</span>
            </div> 
            <div  v-if="message.msgCategory == 5&&message.content.category == 1" class='record-say-hi-wrapper'>
               <text v-if="message.sender == otherOne.accid" class='text-center record-item-time'>ta收藏你，给你打了个招呼，快回复ta吧！</text>
               <text v-if="message.sender != otherOne.accid" class='text-center record-item-time'>你收藏ta，给ta打了个招呼！</text>
            </div>

           <div  v-if="message.msgCategory == 6" class='record-say-hi-wrapper'>
               <text class='text-center record-item-time'>{{message.sendTime}}</text>
           </div>


          <div style="padding:30rpx;" v-if="(message.sender != otherOne.accid&&(message.msgCategory == 1|| message.msgCategory == 2)) " class="record-chatting-item self" @longpress='showEditorMenu'> 
            <!-- 富文本-->
            <img v-if="message.status == 2" class="sendFail" src="/static/image/send_fail.png">
            <span style="margin-top:54rpx" v-if="message.status == 0" class="refresh-loading"></span>
            <rich-text v-if="message.msgCategory == 1" class="record-chatting-item-text" :nodes="message.content"></rich-text>
            <div v-if="message.msgCategory == 2" class="imgOfMsg"><image mode="widthFix"   :src="message.content"></image></div> 
            <!-- 头像-->         
            <image mode="aspectFill" v-if="message.msgCategory != (5||6)"  :src="myself.avatar" class="record-chatting-item-img"></image>
          </div> 
          <!-- receive-->
          <div  v-if="(message.sender == otherOne.accid&&(message.msgCategory == 1|| message.msgCategory == 2))" style="padding:30rpx;" class="record-chatting-item other" @longpress='showEditorMenu' > 
            <!-- 头像-->
            <image mode="aspectFill" v-if="message.msgCategory != (5||6)" :src="otherOne.avatar"  class="record-chatting-item-img other-header" @click.stop="jumpDetail"></image>
            <!-- 富文本-->
            <rich-text v-if="message.msgCategory == 1"  class="record-chatting-item-text" :nodes="message.content"></rich-text>  
            <div v-if="message.msgCategory == 2" class="imgOfMsg"><image mode="widthFix"   :src="message.content"></image></div> 
            <img v-if="message.status == 2" class="sendFail" src="/static/image/send_fail.png">
            <span style="margin-top:54rpx" v-if="message.status == 0" class="refresh-loading"></span>
          </div>   
       </div>
    </div>
    </scroll-view>  
     <!--底部输入框-->
     <div class='chatinput-wrapper' :style="{'bottom':focusFlag?keyBottom+'px':0}" @click.stop='stopEventPropagation'>
      <div class='chatinput-content'>
        <div class="circle-icon"><img class="img" :src="emojiFlag?'/static/image/im-keyboard.png':'/static/image/emoji.png'" @click.stop='toggleEmoji' alt=""></div>
       <div class="flex-center-input">
         <input  :adjust-position="false"  v-model='inputValue' :focus='focusFlag' @change='inputChange' @focus.stop='inputFocus' @blur.stop='inputBlur' @confirm='inputSend' class='chatinput-input'  placeholder="输入文字" confirm-type='send'/> 
       </div> 
         <div v-if="inputValue" class='send-msg fr text-center'   @click.stop="inputSend">发送</div>
         <div  v-if="!inputValue" class="circle-icon circle-margin-left"><img class="img" :src="'/static/image/send-image.png'" @click.stop='chooseImageToSend' alt=""></div>
      </div>

    <div v-if="emojiFlag" class='chatinput-subcontent'>
          <component-emoji @EmojiClick="emojiCLick" @EmojiSend="emojiSend"></component-emoji>
      </div>

    </div> 
    <!-- 收藏 -->
    <div class="special-focus text-center" @click.stop="keepUser(otherOne)" v-if="otherOne.status==2&&!is_helper">
      <image :src="clickKeepStatus?'/static/image/chat-guanzhu-active.png':'/static/image/chat-guanzhu.png'" class="icon"></image>
      <p class="text">收藏</p>
    </div>
  </div>
</template>

<script> 
let gapp = getApp()
import userStore from '@/pages/common/index/store' 
import * as api from '@/utils/api'  
import headBack from '@/components/head-back' 
import {startWebSocket} from '@/utils/imeventhandler' 
import {emjTools} from '@/utils/imeventhandler' 
import {random} from '@/utils/imeventhandler' 
import {baseUrl} from '@/utils/config'
import messageStore from "./../../common/message/store" ; 
export default {
  onLoad(opt){
     let that = this
     this.initData()
    //  let item = opt.item
    //  if(typeof(item) == 'string'){
       let item = JSON.parse(opt.item)
    //  }
     console.log("item啊",item)
     if(item.pair_time != 0){
        item.pair_time = this.getYMD(item.pair_time)
     }  
     let mine = userStore.state.userInfo
     console.log(mine);
     //自己
     let userAccount = JSON.parse(wx.getStorageSync('account'))
    //  if(typeof(userAccount) == 'string'){
    //    let userAccount = JSON.parse(userAccount)
    //  }
    this.myself.accid = userAccount.accid
    this.myself.avatar = mine.head_pic
    //别人
    this.title = '与 ' + item.nick_name + ' 聊天'
    this.pairTime = item.pair_time
    this.vipType = item.pair_type
    this.otherOne.accid = item.accid
    this.otherOne.nickName = item.nick_name
    this.otherOne.avatar = item.head_pic
    this.otherOne.ruuid = item.ruuid
    this.otherOne.status=item.status
    if(item.accid){ 
      let accidItem=item.accid.split("-");
      if (accidItem[0]=='admin') {
        this.is_helper=true;
      }else{
        this.is_helper=false;
      }
    } 
     //改变全局变量
     gapp.globalData.nowAccid = item.accid 
     gapp.globalData.subscriber.on('UPDATE_MSG_LIST', (data)=>{
      if(data){
        that.refreshData()
      }
     })
     gapp.globalData.subscriber.on('CHANGE_MSG_STATUS', (data)=>{
        that.changeMsgStatus(data)
     }) 
     if(item.countA == -1 && item.countB == -1){
       this.firstTime = true
       this.showCover = false
       console.log(this.firstTime,this.showCover,"dddd")
       return
     }
     //拉取离线消息和历史消息 AB有才去拉
     if (item.countA != -1 && item.countB != -1){
     let countA = item.countA
     let countB = item.countB
     if  (countA == 0 && countB == 0){
        that.getHistory(countA,countB)
     } else{
       if (countA > 0) {
        that.offlineMsg()
       }
       if (countB > 0) {
          that.refreshData(1)     
       }
       }
     }
  },
  onUnload(){
    //离开界面设为空
    gapp.globalData.nowAccid = ''
    this.showCover = true
    this.firstTime = false
  },
  onShow(){
  }, 
  data () {
    return {    
        firstTime:false,//是否为第一次进
        headPadding:wx.getStorageSync('headPadding'), 
        headHeight:wx.getStorageSync('headHeight'),  
        keyBottom:'0', 
        chatWrapperMaxHeight: 0,// 聊天界面最大高度
        inputValue: '',//文本框输入内容 
        focusFlag: false,//控制输入框失去焦点与否
        emojiFlag: false,//emoji键盘标志位
        historyAllDone: false, //是否已经加载完所有历史 
        padBottom:100,  //会话框下边距 
        scrollTop:0,
        otherOne:{},
        myself:{},
        msgList:[],
        endTime: '', // 存储上次加载的最后一条消息的时间，后续加载更多使用
        limit:10, // 每次查询结果
        page:1,//当前页数
        oneMoreLoading:1,
        historyAllDone: false, //是否已经加载完所有历史 
        historyLoading:false,
        vipType:0,
        pairTime:'',
        title:'',
        showCover:true,
        offHisMsgID:'',//记录离线消息msgID以便离线消息和历史消息去重
        clickKeepStatus:false,  //收藏
        is_helper:false,
    }
  },
  
  components: {
    headBack,
  },   
  methods: {
    //收藏
    keepUser(){
      let vm = this;
      this.clickKeepStatus=true;
      let body={
        ruuid:this.otherOne.ruuid,
        type:3,
        enter_page:0,
        super_like:false,
        is_top:false,
      };
      api.userpageOperation(body).then(res=>{
        if(res.data.code==300000){
          setTimeout(()=>{ 
            vm.otherOne.status=1;
            vm.clickKeepStatus=false;
            messageStore.state.keepStatusUid=vm.otherOne.ruuid;
            messageStore.state.keepStatus=1;
          },500) 
        }
      })
    },
    initData(){
      this.msgList = []
      this.myself = {}
      this.otherOne = {}
      this.page = 1
      this.offHisMsgID = ''
      this.emojiFlag = false
      this.inputValue = ''
    }, 
    blankClick(){
      if(this.emojiFlag == true){
        this.sendType= 0,
        this.emojiFlag= !this.emojiFlag,
        this.emojiFlag?this.focusFlag=false:this.focusFlag=true; 
        this.moreFlag= false 
        this.changeContentMore(this.emojiFlag);
        this.scrollToBottom();
      }
    },
    refreshData(param){
      let that = this
      let msgList0 = gapp.globalData.P2pMessageList[this.otherOne.accid] ?gapp.globalData.P2pMessageList[this.otherOne.accid]: []
      let msgList1 = []
      if(msgList0 != []){
          msgList0.forEach((item,index)=>{
          if (item.msgCategory == 6 && (item.sendTime)){
            //  if ((item.sendTime).indexOf("-")==-1){
                item.sendTime = this.getDate(parseInt(item.sendTime))
            //  }
          }
          if (item.msgCategory == 1){
              item.content = emjTools(item.content)
          }
          if(item.msgCategory == 5){
            if(typeof(item.content) == 'string'){
              item.content = JSON.parse(item.content)
            }
          }
          let  singleMsg = {
                        msgId:item.msgId,
                        content:item.content,
                        msgCategory:item.msgCategory,
                        sender:item.sender,
                        hash:1,
                        sendTime:item.sendTime,
                        status:1,
          }
          msgList1.push(singleMsg)
        })
        this.msgList = msgList1
        //如果传了参数过来说明要发送已读回执  
        if(param && param == 1){
            let msgP2pReadedR = { 
            accid: this.otherOne.accid,
            msgid: this.msgList[(this.msgList).length - 1].msgId,
          }
          console.log("发消息回执")
          gapp.globalData.subscriber.emit('OFF_MSG_READED',msgP2pReadedR) 
        }
        let cTime=setTimeout(function() {
          that.scrollToBottom() 
          that.showCover = false
          console.log("到底部")
          clearTimeout(cTime);
        }, 500); 
      }
    },
     //返回上一级
    goBack(){
      wx.navigateBack({ delta: 1 }); 
    },  
    //阻止事件冒泡空函数 
    stopEventPropagation() {
    }, 
    //切换发送文本类型 
    switchSendType() { 
        this.sendType= this.sendType == 0 ? 1 : 0,
        this.focusFlag= false,
        this.emojiFlag= false 
    }, 
    //输入事件 /
    inputChange(e) { 
      this.inputValue= e.mp.detail.value 
    },
    //发送文本 
    inputSend(e) {
      let vm = this;
          let str =  (vm.inputValue).replace(/\s*/g,"");
          if ( str  != '') {
           vm.sendRequest(vm.inputValue)  
           let timer_=setTimeout(()=>{
             vm.inputValue = '';
             clearTimeout(timer_);
           },50);
          }else{
            vm.inputValue = ''
          }
          vm.focusFlag=false;
    },
    //获取焦点 
    inputFocus(e) { 
      this.keyBottom = e.mp.detail.height;
      this.emojiFlag=false;
      this.focusFlag=true;
      let padBottom=parseInt(this.keyBottom)*2; 
      this.changeContentMore(this.focusFlag,padBottom);
    },
    //失去焦点 
    inputBlur() { 
      // console.log("触发")
      this.focusFlag=false;
      this.changeContentMore(this.focusFlag);
      this.keyBottom =0; 
    },
    
    // emoji组件回调 
    emojiCLick(e) {
          let val = e.mp.detail
          // // 单击删除按钮，，删除emoji
          // if(val == '[删除]') {
          //   let lastIndex = this.inputValue.lastIndexOf('[')
          //   if(lastIndex != -1) { 
          //       this.inputValue=this.inputValue.slice(0, lastIndex) 
          //   }
          //   return
          // }
          if(val[0] == '[') { // emoji 
            this.inputValue=this.inputValue + val 
          } 
    },
    changeMsgStatus(param) {
      let dataLst = this.msgList
      for (let i = dataLst.length-1;i>-1;i--){
       if (dataLst[i].hash == param.hash) {
        dataLst[i].status = param.status
      }
      }
    },
    AddTime(timestamp){
      let length = this.msgList.length
      if (length>=1&&  (parseInt(timestamp) -  parseInt(this.msgList[length-1].sendTime)  ) > 1000  * 60 * 10  ){
        gapp.globalData.P2pMessageList[this.otherOne.accid].push({
                  msgCategory:6,
                  sender:0,
                  sendTime:timestamp
        })
        this.msgList.push({
                msgId:1,
                content:1,
                msgCategory:6,
                sender:0,
                hash:1,
                sendTime:this.getDate(parseInt(timestamp)),
                status:1,
        })
        console.log(this.msgList,"1221")
      } 
    },
    //发送网络请求：发送文字 
    sendRequest(text) {
      let self = this
      let wsStatus = gapp.globalData.localSocket.readyState
      let timestamp = (new Date()).valueOf()
      let hash = random()
      //将消息存入发送状态表
      console.log(wsStatus,"wsStatus")
      if (wsStatus == 1){
          gapp.globalData.subscriber.emit('UPDATE_RECENT_CHAT', {data:text,receiver:self.otherOne.accid,msgCategory:1, chatCategory:3,time:timestamp,hash:hash})
             let  singleMsg = {
                    msgId:1,
                    content:emjTools(text),
                    msgCategory:1,
                    sender:self.myself.accid,
                    hash:hash,
                    sendTime:timestamp,
                    status:0,
       }
          self.AddTime(timestamp)
          self.msgList.push(singleMsg)
          if (!(gapp.globalData.P2pMessageList[self.otherOne.accid])){
           gapp.globalData.P2pMessageList[self.otherOne.accid] = []
          }
          gapp.globalData.P2pMessageList[self.otherOne.accid].push({
                    msgId:1,
                    content:text,
                    msgCategory:1,
                    sender:self.myself.accid,
                    sendTime:timestamp,
        })
         self.msgRecord(hash,timestamp)
      } else{
                    let  singleMsg = {
                    msgId:1,
                    content:emjTools(text),
                    msgCategory:1,
                    sender:self.myself.accid,
                    hash:hash,
                    sendTime:timestamp,
                    status:2,
                                     }
                    self.msgList.push(singleMsg)
      }
        if(!(gapp.globalData.recentChatList[(self.otherOne.accid)])){
              gapp.globalData.recentChatList[(self.otherOne.accid)] = 
                {
                nickName:self.otherOne.nickName,
                avatar:self.otherOne.avatar,
                content:text,
                sendTime:timestamp,
                msgCategory:1,
                countA:0,
                countB:0,
                }
           } else {
               gapp.globalData.recentChatList[(self.otherOne.accid)].content = text
               gapp.globalData.recentChatList[(self.otherOne.accid)].sendTime = timestamp
               gapp.globalData.recentChatList[(self.otherOne.accid)].msgCategory = 1
           }

           self.inputValue = ''
           self.scrollToBottom()  
           self.showCover = false
           self.firstTime = false
    },
        msgRecord(hash,time){
        gapp.globalData.msgSendingMap.set(hash,time)
        },
   chooseImageToSend (e) {
          let type = e.currentTarget.dataset.type
          let self = this
          self.moreFlag=false;
          wx.chooseImage({
            count: 1, // 默认9
            sizeType:['compressed'],
            sourceType: ['album'],
            success: function(res) {
             let src = res.tempFilePaths[0]
                   wx.uploadFile({
              url: `${baseUrl}public/file/wxupload`,
              filePath: src, 
              name: 'file',
              header: { "Content-Type": "multipart/form-data"}, 
              formData: { 
                  'name':src,
                  'source':'photo',
              },
              success: function (res) { 
                 let timestamp = (new Date()).valueOf()
                 self.AddTime(timestamp)
                 let hash = random()
                 let src = JSON.parse(res.data).link
                 self.msgRecord(hash,timestamp)
             let  singleMsg = {
                    msgId:1,
                    content:src,
                    msgCategory:2,
                    sender:self.myself.accid,
                    hash:hash,
                    sendTime:timestamp,
                    status:0,
       }
       self.msgList.push(singleMsg)
       if (!gapp.globalData.P2pMessageList[self.otherOne.accid]){
             gapp.globalData.P2pMessageList[self.otherOne.accid] = []
       }
        gapp.globalData.P2pMessageList[self.otherOne.accid].push({
                    msgId:1,
                    content:src,
                    msgCategory:2,
                    sender:self.myself.accid,
                    sendTime:timestamp,
        })   
         gapp.globalData.subscriber.emit('UPDATE_RECENT_CHAT', {data:src,receiver:self.otherOne.accid,msgCategory:2, chatCategory:3,time:timestamp,hash:hash})
      if(!(gapp.globalData.recentChatList[(self.otherOne.accid)])){
              gapp.globalData.recentChatList[(self.otherOne.accid)] = 
                {
                nickName:self.otherOne.nickName,
                avatar:self.otherOne.avatar,
                content:"[图片]",
                sendTime:timestamp,
                msgCategory:2,
                countA:0,
                countB:0,
                }
           } else {
               gapp.globalData.recentChatList[(self.otherOne.accid)].msgCategory = 2
               gapp.globalData.recentChatList[(self.otherOne.accid)].content = "[图片]"
               gapp.globalData.recentChatList[(self.otherOne.accid)].sendTime = timestamp
           }
          self.scrollToBottom()  
          self.showCover = false
           },
              fail:function(err){
                vm.clickBtnpload=true;
                wx.showModal({
                  title: '提示',
                  content: '上传失败,请重新上传',
                  showCancel: false
                })
              }
            })
            },
          })
    },
    //切换出emoji键盘 
    toggleEmoji() {  
      this.sendType= 0,
      this.emojiFlag= !this.emojiFlag,
      this.emojiFlag?this.focusFlag=false:this.focusFlag=true; 
      this.moreFlag= false 
      this.changeContentMore(this.emojiFlag);
      this.scrollToBottom();
    },
    //切出更多 
    toggleMore () { 
      this.moreFlag= !this.moreFlag,
      this.changeContentMore(this.moreFlag,420);
      this.emojiFlag= false,
      this.focusFlag= false 
    },
    // 展示编辑菜单 
    showEditorMenu (e) {
      let message = e.mp.currentTarget.dataset.message
      if(message.type === 'tip') {
        return
      }
      let paraObj = {
        time: message.time,
        chatTo: this.chatTo
      }
      let self = this
      if (message.sendOrReceive === 'send') { // 自己消息
        wx.showActionSheet({
          // itemList: ['删除', '撤回'],
          itemList: ['删除'],
          success: function (res) {
            switch (res.tapIndex) {
              case 0:
                self.deleteMessageRecord(message)
                break
              case 1:
                wx.showActionSheet({
                  itemList: ['确定'],
                  itemColor: '#FF5E66',
                  success: function(res) {
                    if(res.tapIndex === 0) {
                      self.recallMessage(message)
                    }
                  }
                })
                break
              default:
                break
            }
          }
        })
      } else {// 对方消息
        wx.showActionSheet({
          itemList: ['删除'],
          success: function (res) {
            switch (res.tapIndex) {
              case 0:
                self.deleteMessageRecord(message)
                break 
              default:
                break
            }
          }
        })
      }
    },
     // 距离上一条消息是否超过两分钟 
    judgeOverTwoMinute(time) {
      let displayTimeHeader = ''
      let lastMessage = this.messageArr[this.messageArr.length - 1]
      if (lastMessage) {//拥有上一条消息
        let delta = time - lastMessage.time
        if (delta > 2 * 60 * 1000) {//两分钟以上
          displayTimeHeader = calcTimeHeader(time)
        }
      } else {//没有上一条消息
        displayTimeHeader = calcTimeHeader(time)
      }
      return displayTimeHeader
    },
    chatingWrapperClick () { 
      this.foldInputArea()
    },
  //收起键盘 
    foldInputArea() { 
      this.padBottom=100;
      this.focusFlag=false;
      this.emojiFlag=false;
      this.tipFlag=false;
      this.moreFlag=false; 
    },
    //滚动页面到底部 
    scrollToBottom () { 
        let self = this
      if(this.msgList.length > 0){        
      wx.createSelectorQuery().select('#recordWrapper').boundingClientRect(function (rect) { 
        if (rect != null){
           console.log("rect",rect)
        if (self.emojiFlag || self.focusFlag) { 
          self.scrollTop=rect.height + 550;
        } else { 
          self.scrollTop=rect.height + 100;
        } 
        }
      }).exec()
   
      }
    },
    offlineMsg(){
    //先获取未读消息
      let self = this
      let data = {
        sender:self.otherOne.accid,
        receiver:self.myself.accid,
      }
       api.getMsgOffline(data).then(res => {
          console.log("离线消息",res)
          gapp.globalData.P2pMessageList[self.otherOne.accid] = []
            console.log("thisMessage",res.data.data.P2POfflineMsg)
            if (res.data.data.P2POfflineMsg){
               let thisMessage =res.data.data.P2POfflineMsg
               let newArray = []
                 thisMessage.forEach((item,index)=>{
                        gapp.globalData.P2pMessageList[thisMessage[0].sender].push({
                        msgId:item.msgid,
                        content:item.content,
                        msgCategory:item.msg_category,
                        sender:item.sender,
                        sendTime:item.sendtime
                      })
                      let  singleMsg = {
                        msgId:item.msgid,
                        content:item.msg_category == 5?JSON.parse(item.content):emjTools(item.content),
                        msgCategory:item.msg_category,
                        sender:item.sender,
                        hash:1,
                        sendTime:item.send_time,
                        status:1,
                        }
                        newArray.push(singleMsg)
                    })
            //发送已读回执
             console.log("是这里的msgid2")
                  let msgP2pReadedR = { 
                    accid: thisMessage[0].sender,
                    msgid: thisMessage[thisMessage.length - 1].msgid,
                }
                 gapp.globalData.subscriber.emit('OFF_MSG_READED',msgP2pReadedR)  
                  let cTime=setTimeout(function() {
                     self.msgList=newArray.concat(self.msgList)
                    // self.showCover = false
                    // self.scrollToBottom()     
                    self.getHistory(0,0) 
                    clearTimeout(cTime);
                  }, 250)
                  //记录离线消息msgID以便离线消息和历史消息去重
                  self.offHisMsgID = thisMessage[0].msgid
            }else{
                 self.getHistory(0,0)
            }
    
       }) 

    },
    getHistory(a,b){
      let self = this
      console.log("self.offHisMsgID",self.offHisMsgID)
      let data = {
        message_id:self.offHisMsgID == ''? 0:self.offHisMsgID,
        sender:self.otherOne.accid,
        receiver:self.myself.accid,
        chat_category:3,
        page:self.page,
        size:self.limit,
      } 
      api.getMsgsHistory(data).then(res => {
        console.log("历史消息",res)
        let data = res.data.data.data
        if (!data){
          this.historyAllDone = true
          self.showCover = false
          return
        }
        let newArray = []
        if (!(gapp.globalData.P2pMessageList[self.otherOne.accid])){
          gapp.globalData.P2pMessageList[self.otherOne.accid] = []
        }
          for (let i = 0;i < data.length;i++){
          //加进全局数据
          gapp.globalData.P2pMessageList[self.otherOne.accid].unshift({
            msgId:data[i].msg_id,
            content:data[i].content,
            msgCategory:data[i].msg_category,
            sender:data[i].sender,
            sendTime:data[i].send_time
            })
          //加进当前列表
          let  singleMsg = {
          msgId:data[i].msg_id,
          content:data[i].msg_category == 5?JSON.parse(data[i].content):emjTools(data[i].content),
          msgCategory:data[i].msg_category,
          sender:data[i].sender,
          hash:1,
          sendTime:data[i].send_time,
          status:1,
        }
        newArray.unshift(singleMsg)
        }
        self.msgList=newArray.concat(self.msgList)
        self.page++ 
        self.oneMoreLoading = 1 
        self.historyLoading = false
        console.log(self.msgList,"当前页面数据！")
        if(a==0&&b==0){
          let cTime=setTimeout(function() {
              self.scrollToBottom()
              self.showCover = false;
              clearTimeout(cTime);
          }, 250);
        }
      })
    },
    //页面滚动效果
    onPageScroll (e) { 
      if(this.oneMoreLoading==1&&!this.historyAllDone){ 
        this.getHistory(1,1);
        this.scrollTop=0;
        this.oneMoreLoading=0; 
        this.historyLoading = true
      } 
    },
    changeContentMore(val,num=''){
      if(val){
        num?this.padBottom=num:this.padBottom=640;
      }else{
        this.padBottom=100;
      } 
     this.scrollToBottom();
    },
    //跳转用户详情
    jumpDetail(){ 
      gapp.aldstat.sendEvent('index:个人中心'); 
      wx.navigateTo({url:`./../../common/user-detail-page/main?ruuid=${this.otherOne.ruuid}`});  
    },
  },
  onShareAppMessage: function(res) {  
    let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid;
    let path = `pages/common/index/main?sharRuuid=${meRuuid}`;  
    return this.onShareAppMessage('',path);
  }, 
}
</script>
<style>
page{
    background-color: #F0EFF6;
    height:100%;
}
.emj{
  width: 50rpx;
  height: 50rpx;
  display:inline-block;
  vertical-align:middle;
}
.sendFail{
  width:36rpx;
  height:36rpx;
  display:block;
  margin-right:28rpx;
  margin-top:60rpx;
}
.circle-margin-left{
  margin-left:15rpx;
}
</style>
<style  scoped lang="scss">
.record-say-hi-wrapper{
  margin:10px auto;
  width:100%;
  display:flex;
  flex-direction:row;
  justify-content:center;
  .record-item-time {
  border-radius: 10rpx;
  padding:4rpx 10rpx;
  background-color: #D6D5DB;
  color:#fff;
  font-size: 26rpx; 
}
}
.imgOfMsg{
  margin-top:40rpx;
  width:460rpx;
  height:auto;
  background:#FFFFFF;
  border-radius:0px 16rpx 16rpx 16rpx;
  border:1rpx solid rgba(151,151,151,0.21);
  image{
    display:block;
    width:428rpx;
    margin:16rpx auto;
  }
}
.cover{
  margin-top:126rpx;
  width:100%;
  height:100%;
  position:relative;
  display:flex;
  justify-content:flex-start;
  flex-direction:column;
  align-items:center;
  .head{
    height:50rpx;
    font-size:36rpx;
    font-weight:500;
    color:rgba(53,64,82,1);
    line-height:50rpx;
  }
  .time{
    margin-top:24rpx;
    height:40rpx;
    font-size:28rpx;
    font-weight:400;
    color:rgba(161,167,174,1);
    line-height:40rpx;
  }
  .portrait{
    margin-top:90rpx;
    width:320rpx;
    height:320rpx;
    border-radius:160rpx;
    position:relative;
    .headImg{
      width:100%;
      height:100%;
      display:block;
      position:absolute;
      left:0;
      bottom:0;
      border-radius:160rpx;
    }
    .icon1{
      width:100rpx;
      height:64rpx;
      display:block;
      position:absolute;
      left:110rpx;
      bottom:-32rpx;
    }
    .icon2{
      width:64rpx;
      height:64rpx;
      display:block;
      position:absolute;
      left:128rpx;
      bottom:-32rpx;
    }
    .icon3{
      width:39rpx;
      height:64rpx;
      display:block;
      position:absolute;
      left:140rpx;
      bottom:-32rpx;
    }
  }
}
.specialMsg{
  margin:20rpx auto 50rpx;
  width:693rpx;
  position:relative;
  border-radius:8px 8px 8px 8px;
  image{
    width:100%;
    display:block;
    border-radius:8px 8px 8px 8px;
  }
  span{
    display:block;
    background:rgba(74,144,226,1);
    box-shadow:0px 2rpx 8rpx 0px rgba(0,0,0,0.22);
    border-radius:47rpx 47rpx 9rpx 47rpx;
    border:4rpx solid rgba(255,255,255,1);
    position:absolute;
    left:16rpx;
    font-size:26rpx;
    text-align:center;
    padding:16rpx 28rpx 18rpx 34rpx;
    line-height:36rpx;
    bottom:-35rpx;
    color:#FFFFFF;
  }
}
  .refresh-loading {
    margin: 0 5px;
    width: 50rpx;
    height: 50rpx;
    display: inline-block;
    vertical-align: middle;
    -webkit-animation: weuiLoading 1s steps(12, end) infinite;
    animation: weuiLoading 1s steps(12, end) infinite;
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
    background-size: 100%;
  }
.chatting-page{
  height:100%;
  width:100%;
    .record-wrapper{
    width: 100%;
    padding-bottom: 100rpx;
    padding-top:10rpx;
    .record-item-time-wrapper {
      display:flex;
      flex-direction:row;
      justify-content:center;
      .record-item-time {
        border-radius: 10rpx;
        padding:4rpx 10rpx;
        background-color: #D6D5DB;
        color:#fff;
        font-size: 26rpx; 
      }
    }
    .featch-wx--chatting-item-text,.record-chatting-item-text{
      line-height:50rpx;
      border-radius: 10rpx;
      background-color: #fff;
      color:#4E5969;
      padding: 16rpx;
      box-sizing:border-box;
      word-wrap:break-word;
      overflow: hidden;
      margin-top:40rpx;
      border-radius:0  16rpx 16rpx 16rpx;
      font-size:28rpx;
      display:flex; 
      .emj{
        vertical-align:middle;
      }
    }
    .record-chatting-item-text {
      max-width: 70%; 
    }
    .featch-wx--chatting-item-text{
      width: 462rpx; 
      padding: 30rpx 16rpx;
    }
    .featch-wx-btn{
      .right-btn,.left-btn{
        width:160rpx;
        height:66rpx;
        line-height:66rpx;
        font-size:26rpx;
        color:#4E5969;
        border-radius:6px;
        margin-top:24rpx;
      }
      .left-btn{
        background:#7ED321;
        &:active{
          opacity: .6;
        }
      }
      .right-btn{
        background:#FF5E66;
        margin-left:16rpx;

      }
    }
    .black_btn{
      width:100%; 
      .blcak-item{ 
        width:60%;
        margin:auto;
        height:80rpx;
        line-height:80rpx;
        font-size:28rpx;
        border-radius:40rpx;
        color:#4E5969;
        background:#FF5E66;
      }
    }
    /* tip消息富文本 */
    .tip-rich-text {
      background-color:#D6D5DB;
      text-align:center;
      align-self:center;
      height:40rpx;
      font-size:28rpx;
      padding:4rpx 20rpx;
      color:#4E5969;
      border-radius: 10rpx;
      margin:auto;
    }
    //我发的消息内容
    .self {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      color: #fff;
      .audio-wrapper{
        .image{
          transform:rotate(180deg);
        } 
      }
    } 
    .record-chatting-item {
      width: 100%; 
      box-sizing: border-box;
      .right-triangle{  
        height:0px;    
        width:0px;    
        border-width:20rpx;    
        border-style:solid;    
        border-color:transparent transparent transparent #80a1d5;    
        margin-top: 20rpx;
      }  
      .record-chatting-item-img {
        width: 80rpx;
        height: 80rpx;
        border-radius: 100%;
        display: inline-block;
        margin-left:24rpx;
      }
    }
    //另一个人
    .other {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      color: #fff;
      .other-header{
        margin-left:0;
        margin-right:24rpx; 
      } 
      
    }
  }
  .more-loading{
    // margin-bottom:20rpx;
  }
    /*聊天输入框  */
  .chatinput-wrapper {
    width: 100%;
    background: #fff; 
    box-shadow:0px -10px 26px 0px rgba(64,85,196,0.08);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    .chatinput-content {
      width: 100%;
      height: 100rpx;
      display:flex;
      align-items:center; 
      padding-top:0;
      padding-bottom:0;
      padding-left:30rpx;
      .send-msg {
        height:64rpx;
        width:96rpx;
        line-height:64rpx;
        font-size:28rpx;
        color:#fff;
        background:linear-gradient(90deg,rgba(255,120,73,1) 0%,rgba(255,73,65,1) 100%);
        border-radius:36rpx;
      }
      .circle-icon{
          position: relative;
          width: 64rpx;
          height: 64rpx;
       .img{
          width: 64rpx;
          height: 64rpx;
          position: absolute;
          left: 0;
          top: 0;
          display: block;
      }
      }
      .flex-center-input{
        margin: 0 24rpx;
      }
      .chatinput-input {
        margin-bottom: 20rpx;
        width: 492rpx;
        min-height: 70rpx;  
        margin-top: 20rpx;
        display: inline-block;
        vertical-align:top;
        box-sizing:border-box;
        padding:0 38rpx;
        font-size: 30rpx;
        border-radius:36rpx;
        color:#4E5761;
        background:#EFEFEF;
      }
    }  
  }
  .special-focus{
    position:fixed;
    top:164rpx;
    right:36rpx;
    width:128rpx;
    height:128rpx;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background:#fff;
    .icon{
      width:48rpx;
      height:46rpx;
      margin-bottom:6rpx;
      transform:scale(1);
      transition: transform .2s;
      &:active{
        transform:scale(1.2);
        transition: transform .2s;
      }
    }
    .text{
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:#4E5761;
      font-size:20rpx;
    }
  }
}
</style>

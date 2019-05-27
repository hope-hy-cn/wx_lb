import { wsUrl } from './config'
import { emjList } from './config'
import { appApiKey } from './config' 
import subscriber from './event.js'
import * as api from '@/utils/api' ; 

var gapp = getApp() 
    
const protobuf = require('./imtools/weichatPb/protobuf.js');

//登录
const signConfig = require('./imtools/allProto/sign_in.js');
const signRoot = protobuf.Root.fromJSON(signConfig);
const signMessage = signRoot.lookupType("SignIn");

//登录回执
const signAckConfig = require('./imtools/allProto/sign_in_ack.js');
const signAckRoot = protobuf.Root.fromJSON(signAckConfig);
const signAckMessage = signAckRoot.lookupType("SignInACK");

//接收未读消息
const msgOffConfig = require('./imtools/allProto/message_offline.js');
const msgOffRoot = protobuf.Root.fromJSON(msgOffConfig);
const msgOffMessage = msgOffRoot.lookupType("MessageOfflines");

//发送消息
const msgConfig = require('./imtools/allProto/message_send.js');
const msgRoot = protobuf.Root.fromJSON(msgConfig);
const msgnMessage = msgRoot.lookupType("MessageSend");

//收到消息
const msgResConfig = require('./imtools/allProto/message_deliver.js');
const msgResRoot = protobuf.Root.fromJSON(msgResConfig);
const msgnResMessage = msgResRoot.lookupType("Message");

//发送p2p离线消息请求
const msgP2pOffRConfig = require('./imtools/allProto/p2p_chat_r.js');
const msgP2pOffRRoot = protobuf.Root.fromJSON(msgP2pOffRConfig);
const msgP2pOffRMessage = msgP2pOffRRoot.lookupType("P2pChatR");

//接收p2p离线消息请求
const msgP2pOffAConfig = require('./imtools/allProto/p2p_chat_a');
const msgP2pOffARoot = protobuf.Root.fromJSON(msgP2pOffAConfig);
const msgP2pOffAMessage = msgP2pOffARoot.lookupType("P2pChatA");

//发送p2p离线消息已读请求
const msgP2pOffReadRConfig = require('./imtools/allProto/p2p_chat_readed_r.js');
const msgP2pOffReadRRoot = protobuf.Root.fromJSON(msgP2pOffReadRConfig);
const msgP2pOffReadRMessage = msgP2pOffReadRRoot.lookupType("P2pChatReadedR");

//接收p2p离线消息已读请求回执
const msgP2pOffReadAConfig = require('./imtools/allProto/p2p_chat_readed_a.js');
const msgP2pOffReadARoot = protobuf.Root.fromJSON(msgP2pOffReadAConfig);
const msgP2pOffReadAMessage = msgP2pOffReadARoot.lookupType("P2pChatReadedA");

//接收p2p离线消息已读请求回执
const msgAckRConfig = require('./imtools/allProto/message_ack.js');
const msgAckRRoot = protobuf.Root.fromJSON(msgAckRConfig);
const msgAckRMessage = msgAckRRoot.lookupType("MessageACK");

//接受推送消息
const pushMessageConfig = require('./imtools/allProto/push_message_deliver.js');
const pushMsgRoot = protobuf.Root.fromJSON(pushMessageConfig);
const pushMessage = pushMsgRoot.lookupType("PushMessage");

//主动发推送消息的请求
const pushMessageSendConfig = require('./imtools/allProto/push_message_send.js');
const pushMsgSendRoot = protobuf.Root.fromJSON(pushMessageSendConfig);
const pushSendMessage = pushMsgSendRoot.lookupType("PushMessageSend");

//ws状态码
const statusCode = {
    Success      : 0,
    SigninFailed : 10
}


const msgCode = {
    CodeSignIn            : 1, // 设备登录
    CodeSignInACK         : 2,// 设备登录回执
    CodeHeartbeat         : 4,// 心跳
    CodeHeartbeatACK      : 5,// 心跳回执
    CodeMsgSendR          : 6,  //client发消息请求
    CodeMsgSendA          : 7, //server收到client发消息请求的回执
    CodeMsgSendN          : 8,//服务器投递消息
    CodeMsgAckR           : 9,//接收方已收消息
    CodeMsgAckA           : 10,//server已知接收方已收消息
    CodeMsgAckN           : 11,//server通知发送者,接收者已收消息
    CodeMsgFalsifyAckN    : 12,//server通知发送者,伪造接收者已收消息
    CodeMsgOfflineR       : 13,//请求离线消息
    CodeMsgOfflineA       : 14,//发送离线信息
    CodeP2pOfflineMsgR    : 15,//单独离线消息请求
    CodeP2pOfflineMsgA    : 16,//单独离线消息回复
    CodeOfflineMsgReadedR : 17,//离线消息已读回执请求
    CodeOfflineMsgReadedA : 18,//单独离线已读回执回复
    CodeSingleMsgReadedR  : 19,//单条消息已读请求
    CodeMessagePushR      :24, //推送通知消息请求
	CodeMessagePushN      :25, //推送通知消息通知
}



gapp.globalData = {
    netStatus:true,//当前网络状态 
    localSocket:{},
    subscriber,//消息订阅器
    isLoginWs: false, // 当前是否是登录状态
    currentChatTo: '', // 记录当前聊天对象account，用于标记聊天时禁止更新最近会话unread
    recentChatList: {
    }, //最近会话列表
    P2pMessageList: {}, //所有玩家之间的消息列表
    msgHashMap:new Map(),//消息hash表用来去重消息
    msgSendingMap:new Map(),//消息发送状态表
    heartTest:{},//心跳检测
    nowAccid:'',//处在和哪个的聊天界面 0代表没有处在任何聊天界面
    reconnect:0,//表明重连次数 在网络环境没问题的情况下会重连三次，三次不成功就给出提示
    pushMessageData:{}, //推送消息
}

//表情处理。
export const emjTools = (data) => {
    var content = data.replace(/\[.{0,2}\S]/ig,function (word) {
        return '<img class="emj"  src="https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/biaoqing/'+ emjList[word.replace(/\s/,'')]+'"/>';
    });
    return content;
}

//初始化长连接 
export const startWebSocket = () => {
    console.log("触发链接")
    var userAccount = JSON.parse(wx.getStorageSync('account'))
    gapp.globalData.localSocket = wx.connectSocket({url: wsUrl,data: {},method: 'GET',success: function (res) {},fail: function (res) {}})
    gapp.globalData.localSocket.onOpen(function () {console.log("长连接开启")
    login()})
    gapp.globalData.localSocket.onError(function (res) {})
    gapp.globalData.localSocket.onMessage(function (res) {
        var newData = new Uint8Array(res.data)
        var code = new Uint8Array(2);
        code = newData.slice(0, 2)
        code = bytesToInt(code)
        // console.log("code",code);
        switch (code) {  
            case msgCode.CodeSignInACK:
                if (signAckMessage.decode(newData.slice(4)).code == statusCode.Success) {
                    console.log("登录成功")
                    gapp.globalData.subscriber.emit('RECEIVE_P2P_MESSAGE', "登陆成功！") 
                      syncTrigger()
                    // 每过四分钟发送心跳
                    setInterval(function () {
                        heartBeat()
                    },4000 * 60)

                   //轮询 处理发送信息状态 心跳机制
                    setInterval(function () {
                        if(gapp.globalData.localSocket.readyState != 1){
                            wx.getNetworkType({
                                success:function(res) {
                                    var netType = res.networkType
                                    if (netType != "none"){
                                        startWebSocket()
                                    }
                                }
                            })
                        }
                        //监视信息发送状态
                        var map = gapp.globalData.msgSendingMap
                            if (map){
                                map.forEach(logMapElements)
                            }
                        //监听心跳
                            let timestamp = (new Date()).valueOf()
                            if (gapp.globalData.heartTest.count >= 3) {
                                wx.closeSocket()
                            } else{
                                if ((timestamp - gapp.globalData.heartTest.time > 5000)&&gapp.globalData.heartTest.time) {
                                gapp.globalData.heartTest.count++
                                heartBeat()
                            }
                        }
                    },5000) 
                }  
                break
            case msgCode.CodeHeartbeatACK:
                gapp.globalData.heartTest.time = 0
                gapp.globalData.heartTest.count = 0
                break
            case msgCode.CodeMsgOfflineA:
                gapp.globalData.recentChatList = {}
                var res = msgOffMessage.decode(newData.slice(4)).AllOfflineMsg
                console.log("最近联系人",res)
                gapp.globalData.subscriber.emit('MSG_USER_DATA_LIST',res) //最近联系的人
                res.forEach((item,index)=>{
                    let accid = item.AccId
                       gapp.globalData.recentChatList[accid] = 
                       {
                        nickName:item.NickName,
                        avatar:item.Avatar,
                        content:item.Content,
                        sendTime:item.SendTime,
                        msgCategory:item.MsgCategory,
                        countA:item.Total,
                        countB:0,
                       }
                })
                break
            case msgCode.CodeMsgSendA:
            console.log("发消息回执",newData)
                var messageA =  msgAckRMessage.decode(newData.slice(4))
                console.log("消息回执",messageA)
                gapp.globalData.msgSendingMap.delete(messageA.hash)
                gapp.globalData.subscriber.emit('CHANGE_MSG_STATUS',{hash:messageA.hash,status:1})
                break
            case msgCode.CodeMessagePushN:
                var thisPushMessage =  pushMessage.decode(newData.slice(4)) 
                gapp.globalData.subscriber.emit('PUSH_MESSAGE_LIST',thisPushMessage.messages[0])
                console.log('推送消息通知',thisPushMessage.messages[0]);
                break
            case msgCode.CodeMsgSendN:
            //收到消息
            //收到消息后先进入hashMap判断  
            var thisMessage =  msgnResMessage.decode(newData.slice(4))
            console.log("收到消息",thisMessage)
            var senderAccid = thisMessage.messages[0].sender
             if(gapp.globalData.msgHashMap.get(userAccount.accid + thisMessage.messages[0].hash)){
               //存在于hashMap里表明这条消息已经存在就过滤到不做处理  
             } else{
                //发送消息已收回执
                var msgAck = { 
                    messageId: thisMessage.messages[0].messageId,
                }           
                var res = makeProto(msgCode.CodeMsgAckR, msgAck)  
                wsSend(res)
                //发送消息已读回执,先要判断是否在二人界面里不在肯定就没看到 并且当前所处聊天界面accId要和消息的accid相等
                if(gapp.globalData.nowAccid == senderAccid ){
                 var msgP2pReadedR = { 
                    msgid: thisMessage.messages[0].messageId,
                }           
                var res = makeProto(msgCode.CodeSingleMsgReadedR, msgP2pReadedR)  
                wsSend(res)
                }
               //不存在就将hash存于map当中并且存放消息到消息数据结构中，
               gapp.globalData.msgHashMap.set(userAccount.accid + thisMessage.messages[0].hash,"record")
               //判断最近联系人列表是否有这个数据
               if (gapp.globalData.recentChatList[senderAccid]){
                   gapp.globalData.recentChatList[senderAccid].content = thisMessage.messages[0].content
                   gapp.globalData.recentChatList[senderAccid].sendTime = thisMessage.messages[0].sendTime
                   gapp.globalData.recentChatList[senderAccid].msgCategory = thisMessage.messages[0].msgCategory

                 //    判断消息列表是否有这个数据,表示进没有进过两人的聊天界面！
                        if (gapp.globalData.P2pMessageList[senderAccid]){
                            let totalLength = (gapp.globalData.P2pMessageList[senderAccid]).length
                            if (totalLength > 1&&parseInt(thisMessage.messages[0].sendTime) - parseInt(gapp.globalData.P2pMessageList[senderAccid][totalLength - 1].sendTime) > 1000 * 60 * 10){
                                gapp.globalData.P2pMessageList[senderAccid].push({
                                msgCategory:6,
                                sender:0,
                                sendTime:thisMessage.messages[0].sendTime
                            })
                            }
                                gapp.globalData.P2pMessageList[senderAccid].push({
                                msgId:thisMessage.messages[0].messageId,
                                content:thisMessage.messages[0].content,
                                msgCategory:thisMessage.messages[0].msgCategory,
                                sender:thisMessage.messages[0].sender,
                                sendTime:thisMessage.messages[0].sendTime
                            })
                             if(gapp.globalData.nowAccid != senderAccid ){
                                gapp.globalData.recentChatList[senderAccid].countB++
                             }
                        } else{
                            gapp.globalData.recentChatList[senderAccid].countA++
                        }
                        gapp.globalData.subscriber.emit('UPDATE_MSG_LIST',true)

               } else{
                   api.getUserInfoByAccId({other_accid:senderAccid}).then(res=>{ 
                       gapp.globalData.recentChatList[senderAccid] = 
                       {
                        nickName:res.data.nickname,
                        avatar:res.data.avatar,
                        content:thisMessage.messages[0].content,
                        sendTime:thisMessage.messages[0].sendTime,
                        msgCategory:thisMessage.messages[0].msgCategory,
                        countA:0,
                        countB:0,
                       }
                     //    判断消息列表是否有这个数据,表示进没有进过两人的聊天界面！
                        if (gapp.globalData.P2pMessageList[senderAccid]){
                                gapp.globalData.P2pMessageList[senderAccid].push({
                                msgId:thisMessage.messages[0].messageId,
                                content:thisMessage.messages[0].content,
                                msgCategory:thisMessage.messages[0].msgCategory,
                                sender:thisMessage.messages[0].sender,
                                sendTime:thisMessage.messages[0].sendTime
                            })
                            if(gapp.globalData.nowAccid != senderAccid){
                              gapp.globalData.recentChatList[senderAccid].countB++
                            }
                        } else{
                            gapp.globalData.recentChatList[senderAccid].countA++
                        }
                        gapp.globalData.subscriber.emit('UPDATE_MSG_LIST',true)
                        console.log("聊天数据",gapp.globalData.P2pMessageList)   
                })       
               }
             }
                break
            case msgCode.CodeP2pOfflineMsgA:
               var thisMessage =  msgP2pOffAMessage.decode(newData.slice(4)).P2POfflineMsg
               console.log("拿到的离线消息",thisMessage)
                gapp.globalData.P2pMessageList[gapp.globalData.nowAccid] = []
               if (thisMessage.length != 0){
                    //拿到两人间离线消息存入两人间消息结构中
                    thisMessage.forEach((item,index)=>{
                        gapp.globalData.P2pMessageList[thisMessage[0].sender].push({
                            msgId:item.msgid,
                            content:item.content,
                            msgCategory:item.msgCategory,
                            sender:item.sender,
                            sendTime:item.sendtime
                        })
                    })
                //发送已读回执
                 var msgP2pReadedR = { 
                    accid: thisMessage[0].sender,
                    msgid: thisMessage[thisMessage.length - 1].msgid,
                }           
                var res = makeProto(msgCode.CodeOfflineMsgReadedR, msgP2pReadedR)  
                wsSend(res)
                gapp.globalData.subscriber.emit('UPDATE_MSG_LIST',true)
               }
        }
    })
     gapp.globalData.localSocket.onClose(function (res) {
        // console.log("长连接关闭回调",res)
        // wx.getNetworkType({
        //   success:function(res) {
        //       var netType = res.networkType
        //       if (netType != "none"){
        //          if (gapp.globalData.reconnect >= 3) {
        //           wx.showModal({
        //           title: '提示',
        //           content: '服务器错误，稍后再试！',
        //           showCancel: false
        //         })   
        //         return 
        //          }
        //          startWebSocket()
        //          gapp.globalData.reconnect++
        //       }else{
        //           gapp.netStatus = false
        //           wx.showModal({
        //           title: '提示',
        //           content: '网络断开连接！',
        //           showCancel: false
        //         })  
        //       }
        //   }
        // })
    })
}

function logMapElements(value, key, map) {
    var time = (new Date()).valueOf()
    if((time - value) > 5000){
      gapp.globalData.subscriber.emit('CHANGE_MSG_STATUS',{hash:key,status:2})
    }
}

function makeProto(code,data) {
    var bytes = new Uint8Array()
    switch (code) {
        //登录
        case msgCode.CodeSignIn:
            var message = signMessage.create(data);
            bytes = signMessage.encode(message).finish();
            break;
        //发送消息
        case msgCode.CodeMsgSendR:
            var message = msgnMessage.create(data);
            bytes = msgnMessage.encode(message).finish();
            break;
        //收到消息回执
        case msgCode.CodeMsgAckR:
            var message = msgAckRMessage.create(data);
            bytes = msgAckRMessage.encode(message).finish();
            break;
        case msgCode.CodeP2pOfflineMsgR:
            var message = msgP2pOffRMessage.create(data);
            bytes = msgP2pOffRMessage.encode(message).finish();
            break;
        case msgCode.CodeOfflineMsgReadedR:
            var message = msgP2pOffReadRMessage.create(data);
            bytes = msgP2pOffReadRMessage.encode(message).finish();
            break; 
        case msgCode.CodeSingleMsgReadedR:
            var message = msgP2pOffReadRMessage.create(data);
            bytes = msgP2pOffReadRMessage.encode(message).finish();
            break; 
            //接受推送消息
        case msgCode.CodeMessagePushN:
            var message = pushMessage.create(data);
            bytes = pushMessage.encode(message).finish();
            break; 
    }

    // console.log("bytes",bytes)
    var a = intTobytes(code)
    var b = intTobytes(bytes.byteLength)
    var u81 = new Uint8Array(a),
        u82 = new Uint8Array(b),
        u83 = new Uint8Array(bytes),
        res = new Uint8Array(a.byteLength + b.byteLength + bytes.byteLength);

        // console.log(u81,u82,u83,res)
    res.set(u81, 0);
    res.set(u82, a.byteLength);
    res.set(u83, a.byteLength + b.byteLength);
    return res
}

function wsSend(data) {
    let body = data.buffer
    wx.sendSocketMessage({
        data: body,
        success: function (res) {

        //   console.log("消息成功回调",res)
        },
        fail: function (res) {

        //   console.log("消息失败回调",res)
        }
    })
}
//监听消息发送
gapp.globalData.subscriber.on('UPDATE_RECENT_CHAT', (data)=>{
     var content = {
         chatCategory:data.chatCategory,
         receiver:data.receiver,
         msgCategory:data.msgCategory,
         content:data.data,
         hash:data.hash,
         sendTime:(data.time).toString()
     }

    //  console.log(content,"发送内容")
     var res = makeProto(msgCode.CodeMsgSendR, content)
    wsSend(res)
      
})

gapp.globalData.subscriber.on('OFF_MSG_READED',(data)=>{
    var res = makeProto(msgCode.CodeOfflineMsgReadedR, data)  
    wsSend(res)
    console.log("发消息回执111",data)
})


//监听请求两人间未读消息
gapp.globalData.subscriber.on('GET_P2P_OFFMSG', (data)=>{
     var content = {
        accid:data
     }
     var res = makeProto(msgCode.CodeP2pOfflineMsgR, content)
    wsSend(res) 
})

function login() {
    let userAccount = JSON.parse(wx.getStorageSync('account')); 
     let system='';
     if(wx.getStorageSync('systemInfo').system.split(' ')[0]=='iOS'){
         system='ios';
     }else{
         system='android';
     }
    var User = {
            appKey: appApiKey,
            deviceToken:userAccount.deviceToken, 
            accid:userAccount.accid, 
            password:userAccount.password,
            brand:wx.getStorageSync('systemInfo').brand,
            model:wx.getStorageSync('systemInfo').model,
            system:system,
            systemVersion:wx.getStorageSync('systemInfo').version
        }
        console.log("登录吧！",User)

//    console.log(User,"user")
    var res = makeProto(msgCode.CodeSignIn, User)
    wsSend(res)
}

function syncTrigger() {
    var Syncmsg = new Uint8Array()
    var res = makeProto(msgCode.CodeMsgOfflineR, Syncmsg)
    wsSend(res)
}

function heartBeat() { 
    let timestamp = (new Date()).valueOf()
    var heart = new Uint8Array()
    var res = makeProto(msgCode.CodeHeartbeat, heart)
    gapp.globalData.heartTest.time = timestamp 
    wsSend(res) 
}

//二进制转换
function intTobytes(value) {
    var a = new Uint8Array(2)
    a[0] = (value >> 8) & 0xFF
    a[1] = value & 0xFF
    return a;
}

//二进制解码
function bytesToInt(params) {
    var value = (params[1] & 0xFF) | ((params[0] & 0xFF) << 8);
    return value;
}


export const random = () => {
     var len = 10
　　 var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'   /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　 var maxPos = $chars.length
　　 var str = ''
　　 for (var i = 0; i < len; i++) {
　　　　str += $chars.charAt(Math.floor(Math.random() * maxPos))
　　      }
　　     return str
}







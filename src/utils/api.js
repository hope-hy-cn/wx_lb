
import { baseUrl,imHttpUrl }  from  './config'
import { fetch ,postJson,fetchNullToken} from  './httpFly' 

//登录微信服务器 (激活session_key) 获取openid
export const wxServer= (data) => {  
	return fetch(baseUrl+'user/wxserver/connect',data)
}

//登录
export const userLogin= (data) => {  
	return postJson(baseUrl+'user/login',data)
}

//发送短信验证码
export const fetSend= (data) => {  
	return fetch(baseUrl+'public/smsvcode/send',data)
}

//用户注册接口
export const register= (data) => {  
	return postJson(baseUrl+'user/register',data)
}

 //获取用户信息
export const getUserDetail= () => {  
	return fetch(baseUrl+'user/info/get')
}

//更新用户信息
export const updateUserInfo= (data) => {  
	return postJson(baseUrl+'user/info/update',data)
}

//绑定账号
export const bindAccount= (data) => {  
	return postJson(baseUrl+'user/account/bind',data)
}

//搜索学校
export const schoolsearch= (data) => {  
	return fetch(baseUrl+'school/search',data)
}

 //上传照片
export const postUpload= (data) => {  
	return postJson(baseUrl+'photowall/update',data)
}

 //删除照片
export const deletePhoto= (data) => {  
	return postJson(baseUrl+'photowall/delete',data)
}

//获取设置信息
export const getUserSetting= () => {  
	return fetch(baseUrl+'user/setting/get')
}

 //更新设置信息
export const updateUserSetting= (data) => {  
	return postJson(baseUrl+'user/setting/update',data)
}

//添加用户位置
export const addLocation= (data) => {  
	return postJson(baseUrl+'location/add',data)
}

//获取用户位置
export const getLocationList= () => {  
	return fetch(baseUrl+'location/get')
}

//选择用户位置
export const updateLocation= (data) => {  
	return postJson(baseUrl+'location/update',data)
}

//搜索地理位置
export const getSiteDeatil= (data) => {  
	return fetch('https://apis.map.qq.com/ws/place/v1/suggestion',data)
}

//上传用户当前位置
export const uploadLocation= (data) => {  
	return postJson(baseUrl+'location/upload',data)
}

 //豆瓣 
export const searchDouban= (data) => {  
	return postJson(baseUrl+'hobbies/moviemusicbook/search',data)
}

 //获取用户添加的音乐书籍电影 
export const getMovieMusicBookList= (data) => {  
	return fetch(baseUrl+'hobbies/moviemusicbook/look',data)
} 
 //插入音乐书籍电影 
export const postMovieMusicBook= (data) => {  
	return postJson(baseUrl+'hobbies/moviemusicbook/insert',data)
}
 //删除音乐书籍电影 
export const deleteMovieMusicBook= (data) => {  
	return postJson(baseUrl+'hobbies/moviemusicbook/delete',data)
}

 //查看用户列表 
export const getUserPageList= (data) => {  
	return fetch(baseUrl+'userpage/look',data)
} 

 //操作用户列表 
export const userpageOperation= (data) => {  
	return postJson(baseUrl+'userpage/operation',data)
}

 //回退 
export const userpageBack= () => {  
	return postJson(baseUrl+'userpage/back')
} 

 //置顶 
export const setTopInfo= () => {  
	return postJson(baseUrl+'top/set')
} 

 //置顶信息 
export const fetchTopInfo= () => {  
	return fetch(baseUrl+'top/info')
} 

 //查看用户影音书 
export const lookMoviemusicbook= (data) => {  
	return fetch(baseUrl+'hobbies/moviemusicbook/look',data)
} 

//每日精选列表
export const getDailyselection= (data) => {  
	return fetch(baseUrl+'dailyselection/look',data)
} 

//查看配对列表
export const getPairlist= (data) => {  
	return fetch(baseUrl+'messagepage/pairlist/get',data)
} 

 //评论 
export const postComment= (data) => {  
	return postJson(baseUrl+'messagepage/pairlist/comment',data)
} 

 //取消配对 
export const postCancelPair= (data) => {  
	return postJson(baseUrl+'messagepage/pair/cancel',data)
} 

 //配对/消息列表 
export const getMsglPairList= (data) => {  
	return fetch(baseUrl+'messagepage/list/get',data)
} 

 //特别关注列表
export const getSuperLikeList= (data) => {  
	return fetch(baseUrl+'messagepage/superlike/list/get',data)
}

 //查看喜欢我的人
 export const getLikeMeList= (data) => {  
	return fetch(baseUrl+'messagepage/likelist/get',data)
}

 //分享 （获取用户信息）
export const getShareUserInfo= (data) => {  
	return fetch(baseUrl+'share/userinfo/get',data)
}

 //分享 类型
export const postShareType= (data) => {  
	return postJson(baseUrl+'share/share',data)
}

//  //点击分享链接
// export const postShareBrowse= (data) => {  
// 	return postJson(baseUrl+'share/browse',data)
// }

 //充值
export const postRecharge= (data) => {  
	return postJson(baseUrl+'recharge/recharge',data)
}

 //置顶
export const postSetTop= (data) => {  
	return postJson(baseUrl+'top/set',data)
}
 //发消息
export const postMsgSend= (data) => {  
	return postJson(baseUrl+'userpage/message/send',data)
}

//浏览照片
export const photowallView=(data)=>{
return postJson(baseUrl+'photowall/view',data);
}


/*聊天服务器http:API*/
//通过accId获取用户头像昵称 
export const getUserInfoByAccId= (data) => {  
	return fetch(imHttpUrl+'user/info/get',data)
} 

//通过accId获取用户历史消息
export const getMsgsHistory= (data) => {  
	return fetch(imHttpUrl+'message/history',data)
}

//通过accId获取用户离线消息
export const getMsgOffline= (data) => {  
	return fetch(imHttpUrl+'message/p2p/offline',data)
} 

//清空双方的聊天记录
export const cleanP2pMsg= (data) => {  
	return postJson(imHttpUrl+'message/p2p/clean',data)
} 

//互动通知列表
export const getNoticeList= (data) => {  
	return fetch(baseUrl+'messagepage/notice/list/get',data)
} 

//查看通知
export const lookNoticeMsg= (data) => {  
	return postJson(baseUrl+'messagepage/notice/view',data)
} 

//删除通知
export const deleteNoticeMsg= (data) => {  
	return postJson(baseUrl+'messagepage/notice/delete',data)
} 

//取消特别关注
export const cancelSuperLike= (data) => {  
	return postJson(baseUrl+'messagepage/superlike/cancel',data)
} 

///日志相关接口
//发布日志
export const dispatchTopic=(data)=>{
	return postJson(baseUrl+'community/art/post',data);
}
//搜索话题
export const searchgTopic=(data)=>{
	return fetch(baseUrl+'community/topic/search',data);
}
//最新列表
export const bestNewList=(data)=>{
	return fetch(baseUrl+'community/art/latest',data);
}
//推荐列表
export const recommendList=(data)=>{
	return fetch(baseUrl+'community/art/recommend',data);
}
//关注列表
export const focusList=(data)=>{
	return fetch(baseUrl+'community/art/attention',data);
}
//帖子详情
export const focusArtDetail=(data)=>{
	return fetch(baseUrl+'community/art/info/get',data);
}
//用户主页日志列表
export const fetchUserpageArt=(data)=>{
	return fetch(baseUrl+'community/art/userpage/list',data);
}
//点赞
export const postArtLike=(data)=>{
	return postJson(baseUrl+'community/art/like',data);
}
//获取标签列表页
export const tagList=(data)=>{
	return fetch(baseUrl+'community/art/topic',data);
}
//获取评论列表
export const commentList=(data)=>{
	return fetch(baseUrl+'community/comment/list',data);
}
//发布评论
export const dispatchComment=(data)=>{
	return postJson(baseUrl+'community/comment/public',data);
}

//获取认证资料
export const fetchCaLook=(data)=>{
	return fetch(baseUrl+'ca/look',data);
}

//更新认证
export const updateCaLook=(data)=>{
	return postJson(baseUrl+'ca/update',data);
}

//解密微信公开数据
export const getDecode= (data) => {  
	return fetch(baseUrl+'user/wxopendata/decode',data)
}

//删除日志
export const deletJournal=(data)=>{
	return postJson(baseUrl+'community/art/delete',data);

}

//取消喜欢
export const cancelLike=(data)=>{
	return postJson(baseUrl+'userpage/like/cancel',data);

}

//获取用户在线状态
export const fetchUserOnline= (data) => {  
	return fetch(imHttpUrl+'user/online/get',data)
}

//获取最近联系人在线状态
export const fetchRecentOnline= (data) => {  
	return fetch(imHttpUrl+'contacts/recent/online',data)
}

//获取粉丝列表
export const getFansList=(data)=>{
	return fetch(baseUrl+'user/fanslist/get',data)
}


//获取助力列表
export const getShareList=(data)=>{
	return fetch(baseUrl+'share/list/get',data)
}

//取消喜欢
export const shareSpeed=(data)=>{
	return postJson(baseUrl+'share/speed',data);

}

//获取热门评论
export const getHotCommendList=(data)=>{
	return fetch(baseUrl+'community/comment/hot/list',data)
}
//评论点赞
export const commendThum=(data)=>{
	return postJson(baseUrl+'community/comment/like',data);
}
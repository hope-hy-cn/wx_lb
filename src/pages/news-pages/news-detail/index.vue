
<template> 
  <div class="new-detail"  :style="'padding-top:'+headHeight+'rpx'"> 
    <head-back  @goBack="goBack"  :title="newData.author_name"  background="#fff" color="#4e5761"></head-back>
    <div class="content">
      <div class="newsList">
        <news-list :dataItem="newData" page="detail" @leaveWord="leaveWord" @jumpDetail="jumpDetail" @jumpTopic="jumpTopic"  @isLogin="checkIsLogin"></news-list> 
      </div>
      <div style="height:8rpx;background:#f0f0f0;"></div>
      <div class="commentCont">
        <!-- <div class="commentTitle">全部评论（<i>{{commenedNum}}</i>）</div> -->
        <div class="commentTitle">热门评论</div>
        <div class="listCont" v-if="hotCommendList.length>0">
          <div class="listItem" v-for="(item,index) in hotCommendList" :key="index">
            <div class="leftCont" @click="goToUserDefault(item)"> 
              <img :src="item.head_pic?item.head_pic:'/static/image/user.png'" alt="">
            </div>
            <div class="rightCont">
              <div class="topInfo" @click="goToUserDefault(item)">
                <div class="userName">{{item.nickname?item.nickname:"匿名用户"}}<img style="display:inline-block;width:26rpx;height:24rpx;margin-left:4rpx;" v-if="item.role==2" src="/static/image/vip-cap.png"/><img style="display:inline-block;width:34rpx;height:24rpx;margin-left:4rpx;" v-if="item.role==3" src="/static/image/expert.png"/></div>
                <div class="dispatchTime">{{item.create_time}}</div>
              </div>
              <div class="bottomCont">
                <div class="bottomInfo" @click="replyComment(item)">
                  {{item.content}}
                </div>
                <div class="thumbsBtn" @click="thumb(item,index,'hot')">
                  <img v-if="item.is_like" src="/static/image/good-active.png" alt="">
                  <img v-else src="/static/image/good.png" alt="">
                  <span>{{item.liked_cnt}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="height:28rpx;background:#f0f0f0;"></div>
        <div class="commentTitle" style="padding-top:26rpx;">
          <h1>所有评论</h1>
          <span class="sort" @click="sortFixed">
            <img v-if="commentListInfo.is_time" src="/static/image/sort-top.png" alt="">
            <img v-else src="/static/image/sort-down.png" alt="">
          </span>
        </div>
        <div class="listCont" v-if="commendList.length>0">
          <div class="listItem" v-for="(item,index) in commendList" :key="index">
            <div class="leftCont" @click="goToUserDefault(item)"> 
              <img :src="item.head_pic?item.head_pic:'/static/image/user.png'" alt="">
            </div>
            <div class="rightCont">
              <div class="topInfo" @click="goToUserDefault(item)">
                <div class="userName">{{item.nickname?item.nickname:"匿名用户"}}<img style="display:inline-block;width:26rpx;height:24rpx;margin-left:4rpx;" v-if="item.role==2" src="/static/image/vip-cap.png"/><img style="display:inline-block;width:34rpx;height:24rpx;margin-left:4rpx;" v-if="item.role==3" src="/static/image/expert.png"/></div>
                <div class="dispatchTime">{{item.create_time}}</div>
              </div>
              <div class="bottomCont">
                <div class="bottomInfo" @click="replyComment(item)">
                  <i style="display:block;"><i v-if="item.rnickname" style="display:inline-block;">回复</i><span style="color:#FF5470;display:inline-block;">{{item.rnickname}}</span><i v-if="item.rnickname" style="display:inline-block;">: </i>{{item.content}}</i>
                </div>
                <div class="thumbsBtn" @click="thumb(item,index,'')">
                  <img v-if="item.is_like" src="/static/image/good-active.png" alt="">
                  <img v-else src="/static/image/good.png" alt="">
                  <span>{{item.liked_cnt}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="noData" v-else>
          <img src="/static/image/sofa.png"/>
          <div class="asideWord">暂无评论，快来说两句…</div>
        </div>
      </div>
    </div> 
    <div v-if="commendList.length>0">
      <div class="endBox" v-if="isLoad">{{isEnd?'以上是全部评论':'正在加载更多'}}</div>
    </div>
    <block  v-if="is_login"> 
      <div class="blank"></div>
      <div class="footDispatch" :style="'bottom:'+writeHeight+'px'">
        <input type="text" v-model="currentComment" adjust-position='true' :focus="isFocus" @blur="inputBlur" @focus="inputFocus($event)" placeholder="说两句..." confirm-type="send" show-confirm-bar="false" @confirm="sendComment">
        <div class="anonymousBtn" @click.stop="checkAnoy">
            <label class="checkbox">
                <span class="checkBtn">
                  <img v-if="isAnonymous" src="/static/image/check-btn.png" alt="">
                </span>
                隐姓埋名
            </label>
        </div>
        <div class="dispatchBtn" v-if="currentComment.length>0" @click="sendComment">发布</div>
      </div>
    </block>

    <login-null v-if="modalShow" mode="modal" @close="closeModal"></login-null> 
  </div> 
</template>
<script> 
import * as api from '@/utils/api' ;    
import headBack from '@/components/head-back.vue' ;     
import newsList from '@/components/news-list.vue' ;   
import newsStore from './../../common/news/store' ; 
import loginNull from '@/components/login-null.vue' ;    
const app = getApp();  
export default { 
  onLoad(opt){       
    let vm = this;   
    if(newsStore.state.newsDataItem!={}) {
      vm.newData=newsStore.state.newsDataItem;
    } 
    this.commentListInfo.article_id=this.newData.art_id;
    this.clearListData();
    this.getHotCommendList();
    this.getCommentList();
  },
  onShow(){
    if(wx.getStorageSync('refresh_token')&&wx.getStorageSync('h_token')&&wx.getStorageSync('is_tourist')==2){
      this.is_login=true;  
      this.modalShow=false; 
    } else { 
      this.is_login=false;    
    }
  },
  components:{ 
    headBack,
    newsList,
    loginNull, 
  }, 
  data () {
    return {       
      headHeight:wx.getStorageSync('headHeight'),
      headPadding:wx.getStorageSync('headPadding'),  
      newData:{},//获取详情信息
      commenedNum:0,//评论数量
      hotCommendList:[],//热门评论
      commendList:[],//评论列表
      currentComment:'',//输入的评论
      commentListInfo:{
        is_time:0,
        article_id:null,
        page:1,
        size:10,
        total_page:0,
      },//请求评论列表参数
      isLoad:false,//是否在加载
      isEnd:false,//是否加载了所有评论
      isAnonymous:false,
      isFocus:false,
      writeHeight:0,
      is_login:false,
      modalShow:false,
      dispatchData:{
        is_ranonymous:false,
        ruuid:'',
        comment_id:0,
      },
    }
  },  
  methods: { 
    //评论点赞
    thumb(item,index,isHot){
      let me=this;
      if(!this.is_login){
        this.modalShow=true;
        return;
      }
      if(!item.is_like){
        api.commendThum({
          comment_id:item.comment_id,
          is_like:1,
        }).then(
          (res)=>{
            if(res.data.code==300000){
              let newItem=item;
              newItem.is_like=1;
              newItem.liked_cnt++;
              setTimeout(()=>{
                if(isHot=='hot'){
                  me.hotCommendList.splice(index,1,newItem);
                }else{
                  me.commendList.splice(index,1,newItem);
                }
              },500);
            }
          }
        )
      }else{
        api.commendThum({
          comment_id:item.comment_id,
          is_like:0,
        }).then(
          (res)=>{
            if(res.data.code==300000){
              let newItem=item;
              newItem.is_like=0;
              newItem.liked_cnt--;
              setTimeout(()=>{
                if(isHot=='hot'){
                  me.hotCommendList.splice(index,1,newItem);
                }else{
                  me.commendList.splice(index,1,newItem);
                }
              },500);
            }
          }
        )
      }
    },
    //排序按钮
    sortFixed(){
      this.commentListInfo.is_time==0?this.commentListInfo.is_time=1:this.commentListInfo.is_time=0;
      this.getCommentList('fresh');
    },
    //回复评论
    replyComment(item){
      if(!this.isFocus){
        this.isFocus=true;
      }
      this.dispatchData={
        is_ranonymous:item.is_anonymous,
        ruuid:item.uuid,
        comment_id:item.comment_id,
      };
    },
    //获取热门列表
    getHotCommendList(){
      api.getHotCommendList({
        article_id:this.commentListInfo.article_id,
        size:10,
      }).then(
        (res)=>{
          let resData=res.data.data; 
          if(res.data.code==300000&&resData.data){ 
            this.hotCommendList=[];
            for(let i=0;i<resData.data.length;i++){
              resData.data[i].create_time=this.getDateDiff((resData.data)[i].create_at);
            }
            this.hotCommendList=resData.data.slice(0,10);
          } 
        },
        (err)=>{
          console.log(err);
        }
      )
    },

    //选择或取消隐姓埋名
    checkAnoy(){
        this.isAnonymous=!this.isAnonymous;
        this.isFocus=false;
    },  
    goBack(){   
      //清除数据
      this.clearData();
      newsStore.commit('clearItem');
      wx.navigateBack({ delta: 1 });
    }, 
    //清除所有数据
    clearData(){
      this.newData={};
      this.commenedNum=0;
      this.commendList=[];
      this.currentComment='';
      this.commentListInfo={
        article_id:null,
        page:1,
        size:10,
        total_page:0,
      };
      this.isLoad=false;
      this.isEnd=false;
      this.isAnonymous=false;
      this.dispatchData={
        is_ranonymous:false,
        ruuid:'',
        comment_id:0,
      };
      this.hotCommendList=[];
    },  
    //清除评论列表的数据
    clearListData(){
      this.commendList=[];
      this.commenedNum=0;
      this.commentListInfo.page=1;
      this.commentListInfo.size=10;
      this.commentListInfo.total_page=0;
      this.isLoad=false;
      this.isEnd=false;
      this.isAnonymous=false;
      this.dispatchData={
        is_ranonymous:false,
        ruuid:'',
        comment_id:0,
      };
    },
    //计算虚拟dom的参数
    computeDom(dom){
      return new Promise(function (resolve, reject) {
        var query = wx.createSelectorQuery();
        query.select(dom).boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec((res) => {
          resolve(res[0]);
        });
      });
    },
    //获取评论列表
    getCommentList(fresh){
      if(fresh=='fresh'){
        this.clearListData();
      };
      return api.commentList(this.commentListInfo).then(
        (res)=>{
          let resData=res.data.data; 
          if(res.data.code==300000&&resData.data){ 
            this.commentListInfo.total_page=resData.info.total_page;
            this.commenedNum=resData.info.total;
            newsStore.state.newsDataItem.reply_cnt=this.commenedNum;
            for(let i=0;i<resData.data.length;i++){
              resData.data[i].create_time=this.getDateDiff((resData.data)[i].create_at);
            }
            this.commendList.push(...resData.data);
          } 
        },
        (err)=>{
          console.log(err);
        }
      );
    },
    //发布评论
    dispatchComment(){
      if(this.currentComment.trim()==''){
        wx.showModal({
            title: '提示',
            content: '请输入有效的内容',
            showCancel: false
        });
      }else if(this.currentComment.trim().length>180){
        wx.showModal({
            title: '提示',
            content: '最多输入180个字',
            showCancel: false
        });
      }else{
        return api.dispatchComment({
          ruuid:this.dispatchData.ruuid,
          article_id:this.commentListInfo.article_id,
          content:this.currentComment,
          is_anonymous:this.isAnonymous,
          is_ranonymous:this.dispatchData.is_ranonymous,
          comment_id:this.dispatchData.comment_id,
        }).then(
          ({data})=>{
            if(data.code==300000){
              this.currentComment='';
              // newsStore.state.newsDataItem.reply_cnt++;
              wx.showToast({
                title: '评论成功',
                icon: 'success',
                duration: 1000
              });
              //滚动到评论位置
              this.computeDom('.newsList').then(
                (res)=>{
                  wx.pageScrollTo({
                    scrollTop:res.height
                  })
                }
              );
              // 成功发布评论获取列表
              setTimeout(()=>{
                // this.clearData();
                this.getCommentList('fresh').then(
                  ()=>{
                    this.isLoad=false;
                  }
                );
              },1000);
            }
          },
          (err)=>{
            wx.showToast({
              title: '评论失败',
              icon: 'warn',
              duration: 1000
            })
            console.log(err);
          }
        )
      }
    },
    //发送评论
    sendComment(){
      this.dispatchComment();
    },
    leaveWord(item,str){
      this.dispatchData={
        is_ranonymous:false,
        ruuid:'',
        comment_id:0,
      };
      if(str=='setWords'){
        if(!this.is_login){
          this.modalShow=true;
          return;
        }
        if(!this.isFocus){
          this.isFocus=true;
        }
      } 
    },
    inputBlur(){
      this.isFocus=false;
      this.writeHeight=0;
    },
    inputFocus(e){
      this.isFocus=true;
      // this.writeHeight=e.mp.detail.height;
      this.writeHeight=0;
    },
    //跳转用户资料
    jumpDetail(item){ 
      if(!this.is_login){
        this.modalShow=true;
        return;
      }
      wx.navigateTo({url:`./../../common/user-detail-page/main?ruuid=${item.author_uuid}`});
    },
    goToUserDefault(item){
      if(!this.is_login){
        this.modalShow=true;
        return;
      }
      if(!item.is_anonymous){
        wx.navigateTo({url:`./../../common/user-detail-page/main?ruuid=${item.ruuid}`});
      }
    },
    //用户未登录
    checkIsLogin(){
      this.modalShow=true;
    },
    //跳转标签页
    jumpTopic(item){
      if(!this.is_login){
        this.modalShow=true;
        return;
      }
      wx.navigateTo({url:`./../tag-list/main?topicid=${item.topic_id}&topic=${item.topic}`});
    },
    //关闭登录框
    closeModal(){
      this.modalShow=false;
    },
  },
  //触底事件
  onReachBottom(){
    if(!this.isLoad){
      if(this.commentListInfo.page>=this.commentListInfo.total_page){
        this.isLoad=true;
        this.isEnd=true;
        return
      }else{
        this.isLoad=true;
        this.commentListInfo.page+=1;
        this.getCommentList().then(
          ()=>{
            this.isLoad=false;
          }
        );
      }
    }else{
      return;
    };
  },
  onShareAppMessage: function(res) {  
    let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid; 
    let title = `${this.newData.content}`;
    let imgLink = this.newData.pics?this.newData.pics[0]:'';
    let path = `pages/common/index/main?sharRuuid=${meRuuid}&artId=${this.newData.art_id}&type=news`;   
    return this.onShareAppMessage(title,path,imgLink);
  },  
}
</script> 
 
<style lang="scss" scoped> 

</style>
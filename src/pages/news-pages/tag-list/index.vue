<template>
  <div class="tagListCont">
    <head-back :title="thisTitle" @goBack="goBack"></head-back>
    <scroll-view
      id="pageScroll"
      scroll-y
      @touchstart="touchStart"
      @touchend="touchEnd"
      @scrolltolower="scrolltolower"
      lower-threshold="100"
      :style="'padding-top:'+headHeight+'rpx'"
    >
      <div id="innerScrollCont" :style="'height:'+innerHeight">
        <div class="wait text-center" style="height:100rpx;" v-if="reFresh">
          <span class="refresh-loading"></span>
        </div>
        <news-list v-for="(it,idx) in listArr" :key="idx" :dataItem='it' @jumpDetail="jumpDetail"
                   @leaveWord="leaveWord"></news-list>
        <div style="height:102rpx;width:100%;">
          <div class="wait" style="height:100rpx;" v-if="!reFresh && listArr.length>0 && !isNetErr">
            {{isLoadEnd?"已经到底了":"正在加载更多"}}
          </div>
          <div class="netErr wait" style="height:100rpx;" @click="repeatRequest" v-if="isNetErr">网络错误，点击重试</div>
        </div>
        <!-- <div class="wait" style="height:100rpx;" v-if="!reFresh" @click="nextPage" v-show="listArr.length!=0">{{isLoadEnd?'已经到最后一页了':'下一页'}}</div> -->
        <div class="noDataCont" v-if="listArr.length==0"></div>
      </div>
    </scroll-view>
    <div class="dispatchBtn" @click.stop="releaseDynamics">
      <img src="/static/image/addActive.png"/>
    </div>
  </div>
</template>
<script>
  import headBack from "./../../../components/head-back.vue" ;
  import * as api from "@/utils/api" ;
  import newsList from "./../../../components/news-list.vue" ;
  import newsStore from "./../../common/news/store.js";

  export default {
    data() {
      return {
        headHeight: wx.getStorageSync("headHeight"),
        headPadding: wx.getStorageSync("headPadding"),
        thisTitle: "",//标签标题
        titleId: null,//标签id
        reFresh: false,//是否刷新
        listArr: [],//列表数组
        isLoadEnd: false,//是否加载了所以页面
        winHeight: 0,//可编辑的高度
        screenHeight: 0,//屏幕的高度
        bottomBarHeight: 0,//底部栏的高度
        startClientY: 0,//触摸开始位置
        endClientY: 0,//触摸结束位置
        isLoad: false,//是否允许加载
        pageInfo: {
          page: 1,
          size: 2,
          topic_id: null,
          total: 0
        },
        innerHeight: "auto",
        isNetErr: false//网络是否出错
      };
    },
    components: {
      headBack,
      newsList
    },
    methods: {
      releaseDynamics() {
        wx.navigateTo({ url: "./../my-dispatch-page/main" });
      },
      // 返回
      goBack() {
        wx.navigateBack({ delta: 1 });
      },
      //加载的状态避免锁死
      loadState(num) {
        if (num == 1) {
          this.reFresh = true;
          this.isLoad = false;
          this.isLoadEnd = false;
        } else if (num == 2) {
          this.reFresh = false;
          this.isLoad = true;
          this.isLoadEnd = false;
        } else if (num == 3) {
          this.reFresh = false;
          this.isLoad = true;
          this.isLoadEnd = true;
        } else if (num == 0) {
          this.reFresh = false;
          this.isLoad = false;
          this.isLoadEnd = false;
          this.isNetErr = false;
        }
      },
      //接收列表组件，跳转日志详情
      leaveWord(item) {
        newsStore.commit("setItem", item);
        wx.navigateTo({ url: `./../news-detail/main` });
      },
      //跳转详情
      jumpDetail(item) {
        wx.navigateTo({ url: `./../../common/user-detail-page/main?ruuid=${item.author_uuid}` });
      },
      //滑动开始
      touchStart(e) {
        //获取开始滑动距离屏幕的位置
        this.startClientY = e.clientY;
      },
      // 滑动结束
      touchEnd(e) {
        //获取结束滑动距离屏幕的位置
        this.endClientY = e.mp.changedTouches[0].clientY;
        //上拉刷新条件
        if (e.target.offsetTop < this.winHeight - 40 && (this.endClientY - this.startClientY >= 200)) {
          this.loadState(1);
          this.getList();
        }
      },
      getList() {
        return api.tagList(this.pageInfo).then(
          ({ data }) => {
            if (data.code = 300000) {
              if (this.reFresh) {
                this.innerHeight = "0";
                if (data.data) {
                  this.listArr = [];
                  console.log(data.data);
                  let timer=setTimeout(() => {
                    this.listArr = data.data.data;
                    this.innerHeight = "auto";
                    clearTimeout(timer);
                  }, 200);
                  this.pageInfo.total = data.data.info.total_page;
                  this.loadState(0);
                  if (this.pageInfo.total == this.pageInfo.page) {
                    this.isLoadEnd = true;
                  }
                  ;
                } else {
                  this.innerHeight = "auto";
                  this.loadState(0);
                }
              } else {
                if (data.data) {
                  let timer=setTimeout(() => {
                    this.listArr.push(...data.data.data);
                    this.innerHeight = "auto";
                    clearTimeout(timer);
                  }, 200);
                  this.pageInfo.total = data.data.info.total_page;
                  this.loadState(0);
                  if (this.pageInfo.total == this.pageInfo.page) {
                    this.isLoadEnd = true;
                  }
                  ;
                } else {
                  this.innerHeight = "auto";
                  this.loadState(0);
                }
              }

            } else {
              this.loadState(0);
              this.innerHeight = "auto";
            }
          },
          (err) => {
            this.loadState(0);
            this.innerHeight = "auto";
            console.log(err);
          }
        );
      },
      //下拉加载
      scrolltolower() {
        console.log("到底了");
        if (this.isLoadEnd) {
          return;
        } else {
          if (!this.isLoad) {
            this.isLoad = true;
            if (this.pageInfo.page >= this.pageInfo.total) {
              this.loadState(3);
              return;
            } else {
              this.loadState(2);
              this.pageInfo.page += 1;
              let time_=setTimeout(() => {
                this.getList();
                clearTimeout(time_);
              }, 50);
            }
          }
        }
      },
      repeatRequest() {
        console.log("网络重新请求");
        if (this.isLoadEnd) {
          return;
        } else {
          if (!this.isLoad) {
            this.isLoad = true;
            if (this.pageInfo.page >= this.pageInfo.total) {
              this.loadState(3);
              return;
            } else {
              this.loadState(2);
              this.pageInfo.page += 1;
              let time_=setTimeout(() => {
                this.getList();
                clearTimeout(time_);
              }, 50);
            }
          }
        }
      }
      // nextPage(){
      //     if(this.isLoadEnd){
      //         return
      //     }else{
      //         if(!this.isLoad){
      //             this.isLoad=true;
      //             if(this.pageInfo.page>=this.pageInfo.total){
      //                 this.loadState(3);
      //                 return;
      //             }else{
      //                 this.loadState(2);
      //                 this.pageInfo.page+=1;
      //                 setTimeout(()=>{
      //                     this.getList();
      //                 },50);
      //             }
      //         }
      //     }
      // },

    },
    onLoad(data) {
      console.log(data);
      this.listArr=[];
      this.thisTitle = data.topic;
      this.titleId = data.topicid;
      let vm = this;
      wx.getSystemInfo({
        success: function(res) {
          vm.winHeight = res.windowHeight;
          vm.screenHeight = res.screenHeight;
          vm.bottomBarHeight = vm.screenHeight - vm.winHeight;
        }
      });
      this.pageInfo = {
        page: 1,
        size: 10,
        topic_id: this.titleId,
        total: 0
      };
      this.loadState(1);
      this.getList();
    },
    onShareAppMessage: function(res) {  
      let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid;
      let path = `pages/common/index/main?sharRuuid=${meRuuid}`;  
      return this.onShareAppMessage('',path);
    }, 
  };
</script>
<style lang="scss" scoped>

</style>

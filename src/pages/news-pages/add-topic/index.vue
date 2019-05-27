<template>
  <div class="topicCont">
    <head-back title="添加话题" @goBack="goBack" iconType="close"></head-back>
    <div class="topicBox" :style="'padding-top:'+headHeight+'rpx'">
      <div class="filterWrite">
        <img src="/static/image/hash.png" alt="">
        <input type="text" v-model="searchWords" maxlength="15" placeholder="请输入话题">
      </div>
      <scroll-view
        class="allSearch"
        scroll-y
        @scrolltolower="scrolltolower"
      >
        <div :style="'min-height:'+(headHeight+106)+'rpx'"></div>
        <div class="listItem" v-for="(item,index) in searchList" :key="index" @click="chooseTag(item)"
             v-if="searchList.length>0">
          <img src="/static/image/hash-hover.png" alt="">
          {{item}}
        </div>
        <div style="padding:40rpx;color:#969CA4;font-size:24rpx;" class="text-center" v-if="searchList.length==0">话题为空
        </div>
      </scroll-view>
    </div>
  </div>
</template>
<script>
  import headBack from "./../../../components/head-back.vue" ;
  import * as api from "@/utils/api" ;
  import store from "./../../common/news/store.js";

  export default {
    data() {
      return {
        headHeight: wx.getStorageSync("headHeight"),
        headPadding: wx.getStorageSync("headPadding"),
        searchList: [],//搜索列表
        requestStatus: {
          topic: "",
          size: 15,
          page: 1,
          totalPage: 0
        },//请求的参数
        searchWords: ""
      };
    },
    components: {
      headBack
    },
    watch: {
      searchWords(val) {
        let valStr = this.removeEmoji(val);
        let str_1 = valStr.replace(/\s*/g, "");
        if (str_1.length > 15) {
          wx.showModal({
            title: "提示",
            content: "请输入不超过15个长度的文字",
            showCancel: false
          });
        } else {
          if (str_1) {
            this.searchList = [];
            this.searchList[0] = str_1;
            this.requestStatus = {
              topic: str_1,
              size: 15,
              page: 1,
              totalPage: 0
            };
            this.debounce(this.getCurrentTopicList(this.requestStatus), 1000);
          } else {
            this.searchList = [];
          }
        };
      }
    },
    methods: {
      removeEmoji(content) {
        return content.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
      },
      clearData() {
        this.searchList = [];
        this.requestStatus = {
          topic: "",
          size: 15,
          page: 1,
          totalPage: 0
        };
        this.searchWords = "";
      },
      goBack() {
        //返回并置空标签
        this.clearData();
        setTimeout(() => {
          wx.navigateBack({ delta: 1 });
        }, 300);
      },
      chooseTag(item) {
        ///添加标签并返回
        store.commit("setTag", item);
        this.clearData();
        wx.navigateBack({
          delta: 1
        });
      },
      //防止请求频繁
      debounce(fn, delay) {
        // 维护一个 timer
        let timer = null;
        return function() {
          // 通过 ‘this’ 和 ‘arguments’ 获取函数的作用域和变量
          let context = this;
          let args = arguments;
          clearTimeout(timer);
          timer = setTimeout(function() {
            fn.apply(context, args);
          }, delay);
        };
      },
      getCurrentTopicList(data) {
        const { topic, size, page } = { ...data };
        api.searchgTopic({
          topic,
          size,
          page
        }).then(
          ({ data }) => {
            if (data.code == 300000 && data.data.data) {
              this.searchList.push(...data.data.data);
              this.requestStatus.totalPage = data.data.info.total_page;
            }
            console.log(data);
          },
          (err) => {
            console.log(err);
          }
        );
      },
      //滚动到底部
      scrolltolower() {
        const { page, totalPage } = { ...this.requestStatus };
        if (page >= totalPage) {
          return;
        } else {
          this.requestStatus.page += 1;
          this.getCurrentTopicList(this.requestStatus);
        };
      }
    },
    onShareAppMessage: function(res) {  
      let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid;
      let path = `pages/common/index/main?sharRuuid=${meRuuid}`;  
      return this.onShareAppMessage('',path);
    }, 
  };
</script>
<style lang="scss" scoped>
  .topicCont {
    width: 100%;
    height: 100vh;
    background: #f0f0f0;

    .topicBox {
      width: 100%;
      height: 100%;
      position: relative;

      .filterWrite {
        min-height: 106rpx;
        width: 100%;
        box-sizing: border-box;
        padding: 0 36rpx;
        border-bottom: 1px solid #E1E6EB;
        display: flex;
        align-items: center;
        background: #f0f0f0;
        position: relative;
        z-index: 20;

        img {
          display: block;
          width: 24rpx;
          height: 24rpx;
          margin-right: 24rpx;
        }

        input {
          display: block;
          width: 100%;
          height: 100%;
          font-size: 28rpx;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(53, 64, 82, 1);
          line-height: 106rpx;
        }
      }

      .allSearch {
        width: 100%;
        box-sizing: border-box;
        padding: 0 36rpx;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .listItem {
          width: 100%;
          height: 106rpx;
          line-height: 106rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(128, 136, 146, 1);
          display: flex;
          align-items: center;

          img {
            display: block;
            width: 24rpx;
            height: 24rpx;
            margin-right: 24rpx;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="dispatchCont">
    <head-back title="记录中" @goBack="goBack" iconType="close"></head-back>
    <div class="dispatchBox" :style="'padding-top:'+headHeight+'rpx'">
      <textarea class="textBox" :focus="true" placeholder="发点东西展现下自己吧，TA才能于千万人之中爱上不一样的你！" v-model="textValue"
                adjust-position='true' @focus.stop="getFocusInfo($event)" @blur.stop="setBlur" maxlength="180"
                :style="'min-height:'+textAreaHeight+'px'" :show-confirm-bar="false"/>
      <div class="bottomCont" :style="'bottom:'+writeHeight+'px'" @click.stop="stopClick">
        <div class="uploadList">
          <div class="imgBox" v-for="(item,index) in uploadImgs" :key="index">
            <image class="chooseItem" lazy-load mode="aspectFill" :src="item+'?x-oss-process=image/resize,w_50'"></image>
            <div class="removeImg" @click.stop="deleteUploadItem(index)">
              <img src="/static/image/close.png" alt="">
            </div>
          </div>
        </div>
        <div class="tagCont" v-if="tag.length>0">
          <div class="tagItem">
            <img src="/static/image/hash-hover.png" alt="">
            {{tag}}
            <span @click="removeTag">
                <img src="/static/image/close.png" alt="">
            </span>
          </div>
        </div>
        <div class="dispatchBar">
          <div class="innerBar">
            <div class="chooseImg chooseBtn" @click="chooseImg">
              <img src="/static/image/chooseImg.png" alt=""/>
            </div>
            <div class="chooseTag chooseBtn" @click.stop="canChooseTag">
              <img src="/static/image/chooseTag.png" alt="">
            </div>
            <div class="anonymousBtn" @click="checkAnoy">
              <label class="checkbox">
                <span class="checkBtn">
                    <img v-if="isAnonymous" src="/static/image/check-btn.png" alt="">
                </span>
                隐姓埋名
              </label>
            </div>
          </div>
          <div class="dispatchNow" @click="dispatchNow">发布</div>
        </div>
      </div>
    </div>
    <canvas style="width:500rpx; height:400rpx; position: fixed;left:100000rpx;top:3000000rpx" canvas-id='shareTimelineCanvas'></canvas>
  </div>
</template>
<script>
  import headBack from "./../../../components/head-back.vue" ;
  import * as api from "@/utils/api" ;
  import { baseUrl } from "@/utils/config" ;
  import store from "./../../common/news/store.js";
  const app = getApp();
  export default {
    data(){
      return {
        headHeight: wx.getStorageSync("headHeight"),
        headPadding: wx.getStorageSync("headPadding"),
        textValue: "",
        writeHeight: 0,
        uploadImgs: [],//上传的图片列表
        uploadImgPre: [],//正式上传的数组
        tag: "",
        imgFile: "",//选择的图片文件
        dispatchAllow: true,
        textAreaHeight: "70%",
        isAnonymous: false,
      };
    },
    components: {
      headBack
    },
    methods: {
      //选择或取消隐姓埋名
      checkAnoy() {
        this.isAnonymous = !this.isAnonymous;
      },
      clearData() {
        this.textValue = "";
        this.uploadImgs = [];
        this.uploadImgPre = [];
        this.tag = "";
        this.imgFile = [];
        this.isAnonymous = false;
        store.state.tagName = "";
      },
      goBack() {
        this.clearData();
        setTimeout(() => {
          wx.navigateBack({ delta: 1 });
        }, 300);
      },
      computeDom(dom) {
        return new Promise(function(resolve, reject) {
          var query = wx.createSelectorQuery();
          query.select(dom).boundingClientRect();
          query.selectViewport().scrollOffset();
          query.exec((res) => {
            resolve(res[0]);
          });
        });
      },
      getFocusInfo(e) {
        this.writeHeight = e.mp.detail.height;
        let me = this;
        this.computeDom(".dispatchBox").then(
          (res) => {
            let innerHeight = res.height;
            this.computeDom(".bottomCont").then(
              (data) => {
                this.textAreaHeight = innerHeight - this.writeHeight - data.height - 200;
              }
            );
          }
        );
      },
      setBlur() {
        this.writeHeight = 0;
        let me = this;
        this.computeDom(".dispatchBox").then(
          (res) => {
            let innerHeight = res.height;
            this.computeDom(".bottomCont").then(
              (data) => {
                this.textAreaHeight = innerHeight - data.height - 200;
              }
            );
          }
        );
      },
      stopClick() {
        return;
      },
      canChooseTag() {
        wx.navigateTo({ url: "./../add-topic/main" });
      },
      ///删除标签
      removeTag() {
        setTimeout(() => {
          this.tag = "";
          this.keepAreaHeight();
        }, 200);
      },
      ///删除预备上传的图片
      deleteUploadItem(index) {
        setTimeout(() => {
          this.uploadImgs.splice(index, 1);
          this.keepAreaHeight();
        }, 200);
      },
      ///选择图片文件
      chooseImg() {
        let me = this;
        wx.chooseImage({
          count: 9,
          sizeType: ["compressed",'original'],
          sourceType: ["album", "camera"],
          success(res) {
            const tempFilePaths = res.tempFilePaths;
            if (me.uploadImgs.length == 9) {
              wx.showModal({
                title: "提示",
                content: "最多可选九张图片哦",
                showCancel: false
              });
              return;
            } else {
              let canAddImgNum = 9 - me.uploadImgs.length;
              if (me.uploadImgs.length == 9) {
                wx.showModal({
                  title: "提示",
                  content: "最多可选九张图片哦",
                  showCancel: false
                });
                return;
              } else if (tempFilePaths.length > canAddImgNum) {
                wx.showLoading({
                  title: "上传中",
                  mask: true
                });
                let newArr = tempFilePaths.slice(0, (canAddImgNum));
                for (let i = 0; i < newArr.length; i++) {
                  me.getImgUrl(newArr[i]).then(
                    (data) => {
                      me.uploadImgs.push(data);
                      if(i==newArr.length-1){
                        me.keepAreaHeight();
                        wx.hideLoading();
                      }
                    },
                    (err) => {
                      wx.showModal({
                        title: "提示",
                        content: "上传失败",
                        showCancel: false
                      });
                      wx.hideLoading();
                    }
                  );
                };
              } else {
                wx.showLoading({
                  title: "上传中",
                  mask: true
                });
                let newArr = tempFilePaths;
                for (let i = 0; i < newArr.length; i++) {
                  me.getImgUrl(newArr[i]).then(
                    (data) => {
                      me.uploadImgs.push(data);
                      if(i==newArr.length-1){
                        me.keepAreaHeight();
                        wx.hideLoading();
                      }
                    },
                    (err) => {
                      wx.showModal({
                        title: "提示",
                        content: "上传失败",
                        showCancel: false
                      });
                      wx.hideLoading();
                    }
                  );
                }
              }
            }
          },
          fail(err) {
            wx.showModal({
              title: "提示",
              content: "图片选择失败，请重试",
              showCancel: false
            });
            console.log(err);
          }
        });
      },
      keepAreaHeight() {
        this.computeDom(".dispatchBox").then(
          (res) => {
            let innerHeight = res.height;
            this.computeDom(".bottomCont").then(
              (data) => {
                this.textAreaHeight = innerHeight - data.height - 200;
              }
            );
          }
        );
      },
      getImgUrl(imgLocalUrl) {
        let me = this;
        return new Promise(function(resolve, reject) {
          wx.uploadFile({
            url: `${baseUrl}public/file/wxupload`,
            filePath: imgLocalUrl,
            name: "file",
            header: { "Content-Type": "multipart/form-data" },
            formData: {
              "name": imgLocalUrl.trim(),
              "source": "photo"
            },
            success: function({ data }) {
              app.aldstat.sendEvent("注册：照片上传");
              if (data) {
                resolve(JSON.parse(data).link);
              }
            },
            fail: function(err) {
              wx.showModal({
                title: "提示",
                content: "上传失败,请重新上传",
                showCancel: false
              });
            }
          });
        });
      },
      ///点击发布按钮进行发布
      dispatchNow() {
        if (this.dispatchAllow) {
          this.dispatchAllow = false;
          let me = this;
          //判断发布规则
          if (this.textValue.trim().length < 1 && this.uploadImgs.length < 1) {
            wx.showModal({
              title: "提示",
              content: "请输入你要发布的内容",
              showCancel: false
            });
          } else {
            //发布api
            wx.showLoading({
              title: "发布中",
              mask: true
            });
            const dispatchPromise = new Promise(function(resolve, reject) {
              if (me.uploadImgs.length > 0) {
                me.uploadImgPre = [];
                me.uploadImgPre.push(...me.uploadImgs);
                resolve(me.uploadImgPre);
                // for(let i=0;i<me.uploadImgs.length;i++){
                //     me.getImgUrl(me.uploadImgs[i]).then(
                //         (data)=>{
                //             me.uploadImgPre.push(data);
                //             if(me.uploadImgPre.length==me.uploadImgs.length){

                //             }
                //         }
                //     )
                // }
              } else {
                resolve([]);
              }
            });
            dispatchPromise.then(
              (newArr) => { 
                if(newArr.length>0){
                  let body={
                    topic: me.tag,
                    content: me.textValue,
                    pics: newArr,
                    is_anonymous: me.isAnonymous
                  }; 
                  me.postNewDispatch(body);
                }else{
                  me.draw(me.textValue);
                } 
              }
            );
          }
        } else {
          return;
        }
      },
      draw(contain) { 
        var that = this  
        let drawWord = [] 
        for (let i = 0; i < 7; i++) {
          let k = 16 * i
          let y = 15 + k
          drawWord.push(contain.slice(k, y))
        } 
        var imgWidth = 500
        var imgHight = 400 
        const ctx = wx.createCanvasContext('shareTimelineCanvas') 
        ctx.setFillStyle('rgba(106, 100, 91, 1)') 
        ctx.fillRect(0, 0, imgWidth, imgHight)
        ctx.setFontSize(14) 
        ctx.drawImage("/static/image/art-shareBg.png", 0, 0, 500, 400) 
        for (let i = 0; i < drawWord.length; i++) {
          let k = 32 + 24 * i
          ctx.fillText(drawWord[i], 18, k)
        } 
        ctx.draw(true, setTimeout(function() {
          wx.canvasToTempFilePath({
            width: 500,
            height: 400,
            canvasId: 'shareTimelineCanvas',
            success: function(res) {
              console.log(res.tempFilePath + '最终的图本地地址')
              wx.uploadFile({
                url: `${baseUrl}public/file/wxupload`,
                filePath: res.tempFilePath,
                name: 'file',//这里根据自己的实际情况改
                formData: {
                  'name': 'artShare',
                  'source': 'photo',
                },
                success: (resp) => {
                  let link = JSON.parse(resp.data) 
                  let body={
                    topic: that.tag,
                    content: that.textValue,
                    share_img:link.link,
                    is_anonymous: that.isAnonymous
                  }; 
                  that.postNewDispatch(body);
                },
                fail: (res) => {

                },
              })
            },
            fail: function(res) {
              console.log('绘画失败')
            }
          })
        }, 1000)) 
      },
      postNewDispatch(body){
        let that = this;
        api.dispatchTopic(body).then(
          ({ data }) => {
            if (data.code == 300000) {
              wx.showToast({
                title: "成功发布一条日志",
                icon: "none",
                duration: 2000
              });
              that.clearData();
              setTimeout(() => {
                store.commit("setFresh", true);
                setTimeout(() => {
                  wx.reLaunch({ url: `./../../common/news/main` });
                }, 50);
                that.dispatchAllow = true;
              }, 500);
            } else {
              wx.showToast({
                title: "发布失败，请重试",
                icon: "none",
                duration: 1500
              });
              that.dispatchAllow = true;
            }
            wx.hideLoading();
          },
          (err) => {
            wx.showToast({
              title: "发布失败，请重试",
              icon: "none",
              duration: 1500
            });
            that.dispatchAllow = true;
            wx.hideLoading();
          }
        );
      },
    },
    onShow() {
      //获取标签
      this.tag = store.state.tagName;
      this.keepAreaHeight();
    },
    onShareAppMessage: function(res) {  
      let meRuuid = JSON.parse(wx.getStorageSync('account')).uuid;
      let path = `pages/common/index/main?sharRuuid=${meRuuid}`;  
      return this.onShareAppMessage('',path);
    }, 
  };
</script>


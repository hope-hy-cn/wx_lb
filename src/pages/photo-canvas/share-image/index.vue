<template>
  <div :style="'padding-top:'+headHeight+'rpx;'">
    <!--<div  class="go-back"  @click="goBack" :style="'padding-top:'+headPadding+'rpx;height:'+headHeight+'rpx;'">
      <i-icon type="return" color="#fff" size="25"/>
    </div>-->
    <div id="content">
      <head-back title="图片裁剪"  @goBack="goBack" ></head-back> 
        <mpvue-cropper 
          ref="cropper"
          :option="cropperOpt"
          @ready="cropperReady"
          @beforeDraw="cropperBeforeDraw"
          @beforeImageLoad="cropperBeforeImageLoad"
          @beforeLoad="cropperLoad"
          ></mpvue-cropper>
      </div> 
    <div class="cropper-footer" :style="'height:'+footerHeaht+'px'">
      <div class="cropper-buttons" >  
        <i-button  i-class="sub-btn"  @tap="uploadTap">重新选择</i-button> 
      </div>
      <div class="cropper-buttons" >  
        <i-button  i-class="sub-btn"  @tap="getCropperImage">裁剪</i-button> 
      </div>
    </div>   
  </div>
</template>

<script>
import headBack from '@/components/head-back' 
import * as api from '@/utils/api'
import MpvueCropper from 'mpvue-cropper'
import {baseUrl} from '@/utils/config' 
import userStore from './../../common/index/store' ;   
let wecropper

let device = wx.getSystemInfoSync() 
let jHeight=50; 
if(device.windowHeight>=640&&device.windowHeight<=812){
  jHeight=parseInt(wx.getStorageSync('headHeight')/2)+80; 
}else if(device.windowHeight<=640){
  jHeight=parseInt(wx.getStorageSync('headHeight')/2)+50; 
}else if(device.windowHeight>812){
  jHeight=parseInt(wx.getStorageSync('headHeight')/2)+120; 
}
let width = device.windowWidth;
let height = device.windowHeight-jHeight;  
let cutWidth= device.windowWidth-60;
let cutHeight=((device.windowWidth-60)*6)/4;
// console.log((device.windowWidth-60)*6/4);
export default {
  onLoad(opt){ 
    console.log(opt);
    if(opt){ 
      this.imgUrl=opt.imgUrl;
      if(opt.type==='head'){  
        this.updateBtnTxt='剪切';
        this.photoType='avatar';
        this.cropperWidth();
      }else if(opt.type==='photo'){
        this.updateBtnTxt='上传';
        this.photoType='photo';
        this.serial_num=opt.serial_num; //序号
        console.log('serial_num'+this.serial_num);
        this.cropperWidth();
      }
    } else {
      this.goBack();
    } 
     
  },
  data () {
    return {
      headHeight:wx.getStorageSync('headHeight'), 
      headPadding:wx.getStorageSync('headPadding'), 
      footerHeaht:50,
      photoType:'photo', 
      linkIndex:'',
      imgUrl:'',
      serial_num:'',
      cropperOpt: {
        id: 'cropper',
        width,
        height,
        scale: 2.5,
        zoom: 8,
        cut: {
          x: (width - cutWidth) / 2,
          y: (height - cutHeight) / 2,
          width: cutWidth,
          height: cutHeight
        }
      },
      clickBtnpload:true,
      updateBtnTxt:'剪切',
    }
  }, 
  components: {
    MpvueCropper,
    headBack
  },

  methods: {
    //返回上一级
    goBack(){ 
      wx.navigateBack({ delta: 1 }); 
    }, 
    cropperWidth(){
      cutWidth= device.windowWidth-60;
      cutHeight=((device.windowWidth-60)*6)/5;
      this.cropperOpt.cut={
        x: (width - cutWidth) / 2,
        y: (height - cutHeight) / 2,
        width: cutWidth,
        height: cutHeight
      }
    },
    cropperReady (...args) {
      console.log('cropper ready!')
    },
    cropperBeforeImageLoad (...args) {
      console.log('before image load')
    },
    cropperLoad (...args) {
      console.log('image loaded')
    },
    cropperBeforeDraw (...args) {
      // Todo: 绘制水印等等
    },
    uploadTap () {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
         
          const src = res.tempFilePaths[0]
          //  获取裁剪图片资源后，给data添加src属性及其值 
          wecropper.pushOrigin(src)
        }
      })
    },
    getCropperImage () {
      let vm =this;
      if(vm.clickBtnpload){
        vm.clickBtnpload=false;  //防止连点

        wecropper.getCropperImage().then((src) => {   
          if(vm.photoType=='avatar'){ 
            vm.clickBtnpload=true;
            userStore.state.temporary_link=src;
            wx.navigateBack({ delta: 1 }); 
          } else {
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
                //上传我的相册图片
                wx.hideToast();  //隐藏Toast
                if(vm.photoType=='photo'){ 
                  vm.uploadMyPhoto(JSON.parse(res.data));
                } 
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
            .onProgressUpdate((res) => { 
              wx.showToast({
                  icon: "loading",
                  title:`上传${res.progress}%`
              });
            }); 
          } 
        })
        .catch(e => {
          console.error('获取图片失败')
        })
      }
    },
    uploadMyPhoto(val){
      let vm = this;
      let body={
        "serial_num": parseInt(vm.serial_num),
        "link":val.link
      }; 
      api.postUpload(body).then(res=>{ 
        if(res.data.code==300000){
          wx.hideToast(); //隐藏Toast 
          wx.showToast({ title: '上传成功', icon: 'none' })
          setTimeout(()=>{
            vm.clickBtnpload=true;
            vm.goBack();
          },300);
          vm.fetchInfo();//重新获取用户信息
        }else{
          vm.clickBtnpload=true;
          wx.showModal({
            title: '提示',
            content: '上传失败,请重新上传',
            showCancel: false
          })
        } 
      }).catch(err=>{
        vm.clickBtnpload=true;
      }); 
    },
    //重新获取用户信息
    fetchInfo(){
      let vm = this;
      api.getUserDetail().then(res=>{
        if(res.data.code==300000){
          userStore.state.userInfo=res.data.data; 
        }
      })
    },
  },

  mounted () {
    let vm = this;
    wecropper = this.$refs.cropper
    wecropper.pushOrigin(this.imgUrl)
    const query = wx.createSelectorQuery()
    query.select('#content').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res){
      console.log(res);
      console.log(height+res[0].top);
      vm.footerHeaht=device.windowHeight-(height+res[0].top);
      console.log(vm.footerHeaht);
    })
  }
}
</script>
<style> 
page{
  background:#050505;
}
.cropper-buttons .sub-btn{ 
  height:40px;
  width:300rpx;
  line-height:40px;
  border-radius:40px;
  background:linear-gradient(to  right, #FD7292, #FD5E2C)  !important;
  color:#fff !important;
  margin:0 auto;
}
</style>
<style scoped lang="scss">
.cropper-wrapper{
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    height: 100%;
    width:100%; 
    background-color: rgba(0, 0, 0, 0.8)
}
.go-back{
  // position:fixed;
  // left:30rpx;
  // z-index:50000
  padding-left:10rpx; 
  background:#FF5E66;
}
.cropper{
    position: absolute;
    top: 200rpx;
    left: 0;
} 
.cropper-buttons{ 
    flex:1;
}
 

.cropper-footer{
  display: flex; 
  justify-content: center;
  align-items:center; 
  width:100%; 
  position:fixed;
  bottom:0;
  left:0;
  // height:175rpx;
  // background:#222222;
}
</style>
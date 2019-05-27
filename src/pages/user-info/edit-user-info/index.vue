
<template>
  <div class="edit-user-info" :style="'padding-top:'+headHeight+'rpx'">  
    <head-back title="编辑个人资料" @goBack="goBack"></head-back>
    <div class="info-content" >
      <div class="photo-group">
        <div class="photo-items" v-for="(item,index) in photoArr" :key="item" :style="{'border':item.link?'0rpx':'2rpx dashed #D3D7DC'}" @click="gotoShow(item)">
          <span class="index ">{{item.index}}</span>
          <p class="delete-img text-center"  v-if="item.link" @click.stop="deletePhoto(item)">×</p>
          <p class="add-img  text-center" v-else>＋</p> 
          <image mode="aspectFill" :src="item.link" class="image" v-if="item.link"/>
        </div> 
      </div>
      <div class="smart-group clear-both">
        <span class="title">智能照片</span>
        <p class="float-right"> <switch color="#FF5470"  :checked="switchForm.photo" /></p>
      </div>
      <div class="smart-photo-text">智能系统会一直测试您的所有个人照片，以找到最棒的一张为您推荐</div>
      <div class="input-group">
        <span class="title">关于您</span> 
        <div>
          <textarea maxlength="30" :auto-height="true" :focus="textareaShow" v-model="form.introduce" @blur="inputBlur('introduce')" v-if="textareaShow"/>
          <div class="textarea-div" v-else @click="openText">{{form.introduce}}</div>
        </div>
      </div>
      <div class="input-group group-text" @click="showPicker('industry')">
        <span class="title">选择工作</span>
        <input class="input-item"  disabled v-model="form.industry"  />
      </div>

      <div class="input-group group-text" @click="openSearchSchool">
        <span class="title">选择学校</span>
        <input class="input-item" disabled  v-model="form.school" />
      </div>

      <div class="input-group group-text">
        <span class="title">输入昵称</span>
        <input class="input-item" maxlength="10" v-model="form.nickname" @blur="inputBlur('nickname')"/>
      </div> 

      <div class="input-group group-text" @click="showPicker('birthday')"> 
        <span class="title">选择生日</span>
        <input class="input-item" disabled v-model="form.birthday"  />
      </div> 

      <div class="input-group group-text" @click="bindPhone(form.phone)">
        <span class="title">绑定手机</span>
        <input class="input-item" disabled  v-model="form.phone" />
      </div>

      <!--<div class="input-group group-text"> 
        <span class="title">绑定微信</span>
        <input class="input-item" disabled  v-model="form.we_chat" />
      </div>-->

      <div class="smart-group ">
        <span class="title">管理我的个人资料</span>
        <div class="clear-both smart-item">
          <span class="smart-item-title">显示我的年龄</span>
          <p class="float-right"> <switch color="#FF5470" :checked="switchForm.switchAge" @change="switchAgeChange" /></p>
        </div> 
        <div class="clear-both smart-item">
          <span class="smart-item-title">显示我的距离</span>
          <p class="float-right"> <switch color="#FF5470" :checked="switchForm.switchDistance" @change="switchSiteChange" /></p>
        </div> 
      </div>

      <div class="sub-btn text-center" @click="goBack">保存修改</div>

    </div>
    <date-picker
      id="date-picker"
      :value="datePickerValue" 
      :isShow="datePickerIsShow"
      @sureclick="datePickerOnSureClick"
      @cancelclick="datePickerOnCancelClick" />  
    <city-picker
      id="city-picker"
      :value="cityPickerValue" 
      :isShow="cityPickerIsShow"
      @sureclick="jobPickerOnSureClick"
      @cancelclick="jobPickerOnCancelClick" />

    <!--搜索学校-->
    <div class="search-school" :style="'padding-top:'+headHeight+'rpx;'"  v-if="pageIndex==2">  
      <div class="search-input" :style="'top:'+headHeight+'rpx;'">
        <input class="input-item" @input="searchInput"    placeholder="学校名称"/>
      </div>  
      <div class="search-list">
        <div class="item" v-for="(item,index) in searchShoolArr" :class="{'item-active':selectActive==index}" :key="item" @click="selectItme(item,index)">{{item}}</div>
      </div> 
      <div class="text-center more-search" v-if="!searchShoolArr||searchShoolArr.length==0">暂无数据</div> 
      <div class="text-center more-search" v-if="moreLoading" @click="clickMore">加载更多</div>
    </div>
    <!--配对成功-->
    <div v-if="chargeVipShow">
      <charge-vip 
        :vipType="operationData.vipType" 
        :share="operationData.can_share"  
        :current="operationData.current"
        @close="chargeVipClose"
        @successPay="successPay">
      </charge-vip>
    </div>
  </div>
</template>

<script>
import * as api from '@/utils/api' ; 
import headBack from './../../../components/head-back.vue' ;  
import chargeVip from '@/components/pop-up-box/charge-vip.vue' ;     
import userStore from './../../common/index/store' ;     
const app = getApp()  
export default { 
  onLoad(){    
    app.aldstat.sendEvent('编辑个人资料'); // 事件名称规范: 不超过255个字符 
    this.pageIndex=1;
    this.searchSchoolHeight=parseInt(wx.getStorageSync('systemInfo').windowHeight)*2-this.headHeight;
  },
  onShow: function () {   
    if(userStore.state.userInfo.head_pic){
      this.form=userStore.state.userInfo;
      this.datePickerValue=this.form.birthday.split('-');
      this.dataInfo=this.copyObj(this.form);
      this.switchForm={
        photo:true,
        switchAge:this.form.show_age==1?true:false,
        switchDistance:this.form.show_distance==1?true:false,
      }; 
      this.sortPhoto();
    }else{
      this.fetchInfo();
    }
  }, 
  components:{
    headBack,
    chargeVip
  }, 
  data () {
    return {  
      pageIndex:1, 
      searchSchoolHeight:0,
      headHeight:wx.getStorageSync('headHeight'),
      headPadding:wx.getStorageSync('headPadding'),   
      // 生日 
      datePickerValue: ['', '', ''],
      datePickerIsShow: false, 
      cityPickerValue: [0, 0],
      cityPickerIsShow: false,
      textareaShow:false,
      photoArr:[ 
        {index:1,link:''},
        {index:2,link:''},
        {index:3,link:''},
        {index:4,link:''},
        {index:5,link:''},
        {index:6,link:''}
      ],
      form:{ 
        head_pic:'',
        nickname:'',
        photo:[],  //获取的相册 
        birthday:'',
        industry:'', //行业
        introduce:'',//介绍
        school:'', 
        phone:'',
        we_chat:'', 
        show_age:'',
        show_distance:''
      },
      switchForm:{
        photo:true,
        switchAge:false,
        switchDistance:false,
      },
      //搜索学校
      keyValue:'',
      searchShoolArr:[],
      selectActive:-1,
      moreLoading:false,
      schoolsize:30,
      schoolpage:1,
      schooltotal:0,

      chargeVipShow:false,
      operationData:{
        vipType:0,  //通用 超级喜欢  置顶
        can_share:false, 
        current:0,   
      }, 
    }
  },  
 
  methods: {   
    goBack(){ 
      if(this.pageIndex==2){
        this.pageIndex=1;
      }else{
        wx.navigateBack({ delta: 1 });  
      } 
    }, 
    fetchInfo(){
      let vm = this;
      api.getUserDetail().then(res=>{
        if(res.data.code==300000){
          userStore.state.userInfo=res.data.data;
          vm.form=res.data.data;
          vm.dataInfo=vm.copyObj(vm.form);
          vm.sortPhoto();
        }
      })
    }, 
    //支付成功
    successPay(){
      this.fetchInfo();
      this.chargeVipShow=false;
    },
    // 照片排序
    sortPhoto(){
      let vm = this;  
      vm.photoArr=[ 
        {index:1,link:''},
        {index:2,link:''},
        {index:3,link:''},
        {index:4,link:''},
        {index:5,link:''},
        {index:6,link:''}
      ];
      console.log(vm.form.photo);
      vm.form.photo.forEach((item,index)=>{
        if(item.link){
          vm.photoArr[index].link=item.link;
        } 
      })
    },
    //选择照片
    gotoShow: function(valItme){
      let vm = this;
      let indexNum ='';
      let indexArr = [];
      if(!valItme.link){  
        vm.photoArr.forEach((item,index)=>{
          if(!item.link){ 
            indexArr.push(item.index); 
          }
        })
        if(indexArr.length==0){
          indexNum=valItme.index;
        }else{
          indexNum=indexArr[0];
        }
      }else{
        indexNum=valItme.index;
      } 
      wx.chooseImage({
        count: 1, 
        sizeType: ['original'], // original 原图 
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function(res){ 
          // console.log(res.tempFilePaths[0]);
          wx.navigateTo({url:`./../../photo-canvas/share-image/main?imgUrl=${res.tempFilePaths[0]}&type=photo&serial_num=${indexNum}`}) 
        },
        fail: function() {
          // wx.showModal({
          //     title: '提示',
          //     content: '上传失败,请重新选择',
          //     showCancel: false
          // })
        }
      })
    },
    //删除照片
    deletePhoto(val){
      let vm = this;
      let photoNum=[]; 
      vm.photoArr.forEach((pItem,pIndex)=>{
        if(pItem.link){
          photoNum.push(pIndex);
        }
      })
      if(!(photoNum.length<2)){
        let body={
          link:val.link,
          serial_num:val.index
        };
        api.deletePhoto(body).then(res=>{
          if(res.data.code==300000){
            vm.fetchInfo();
          }
        });
      } else {
        wx.showModal({
            title: '提示',
            content: '一张照片不留，别人怎么刷您呢？',
            showCancel: false
        })
      }
    },
    openText(){
      this.textareaShow=true;
    },
    inputBlur(val){ 
      let vm = this;
      let body={};
      if(val=='nickname'){
        if((this.form.nickname!=this.dataInfo.nickname)&&this.form.nickname){
          body.nickname=this.form.nickname;
        }else{
          body.nickname=userStore.state.userInfo.nickname;
        }
      }else if(val=='introduce'){
        this.textareaShow=false;
        if((this.form.introduce!=this.dataInfo.introduce)&&this.form.introduce){
          body.introduce=this.form.introduce;
        }
      }else if(val=='industry'){
        this.textareaShow=false;
        if((this.form.industry!=this.dataInfo.industry)&&this.form.industry){
          body.industry=this.form.industry;
        }
      }else if(val=='birthday'){
        this.textareaShow=false;
        if((this.form.birthday!=this.dataInfo.birthday)&&this.form.birthday){
          body.birthday=this.form.birthday;
        }
      }else if(val=='school'){
        this.textareaShow=false;
        if((this.form.school!=this.dataInfo.school)&&this.form.school){
          body.school=this.form.school;
        }
      }
      api.updateUserInfo(body).then(res=>{
        if(res.data.code==300000){ 
          // vm.fetchInfo();
          if(body.nickname){
            vm.dataInfo.nickname=body.nickname;
          }else if(body.introduce){
            vm.dataInfo.introduce=body.introduce;
          }else if(body.industry){
            vm.dataInfo.industry=body.industry;
          }else if(body.birthday){
            vm.dataInfo.birthday=body.birthday;
          }else if(body.school){
            vm.dataInfo.school=body.school;
          }
        }
      })
    },
    //生日
    showPicker (val) {
      if(val=='industry'){
        this.cityPickerIsShow= true;
      }else if(val=='birthday'){
        this.datePickerIsShow=true 
      }  
    }, 
    datePickerOnSureClick(e) { 
      this.form.birthday=`${e.mp.detail.value[0]}-${e.mp.detail.value[1]}-${e.mp.detail.value[2]}`;
      this.datePickerValue=e.mp.detail.value;
      this.datePickerIsShow=false; 
      this.inputBlur('birthday');
    }, 
    datePickerOnCancelClick(event) { 
      this.datePickerIsShow=false 
    }, 
      /**
      * 工作选择确认
      */
    jobPickerOnSureClick (e) { 
      this.form.industry= e.mp.detail.valueName[0] + e.mp.detail.valueName[1]; 
      this.cityPickerValue= e.mp.detail.valueCode;
      this.cityPickerIsShow= false; 
      this.inputBlur('industry');
    }, 
    jobPickerOnCancelClick (event) { 
      this.cityPickerIsShow=false;
    },  
    //绑定手机号
    bindPhone(val){
      if(!val) wx.navigateTo({url:`./../../login-page/bind-phone/main?bindType=bind`})  
    },
    //搜索学校
    searchInput(e){ 
      let vm = this;
      if(e){
        vm.keyValue=e.mp.detail.value;
      } 
      api.schoolsearch({school:vm.keyValue,size:vm.schoolsize,page:vm.schoolpage}).then(res=>{
        vm.schooltotal=res.data.data.info.total;
        if(vm.schoolpage<vm.schooltotal){
          vm.moreLoading=true;
        }else{
          vm.moreLoading=false;
        }
        if(res.data.code==300000){
          if(e){
            vm.searchShoolArr=res.data.data.data; 
          }else{
            vm.searchShoolArr=vm.searchShoolArr.concat(res.data.data.data);
          }
        }
      })
    },
    clickMore(){
      this.schoolpage++;
      this.searchInput();
    },
    openSearchSchool(){
      this.pageIndex=2;
      this.searchShoolArr=[];
      this.moreLoading=false;
      this.schoolsize=30;
      this.schoolpage=1; 
    },
    //选择
    selectItme(item,index){
      let vm = this;
      vm.selectActive=index;
      vm.form.school=item; 
      vm.inputBlur('school');
      setTimeout(()=>{ 
        vm.pageIndex=1;
      },300); 
    },
    //显示我的年龄
    switchAgeChange(e){
      if(this.form.is_vip){
        this.switchForm.switchAge=e.mp.detail.value;
      } else {
        this.openVipShow();
      }
    },
    //显示我的距离
    switchSiteChange(e){
      if(this.form.is_vip){
        this.switchForm.switchDistance=e.mp.detail.value;
      } else {
        this.openVipShow();
      }
    },
    //openVipShow
    openVipShow(){
      this.chargeVipShow=true;
      this.operationData.vipType=0; 
      this.operationData.current=5;
      this.operationData.can_share=false; 
    },
    //关闭充值
    chargeVipClose(){
      this.chargeVipShow=false;
    },
  }, 
}
</script> 
<style>
  picker{
    display: block;
    width: 100%;
    font-size: 50rpx;
  }
</style>
<style lang="scss" scoped>
.edit-user-info{
  width:100%;
  height:100%; 
  .info-content{
    width:100%;
    height:100%;
    padding:30rpx 0 150rpx;
    
    // box-sizing:border-box;
    background:#F3F5F7;
    .photo-group{
      display:flex;
      flex-wrap:wrap;
      align-items:center;
      justify-content:center;
      .photo-items{
        width:208rpx;
        height:308rpx;
        margin-left:30rpx;
        margin-bottom: 44rpx;
        background:rgba(225,230,235,1);
        border-radius:10rpx;
        // border:2rpx dashed #D3D7DC;
        position:relative;
        &:nth-child(3n+1){
          margin-left:0;
        }
        .image{
          width:100%;
          height:100%;
          border-radius:10rpx;
        }
        .index{
          position:absolute;
          top:0;
          left:15rpx;
          font-size:48rpx; 
          font-weight:500;
          color:#fff; 
          text-shadow:0rpx 2rpx 4rpx rgba(128,136,146,0.5);
        }
        .add-img,.delete-img{
          position:absolute;
          bottom:-15rpx;
          right:-15rpx;
          width:56rpx;
          height:56rpx;
          line-height:56rpx;
          border-radius:50%;
          font-size:50rpx;
          font-weight:bold;
        }
        .add-img{
          background:linear-gradient(#FF8365, #FF4A70);
          color:#fff;
        }
        .delete-img{
          background:#fff;
          color:#FE685D; 
        }
      } 
    }
    .smart-group{
      margin:20rpx 30rpx 0;
      padding: 30rpx 24rpx 30rpx 38rpx ;
      background:#fff;
      border-radius:10rpx;
      border:1rpx solid #E1E6EB;
      .title{
        font-size:34rpx;
        color:#FF5470; 
        font-weight:400;
      }
      .smart-item{
        margin-top:35rpx;
        .smart-item-title{
          font-size:28rpx; 
          font-weight:400;
          color:#808892;
        } 
      }
       
    }   
    .smart-photo-text{
      font-size:28rpx;
      color:#808892;
      margin:12rpx 70rpx 10rpx 70rpx; 
    }
    .sub-btn{
      margin:40rpx 36rpx 0;
      height:90rpx;
      line-height:90rpx;
      font-size:28rpx;
      font-weight:600;
      background:linear-gradient(to right,#FD7292,#FD5E2C);
      color:#fff;
      border-radius:45rpx;

    }
  }
  .input-group{
    margin:24rpx 30rpx 0;
    padding: 24rpx 24rpx 24rpx 38rpx ;
    background:#fff;
    border-radius:10rpx;
    border:1rpx solid #E1E6EB;
    font-size:28rpx;
    
    .title{
      color:#808892;
      flex:0 0 120rpx;
    }
    .input-item{
      flex:1;
      padding-left:20rpx;
    }
    .textarea-div{ 
      height:auto;
      min-height:50rpx;
      max-height:100rpx; 
      word-wrap:break-word; 
      overflow:auto;
    }
  }
  .group-text{
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .search-school{
    background:#F3F5F7; 
    position:fixed; 
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:200;
    width:100%; 
    height:100%;
    overflow:auto;
    .search-input{
      width:100%;
      height:128rpx; 
      padding-top:30rpx;
      background:#F3F5F7;
      position:fixed; 
      .input-item{
        width:100%;
        height:100%;
        line-height:98rpx;
        background:#fff;
        font-size:28rpx;
        color:#4E5761;
        padding-left:70rpx;
        box-sizing:border-box;
      }
    }
    .search-list{  
      padding-top:128rpx; 
       .item{
         height:98rpx;
         line-height:98rpx;
         padding:0 70rpx;
         color:#808892; 
         font-size:28rpx;
         box-sizing:border-box;
       }
      .item-active{
        background:#fff;
        color:#4E5761;
      } 
    }
    .more-search{
      font-size:24rpx;
      color:#495060;
      padding:40rpx 0;
    }  
  }
}
</style>

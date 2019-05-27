let prex = 0;
let prey = 0;  

const app = getApp() 
let animation = wx.createAnimation({
  duration: 300,
  timingFunction: 'ease-in',
}); 
function getDateHours(){
  var myDate = new Date();//获取系统当前时间 
  return 24-parseInt(myDate.getHours()); //获取当前时间(从1970.1.1开始的毫秒数)
};
let ctime=null;  
let bestStartX='';  //触点的位置
let bestStartY='';  //触点的位置
Component({
  properties: {  
    bestUserList: {
      type: Array,
      value: [],   
    },  
    bestSuperLikeNum:{ 
      type: Number,  
    },
    isLikeRight:{
      type: Boolean,
      value: false,
      observer: function(newVal,oldVal){
        let vm = this;  
        if(newVal){ 
          vm.animation=animation;
          vm.animation.translateX(1000).translateY(0).step(); 
          vm.setData({
            bestAnimationRight:vm.animation.export(), 
          })
        }else{
          let animationNull = wx.createAnimation({
            duration: 50,
            timingFunction: 'ease-in',
          }); 
          vm.animationNull=animationNull;
          vm.animationNull.translateX(0).translateY(0).step(); 
          vm.setData({
            bestAnimationRightNull:vm.animationNull.export(), 
          }) 
        } 
      },
    },  
  },
  // 启用插槽
  options: {
    multipleSlots: true
  },
  data: {  
    pagePadding:136,
    nowDateHours:'', //剩余时间  
    windowWidth:wx.getStorageSync('systemInfo').windowWidth,
    windowHeight:wx.getStorageSync('systemInfo').windowHeight, 
    bestTranslateX:0,  //移动的距离
    bestImgDeg:0,//旋转角度
    bestImgOriginX:0, //圆心
    bestImgOriginY:0,
    bestRuuid:'',
    bestIsShow:'', //是否有遮罩
    animationBack:false,   //归位
    bestSelectLike:0,
    bestSelectSuperLike:0, 
    superLikeTransform:false,  //superLike动画 
    bestitem:{},
    bestHeartActive:false, 
  }, 
  //初始化数据
  attached(){  
    this.setData({
      pagePadding:wx.getStorageSync('headHeight'), 
      // screenHeightHalf:wx.getStorageSync('systemInfo').screenHeight/2, 
      nowDateHours:getDateHours()
    }) 
  },
  created() {  
    
  },
    /**
   * 组件的方法列表
   */
  methods: {  
    //打开详情
    openDetail(){ 
      this.triggerEvent('openDetail');
    }, 
  //   //滑动开始
  //   touchstartBest(e){
  //     console.log(e);
  //     let vm = this;
  //     vm.setData({
  //       bestitem:e.currentTarget.dataset.bestitem
  //     }) 
  //     let bestIsShow= vm.data.bestitem.is_show;
  //     //是否在执行超级喜欢操作 
  //     if(!vm.data.superLikeTransform&&bestIsShow){ 
  //       bestStartX=e.changedTouches[0].pageX,
  //       bestStartY=e.changedTouches[0].pageY,
  //       vm.setData({ 
  //         bestRuuid:vm.data.bestitem.ruuid,
  //         bestIsShow:bestIsShow,
  //       })
  //     }  
  //   },
  //   //屏幕上滑动的时候连续地触发
  //   touchmoveBest(e){   
  //     let moveEndX = e.changedTouches[0].pageX; 
  //     let moveEndY = e.changedTouches[0].pageY;
  //     let dx=(bestStartX-e.changedTouches[0].pageX)*45/this.data.windowWidth/10; 
  //     if(!this.data.superLikeTransform&&this.data.bestIsShow&&bestStartX!=0){
  //       this.setData({
  //         bestTranslateX:-(bestStartX-e.changedTouches[0].pageX),
  //         })  
  // 　　　　 let X = moveEndX - bestStartX;
  // 　　　　 let Y = moveEndY - bestStartY; 
  //         if ( X > 0 ) {
  //         // console.log('right'); 
  //           this.setData({
  //             bestImgDeg:parseFloat(this.data.bestTranslateX/20),
  //             bestImgOriginX:80, 
  //             bestImgOriginY:80,
  //             bestSelectLike:-dx, 
  //           }) 
  //         }else if ( X < 0 ) {
  //         // console.log("left");
  //         this.setData({
  //           bestImgDeg:parseFloat(this.data.bestTranslateX/20),
  //           bestImgOriginX:80, 
  //           bestImgOriginY:0,
  //         }) 
  //       } else{
  //         console.log("just touch"); 
  //       }
  //     }
      
  //   },
  //   //离开的时候
  //   touchendBest(e){
  //     let vm = this; 
  //     let moveEndX = e.changedTouches[0].pageX; 
  //     let moveEndY = e.changedTouches[0].pageY;
  //     let X; 
  //     if(bestStartX!=0){
  //        X= moveEndX - bestStartX; 
  //     }else{
  //       X=0;
  //     }
  //     let maximum=bestStartX-e.changedTouches[0].pageX;
  //     if(maximum>50 || maximum<-50){
  //       if ( X > 0 ) { 
  //         // console.log('right'); 
  //         let eventDetail={
  //           index:1,
  //           ruuid:vm.data.bestRuuid,
  //           super_like:vm.data.super_like,
  //           is_top:vm.data.is_top,
  //         };
  //         vm.triggerEvent('change',eventDetail);  
  //         bestStartX=0;
  //         bestStartY=0;
  //         setTimeout(function(){
  //           vm.setData({   
  //             animationBack:true, //归位
  //             bestTranslateX:0, 
  //             bestImgDeg:0,
  //             bestImgOriginX:0, 
  //             bestImgOriginY:0, 
  //             bestSelectLike:0, 
              
  //           },function(){
  //             setTimeout(function(){
  //               vm.setData({ 
  //                 animationBack:false, 
  //                 bestRuuid:''
  //               }) 
  //             },100)
  //           })
  //         },200) 
  //       } else 
  //       // if ( X < 0 ) {
  //       //   console.log("left"); 
  //       //   vm.triggerEvent('change',1);
  //       // } else
  //       {
  //         bestStartX=0;
  //         bestStartY=0;
  //         vm.setData({  
  //           animationBack:true, //归位
  //           bestTranslateX:0, 
  //           bestImgDeg:0,
  //           bestImgOriginX:0, 
  //           bestImgOriginY:0,  
  //         },function(){
  //           setTimeout(function(){
  //             vm.setData({ 
  //               animationBack:false,
  //               bestSelectLike:0, 
  //             }) 
  //           },100)
  //         })
  //       }
  //     }else{
  //       bestStartX=0;
  //       bestStartY=0;
  //       vm.setData({  
  //         animationBack:true, //归位
  //         bestTranslateX:0, 
  //         bestImgDeg:0,
  //         bestImgOriginX:0, 
  //         bestImgOriginY:0,  
  //       },function(){
  //         setTimeout(function(){
  //           vm.setData({ 
  //             animationBack:false,
  //             bestSelectLike:0, 
  //           }) 
  //         },100)
  //       })
  //     }
      
  //   },
    //超级喜欢
    bestSuperLike(e){
      let vm = this; 
      let superitem = e.currentTarget.dataset.superitem;  
      vm.setData({
        bestHeartActive:true
      })  
      if(!vm.data.superLikeTransform&&superitem.is_show){
        let eventDetail={
          index:3,
          ruuid:superitem.ruuid,
          nickname:superitem.nickname,
          accid:superitem.accid,
          photo:superitem.photo
        };   
        setTimeout(()=>{
          vm.setData({
            bestHeartActive:false
          }) 
        },300) 
        vm.triggerEvent('change',eventDetail);  
        vm.setData({
          superLikeTransform:true,
          bestSelectSuperLike:1,  
        },function(){
          setTimeout(function(){ 
            vm.setData({
              superLikeTransform:false,
              bestSelectSuperLike:0, 
            }) 
          },800)
        })
      } 
    },
    lookDetail(e){
      let bestitem= e.currentTarget.dataset.bestitem; 
      this.setData({
        bestitem:bestitem, 
      }) 
      this.triggerEvent('lookDetail',this.data.bestitem);  
    },
  } 
})

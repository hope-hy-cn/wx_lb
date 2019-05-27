<!--图片懒加载组件样式-->
<template>
  <div :style="{'height':height}">
     <!--<image:mode='mode' :src='defaultImage'  />-->
    <div v-if='!finishLoadFlag'  class="loader-box" :style="[{'width':width ?width:0,'height': height ?height:0},imgStyle]">
      <view class="refresh-loading" ></view>
    </div>
    <image :mode='mode' :class="{'before-load':!finishLoadFlag}"  :src='originalImage' @load="finishLoad" :style="[{'width':finishLoadFlag && width ?width:0,'height':finishLoadFlag && height ?height:0},';'+imgStyle]"/> 
  </div>
</template>

<script>
export default {
  props: {
    //默认图片
    // defaultImage:{
    //   default:'',
    //   type:String
    // },
    //原始图片
    originalImage:{
      default:'',
      type:String
    },
    //width
    width:{
      default:'',
      type:String
    },
    //height
    height:{
      default:'',
      type:String
    },
    //mode
    mode:{
      default:'aspectFill',
      type:String
    },
    imgStyle:{
      default:'',
      type:String
    }
  },
  data(){
    return{
      finishLoadFlag:false,
    }
  },
  methods:{
    finishLoad: function (e) { 
      // console.log(e);
        this.finishLoadFlag= true;
    }
  }
}
</script>

<style scoped lang="scss">
.before-load {
  width: 0;
  height: 0;
  opacity: 0;
}
.loader-box{
  display:flex;
  align-items:center;
  justify-content:center;
  background:#EAEDF3;
}
</style>

<!--搜索组件-->
<template>
  <div class="search-input">
    <div class="input-div">
      <div class="search-icon">
        <i-icon type="search" size="24" color="#91959F"/>
      </div> 
      <input class="input" placeholder-style="color:#91959F;" :placeholder="placeholder" v-model="inputValue"  :focus="true" @confirm="search"/>  
    </div> 
    <div class="text text-center" @click="search">{{text}}</div>  
  </div>
</template>

<script> 
export default {
  props: {
    placeholder:{
      default:'请输入内容',
      type:String
    },
    text:{
      default:'搜索',
      type:String
    },
  },
  data(){
    return{
      inputValue:''
    }
  },
  onShow(){ 
    this.inputValue='';
  },
  methods:{
    search(){
      this.$emit('search',this.inputValue);
    },
  }, 
}
</script>

<style scoped lang="scss">
.search-input{
  height:98rpx;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:12rpx 0 12rpx 28rpx;
  background:#fff;
  .input-div{
    flex:1;
    height:72rpx;
    background:#F0EFF6; 
    padding-left:76rpx;
    font-size:30rpx; 
    position:relative;
    border-radius:36rpx;
    .search-icon{
      position:absolute;
      top:11rpx;
      left:21rpx;
    }
    .input{
      height:100%; 
      padding-right:28rpx;
    }
  } 
  .text{
    flex:0 0 156rpx;
    color:#FF5E66;
    font-size:30rpx;
    padding:20rpx 0;
    &:active{
      opacity:.7;
    }
  }
}
</style>

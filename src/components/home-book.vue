<!--头部样式-->
<template> 
    <div class="prd-group" @click="jumpLink(type)">
        <p class="img-box" :style="'width:'+width">
            <image mode="aspectFill" :src="link+'?x-oss-process=image/resize,w_100'"  class="img"></image>
        </p>
        <p class="info">{{title}}</p>
    </div> 
</template>

<script>
export default {
    props: {
        type:{
            default:'164rpx',
            type:String
        },
        width:{
            default:'164rpx',
            type:String
        },
        title:{
            default:'添加影·音·书',
            type:String
        },
        link:{
            default:'',
            type:String
        },
    },
    data () {
        return {  
             
        }
    },
    methods:{
        jumpLink(type){
            this.$emit('jumpLink',type);
        }, 
    }, 
}
</script>

<style scoped lang="scss">
.prd-group{
    display:inline-block;
    margin-right:24rpx;
    .img-box{ 
        height:164rpx;  
        border-radius:6rpx;
        .img{
            height:100%;
            width:100%;
            border-radius:6rpx;
        }
    }  
    .info{
        width:164rpx;
        color:#808892;
        font-size:22rpx;
        font-weight:400;
        margin-top:14rpx;
        overflow: hidden;/*超出部分隐藏*/
        white-space: nowrap;/*不换行*/
        text-overflow:ellipsis;/*超出部分文字以...显示*/
    }
}
</style>

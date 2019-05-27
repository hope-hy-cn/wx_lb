<!--影 音 书列表页样式-->
<template>
    <div class="books-card" @longpress="clearCard(item)">
        <div class="img-box" :style="{'height':height,'flex':flex}">  
            <image-loader :original-image="url+'?x-oss-process=image/resize,w_100'" width="100%" height="100%" imgStyle="border-radius:6rpx;"></image-loader>
        </div>
        <div class="card-content">
            <div class="title">{{title}}</div>
            <div class="text-main text">{{textMain}}</div>
            <div class="text-info text">{{textInfo}}</div>
        </div>
        <div class="add-icon" v-if="icon" @click.stop="handleClick(item)">
            <i-icon type="add" color="#E0DFE7" size="40"/> 
        </div>
    </div> 
</template>

<script>
import imageLoader from './image-loader.vue'
export default {
    props: {
        icon:{
            default:false,
            type:Boolean
        }, 
        height:{
            default:'160rpx',
            type:String
        }, 
        flex:{
            default:'0 0 114rpx',
            type:String
        },
        url:{
            default:'',
            type:String
        },
        title:{
            default:'标题',
            type:String
        }, 
        textMain:{
            default:'',
            type:String
        }, 
        textInfo:{
            default:'',
            type:String
        },
        item:{
            default:{},
            type:Object
        } 
    },
    components: {
        imageLoader
    },
    data(){
        return { 

        }
    }, 
    methods:{
        clearCard(val){ 
           this.$emit('clear',val); 
        },
        handleClick(val){ 
            this.$emit('addList',val);
        }
    }
}
</script>

<style scoped lang="scss">
.books-card{
    display:flex;
    align-items:center;
    justify-content:center;
    padding:16rpx;
    background:#fff;
    margin-bottom:20rpx;
    border-radius:10rpx;
    .img-box{ 
        margin-right:14rpx; 
    }
    .card-content{
        flex:1;
        padding:0 10rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:1;
        -webkit-box-orient: vertical;
        div{
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp:1;
            -webkit-box-orient: vertical;
        }
        .title{
            font-size:30rpx;
            color:#1D2438; 
            margin-bottom:15rpx;
        }
        .text{
            color:#BBBEC2;
            font-size:22rpx;
        }
    }
    .add-icon{
        flex:0 0 100rpx;
        height:100%;
        padding:20rpx 0;
        &:active{
            opacity:.8;
        }
    }
}

</style>

<!--头部样式-->
<template> 
    <div>
        <div class="head-back" :class="{'head-border':background!='transprent'}" @click="goBack"  :style="'height:'+headHeight+'rpx;padding-top:'+headPadding+'rpx;background:'+background+';position:'+position+';top:'+headTop" v-if="mode=='head'"> 
            <i-icon :type="iconType" size="25" :color="color"  v-if="iconShow"/>
            <span  class="back-item" :style="'color:'+color" :class="{'pad-left':!iconShow}">{{title}}</span> 
        </div> 
        <div class="head-back" :class="{'head-border':background!='transprent'}" :style="'height:'+headHeight+'rpx;padding-top:'+headPadding+'rpx;background:'+background+';position:'+position+';top:'+headTop" v-if="mode=='tabs'">
            <p class="tabs-item" :class="{'tabs-item-active':currentTab==index}" v-for="(item,index) in tabsList" :key="item" @click.stop="clickTab(item,index)">
                <span class="tabs-text">{{item.name}}</span>
                <span class="tabs-border"></span>  
            </p>  
        </div> 
    </div>
</template>

<script>
export default {
    props: {
        mode:{
            default:'head',
            type:String
        },
        title:{
            default:'',
            type:String
        },
        color:{
            default:'#1D2438',
            type:String
        },
        iconShow:{
            default:true
        },
        background:{
            default:'#fff',
            type:String
        },
        position:{
            default:'fixed',
            type:String
        },
        headTop:{
            default:'0',
            type:String
        },
        //tabs
        tabsList:{
            default:[{name:'tabs'}],
            type:Array 
        },
        currentTab:{
            default:0,
            type:Number
        },
        iconType:{
            default:"return",
            type:String
        }
    },
    data () {
        return {  
            headHeight:wx.getStorageSync('headHeight'),
            headPadding:wx.getStorageSync('headPadding')
        }
    },
    methods:{
        goBack(){
            this.$emit('goBack');
        },
        clickTab(item,index){ 
            this.currentTab=index;
            this.$emit('clickTab',item,index);
        },
        tabChange(item,index){
            this.currentTab=index;
            this.$emit('tabChange',item,index);
        }
    }, 
}
</script>

<style scoped lang="scss">
.head-border{
    box-shadow:0px 0px 1px 0px rgba(0,0,0,0.1);
}
.head-back{ 
    z-index:5000;
    width:100%;
    padding-left:10rpx;  
    .back-item{ 
        font-size:40rpx;
        margin-left:6rpx;
        vertical-align:middle;
        font-family: PingFangSC-Regular, sans-serif;
        font-weight:400;
    } 
    .pad-left{
        padding-left:20rpx;
    }
    .tabs-item{
        display:inline-block; 
        padding:0 20rpx 20rpx; 
        &:first-child{
            margin-left:20rpx;
        }
        .tabs-text{
            font-size:30rpx;
            font-family: PingFangSC-Regular, sans-serif;
            font-weight:400;
            color:rgba(78,87,97,1); 
        }  
    }
    .tabs-item-active{
        .tabs-text{
            font-size:40rpx; 
        }
        .tabs-border{
            display:block;
            width:36rpx;
            height:8rpx;
            background:#FF5470;
            border-radius:4rpx;
            margin:6rpx auto 0;
        }
    }
}
</style>

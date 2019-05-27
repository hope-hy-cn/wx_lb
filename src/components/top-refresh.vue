<!--活动列表样式-->
<template>
    <div  class="refresh-container" :style="'height:'+dynamicHeight+'rpx;background-color:'+backgroundColor" >
        <div class="refresh-layout" :style="'line-height:'+refreshHeight+'rpx;height:'+refreshHeight+'rpx;'">
            <div class="refresh-loading" v-if="0==pullState"></div>
            <text class="refresh-tips">{{pullState==1?'下拉刷新...':pullState==0?'':'松开刷新...'}}</text>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        dynamicHeight: {
            default: 0
        },
        backgroundColor: {
            type: String,
            default: ''
        },
        refreshHeight: {
            type: 0,
        },
        pullState: {
            type: String,
            default: ''
        },
    },
    data() {
   
    },
    methods: {

    },
}
</script>

<style  lang="scss">
.refresh-container {
    z-index: 999;
    box-sizing: border-box;
    font-size: 28rpx;
    color: #999;
    background-color: #FFFFFF;
    display: flex;
    width: 100%;
}

.refresh-layout {
    vertical-align: center;
    width: 100%;
    text-align: center;
    align-self: flex-end;
}

.refresh-tips {
    line-height: 30rpx;
    font-size: 26rpx;
    vertical-align: middle;
    margin: auto;
}
</style>

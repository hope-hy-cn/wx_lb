<script> 
export default {
  created () { 
    //获得顶部高度
    let vm = this;  
    wx.getSystemInfo({
      success: function(res) {  
        wx.setStorageSync('systemInfo', res);
        let headHeight=res.statusBarHeight*2+96 || 136; 
        let headPadding=res.statusBarHeight*2+25 || 60; 
        wx.setStorageSync('headHeight', headHeight);
        wx.setStorageSync('headPadding', headPadding);
      }
    });

    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // console.log('app created and cache logs by setStorageSync')
 
  }
}
</script>

<style> 
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>

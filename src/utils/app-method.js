const app = getApp();

//滑动渐入渐出
app.slideupshow=function(that,param,px,opacity){
    var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease',
    });
    animation.translateY(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export() 
    //设置动画
    that.setData(json)
} 
let app=getApp();
app.globalData.userStore={
    firstEntry:false,  //是否是注册用户进入小程序
    //用户填写基本信息的store
    wxUserInfo:null,
    loginForm:{
      phone:'',
      nickname:'',
      sex:'',
      birthday:'',
      head_pic_link:'', //头像 
    },
    temporary_link:'',
};    
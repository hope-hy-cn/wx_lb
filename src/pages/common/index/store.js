// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {  
    is_edit_data:false,   //用户是否编辑了资料
    userInfo:{ 
        address:'',
        age:'',
        head_pic:'',
        nickname:'',
        location:{lat:null,lng:null}, 
        sex:'',
        we_chat:false,
        photo:[],  //获取的相册 
        birthday:'',
        industry:'', //行业
        introduce:'',//介绍
        school:'', 
    },
    location:{
      longitude:30.654648,
      latitude:104.065699,
    },
    //设置用户信息
    setForm:{
      age_range:'',//年龄范围
      max_distance:'',//最大距离
      recommand_sex:null,//需求性别 1.男 2.女 3.不限
      best_choice:null,//最佳精选 1.开启 2.关闭
    }, 
    currentList:{},
    msgJumpTab:0,
  } 
})

export default store

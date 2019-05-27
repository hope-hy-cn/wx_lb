// import { MpvuePage } from '../static/sdk/ald-stat' 
import './../static/sdk/ald-stat' 
import Vue from 'vue'
import App from './App'
import './theme/base.scss'
  
/*method*/
import pluginMethod from './utils/method'

Vue.use(pluginMethod)

Vue.config.productionTip = false
App.mpType = 'app' 
// const app = new Vue( MpvuePage(App) ) 
const app = new Vue(App ) 
app.$mount()

// {
//     "text": "活动",
//     "pagePath": "pages/common/activity/main",
//     "iconPath": "static/images/activity.png",
//     "selectedIconPath": "static/images/activity-active.png"
// }, 
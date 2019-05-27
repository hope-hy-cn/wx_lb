
const Fly = require("flyio/dist/npm/wx")
const flyhttp = new Fly()
const newFly = new Fly()
import { baseUrl } from './config'
flyhttp.config.baseURL = baseUrl;
/* @desc:不拦截的请求名 */
const unInterceptorUrl = ['wxserver/connect', 'user/login','smsvcode/send','user/register','photowall/update','photowall/delete','info/get','info/update','account/bind','school/search','setting/get','setting/update','location/add','location/get','location/update','location/upload','moviemusicbook/search','moviemusicbook/look','moviemusicbook/insert','moviemusicbook/delete','userpage/look','userpage/operation','dailyselection/look','moviemusicbook/look','pairlist/get','pairlist/comment','pair/cancel','list/get','likelist/get','message/history','p2p/offline','userpage/back','top/set','top/info','userinfo/get','share/share','share/browse','recharge/recharge','top/set','art/post','topic/search','userpage/list','art/like','art/latest','art/recommend','art/attention','photowall/view','online/get','p2p/clean','share/speed','recent/online']

//不弹loading的请求名
const unLoadingUrl = ['wxserver/connect', 'user/login','smsvcode/send','user/register','photowall/update','photowall/delete','info/get','info/update','account/bind','school/search','setting/get','setting/update','location/add','location/get','location/update','location/upload','moviemusicbook/search','moviemusicbook/look','moviemusicbook/insert','moviemusicbook/delete','userpage/look','userpage/operation','dailyselection/look','moviemusicbook/look','pairlist/get','pairlist/comment','pair/cancel','list/get','likelist/get','message/history','p2p/offline','userpage/back','top/set','top/info','userinfo/get','share/share','share/browse','recharge/recharge','top/set','art/post','topic/search','userpage/list','art/like','art/latest','art/recommend','art/attention','photowall/view','online/get','p2p/clean','share/speed','recent/online']

/* @desc:检测请求名是否需要拦截 */
function checkUrl(resp) {
    let arr = resp.split('?')[0].split('/'), flag = true
    unInterceptorUrl.forEach(item => {
        if (item === arr[arr.length - 2] + '/' + arr[arr.length - 1]) {
            flag = false
        }
    })
    return flag
}

/* @desc:检测不弹loading的请求名*/
function checkLoadUrl(resp) {
    let arr = resp.url.split('/'), flag = true
    unLoadingUrl.forEach(item => {
        if (item === arr[arr.length - 2] + '/' + arr[arr.length - 1]) {
            flag = false
        }
    })
    return flag
}

flyhttp.interceptors.request.use((request) => {
    if (checkLoadUrl(request)) {
        // wx.showLoading({ title: '拼命加载中...' })
    }
    return request
})
let clickIndex = 0;
flyhttp.interceptors.response.use(function (response) {
    wx.hideLoading();
    if (response.data.code === 400001) {
        this.lock();
        return newFly.get(`${baseUrl}user/token/refresh`, '', { headers: { refresh_token: wx.getStorageSync('refresh_token') } })
            .then(res => {
                if (res.data.code == 300000) {
                    wx.setStorageSync('h_token', res.data.data.token);
                    clickIndex++;
                    this.unlock();
                    response.request.headers.token = res.data.data.token;
                    return flyhttp.request(response.request);
                }
            })
    } else if (response.data.code != 300000 && checkUrl(response.engine.responseURL)) {
        wx.showToast({
            title: response.data.err,
            icon: 'none'
        })
        return response
    }
})
export default flyhttp

import flyhttp from './httpInterceptors' 
import { baseUrl }  from  './config' 
import { appApiKey }  from  './config' 

const regUrl=(val)=>{
    let arr =val.split('/')
    return arr[arr.length-1]
};
export const postJson =(url,data={}) => {
    return new Promise((resolve,reject) => { 
        flyhttp.post(url,data,{headers:{token:wx.getStorageSync('h_token'),app_key:appApiKey},timeout:20000})
        .then(res=>{  
            resolve(res); 
        }).catch(err=>{ 
            // console.log(err);
            if(err.status==500||err.status==404){
                wx.showToast({icon:'none',title:'服务器错误！'}) 
            } 
            reject(err);
        })   
    })
}

 
export const fetch =(url,data={}) => { 
    return new Promise((resolve,reject)=>{ 
        wx.getNetworkType({
            success: function(res) {
               if (res.networkType != 'none'){
                    flyhttp.get(url,data,{headers:{token:wx.getStorageSync('h_token'),app_key:appApiKey},timeout:20000})
                        .then(res=>{ 
                            resolve(res); 
                        }).catch(err=>{ 
                            // console.log(err);
                            if(err.status==500||err.status==404){
                                wx.showToast({icon:'none',title:'服务器错误！'})
                            } 
                            reject(err);
                        })
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '当前无网络信息，请重新连接网络',
                        showCancel: false
                    })
                }
            }
        })  
           
    })
}

export const fetchNullToken =(url,data={}) => { 
    return new Promise((resolve,reject)=>{ 
        wx.getNetworkType({
            success: function(res) {
               if (res.networkType != 'none'){
                    flyhttp.get(url,data)
                        .then(res=>{ 
                            resolve(res); 
                        }).catch(err=>{ 
                            // console.log(err);
                            if(err.status==500||err.status==404){
                                wx.showToast({icon:'none',title:'服务器错误！'})
                            } else if(err.status==401){
                                getToken();
                            } 
                            reject(err);
                        })
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '当前无网络信息，请重新连接网络',
                        showCancel: false
                    })
                }
            }
        }) 
    })
}
 


export default {
	install(Vue) {
		//去掉字符串空格 
		//  Vue.prototype.Trim=(str,is_global)=>{
		// 	var  result;
		//     result = str.replace(/(^\s+)|(\s+$)/g,"");
		//     if(is_global.toLowerCase()=="g"){
		//        result = result.replace(/\s/g,"");
		//      }
		//      return result;
		// } 
		//计算年龄
		Vue.prototype.ages = (str) => {
			var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
			if (r == null) { return false };
			var d = new Date(r[1], r[3] - 1, r[4]);
			if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
				var Y = new Date().getFullYear();
				return Y - r[1];
			}
		}
		Vue.prototype.copyObj = (obj) => {
			var newobj = {};
			for (var attr in obj) {
				newobj[attr] = obj[attr];
			}
			return newobj;
		}
		Vue.prototype.isEmptyObject = (obj) => {
			for (var key in obj) {
				return false
			};
			return true
		}
		Vue.prototype.methodColor = (obj) => {
			var R = Math.floor(Math.random() * 255);
			var G = Math.floor(Math.random() * 255);
			var B = Math.floor(Math.random() * 255);
			return 'rgba(' + R + ',' + G + ',' + B + ',.8)';
		}
		Vue.prototype.onShareAppMessage = (title, path, imageUrl, callback) => {
			let app =getApp();
			 app.aldstat.sendEvent('分享');
			//设置一个默认分享背景图片
			let defaultImageUrl = 'http://img.juimg.com/tuku/yulantu/140218/330598-14021R23A410.jpg';
			let defaultPath = 'pages/common/index/main';
			let defaultTitle = '萝卜交友——萝卜青菜各有所爱。来这里找个对的人，开启你们的猿粪之旅！';
			console.log('path=',path);
			return {
				title: title || defaultTitle,
				path: path || defaultPath,
				imageUrl: imageUrl || defaultImageUrl,
				success(res) {
					// console.log(res);
					// console.log("转发成功！");
					if (!res.shareTickets) {
						//分享到个人
						callback && callback(res);
					} else {
						//分享到群
						let st = res.shareTickets[0];
						wx.getShareInfo({
							shareTicket: st,
							success(res) {
								callback && callback(res);
							}
						});
					}
				},
				fail: function (res) {
					console.log("转发失败！");
					reject(err);
				}
			}
		}

		Vue.prototype.getDateDiff = (obj,type) => { 
			if(obj){
				var dateTimeStamp =null;
				if(type=='getTime'){
					dateTimeStamp=obj;
				}else{
					dateTimeStamp= Date.parse(obj.replace(/-/g,'/'));
				} 
				var result = ''
				var second = 1000;
				var minute = 1000 * 60;
				var hour = minute * 60;
				var day = hour * 24;
				var halfamonth = day * 15;
				var month = day * 30;
				var now = new Date().getTime();
				var diffValue = now - dateTimeStamp;
				if (diffValue < 0) {
					return "刚刚";
				}
				var secondC = diffValue / second;
				var monthC = diffValue / month;
				var weekC = diffValue / (7 * day);
				var dayC = diffValue / day;
				var hourC = diffValue / hour;
				var minC = diffValue / minute;
				if (dayC >= 1) {
					
					if(type=='getTime'){
						var date = new Date(obj);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
						var Y = date.getFullYear() + '-';
						var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
						var D = date.getDate() + 1 < 10 ? '0'+ date.getDate() + ' ' : date.getDate() + ' ';
						result = Y+M+D;
					}else{
						result = obj;
					}
				} else if (hourC >= 1) {
					result = "" + parseInt(hourC) + "小时前";
				} else if (minC >= 1) {
					result = "" + parseInt(minC) + "分钟前";
				} else if (secondC >= 1) {
					result = "" + parseInt(secondC) + "秒前";
				} else {
					result = "刚刚";
				} 
				return result;
			}else{
				return ''
			}
            
		}

		Vue.prototype.getDate = (timestamp) => {
			var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
			var D = date.getDate() + 1 < 10 ? '0'+ date.getDate() + ' ' : date.getDate() + ' ';
			var h = date.getHours() + 1 < 10 ? '0'+ date.getHours() + ':' : date.getHours() + ':';
			var m = date.getMinutes() + 1 < 10 ? '0'+ date.getMinutes() + ':' : date.getMinutes() + ':';
			var s = date.getSeconds() +1 < 10 ? '0'+date.getSeconds() : date.getSeconds();
			return Y+M+D+h+m+s;
		}
		Vue.prototype.secondToDate = (val)=>{ 
			var h = Math.floor(val / 3600),
				m = Math.floor((val / 60 % 60)),
				s = Math.floor((val % 60)); 
			let result = ""+parseInt(s)+"秒"; 
			if(m > 0) { 
				result = ""+parseInt(m)+"分"+result; 
			} 
			if(h > 0) { 
				result = ""+parseInt(h)+"小时"+result; 
			} 
			return result; 
		}
		

	  	Vue.prototype.getYMD = (timestamp) => {
			var dateTimeStamp = Date.parse(timestamp.replace(/-/g,'/'))
			var date = new Date(dateTimeStamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
			
			var Y = parseInt(date.getFullYear())
			var M = parseInt(date.getMonth())
			var D = parseInt(date.getDate())
			console.log("年月日",timestamp,typeof(timestamp),date,Number(Y),typeof(Y),M,typeof(M),D,typeof(D))
			return Y+'年'+M+'月'+D+'日'
		}


		Vue.prototype.previewImage = (obj) => {
			//预览图片
			wx.previewImage({
				current: obj,
				urls: [obj],
			});
		}

		Vue.prototype.setTabBarBadge = (val,index) => {
			 if(val>0){
				wx.setTabBarBadge({
					index: index,
					text: String(val)
				})
			}else{
				wx.removeTabBarBadge({
					index: index
				})
			}
		}

		//滑动渐入渐出
		Vue.prototype.slideupshow = (px,opacity) => {
			let animation = wx.createAnimation({
				duration: 800,
				timingFunction: 'ease',
			});
			animation.translateY(px).opacity(opacity).step()
			//将param转换为key
			return animation.export()  
		}
		//向右滑动渐入渐出
		Vue.prototype.sliderightshow = (px,opacity) => {
			let animation = wx.createAnimation({
				duration: 800,
				timingFunction: 'ease',
			});
			animation.translateX(px).opacity(opacity).step()
			//将param转换为key
			return animation.export()  
		}
	}
} 
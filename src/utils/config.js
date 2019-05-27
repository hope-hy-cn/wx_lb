/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * ImgPath: 图片存放地址
 *
 */
 
 // let baseUrl = 'https://qbt.ximigame.net/';
	// let baseUrl = 'http://192.168.6.23:8111/';//杨帆 
	// let baseUrl = 'http://192.168.7.61:8111/'; 
	// let baseUrl = 'http://192.168.6.76:8111/';//曾龙科
  // let wsUrl   =  'ws://192.168.6.130:8800/ws';  //长连接地址 
  // let imHttpUrl   = 'http://192.168.6.130:8100/'; //聊天服务器http接口
  // let wsUrl   =  'ws://192.168.7.164:8800/ws';  //长连接地址
  // let baseUrl = 'http://192.168.6.91:8111/';//李金龙

  //   /**萝卜**/ 
	  let baseUrl =  'https://qbt-test.ximigame.net:8111/';  //萝卜测试
    let wsUrl   =  'wss://qbt-test.ximigame.net:8800/wss';  //萝卜长连接地址
    let imHttpUrl   =  'https://qbt-test.ximigame.net:8100/'; //萝卜聊天服务器http接口
	  let appApiKey = "aa5d016fcee1d2f9e5c8c136704a56147f2d7ae9";  //聊天appkey

    // /**萝卜交友正式 **/
    // let baseUrl =  'https://go-love.ximigame.net/';  //萝卜测试
    // let wsUrl   =  'wss://go-im.ximigame.net/wss';  //萝卜长连接地址  
    // let imHttpUrl   =  'https://go-api.ximigame.net/'; //萝卜聊天服务器http接口
    // let appApiKey = "aa5d016fcee1d2f9e5c8c136704a56147f2d7ae9";  //聊天appkey

    /**秒脱**/
    // let wsUrl   =  'wss://qbt-test.ximigame.net:6800/wss';  //秒脱长连接地址
    // let baseUrl =  "https://qbt-test.ximigame.net:6111/"; //秒脱正式服 
	// let imHttpUrl   =  'https://qbt-test.ximigame.net:6100/'; //秒脱聊天服务器http接口
    // let appApiKey = "d7b7fb3b9ae01043a902f29726726bf4367e1dac";  //聊天appkey

    let mapKey = "7KSBZ-HNBWX-DJK4W-ZDOBO-JIJGZ-PQFEQ";  //mapKey
let emjList = {
  "[亲亲]": "emoji_25.png",
  "[发呆]": "emoji_17.png",
  "[口罩]": "emoji_27.png",
  "[可怕]": "emoji_15.png",
  "[呆滞]": "emoji_13.png",
  "[呲牙]": "emoji_19.png",
  "[咧嘴笑]": "emoji_20.png",
  "[哭]": "emoji_10.png",
  "[困]": "emoji_34.png",
  "[坚忍]": "emoji_31.png",
  "[外星人]": "emoji_2.png",
  "[大哭]": "emoji_36.png",
  "[大眼睛]": "emoji_14.png",
  "[大笑]": "emoji_26.png",
  "[天真]": "emoji_23.png",
  "[失望]": "emoji_11.png",
  "[头晕]": "emoji_12.png",
  "[安静]": "emoji_22.png",
  "[建筑师]": "emoji_9.png",
  "[张嘴]": "emoji_29.png",
  "[弱]": "emoji_1.png",
  "[强]": "emoji_0.png",
  "[得意]": "emoji_38.png",
  "[心]": "emoji_44.png",
  "[心碎]": "emoji_8.png",
  "[思考]": "emoji_30.png",
  "[恐惧]": "emoji_32.png",
  "[惊讶]": "emoji_5.png",
  "[汗]": "emoji_39.png",
  "[火]": "emoji_16.png",
  "[甜笑]": "emoji_40.png",
  "[生气]": "emoji_3.png",
  "[眨眼]": "emoji_42.png",
  "[睡觉]": "emoji_33.png",
  "[笑哭]": "emoji_24.png",
  "[美味]": "emoji_43.png",
  "[脸红]": "emoji_6.png",
  "[自然]": "emoji_28.png",
  "[色]": "emoji_21.png",
  "[阴险]": "emoji_35.png",
  "[难受]": "emoji_4.png",
  "[难过]": "emoji_41.png",
  "[领结]": "emoji_7.png",
  "[鬼]": "emoji_18.png",
  "[鬼脸]": "emoji_37.png"
};
export {
  baseUrl,
  appKey,
  mapKey,
  wsUrl,
  imHttpUrl,
  emjList,
  appApiKey
};

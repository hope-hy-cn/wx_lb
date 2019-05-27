 
const allSite=require('./../../js/province.js');
const siteList=allSite.siteList;  
 
Component({ 
    properties: {
        // 控制是否显示选择组件的flag
        show: {
            type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: false, // 属性初始值（可选），如果未指定则会根据类型选择一个
            // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
            observer: function (newVal, oldVal) {
                if (newVal != oldVal) {
                    if (newVal)
                        this.showDatePickerPlus()
                    else
                        this.closeDatePickerPlus()
                }
            }
        },
        area:{
            type: Boolean, 
            value: true,  
            observer: function (newVal, oldVal) {
                if (newVal != oldVal) { 
                    this.setData({
                        areaShow:newVal
                    });  
                }
            }
        },
        limit:{
            type: Boolean, 
            value: false,  
            observer: function (newVal, oldVal) {
                if (newVal != oldVal) { 
                    this.setData({
                        limitShow:newVal
                    });  
                }
            }
        },
        province:{
            type: Array,  
            value: [],  
            observer: function (newVal, oldVal) {
                let vm = this;  
                if (newVal.length!=0) {
                    setTimeout(()=>{
                        vm.data.provinceData.forEach((pItem,pIndex)=>{
                            if(pItem.label==newVal[0]){
                                vm.setData({ pickerIndex:[pIndex,0,0],cityData:vm.data.provinceData[pIndex].children });  
                                vm.data.cityData.forEach((cItem,cIndex)=>{
                                    if(cItem.label==newVal[1]){
                                        vm.setData({areaData:vm.data.provinceData[pIndex].children[cIndex].children, pickerIndex:[pIndex,cIndex,0] });   
                                        vm.data.areaData.forEach((aItem,aIndex)=>{
                                            if(aItem.label==newVal[2]){
                                                 vm.setData({ pickerIndex:[pIndex,cIndex,aIndex]});
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    },300)
                }
            }
        },
         
    },
    // 私有数据，可用于模版渲染
    data: { 
        provinceData:[],//省
        cityData:[],//市
        areaData:[],//区
        areaShow:true,
        pickerIndex:[0,0,0],
        animationData: {},// 动画
        showPicker: false, 
        limitShow:false, //是否加不限条件
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
        /**
         * 初始化数据
         */  
        if(siteList.length<=34&&this.data.limitShow){
            siteList.unshift({'value':'000000','label':'不限','children':[{'value':'000000','label':'不限','children':[{'value':'000000','label':'不限'}] }] }); 
        } else if(siteList.length==35&&!this.data.limitShow){
            siteList.shift();
        }
        let provinceData = this.provinceList(siteList);
        let cityData = this.cityList(siteList); 
        let areaData= this.areaList(siteList);
        let pickerIndex = this.data.pickerIndex; 
        this.setData({
            pickerIndex:pickerIndex,
            provinceData:provinceData,
            cityData:cityData,
            areaData:areaData,
        });  
    },
    moved: function () {
    },
    detached: function () {
    },

    methods: { 
        provinceList:function(arr){
            let cityArrList=[];
            arr.forEach(function(item,index){
                cityArrList.push(item);
            });
            return cityArrList;
        },
        cityList:function(arr){
            let cityArrList=[]; 
            return cityArrList=arr[0].children;  
        }, 
        areaList:function(arr){
            let areaArrList=[]; 
            return areaArrList=arr[0].children[0].children;  
        }, 
        /**
         * 数据改变监听
         */
        bindDateGl: function (e) { 
            // console.log(e.detail.value);
            if(e.detail.value[0]!=this.data.pickerIndex[0]){
                this.provinceChange(e.detail.value[0]);
            }else if(e.detail.value[1]!=this.data.pickerIndex[1]){
                this.cityChange(e.detail.value[0],e.detail.value[1]);
            }else{
                this.setData({  
                    pickerIndex:[e.detail.value[0],e.detail.value[1],e.detail.value[2]]
                });
            }
            
        },
        provinceChange(val){  
            if(val==31||val==32||val==33){
                let cityData=[{label:siteList[val].label}]; 
                let areaData=[{label:siteList[val].label}];  
                this.setData({  
                    cityData:cityData, 
                    areaData:areaData
                }); 
            }else{
                let cityData=[];
                if(this.data.limitShow){
                    siteList[val].children.forEach(function(item,index){  
                        if(item.label!='不限'&&index==0){
                        cityData.unshift({'label':'不限','value':'000000','children':[{'label':'不限','value':'000000'}]}); 
                        } 
                        cityData.push(item); 
                    });  
                }else{
                    cityData=siteList[val].children;
                } 
                let areaData=cityData[0].children;  
                this.setData({  
                    cityData:cityData, 
                    areaData:areaData
                }); 
            }  
            this.setData({  
                pickerIndex:[val,0,0]
            }); 
        },
        cityChange(provinceIndex,val){    
            let cityData=[];
            if(this.data.limitShow){
                siteList[provinceIndex].children.forEach(function(item,index){  
                    if(item.label!='不限'&&index==0){
                        cityData.unshift({'label':'不限','value':'000000','children':[{'label':'不限','value':'000000'}]}); 
                    } 
                    cityData.push(item); 
                });   
            }else{
                cityData=siteList[provinceIndex].children;
            }  
            let areaData=cityData[val].children; 
            this.setData({  
                cityData:cityData, 
                areaData:areaData 
            }); 
            this.setData({  
                pickerIndex:[provinceIndex,val,0]
            });
             
        }, 
        /**
         * 选择->确定
         */
        submitSelectDate: function () { 
            let vm = this; 
            setTimeout(()=>{
                vm.closeDatePickerPlus();
            },200) 
            var myEventDetail = {
                province:this.data.provinceData[this.data.pickerIndex[0]].label,
                city:this.data.cityData[this.data.pickerIndex[1]].label,
                area:this.data.areaData[this.data.pickerIndex[2]].label
            } // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项 
            this.triggerEvent('submit', myEventDetail, myEventOption)
            
        },
        // 显示'选择控件
        showDatePickerPlus: function () {
            var animation = wx.createAnimation({
                duration: 160,
                timingFunction: 'linear',
                delay: 0
            })
            this.animation = animation

            animation.translateY(280).step({duration: 0})

            this.setData({
                animationData: animation.export(),
                showPicker: true
            })
            setTimeout(function () {
                animation.translateY(0).step()
                this.setData({
                    animationData: animation.export(),
                })
            }.bind(this), 160)
        },
        // 隐藏选择控件
        closeDatePickerPlus: function () {
            this.animation.translateY(280).step()
            this.setData({
                animationData: this.animation.export(),
            })
            setTimeout(function () {
                
                this.setData({
                    showPicker: false,
                })
                var myEventDetail = {
                    dateStr: 'close',
                    showYear:'',
                    dateType:''
                } // detail对象，提供给事件监听函数
                var myEventOption = {} // 触发事件的选项
                this.triggerEvent('closeDate', myEventDetail, myEventOption);
            }.bind(this), 120)
        },
        onMyButtonTap: function () {
            this.setData({
                // 更新属性和数据的方法与更新页面数据的方法类似
            })
        },
        _propertyChange: function (newVal, oldVal) {

        }
    }

})
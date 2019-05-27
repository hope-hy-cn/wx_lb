 
 
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
        type: {
            type: String, 
            value: '', 
            observer: function (newVal, oldVal) {
                if (newVal=='one'||!newVal) {
                    this.setData({
                        type:'one'
                    })
                }else{
                    this.setData({
                        type:'two',
                        pickerIndex:[0,0]
                    })
                }
            }
        },
        oneData: {
            type: Array,  
            value: [],  
            observer: function (newVal, oldVal) {
                this.setData({
                    oneListArr:newVal
                })
            }
        },   
        twoData:{
            type: Array, 
            value: [],  
            observer: function (newVal, oldVal) {
                this.setData({
                    twoListArr:newVal
                })
            } 
        }, 
        decollator: {
            type: Boolean,  
            value: false, 
            observer: function (newVal, oldVal) {
                this.setData({
                    decollator:newVal
                })
            }
        },
        index: {
            type: Array, 
            value: [0,0], 
            observer: function (newVal, oldVal) {   
                let vm = this;
                setTimeout(()=>{
                   vm.setData({
                        pickerIndex:newVal
                    }) 
                },300); 
            }
        },
    },
    // 私有数据，可用于模版渲染
    data: { 
        type:'',
        oneListArr:[],
        twoListArr:[],
        pickerIndex:[0],
        animationData: {},// 动画
        showPicker: false, 
        decollator:false,
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
        /**
         * 初始化数据
         */  
         
    },
    moved: function () {
    },
    detached: function () {
    },

    methods: { 
        /**
         * 数据改变监听
         */
        bindDateGl: function (e) {  
            this.setData({
                pickerIndex:e.detail.value,
            }) 
            this.triggerEvent('changeData',e.detail.value)
        }, 
        /**
         * 选择->确定
         */
        submitSelectDate: function () {
            let vm = this; 
            setTimeout(()=>{
                vm.closeDatePickerPlus();
            },400) 
            let myEventDetail = {
                oneIndex:this.data.pickerIndex[0], 
                oneValue:this.data.oneListArr[this.data.pickerIndex[0]], 
            } 
            if(this.data.pickerIndex.length>1){
                myEventDetail.twoIndex= this.data.pickerIndex[1];
                myEventDetail.twoValue=this.data.twoListArr[this.data.pickerIndex[1]];
            }
            let myEventOption = {} // 触发事件的选项
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
                this.triggerEvent('closeDate', myEventDetail, myEventOption)
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
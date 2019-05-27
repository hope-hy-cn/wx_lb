Component({
  properties: {
    value: {
      type: Array,
      value: [],
      observer: "onValue"
    },
    isShow: {
      type: Boolean,
      value: false,
      observer: "onShow"
    }
  },

  data: {
    provinces: [{
      "province_code": "100",
      "city_list": [{
        "city_name": "研发",
        "city_code": "101"
      },{
        "city_name": "设计",
        "city_code": "102"
      },{
        "city_name": "销售",
        "city_code": "103"
      },{
        "city_name": "运营",
        "city_code": "104"
      },{
        "city_name": "产品",
        "city_code": "105"
      },{
        "city_name": "市场商务",
        "city_code": "106"
      },{
        "city_name": "人力资源",
        "city_code": "107"
      },{
        "city_name": "客服",
        "city_code": "108"
      }],
      "province_name": "互联网"
    },{
      "province_code": "200",
      "city_list": [{
        "city_name": "销售",
        "city_code": "201"
      },{
        "city_name": "银行",
        "city_code": "202"
      },{
        "city_name": "财务",
        "city_code": "203"
      },{
        "city_name": "市场商务",
        "city_code": "204"
      },{
        "city_name": "保险",
        "city_code": "205"
      },{
        "city_name": "人力资源",
        "city_code": "206"
      }],
      "province_name": "金融"
    },{
      "province_code": "300",
      "city_list": [{
        "city_name": "设计",
        "city_code": "301"
      },{
        "city_name": "动画",
        "city_code": "302"
      },{
        "city_name": "销售",
        "city_code": "303"
      },{
        "city_name": "公关",
        "city_code": "304"
      },{
        "city_name": "市场商务",
        "city_code": "305"
      }],
      "province_name": "文化传媒"
    },{
      "province_code": "400",
      "city_list": [{
        "city_name": "餐饮娱乐",
        "city_code": "401"
      },{
        "city_name": "交通物流",
        "city_code": "402"
      },{
        "city_name": "美容美发",
        "city_code": "403"
      },{
        "city_name": "保健按摩",
        "city_code": "404"
      },{
        "city_name": "人力资源",
        "city_code": "405"
      },{
        "city_name": "安保",
        "city_code": "406"
      },{
        "city_name": "市场销售",
        "city_code": "407"
      } ],
      "province_name": "服务行业"
    },{
      "province_code": "500",
      "city_list": [{
        "city_name": "市场销售",
        "city_code": "501"
      },{
        "city_name": "教师",
        "city_code": "502"
      } ],
      "province_name": "教育培训"
    },{
      "province_code": "600",
      "city_list": [{
        "city_name": "销售",
        "city_code": "601"
      },{
        "city_name": "生产制造",
        "city_code": "602"
      },{
        "city_name": "技术工人",
        "city_code": "603"
      },{
        "city_name": "采购",
        "city_code": "604"
      }],
      "province_name": "通信电子"
    },{
      "province_code": "600",
      "city_list": [{
        "city_name": "装修施工",
        "city_code": "601"
      },{
        "city_name": "设计",
        "city_code": "602"
      },{
        "city_name": "销售",
        "city_code": "603"
      },{
        "city_name": "开发商",
        "city_code": "604"
      },{
        "city_name": "物业",
        "city_code": "605"
      }],
      "province_name": "房产建筑"
    },{
      "province_code": "700",
      "city_list": [{
        "city_name": "事业单位",
        "city_code": "701"
      },{
        "city_name": "科研机构",
        "city_code": "702"
      },{
        "city_name": "国企",
        "city_code": "703"
      },{
        "city_name": "人力资源",
        "city_code": "704"
      }],
      "province_name": "政法公益"
    },{
      "province_code": "800",
      "city_list": [{
        "city_name": "自由职业者",
        "city_code": "801"
      },{
        "city_name": "学生",
        "city_code": "802"
      }],
      "province_name": "其他"
    }],
    showPicker: false,
    tempProvincePos: [0],
    tempCityPos: [0]
  },

  attached: function () {
  
  },

  methods: {
    onTouchmask: function (event) {
    },
    onCacnelClick(e) {
      this.triggerEvent('cancelclick', {});
    },
    onSureClick(e) {
      var valueCode = [0, 0];
      var valueName = ['', ''];

      if (this.data.provinces != null && this.data.provinces.length > this.data.tempProvincePos) {
        if (this.data.provinces[this.data.tempProvincePos].city_list != null && this.data.provinces[this.data.tempProvincePos].city_list.length > this.data.tempCityPos) {
          valueCode = [this.data.provinces[this.data.tempProvincePos].province_code, this.data.provinces[this.data.tempProvincePos].city_list[this.data.tempCityPos].city_code];
          valueName = [this.data.provinces[this.data.tempProvincePos].province_name, this.data.provinces[this.data.tempProvincePos].city_list[this.data.tempCityPos].city_name];
        } else {
          valueCode = [this.data.provinces[this.data.tempProvincePos].province_code, 0];
          valueName = [this.data.provinces[this.data.tempProvincePos].province_name, ''];
        }
      }

      this.triggerEvent('sureclick', {
        valueCode: valueCode,
        valueName: valueName
      });

    },
    province_onChange: function (e) {
      this.setData({
        tempProvincePos: e.detail.value,
        tempCityPos: [0]
      });
    },
    city_onChange: function (e) {
      this.setData({
        tempCityPos: e.detail.value
      });
    },
    onValue() {
      //通过传进来的省份城市的code计算对应的index
      var tempProvincePos = 0;
      for (var i = 0; i < this.data.provinces.length; i++) {
        var item = this.data.provinces[i]; 
        if (item.province_code == this.data.value[0]) {
          tempProvincePos = i;
          break;
        }
      }
      var tempCityPos = 0;
      if (this.data.provinces.length > tempProvincePos) {
        var cityList = this.data.provinces[tempProvincePos].city_list;
        for (var i = 0; i < cityList.length; i++) {
          var item = cityList[i];
          if (item.city_code == this.data.value[1]) {
            tempCityPos = i;
            break;
          }
        }
      }
      this.setData({
        tempProvincePos: [tempProvincePos],
        tempCityPos: [tempCityPos]
      });
    },
    onShow() {
      this.setData({
        showPicker: this.data.isShow
      });
    }
  }
});
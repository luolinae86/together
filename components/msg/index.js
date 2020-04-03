var log = require("../../utils/log.js")
// components/msg/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    is_show_point_msg:{
      type:Boolean,
      value:false
    },
    data:{
      type:Map,
      value:{}
    },
    arrBottom:{
      type:Number,
      value:-1000
    },
    alertBottom:{
      type:Number,
      value: -1000
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 308
    contentHeight:"232rpx",
    isShowBtn:false
  },
  ready:function(){
    
    
   

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tap_to_close:function(e){
      this.setData({
        is_show_point_msg:false
      })
    },
    tap_right_alert:function(e){
      this.setData({
        is_show_point_msg: false
      })
      wx.navigateTo({
        url: '../../pages/report/report?uuid=' + this.data.data.id
      })
    }
  }
})

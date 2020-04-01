// component/custom-header/custom-header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //left_btn按钮图片 默认为返回按钮
    left_img:{
      type:String,
      value:"back.png"
    },
    // 默认
    title:{
      type:String,
      value:""
    },
    // 默认为返回操作不为0 的时候 将触发事件由 页面自行处理
    operate_type:{
      type:Number,
      value:0
    },
    // 是否展示返回或者其他left——btn 按钮
    show_back:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusHeight: getApp().globalData.statusBarheight + "px",
    barH: getApp().globalData.statusBarheight + 44 + 'px',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 左按钮被点击
    _pressToLeft:function(){ 
      if (this.data.operate_type == 0){
        wx.navigateBack({
          
        })
      }else{
        this.triggerEvent("tap_left")
      }
    },
    //动态变化leftbtn按钮的显示状态
    change_back_show_state:function(isShow){
      this.setData({
        show_back:isShow
      })
    },
    change_title:function(title){
      this.setData({
        title:title
      })
    }
  }
})

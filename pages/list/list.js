var log = require("../../utils/log.js")
var mnRequest = require("../../utils/mineRequest.js")

// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: getApp().globalData.statusBarheight + "px",
    barH: getApp().globalData.statusBarheight + 44 + 'px',
    index:0,
    array:[],
    items: [
      {
        title: "我需要列表",
        type: "need_help"
      },
      {
        title: "我提供列表",
        type: "provide_help"
      },
      {
        title: "报平安列表",
        type: "report_safe"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      index: parseInt(options.idx)
    })
    
    this.getarrays();
  },
  getarrays:function(){
    var that = this;
    var item = this.data.items[this.data.index];
    log.log(item)
    var type = item.type;
    mnRequest.my_list({
      data: {
        topic_type: type
      },
      success: res => {
        that.anyresult(res.topics)
      },
      fail: res => {

      }
    })
  },
  anyresult:function(array){
    this.setData({
      array:array
    })
  },
  tap_to_op:function(e){
    var item = e.currentTarget.dataset.item;
    var index = this.data.index
    if (item.status != "published"){
      return;
    }
    mnRequest.done({
      data:{
        topic_uuid: item.uuid
      },
      success:res=>{
        this.getarrays()
      }

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
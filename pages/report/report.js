
var log = require("../../utils/log.js")
var mnRequest =require("../../utils/mineRequest.js")
// pages/report/report.js
Page({

  /**
   * 页面的初始数据barH
   */
  data: {
    statusHeight: getApp().globalData.statusBarheight + "px",
    barH: getApp().globalData.statusBarheight + 44 + 'px',
    items: [
      { value: 0 , name: '违法违禁', checked: true },
      { value: 1, name: '色情低俗', },
      { value: 2, name: '攻击谩骂' },
      { value: 3, name: '营销广告' },
      { value: 4, name: '青少年不良信息' },
    ],
    index:4,
    textvalue:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    log.log(options)
    this.setData({
      uuid:options.uuid
    })
  },

  radioChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  input_change:function(e){
    this.setData({
      textvalue: e.detail.value
    })
    
  },
  tap_to_upload:function(e){
    
    var complaint_type = "bad_information";
    switch (this.data.index) {
      case 0:
        complaint_type = "illegal_and_prohibited"
        break;
      case 1:
        complaint_type = "pornography"
        break;
      case 2:
        complaint_type = "attack"
        break;
      case 3:
        complaint_type = "advertisement"
        break;
      case 4:
        complaint_type = "bad_information"
        break;

    }
    
    var data = {};
    data.content = this.data.textvalue;
    log.log(this.data);
    data.topic_id = this.data.uuid;
    data.complaint_type = complaint_type

    wx.showLoading({
      title: '',
    })
    mnRequest.topiccomplaint({
      data: data,
      success:res=>{
        setTimeout(
          function () {
            wx.showToast({
              title: '提交成功',
              duration: 1000,
              success: res => {
              }
            })
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1000)
          }, 50
        )
      }
    })
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
var log = require("../../utils/log.js")
var mnRequest = require("../../utils/mineRequest.js")
var manager = require("../../utils/manager.js")
var localstorage = require("../../utils/localstorage.js")
// pages/uploadpage/uploadpage.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: getApp().globalData.statusBarheight + "px",
    barH: getApp().globalData.statusBarheight + 44 + 'px',
    textareavalue:"",
    wordscount:"0/200",
    index:0,
    items :[
      {
        title: "我需要",
        sub_title: "求助详情",
        placeholder:"填写需要帮助的详细内容，别的用户能看到这些信息。\n\n请注意保护好隐私。\n请勿泄露电话号码等联系方式。\n请遵循公益互助的原则，任何广告、交易的行为将被视为违规，系统有权删除您提交的需求\n",
        type:"need_help"
      },
      {
        title: "我提供",
        sub_title: "提供帮助详情",
        placeholder: "填写您能提供帮助的详细内容，别的用户能看到这些信息。\n\n请注意保护好隐私。\n请勿泄露电话号码等联系方式\n请遵循公益互助的原则，任何广告、交易的行为将被视为违规，系统有权删除您提交的信息\n",
        type: "provide_help"
      },
      {
        title: "报平安",
        sub_title: "平安详情",
        placeholder: "填写报平安的内容,别的用户能看到这些信息。\n\n请注意保护好隐私。\n请勿泄露电话号码等联系方式\n请遵循公益互助的原则，任何广告、交易的行为将被视为违规，系统有权删除您提交的信息\n",
        type: "report_safe"
      }
    ],
    ischecked:false,
    phone_switch_ischecked:false,
    account_input:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var account = localstorage.getAccount();
    if(account.social_account && account.social_account.length > 0){
      this.setData({
        account_input:account.social_account
      })
    }

    log.log(options)
    this.setData({
      index: parseInt(options.idx)
    })
  },
  textchanged:function(e){
    this.setData({
      textareavalue: e.detail.value,
      wordscount:e.detail.value.length+"/200"
    })


  },
  switch_phone_change:function(e){
    this.setData({
      phone_switch_ischecked:e.detail.value
    })
  },
  switch1Change:function(e){
    this.setData({
      ischecked:e.detail.value
    })
  },
  tap_to_upload:function(e){

    var content = this.data.textareavalue;
    if (content.length <= 0) {
      return;
    }

    var type = this.data.items[this.data.index].type;
    var data = {
      is_urgent: this.data.ischecked,
      content: content,
      topic_type: type
    }	
	
	var account_input = "N/A";
    /*var account_input = this.data.account_input;
    if(this.data.index == 0 || this.data.index == 1){
      //需要
      if(account_input.length <= 0){
        wx.showModal({
          title: '提示',
          content: '请输入社交账号以方便联系',
          showCancel:false
        })
        return;
      }
    }
    if(account_input.length > 0) {
      data.social_account = account_input;
      data.content = content+"\n社交账号："+account_input;
    }*/
    manager.checkWxAuth({
      type: 'location',
      success: function () {
        wx.getLocation({
          success: res => {
            if (res.errMsg == "getLocation:ok") {
              data.latitude = res.latitude
              data.longitude = res.longitude
              wx.showLoading({
                title: '',
              })
              mnRequest.create({
                data: data,
                success: res => {

                  if(account_input.length > 0){
                    var account = localstorage.getAccount();
                    account.social_account = account_input
                    localstorage.setAccount(account)
                  }
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
                },
                fail: res => {
                  wx.showModal({
                    title: '提示',
                    content: '提交失败，请重试',
                    showCancel: false
                  })
                }
              })
            }
          }
        })
      }
    })
    
    
    
  },
  account_input:function(e){
    var value = e.detail.value
    this.setData({
      account_input:value
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
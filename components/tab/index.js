var localstorage = require("../../utils/localstorage.js")
var mnRequest = require("../../utils/mineRequest.js")
var log = require("../../utils/log.js")
// components/tab/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    is_show_nick_btn:{
      type:Boolean,
      value:false
    },
    is_show_phone_btn:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowOP:false,
    tab_index:0,
    items:[{
      img:"../../img/home_blue.png",
      color:"#1E70B8"
    },{
        img: "../../img/mine_grey.png",
        color: "#666666"
    }],

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tap_to_hide:function(e){
      this.setData({
        isShowOP:false
      })
    },
    tap_to_op0:function(e){
      this.triggerEvent("op_event", {
        idx: 0
      })
      this.setData({
        isShowOP: false
      })
    },
    tap_to_op1: function (e) {
      this.triggerEvent("op_event", {
        idx: 1
      })
      this.setData({
        isShowOP: false
      })
    },
    tap_to_op2: function (e) {
      this.triggerEvent("op_event", {
        idx: 2
      })
      this.setData({
        isShowOP:false
      })
    },
    tap_to_tab0:function(e){
      this.setData({
        isShowOP: false
      })
      if (this.data.tab_index === 0) {
        return;
      }else{
        var items = [{
          img: "../../img/home_blue.png",
          color: "#1E70B8"
        }, {
          img: "../../img/mine_grey.png",
          color: "#666666"
        }]
        this.setData({
          tab_index:0,
          items:items
        })
        this.triggerEvent("op_tab_event", {
          idx: 0
        })
      }
      
    },
    tap_to_tab1: function (e) {
      this.setData({
        isShowOP:false
      })
      if(this.data.tab_index === 1){
        return;
      }else{
        var items = [{
          img: "../../img/home_grey.png",
          color: "#666666"
        }, {
          img: "../../img/mine_blue.png",
            color: "#1E70B8"
        }]
        this.setData({
          tab_index: 1,
          items: items
        })
        this.triggerEvent("op_tab_event", {
          idx: 1
        })
      }
      
    },
    tap_to_add:function(e){
      var isShowOP = this.data.isShowOP;
      this.setData({
        isShowOP: !isShowOP
      })
    },
    bindgetuserinfo:function(e){

      var that = this;

      if (e.detail.errMsg == "getUserInfo:ok"){
        wx.showLoading({
          title: '',
        })
        var nick_name = e.detail.userInfo.nickName
        var head_url = e.detail.userInfo.avatarUrl
        mnRequest.updateUserinfo({
          data: {
            nick_name: nick_name,
            head_url: head_url
          },
          success: res => {
            localstorage.setAccount(res.customer)
            that.setData({
              is_show_nick_btn:false,
              isShowOP:!that.data.isShowOP
            })
          },
          fail: res => {

          }
        })
      }
    },
    bindgetphonenumber:function(e){
      var that = this;
      //先隐藏弹框
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        wx.showLoading({
          title: '',
        })
        //获取成功上报
        var encrypted_data = e.detail.encryptedData;
        var iv = e.detail.iv;
        //上报数据添加

        wx.checkSession({
          success: function (res) {
            that.updatephone(encrypted_data, iv, true)
          },
          fail: function (res) {
            that.updatephone(encrypted_data, iv, false)
          }
        })
      }
    },
    updatephone: function (encrypted_data, iv, isUseful) {
      var that = this;
      var data = {
        encrypted_data: encrypted_data,
        iv: iv
      }
      if (isUseful) {
        that.post_updatePhone(data)
      } else {
        wx.login({
          success: function (res) {
            data.code = res.code
            that.post_updatePhone(data)
          }
        })
      }
    },
    post_updatePhone:function(data){
      var that = this;
      mnRequest.updatePhoneNum({
        data: data,
        success: res => {
          //判断account是否
          var account = res.customer;
          localstorage.setAccount(account);
          var phone = account.phone;
          if (phone && phone.length > 0) {
            //正确
            that.setData({
              is_show_phone_btn:false
            })
          } 
        },
        fail: res => {
          //直接失败
        }
      })
    }

  }
})

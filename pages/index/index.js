//index.js
var log = require("../../utils/log.js")
var manager = require("../../utils/manager.js")
var mnRequest = require("../../utils/mineRequest.js")
var localstorage = require("../../utils/localstorage.js")
//获取应用实例
const app = getApp()

Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers:[],
    results:[],
    scale: 16,
    tab_indx:0,
    alertBottom:-1000,
    arrBottom: -10000,
    is_show_point_msg:false,
    point_msg:{},
    account: localstorage.getAccount(),
    is_show_nick_btn:false,
    is_show_phone_btn:false,
    point_data:{},
    chooseMarkerid:-1,
    tips: ""
  },
  
  onLoad: function () {
    var that = this;
    //先注册账号信息
    wx.login({
      success:res=>{
        var code = res.code;
        mnRequest.register({
          data:{
            code:code
          },
          success:res=>{
            var account = res.customer;
            that.setData({
              account: account
            })
            var is_show_nick_btn = false;
            var is_show_phone_btn = false;
            if(!account.nick_name && !account.head_url ){
              is_show_nick_btn = true;
            }

            if(!account.phone || account.phone <= 0){
              is_show_phone_btn = true
            }

            that.setData({
              is_show_nick_btn: is_show_nick_btn,
              is_show_phone_btn: is_show_phone_btn
            })
            localstorage.setAccount(res.customer)
          },
          fail:res=>{

          }
        })
      }
    })

    //初始化alert位置坐标
    this.mapCtx = wx.createMapContext("myMap")
    
    this.msg_show()

    //获取位置坐标去刷新数据
    manager.checkWxAuth({
      type: 'location',
      success: function () {
        wx.getLocation({
          success: function (res) {
            wx.getLocation({
              success: function (res) {
                log.log(res)
                that.setData({
                  latitude: res.latitude,
                  longitude: res.longitude,
                  scale: 16
                })
                setTimeout(function () {
                  that.getMarkers()
                }, 2000)
              },

            })
          },
        })
      }
    })
    
  },
  onShow:function(){
    var that =this;
     this.setData({
       account:localstorage.getAccount()
     })
    setTimeout(function () {
      that.getMarkers()
    }, 1000)

    var account = localstorage.getAccount();
    if(account && account.uuid){
      mnRequest.config({
        data: {},
        success: res => {
          that.setData({
            tips: res.config.system.tips
          })
        }
      })
    }
    
  },
  getMarkers:function(e){
    var that = this;
    this.mapCtx.getCenterLocation({
      success:res=>{
        if (res.errMsg === "getMapCenterLocation:ok"){
          var data = {
            latitude:res.latitude,
            longitude:res.longitude,
            distance:50
          }
          mnRequest.within_distance({
            data: data,
            success: res => {
              that.anyResult(res.topics)
            },
            fail: res => {

            }
          })
        }
      }
    })
  },
  regionchange:function(e){
    if(e.type === "begin"){
      this.setData({
        is_show_point_msg: false
      })
    }
    if(e.type === "end"){
      var that =this;
      this.mapCtx.getScale({
        success:res=>{
          if (res.scale >= 3) {
            that.getMarkers()
          }
        }
      })
    }
    
  },
  tap_to_map:function(e){
    this.setData({
      is_show_point_msg:false
    })
  },
  anyResult: function (topics ){
    var markers = [];

    for(var i = 0; i < topics.length; i ++){
      var item = topics[i];
      var marker = {
        id: i,
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        width: "71.5rpx",
        height: "90rpx",
        uuid:item.uuid,
        zIndex:10
      };

      if (this.data.chooseMarkerid === item.uuid){
        
        if (item.topic_type === "need_help") {
          marker.iconPath = "../../img/marker1_1.png"
        } else if (item.topic_type === "provide_help") {
          marker.iconPath = "../../img/marker2_1.png"
        } else if (item.topic_type === "report_safe") {
          marker.iconPath = "../../img/marker3_1.png"
        } else {
          marker.iconPath = "../../img/marker1_1.png"
        }
        marker.width = "89rpx";
        marker.height = "110rpx";
        marker.zIndex = 100;
      }else{
        if (item.topic_type === "need_help") {
          if (!item.is_urgent){
            marker.iconPath = "../../img/marker1_0.png"
          }
          else{
            marker.iconPath = "../../img/marker1_3.png"
            marker.width = "134rpx";
            marker.height = "150rpx";
          }
        } else if (item.topic_type === "provide_help") {
          marker.iconPath = "../../img/marker2_0.png"
        } else if (item.topic_type === "report_safe") {
          marker.iconPath = "../../img/marker3_0.png"
        } else {
          marker.iconPath = "../../img/marker1_0.png"
        }
      }
      
      markers.push(marker)
    }

    this.setData({
      markers:markers,
      results:topics
    })
  },
  poitap:function(e){

    
  },
  markertap:function(e){
    

    var array = this.data.markers;
    var markerid = e.detail.markerId;
    var marker = array[markerid];

    this.setData({
      is_show_point_msg: false,
      chooseMarkerid: marker.uuid
    })


    var point_data = this.data.results[markerid];
    if (point_data.topic_type == "need_help" || point_data.topic_type == "provide_help") {
      point_data.contentHeight = "232rpx";
      point_data.isShowBtn = true
    } else {
      point_data.contentHeight = "308rpx";
      point_data.isShowBtn = false
    }
    

    this.anyResult(this.data.results);
    
    this.setData({
      point_data: point_data
    })

    var that = this;
    this.mapCtx.getScale({
      success:res=>{

        if (res.scale == 16){
          this.setData({
            latitude: marker.latitude + 0.00600,
            longitude: marker.longitude,
            scale: 15
          })
          setTimeout(function () {
            that.setData({
              is_show_point_msg: true
            })
          }, 800)
          // that.mapCtx.moveToLocation({
          //   latitude: marker.latitude + 0.00600,
          //   longitude: marker.longitude,
          //   success: res => {
              

          //   }
          // })
        } else{
          this.setData({
            latitude: marker.latitude + 0.00300,
            longitude: marker.longitude,
            scale: 16
          })
          setTimeout(function () {
            that.setData({
              is_show_point_msg: true
            })
          }, 800)
        }
      },
      fail:res=>{

      }
    })
    
  },
  msg_show:function(){
    var that = this;
    this.mapCtx.getRegion({
      success: res => {

        var dis = manager.getDistance(res.southwest.latitude, res.southwest.longitude, res.northeast.latitude, res.southwest.longitude);
        var lat = (res.northeast.latitude - res.southwest.latitude) / 2 + res.southwest.latitude - 0.00300
        var dis2 = manager.getDistance(res.southwest.latitude, res.southwest.longitude, lat, res.southwest.longitude)

        var markers = this.data.markers;

        for (var dic in markers) {
          if (dic.latitude == lat && dic.longitude == res.southwest.longitude) {
            return;
          }
        }
        wx.getSystemInfo({
          success: res => {
            log.log(res.windowHeight)
            log.log(dis)
            log.log(dis2)
            var bottom = 166 + (((2 * res.windowHeight - 212 - 166) / dis) * dis2) + 50;
            var arrBottom = bottom - 20;
            log.log(bottom)
            that.setData({
              alertBottom: bottom,
              arrBottom: arrBottom
            })
          }
        })
      }
    })
  },
  op_tab_event:function(e){
    
  },
  op_event:function(e){
    var idx = e.detail.idx
    wx.navigateTo({
      url: '../uploadpage/uploadpage?idx=' + idx,
    })

  },
  op_tab_event:function(e){
    var idx = e.detail.idx

    //切换显示
    this.setData({
      tab_indx:idx,
      is_show_point_msg:false
    })
  },
  tap_to_listpage:function(e){
    log.log(e.currentTarget.dataset.idx)
    var account = localstorage.getAccount();
    if(!account.nick_name && !account.head_url){
      //授权个人信息
      return;
    }
    /*
    * Yuhua 2020-04-01 移除 手机信息授权
    *
    if(!account.phone || account.phone.length <= 0){
      //授权手机信息
      return;
    }
    */

    wx.navigateTo({
      url: '../list/list?idx=' + e.currentTarget.dataset.idx,
    })
  },
  tap_to_cell:function(e){
    log.log(e.currentTarget.dataset.idx)
  }
})

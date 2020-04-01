
function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}

function checkWxAuth(param) {


  wx.getSetting({
    success: function (res) {

      var authSetting = res.authSetting;
      if (authSetting) {
        //
        if (param.type === "location") {
          if (authSetting.hasOwnProperty("scope.userLocation")) {
            var userLocation = res.authSetting["scope.userLocation"]
            if (!userLocation) {
              wx.showModal({
                title: '提示',
                content: '请开启位置授权，以更好的使用小程序',
                showCancel: false,
                success: res => {
                  wx.openSetting({
                    complete: res => {

                    }
                  })
                }
              })

            } else {

              //直接开启
              param.success()

            }
          } else {
            //第一次开启测试一次
            wx.getLocation({
              success: function (res) {
                param.success()
              },
              fail: function (res) {
                wx.showModal({
                  title: '提示',
                  content: '请开启位置授权，以更好的使用小程序',
                  showCancel: false,
                  success: res => {
                    wx.openSetting({
                      complete: res => {

                      }
                    })
                  }
                })
              }
            })
          }
        } else {

        }

      } else {
        //直接开启
        param.success()

      }
    }
  })
}

module.exports = {
  getDistance: getDistance,
  checkWxAuth: checkWxAuth
}
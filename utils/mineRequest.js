var host = "https://ichina.ylb.io/api/"
var localstorage = require('localstorage.js')
var log = require('log.js');


/**************接口所需函数************** */
/**************接口所需函数************** */
/**************接口所需函数************** */
//获取realUrl
function getRealUrl(param) {
  return host + param;
}

//judgement验证参数
function  judgementData(data){

  if (parseInt(data.success) == 1){
    return true
  }else{
    return false
  }
}

/*******************接口函数 ****************/
/*******************接口函数 ****************/
/*******************接口函数 ****************/
function httpRequest(path, requestType, param) {
  wx.request({
    url: getRealUrl(path),
    data: param.data,
    method: requestType,
    success: function (res) {
      
      var data = res.data;
      log.log(data)
    
      if (judgementData(data.response)) {
        log.log(param.name + "接口正常");
        param.success(data);
      } else {
        log.log(param.name + "接口正常，但判断失败");
        param.fail(data);
        if(param.isModal){
          var description = data.response.description;
          wx.showModal({
            title: '提示',
            content: description,
            showCancel: false
          })
        }
      }
    },
    fail: function (res) {
      var data = {};
      data.response = {};
      data.response.description = "请求失败请重试";
      data.res = res;
      //fail
      log.log(param.name + "接口异常");
      param.fail(data);
      if (param.isModal) {
        var description = data.response.description;
        wx.showModal({
          title: '提示',
          content: description,
          showCancel: false
        })
      }
    },
    complete: function (res) {
      if(param.isHide){

      }else{
        wx.hideLoading();
      }
    }
  })
}


//注册
function register(param){
  var dic = param;
  dic.isShowFail = false;
  dic.name = "注册"
  httpRequest('v1/customer/register', 'POST', dic);

}
//更新电话
function updatePhoneNum(param){
  var account = localstorage.getAccount();
  var dic = param;
  dic.data.uuid = account.uuid;
  dic.isShowFail = false;
  dic.name = "更新电话号码"
  httpRequest('v1/customer/phone', 'POST', dic);
}

//更新头像名字POST /v1/customer/nick_name_head_url
function updateUserinfo(param){
  var account = localstorage.getAccount();
  var dic = param;
  dic.data.uuid = account.uuid;
  dic.isShowFail = false;
  dic.name = "更新个人信息"
  httpRequest('v1/customer/nick_name_head_url', 'POST', dic);
}

function create(param){
  var account = localstorage.getAccount();
  var dic = param;
  dic.data.uuid = account.uuid;
  dic.isShowFail = false;
  dic.name = "创建"
  log.log(dic)
  httpRequest('v1/topic/create', 'POST', dic);
}

function within_distance(param){
  var account = localstorage.getAccount();
  var dic = param;
  dic.data.uuid = account.uuid;
  dic.isShowFail = false;
  dic.name = "范围"
  httpRequest('v1/topic/within_distance', 'GET', dic);
}

// GET /v1/topic/my_list
function my_list(param){
  var account = localstorage.getAccount();
  var dic = param;
  dic.data.uuid = account.uuid;
  dic.isShowFail = false;
  dic.name = "list"
  httpRequest('v1/topic/my_list', 'GET', dic);
} 
///POST /v1/topic/done
function done(param){
  var account = localstorage.getAccount();
  var dic = param;
  dic.data.uuid = account.uuid;
  dic.isShowFail = false;
  dic.name = "done"
  httpRequest('v1/topic/done', 'POST', dic);
}

///common/config
function config(param){
  var account = localstorage.getAccount();
  var dic = param;
  dic.data.uuid = account.uuid;
  dic.isShowFail = false;
  dic.name = "config"
  httpRequest('v1/common/config', 'GEt', dic);
}
// POST / v1 / topic / delete
function topicdelete(param) {
  var account = localstorage.getAccount();
  var dic = param;
  dic.data.uuid = account.uuid;
  dic.isShowFail = false;
  dic.name = "delete"
  httpRequest('v1/topic/delete', 'POST', dic);
}
// POST / v1 / topic / update
function topicupdate(param) {
  var account = localstorage.getAccount();
  var dic = param;
  dic.data.uuid = account.uuid;
  dic.isShowFail = false;
  dic.name = "update"
  httpRequest('v1/topic/update', 'POST', dic);
}
//POST /v1/topic/complaint
function topiccomplaint(param) {
  var account = localstorage.getAccount();
  var dic = param;
  dic.data.uuid = account.uuid;
  dic.isShowFail = false;
  dic.name = "complaint"
  httpRequest('v1/topic/complaint', 'POST', dic);
}

module.exports = {
  register:register,
  updatePhoneNum: updatePhoneNum,
  updateUserinfo: updateUserinfo,
  create: create,
  within_distance: within_distance,
  my_list: my_list,
  done:done,
  config: config,
  topicdelete: topicdelete,
  topicupdate: topicupdate,
  topiccomplaint: topiccomplaint
}
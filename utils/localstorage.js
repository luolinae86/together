//本地Storage的获取
var log = require('log.js');

//通用型存储
function getValueForKey(key) {
    try {
        var value = wx.getStorageSync(key)
        if (value) {
            // Do something with return value
            return value;
        }
    } catch (e) {
        // Do something when catch error
    }
}
function setValueForKey(key,value){
    if(value) {
        try {
            wx.setStorageSync(key, value)
        } catch (e) {    
        }
    }else{
        try {
            wx.removeStorageSync(key);
        } catch(e) {

        }
    }
}

//clean
function clean() {
    try {
      wx.removeStorageSync('phone');
    } catch (e) {
    // Do something when catch error
    }
}

//account
function getAccount() {
  return getValueForKey("account")
  /*
    id
    uuid
    phone
    is_bind_head_url
    is_bind_head_phone
  */
}
function setAccount(param) {
  setValueForKey('account', param)
}

module.exports = {
  clean: clean,
  getAccount: getAccount,
  setAccount: setAccount
}
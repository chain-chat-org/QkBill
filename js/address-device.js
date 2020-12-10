var host = 'http://lv.test'
var ADDRESS_KEY = '__address_to_device__'

function pathJoin(path) {
  if (/^https?/.test(path)) {
    return path;
  }
  return (host.replace(/\/+$/, '') + '/' + (path || '').replace(/^\/+/, ''))
}

function getClientId() {
  return new Promise(function (resolve, reject) {
    mui.plusReady(function () {
      plus.push.getClientInfoAsync(function (info) {
        resolve(info.clientid);
      }, reject);
    });
  });
}

function bindAddressToDevice(address) {
  getClientId().then(function (clientId) {
    return new Promise(function (resolve, reject) {
      // console.log(JSON.stringify({
      //   name: plus.device.model || plus.device.vendor,
      //   os: plus.os.name.toLowerCase(),
      //   fingerprint: clientId,
      // }));
      mui.ajax(pathJoin('/api/addresses/' + address + '/devices'),{
        data:{
          name: plus.device.model || plus.device.vendor,
          os: plus.os.name.toLowerCase(),
          fingerprint: clientId,
        },
        dataType:'json',//服务器返回json格式数据
        type:'post',//HTTP请求类型
        timeout:10000,//超时时间设置为10秒；
        success:function(res){
          if (res.code == 0) {
            saveToStorage(address);
            resolve(res);
          } else {
            console.error(JSON.stringify(res));
            reject(res);
          }
        },
        error:function(err) {
          console.error(JSON.stringify(err));
          reject(err);
        },
      });
    });
  });
}

function deleteAddressToDevice(address) {
  getClientId().then(function (clientId) {
    return new Promise(function (resolve, reject) {
      mui.ajax(pathJoin('/api/addresses/' + address + '/devices'),{
        data:{
          fingerprint: clientId,
        },
        dataType:'json',//服务器返回json格式数据
        type:'delete',//HTTP请求类型
        timeout:10000,//超时时间设置为10秒；
        success:function(res){
          if (res.code == 0) {
            removeFromStorage(address);
            resolve(res);
          } else {
            console.error(JSON.stringify(res));
            reject(res);
          }
        },
        error:function(err) {
          console.error(JSON.stringify(err));
          reject(err);
        },
      });
    });
  });
}

function filterUnbindAddress(addressList) {
  if (Object.prototype.toString.call(addressList) === '[object Array]') {
    var bindedAddressList = getStorage();
    return addressList.filter(function (item) {
      return bindedAddressList[item] != 1;
    });
  }
}

function saveToStorage(address) {
  var store = getStorage();
  store[address] = 1;
  setStorage(store);
}

function removeFromStorage(address) {
  var store = getStorage();
  if (store[address]) {
    delete store[address];
  }
  setStorage(store);
}

function getStorage() {
  return JSON.parse(localStorage.getItem(ADDRESS_KEY) || '{}');
}

function setStorage(store) {
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(store));
}

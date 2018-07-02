/* require('babel-polyfill');

() => {
  let arr = [];
}

require('./index.scss')

var auto = require('./auto.png')
document.getElementsByTagName("img")[0].src = auto */
const axios = require('axios')

const isTest = location.host.match(/192|122|127|172|36.7|localhost/) !== null

const path = isTest ? 'http://192.168.31.122:4000' : ''

function getString(name) {
  var urlparams = location.search + '&' + (location.hash.split('?')[1]);
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = urlparams.substr(1)
    .match(reg);
  if (r != null) return r[2];
  return '';

}

function getReferrer() {
  var referrer = '';
  try {
    referrer = window.top.document.referrer;
  } catch (e) {
    if (window.parent) {
      try {
        referrer = window.parent.document.referrer;
      } catch (e2) {
        referrer = '';
      }
    }
  }
  if (referrer === '') {
    referrer = document.referrer;
  }
  return referrer;
}

let logID
// 客户端详情
async function onloadLog() {
  let {
    data
  } = await axios.post(path + '/visitlog', {
    laiyuan: getString('laiyuan'),
    refer: getReferrer(), 
    netType: navigator.connection.type
  })
  console.log('logID: ' + data);
  logID = data
}

onloadLog()

// const inTime = new Date().getTime()
// async function timeLog() {
//   const outTime = new Date().getTime()
//   let {
//     data
//   } = await axios.post(path+'/timelog', {
//     id: logID,
//     time: outTime - inTime
//   })
//   console.log('timeLog: success');
// }

// 关闭时发送
// window.addEventListener('unload', function(event) {
// 	timeLog()
// });
// 阻塞
// window.addEventListener('unload', function(event) {
//   timeLog()
//   (new Image).src = 'http://bbsstatic.wsloan.com/picfile/yhtx/18030609532593.jpg'
// });

// Beacon API
const inTime = new Date().getTime()
// 访问时间
function timeLog() {
  const outTime = new Date().getTime()
  navigator.sendBeacon(path + '/timelog', JSON.stringify({
    id: logID,
    time: outTime - inTime,
    // touchTimes: touchTimes
  }));
}
window.addEventListener('unload', function (event) {
  timeLog()
});

// let touchTimes = 0;
// window.addEventListener('touchend', function (event) {
//   touchTimes++;
// })


// 点击位置
function sendClick(x, y, scroll) {
  axios.post(path + '/clicklog', {
    id: logID,
    deviceWidth: deviceWidth,
    deviceHeight: deviceHeight,
    x: x,
    y: y,
    scroll: scroll
  })
}
let deviceWidth = document.documentElement.clientWidth
let deviceHeight = document.documentElement.clientHeight
window.addEventListener('click', function (event) {
  var e = event || window.event;
  sendClick(e.clientX, e.clientY, document.documentElement.scrollTop)
})


// 自定义事件
function detectmob() {
  if (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  } else {
    return false;
  }
}
const isPC = !detectmob()

function sendTrack(activeName, domName) {
  axios.post(path + '/tracklog', {
    id: logID,
    plat: isPC ? 'PC' : 'Mobile',
    activeName: activeName,
    domName: domName
  })
}

window._wsTrack = function(a,b){
  sendTrack(a,b)
}
// document.body.addEventListener('click', function (event) {

//   var e = event || window.event;
//   var target = e.target || e.srcElement;
//   var attr = target.getAttribute('data-track');
//   if (attr) {
//     attr = attr.split(',');
//     sendTrack(attr[0],attr[1],attr[2])
//   }
// })

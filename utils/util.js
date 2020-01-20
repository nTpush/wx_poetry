/**
 * 公共工具类
 * 页面中使用 wx.$util 访问
 */
import types from './types.js';
import wxp from './wxp.js'

wxp.intercept('navigateTo', {
  complete() {
    wx.hideLoading();
  }
})

// 日期格式化
function formatDate(nDate, formatStr = "yyyy-MM-dd") {
  if (typeof nDate === 'number') {
    nDate = new Date(nDate);
  }

  let o = {
    'M+': nDate.getMonth() + 1,
    'd+': nDate.getDate(),
    'h+': nDate.getHours(),
    'm+': nDate.getMinutes(),
    's+': nDate.getSeconds(),
    'q+': Math.floor((nDate.getMonth() + 3) / 3),
    'S': nDate.getMilliseconds()
  }
  if (/(y+)/.test(formatStr)) {
    formatStr = formatStr.replace(RegExp.$1, (nDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(formatStr)) {
      formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return formatStr
}

// 对象转URL参数 {a:1, b:2} => a=1&b=2
function obj2pms(obj) {
  return Object.keys(obj).map(v => `${v}=${obj[v]}`).join('&');
}

// 验证 空对象
function isEmptyObject(obj) {
  for (let i in obj) {
    return false
  }
  return true
}

// 构建跳转链接  /study/study => /pages/study/study
const buildUrl = (path, params) => {
  let url = `/pages${path}`
  if (params) url += ('?' + obj2pms(params))
  return url;
}

// 带历史的跳转
const navigateTo = (page, params) => {
  let url = buildUrl(page, params)
  wx.showLoading({
    mask: true
  });
  wxp.navigateTo({
    url
  })
}

// 不带历史的跳转
const redirectTo = (page, params) => {
  let url = buildUrl(page, params)
  wx.redirectTo({
    url
  })
}

// 切换Tab
const switchTab = (page, params) => {
  let url = buildUrl(page, params)
  wx.switchTab({
    url
  })
}

// 显示没有Icon的 Toast
const showToast = text => {
  return wx.showToast({
    title: text,
    icon: 'none'
  })
}

const showLoading = t => wx.showLoading({
  title: t,
  mask: true
});


// 列表定位 滚动到指定位置（id的前缀，id)
function listScrollTo(idPrefix, id) {
  wx.createSelectorQuery().select(`#${idPrefix}${id}`).boundingClientRect(function (rect) {
    if (!rect) return;
    const t = rect.top;
    if (t <= 100) return;
    setTimeout(() => {
      wx.pageScrollTo({
        scrollTop: t - 100,
        duration: 0,
      })
    }, 10)
  }).exec()
}

// 按属性分组（数组，属性）
function groupBy(arr, prop) {
  return arr.reduce((p, n) => (p[n[prop]] ? p[n[prop]].push(n) : (p[n[prop]] = [n]), p), {})
}

// 返回类型对应的字符串
function formatByType(type, propName, map) {
  return (propName ? map[type][propName] : map[type]) || '';
}

// 深拷贝
function deepClone(obj) {
  let res = obj;
  try {
    res = JSON.parse(JSON.stringify(obj))
  } catch (e) {}
  return res;
}

function showModal(tip, tit) {
  return wxp.showModal({
    title: tit || '提示',
    content: tip,
    showCancel: false,
  })
}

// 是否使用 m3u8 的视频格式
function isUseM3U8() {
  const useM3U8 = wx.$local.useM3U8;
  return useM3U8 !== '' ? useM3U8 : wx.IS_IOS;
}

function padZero(v) {
  return ('00' + v).substr(String(v).length);
}

// 获取随机数
function getRandom(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

function dealPoetryContent (content) {
  let str = content.replace(/[\r\n]/g, "")
        .replace(/\?/g, '？')
       .replace(/\((.+?)\)/g, "")
       .replace(/\（(.+?)\）/g, "")
       .replace(/\。/g, '。\n')
       .replace(/\？/g, '？\n')
       .replace(/\！/g, '！\n')
       .replace(/\；/g, '；\n')
       .replace(/\;/g, ';\n')
       .replace(/\n”/g, '”\n')
  let arr = str.split('\n')
  let b = arr.map(item => {
      if(item.length >= 20) {
          item = item.replace(/\，/g, ($a, $b) => {
              if($b == 17 ||  $b == 15 || $b == 28 || $b == 16 || $b == 12 || $b == 19 || $b == 29 || $b == 48 || $b == 13 || $b == 10) {
                  return "，\n"
              }
              return '，'
          })
      }
      return item
  })
  return b.join('\n')
}

function dealDetailContent(content) {
  let str = content.replace(/[\r\n\s]/, "")
  .replace(/[\s]/g, '\n')
  .replace(/▲/g, '')
  .replace(/[\r\n]/, "")
  return str
}

function dealStudyPoetry(content) {
  let defaultPoetry = dealDetailContent(content)
  let text = defaultPoetry.replace(/[\。| \，| \？| \！| \!]/g, ($a, $b) => {
    return `${$a}|`
  })
  let b = text.trim()
  let newText = b.substr(0, b.length - 1)
  let arr = newText.split('|')
  return arr
}

//打乱数组顺序
function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
  }
  return arr
};

//播放音频
function playVideo(url, endCall){
  let reinnerAudioContext = wx.createInnerAudioContext()
  reinnerAudioContext.src = url
  reinnerAudioContext.play();
  reinnerAudioContext.onEnded(() => {
    reinnerAudioContext.destroy()
    endCall()
  })
}

//去除符号
function cutfh(string) {
  return string.replace(/[\。| \，| \？| \！| \!]/g, '')
}

module.exports = {
  cutfh,
  playVideo,
  shuffle,
  dealDetailContent,
  buildUrl,
  obj2pms,
  isEmptyObject,
  navigateTo,
  redirectTo,
  switchTab,
  showToast,
  formatDate,
  listScrollTo,
  groupBy,
  showLoading,
  deepClone,
  showModal,
  isUseM3U8,
  padZero,
  getRandom,
  dealPoetryContent,
  dealStudyPoetry,
  getCourserTypePage: (type) => formatByType(type, 'page', types.courseTypes),
  formatWeek: type => formatByType(type, null, types.weekMap),
  formatParentType: type => formatByType(type, null, types.parentTypes),
}
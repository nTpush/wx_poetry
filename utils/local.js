/**
 * 本地存储
 * 页面中使用 wx.$local 访问 （必须先注册，后访问）
 */
const prefix = 'wx/';

const local = {
  resetAuthInfo: () => {
    wx.$local.authInfo = {};
    wx.$local.token = '';
  }
};

// 注册 key 值
const keys = [
  // 用户登录信息
  'unionId',
  'openId',
  // wx.getUserInfo 获取的信息
  'userInfo',
  // 会话token
  'token',
  'service',
  'authInfo',
  "studyMode",
  "studyMethod",
  "poetryOption",
]

// 添加 get set 方法 （扩展：检测大小，存储异常处理）
const props = keys.reduce((p, n) => {
  p[n] = {
    enumerable: true,
    get: function () {
      return wx.getStorageSync(prefix + n);
    },
    set: function (v) {
      return wx.setStorageSync(prefix + n, v);
    },
  }
  return p;
}, {})

Object.defineProperties(local, props)

export default local;
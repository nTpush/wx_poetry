/**
 * 用户工具类
 */
const authScopeConfig = {
  'scope.userInfo': '需要获取您的公开信息（昵称、头像)',
  'scope.userLocation': '需要获取您的地理位置信息',
  'scope.record': '需要获取您的设备的录制声音功能',
  'scope.writePhotosAlbum': '需要您允许保存图片到相册',
  'scope.camera': '需要开启摄像头功能',
  'scope.address': '需要获取您的通迅地址',
  'scope.invoiceTitle': '获取您的发票信息',
}

// 获取授权，直到获取为止
function openSetting(resolve, reject, scope) {
  const content = `${authScopeConfig[scope]}，请到设置中打开相关授权`
  wx.showModal({
    title: '微信授权',
    content: content,
    confirmText: '去设置',
    success: res => {
      // 拒绝打开 设置
      if (res.cancel) return reject();
      wx.openSetting({
        success: (res) => {
          const isAuthed = res.authSetting[scope];
          // 从 设置返回，检测是否已经授权
          isAuthed ? resolve(true) : openSetting(resolve, reject, scope)
        },
        fail: reject
      })
    },
    fail: reject,
  })
}

export default {
  // 登录
  login: (code, encryptedData, iv) => {
    return wx.$api.login({
      // loginType: 6,
      code: code,
      data: encryptedData,
      iv: iv,
      type: 1,
    }, {
      loading: true,
      tip: '正在登录'
    }).then(res => {
      console.log('api.login:ok')
      return res;
    }, err => {
      console.log('api.login:fail')
    })
  },

  // 获取授权
  authorize: (scope) => {
    return new Promise((resolve, reject) => {
      // 先看一下用户设置中是否已经授权
      wx.getSetting({
        success(res) {
          // 之前已经授权
          if (res.authSetting[scope]) return resolve(true);
          // 用户信息授权：必须用户点击按钮授权，此方法只检测用户有没有过授权
          if (scope === 'scope.userInfo') {
            reject();
          } else {
            // 未授权过，请求授权
            wx.authorize({
              scope: scope,
              success: resolve,
              fail() {
                // 已拒绝，打开 设置
                openSetting(resolve, reject, scope)
              }
            })
          }
        },
        fail: reject
      })
    })
  },
}

/**
 * 系统变量
 * 使用 wx.IS_DEV 访问
 */
let res = wx.getSystemInfoSync()
wx.WIN_WIDTH = res.screenWidth
wx.WIN_HEIGHT = res.screenHeight
wx.IS_IOS = /ios/i.test(res.system)
wx.IS_ANDROID = /android/i.test(res.system)
wx.STATUS_BAR_HEIGHT = res.statusBarHeight
wx.DEFAULT_HEADER_HEIGHT = 46 // res.screenHeight - res.windowHeight - res.statusBarHeight
wx.DEFAULT_CONTENT_HEIGHT = res.screenHeight - res.statusBarHeight - wx.DEFAULT_HEADER_HEIGHT
wx.TOP_HEADER_HEIGHT = wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT
wx.IS_APP = true
wx.SDK_VERSION = res.SDKVersion;
wx.IS_DEV = res.platform === 'devtools';

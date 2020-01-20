//获取应用实例
import wxp from '../../utils/wxp.js'
import auth from '../../utils/auth.js'
Page({
  data: {
    hasUserInfo: false,
    isNeedLogin: false
  },
  onLoad: function(option) {
    let { isNeedLogin = false } = option
    this.option = option
    this.setData({isNeedLogin})
    this.wxLogin()
  },
  // 获取 userInfo 回调
  getUserInfoCallback: function (data) {
    console.log('wx.getUserInfo:ok')
    const { encryptedData, iv, userInfo } = data;
    wx.$local.userInfo = userInfo
    this.setData({
      hasUserInfo: true
    }, () => {
      this.authedCallback(this.code, encryptedData, iv);
    })
  },
  // 后台登录 或 获取用户信息
  authedCallback(code, encryptedData, iv) {
    // 后台登录
    if (wx.$local.token) {
      this.goHomePage();
    } else {
      this.loginServer(code, encryptedData, iv);
    }
  },
  // 微信登录并获取用户信息 //
  wxLogin() {
    console.log('wx.login...')
    wxp.login().then(res => {
      console.log('wx.login:ok')
      this.code = res.code;
      console.log('wx.getSetting...')
      wxp.getSetting().then(res => {
        if ((res.authSetting['scope.userInfo'] && wx.$local.token) || this.data.isNeedLogin) {
          console.log(88)
          wxp.getUserInfo().then(res => {
            this.getUserInfoCallback(res)
          }).catch(err => {
            this.setData({ hasUserInfo: false })
          })
        } else {
          if(!this.data.isNeedLogin) this.goHomePage()
          this.setData({ hasUserInfo: false });
        }
      })
    }).catch(err => {
      console.log('wx.login:fail', err)
    })
  },
   // api 登录
   loginServer(code, encryptedData, iv) {
    auth.login(code, encryptedData, iv).then(res => {
      wx.$local.token = res.token.token
      this.goHomePage()
    })
  },

  goHomePage(){
    if(this.options.next) {
      const pms = this.options;
      const page = pms.next;
      delete pms.next;
      wx.$util.redirectTo(page, pms);
      return 
    }
    if(this.option.shareKey) {
      wx.$api.shareGet({id: this.option.shareKey}).then(res => {
        let p = JSON.parse(res)
        let page = p.page 
        delete p.page
        wx.$util.redirectTo(page, p)
      })
      return
    }
    wx.$util.redirectTo('/home/home')
  },
  onRefuse(){
    this.goHomePage()
  },
  // 点击BUTTON 手动授权
  getUserInfo: function (e) {
    console.log('手动授权:ok')
    e.detail && this.wxLogin()
  },
})
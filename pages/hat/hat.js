import auth from '../../utils/auth.js';
import wxp from '../../utils/wxp.js';
Page({
  data:{
    avatar:'',
    afterAvatar:'',
    template: {}
  },

  doPoster: function(){

    wx.showLoading()

    const { avatarUrl }  = wx.$local.userInfo

    if(!avatarUrl) {
      wx.$util.redirectTo('/index/index', {isNeedLogin: true})
      return
    }

    let width = '100px'
    let height = '100px'

    let head = {
      type: 'image',
      url: avatarUrl,
      css: {
        top: '0px',
        left: '0px',
        width: '100px',
        height: '100px',
      }
    }

    let hat = {
      type: 'image',
      url: 'https://blog-static-ntpush.oss-cn-beijing.aliyuncs.com/wechat/poetry_activity/11.png',
      css: {
        top: '0px',
        left: '0px',
        width: '50px',
        height: '30px',
      }
    }


    let views = [ head, hat ]
    this.setData({ template: {width, height, views } });
  },
  onLoad: function(){
    this.doPoster()
  },
  onImgOK(e){
    const url = e.detail.path;
    wx.hideLoading()
    this.setData({afterAvatar: url})
  },
  onImgErr(){

  },
   //点击开始的时间
    timestart: function (e) {
      this.timestart = e.timeStamp
    },
    //点击结束的时间
    timeend: function (e) {
      this.timeend = e.timeStamp
    },
    //保存图片
    saveImg: function (e) {
      var times = this.timeend - this.timestart;
      if (times > 300) {
        console.log("长按");
        auth.authorize('scope.writePhotosAlbum').then(res => {
          wx.$util.showLoading('正在保存')
          wxp.saveImageToPhotosAlbum({
            filePath: this.data.afterAvatar,
          }).then(res => {
            wx.hideLoading()
            wx.$util.showToast('已保存至相册');
            this.triggerEvent('onHide');
          }).catch(e => {
            wx.hideLoading();
            wx.$util.showToast('图片保存失败');
            this.triggerEvent('onHide');
          })
        }).catch(e => {
          wx.$util.showToast('图片下载失败');
          wx.hideLoading();
        })
      }
    },
    stop() {},
})
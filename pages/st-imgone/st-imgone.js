//获取应用实例
const app = getApp()
Page({
  rightVoide: app.globalData.rightVoice,
  wrongVoice: app.globalData.wrongVoice,
  data:{
    mapMode: {
      '1': '自由模式',
      '2': '闯关模式'
    },
    modeType: '1',
    poetry: {},
    titlePage:'',
    allMedthos:[]
  },
  getDetail(){
    let pms = {poetry_id: this.poetryId}
    wx.$api.poetryDetail(pms).then(res => {
      let poetry = res
      console.log(poetry)
      wx.setNavigationBarTitle({
        title: res.title
      })
    })
  },
  onLoad(e) {
    this.poetryId = e.poetry_id
    this.authorId = e.author_id
    this.option = e
    wx.$local.poetryOption = e
    this.setData({
      modeType: e.study_mode
    })
    this.getDetail()
    this.getMethos()
  },
  getMethos() {
    wx.$api.studMethod().then(res => {
      let title = res.find(item => item.id == this.option.study_method)
      let newArr = []
      res.forEach(item => {
        if(item.id != this.option.study_method && item.method_status != 0) {
          newArr.push(item)
        }
      })
      let afterArr = wx.$util.shuffle(newArr)
      afterArr.forEach(item => {
        item.poetry_id = this.poetryId
        item.author_id = this.authorId
        item.study_mode = this.data.modeType
        item.study_method = this.option.study_method
      })
      this.setData({titlePage: title.method_title, allMedthos: afterArr.splice(0, 3)})
    })
  },
  dealResult(current){
    if(true) {
      wx.$util.playVideo(this.rightVoide, ()=>{
      
      })
      this.selectComponent("#rightDialog").showDialog(); 
    }else {
      wx.$util.playVideo(this.wrongVoice, ()=>{
     
      })
      this.selectComponent("#wrongDialog").showDialog();
    }
  },
  onShareAppMessage: function () {
    let pms = this.option
    pms.page = '/st-imgone/st-imgone'
    wx.$api.shareAdd({value: JSON.stringify(pms)}).then(res => {
      this.shareKey = res
      const url = '/pages/index/index?shareKey=' + this.shareKey;
      return {
        title: '一起来背诗吧',
        path: url,
      }
    })
  }

  // let poetry = ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'];

  // let error = ['锄禾日当午', '汗滴禾下土', '谁是盘中餐', '粒粒皆辛苦'];

  // let error1 = ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少', '好好学习', '夜来风雨声'];

  // let errwords = [];
  // for (var i = 0; i < error.length; i++) {
  //   error[i].split('').forEach(item => {
  //     errwords.push(item);
  //   });
  // }
  // for (var i = 0; i < error1.length; i++) {
  //   error1[i].split('').forEach(item => {
  //     errwords.push(item);
  //   });
  // }
  // errwords.sort(function(x, y) {
  //   return 0.5 - Math.random();
  // });
  // let sum = 0;
  // let words = [];
  // for (var i = 0; i < poetry.length; i++) {
  //   poetry[i].split('').forEach((item, index) => {
  //     sum += index;
  //     words.push({ r: item, type: 1, w: errwords[index + sum] });
  //   });
  // }

  // function getrand(m, n) {
  //   return Math.floor(Math.random() * (n - m + 1)) + m;
  // }
  // let errorrang = getrand(5, 10);

  // let typearr = [];
  // for (var i = 0; i < words.length; i++) {
  //   typearr.push(i);
  // }

  // typearr.sort(function(x, y) {
  //   return 0.5 - Math.random();
  // });

  // let result = typearr.splice(0, errorrang);

  // result.forEach(item => {
  //   words[item].type = 0;
  // });

  // console.log(words, 'result');
})
const app = getApp()
Page({
  errorList: [],
  rightVoide: app.globalData.rightVoice,
  wrongVoice: app.globalData.wrongVoice,
  data:{
   poetryArr: [],
   trueIndex: 0,
   chooseItem: [],
   mapMode: {
     '1': '自由模式',
     '2': '闯关模式'
   },
   modeType: '1',
   mapItem: {
     0: 'A.',
     1: 'B.',
     2: 'C.',
     3: 'D.'
   },
   titlePage: '',
   allMedthos:[],
   isResult: false
  },
  onMore(data){
    let value = data.target.dataset.data
    let poetry_id = value.poetry_id
    let author_id = value.author_id
    let pms = {poetry_id, author_id}
    wx.$util.redirectTo('/detail/detail', pms)
  },
  onStop(){},
  onChoose(data){
    console.log(data)
    let value = data.target.dataset.data
    let index = data.target.dataset.index
    if(value && value.result == 2) {
      wx.$util.showToast('已经对了~')
      return
    }
    if(value && value.result == 3) {
      wx.$util.showToast('点击问号学习更多~')
      return
    }
    let poetryItem = this.data.chooseItem
    if(value && value.result == 1) {
      wx.$util.playVideo(this.rightVoide, ()=>{
        for(var i=0; i<poetryItem.length; i++) {
          poetryItem[i].result = 3
        }
        poetryItem[index].result = 2
        this.setData({chooseItem: poetryItem})
        setTimeout(()=>{
          this.setData({ isResult: true})
        }, 1000)
      })
      this.selectComponent("#rightDialog").showDialog(); 
    }else {
      wx.$util.playVideo(this.wrongVoice, ()=>{
        poetryItem[index].result = 3
        this.setData({chooseItem: poetryItem})
      })
      this.selectComponent("#wrongDialog").showDialog();
    }
  },
  getErrorList(call){
    if(this.errorList.length)  {
      call()
      return
    } 
    wx.$api.poetryError().then(res=>{
      this.errorList = res
      call()
    })
  },
  // 获取数据
  getDetail(){
    let pms = {poetry_id: this.poetryId}
    wx.$api.poetryDetail(pms).then(res => {
        this.poetry = res
        wx.setNavigationBarTitle({
          title: res.title
        })
        this.dealDetail(this.poetry)
    })
  },
  dealDetail(p) {
    let poetry = p
      let poetryArr = wx.$util.dealStudyPoetry(poetry.content)
      let trueIndex  = wx.$util.getRandom(0, poetryArr.length - 1)
      let newPoetrys = [];
      for (var i = 0; i < poetryArr.length - 1; i++) {
        let rand = wx.$util.getRandom(0, 2);
        newPoetrys.push([
          {
            poetry: wx.$util.cutfh(poetryArr[i]),
            type: rand == 0 ? 0 : 1,
          },
          {
            poetry: wx.$util.cutfh(poetryArr[i + 1]),  
            type: rand == 0 ? 1 : 0,
          },
        ]);
      }
      let rand = wx.$util.getRandom(0, newPoetrys.length);
      let showPoetry = newPoetrys[rand]
      let RirghtTitle = showPoetry[0].type == 1 ? showPoetry[0].poetry : showPoetry[1].poetry
      let item = [{result: 1, title: RirghtTitle, poetry_id: this.poetryId, author_id: this.authorId}]
      this.getErrorList(()=>{
        for(var i=0; i<3; i++) {
          let ram = wx.$util.getRandom(0, this.errorList.length - 1)
          item.push({
            result: 0,
            title: this.errorList[ram].poetry_sen,
            poetry_id: this.errorList[ram].poetry_id,
            author_id: this.errorList[ram].author_id
          })
        }
        poetryArr[trueIndex] = poetryArr[trueIndex].replace(/[\u4e00-\u9fa5]/g, '')
        this.setData({
           poetryArr: showPoetry,
           trueIndex,
           chooseItem: wx.$util.shuffle(item)
          })
      })
  },
  onLoad(e) {
    this.poetryId = e.poetry_id
    this.authorId = e.author_id
    this.option = e
    wx.$local.poetryOption = e
    this.setData({ modeType: e.study_mode })
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
  onShareAppMessage: function () {
    let pms = this.option
    pms.page = '/st-choose/st-choose'
    wx.$api.shareAdd({value: JSON.stringify(pms)}).then(res => {
      this.shareKey = res
      const url = '/pages/index/index?shareKey=' + this.shareKey;
      return {
        title: '一起来背诗吧',
        path: url,
      }
    })
  }
})
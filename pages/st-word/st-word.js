const app = getApp()
Page({
  count: 0,
  errorList:[],
  rightVoide: app.globalData.rightVoice,
  wrongVoice: app.globalData.wrongVoice,
  data:{
    titlePage:'',
    mapMode: {
      '1': '自由模式',
      '2': '闯关模式'
    },
    modeType: '1',
    poetry: {},
    poetryData: [],
    currentIndex: 1,
    chooseData:[],
    isResult: false,
    allMedthos:[]
  },
  reFlesh(){
    if(this.data.isResult) return
    this.dealPoetry()
    this.setData({currentIndex: 1})
    this.count = 0
  },
  // 选择
  onChoose(data){
    let value = data.target.dataset.data
    let index = data.target.dataset.index
    let currentIndex = this.data.currentIndex
    let poetryData = this.data.poetryData
    let chooseData = this.data.chooseData

    if(this.data.isResult) {
      wx.$util.showToast('答完了~')
      return 
    }

    if(chooseData[index].isChoose == 1) {
      wx.$util.showToast('换一个吧~')
      return
    }

    chooseData[index].isChoose = 1
    let count = 0



    poetryData.forEach((item, index) => {
        item.data.forEach((i, key) => {
          count++
          if(i.number == currentIndex) {
            poetryData[index].data[key].cc = value
            poetryData[index].data[key].result = 1
          }
        })
      })
      currentIndex = currentIndex+1
      this.count = count
      if(this.count == currentIndex) {
        console.log('答完了')
        console.log(this.data.poetryData, '3')
        let poetryData = this.data.poetryData
        let errData = []
        poetryData.forEach(item => {
          item.data.forEach(ii => {
            if(ii.word != ii.cc.word) {
              errData.push(ii.number)
            }
          })
        })

        if(errData.length) {
          wx.$util.playVideo(this.wrongVoice, ()=>{
            this.setData({isResult: true})
          })
          this.selectComponent("#wrongDialog").showDialog();
        }else {
          wx.$util.playVideo(this.rightVoide, ()=>{
            this.setData({isResult: true})
          })
          this.selectComponent("#rightDialog").showDialog(); 
        }
        
      }

      if(currentIndex > count) {
      }else {
      this.setData({currentIndex, poetryData, chooseData})
    }
  },
  getDetail(){
    let pms = {poetry_id: this.poetryId}
    wx.$api.poetryDetail(pms).then(res => {
      this.poetry = res
      wx.setNavigationBarTitle({
        title: res.title
      })
      this.dealPoetry()
    })
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
  dealPoetry(){
    let content = this.poetry.content
    let poetryArr = wx.$util.dealStudyPoetry(content)
    let arr = []
    this.count = 0
    let wrongs = []
    poetryArr.forEach((item,index) => {
      let words = wx.$util.cutfh(item)
      let wordsArr = words.split('')
      let a = []
      wordsArr.forEach((it, ind) => {
        let obj = {
          word: it,
          result: 0,
          number:  this.count ++,
        }
        a.push(obj)
        wrongs.push(obj)
      })
      arr.push({
        data: a
      })
    })
    arr[0].data[0].cc = {word: arr[0].data[0].word}
    arr[0].data[0].result = 1
    this.getErrorList(()=>{
      let error =  this.errorList.splice(0, 10)
      error.forEach((item,index) => {
        let wordsArr = item.poetry_sen.split('')
        let a = []
        wordsArr.forEach((it, ind) => {
          let obj = {
            word: it,
            result: 0,
            number:  null,
            isChoose: 0
          }
          wrongs.push(obj)
        })
      })
      let newWrong = wrongs.splice(0, 48)
      this.setData({chooseData: wx.$util.shuffle(newWrong)})
    })

    this.setData({poetryData: arr})
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
    pms.page = '/st-word/st-word'
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

  //   let error = ['锄禾日当午', '汗滴禾下土', '谁是盘中餐', '粒粒皆辛苦'];

  //   let error1 = ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少', '好好学习'];

  //   let words = [];
  //   for (var i = 0; i < poetry.length; i++) {
  //     poetry[i].split('').forEach(item => {
  //       words.push({ w: item, type: 1 });
  //     });
  //   }

  //   for (var i = 0; i < error.length; i++) {
  //     error[i].split('').forEach(item => {
  //       words.push({ w: item, type: 1 });
  //     });
  //   }

  //   for (var i = 0; i < error1.length; i++) {
  //     error1[i].split('').forEach(item => {
  //       words.push({ w: item, type: 1 });
  //     });
  //   }

  //   let newwords = words.splice(0, 60);

  //   newwords.sort(function(x, y) {
  //     return 0.5 - Math.random();
  //   });
})
//获取应用实例
const app = getApp()
Page({
  errorList:[],
  count:0,
  rightVoide: app.globalData.rightVoice,
  wrongVoice: app.globalData.wrongVoice,
  countErr:0,
  // isAnswer: false,
  data:{
    mapMode: {
      '1': '自由模式',
      '2': '闯关模式'
    },
    modeType: '1',
    poetry: {},
    titlePage:'',
    poetryData:[],
    rightCount: 0,
    errorCount: 0,
    woringAgain:0,
    isAnswer:false,
    allMedthos:[]
  },
  onChoose(data){
    if(this.data.isAnswer) {
      wx.$util.showToast('答完了~')
      return
    }

    let value = data.currentTarget.dataset.data
    let index = data.currentTarget.dataset.index
    let parent = data.currentTarget.dataset.parent
    let list = this.data.poetryData
    let rightCount = this.data.rightCount
    let woringAgain  = this.data.woringAgain
    let errorCount = this.data.errorCount
    let isAnswer = this.data.isAnswer
    if(value.check == 2) {
      wx.$util.showToast('这是对的~')
      return
    }
    if(value.result == 1) {
      list[parent].data[index].check =2
      woringAgain ++
      if(woringAgain >= 3) {
        this.countErr++
        if(this.countErr > 3) {
          console.log('重答')
          wx.$util.playVideo(this.wrongVoice, ()=>{
            this.setData({isAnswer: true})
          })
          this.selectComponent("#wrongDialog").showDialog();
          return
        }

        wx.$util.showToast('题目将更新~')
        setTimeout(()=>{
          this.dealDetail()
          woringAgain=0
          this.count=0
          this.setData({rightCount:0, woringAgain:0})
        }, 1000)
      }

     
    }

    if(value.result == 0) {
      list[parent].data[index].check = 1
      woringAgain = 0
      rightCount ++
      if(errorCount - rightCount == 0) {
        wx.$util.playVideo(this.rightVoide, ()=>{
          this.setData({isAnswer: true})
        })
        this.selectComponent("#rightDialog").showDialog(); 

        this.setData({poetryData: list, rightCount, woringAgain})
        return
      }
    }
    this.setData({poetryData: list, rightCount, woringAgain})
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
  getDetail(){
    let pms = {poetry_id: this.poetryId}
    wx.$api.poetryDetail(pms).then(res => {
      let poetry = res
      wx.setNavigationBarTitle({
        title: res.title
      })
      this.poetry = poetry
      this.dealDetail()
    })
  },
  dealDetail(){
    let content = this.poetry.content
    let poetryArr = wx.$util.dealStudyPoetry(content)
    let arr = []
    poetryArr.forEach((item,index) => {
      let words = wx.$util.cutfh(item)
      let wordsArr = words.split('')
      let a = []
      wordsArr.forEach((it, ind) => {
        let obj = {
          word: it,
          result: 1,
          number: this.count++
        }
        a.push(obj)
      })
      arr.push({
        data: a
      })
    })
    let err = []
    for(var i=0;i<this.count; i++) {
      err.push(i)
    }
    this.getErrorList(()=>{
      let errWords = this.errorList.splice(0, 10)
      let words = []
      errWords.forEach(item => {
        let wordsArr = item.poetry_sen.split('')
        wordsArr.forEach(ii => {
          words.push(ii)
        })
      })
      let mixErr = wx.$util.shuffle(err)
      let elength = wx.$util.getRandom(5, 8)
      let resultErr = mixErr.splice(0, elength)
      for(var i=0; i<resultErr.length; i++) {
        arr.forEach((item,index) => {
          item.data.forEach((iit, iin) => {
            if(iit.number == resultErr[i]) {
              let randomWords = wx.$util.getRandom(0, errWords.length)
              arr[index].data[iin].errWrods = words[randomWords]
              arr[index].data[iin].result = 0
            }
          })
        }) 
      }
      this.setData({poetryData: arr, errorCount: elength})
      console.log(arr, 'arr')
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
    // this.createShareKey()
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
  createShareKey: function(){
    let pms = this.option
    pms.page = '/st-find/st-find'
    wx.$api.shareAdd({value: JSON.stringify(pms)}).then(res => {
      this.shareKey = res
    })

  },
  onShareAppMessage: function () {
    let pms = this.option
    pms.page = '/st-find/st-find'
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
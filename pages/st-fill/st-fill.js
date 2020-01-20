
const app = getApp()
Page({
  rightVoide: app.globalData.rightVoice,
  wrongVoice: app.globalData.wrongVoice,
  teachers: app.globalData.teachers,
  rightPoetry:{},
  data:{
    mapMode: {
      '1': '自由模式',
      '2': '闯关模式'
    },
    modeType: '1',
    poetry: {},
    poetryArr: [],
    meAvatars: '',
    teacherAvatars: '',
    currentPoetryIndex: 0,
    poetryDetail: '',
    isResult: true,
    titlePage:'',
    allMedthos:[]
  },
  getInput(value){
    this.setData({
      poetryDetail: value.detail.value
    })
  },
  getDetail(){
    let pms = {poetry_id: this.poetryId}
    const answerType = [1, 2] //1 - 自己，  2 - 老师
    wx.$api.poetryDetail(pms).then(res => {
      let poetry = res
      wx.setNavigationBarTitle({
        title: res.title
      })
      poetry.title = poetry.title.substring(0, 5)
      let poetryArr = wx.$util.dealStudyPoetry(poetry.content)
      let resultArr = []
      poetryArr.forEach(item => {
        resultArr.push({
          poetry: wx.$util.cutfh(item),
          show: this.getRandomDetail(answerType),
          isFirst: false
        })
      })
      this.rightPoetry = wx.$util.deepClone(resultArr)
      this.setData({
        poetryArr: resultArr,
        poetry
      })
      this.getTeacherRead()
    })
  },
    dealResult(current){
      setTimeout(()=>{
          let err = []
          for(let i=0; i<current.length; i++) {
            if(this.rightPoetry[i].show == 1) {
              if( current[i].poetry != this.rightPoetry[i].poetry) {
                err.push(i)
                current[i].show = 4
              } else {
                current[i].show = 3
              }
            }
          }
          if(err.length == 0) {
            wx.$util.playVideo(this.rightVoide, ()=>{
              this.setData({
                poetryArr:current,
                isResult: false
              })
            })
            this.selectComponent("#rightDialog").showDialog(); 
          }else {
            wx.$util.playVideo(this.wrongVoice, ()=>{
              this.setData({
                poetryArr:current,
                isResult: false
              })
            })
            this.selectComponent("#wrongDialog").showDialog();
          }
      }, 1000)
  },
  getTeacherRead(){
    let resultArr = this.data.poetryArr
    if(resultArr[resultArr.length - 1].isFirst) {
      this.dealResult(resultArr)
    }

    let count = 0
    for(let i = this.data.currentPoetryIndex; i<resultArr.length; i++) {
      if(resultArr[i].show == 2) {
        count = count + 1500 * Math.abs(i / resultArr.length)
        setTimeout(()=>{
          resultArr[i].isFirst = true
          this.setData({
            poetryArr: resultArr,
            currentPoetryIndex: i
          })
          
          if(resultArr[resultArr.length - 1].isFirst) {
            this.dealResult(resultArr)
          }

        }, count)
      }else {
        // this.selectComponent("#rightDialog").showDialog(); 
// this.selectComponent("#wrongDialog").showDialog();
        setTimeout(()=>{
          this.setData({
            currentPoetryIndex: i
          })
        }, count + 1000)
        return
      }
  }
  },
  getRandomDetail(avatars){
    let max = avatars.length - 1
    let min = 0
   return avatars[Math.floor(Math.random() * (max - min + 1) + min)];
  },
  onSubmit(){
    if(!this.data.poetryDetail) {
      wx.$util.showToast('请输入诗句~')
      return
    }
    let index = this.data.currentPoetryIndex
    let resultArr = this.data.poetryArr
    resultArr[index].poetry = this.data.poetryDetail
    resultArr[index].isFirst = true

    

    this.setData({
      poetryArr: resultArr,
      currentPoetryIndex: index + 1
    })
    this.setData({ poetryDetail: '' })
    this.getTeacherRead()
  },
  onLoad(e) {
    this.poetryId = e.poetry_id
    this.authorId = e.author_id
    this.option = e
    wx.$local.poetryOption = e
    this.setData({
      modeType: e.study_mode,
      meAvatars: this.getRandomDetail(this.teachers)
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
  onShareAppMessage: function () {
    let pms = this.option
    pms.page = '/st-fill/st-fill'
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
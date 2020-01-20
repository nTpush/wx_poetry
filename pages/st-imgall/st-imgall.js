//获取应用实例
const app = getApp()
Page({
  rightVoide: app.globalData.rightVoice,
  wrongVoice: app.globalData.wrongVoice,
  currentResult: 0,
  data:{
    mapMode: {
      '1': '自由模式',
      '2': '闯关模式'
    },
    modeType: '1',
    poetry: {},
    poetryImage: '',
    imgList:[],
    chooseList:[],
    isCheck: false,
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
    this.getImg()
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
  onKnoew(){
    wx.$util.showToast('答完了')
  },
  onChoose(data){
    let result = data.target.dataset.data
    let index = data.target.dataset.index 
    let imgList = this.data.imgList
    let chooseList = this.data.chooseList
      
    // wx.$util.playVideo(this.rightVoide, ()=>{})
    // this.selectComponent("#rightDialog").showDialog(); 
    // chooseList[index].c = 1
    imgList[this.currentResult].show = 2
    imgList[this.currentResult].c = 1
    imgList[this.currentResult].r = chooseList[index]
    this.currentResult++
    if(this.currentResult > imgList.length - 1) {
      console.log('全部学完')
      imgList[this.currentResult - 1].show = 2
      let isRight = []
      chooseList.forEach((item,index)=>{
        item.c = 1
       

      })

      imgList.forEach((item,index) => {
        if(item.result != item.r.result) {
          isRight.push(index)
        }
      })

      if(isRight.length) {
        wx.$util.playVideo(this.wrongVoide, ()=>{})
        this.selectComponent("#wrongDialog").showDialog(); 

      }else {
          wx.$util.playVideo(this.rightVoide, ()=>{})
         this.selectComponent("#rightDialog").showDialog(); 
      }

        console.log(isRight, 'imgList')


      this.setData({isCheck: true, chooseList})
    }else {
      imgList[this.currentResult].show = 1
    }

    this.setData({imgList, chooseList})

  },
  getImg() {
    let pms = {poetry_id: this.poetryId}
    wx.$api.poetryImage(pms).then(res => {
      let w = 700;
      let h = 450;
      let rect = 120;
      const arrLap = (arr, result) => {
        let err;
        for (let i = 0; i < arr.length; i++) {
          if (this.isOverlap(arr[i], result)) {
            err = arr[i];
          }
        }
        if (!err) {
          return true;
        } else {
          return false;
        }
      };
      let arr = [
        {
          x: wx.$util.getRandom(10, w - rect - 10),
          y: wx.$util.getRandom(10, h - rect - 10),
          width: rect,
          height: rect,
        },
      ];
      for (var i = 0; i < 5; i++) {
        let obj = {
          x: wx.$util.getRandom(10, w - rect - 10),
          y: wx.$util.getRandom(10, h - rect - 10),
          width: rect,
          height: rect,
        };
        if (arrLap(arr, obj)) {
          arr.push(obj);
        }
      }
      arr.forEach((item,index) => {
        if(index ===0) {
          item.show = 1
          this.currentResult = index
        }else {
          item.show = 0
        }
        item.result = index
      })

      let copyArr =  wx.$util.deepClone(arr)

      let chooseList = wx.$util.shuffle(copyArr)

      this.setData({poetryImage: res.src, imgList: arr, chooseList})
      
    })
  },
   isOverlap(rect1, rect2) { 
    const l1 = { x: rect1.x, y: rect1.y };
    const r1 = { x: rect1.x + rect1.width, y: rect1.y + rect1.height };
    const l2 = { x: rect2.x, y: rect2.y };
    const r2 = { x: rect2.x + rect2.width, y: rect2.y + rect2.height };
    if (l1.x > r2.x || l2.x > r1.x || l1.y > r2.y || l2.y > r1.y) return false;
    return true;
  },
  onShareAppMessage: function () {
    let pms = this.option
    pms.page = '/st-imgall/st-imgall'
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
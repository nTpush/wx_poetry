Page({
  author: null,
  data:{
    poetry: {},
    author: {},
    poetryIndex: 0,
    scrollTop: 0,
    authorIndex: 0,
    isShowTop: false
  },
  getDetail(){
    let pms = {poetry_id: this.poetryId}
    wx.$api.poetryDetail(pms).then(res => {
      let poetry = res
      poetry.content = wx.$util.dealPoetryContent(poetry.content)
      poetry.xx.forEach(item => {
        item.content = wx.$util.dealDetailContent(item.content)
        item.content = item.content.replace( /\《(.+?)\》/g, ($a, $b) => {
          return `<span class="red">${$a}</span>`
        })
      })
      poetry.author.intro =  poetry.author.intro.replace( /\《(.+?)\》/g, ($a, $b) => {
        return `<span class="red">${$a}</span>`
      })
      this.setData({poetry})
    })
  },
  authorLess(){
    this.setData({author: []})
  },
  authorMore(){
    if(this.author) {
      this.setData({author: this.author})
      return
    }
    let pms = {author_id: this.authorId}
    wx.$api.authorDetail(pms).then(res => {
      this.author = res
      this.author.aa.forEach(item => {
        item.content = wx.$util.dealDetailContent(item.content)
        item.content = item.content.replace( /\《(.+?)\》/g, ($a, $b) => {
          return `<span class="red">${$a}</span>`
        })
      })
      this.setData({author: this.author})
    })
  },
  onLoad(e) {
    this.poetryId = e.poetry_id
    this.authorId = e.author_id
    this.option = e
    this.getDetail()
  },
  onClickItem(e) {
    let poetryIndex = e.currentTarget.dataset.index
    this.setData({poetryIndex})
  },
  onClickItemAuthor(e) {
    let authorIndex = e.currentTarget.dataset.index
    this.setData({authorIndex})
  },
  onGoTop(){
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  onPageScroll:function(e){
    if(e.scrollTop > 400) {
      this.setData({isShowTop: true})
    }else {
      this.setData({isShowTop: false})
    }
  },
  goMode() {
    wx.$util.navigateTo('/mode/mode', {author_id: this.authorId , poetry_id: this.poetryId})
  },
  onShareAppMessage: function () {
    let pms = this.option
    pms.page = '/detail/detail'
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
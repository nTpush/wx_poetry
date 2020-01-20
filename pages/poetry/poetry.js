Page({
  page: 1,
  data:{
    list: [],
    total: 0,
    hasMoreData: true,
    isShowLoading: false,
    keyword: '',
    isShowTop: false,
    className: ''
  },
  getInput(data){
    let keyword = data.detail.value
    this.setData({keyword})
  },
  getClassDetail(){
    let pms = {class_id: this.id}
    wx.$api.classDetail(pms).then(res=> {
        this.setData({className: res.name})
    })
  },
  dealToDetail(e){
    let {author_id, poetry_id} = e.currentTarget.dataset.data
    wx.$util.navigateTo('/detail/detail', {author_id, poetry_id})
  },
  onSearch(){
    if(!this.data.keyword) {
      wx.$util.showToast('请输入关键字')
      return
    }
    this.page = 1
    this.setData({list: [], hasMoreData: true})
    this.queryPoetryList()
  },
  onClose(){
    this.setData({keyword: '', hasMoreData: true})
    this.page = 1
    this.setData({list: []})
    this.queryPoetryList()
  },
  queryPoetryList(){
    let pms = {class_id: this.id, page: this.page, search_value: this.data.keyword}
    this.setData({isShowLoading: true})
    wx.$api.poetryList(pms).then(res=> {
      this.setData({isShowLoading: false})
      if(res.data.length === 0) {
        console.log('null')
        this.setData({hasMoreData: false})
        return
      }
      let list = this.data.list
      list = [...list, ...res.data]
      list.forEach((item)=> {
       item.poetry_content =  wx.$util.dealPoetryContent(item.poetry_content)
      })
      let total = res.total
      this.setData({list, total})
    })
  },
  onPullDownRefresh: function () {
    this.queryPoetryList()//数据请求
  },
  onReachBottom: function(){
    if(!this.data.hasMoreData) return
    this.page = this.page + 1
    this.queryPoetryList()
  },
  onLoad: function(e) {
    this.id = e.id
    this.queryPoetryList()
    this.getClassDetail()
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
  }
})
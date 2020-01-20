Page({
  data:{
    HD:{}
  },
  getHomeDetail() {
    wx.$api.home().then(res=> {
      let HD = res
      HD.poetrys.data.forEach(item => {
        item.content = item.content.trim()
      })
      HD.classes.forEach(item => {
        item.modules && item.modules.forEach((i) => i.img = i.img.trim())
      })
      this.setData({HD})
    })
  },
  onGoClass(){
    let ids = [1,2,3,4,5,6,7]
    let length = ids.length - 1
    let random = parseInt(Math.random()*(length-0+1)+0,10)
    let pms = {id: ids[random]}
    wx.$util.navigateTo('/class/class', pms)
  },
  dealOnClick(data){
    if(wx.$local.token) return

    let pms = {isNeedLogin: 1}
    wx.$util.redirectTo('/index/index', pms)
  },
  dealOnMore(data){
    let pms = {id: data.detail.id ? data.detail.id : 1}
    wx.$util.navigateTo('/class/class', pms)
  },
  dealToClass(data){
    let pms = {id: data.detail.id}
    wx.$util.navigateTo('/poetry/poetry', pms)
  },
  dealGoDetail(data){
    let poetry_id = data.detail.poetry_id
    let author_id = data.detail.author_id
    wx.$util.navigateTo('/detail/detail', {poetry_id, author_id})
  },
  onLoad: function(){
    this.getHomeDetail()
  }
})
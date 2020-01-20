
Page({
  currentId:0,
  data:{
    list: [],
    currentIndex: 0,
  },
  getClassList: function(){
    wx.$api.classes().then(res=>{
      this.setData({list: res})
      this.setCurrentIndex(this.currentId)
    })
  },
  onChangeClass: function(e){
    let data = e.currentTarget.dataset.key
    this.setCurrentIndex(data.s_id)
  },
  setCurrentIndex(id){
    this.setData({
      currentIndex: this.data.list.findIndex(item => item.s_id === id)
    })
  },
  dealToClass(e){
    let pms = {id: e.currentTarget.dataset.data.id}
    wx.$util.navigateTo('/poetry/poetry', pms)
  },
  onLoad: function(o){
    this.currentId = Number(o.id)
    this.getClassList()
  }
})
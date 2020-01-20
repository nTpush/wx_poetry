Page({
  data: {
    methods: []
  },
  getMethod(){
    wx.$api.studMethod().then(res=> {
      this.setData({methods: res})
    })
  },
  goStudy(e){
    const { method_status, id, method_path } = e.currentTarget.dataset.data
    if(!method_status) {
        wx.$util.showToast('暂未开放~')
        return
    }
    wx.$local.studyMethod = id
    wx.$util.redirectTo(method_path, {author_id: this.authorId , poetry_id: this.poetryId, study_mode: this.studyMode, study_method: id })
  },
  onLoad: function (e) {
    this.poetryId = e.poetry_id
    this.authorId = e.author_id
    this.studyMode = e.study_mode
    this.getMethod()
  },
  onShareAppMessage: function () {

  }
})
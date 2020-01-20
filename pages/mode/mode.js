Page({
    data:{
        modes: []
    },
    getModeList(){
        wx.$api.studyMode().then(res=> {
            this.setData({modes: res})
        })
    },
    goMethod(e){
        const { mode_status, id } = e.currentTarget.dataset.data
        if(!mode_status) {
            wx.$util.showToast('暂未开放~')
            return
        }
        wx.$local.studyMode = id
        wx.$util.redirectTo('/method/method', { author_id: this.authorId , poetry_id: this.poetryId, study_mode: id })
    },
    onLoad(e) {
        this.poetryId = e.poetry_id
        this.authorId = e.author_id
        wx.$util.redirectTo('/method/method', { author_id: this.authorId , poetry_id: this.poetryId, study_mode: 1 })
        this.getModeList()
    }
})
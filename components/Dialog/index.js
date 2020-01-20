Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
  },
  data: {
    isShow: false,
    isRun: false,
    upDown: 0
  },
  methods: {
    //隐藏弹框
    hideDialog() {
      this.setData({
        isRun: false,
        upDown: '100%'
       })
      setTimeout(() => {
        this.setData({
          isShow: false,
          upDown: 0
        })
      }, 500);
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: true,
       })
       setTimeout(() => {
         this.setData({
          isRun: true,
          upDown: '40%'
         })
       }, 100);
    }
  }
})

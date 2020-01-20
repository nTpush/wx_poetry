const app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    method: {
      type: String,
      default: '品'
    },
    list: {
      type: Array
    }
  },
  data: {
    fds: wx.$util.shuffle(app.globalData.fds),
    isShow: false,
    isss: false
  },
  created(){
    setTimeout(()=>{
      this.setData({isss: true})
    }, 5000)
  },
  methods: {
    close() {
      this.setData({isShow: true})
    },
    show() {
      this.setData({isShow: false})
    },
    jump(data) {
      let value = data.currentTarget.dataset.data
      let method_path = value.method_path
      delete value.method_path
      delete value.id
      delete value.method_order
      delete value.method_status
      delete value.method_title
      delete value.method_image
      wx.$util.redirectTo(method_path, value)
    }
  }
})

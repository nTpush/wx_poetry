Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    typeName: {
      type: String,
    },
    methodName: {
      type: String,
    }
  },
  data: {
  },
  methods: {
    GoHome(){
      let data = wx.$local.poetryOption
      delete data.study_method
      delete data.study_mode
      data.study_mode = 1
      wx.$util.redirectTo('/method/method', data)
    }
  }
})

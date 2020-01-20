Component({

  properties: {
    data: Object
  },

  created(){
  },
  methods: {
    dealOnClick(){
      this.triggerEvent('dealOnClick', this.data.data)
    }
  }
})

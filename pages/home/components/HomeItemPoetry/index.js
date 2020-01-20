Component({

  properties: {
    data: Object
  },

  created(){
  },
  methods: {
    onGoDetail(){
      this.triggerEvent('dealGoDetail', this.data.data)
    }
  }
})

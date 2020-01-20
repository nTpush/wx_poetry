Component({

  properties: {
    data: Object
  },

  created(){
  },
  methods: {
    onMore(){
      this.triggerEvent('dealOnMore', this.data.data)
    },
    toClass(e){
      this.triggerEvent('dealToClass', e.currentTarget.dataset.data)
    }
  }
})

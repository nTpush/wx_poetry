var timer = 0;
Component({
  properties: {
    time: {
      type: String,
    },
  },

  data: {
     clock: null
  },

  attached (){
    this.cutDownTime()

    console.log(this.data.time, 11)
    // console.log(new Date().getTime())
    // console.log(this.timeFormat(156970115301120480)) 1569716936620 156972126018
  },
  methods: {
    cutDownTime() {
      timer = setInterval(() => { 
        let end = Number(this.data.time) + 86400 * 1000
        let now = new Date().getTime()
        let leftTime = end - now
        if(leftTime >= 0) {
          this.setData({ clock: this.timeFormat(leftTime)})
        }else {
          this.setData({ clock: null})
          clearInterval(timer)
        }
      }, 1000)
    },
    timeFormat(leftTime){
     var days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数   
	   var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时   
	   var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟   
	   var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数   
     return  {days, hours, minutes, seconds}
    }
  }
})

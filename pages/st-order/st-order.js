//获取应用实例
const app = getApp()
Page({
  rightVoide: app.globalData.rightVoice,
  wrongVoice: app.globalData.wrongVoice,
  data: {
    allMedthos:[],
    titlePage:'',
    pageStatus:'',
    optionsListData:[],
    movableViewPosition:{
        x:0,
        y:0,
        className:"none",
        data:{
          icon_type:1,
          is_complete:true
        }
    },
    scrollPosition:{
        everyOptionCell:110,  //原 136，   122改99
        top:0, 
        scrollTop:0,
        scrollY:true,
        scrollViewHeight:1334,
        scrollViewWidth:375,
        windowViewHeight:1334,
    },
    selectItemInfo:{
        title:"",
        address:"",
        desc:"",
        selectIndex: -1,
        selectPosition:0,
    },
    flag:0,
    show_assistant:true,
    animation_flag:'',
    page:0,
    has_next:false,
    isShow: false,
    move_type:'',
    navigationBarTitle:'',
    mapMode: {
      '1': '自由模式',
      '2': '闯关模式'
    },
    modeType: '1',
    isResult: false,
    isFirst: false

  },
   longpressfuc:function(e){
      var movableViewPosition={
          x:0,
          y:0,
          className:"none",
          data:{
            icon_type:1,
            is_complete:true
          }
      };
      this.setData({
        movableViewPosition:movableViewPosition
      })
      this.scrollTouchStart(e);

    },
   //设置高度
   bindscroll:function (event) {
        var scrollTop = event.detail.scrollTop;
        this.setData({
            'scrollPosition.scrollTop':scrollTop
        })
    },
    getOptionInfo:function (id) {
        for(var i=0,j=this.data.optionsListData.length;i<j;i++){
            var optionData= this.data.optionsListData[i];
            if(optionData.id == id){
                optionData.selectIndex = i;
                return optionData;
            }
        }
        return {};
    },
    getPositionDomByXY:function (potions) {
        var y = potions.y-this.data.scrollPosition.top+this.data.scrollPosition.scrollTop-81;
        var optionsListData = this.data.optionsListData;
        var everyOptionCell = this.data.scrollPosition.everyOptionCell;
        for(var i=0,j=optionsListData.length;i<j;i++){
            if(y>=i*everyOptionCell&&y<(i+1)*everyOptionCell){
                return optionsListData[i];
            }
        }
        return optionsListData[0];
    },
    draggleTouch:function (event) {
        var touchType = event.type;
        switch(touchType){
            case "touchstart":
                this.scrollTouchStart(event);
                break;
            case "touchmove":
                this.scrollTouchMove(event);
                break;
            case "touchend":
                this.scrollTouchEnd(event);
                break;
        }
    },
    scrollTouchStart:function (event) {
        var that=this;

        if(!this.data.isFirst) {
          this.setData({isFirst: true})
        }

        // console.log('开始');
        var firstTouchPosition = {
            x:event.changedTouches[0].pageX,
            y:event.changedTouches[0].pageY,
        }
        // console.log("firstTouchPosition:",firstTouchPosition);
        var domData = that.getPositionDomByXY(firstTouchPosition);
        domData.show_delet = false;

        // 排序时禁止已完成card移动------start--------
        if(that.data.move_type != 'reset_status' && domData.is_complete){
          that.setData({
            movableViewPosition:{
                x:0,
                y:0,
                className:"none",
                data:{
                  icon_type:1,
                  is_complete:true
                }
            }
          })
          return false;
        }
        var movableX = 0;
        var movableY = firstTouchPosition.y-that.data.scrollPosition.top-that.data.scrollPosition.everyOptionCell/2;

        that.setData({
            movableViewPosition:{
                x:movableX,
                y:movableY,
                className:"none",
                data:domData
            }
        })

        setTimeout(function(){
          that.setData({
              movableViewPosition:{
                  x:movableX,
                  y:movableY,
                  className:"",
                  data:domData
              }
          })
        },10)
        var id = domData.id;
        var secInfo = that.getOptionInfo(id);
        secInfo.selectPosition =  event.changedTouches[0].clientY;
        secInfo.selectClass = "dragSelected";

        that.data.optionsListData[secInfo.selectIndex].selectClass = "dragSelected";

        var optionsListData = that.data.optionsListData;

        that.setData({
            'scrollPosition.scrollY':false,
            selectItemInfo:secInfo,
            optionsListData:optionsListData,
            'scrollPosition.selectIndex':secInfo.selectIndex
        })
    },
    scrollTouchMove:function (event) {//频繁setdata导致性能问题，页面拖动卡顿
        // console.log('移动');
        var that=this;
        var selectItemInfo = that.data.selectItemInfo;
        var selectPosition = selectItemInfo.selectPosition;
        var moveDistance   = event.changedTouches[0].clientY+81;
        var everyOptionCell = that.data.scrollPosition.everyOptionCell;
        var optionsListData = that.data.optionsListData;
        var selectIndex = selectItemInfo.selectIndex;

        // console.log("event.changedTouches:",event.changedTouches);
        //movable-area滑块位置处理
        var movableX = 0;
        var movableY = event.changedTouches[0].pageY-that.data.scrollPosition.top-that.data.scrollPosition.everyOptionCell/2;


        that.setData({
            movableViewPosition:{
                x:movableX,
                y:movableY,
                className:"",
                data:that.data.movableViewPosition.data
            }
        })

        if(moveDistance - selectPosition > 0 && selectIndex < optionsListData.length - 1){
            if (optionsListData[selectIndex].id == selectItemInfo.id) {
                optionsListData.splice(selectIndex, 1);
                optionsListData.splice(++selectIndex, 0, selectItemInfo);
                selectPosition += everyOptionCell;
            }
        }

        if (moveDistance - selectPosition < 0 && selectIndex > 0) {
            if (optionsListData[selectIndex].id == selectItemInfo.id) {
                optionsListData.splice(selectIndex, 1);
                optionsListData.splice(--selectIndex, 0, selectItemInfo);
                selectPosition -= everyOptionCell;
            }
        }

        that.setData({
            'selectItemInfo.selectPosition': selectPosition,
            'selectItemInfo.selectIndex': selectIndex,
            optionsListData: optionsListData,
        });

    },
    scrollTouchEnd:function (event) {
        // console.log('结束');
        var that=this;
        var optionsListData = that.optionsDataTranlate(that.data.optionsListData,"");

        that.setData({
            optionsListData:optionsListData,
            'scrollPosition.scrollY':true,
            'movableViewPosition.className':"none",
            'movableViewPosition.is_complete':true
        })
        var movableViewPosition={
            x:0,
            y:0,
            className:"none",
            data:{
              icon_type:1,
              is_complete:true
            }
        };
        if(that.data.move_type != 'reset_status'){
          // console.log('排序');
            that.setData({
              movableViewPosition:movableViewPosition
            })
            var selectItemInfo = that.data.selectItemInfo;
            for(let i=0;i<optionsListData.length;i++){
              if(selectItemInfo.id == optionsListData[i].id){
                  if(optionsListData[i].sortNum == i){//原有顺序=当前顺序，未改变位置
                    return false;
                  }
                  var relation_id='';
                  if(i == 0){//移动后处于首位，上移
                    relation_id=optionsListData[i+1].id;
                    that.updateList(selectItemInfo.id,'reset_weight',relation_id);
                    return false;
                  }
                  if(i == (optionsListData.length - 1) ){//移动后处于末尾位，下移
                    relation_id=optionsListData[i-1].id;
                    that.updateList(selectItemInfo.id,'reset_weight',relation_id);
                    return false;
                  }

                  var pre_num=optionsListData[i-1].sortNum;//上一条数据初始顺序
                  var curr_num=optionsListData[i].sortNum;//移动数据初始顺序
                  if(pre_num > curr_num){ //下移
                    relation_id=optionsListData[i-1].id;
                    that.updateList(selectItemInfo.id,'reset_weight',relation_id);
                  }else{//上移
                    relation_id=optionsListData[i+1].id;
                    that.updateList(selectItemInfo.id,'reset_weight',relation_id);
                  }
              }
            }
            
        }else{
          that.setData({
            movableViewPosition:movableViewPosition
          })
        }
        console.log(that.data);
    },
    optionsDataTranlate:function (optionsList,selectClass) {
        for(var i=0,j=optionsList.length;i<j;i++){
            optionsList[i].selectClass = selectClass;
        }
        return optionsList;
    },
    onLoad: function (e) {
        this.poetryId = e.poetry_id
        this.authorId = e.author_id
        this.option = e
        wx.$local.poetryOption = e
        this.setData({
          modeType: e.study_mode
        })
        var systemInfo= wx.getSystemInfoSync();
        // 开始加载页面
        var scrollViewHeight = systemInfo.windowHeight;
        var scrollViewWidth = systemInfo.windowWidth;
        this.setData({
            'scrollPosition.scrollViewWidth':scrollViewWidth,
            'scrollPosition.scrollViewHeight':scrollViewHeight,
            'scrollPosition.windowViewHeight':systemInfo.windowHeight,
        });
        this.setData({
          img_path:''
        })

        var that=this;
        that.setData({
          page:0
        })
        that.getData();
        that.pageInit();
        this.getMethos()
        //{{img_path}}
    },
    getMethos() {
      wx.$api.studMethod().then(res => {
        let title = res.find(item => item.id == this.option.study_method)
        let newArr = []
        res.forEach(item => {
          if(item.id != this.option.study_method && item.method_status != 0) {
            newArr.push(item)
          }
        })
        let afterArr = wx.$util.shuffle(newArr)
        afterArr.forEach(item => {
          item.poetry_id = this.poetryId
          item.author_id = this.authorId
          item.study_mode = this.data.modeType
          item.study_method = this.option.study_method
        })
        this.setData({titlePage: title.method_title, allMedthos: afterArr.splice(0, 3)})
      })
    },
    getData:function(){
      var that=this;
      let pms = {poetry_id: this.poetryId}
      wx.$api.poetryDetail(pms).then(res => {
        let poetry = res
        wx.setNavigationBarTitle({
          title: res.title
        })
        let poetryArr = wx.$util.dealStudyPoetry(poetry.content)
        let newArr = []
        poetryArr.forEach((item, index) => {
          newArr.push({
            id: index + 1,
            title: item,
            desc: '',
            is_complete: false,

          })
        })
        this.rightPoetry = newArr
        this.setData({
          pageStatus:'ok',
          optionsListData: wx.$util.shuffle(newArr),
          move_type:''
        })
      })
    },
    pageInit:function(){
        var that =this;
    },
    updateList:function(id,operate,relation_id){
      var that=this;
      var ajaxData={};
    },
    // onShow: function () {
    //     var that=this;
    //     that.setData({
    //       page:0
    //     })
    //     that.getData();
    //     that.pageInit();
    // },
    onSubmit(){
      let optionsListData = this.data.optionsListData
      let arr = []
      optionsListData.forEach((item,index) => {

        if(item.id !== index+1) {
          arr.push(index)
        }
      })


      if(arr.length) {
        wx.$util.playVideo(this.wrongVoice, ()=>{
          this.setData({isResult: true})
        })
        this.selectComponent("#wrongDialog").showDialog();
      }else {
         wx.$util.playVideo(this.rightVoide, ()=>{
          this.setData({isResult: true})
        })
        this.selectComponent("#rightDialog").showDialog(); 
      }
      console.log(arr, '33')
    },
    dealResult(current){
      if(true) {
       
      }else {
        
      }
    },
    onShareAppMessage: function () {
      let pms = this.option
      pms.page = '/st-order/st-order'
      wx.$api.shareAdd({value: JSON.stringify(pms)}).then(res => {
        this.shareKey = res
        const url = '/pages/index/index?shareKey=' + this.shareKey;
        return {
          title: '一起来背诗吧',
          path: url,
        }
      })
    }
})
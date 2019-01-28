/*
tips:
  存在css3属性和es6字符串模板语法，所有的ie都支持，仅支持高版本Chrome,Firefox
  不适用生成环境，仅用于学习交流
  代码地址：https:
*/
; (function (root) {

  //粒度(li的个数,数值越大越细腻,太大会影响性能)
  var NUM = 120
  //延时的时间系数（s）
  var SECOND = 0.3

  //构造函数
  function Css3Banner(el, opts) {
    this.init(el, opts)
  }

  //实例的个数
  Css3Banner.SIZE = 0

  Css3Banner.prototype = {
    constructor: Css3Banner,
    //入口函数
    init: function (el, opts) {
      //默认参数
      var options = {
        autoMoveTime: 3000,//自动轮播的时间间隔
        runTime: 900,//每一次切换时的运动时间
        callBack: function(index,lastIndex){},//每一次切换完成的回调函数
      }
      //未深度克隆
      for (var item in opts) {
        if (opts.hasOwnProperty(item)) {
          options[item] = opts[item];
        }
      }
      this.$el = el
      this.opts = options
      this.isMove = false
      this.imgIndex = 0
      this.timer = null
      this.SIZE = Css3Banner.SIZE
      this.wrapWidth = el.offsetWidth
      this.wrapHeight = el.offsetHeight
      setTimeout(function(){
        this.render()
        this.bindEvent()
      }.bind(this), 0)
      Css3Banner.SIZE++
    },
    //初始渲染dom
    render: function () {
      var opts = this.opts
        , imgs = opts.imgs
        , imgsNum = imgs.length
        , runTime = opts.runTime
        , wrapWidth = this.wrapWidth
        , wrapHeight = this.wrapHeight
        , itemWidth = wrapWidth / NUM
        , size = this.SIZE
        , picList = ''
        , btnList = ''
        , cssStyle = `.css3-banner-wrap-${size} .pic-box li{
                        width: ${itemWidth}px;
                      }
                      .css3-banner-wrap-${size} .pic-box li div:nth-of-type(1){
                        background-image: url(${imgs[0]});
                        transform: rotateX(0deg) translate3d(0,0,${wrapHeight/2}px);
                      }
                      .css3-banner-wrap-${size} .pic-box li div{
                        background-size: ${wrapWidth}px ${wrapHeight}px;
                      }
                    `
      //下标索引
      for (var j = 0; j < imgsNum; j++) {
        if (j == this.imgIndex) {
          btnList += '<li class="active">' + (j + 1) + '</li>'
        } else {
          btnList += '<li>' + (j + 1) + '</li>'
        }
      }
      //图片粒度列表
      for (var i = 0; i < NUM; i++) {
        picList += '<li><div></div><div></div></li>'
        cssStyle += `.css3-banner-wrap-${size} .pic-box li:nth-of-type(${i + 1}) div{
                        background-position-x: ${-i * itemWidth}px;
                      }
                      .css3-banner-wrap-${size} .pic-box li:nth-of-type(${i + 1}){
                        transition: transform ${(runTime / 1000) - SECOND}s ${SECOND/NUM*i}s;
                      }
                    `
      }
      //生成各元素节点
      var oWrap = document.createElement('div')
        , oPicBox = document.createElement('ul')
        , oBtnList = document.createElement('ol')
        , oBtnLeft = document.createElement('div')
        , oBtnRight = document.createElement('div')
        , oStyle = document.createElement('style')
        , oPicLiStyle = document.createElement('style')
        , oHead = document.head
      oWrap.className = 'css3-banner css3-banner-wrap-' + size
      oPicBox.className = 'pic-box'
      oBtnList.className = 'btn-list'
      oBtnLeft.className = 'btn btn-left'
      oBtnRight.className = 'btn btn-right'
      oPicLiStyle.setAttribute('data-id', 'pic-box-li-' + (++Css3Banner.size))
      oStyle.setAttribute('data-id', 'css3-banner-' + (++Css3Banner.size))
      oStyle.innerHTML = cssStyle
      oPicLiStyle.innerHTML = '.pic-box li{transform: rotateX(0deg);}'
      oHead.appendChild(oStyle)
      oHead.appendChild(oPicLiStyle)
      oPicBox.innerHTML = picList
      oBtnList.innerHTML = btnList
      oWrap.appendChild(oPicBox)
      oWrap.appendChild(oBtnList)
      oWrap.appendChild(oBtnLeft)
      oWrap.appendChild(oBtnRight)

      this.$el.appendChild(oWrap)
      this.$wrap = oWrap
      this.$picBox = oPicBox
      this.$btnList = oBtnList
      this.$PicLiStyle = oPicLiStyle
      this.$btnLeft = oBtnLeft
      this.$btnRight = oBtnRight
    },
    //设置自动轮播事件
    setAutoMove: function(){
      var time = this.opts.autoMoveTime
      function animate(){
        //索引变大轮播
        var index = this.imgIndex + 1
        this.moveFun(index)
        this.timer = setTimeout(animate.bind(this), time)
      }
      this.timer = setTimeout(animate.bind(this), time)
    },
    //绑定事件
    bindEvent: function () {
      var oWrap = this.$wrap
        , btnListClickFn = this.btnListClick.bind(this)
      this.$btnList.addEventListener('click', btnListClickFn, false)
      oWrap.addEventListener('mouseenter', function(){
        clearTimeout(this.timer)
      }.bind(this), false)
      oWrap.addEventListener('mouseleave', function(){
        if (this.opts.autoMoveTime) {//是否设置轮播事件
          this.setAutoMove()
        }
      }.bind(this), false)
      this.$btnLeft.addEventListener('click', function(){
        var index = this.imgIndex - 1
        this.moveFun(index)
      }.bind(this), false)
      this.$btnRight.addEventListener('click', function(){
        var index = this.imgIndex + 1
        this.moveFun(index)
      }.bind(this), false)
      if (this.opts.autoMoveTime){//是否设置轮播事件
        this.setAutoMove()
      }
    },
    //绑定下标列表事件函数
    btnListClick: function (e) {
      var target = e.target
      var index = this.getDomIndex(target)
      this.moveFun(index)
    },
    //图片翻转运动函数
    moveFun: function (nextIndex) {
      //如果图片正在运动就不进行后续执行
      if(this.isMove) return
      var curImgIndex = this.imgIndex
      //如果当前索引等于下一个索引也不进行后续执行
      if(nextIndex == curImgIndex) return
      this.isMove = true
      var imgs = this.opts.imgs
        , imgsLen = imgs.length
        , runTime = this.opts.runTime
        , size = this.SIZE
        , wrapHeight = this.wrapHeight
        , rotateX
      if (nextIndex >= imgsLen) {
        nextIndex = 0
      }
      if(nextIndex < 0){
        nextIndex = imgsLen - 1
      }
      //改变下标
      var btnListDom = this.$btnList.children
      for (var i = 0, len = btnListDom.length; i < len; i++) {
        btnListDom[i].className = ''
      }
      btnListDom[nextIndex].className = 'active'
      //改变图片
      //判断往上翻还是往下翻
      if (nextIndex < curImgIndex && Math.abs(nextIndex - curImgIndex) < imgs.length / 2) {
        rotateX = -1
      } else if (nextIndex > curImgIndex && Math.abs(nextIndex - curImgIndex) > imgs.length / 2) {
        rotateX = -1
      }else{
        rotateX = 1
      }
      var picLiStyle = `
          .css3-banner-wrap-${size} .pic-box li{
            transform: rotateX(${rotateX * 90}deg);
          }
          .css3-banner-wrap-${size} .pic-box li div:nth-of-type(1){
            background-image: url(${imgs[curImgIndex]});
            transform: rotateX(0deg) translate3d(0,0,${wrapHeight / 2}px);
          }
          .css3-banner-wrap-${size} .pic-box li div:nth-of-type(2){
            background-image: url(${imgs[nextIndex]});
            transform: rotateX(${-rotateX * 90}deg) translate3d(0,0,${wrapHeight / 2}px);
          }
        `
      this.imgIndex = nextIndex
      setTimeout(this.returnLi.bind(this, nextIndex, curImgIndex), runTime)
      this.$PicLiStyle.innerHTML = picLiStyle
    },
    //不过渡返回原来li位置,并改变图片(骗人眼球)
    returnLi: function (index, lastIndex) {
      var curImgIndex = this.imgIndex
        , imgs = this.opts.imgs
        , callBack = this.opts.callBack
        , size = this.SIZE
        , picLiStyle = `
          .css3-banner-wrap-${size} .pic-box li{
            transition: none !important;
            transform: rotateX(0deg);
          }
          .css3-banner-wrap-${size} .pic-box li div:nth-of-type(1){
            background-image: url(${imgs[curImgIndex]}) !important;
          }
        `
      this.$PicLiStyle.innerHTML = picLiStyle
      this.isMove = false
      callBack && callBack(index, lastIndex)
    },

    //获取该元素的兄弟元素
    sibling: function (dom) {
      var allDom = dom.parentNode.children
      var sibling = []
      for (var i = 0, len = allDom.length; i < len; i++) {
        if (allDom[i] !== dom) {
          sibling.push(allDom[i])
        }
      }
      return sibling
    },
    //获取该元素在兄弟元素的索引
    getDomIndex: function(dom){
      var allDom = dom.parentNode.children
      for (var i = 0, len = allDom.length; i < len; i++) {
        if (allDom[i] === dom) {
          return i
        }
      }
      return -1
    }

  }

  //处理el是否为多个(id/class)的逻辑，对传入的dom挂载节点进行错误验证
  function factory(opts) {
    var el = opts.el
    delete opts['el']
    if (typeof el === 'string') {
      var reg = /^#([\w\W]+)$/g
      if (reg.test(el)) {
        //id选择器
        el = document.querySelector(el)
      } else {
        //class或标签选择器
        el = document.querySelectorAll(el)
      }
    }
    if (typeof el === 'object' && el !== null) {
      var len = el.length
      if (len) {
        var bannerArr = []
        for (var i = 0; i < len; i++) {
          if (el[i] instanceof Element) {
            bannerArr.push(new Css3Banner(el[i], opts))
          } else {
            throw new Error('el属性中的dom不存在！')
          }
        }
        return bannerArr
      } else {
        if (el instanceof Element) {
          return new Css3Banner(el, opts)
        } else {
          throw new Error('el属性中的dom不存在！')
        }
      }
    } else {
      throw new Error('请为el属性配置一个正确的dom对象或者css(id或class)选择器字符串！')
    }
  }

  root.Css3Banner = factory
}(window));


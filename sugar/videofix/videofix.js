// 播放器小窗口组件
(function(sugarname){
  var videofix = function(obj, config) {
    this.config = {
      'position': 'left bottom', // 位置：默认 左上
      'width': '50%',
      'height': 'auto'
    };
    if (config) {
      $.extend(this.config, config);
    }
    if (typeof(obj) == 'object') {
      this.videoObj = obj;
    } else {
      this.videoObj = $('#'+obj);
    }
    this.init();
  };
  videofix.prototype = {
    init: function(){
      // 获取播放器宽高
      this.videoWidth = this.videoObj.width();
      this.videoHeight = this.videoObj.parent().height();
      //获取可视窗口宽高
      var width=window.innerWidth,
          height=window.innerHeight;
      // 计算缩小后宽高
      if (this.config['width'].indexOf('%') > -1) {
        this.fixVideoWidth = this.videoWidth * parseInt(this.config['width']) / 100;
      } else {
        this.fixVideoWidth = this.config['width'];
      }
      if (this.config['height'] != 'auto') {
        if (this.config['height'].indexOf('%') > -1) {
          this.fixVideoHeight = height * parseInt(this.config['height']) / 100;
        }else {
          this.fixVideoHeight = this.config['height'];
        }
      }else{
        this.fixVideoHeight = this.videoObj.height();
      }
      // 计算缩小后位置
      var _this=this;
      var config={};
      if(this.config['position']!=''){
        var val=this.config['position'].split(' ');
        if(val[0]=='left'){
          config['left']=0;
        }else if(val[0]=='right'){
          config['right']=0;
        }else if(val[0]=='center'){
          config['margin-left']=(width-_this.fixVideoWidth)/2+'px';
        }else{
          config['left']=val[0];
        }
        if(val[1]=='top'){
          config['top']=0;
        }else if(val[1]=='bottom'){
          config['bottom']=0;
        }else if(val[1]==null||val[1]=='center'){
          config['margin-top']=(height-_this.fixVideoHeight)/2+'px';
        }else{
          config['top']=val[1];
        }
      }
      // 绑定滚动条
      $(document).scroll(function(){
        if($('body').scrollTop()>=_this.videoHeight){  
          var videofixCss=$.extend({'width':_this.config['width'],'height':_this.config['height'],'position':'fixed'},config);
          $(_this.videoObj).css(videofixCss);
        }else{
          $(_this.videoObj).css({
            'width':_this.videoWidth,
            'height':'auto',
            'position':'absolute',
            'top':'0',
            'left':'0',
            'margin-top':'0',
            'margin-left':'0'
          });
        }
      });
    }
  };
  sugar[sugarname] = videofix;
})('videofix-1.0.0');
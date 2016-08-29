// 播放器小窗口组件
(function(sugarname){
  var videofix = function(width,height,position) {
    this.width=width;
    this.height=height;
    this.position=position;
  };
  videofix.prototype = {
    init:function(){
      $('.video').css({
        'width':window.innerWidth,
        'height':'18%',
        'position':'relative'
      })
      $('video').css('width','100%');
      var divWidth=$('.video').width();
      var divHeight=$('.video').height();
      var videoWidth=$('video').width();
      var videoHeight=$('video').height();
      var height=window.innerHeight;
      var config={};
      //位置
      if(this.position){
        var val=this.position;
        var arr=val.split('-');
        if(val=='left-top'||val=='left-bottom'||val=='right-top'||val=='right-bottom'){
          config[arr[0]]=0;
          config[arr[1]]=0;
        }else if(val=='left-center'||val=='right-center'){
          config[arr[0]]=0;
          config['margin-top']=(height-videoHeight)/2+'px';
        }
      }
      setInterval(function(){
        if($('body').scrollTop()>=divHeight){
          var videoCss=$.extend({'width':this.width,'position':'fixed'},config);
          $('video').css(videoCss);
        }else{
          $('video').css({
            'width':divWidth,
            'position':'absolute',
            'margin-top':'0'
          })
        }
      })
    }
  };
  sugar[sugarname] = videofix;
})('videofix-1.0.0');
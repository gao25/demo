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
        if(this.position=='left-top'){
          config={
            'left':'0',
            'top':'0'
          }
        }else if(this.position=='left-bottom'){
          config={
            'left':'0',
            'bottom':'0'
          }
        }else if(this.position=='right-top'){
          config={
            'right':'0',
            'top':'0'
          }
        }else if(this.position=='right-bottom'){
          config={
            'right':'0',
            'bottom':'0'
          }
        }else if(this.position=='left-center'){
          config={
            'left':'0',
            'top':'0',
            'margin-top':(height-videoHeight)/2+'px'
          }
        }else if(this.position=='right-center'){
          config={
            'right':'0',
            'top':'0',
            'margin-top':(height-videoHeight)/2+'px'
          }
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
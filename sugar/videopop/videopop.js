// 播放器小窗口组件
(function(sugarname){
  var videopop = function(obj, config) {
    this.config = {
      state: true, // 状态：开启弹幕、关闭弹幕
      position: 'left', // 默认居左
      speed: 1, // 速度，单位秒
      write: '发表弹幕',
      writeCallback: function(){}
    };
    if (config) {
      $.extend(this.config, config);
    }
    if (typeof(obj) == 'object') {
      this.videoObj = obj;
    } else {
      this.videoObj = $('#'+obj);
    }
    this.popData = [];
    this.oldpopData = [];
    this.init();
  };
  videopop.prototype = {
    init: function(){
      var _this = this,
        videopopStyle = [
          '<style>',
          '.videopop-wrap{position:absolute;width:10rem;}',
          '.videopop-wrap .wrap{position:relative;width:10rem;}',
          '.videopop-wrap .pop,.videopop-wrap .btn{position:absolute;'+this.config['position']+':0.2rem;bottom:0.2rem;}',
          '.videopop-wrap .pop,.videopop-wrap .btn span{padding:0 0.2rem;font-size:0.35rem;line-height:0.7rem;border-radius:0.2rem;background-color:rgba(0,0,0,0.5);color:#fff;}',
          '.videopop-wrap .pop{max-width:9rem;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;opacity:0;}',
          '.videopop-wrap .btn{font-size:0;z-index:2;}',
          '.videopop-wrap .btn span{margin:0 0.2rem;margin-'+this.config['position']+':0;display:inline-block;font-size:0.4rem;line-height:0.8rem;color:#39b6d2;}',
          '.videopop-wrap .pop1{bottom:1.1rem;opacity:1;-webkit-transition:all '+this.config['speed']+'s;}',
          '.videopop-wrap .pop2{bottom:1.9rem;opacity:1;-webkit-transition:all '+this.config['speed']+'s;}',
          '.videopop-wrap .pop3{bottom:2.7rem;opacity:1;-webkit-transition:all '+this.config['speed']+'s;}',
          '.videopop-wrap .pop4{bottom:3.5rem;opacity:0.5;-webkit-transition:all '+this.config['speed']+'s;}',
          '.videopop-wrap .pop5{bottom:4.2rem;opacity:0.2;-webkit-transition:all '+this.config['speed']+'s;}',
          '.videopop-wrap .pop6{bottom:5rem;opacity:0;-webkit-transition:all '+this.config['speed']+'s;}',
          '.videopop-wrap .play{position:absolute;left:0;right:0;top:0;bottom:0;z-index:1;}',
          '</style>'
        ],
        videopopHtml = [
          '<div class="videopop-wrap">',
          '<div class="wrap">',
          '<div class="btn"><span class="j-videopop-switch"></span><span class="j-videopop-write">'+this.config['write']+'</span></div>',
          '<div class="play"></div>',
          '</div>',
          '</div>'
        ];
      // 插入样式和Dom结构
      this.popObj = $(videopopHtml.join(''));
      function resetWrap(){
        var videoHeight = _this.videoObj.height();
        if (window.orientation == undefined) {
          videoHeight -= 28;
        }
        _this.popObj.height(videoHeight);
        _this.popObj.find('.wrap').height(videoHeight);
      }
      resetWrap();
      this.videoObj.before(videopopStyle.join(''));
      this.videoObj.before(this.popObj);
      // 播放器加载过程中可能会有高度变化，绑定变化
      this.videoObj.resize(resetWrap);
      setTimeout(resetWrap, 100);
      // 显示是：开启弹幕、关闭弹幕
      if (this.config['state']) {
        this.switchpop('open');
      } else {
        this.switchpop('close');
      }
      // 开始弹幕
      this.show();
      // 绑定播放器开关
      this.popObj.find('.play').on(tap, function(){
        if (_this.videoObj[0].paused) {
          _this.videoObj[0].play();
        } else {
          _this.videoObj[0].pause();
        }
      });
      // 绑定开关弹幕
      this.popObj.find('.j-videopop-switch').on(tap, function(){
        if (_this.config['state'] == 'open') {
          _this.switchpop('close');
        } else {
          _this.switchpop('open');
        }
      });
      // 绑定发表弹幕
      if (this.config['write']) {
        this.popObj.find('.j-videopop-write').on(tap, function(){
          _this.config['writeCallback']();
        });
      } else {
        this.popObj.find('.j-videopop-write').remove();
      }
    },
    switchpop: function(state){
      if (state == 'close') {
        this.config['state'] = state;
        this.popObj.find('.pop').addClass('fn-hide');
        this.popObj.find('.j-videopop-switch').html('开启弹幕');
        this.popObj.find('.j-videopop-write').hide();
      } else {
        this.config['state'] = 'open';
        this.popObj.find('.pop').removeClass('fn-hide');
        this.popObj.find('.j-videopop-switch').html('关闭弹幕');
        this.popObj.find('.j-videopop-write').show();
      }
    },
    adddata: function(msgArray){
      this.popData = this.popData.concat(msgArray);
    },
    unshift: function(msg){
      this.popData.unshift(msg);
    },
    show: function(){
      var _this = this;
      this.popObj.find('.wrap').append('<div class="pop pop0"></div>');
      function showFn(){
        if (_this.popData.length == 0 && _this.oldpopData.length > 0) {
          var oldmsg = _this.oldpopData.shift();
          _this.popData.unshift(oldmsg);
        }
        if (_this.popData.length > 0) {
          _this.popObj.find('.pop6').remove();
          _this.popObj.find('.pop5').addClass('pop6');
          _this.popObj.find('.pop4').addClass('pop5');
          _this.popObj.find('.pop3').addClass('pop4');
          _this.popObj.find('.pop2').addClass('pop3');
          _this.popObj.find('.pop1').addClass('pop2');
          var msg = _this.popData.shift();
          _this.oldpopData.push(msg);
          _this.popObj.find('.pop0').html(msg)
            .removeClass('pop0').addClass('pop1');
          if (_this.config['state'] == 'close') {
            _this.popObj.find('.wrap').append('<div class="pop pop0 fn-hide"></div>');
          } else {
            _this.popObj.find('.wrap').append('<div class="pop pop0"></div>');
          }
        }
        setTimeout(showFn, _this.config['speed'] * 1000);
      }
      showFn();
    }
  };
  sugar[sugarname] = videopop;
})('videopop-1.0.0');
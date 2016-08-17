(function($, cakeKey){
  var tplform = function(obj){
    if (typeof(obj) == 'object') {
      this.obj = obj;
    } else {
      this.obj = $('#' + obj);
    }
  };
  tplform.prototype = {
    initField: function(fields){
      var _this = this;
      $.each(fields, function(){
        if (this['type'] == 'hidden') {
          _this.tplHtml += '<input type="hidden" name="'+this['name']+'"';
          if (this['value']) _this.tplHtml += ' value="'+this['value']+'"';
          _this.tplHtml += '>';
          return ;
        }
        var inputbarClass = this['class'] ? ' ' + this['class'] : '',
          required = this['required'] ? '<em>*</em>' : '';
        _this.tplHtml += '<div class="inputbar'+inputbarClass+'">';
        _this.tplHtml += '<div class="barname">'+required+this['title']+'：</div>';
        if (this['type'] == 'text' || this['type'] == 'textarea' || this['type'] == 'file') {
          // text textarea
          if (this['type'] == 'textarea') {
            _this.tplHtml += '<textarea';
          } else {
            _this.tplHtml += '<input type="'+this['type']+'" class="text"';
            if (this['pattern']) _this.tplHtml += ' pattern="'+this['pattern']+'"';
            if (this['value']) _this.tplHtml += ' value="'+this['value']+'"';
          }
          _this.tplHtml += ' name="'+this['name']+'"';
          if (this['required']) _this.tplHtml += ' required';
          if (this['placeholder']) _this.tplHtml += ' placeholder="'+this['placeholder']+'"';
          if (this['maxlength']) _this.tplHtml += ' maxlength="'+this['maxlength']+'"';
          if (this['readonly']) _this.tplHtml += ' readonly';
          if (this['disabled']) _this.tplHtml += ' disabled';
          _this.tplHtml += '>';
          if (this['type'] == 'textarea') {
            if (this['value']) _this.tplHtml += this['value'];
            _this.tplHtml += '</textarea>';
          }
        } else if (this['type'] == 'select') {
          // select
          _this.tplHtml += '<select name="'+this['name']+'"';
          if (this['disabled']) _this.tplHtml += ' disabled';
          _this.tplHtml += '>';
          var selectVal = this['value'];
          $.each(this['option'], function(){
            _this.tplHtml += '<option value="'+this['value']+'"';
            if (selectVal == this['value']) _this.tplHtml += ' selected';
            _this.tplHtml += '>'+this['text']+'</option>';
          });
          _this.tplHtml += '</select>';
        } else if (this['type'] == 'radio' || this['type'] == 'checkbox') {
          // radio checkbox
          var boxType = this['type'],
            boxName = this['name'],
            boxValue = this['value'],
            required = this['required'],
            boxDisabled = '';
          if (this['disabled']) boxDisabled = ' disabled';
          if (boxType == 'checkbox') {
            if (boxValue) {
              boxValue = boxValue.replace(/[\s]*,[\s]*/g, ',');
            } else {
              boxValue = '';
            }
            boxValue = ',' + boxValue + ',';
          }
          $.each(this['option'], function(index){
            _this.tplHtml += '<label><input type="'+boxType+'" name="'+boxName+'" value="'+this['value']+'"';
            if (boxType == 'radio') {
              if (boxValue) {
                // 如果有默认值 则被选中
                if (boxValue == this['value']) _this.tplHtml += ' checked';
              } else {
                // 如果没有默认值 但此单选框必选，则第一项被选中
                if (required && index == 0) _this.tplHtml += ' checked';
              }
            } else {
              if (boxValue.indexOf(','+this['value']+',') > -1) _this.tplHtml += ' checked';
            }
            _this.tplHtml += boxDisabled + '> '+this['text']+'</label>';
          });
        } else if (this['type'] == 'KindEditor') {
          _this.tplHtml += '<textarea name="'+this['name']+'">';
          if (this['value']) _this.tplHtml += this['value'];
          _this.tplHtml += '</textarea>';
        } else {
          _this.tplHtml += this['html'];
        }
        _this.tplHtml += '</div>';
      });
    },
    initButton: function(button){
      var _this = this;
      _this.tplHtml += '<div class="btnbar">';
      $.each(button, function(){
        _this.tplHtml += '<input type="'+this['type']+'" class="';
        if (this['type'] == 'submit') _this.tplHtml += 'submit';
        if (this['class']) _this.tplHtml += ' ' + this['class'];
        _this.tplHtml += '"';
        if (this['disabled']) _this.tplHtml += ' disabled';
        _this.tplHtml += ' value="'+this['value']+'" />';
      });
      _this.tplHtml += '</div>';
    },
    render: function(formConfig, callback, ajaxcallback, errcallback){
      if (formConfig['id']) {
        this.formId = formConfig['id'];
      } else {
        this.formId = "j-tplform-r" + Math.floor(Math.random()*10000);
      }
      var fields = formConfig['fields'],
        button = formConfig['button'],
        method = 'get';
      if (formConfig['method'] == 'post') method = 'post';
      if (formConfig['type'] == 'ajax') {
        this.tplHtml = '<form id="'+this.formId+'">';
      } else {
        this.tplHtml = '<form id="'+this.formId+'" method="'+method+'" action="'+formConfig['action']+'"';
        if (formConfig['target']) this.tplHtml += ' target="'+formConfig['target']+'"';
        this.tplHtml += '>';
      }
      this.initField(fields);
      this.initButton(button);
      this.tplHtml += '</form>';
      this.obj.html(this.tplHtml);

      // 遍历查看是否有编辑器
      var editor = [];
      $.each(fields, function(){
        if (this['type'] == 'KindEditor') {
          var config = this['config'] || {},
            newEditor = KindEditor.create('textarea[name="'+this['name']+'"]', config);
          editor.push(newEditor);
        }
      });
      if (editor.length > 1) {
        this.editor = editor;
      } else if (editor.length == 1) {
        this.editor = editor[0];
      }

      // 绑定表单验证
      var _this = this;
      this.formObj = $('#'+this.formId);
      this.formObj.submit(function(){
        var formState = true;
        for (var i=0; i<fields.length; i++) {
          if (formState) {
            formState = _this.verify($(this).find('[name='+fields[i]['name']+']'), fields[i]);
          } else {
            break;
          }
        }
        if (formState) {
          if (formConfig['type'] == 'ajax') {
            $.ajax({
              type: method,
              url: formConfig['action'],
              data: _this.formObj.serialize(),
              dataType: 'json',
              success: function(result){
                if (ajaxcallback) ajaxcallback(result);
              },
              error: function(err){
                if (errcallback) {
                  errcallback(err);
                } else {
                  alert('服务器连接失败，请稍后再试！');
                }
              }
            });
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      });

      // callback
      if (callback) callback();
    },
    verify: function(fieldObj, field){
      var val = fieldObj.val();
      if (field['type'] == 'text' || field['type'] == 'textarea') {
        // 必填
        if (field['required'] && val == '') {
          this.errtip(fieldObj, '请输入'+field['title']);
          return false;
        }
        // 长度
        if (field['minlength'] && field['maxlength']) {
          if (val.length < field['minlength'] || val.length > field['maxlength']) {
            this.errtip(fieldObj, field['title']+'长度必须大于等于'+field['minlength']+'，小于等于'+field['maxlength']);
            return false;
          }
        } else {
          if (field['minlength'] && val.length < field['minlength']) {
            this.errtip(fieldObj, field['title']+'长度必须大于等于'+field['minlength']);
            return false;
          }
          if (field['maxlength'] && val.length > field['maxlength']) {
            this.errtip(fieldObj, field['title']+'长度必须小于等于'+field['minlength']);
            return false;
          }
        }
        // 正则
        if (field['pattern']) {
          var newRE = new RegExp(field['pattern']);
          if (!newRE.test(val)) {
            this.errtip(fieldObj, '输入的格式不符合要求');
            return false;
          }
        }
      }
      return true;
    },
    errtip: function(fieldObj, msg){
      var errtipObj = fieldObj.parent().find('.j-tplform-errtip'),
        errtipImg = 'http://static.xinhuaapp.com/img/tplform_tip.png';
      if (errtipObj.length == 0) {
        errtipObj = $('<div class="j-tplform-errtip" style="position:absolute;background-color:#fff;border:solid 1px #cfcfcf;border-radius:3px;display:none;box-shadow:0 5px 15px rgba(0,0,0,0.4);">' +
          '<em style="position:absolute;margin:-9px 0 0 16px;width:17px;height:9px;background:url('+errtipImg+') no-repeat left top;"></em>' +
          '<p style="padding:8px 10px 8px 33px;line-height:19px;font-size:12px;">' +
          '<em style="position:absolute;margin-left:-25px;width:19px;height:19px;background:url('+errtipImg+') no-repeat left -9px;"></em>' +
          '<span style="color:#000;"></span></p>' +
          '</div>');
        errtipObj.css('margin-top', fieldObj.outerHeight()+7);
        fieldObj.before(errtipObj);
        fieldObj.focus(function(){
          errtipObj.hide();
        });
        errtipObj.click(function(){
          $(this).hide();
        });
      }
      errtipObj.find('span').html(msg);
      errtipObj.show();
    },
    setval: function(data){
      var _this = this;
      $.each(data, function (fieldname, fieldval) {
        var fieldObj = _this.formObj.find('[name='+fieldname+']');
        if (fieldObj.length) {
          if (fieldObj[0].type == 'radio' || fieldObj[0].type == 'checkbox') {
            if (fieldObj[0].type == 'checkbox') {
              fieldval = ',' + fieldval.replace(/[\s]*,[\s]*/g, ',') + ',';
            }
            fieldObj.each(function(){
              if (fieldObj[0].type == 'radio') {
                if ($(this).val() == fieldval) $(this)[0].checked = true;
              } else {
                if (fieldval.indexOf(','+$(this).val()+',') > -1) $(this)[0].checked = true;
              }
            });
          } else {
            fieldObj.val(fieldval);
          }
        }
      });
    }
  };
  if (!window.cake) window.cake = {};
  window.cake[cakeKey] = tplform;
})(jQuery, 'tplform-1.0.0');
(function($, cakeKey){
  var tplform = function(obj){
    if (typeof(obj) == 'object') {
      this.obj = obj;
    } else {
      this.obj = $('#' + obj);
    }
    this.pattern = {
      number: '^\\d+(\\.\\d+)?$',
      phone: '^1[3-8]\\d{9}$',
      email: '^([a-zA-Z0-9_\\.\\-])+@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$'
    };
  };
  tplform.prototype = {
    initField: function(fields){
      var _this = this;
      $.each(fields, function(){
        if (this['type'] == 'hidden') {
          _this.tplHtml += _this.tpltype(this);
        } else {
          var inputbarClass = this['class'] ? ' ' + this['class'] : '',
            required = this['required'] ? '<em>*</em>' : '';
          _this.tplHtml += '<div class="inputbar'+inputbarClass+'">';
          _this.tplHtml += '<div class="barname">'+required+this['title']+'：</div>';
          _this.tplHtml += _this.tpltype(this);
          _this.tplHtml += '</div>';
        }
      });
    },
    tpltype: function(field){
      var _this = this;
      var fieldType = {
        hidden: function(){
          var fieldHtml = '<input type="hidden" name="'+field['name']+'"';
          if (field['value'] || field['value'] == 0) fieldHtml += ' value="'+field['value']+'"';
          fieldHtml += '>';
          return fieldHtml;
        },
        text: function(){
          var fieldHtml = '';
          // text textarea number phone email
          if (field['type'] == 'textarea') {
            fieldHtml += '<textarea';
          } else {
            // 设置 input type
            if (field['type'] == 'email') {
              fieldHtml += '<input type="email"';
            } else {
              fieldHtml += '<input type="text"';
            }
            if (field['type'] == 'phone') {
              // 手机号码11位限制
              fieldHtml += ' maxlength="11"';
            } else {
              if (field['maxlength']) fieldHtml += ' maxlength="'+field['maxlength']+'"';
            }
            fieldHtml += ' class="'+field['type']+'"';
            if (_this.pattern[field['type']]) {
              // 预设正则
              fieldHtml += ' pattern="'+_this.pattern[field['type']]+'"';
            } else {
              if (field['pattern']) fieldHtml += ' pattern="'+field['pattern']+'"';
            }
            if (field['value']) fieldHtml += ' value="'+field['value']+'"';
          }
          fieldHtml += ' name="'+field['name']+'"';
          if (field['required']) fieldHtml += ' required';
          if (field['placeholder']) fieldHtml += ' placeholder="'+field['placeholder']+'"';
          if (field['readonly']) fieldHtml += ' readonly';
          if (field['disabled']) fieldHtml += ' disabled';
          fieldHtml += '>';
          if (field['type'] == 'textarea') {
            if (field['value']) fieldHtml += field['value'];
            fieldHtml += '</textarea>';
          }
          return fieldHtml;
        },
        select: function(){
          var fieldHtml = '<select name="'+field['name']+'"';
          if (field['disabled']) fieldHtml += ' disabled';
          fieldHtml += '>';
          var selectVal = field['value'];
          $.each(field['option'], function(){
            fieldHtml += '<option value="'+this['value']+'"';
            if (selectVal == this['value']) fieldHtml += ' selected';
            fieldHtml += '>'+this['text']+'</option>';
          });
          fieldHtml += '</select>';
          return fieldHtml;
        },
        checkbox: function(){
          var fieldHtml = '';
          // checkbox radio
          var boxType = field['type'],
            boxName = field['name'],
            boxValue = field['value'],
            required = field['required'],
            boxDisabled = '';
          if (field['disabled']) boxDisabled = ' disabled';
          if (boxType == 'checkbox') {
            if (boxValue) {
              boxValue = boxValue.replace(/[\s]*,[\s]*/g, ',');
            } else {
              boxValue = '';
            }
            boxValue = ',' + boxValue + ',';
          }
          $.each(field['option'], function(index){
            fieldHtml += '<label><input type="'+boxType+'" name="'+boxName+'" value="'+this['value']+'"';
            if (boxType == 'radio') {
              if (boxValue) {
                // 如果有默认值 则被选中
                if (boxValue == this['value']) fieldHtml += ' checked';
              } else {
                // 如果没有默认值 但此单选框必选，则第一项被选中
                if (required && index == 0) fieldHtml += ' checked';
              }
            } else {
              if (boxValue.indexOf(','+this['value']+',') > -1) fieldHtml += ' checked';
            }
            fieldHtml += boxDisabled + '> '+this['text']+'</label>';
          });
          return fieldHtml;
        },
        KindEditor: function(){
          var fieldHtml = '<textarea name="'+field['name']+'">';
          if (field['value']) fieldHtml += field['value'];
          fieldHtml += '</textarea>';
          return fieldHtml;
        },
        html: function(){
          return field['html'];
        }
      };
      var type = field['type'];
      if (type == 'text' || type == 'textarea' || type == 'number' || type == 'phone' || type == 'email' || type == 'datetime' || type == 'date' || type == 'time') {
        return fieldType['text']();
      } else if (type == 'checkbox' || type == 'radio') {
        return fieldType['checkbox']();
      } else {
        if (fieldType[type]) {
          return fieldType[type]();
        } else {
          return '不支持此 type 类型';
        }
      }
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
        if (formConfig['target']) this.tplHtml += ' target="'+this.formId+'-iframe"';
        this.tplHtml += '>';
      }
      this.initField(fields);
      this.initButton(button);
      this.tplHtml += '</form>';
      if (formConfig['type'] != 'ajax' && formConfig['target']) this.tplHtml += '<iframe name="'+this.formId+'-iframe" style="display:none;"></iframe>';
      this.obj.html(this.tplHtml);

      // 遍历查看是否有 日期 或 编辑器
      var editor = [],
        datetimeConfig = {
          "datetime": {
            format: 'Y-m-d H:i'
          },
          "date": {
            timepicker: false,
            format: 'Y-m-d'
          },
          "time": {
            datepicker: false,
            format: 'H:i'
          }
        };
      $.each(fields, function(){
        if (this['type'] == 'datetime' || this['type'] == 'date' || this['type'] == 'time') {
          var config = {};
          $.extend(config, datetimeConfig[this['type']]);
          if (this['config']) $.extend(config, this['config']);
          $('input[name="'+this['name']+'"]').datetimepicker(config);
        } else if (this['type'] == 'KindEditor') {
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
      var type = field['type'],
        val = $.trim(fieldObj.val());
      fieldObj.val(val);
      if (type == 'text' || type == 'textarea' || type == 'number' || type == 'phone' || type == 'email') {
        // 必填
        if (field['required'] && val == '') {
          this.errtip(fieldObj, '请输入'+field['title']);
          return false;
        }
        if (val != "") {
          // 预设正则校验
          if (type == 'number' || type == 'phone' || type == 'email') {
            var newTypeRE = new RegExp(this.pattern[type]);
            if (!newTypeRE.test(val)) {
              this.errtip(fieldObj, '输入的格式不符合要求');
              return false;
            }
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
          // number 大小
          if (field['type'] == 'number') {
            val = + val;
            if (isNaN(val)) {
              this.errtip(fieldObj, '请输入数字');
              return false;
            } else {
              fieldObj.val(val);
              if((field['min'] || field['min']===0) && (field['max'] || field['max']===0) && field['min']<field['max']){
                if(val<field['min'] || val>field['max']){
                  this.errtip(fieldObj,field['title']+'大小必须大于等于'+field['min']+'，小于等于'+field['max']);
                  return false;
                }
              }else{
                if((field['min'] || field['min']===0) && val<field['min']){
                  this.errtip(fieldObj,field['title']+'大小必须大于等于'+field['min']);
                  return false;
                }
                if((field['max'] || field['max']===0) && val>field['max']){
                  this.errtip(fieldObj,field['title']+'大小必须小于等于'+field['max']);
                  return false;
                }
              }
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
        fieldObj.click(function(){
          errtipObj.hide();
        }).blur(function(){
          errtipObj.hide();
        });
        errtipObj.click(function(){
          $(this).hide();
        });
        fieldObj.before(errtipObj);
      }
      fieldObj.focus();
      errtipObj.find('span').html(msg);
      errtipObj.show();
      var errtipObjLeft = fieldObj.outerWidth() / 2 - 26;
      errtipObj.css('margin-left', errtipObjLeft);
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
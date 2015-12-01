/**
 * 添加到全局（window）中简单的方法
 *
 * CallLoading          全屏 Loading 遮罩
 * CallFormValidation   表单验证
 * CallFormAjax         表单 Ajax 提交
 * CallSms              发送短信
 * CallQrcode           展示二维码
 * CallWechatTip        微信分享提示
 * ------------------------------ */

/**
 * 全屏 Loading 遮罩
 * show     显示
 * hide     隐藏
 */
(function(){
  var dom = $('<div></div>', {id: 'full_loading'});

  window.CallLoading = {
    /**
     * 显示
     *   text {{string}} 文字提示
     */
    show: function(text) {
      if (typeof text === 'string' && text.length) {
        dom.attr('title', text);
      };
      dom.appendTo('body');
    },

    // 隐藏
    hide: function() {
      dom.removeAttr('title').remove();
    }
  };
})();


/**
 * 表单验证
 * data: 2015-12-01
 * form {jQueryObject} 要提交的表单
 * options {object}
 *   success {function} 验证成功的回调
 *   error {function} 验证失败的回调
 */
(function() {
  var cxValidation = {};

  cxValidation.init = function() {
    var self = this;

    self.defaults = {
      success: undefined,
      error: undefined
    };

    self.result = {
      status: true
    };

    // 验证方法
    self.validFun = {
      _required: function(el) {
        if (el.type === 'checkbox' || el.type === 'radio') {
          return el.checked ? true : false;
        } else {
          return el.value.length ? true : false;
        };
      },
      _equals: function(el, id) {
        return el.value == document.getElementById(id).value;
      },
      _minSize: function(el, size) {
        return el.value.length >= size;
      },
      _maxSize: function(el, size) {
        return el.value.length <= size;
      },
      _min: function(el, size) {
        return parseFloat(el.value) >= size;
      },
      _max: function(el, size) {
        return parseFloat(el.value) <= size;
      },
      _integer: function(el, id) {
        return /^[\-\+]?\d+$/.test(el.value);
      },
      _number: function(el) {
        return /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/.test(el.value);
      },
      _onlyNumber: function(el) {
        return /^[0-9]+$/.test(el.value);
      },
      _onlyNumberSp: function(el) {
        return /^[0-9\ ]+$/.test(el.value);
      },
      _onlyLetter: function(el) {
        return /^[a-zA-Z]/.test(el.value);
      },
      _onlyLetterSp: function(el) {
        return /^[a-zA-Z\ ]/.test(el.value);
      },
      _onlyLetterNumber: function(el) {
        return /^[0-9a-zA-Z]+$/.test(el.value);
      },
      _onlyLetterNumberSp: function(el) {
        return /^[0-9a-zA-Z\ ]+$/.test(el.value);
      },
      _email: function(el, id) {
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(el.value);
      },
      _phone: function(el, id) {
        return /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/.test(el.value);
      },
      _url: function(el, id) {
        return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(el.value);
      },
      _chinese: function(el, id) {
        return /^[\u4E00-\u9FA5]+$/.test(el.value);
      },
      _chinaId: function(el, id) {
        return /^[1-9]\d{5}[1-9]\d{3}(((0[13578]|1[02])(0[1-9]|[12]\d|3[0-1]))|((0[469]|11)(0[1-9]|[12]\d|30))|(02(0[1-9]|[12]\d)))(\d{4}|\d{3}[xX])$/.test(el.value);
      },
      _chinaIdLoose: function(el, id) {
        return /^(\d{18}|\d{15}|\d{17}[xX])$/.test(el.value);
      },
      _chinaZip: function(el, id) {
        return /^\d{6}$/.test(el.value);
      },
      _qq: function(el, id) {
        return /^[1-9]\d{4,10}$/.test(el.value);
      },
      _call: function(el, functionName) {
        var _namespaces;
        var _scope;
        var _fun;
        var _val;

        if (functionName.indexOf('.') >= 0) {
          _namespaces = functionName.split('.');
          _scope = window;

          while (_namespaces.length) {
            _scope = _scope[_namespaces.shift()];
          };
          _fun = _scope;
        } else {
          _fun = window[functionName]
        };

        return typeof _fun === 'function' ? _fun(el.value) : true;
      }
    };
  };

  cxValidation.getMessage = function(str, isTrue) {
    return isTrue ? '' : str;
  };

  cxValidation.toFocus = function(el) {
    if ($(el).is(':visible')) {
      el.focus();
    };
  };

  cxValidation.validItem = function(el) {
    var self = this;
    var _ruleStr = el.dataset.validation;
    var _ruleArr = [];
    var _result = {
      status: true
    };
    var _ruleOpt;

    if (typeof _ruleStr === 'string' && _ruleStr.length) {
      _ruleArr = _ruleStr.replace(/\s|\[[^\]]*\]/g, '').split(',');
    };

    for (var i = 0, l = _ruleArr.length; i < l; i++) {

      switch(_ruleArr[i]) {
        case 'required':
          _result.status = self.validFun._required(el);
          break
        case 'equals':
          _ruleOpt = _ruleStr.match(/equals\[([^\]]+)\]/)[1];
          _result.status = self.validFun._equals(el, _ruleOpt);
          _result.message = self.getMessage('两次输入的不一致', _result.status);
          break
        case 'minSize':
          _ruleOpt = _ruleStr.match(/minSize\[([^\]]+)\]/)[1];
          _result.status = el.value.length ? self.validFun._minSize(el, _ruleOpt) : true;
          _result.message = self.getMessage('最少 ' + _ruleOpt + ' 个字符', _result.status);
          break
        case 'maxSize':
          _ruleOpt = _ruleStr.match(/maxSize\[([^\]]+)\]/)[1];
          _result.status = el.value.length ? self.validFun._maxSize(el, _ruleOpt) : true;
          _result.message = self.getMessage('最多 ' + _ruleOpt + ' 个字符', _result.status);
          break
        case 'min':
          _ruleOpt = _ruleStr.match(/min\[([^\]]+)\]/)[1];
          _result.status = el.value.length ? self.validFun._min(el, _ruleOpt) : true;
          _result.message = self.getMessage('最小值为 ' + _ruleOpt, _result.status);
          break
        case 'max':
          _ruleOpt = _ruleStr.match(/max\[([^\]]+)\]/)[1];
          _result.status = el.value.length ? self.validFun._max(el, _ruleOpt) : true;
          _result.message = self.getMessage('最大值为 ' + _ruleOpt, _result.status);
          break
        case 'integer':
          _result.status = el.value.length ? self.validFun._integer(el) : true;
          _result.message = self.getMessage('无效的整数', _result.status);
          break
        case 'number':
          _result.status = el.value.length ? self.validFun._number(el) : true;
          _result.message = self.getMessage('无效的数值', _result.status);
          break
        case 'onlyNumber':
          _result.status = el.value.length ? self.validFun._onlyNumber(el) : true;
          _result.message = self.getMessage('只能填写数字', _result.status);
          break
        case 'onlyNumberSp':
          _result.status = el.value.length ? self.validFun._onlyNumberSp(el) : true;
          _result.message = self.getMessage('只能填写数字和空格', _result.status);
          break
        case 'onlyLetter':
          _result.status = el.value.length ? self.validFun._onlyLetter(el) : true;
          _result.message = self.getMessage('只能填写英文字母', _result.status);
          break
        case 'onlyLetterSp':
          _result.status = el.value.length ? self.validFun._onlyLetterSp(el) : true;
          _result.message = self.getMessage('只能填写英文字母和空格', _result.status);
          break
        case 'onlyLetterNumber':
          _result.status = el.value.length ? self.validFun._onlyLetterNumber(el) : true;
          _result.message = self.getMessage('只能填写英文字母与数字', _result.status);
          break
        case 'onlyLetterNumberSp':
          _result.status = el.value.length ? self.validFun._onlyLetterNumberSp(el) : true;
          _result.message = self.getMessage('只能填写英文字母、数字、空格', _result.status);
          break
        case 'email':
          _result.status = el.value.length ? self.validFun._email(el) : true;
          _result.message = self.getMessage('无效的邮件地址', _result.status);
          break
        case 'phone':
          _result.status = el.value.length ? self.validFun._phone(el) : true;
          _result.message = self.getMessage('无效的电话号码', _result.status);
          break
        case 'url':
          _result.status = el.value.length ? self.validFun._url(el) : true;
          _result.message = self.getMessage('无效的网址', _result.status);
          break
        case 'chinese':
          _result.status = el.value.length ? self.validFun._chinese(el) : true;
          _result.message = self.getMessage('只能填写中文汉字', _result.status);
          break
        case 'chinaId':
          _result.status = el.value.length ? self.validFun._chinaId(el) : true;
          _result.message = self.getMessage('无效的身份证号码', _result.status);
          break
        case 'chinaIdLoose':
          _result.status = el.value.length ? self.validFun._chinaIdLoose(el) : true;
          _result.message = self.getMessage('无效的身份证号码', _result.status);
          break
        case 'chinaZip':
          _result.status = el.value.length ? self.validFun._chinaZip(el) : true;
          _result.message = self.getMessage('无效的邮政编码', _result.status);
          break
        case 'qq':
          _result.status = el.value.length ? self.validFun._qq(el) : true;
          _result.message = self.getMessage('无效的 QQ 号码', _result.status);
          break

        // 自定义函数验证：
        // 只有返回 false 或 returnObject.status 为 false 时，属于不通过；
        // 返回其他值（包括 undefined、null等）均视为验证通过。
        case 'call':
          _ruleOpt = _ruleStr.match(/call\[([^\]]+)\]/)[1];
          _result = self.validFun._call(el, _ruleOpt);
          break

        // not default
      };

      if (!$.isPlainObject(_result)) {
        _result = {
          status: _result
        };
      };

      if (_result.status === false) {
        _result.rule = _ruleArr[i];
        break
      };
    };

    return _result;
  };

  cxValidation.validForm = function(form, options, errorCallback) {
    var self = this;
    var result = $.extend({}, self.result);
    var el;

    if (typeof options === 'function') {
      options = {
        success: options
      };
    };

    options = $.extend({}, self.defaults, options);

    if (typeof errorCallback === 'function') {
      options.error = errorCallback;
    };

    var inputs = [];
    inputs = inputs.concat(form.find('input'), form.find('textarea'), form.find('select'));

    $.each(inputs, function(index, item) {
      var _result = self.validItem(item);

      if (_result === false || _result.status === false) {
        el = item;
        result.status = false;

        if (typeof _result.message === 'string' && _result.message.length) {
          result.message = _result.message;
        };

        if (typeof _result.rule === 'string' && _result.rule.length) {
          result.rule = _result.rule;
        };

        return false;
      };
    });

    if (result.status === true && typeof options.success === 'function') {
      options.success(form);

    } else if (result.status === false) {
      if (typeof options.error === 'function') {
        options.error(el, result);

      } else if (el) {
        if (typeof result.message !== 'string' || !result.message.length) {
          // if ($.isPlainObject(options.message)) {
          //   if (typeof options.message[result.rule] === 'string' && options.message[result.rule].length) {
          //     result.message = options.message[result.rule];
          //   };
          // };

          if (typeof el.dataset.validationMessage === 'string' && el.dataset.validationMessage.length) {
            try {
              options.message = JSON.parse(el.dataset.validationMessage);

              if (typeof options.message[result.rule] === 'string' && options.message[result.rule].length) {
                result.message = options.message[result.rule];
              };
            } catch (e) {
              result.message = el.dataset.validationMessage;
            };
          };
        };

        if (typeof result.message === 'string' && result.message.length) {
          $.cxDialog({
            title: '提示',
            info: result.message,
            ok: function() {
              self.toFocus(el);
            }
          });
        } else {
          self.toFocus(el);
        };
      };
    };

    return result.status;
  };

  cxValidation.init();

  window.CallFormValidation = cxValidation.validForm.bind(cxValidation);
})();


/**
 * 表单 Ajax 提交
 * form {jQueryObject} 要提交的表单
 * options {object}
 *   complete {function} 提交完成后执行的方法
 *   success {function} 提交完成，状态为成功时执行的方法
 *   error {function} 提交完成，状态为错误时执行的方法
 */
(function() {
  window.CallFormAjax = function(form, options) {
    options = $.extend({}, {
      complete: undefined,
      success: undefined,
      error: undefined
    }, options);

    form.find('button[type="submit"]').prop('disabled', true);

    $.ajax({
      url: form.attr('action'), 
      type: form.attr('method'),
      data: form.serializeArray(),
      dataType: 'json'
    }).done(function(data, textStatus, jqXHR){
      form.find('button[type="submit"]').prop('disabled', false);

      if (typeof options.complete === 'function') {
        options.complete(data);
      };

      if (data.status !== 'success') {
        if (typeof options.error === 'function') {
          options.error(data);
        } else {
          $.cxDialog({
            title: '提示',
            info: data.message
          });
        };
        return;
      };

      if (typeof options.success === 'function') {
        options.success(data);
        return;
      };

      if (typeof data.nextUrl === 'string' && data.nextUrl.length) {
        if (typeof data.message === 'string' && data.message.length) {
          $.cxDialog({
            title: '提示',
            info: data.message,
            ok: function() {
              if (data.nextUrl === 'reload') {
                location.reload();
              } else {
                location.href = data.nextUrl;
              };
            }
          });
        } else {
          if (data.nextUrl === 'reload') {
            location.reload();
          } else {
            location.href = data.nextUrl;
          };
        };

      } else {
        $.cxDialog({
          title: '提示',
          info: data.message
        });
      };

    }).fail(function(jqXHR, textStatus, errorThrown){
      form.find('button[type="submit"]').prop('disabled', false);

      $.cxDialog({
        title: '错误',
        info: errorThrown
      });
    });
  };
})();


/**
 * 发送短信
 * send     发送
 */
(function(){
  var btn;
  var waitTime = 60;
  var waitNow = 0;

  var isElement = function(o) {
    if (o && (typeof HTMLElement==="function" || typeof HTMLElement==="object") && o instanceof HTMLElement) { 
      return true; 
    } else { 
      return (o && o.nodeType && o.nodeType===1) ? true : false; 
    }; 
  };

  var waitLoop = function(){
    waitNow--;
    if (waitNow > 0) {
      btn.innerHTML = '正在发送(' + waitNow + ')';
      setTimeout(waitLoop, 1000);
      return;
    };

    btn.innerHTML = '重新发送';
  };

  /**
   * 发送短信
   * el {element} 发送按钮
   *   data- 参数
   *   url            发送短信的接口地址
   *   input          手机号码输入框
   *   captcha        验证码输入框
   *   phone-name     URL 中手机号码的参数名称
   *   captcha-name   URL 中验证码的参数名称
   *   second         发送间隔时间（秒）
   *
   *   例：
   *   <div data-url="your-api.php" data-input="user-phone" data-phone-name="phone">发送短信</div>
   *   <a href="your-api.php" data-input="user-phone" data-phone-name="phone">发送短信</a>
   */
  var send = function(el){
    if (waitNow > 0) {
      $.cxDialog({
        title: '提示',
        info: '短信正在发送中，请稍等。'
      });
      return;
    };

    if (!isElement(el)) {return};

    var _inputPhone, _inputCaptcha;
    var _url;
    var _query = {};

    // 获取发送接口
    if (typeof el.dataset.url === 'string' && el.dataset.url.length) {
      _url = el.dataset.url;
    } else if (el.tagName.toLowerCase() === 'a') {
      _url = el.getAttribute('href');
    };

    if (!_url) {
      $.cxDialog({
        title: '提示',
        info: '未定义接口'
      });
      return;
    };

    // 如果设置了手机号码输入框，需要输入手机号码
    if (typeof el.dataset.input === 'string' && el.dataset.input.length) {
      if (!document.getElementById(el.dataset.input)) {
        $.cxDialog({
          title: '提示',
          info: '缺少手机号码输入框'
        });
        return;
      };

      _inputPhone = document.getElementById(el.dataset.input);

      if (!_inputPhone.value.length || _inputPhone.value.slice(0, 1) != 1 || !/^\d{11}$/.test(_inputPhone.value)) {
        _inputPhone.focus();
        return;
      };

      if (typeof el.dataset.phoneName === 'string' && el.dataset.phoneName.length) {
        _query[el.dataset.phoneName] = _inputPhone.value;
      } else {
        _query[_inputPhone.name] = _inputPhone.value;
      };
    };

    // 如果设置了验证码输入框，需要输入验证码
    if (typeof el.dataset.captcha === 'string' && el.dataset.captcha.length) {
      if (!document.getElementById(el.dataset.input)) {
        $.cxDialog({
          title: '提示',
          info: '缺少验证码输入框'
        });
        return;
      };

      _inputCaptcha = document.getElementById(el.dataset.captcha);

      if (!_inputCaptcha.value.length) {
        _inputCaptcha.focus();
        return;
      };

      if (typeof el.dataset.captchaName === 'string' && el.dataset.captchaName.length) {
        _query[el.dataset.captchaName] = _inputCaptcha.value;
      } else {
        _query[_inputCaptcha.name] = _inputCaptcha.value;
      };
    };

    var _time = parseInt(el.dataset.second, 10);

    waitNow = (!isNaN(_time) && _time) > 0 ? _time : waitTime;
    btn = el;

    $.ajax({
      url: _url,
      type: 'GET',
      data: _query,
      dataType: 'json'
    }).done(function(data, textStatus, jqXHR){
      if (data.status !== 'success') {
        waitNow = 0;

        $.cxDialog({
          title: '提示',
          info: data.message
        });
        return;
      };

      waitLoop();

    }).fail(function(jqXHR, textStatus, errorThrown){
      waitNow = 0;

      $.cxDialog({
        title: '错误',
        info: errorThrown
      });
    });
  };

  window.CallSms = {
    send: send
  };
})();


/**
 * 展示二维码
 * show     显示
 * hide     隐藏
 */
(function(){
  var wrap = $('<div></div>', {'id': 'full_qrcode'});
  var box = $('<div></div>', {'class': 'box'}).appendTo(wrap);

  /**
   * 显示二维码
   * info     二维码内容
   * options  参数
   *    size        二维码图片尺寸（正方形）
   *    baseclass   wrap 添加 class
   *    before      二维码图像前面添加内容（支持 HTML）
   *    after       二维码图像后面添加内容（支持 HTML）
   *    colorDark   暗色
   *    colorLight  亮色
   *    quality     校正标准（L, M, Q, H）
   */
  var show = function(info, options){
    options = $.extend({
      size: 0,
      baseclass: null,
      before: null,
      after: null,
      colorDark: '#000000',
      colorLight: '#ffffff',
      quality: 'M'
    }, options);

    if (options.size === 0) {
      options.size = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
      options.size = Math.floor(options.size * 0.7 / 43) * 43;
    };

    var pic = $('<div></div>', {'class': 'qrcode'}).css({
      width: options.size,
      height: options.size
    });

    var qrcode = new QRCode(pic[0], {
      text: info,
      width: options.size,
      height: options.size,
      colorDark : options.colorDark,
      colorLight : options.colorLight,
      correctLevel : QRCode.CorrectLevel[options.quality]
    });

    box.html(pic);

    if (typeof options.baseclass === 'string' && options.baseclass.length) {
      wrap.attr('class', options.baseclass);
    };
    if (typeof options.before === 'string' && options.before.length) {
      box.prepend('<div class="before">' + options.before + '</div>');
    };
    if (typeof options.after === 'string' && options.after.length) {
      box.append('<div class="after">' + options.after + '</div>');
    };

    wrap.appendTo('body').show();
  };

  // 隐藏二维码
  var hide = function(){
    wrap.remove();
    box.empty();
  };

  wrap.on('click', hide);

  window.CallQrcode = {
    show: show,
    hide: hide
  };
})();


/**
 * 微信分享提示
 * show     显示
 * hide     隐藏
 */
(function(){
  var wechatShareTip = $('<a></a>', {'id': 'wechat_share_tip', 'href': 'javascript://'});

  /** 
   * 显示
   *   baseclass {{string}} 自定义 class
   */
  var show = function(baseclass){
    if (typeof baseclass === 'string' && baseclass.length) {
      wechatShareTip.addClass(baseclass);
    };
    wechatShareTip.appendTo('body').show();
  };

  // 隐藏
  var hide = function(){
    wechatShareTip.remove().attr('class', '');
  };

  wechatShareTip.on('click', hide);

  window.CallWechatTip = {
    show: show,
    hide: hide
  };
})();

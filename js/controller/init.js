(function(){
  if ('addEventListener' in document && /(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase())) {
    document.addEventListener('DOMContentLoaded', function() {
      FastClick.attach(document.body);
    }, false);
  };

  $.cxDialog.defaults.baseClass = 'ios';
  $.cxDialog.defaults.background = 'rgba(0,0,0,0.4)';
  $.cxDialog.defaults.ok = function(){};

  $('body').on('click', 'a', function(){
    var _rel = this.rel;
    var _rev = this.rev;

    if (_rel === 'wechat_share') {
      CallWechatTip.show(_rev);
      return false;

    } else if (_rel === 'send_sms') {
      CallSms.send(this);
      return false;
    };
  });
})();


/**
 * 表单 Ajax 提交
 * form {jQueryObject} 要提交的表单
 * options {object}
 *   complete {function} 提交完成后执行的方法
 *   success {function} 提交完成，状态为成功时执行的方法
 *   error {function}提交完成，状态为错误时执行的方法
 */
(function() {
  window.formAjaxSubmit = function(form, options) {
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


// 当前页面二维码
(function(){
  var box = $('<div></div>', {class: 'this_qrcode'});
  var pic = document.createElement('div');

  var qrcode = new QRCode(pic, {
    text: location.href,
    width: 88,
    height: 88,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.L
  });

  box.prepend(pic).append('<p>微信扫一扫<br>获得更多内容</p>').appendTo('body');
})();


// 微信分享提示
(function(){
  var wechatShareTip = $('<a></a>', {'id': 'wechat_share_tip', 'href': 'javascript://'});

  var show = function(baseclass){
    if (typeof baseclass === 'string' && baseclass.length) {
      wechatShareTip.addClass(baseclass);
    };
    wechatShareTip.appendTo('body').show();
  };

  var hide = function(){
    wechatShareTip.remove().attr('class', '');
  };

  wechatShareTip.on('click', hide);

  window.CallWechatTip = {
    show: show,
    hide: hide
  };
})();


/**
 * 发送短信验证码
 * data- 参数
 * url            发送短信的接口地址
 * input          手机号码输入框
 * captcha        验证码输入框
 * phone-name     URL 中手机号码的参数名称
 * captcha-name   URL 中验证码的参数名称
 * 
 * 例：
 * <div data-url="your-api.php" data-input="user-phone" data-phone-name="phone">发送短信</div>
 * <a href="your-api.php" data-input="user-phone" data-phone-name="phone">发送短信</div>
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
      _url = el.href;
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
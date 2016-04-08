/**
 * 添加到全局（window）中简单的方法
 *
 * CallLoading          全屏 Loading 遮罩
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
      } else {
        dom.removeAttr('title');
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
 * 表单 Ajax 提交
 * form {jQueryObject} 要提交的表单
 * options {object}
 *   complete {function} 提交完成后执行的方法
 *   success {function} 提交完成，状态为成功时执行的方法
 *   error {function} 提交完成，状态为错误时执行的方法
 */
(function() {
  var formAjax = function() {
    return formAjax.submit.apply(formAjax, arguments);
  };

  formAjax.finish = function(data) {
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
  };

  formAjax.submit = function(form, options, errorCallback) {
    var self = this;
    var defaults = {
      url: form.attr('action'), 
      type: form.attr('method'),
      data: form.serializeArray(),
      dataType: 'json',
      complete: undefined,
      success: undefined,
      error: undefined
    };

    if (typeof options === 'function') {
      options = {
        success: options
      };
    };

    if (typeof errorCallback === 'function') {
      options.error = errorCallback;
    };

    options = $.extend({}, defaults, options);

    if (Array.isArray(options.addData) && options.addData.length) {
      options.data = options.data.concat(options.addData);
    } else if($.isPlainObject(options.addData)) {
      options.data.push(options.addData);
    };

    form.find('button[type="submit"]').prop('disabled', true);

    $.ajax({
      url: options.url, 
      type: options.type,
      data: options.data,
      dataType: options.dataType
    }).done(function(data, textStatus, jqXHR){
      form.find('button[type="submit"]').prop('disabled', false);

      if (typeof options.complete === 'function') {
        options.complete(data);
      };

      if (data.state !== 'success') {
        if (typeof options.error === 'function') {
          options.error(data);
          return;
        };

        self.finish(data);
        return;
      };

      if (typeof options.success === 'function') {
        options.success(data);
        return;
      };

      self.finish(data);

    }).fail(function(jqXHR, textStatus, errorThrown){
      form.find('button[type="submit"]').prop('disabled', false);

      $.cxDialog({
        title: '错误',
        info: errorThrown
      });
    });
  };

  window.CallFormAjax = formAjax.bind(formAjax);
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

    var bd = $('<div></div>', {'class': 'bd'}).html(pic);

    var qrcode = new QRCode(pic[0], {
      text: info,
      width: options.size,
      height: options.size,
      colorDark : options.colorDark,
      colorLight : options.colorLight,
      correctLevel : QRCode.CorrectLevel[options.quality]
    });

    box.html(bd);

    if (typeof options.baseclass === 'string' && options.baseclass.length) {
      wrap.attr('class', options.baseclass);
    };
    if (typeof options.before === 'string' && options.before.length) {
      box.prepend('<div class="hd">' + options.before + '</div>');
    };
    if (typeof options.after === 'string' && options.after.length) {
      box.append('<div class="ft">' + options.after + '</div>');
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

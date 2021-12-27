/**
 * 已废弃
 * --------------------
 * tipShow              显示 Tip
 * tipHide              隐藏 Tip
 * tipToggle            显示或隐藏 Tip
 * --------------------
 * scrollTo             滚动到位置
 * formAjax             表单 AJAX 提交
 * smsSend              发送短信验证码
 * --------------------
 */

    self.dom.tip = document.createElement('div');
    self.dom.tip.setAttribute('id', 'app_tip');
    self.dom.tip.addEventListener('click', self.tipHide.bind(self));

  /**
   * 滚动到位置
   * @param {object} [options]
   * @param {integer} options.x - 横向坐标（未支持）
   * @param {integer} options.y - 纵向坐标
   */
  app.prototype.scrollTo = function(options) {
    options = $.extend({
      x: 0,
      y: 0
    }, options);

    if (!this.isIos()) {
      window.scrollTo({
        top: options.y,
        behavior: 'smooth'
      });
    } else {
      if (document.scrollingElement && typeof document.scrollingElement.scrollTop === 'number') {
        document.scrollingElement.scrollTop = options.y;
      } else if (document.documentElement && typeof document.documentElement.scrollTop === 'number') {
        document.documentElement.scrollTop = options.y;
      } else if (document.body && typeof document.body.scrollTop === 'number') {
        document.body.scrollTop = options.y;
      };
    };
  };

  /**
   * 显示 Tip
   * @param {string} [baseclass] - 自定义 class
   */
  app.prototype.tipShow = function(baseclass) {
    var self = this;

    if (typeof baseclass === 'string' && baseclass.length) {
      self.dom.tip.setAttribute('class', baseclass);
    } else {
      self.dom.tip.removeAttribute('class');
    };

    self.dom.body.appendChild(self.dom.tip);
  };

  // 隐藏 Tip
  app.prototype.tipHide = function() {
    if (this.dom.body.contains(this.dom.tip)) {
      this.dom.body.removeChild(this.dom.tip);
    };
  };


  // 显示或隐藏 Tip
  app.prototype.tipToggle = function(baseclass) {
    if (this.isVisible(this.dom.tip)) {
      this.tipHide();
    } else {
      this.tipShow(baseclass);
    };
  };

  /**
   * 表单 Ajax 提交
   * @param {object} options - 选项
   * @param {string|element|object} options.form - ID / DOM / jQuery
   * @param {string} [options.url] - 表单提交 URL (默认取 action 的值)
   * @param {string} [options.type] - 提交类型 (默认取 method 的值)
   * @param {array} [options.data] - 提交数据 (默认为表单数据)
   * @param {string} [options.dataType] - 返回类型 (默认为 json)
   * @param {object} [options.urlData] - 增加 URL 提交的数据
   * @param {array} [options.addData] - 增加 data 提交的数据
   * @param {function} [options.complete] - 完成回调函数
   * @param {function} [options.success] - 成功回调函数
   * @param {function} [options.error] - 错误回调函数
   *
   * @example 简易方法
   * formAjax(form[, successCallback, errorCallback])
   *
   * @example 接口返回示例
   * {"status":"success","message":"text","nextUrl":"URL"}
   */
  app.prototype.formAjax = function(options, successCallback, errorCallback) {
    var self = this;

    if (typeof options === 'string' || self.isElement(options) || typeof self.isJquery(options) || self.isZepto(options)) {
      options = {
        form: self.getDom(options, true)
      };
    };

    options = $.extend({
      url: options.form.attr('action'),
      type: options.form.attr('method'),
      data: options.form.serializeArray(), // 格式: [{name:"key_1",value:"value_1"},{name:"key_2",value:"value_2"}]
      dataType: 'json',
      urlData: undefined,                   // 格式: {key_1:value_1,key_2:value_2}
      addData: undefined,                   // 格式与 data 相同（仅有 1 个对象时，可直接使用对象类型）
      complete: undefined,
      success: undefined,
      error: undefined
    }, options);

    if (!self.isJquery(options.form) && !self.isZepto(options.form)) {
      options.form = self.getDom(form, true);
    };

    if (!options.form) {
      return;
    };

    if (typeof successCallback === 'function') {
      options.success = successCallback;
    };

    if (typeof errorCallback === 'function') {
      options.error = errorCallback;
    };

    if (options.urlData) {
      options.url += (options.url.indexOf('?') >= 0) ? '&' : '?';
      options.url += $.param(options.urlData);
    };

    if (Array.isArray(options.addData) && options.addData.length) {
      options.data = options.data.concat(options.addData);
    } else if($.isPlainObject(options.addData)) {
      options.data.push(options.addData);
    };

    options.form.find('button[type="submit"]').prop('disabled', true);

    $.ajax({
      url: options.url, 
      type: options.type,
      data: options.data,
      dataType: options.dataType
    }).always(function() {
      if (typeof options.complete === 'function') {
        options.complete();
      };
    }).done(function(data, textStatus, xhr) {
      options.form.find('button[type="submit"]').prop('disabled', false);

      if (!data) {
        return;
      };

      if (data.status !== 'success' && typeof options.error === 'function') {
        options.error(data);
        return;
      };

      if (data.status === 'success' && typeof options.success === 'function') {
        options.success(data);
        return;
      };

      formAjaxFinish(data);

    }).fail(function(xhr, textStatus, errorThrown) {
      options.form.find('button[type="submit"]').prop('disabled', false);

      $.cxDialog({
        title: '错误',
        info: errorThrown
      });
    });

    /**
     * 默认完成后的处理方式
     * 格式约定: {"message":'需要展示的描述，不需展示留空','nextUrl':'URL or Key'}
     *
     * nextUrl:
     * close: 关闭当前窗口
     * reload: 刷新当前窗口
     */
    var formAjaxFinish = function(data) {
      if (typeof data.message === 'string' && data.message.length) {
        $.cxDialog({
          title: '提示',
          info: data.message,
          ok: function() {
            formAjaxGoto(data.nextUrl);
          }
        });
      } else {
        formAjaxGoto(data.nextUrl);
      };
    };

    // 返回结果需要跳转
    var formAjaxGoto = function(url) {
      if (typeof url === 'string' && url.length) {
        if (url === 'reload') {
          location.reload();
        } else if (url === 'close') {
          window.close();
        } else {
          location.href = url;
        };
      };
    };
  };


  /**
   * 发送短信
   * @param {object} options - 选项
   * @param {string|element|object} options.button - ID / DOM / jQuery
   * @param {element} options.input - 手机号码输入框元素
   * @param {element} options.captcha - 图片验证码输入框元素
   * @param {string} options.phoneName - 手机号字段名称（默认取 input 的 name）
   * @param {string} options.captchaName - 图片验证码字段名称（默认取 captcha 的 name）
   * @param {string} options.url - 发送短信的接口地址
   * @param {string} options.type - 传输方式（get/post）
   * @param {integer} options.second - 发送间隔时间（秒）
   * @param {string} options.tipText - 正在发送的提示文字
   * @param {string} options.loopText - 倒计时按钮显示的文字
   * @param {string} options.endText - 倒计时结束后显示的文字
   * @param {function} options.success - 成功回调函数
   * @param {function} options.error - 错误回调函数
   *
   * @example 按钮 data- 可配置参数（优先级高于 options）
   *   [url, type, second, input, captcha, phone-name, captcha-name, tip-text, loop-text, end-text]
   *
   *   例：
   *   <div data-url="your-api.php" data-input="user-phone" data-phone-name="phone">发送短信</div>
   *   <a href="your-api.php" data-input="user-phone" data-phone-name="phone">发送短信</a>
   */
  app.prototype.smsSend = function(options, successCallback, errorCallback) {
    var self = this;
    var nowTime = new Date().getTime();
    var inputPhone, inputCaptcha, phoneValue, captchaValue;
    var query = {};

    if (typeof options === 'string' || self.isElement(options) || typeof self.isJquery(options) || self.isZepto(options)) {
      options = {
        button: self.getDom(options)
      };
    };

    options = $.extend({
      type: 'get',
      second: 60,
      tipText: '短信正在发送中，请稍等。',
      loopText: '正在发送({{time}})',
      endText: '重新发送'
    }, options);

    if (!self.isElement(options.button)) {
      options.button = self.getDom(options);
    };

    if (!options.button) {
      return;
    };

    if (typeof successCallback === 'function') {
      options.success = successCallback;
    };

    if (typeof errorCallback === 'function') {
      options.error = errorCallback;
    };

    $.extend(options, {
      input: options.button.dataset.input,
      captcha: options.button.dataset.captcha,
      phoneName: options.button.dataset.phoneName,
      captchaName: options.button.dataset.captchaName,
      url: options.button.dataset.url,
      type: options.button.dataset.type,
      second: options.button.dataset.second,
      tipText: options.button.dataset.tipText,
      loopText: options.button.dataset.loopText,
      endText: options.button.dataset.endText
    });

    // 获取发送接口
    if (!options.url && options.button.tagName.toLowerCase() === 'a') {
      options.url = options.button.getAttribute('href');
    };

    if (!options.url) {
      $.cxDialog({
        title: '提示',
        info: '未定义接口'
      });
      return;
    };

    // 已发送提示
    if (options.button.dataset.time > nowTime) {
      $.cxDialog({
        title: '提示',
        info: options.tipText
      });
      return;
    };

    // 如果设置了手机号码输入框，需要输入手机号码
    if (options.input) {
      inputPhone = self.getDom(options.input);

      if (!inputPhone) {
        $.cxDialog({
          title: '提示',
          info: '缺少手机号码输入框'
        });
        return;
      };

      phoneValue = inputPhone.value;

      if (!phoneValue.length || !/^1\d{10}$/.test(phoneValue)) {
        inputPhone.focus();
        return;
      };

      if (typeof options.phoneName === 'string' && options.phoneName.length) {
        query[options.phoneName] = phoneValue;
      } else {
        query[inputPhone.name] = phoneValue;
      };
    };

    // 如果设置了验证码输入框，需要输入验证码
    if (typeof options.captcha === 'string' && options.captcha.length) {
      inputCaptcha = self.getDom(options.captcha);

      if (!inputCaptcha) {
        $.cxDialog({
          title: '提示',
          info: '缺少验证码输入框'
        });
        return;
      };

      captchaValue = inputCaptcha.value;

      if (!captchaValue.length) {
        inputCaptcha.focus();
        return;
      };

      if (typeof options.captchaName === 'string' && options.captchaName.length) {
        query[options.captchaName] = captchaValue;
      } else {
        query[inputCaptcha.name] = captchaValue;
      };
    };

    options.button.dataset.time = nowTime + (options.second * 1000);

    // 发送短信倒计时
    var sendLoop = function(options) {
      var nowTime = new Date().getTime();
      var diffTime = parseInt(options.button.dataset.time, 10) - nowTime;

      if (diffTime > 0) {
        options.button.innerHTML = options.loopText.replace('{{time}}', Math.round(diffTime / 1000));
        setTimeout(sendLoop.bind(this, options), 1000);

      } else {
        options.button.dataset.time = 0;
        options.button.innerHTML = options.endText;
      };
    };

    var sendComplete = function(options, data) {
      if (data.status !== 'success') {
        options.button.dataset.time = 0;
        sendLoop(options);

        if (typeof options.error === 'function') {
          options.error.call(options.button);
        } else {
          $.cxDialog({
            title: '提示',
            info: data.message
          });
        };
        return;
      };

      if (typeof options.success === 'function') {
        options.success.call(options.button);
      };
    };

    sendLoop(options);

    $.ajax({
      url: options.url,
      type: options.type,
      data: query,
      dataType: 'json'
    }).done(function(data, textStatus, xhr) {
      sendComplete(options, data);

    }).fail(function(xhr, textStatus, errorThrown) {
      sendComplete(options, {
        message: errorThrown
      });
    });
  };
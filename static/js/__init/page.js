/**
 * 初始化界面
 *
 * bindBodyEvent              全局操作
 * updateBackUrl              返回按钮 URL
 * buildPageQrcode            当前页面二维码
 * fixInputFixed              解决 iOS 输入框获取焦点时 fixed 错位
 * --------------------
 */
(function() {
  var thePage = {
    dom: {}
  };

  thePage.init = function() {
    var self = this;

    self.dom.body = $('body');

    if (document.getElementById('header_back')) {
      self.updateBackUrl();
    };

    if (document.getElementById('tabbar')) {
      GLOBAL.dom.tabbar = APP.initTabBar(document.getElementById('tabbar'), GLOBAL.tabBarConfig);
    };

    if ('addEventListener' in document && /(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase())) {
      self.fixInputFixed();
    };

    if (window.innerWidth > 1000) {
      self.buildPageQrcode();
    };

    self.bindBodyEvent();
  };

  // 全局操作
  thePage.bindBodyEvent = function() {
    var self = this;

    self.dom.body.on('click', 'a', function(event){
      var _this = this;
      var _rel = _this.rel;
      var _rev = _this.rev;
      var _opt = _this.dataset.option;

      try {
        _opt = JSON.parse(_opt);
      } catch (e) {};

      // 显示提示
      if (_rel === 'call_tip') {
        event.preventDefault();
        APP.tipToggle(_rev);

      // 显示面板
      } else if (_rel === 'call_panel') {
        event.preventDefault();
        APP.panelToggle(_rev, _opt);

      // 发送短信验证码
      } else if (_rel === 'call_sms') {
        event.preventDefault();
        APP.smsSend(_this);
      };
    });
  };

  // 返回按钮 URL
  thePage.updateBackUrl = function() {
    var self = this;
    var backurl = GLOBAL.purl.param('backurl');

    self.dom.headerBack = document.getElementById('header_back');

    if (typeof backurl === 'string' && backurl.length) {
      if (backurl === '_none') {
        self.dom.headerBack.style.display = 'none';

      } else if (backurl === '_back') {
        var regHost = new RegExp('^http(s?)://'+location.host+'/');
        if (document.referrer && regHost.test(document.referrer)) {
          self.dom.headerBack.href = 'javascript:history.back();';
        };

      } else {
        self.dom.headerBack.href = decodeURIComponent(backurl);
      };
    };
  };

  // 当前页面二维码
  thePage.buildPageQrcode = function() {
    var box = document.createElement('div');
    var pic = document.createElement('div');

    var qrcode = new QRCode(pic, {
      text: encodeURI(location.href),
      width: 88,
      height: 88,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.L
    });

    box.classList.add('page_qrcode');
    box.appendChild(pic);
    box.insertAdjacentHTML('beforeend', '<p>在手机上浏览</p>');
    document.body.appendChild(box);
  };

  // 解决 iOS 输入框获取焦点时 fixed 错位
  thePage.fixInputFixed = function() {
    var self = this;
    var domBody = document.body;

    var hasFix = function(e) {
      var tags = ['input', 'textarea', 'select'];
      var types = ['checkbox', 'radio', 'file', 'button', 'submit', 'reset', 'image', 'range'];
      var tagName = e.target.nodeName.toLowerCase();
      var result = false;

      if (tags.indexOf(tagName) >= 0 && !e.target.readOnly && !e.target.disabled) {
        if (tagName === 'input') {
          if (types.indexOf(e.target.type) <= -1) {
            result = true;
          };
        } else if (tagName === 'textarea' || tagName === 'select') {
          result = true;
        };
      };

      return result;
    };

    domBody.addEventListener('focus', function(e) {
      if (hasFix(e) && !domBody.classList.contains('onfocus')) {
        domBody.classList.add('onfocus');
      };
    }, true);

    domBody.addEventListener('blur', function(e) {
      if (hasFix(e)) {
        domBody.classList.remove('onfocus');
      };
    }, true);
  };

  thePage.init();
})();
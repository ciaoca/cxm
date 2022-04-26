/**
 * 初始化界面
 *
 * buildBackUrl               返回按钮 URL
 * buildPageQrcode            当前页面二维码
 * bindBodyEvent              全局操作
 * fixInputFixed              解决 iOS 输入框获取焦点时 fixed 错位
 * --------------------
 */
(function() {
  const thePage = {
    config: {},
    dom: {}
  };

  thePage.init = function() {
    const self = this;

    self.dom.body = document.body;

    if (WebApp.isObject(window.PageConfig)) {
      Object.assign(self.config, window.PageConfig);
    } else {
      window.PageConfig = {};
    };

    if (WebApp.isElement(document.getElementById('tabbar'))) {
      GLOBAL.dom.tabbar = WebApp.initTabBar(document.getElementById('tabbar'), GLOBAL.tabBarConfig);
    };

    self.buildBackUrl();
    self.buildPageQrcode();
    self.bindBodyEvent();
    self.fixInputFixed();
  };

  // 返回按钮 URL
  thePage.buildBackUrl = function() {
    if (!document.getElementById('header_back')) {
      return;
    };

    const self = this;
    const backurl = GLOBAL.purl.param('backurl');

    self.dom.headerBack = document.getElementById('header_back');

    if (WebApp.isString(backurl) && backurl.length) {
      if (backurl === '_none') {
        self.dom.headerBack.style.display = 'none';

      } else if (backurl === '_back') {
        const regHost = new RegExp('^http(s?)://' + location.host + '/');

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
    if (GLOBAL.mediaMode !== 'pc') {
      return;
    };

    const box = document.createElement('div');
    const pic = document.createElement('div');

    const qrcode = new QRCode(pic, {
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
    self.dom.body.appendChild(box);
  };

  // 全局操作
  thePage.bindBodyEvent = function() {
    this.dom.body.addEventListener('click', (e) => {
      const el = e.target;
      const nodeName = el.nodeName.toLowerCase();

      if (nodeName === 'a') {
        const rel = el.rel;
        const rev = el.rev;
        const opts = el.dataset.option;

        try {
          opts = JSON.parse(opts);
        } catch (e) {};

        // 显示面板
        if (rel === 'call_panel') {
          event.preventDefault();
          WebApp.panelToggle(rev, opts);
        };
      };
    });
  };

  // 解决 iOS 输入框获取焦点时 fixed 错位
  thePage.fixInputFixed = function() {
    if ('addEventListener' in document && /(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase()) === false) {
      return;
    };

    const hasFix = (e) => {
      const tags = ['input', 'textarea', 'select'];
      const types = ['checkbox', 'radio', 'file', 'button', 'submit', 'reset', 'image', 'range'];
      const tagName = e.target.nodeName.toLowerCase();
      let result = false;

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

    self.dom.body.addEventListener('focus', function(e) {
      if (hasFix(e) && !self.dom.body.classList.contains('onfocus')) {
        self.dom.body.classList.add('onfocus');
      };
    }, true);

    self.dom.body.addEventListener('blur', function(e) {
      if (hasFix(e)) {
        self.dom.body.classList.remove('onfocus');
      };
    }, true);
  };

  document.addEventListener('DOMContentLoaded', () => {
    thePage.init();
  });
})();
// FastClick Only iOS
// 在 Android 低端机下，效果不理想，不使用
if ('addEventListener' in document && window.GLOBAL.platform.system === 'ios') {
  document.addEventListener('DOMContentLoaded', function(){
    FastClick.attach(document.body);
  }, false);
};

// cxDialog 默认设置
$.cxDialog.defaults.baseClass = 'ios';
$.cxDialog.defaults.background = 'rgba(0,0,0,0.4)';
$.cxDialog.defaults.ok = function(){};

// 全局操作
$('body').on('click', 'a', function(event){
  var _this = this;
  var _rel = _this.rel;
  var _rev = _this.rev;
  var _opt;

  try {
    _opt = JSON.parse(_this.dataset.option);
  } catch (e) {
    _opt = {};
  };

  // 显示提示
  if (_rel === 'call_tip') {
    event.preventDefault();
    APP.tipShow(_rev);

  // 显示二维码
  } else if (_rel === 'call_qrcode') {
    event.preventDefault();
    _opt = $.extend({}, {
      info: _rev
    }, _opt);
    
    APP.qrcodeShow(_opt);

  // 发送短信验证码
  } else if (_rel === 'call_sms') {
    event.preventDefault();
    APP.smsSend(_this);

  // 显示面板
  } else if (_rel === 'call_panel') {
    event.preventDefault();
    document.getElementById(_rev).classList.toggle('out');
  };
});

// 顶部操作
$('#header').on('click', 'dt', function() {
  var _dl = $(this).closest('dl');
  if (_dl.hasClass('menu')) {
    _dl.toggleClass('open');
  } else {
    setTimeout(function() {
      _dl.removeClass('open');
    }, 200);
  };
});


// 解决 iOS 输入框获取焦点时 fixed 错位
(function(){
  if ('addEventListener' in document && /(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase())) {
    var docbody = document.body;

    var hasFix = function(e) {
      var _types = ['checkbox', 'radio', 'file', 'button', 'submit', 'reset', 'image', 'range'];
      var _nodeName = e.target.nodeName.toLowerCase();

      if (_nodeName === 'textarea' || _nodeName === 'select') {
        return true;
      } else if (_nodeName === 'input') {
        if (_types.indexOf(e.target.type) <= -1) {
          return true;
        };
      };
      return false;
    };

    docbody.addEventListener('focus', function(e) {
      if (hasFix(e) && !docbody.classList.contains('onfocus')) {
        docbody.classList.add('onfocus');
      };
    }, true);

    docbody.addEventListener('blur', function(e) {
      if (hasFix(e)) {
        docbody.classList.remove('onfocus');
      };
    }, true);
  };
})();


// 当前页面二维码
(function(){
  var box = document.createElement('div');
  var pic = document.createElement('div');

  var qrcode = new QRCode(pic, {
    text: location.href,
    width: 88,
    height: 88,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.L
  });

  box.classList.add('this_qrcode');
  box.appendChild(pic);
  box.insertAdjacentHTML('beforeend', '<p>微信扫一扫<br>获得更多内容</p>');
  document.body.appendChild(box);
})();


// flex 兼容
(function() {
  // iOS 不需要 fix
  if (/(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase())) {
    return;
  };

  // 如果支持 flex 则不需要 fix
  if (!!((window.CSS && window.CSS.supports))) {
    if (CSS.supports('display', 'flex')) {
      return;
    };
  };

  var fixSelectors = [
    {
      name: '#footer_nav',
      tag: 'a'
    }, {
      name: '.nav_tab',
      tag: 'a'
    }
  ];
  if (Array.isArray(window.GLOBAL.fixFlexSelectors)) {
    fixSelectors = fixSelectors.concat(window.GLOBAL.fixFlexSelectors);
  };

  var theSelector;
  for (var i = 0, l = fixSelectors.length; i < l; i++) {
    theSelector = document.querySelectorAll(fixSelectors[i].name);
    if (theSelector.length) {
      for (var i = 0, l = theSelector.length; i < l; i++) {
        theSelector[i].classList.add('flex');
        theSelector[i].classList.add('flex_' + theSelector[i].querySelectorAll(fixSelectors[i].tag).length);
      };
    };
  };
})();

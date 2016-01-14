(function(){
  // FastClick Only iOS
  // 在 Android 低端机下，效果不理想
  if ('addEventListener' in document && /(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase())) {
    document.addEventListener('DOMContentLoaded', function() {
      FastClick.attach(document.body);
    }, false);
  };

  // cxDialog 默认设置
  $.cxDialog.defaults.baseClass = 'ios';
  $.cxDialog.defaults.background = 'rgba(0,0,0,0.4)';
  $.cxDialog.defaults.ok = function(){};

  // 全局操作
  $('body').on('click', 'a', function(){
    var _rel = this.rel;
    var _rev = this.rev;
    var _opt;

    try {
      _opt = JSON.parse(this.dataset.option);
    } catch (e) {
      _opt = {};
    };

    // 显示二维码
    if (_rel === 'call_qrcode') {
      window.CallQrcode.show(_rev, _opt);
      return false;

    // 发送短信验证码
    } else if (_rel === 'call_sms') {
      window.CallSms.send(this);
      return false;

    // 显示微信分享提示
    } else if (_rel === 'call_wechat_share') {
      window.CallWechatTip.show(_rev);
      return false;
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
})();


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

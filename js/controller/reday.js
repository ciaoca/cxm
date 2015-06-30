(function(){
  // FastClick Only iOS
  // 在 Android 低端机下，效果不理想
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

    // 显示二维码
    if (_rel === 'call_qrcode') {
      window.CallQrcode.show(_rev);
      return false;

    // 发送短信验证码
    } else if (_rel === 'call_sms') {
      window.CallSms.send(this);
      return false;

    } else if (_rel === 'call_wechat_share') {
      window.CallWechatTip.show(_rev);
      return false;
    };
  });
})();


// 解决 iOS 输入框获取焦点时 fixed 错位
(function(){
  if ('addEventListener' in document && /(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase())) {
    var _tags = ['input', 'textarea', 'select'];
    var _body = document.body;

    _body.addEventListener('focus', function(e) {
      var _nodeName = e.target.nodeName.toLowerCase();

      if (_tags.indexOf(_nodeName) >= 0 && !_body.classList.contains('onfocus')) {
        _body.classList.add('onfocus');
      };
    }, true);

    _body.addEventListener('blur', function(e) {
      var _nodeName = e.target.nodeName.toLowerCase();

      if (_tags.indexOf(_nodeName) >= 0) {
        _body.classList.remove('onfocus');
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

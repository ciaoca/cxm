// FastClick Only iOS
// 在 Android 低端机下，效果不理想，不使用
if ('addEventListener' in document && GLOBAL.platform && GLOBAL.platform.system === 'ios') {
  document.addEventListener('DOMContentLoaded', function(){
    FastClick.attach(document.body);
  }, false);
};

// cxDialog 默认设置
$.cxDialog.defaults.baseClass = 'ios';
$.cxDialog.defaults.background = 'rgba(0,0,0,0.4)';
$.cxDialog.defaults.title = '提示';
$.cxDialog.defaults.ok = function(){};

(function() {
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
      APP.tipToggle(_rev);

    // 显示面板
    } else if (_rel === 'call_panel') {
      event.preventDefault();
      APP.panelToggle(_rev, _opt);

    // 显示二维码
    } else if (_rel === 'call_qrcode') {
      event.preventDefault();
      _opt = $.extend({
        info: _rev
      }, _opt);

      APP.qrcodeToggle(_opt);

    // 发送短信验证码
    } else if (_rel === 'call_sms') {
      event.preventDefault();
      APP.smsSend(_this);
    };
  });
})();

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

// 底部操作
(function() {
  if (!APP.isElement(document.getElementById('footer_nav'))) {return};

  $('#footer_nav').on('click', 'a', function(event) {
    var _this = this;
    var _rel = _this.rel;
    var _rev = _this.rev;
    var _box;

    // 显示提示
    if (_rel === 'sub') {
      event.preventDefault();
      _box = _this.parentNode;
      if (_box.classList.contains('hover')) {
        _box.classList.remove('hover');
      } else {
        _box.classList.add('hover');
      }
    };
  });
})();

// 筛选工具
(function() {
  if (!APP.isElement(document.getElementById('filter_tool'))) {return};
  var filterTool = $('#filter_tool');
  var filterForm;

  if (filterTool.data('form') && filterTool.data('form').length && APP.isElement(document.getElementById(filterTool.data('form')))) {
    filterForm = $('#'+filterTool.data('form'));
  };

  filterTool.on('click', 'a', function(event) {
    var _this = this;
    var _rel = _this.rel;
    var _rev = _this.rev;
    var _a = $(_this);

    if (_rel) {
      event.preventDefault();
    };

    if (_rel === 'close') {
      filterTool.removeClass('hover');
      filterTool.find('dl.col').removeClass('hover');
    } else if (_rel) {
      var _title = _this.dataset.title;

      if (!_rev || typeof _title !== 'string' || !_title.length) {
        _title = _a.closest('dl.col').children('dt').data('title');
      };

      _a.closest('dl.col').children('dt').html(_title);

      // _a.addClass('n').siblings().removeClass('n');
      _a.closest('dl.col').find('a').removeClass('n');
      _this.classList.add('n');

      filterTool.removeClass('hover');
      filterTool.find('dl.col').removeClass('hover');

      var _input = document.getElementById(_rel);

      if (APP.isElement(_input)) {
        _input.value = _rev;
      };

      if (filterForm) {
        filterForm.trigger('submit');
      };
    };
  });

  filterTool.on('click', 'dt', function() {
    var _dl = $(this).closest('dl');

    if (_dl.hasClass('hover')) {
      filterTool.removeClass('hover');
    } else {
      filterTool.addClass('hover');
    };

    _dl.toggleClass('hover').siblings('dl').removeClass('hover');
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

  box.classList.add('this_qrcode');
  box.appendChild(pic);
  box.insertAdjacentHTML('beforeend', '<p>在手机上浏览</p>');
  document.body.appendChild(box);
})();


/**
 * flex 兼容
 * 需要增加其他兼容在 ready.js 之前设置全局变量：
 * GLOBAL.fixFlexSelectors = [
 *   {
 *     name: 'selectorName',
 *     tag: 'selectorName'
 *   }
 * ]
 */
// (function() {
//   var fixSelectors = [
//     {
//       name: '#footer_nav',
//       tag: '.col'
//     },
//     {
//       name: '.nav_tab',
//       tag: 'a'
//     }
//   ];

//   if (Array.isArray(GLOBAL.fixFlexSelectors)) {
//     fixSelectors = fixSelectors.concat(GLOBAL.fixFlexSelectors);
//   };

//   APP.fixFlex(fixSelectors);
// })();

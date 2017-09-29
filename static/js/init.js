/**
 * 全局配置
 * ------------------------------ */
window.APP = new WebApp({
  version: '1.0.0',
  storagePrefix: ''
});

window.GLOBAL = {
  url: {},
  platform: {},
  wechat: {},
  template: {}
};


/**
 * 保存系统信息
 * system           系统
 * version          系统版本
 * browser          浏览器
 * browserVersion   浏览器版本
 */
(function() {
  var ua = navigator.userAgent.toLowerCase();
  var _version;

  if(/(iPhone|iPad|iPod|iOS)/i.test(ua)){
    _version = ua.match(/os\s([\d\.\_]+)/i);
    GLOBAL.platform.system = 'ios';

  } else if(/Android/i.test(ua)){
    _version = ua.match(/android\s([\d\.]+)/i);
    GLOBAL.platform.system = 'android';

  } else if(/Windows NT/i.test(ua)){
    _version = ua.match(/Windows NT\s([\d\.]+)/i);
    GLOBAL.platform.system = 'windows';
  };

  if (Array.isArray(_version) && _version.length > 1) {
    GLOBAL.platform.version = parseFloat(_version[1].replace(/[\-\_]/g, '.'));
  };

  if(/MicroMessenger/i.test(ua)){
    GLOBAL.platform.browser = 'wechat';
    _version = ua.match(/MicroMessenger\/([\d\.]+)/i);

  } else if (/MSIE/i.test(ua)) {
    GLOBAL.platform.browser = 'ie';
    _version = ua.match(/MSIE\s([\d\.]+)/i);

  } else if (/Trident/i.test(ua)) {
    GLOBAL.platform.browser = 'ie';
    _version = ua.match(/rv:([\d\.]+)/);

  } else if (/Chrome/i.test(ua)) {
    GLOBAL.platform.browser = 'chrome';
    _version = ua.match(/Chrome\/([\d\.]+)/i);

  } else if (/Safari/i.test(ua)) {
    _version = ua.match(/Version\/([\d\.]+)/i);
    GLOBAL.platform.browser = 'safari';
  };

  if (Array.isArray(_version) && _version.length > 1) {
    GLOBAL.platform.browserVersion = parseFloat(_version[1].replace(/[\-\_]/g, '.'));
  };
})();


/**
 * artTemplate 模板引擎添加方法
 */
template.helper('tfEncodeURIComponent', function(string) {
  return encodeURIComponent(string);
});

template.helper('tfReplaceEnter', function(string) {
  return APP.replaceEnter(string);
});

template.helper('tfDate', function() {
  return cxDate.apply(APP, arguments);
});

template.helper('tfNumber', function() {
  return APP.numberFormat.apply(APP, arguments);
});

template.helper('tfRandomNumber', function(min, max) {
  return APP.getRandomNumber.apply(APP, arguments);
});

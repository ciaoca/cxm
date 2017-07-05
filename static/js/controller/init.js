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
  wechat: {}
};

/**
 * 保存系统、浏览器信息
 */
(function() {
  var ua = navigator.userAgent;
  var _versionExp = '\\s?([\\d\\.\\-\\_]+)';
  var _version;

  if(/(iPhone|iPad|iPod|iOS)/i.test(ua)){
    _versionExp = '(OS)' + _versionExp;
    _version = ua.match(/OS\s?([\d\.]+)/);
    window.GLOBAL.platform.system = 'ios';

  } else if(/android/i.test(ua)){
    _versionExp = '(Android)' + _versionExp;
    _version = ua.match(/(Android)\s?([\d\.]+)/);
    window.GLOBAL.platform.system = 'android';
  };

  _version = ua.match(new RegExp(_versionExp));

  if (Array.isArray(_version) && _version.length > 2) {
    window.GLOBAL.platform.version = parseFloat(_version[2].replace(/[\-\_]/g, '.'));;
  };

  if(/MicroMessenger/i.test(ua)){
    window.GLOBAL.platform.browser = 'wechat';
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

/**
 * 插件默认配置
 *
 * FastClick
 * cxDialog
 * cxSelect
 * --------------------
 */

// FastClick Only iOS
// 在 Android 低端机下，效果不理想，不使用
if ('addEventListener' in document && GLOBAL.platform && GLOBAL.platform.system === 'ios') {
  document.addEventListener('DOMContentLoaded', function(){
    FastClick.attach(document.body);
  }, false);
};


// cxDialog 设置
if ($.cxDialog) {
  $.cxDialog.defaults.baseClass = 'ios';
  $.cxDialog.defaults.background = 'rgba(0,0,0,0.4)';
  $.cxDialog.defaults.title = '提示';
  $.cxDialog.defaults.ok = function(){};
};


// cxSelect 配置
if ($.cxSelect) {
  $.cxSelect.defaults.url = GLOBAL.url.cityData;
};

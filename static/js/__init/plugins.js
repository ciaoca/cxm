/**
 * 插件默认配置
 *
 * FastClick
 * cxDialog
 * cxValidation
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
  $.cxDialog.defaults.title = '提示';
  $.cxDialog.defaults.ok = function(){};

  // cxValidation 配置
  if (cxValidation) {
    cxValidation.setOptions({
      error: function(result) {
        var nodeName = result.element.nodeName.toLowerCase();

        $.cxDialog({
          info: result.message,
          ok: function() {
            if (nodeName !== 'input' || ['radio','checkbox','color','range','file'].indexOf(result.element.type) === -1) {
              result.element.focus();
            };
          }
        });
      }
    });
  };
};


// cxSelect 配置
if ($.cxSelect) {
  $.cxSelect.defaults.url = GLOBAL.url.cityData;
};

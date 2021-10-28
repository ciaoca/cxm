/**
 * 插件默认配置
 *
 * FastClick
 * cxDate
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


// cxDate 语言配置
if (typeof cxDate === 'function') {
  cxDate.setLanguage({
    monthAbbr: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','十二月'],
    monthName: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    weekAbbr: ['周日','周一','周二','周三','周四','周五','周六'],
    weekName: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
    amName: ['上午','下午'],
    AMName: ['上午','下午']
  });
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

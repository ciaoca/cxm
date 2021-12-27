/**
 * artTemplate 模板引擎扩展
 *
 * tfIsString                 是否是字符串
 * tfIsNumber                 是否是数字
 * tfIsArray                  是否是数组
 * tfInArray                  是否存在于数组
 * tfReplace                  替换内容
 * tfReplaceEnter             替换换行
 * tfNumberFormat             数字格式化
 * tfDate                     日期格式化
 * tfGetWeekName              获取星期值
 * tfEncodeURIComponent       URI 编码
 * tfUrlAddQuery              给 URL 增加参数
 *
 * --------------------       模板 GLOBAL.template.X
 * footerNav                  底部导航
 * filterTool                 筛选栏
 * --------------------
 */

template.defaults.imports.tfIsString = function(val) {
  return APP.isString(val);
};
template.defaults.imports.tfIsNumber = function(val) {
  return APP.isNumber(val);
};
template.defaults.imports.tfIsArray = function(val) {
  return APP.isArray(val);
};
template.defaults.imports.tfInArray = function(val, arr) {
  return (Array.isArray(arr) && arr.indexOf(val) >= 0) ? true : false;
};

/**
 * 替换内容
 * @param {string} string - 原始内容
 * @param {string} regexp - 正则表达式的字符串
 * @param {string} replacement - 替换内容
 */
template.defaults.imports.tfReplace = function(string, regexp, replacement) {
  if (typeof string !== 'string') {
    string = String(string);
  };

  if (string.length) {
    string = string.replace(new RegExp(regexp, 'gi'), replacement);
  };

  return string;
};

// 替换换行
template.defaults.imports.tfReplaceEnter = function() {
  return APP.replaceEnter.apply(APP, arguments);
};

// 数字格式化
template.defaults.imports.tfNumberFormat = function() {
  if (typeof arguments[0] === 'number') {
    return APP.numberFormat.apply(APP, arguments);
  } else {
    return arguments[0];
  };
};

// 日期格式化
template.defaults.imports.tfDate = function(time, style) {
  if (typeof time === 'number' && time > 0) {
    return dayjs(time).format(style);
  } else {
    return '-';
  };
};

// 获取星期值
template.defaults.imports.tfGetWeekName = function(num) {
  var value = num;
  var key = parseInt(num, 10);
  var list = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  if (isNaN(key)) {
    return value;
  };

  if (key >= 7) {
    key %= 7;
  } else if (key < 0) {
    key = Math.abs(key);
  };

  if (typeof list[key] === 'string') {
    value = list[key]
  };

  return value;
};

/**
 * URI 编码
 * @param {string} string - 字符串
 * @param {object} data - 数据
 * @param {array} data.body - 表格主题
 * @param {array} [data.header] - 表头
 * @param {array} [data.footer] - 表注
 * @param {element} [options] - 配置
 * @param {string} options.skipCols - 跳过的列
 */
template.defaults.imports.tfEncodeURIComponent = function(string) {
  return encodeURIComponent(string);
};

/**
 * 给 URL 增加参数
 * @param {string} url - 原始内容
 * @param {string} val - 要增加的内容
 */
template.defaults.imports.tfUrlAddQuery = function(url, val) {
  if (typeof val === 'string' && val.length) {
    url += url.indexOf('?') >= 0 ? '&' : '?';
    url += val;
  };
  return url;
};


// 模板: 底部导航
GLOBAL.template.footerNav = '<nav>'
  + '{{each data item alias}}'
    + '{{if item.sub}}'
      + '<dl class="col {{alias}}{{if target == alias}} n{{/if}}">'
        + '<dt><a href="javascript://" rel="sub">{{item.name}}</a></dt>'
        + '<dd>'
          + '{{each item.sub val key}}'
            + '<a class="{{key}}" '
            + '{{if val.link}}href="{{val.link}}"{{else}}href="javascript://" rel="{{key}}"{{/if}}'
            + '>{{val.name}}</a>'
          + '{{/each}}'
        + '</dd>'
      + '</dl>'
    + '{{else}}'
      + '<a class="col {{alias}}{{if target == alias}} n{{/if}}" '
      + '{{if item.link}}href="{{item.link}}"{{else}}href="javascript://" rel="{{alias}}"{{/if}}'
      + '>{{item.name}}</a>'
    + '{{/if}}'
  + '{{/each}}'
+ '</nav>';


// 模板: 筛选栏
GLOBAL.template.filterTool = '<a class="bgclose" href="javascript://" rel="close"></a>'
+ '<nav>'
  + '{{each data item alias}}'
    + '<dl class="col {{alias}}">'
      + '<dt data-title="{{item.title}}">{{if (item.default && item.default.title)}}{{item.default.title}}{{else}}{{item.title}}{{/if}}</dt>'
      + '{{if item.list}}'
        + '<dd{{if item.cols}} class="a_col a_col_{{item.cols}}"{{/if}}>'
          + '{{each item.list val bIndex}}'
            + '<a{{if ((item.default && item.default.value == val.value) || ((!item.default || !item.default.value) && bIndex === 0 && !val.value))}} class="n"{{/if}} href="javascript://" rel="filter_{{alias}}" rev="{{val.value}}" data-title="{{val.title}}">{{val.title}}</a>'
          + '{{/each}}'
        + '</dd>'
      + '{{else if item.sub}}'
        + '<dd class="sub_col">'
          + '{{each item.sub val bIndex}}'
            + '<dl class="row">'
              + '<dt>'
                + '{{if !val.sub || !val.sub.length}}'
                  + '<a{{if ((item.default && item.default.value == val.value) || ((!item.default || !item.default.value) && !val.value))}} class="n"{{/if}} href="javascript://" rel="filter_{{alias}}" rev="{{val.value}}" data-title="{{val.title}}">{{val.title}}</a>'
                + '{{else}}{{val.title}}{{/if}}'
              + '</dt>'
              + '<dd>'
                + '{{each val.sub child}}'
                  + '<a{{if (item.default && item.default.value == child.value)}} class="n"{{/if}} href="javascript://" rel="filter_{{alias}}" rev="{{child.value}}" data-title="{{child.title}}">{{child.title}}</a>'
                + '{{/each}}'
              + '</dd>'
            + '</dl>'
          + '{{/each}}'
        + '</dd>'
      + '{{/if}}'
    + '</dl>'
  + '{{/each}}'
+ '</nav>';

/**
 * init.js
 * 通常加载在 </head> 之前，不进行 DOM 相关的操作。
 * ------------------------------ */
window.GLOBAL = {
  version: '1.0.0',
  prefix: '', // 缓存前缀
  timestamp: new Date().getTime(),
  template: {},
  url: {
    base: '/cxm/'
  },
  dom: {}
};

// tabBar 配置
GLOBAL.tabBarConfig = {
  home: {
    name: '首页',
    link: GLOBAL.url.base + 'docs/view/about/index.html'
  },
  module: {
    name: '组件',
    link: GLOBAL.url.base + 'docs/view/module/index.html'
  },
  example: {
    name: '实例',
    link: GLOBAL.url.base + 'docs/view/example/index.html'
  },
  more: {
    name: '更多',
    sub: {
      github: {
        name: 'Github',
        link: 'https://github.com/ciaoca/cxm'
      },
      plugins: {
        name: '插件列表',
        link: GLOBAL.url.base + 'docs/view/about/plugins.html'
      },
      test: {
        name: '测试',
        link: GLOBAL.url.base + 'docs/view/test/index.html'
      }
    }
  }
};


/**
 * GLOBAL.platform 系统信息
 * isHttps          是否为 https 环境
 * system           系统
 * version          系统版本号
 * browser          浏览器
 * browserVersion   浏览器版本号
 */
(function() {
  var ua = navigator.userAgent.toLowerCase();
  var version;

  GLOBAL.platform = {
    isHttps: !!('https:' === document.location.protocol)
  };

  if(/(iphone|ipad|ipod|ios)/i.test(ua)){
    version = ua.match(/os\s([\d\.\_]+)/i);
    GLOBAL.platform.system = 'ios';

  } else if(/android/i.test(ua)){
    version = ua.match(/android\s([\d\.]+)/i);
    GLOBAL.platform.system = 'android';

  } else if(/windows nt/i.test(ua)){
    version = ua.match(/windows nt\s([\d\.]+)/i);
    GLOBAL.platform.system = 'windows';

  } else if(/mac os x/i.test(ua)){
    version = ua.match(/mac os x\s([\d\.]+)/i);
    GLOBAL.platform.system = 'mac';
  };

  if (Array.isArray(version) && version.length > 1) {
    GLOBAL.platform.version = parseFloat(version[1].replace(/[\-\_]/g, '.'));
  };

  if(/micromessenger/i.test(ua)){
    GLOBAL.platform.browser = 'wechat';
    version = ua.match(/micromessenger\/([\d\.]+)/i);

  } else if (/msie/i.test(ua)) {
    GLOBAL.platform.browser = 'ie';
    version = ua.match(/msie\s([\d\.]+)/i);

  } else if (/trident/i.test(ua)) {
    GLOBAL.platform.browser = 'ie';
    version = ua.match(/rv:([\d\.]+)/);

  } else if (/chrome/i.test(ua)) {
    GLOBAL.platform.browser = 'chrome';
    version = ua.match(/chrome\/([\d\.]+)/i);

  } else if (/safari/i.test(ua)) {
    version = ua.match(/version\/([\d\.]+)/i);
    GLOBAL.platform.browser = 'safari';
  };

  if (Array.isArray(version) && version.length > 1) {
    GLOBAL.platform.browserVersion = parseFloat(version[1].replace(/[\-\_]/g, '.'));
  };
})();


// 解析当前页 URL
(function() {
  var url = location.hash;

  if (url.indexOf('#!') === 0) {
    url = location.href;
    url = url.replace('#!', '#');
    GLOBAL.purl = purl(url);
  } else {
    GLOBAL.purl = purl();
  };
})();


// 初始化 APP 插件
window.APP = new WebApp({
  prefix: GLOBAL.prefix
});


/**
 * artTemplate 模板引擎添加方法
 */
template.defaults.imports.tfEncodeURIComponent = function(string) {
  return encodeURIComponent(string);
};
template.defaults.imports.tfReplace = function(string, regexp, replacement) {
  if (typeof string !== 'string') {
    string = String(string);
  };

  if (string.length) {
    string = string.replace(new RegExp(regexp, 'gi'), replacement);
  };

  return string;
};
template.defaults.imports.tfReplaceEnter = function() {
  return APP.replaceEnter.apply(APP, arguments);
};
template.defaults.imports.tfNumberFormat = function() {
  return APP.numberFormat.apply(APP, arguments);
};
template.defaults.imports.tfDate = function(time, style) {
  return cxDate(style, time);
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

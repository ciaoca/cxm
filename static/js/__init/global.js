/**
 * 全局配置
 * -------------------- */
window.GLOBAL = {
  version: '1.0.0',
  prefix: '', // 缓存前缀

  dom: {},
  platform: {},
  template: {},
  mediaMode: 'mobile',

  // URL 配置
  url: {
    base: '/cxm/',
    cityData: '/cxm/static/plugins/cxSelect/json/cityData.min.json', // cxSelect 省市数据
  },
  urlHashTag: '!',

  // 分页配置
  pagesConfig: {
    code: '{{count}}{{cur}}{{number}}{{prev}}{{next}}',
    numberLength: 3,
  },
};


// 根据窗口宽度定义媒体模式
if (window.innerWidth > 1024) {
  GLOBAL.mediaMode = 'pc';
  GLOBAL.pagesConfig.code = '{{count}}{{cur}}{{first}}{{last}}{{number}}{{prev}}{{next}}';
  GLOBAL.pagesConfig.numberLength = 9;

} else if (window.innerWidth > 640) {
  GLOBAL.mediaMode = 'pad';
  GLOBAL.pagesConfig.code = '{{count}}{{cur}}{{number}}{{prev}}{{next}}';
  GLOBAL.pagesConfig.numberLength = 5;
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
  const ua = navigator.userAgent.toLowerCase();
  let version;

  GLOBAL.platform.isHttps = !!('https:' === document.location.protocol);

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
    version = ua.match(/micromessenger\/([\d\.]+)/i);
    GLOBAL.platform.browser = 'wechat';

  } else if (/chrome/i.test(ua)) {
    version = ua.match(/chrome\/([\d\.]+)/i);
    GLOBAL.platform.browser = 'chrome';

  } else if (/safari/i.test(ua)) {
    version = ua.match(/version\/([\d\.]+)/i);
    GLOBAL.platform.browser = 'safari';

  } else if (/msie/i.test(ua)) {
    version = ua.match(/msie\s([\d\.]+)/i);
    GLOBAL.platform.browser = 'ie';

  } else if (/trident/i.test(ua)) {
    version = ua.match(/rv:([\d\.]+)/);
    GLOBAL.platform.browser = 'ie';
  };

  if (Array.isArray(version) && version.length > 1) {
    GLOBAL.platform.browserVersion = parseFloat(version[1].replace(/[\-\_]/g, '.'));
  };
})();


// GLOBAL.purl 解析当前页 URL
(function() {
  let url = location.hash;
  const tag = '#' + GLOBAL.urlHashTag;

  if (url.indexOf(tag) === 0) {
    url = location.href;
    url = url.replace(tag, '#');
    GLOBAL.purl = purl(url);
  } else {
    GLOBAL.purl = purl();
  };
})();


// 配置 WebApp
WebApp.setOptions({
  prefix: GLOBAL.prefix,
  hashTag: GLOBAL.urlHashTag,
});

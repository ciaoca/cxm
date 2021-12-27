/**
 * 全局配置
 * ------------------------------ */
window.GLOBAL = {
  version: '1.0.0',
  prefix: '', // 缓存前缀
  platform: {},
  dom: {},
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
  var ua = navigator.userAgent.toLowerCase();
  var version;

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


// GLOBAL.purl 解析当前页 URL
(function() {
  var url = location.hash;
  var tag = '#' + GLOBAL.urlHashTag;

  if (url.indexOf(tag) === 0) {
    url = location.href;
    url = url.replace(tag, '#');
    GLOBAL.purl = purl(url);
  } else {
    GLOBAL.purl = purl();
  };
})();


// 初始化 APP 插件
window.APP = new WebApp({
  prefix: GLOBAL.prefix,
  hashTag: GLOBAL.urlHashTag,
});


// __init/template.js
template.defaults.imports.tfIsString=function(a){return APP.isString(a)},template.defaults.imports.tfIsNumber=function(a){return APP.isNumber(a)},template.defaults.imports.tfIsArray=function(a){return APP.isArray(a)},template.defaults.imports.tfInArray=function(a,b){return Array.isArray(b)&&b.indexOf(a)>=0?!0:!1},template.defaults.imports.tfReplace=function(a,b,c){return"string"!=typeof a&&(a=String(a)),a.length&&(a=a.replace(new RegExp(b,"gi"),c)),a},template.defaults.imports.tfReplaceEnter=function(){return APP.replaceEnter.apply(APP,arguments)},template.defaults.imports.tfNumberFormat=function(){return"number"==typeof arguments[0]?APP.numberFormat.apply(APP,arguments):arguments[0]},template.defaults.imports.tfDate=function(a,b){return"number"==typeof a&&a>0?dayjs(a).format(b):"-"},template.defaults.imports.tfGetWeekName=function(a){var b=a,c=parseInt(a,10),d=["周日","周一","周二","周三","周四","周五","周六"];return isNaN(c)?b:(c>=7?c%=7:0>c&&(c=Math.abs(c)),"string"==typeof d[c]&&(b=d[c]),b)},template.defaults.imports.tfEncodeURIComponent=function(a){return encodeURIComponent(a)},template.defaults.imports.tfUrlAddQuery=function(a,b){return"string"==typeof b&&b.length&&(a+=a.indexOf("?")>=0?"&":"?",a+=b),a},GLOBAL.template.footerNav='<nav>{{each data item alias}}{{if item.sub}}<dl class="col {{alias}}{{if target == alias}} n{{/if}}"><dt><a href="javascript://" rel="sub">{{item.name}}</a></dt><dd>{{each item.sub val key}}<a class="{{key}}" {{if val.link}}href="{{val.link}}"{{else}}href="javascript://" rel="{{key}}"{{/if}}>{{val.name}}</a>{{/each}}</dd></dl>{{else}}<a class="col {{alias}}{{if target == alias}} n{{/if}}" {{if item.link}}href="{{item.link}}"{{else}}href="javascript://" rel="{{alias}}"{{/if}}>{{item.name}}</a>{{/if}}{{/each}}</nav>',GLOBAL.template.filterTool='<a class="bgclose" href="javascript://" rel="close"></a><nav>{{each data item alias}}<dl class="col {{alias}}"><dt data-title="{{item.title}}">{{if (item.default && item.default.title)}}{{item.default.title}}{{else}}{{item.title}}{{/if}}</dt>{{if item.list}}<dd{{if item.cols}} class="a_col a_col_{{item.cols}}"{{/if}}>{{each item.list val bIndex}}<a{{if ((item.default && item.default.value == val.value) || ((!item.default || !item.default.value) && bIndex === 0 && !val.value))}} class="n"{{/if}} href="javascript://" rel="filter_{{alias}}" rev="{{val.value}}" data-title="{{val.title}}">{{val.title}}</a>{{/each}}</dd>{{else if item.sub}}<dd class="sub_col">{{each item.sub val bIndex}}<dl class="row"><dt>{{if !val.sub || !val.sub.length}}<a{{if ((item.default && item.default.value == val.value) || ((!item.default || !item.default.value) && !val.value))}} class="n"{{/if}} href="javascript://" rel="filter_{{alias}}" rev="{{val.value}}" data-title="{{val.title}}">{{val.title}}</a>{{else}}{{val.title}}{{/if}}</dt><dd>{{each val.sub child}}<a{{if (item.default && item.default.value == child.value)}} class="n"{{/if}} href="javascript://" rel="filter_{{alias}}" rev="{{child.value}}" data-title="{{child.title}}">{{child.title}}</a>{{/each}}</dd></dl>{{/each}}</dd>{{/if}}</dl>{{/each}}</nav>';


// __init/plugins.js
if("addEventListener"in document&&GLOBAL.platform&&"ios"===GLOBAL.platform.system&&document.addEventListener("DOMContentLoaded",function(){FastClick.attach(document.body)},!1),$.cxDialog&&($.cxDialog.defaults.baseClass="ios",$.cxDialog.defaults.title="提示",$.cxDialog.defaults.ok=function(){}),"function"==typeof Notyf){var notyf=new Notyf({ripple:!1,position:{x:"center",y:"top"},types:[{type:"success",className:"notyf__cxm--success",background:"rgba(140, 193, 82, 0.9)",icon:!1},{type:"info",className:"notyf__cxm--info",background:"rgba(51, 51, 51, 0.9)",icon:!1},{type:"warn",className:"notyf__cxm--warn",background:"rgba(254, 153, 57, 0.9)",icon:!1},{type:"error",className:"notyf__cxm--error",background:"rgba(218, 68, 83, 0.9)",icon:!1}]});cxValidation&&cxValidation.setOptions({complete:function(){notyf.dismissAll()},error:function(a){notyf.open({type:"info",message:a.message});var b=a.element.nodeName.toLowerCase();("input"!==b||-1===["radio","checkbox","color","range","file"].indexOf(a.element.type))&&a.element.focus()}})}$.cxSelect&&($.cxSelect.defaults.url=GLOBAL.url.cityData),$.cxCalendar&&"mobile"===GLOBAL.mediaMode&&($.cxCalendar.defaults.position="fixed",$.cxCalendar.defaults.baseClass="fixed");


// __init/page.js
!function(){var a={config:{},dom:{}};a.init=function(){var a=this;a.dom.body=$("body"),APP.isObject(window.PageConfig)&&$.extend(a.config,window.PageConfig),document.getElementById("header_back")&&a.updateBackUrl(),document.getElementById("tabbar")&&(GLOBAL.dom.tabbar=APP.initTabBar(document.getElementById("tabbar"),GLOBAL.tabBarConfig)),"addEventListener"in document&&/(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase())&&a.fixInputFixed(),"pc"===GLOBAL.mediaMode&&a.buildPageQrcode(),a.bindBodyEvent()},a.bindBodyEvent=function(){var a=this;a.dom.body.on("click","a",function(a){var b=this,c=b.rel,d=b.rev,e=b.dataset.option;try{e=JSON.parse(e)}catch(f){}"call_tip"===c?(a.preventDefault(),APP.tipToggle(d)):"call_panel"===c&&(a.preventDefault(),APP.panelToggle(d,e))})},a.updateBackUrl=function(){var c,a=this,b=GLOBAL.purl.param("backurl");a.dom.headerBack=document.getElementById("header_back"),"string"==typeof b&&b.length&&("_none"===b?a.dom.headerBack.style.display="none":"_back"===b?(c=new RegExp("^http(s?)://"+location.host+"/"),document.referrer&&c.test(document.referrer)&&(a.dom.headerBack.href="javascript:history.back();")):a.dom.headerBack.href=decodeURIComponent(b))},a.buildPageQrcode=function(){var a=document.createElement("div"),b=document.createElement("div");new QRCode(b,{text:encodeURI(location.href),width:88,height:88,colorDark:"#000000",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.L}),a.classList.add("page_qrcode"),a.appendChild(b),a.insertAdjacentHTML("beforeend","<p>在手机上浏览</p>"),document.body.appendChild(a)},a.fixInputFixed=function(){var b=document.body,c=function(a){var b=["input","textarea","select"],c=["checkbox","radio","file","button","submit","reset","image","range"],d=a.target.nodeName.toLowerCase(),e=!1;return b.indexOf(d)>=0&&!a.target.readOnly&&!a.target.disabled&&("input"===d?c.indexOf(a.target.type)<=-1&&(e=!0):("textarea"===d||"select"===d)&&(e=!0)),e};b.addEventListener("focus",function(a){c(a)&&!b.classList.contains("onfocus")&&b.classList.add("onfocus")},!0),b.addEventListener("blur",function(a){c(a)&&b.classList.remove("onfocus")},!0)},document.addEventListener("DOMContentLoaded",function(){a.init()})}();

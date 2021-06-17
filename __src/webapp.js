/**
 * WebApp
 * @author ciaoca <ciaoca@gmail.com>
 * --------------------
 * isElement            检测是否是 DOM 元素
 * isJquery             检测是否是 jQuery 对象
 * isZepto              检测是否是 Zepto 对象
 * isString             检测是否是 String 字符串
 * isNumber             检测是否是 Number 数字
 * isBoolean            检测是否是 Boolean 布尔值
 * isFunction           检测是否是 Function 函数
 * isArray              检测是否是 Array 数组
 * isNull               检测是否是 Null
 * isUndefined          检测是否是 Undefined
 * isObject             检测是否是 Object 对象
 * isDate               检测是否是 Date 日期对象
 * isRegExp             检测是否是 RegExp 正则表达式
 * isError              检测是否是 Error 对象
 * isJson               检测是否是 JSON
 * isLeapYear           检测是否是闰年
 * isHidden             检测元素是否不可见
 * isVisible            检测元素是否可见
 * --------------------
 * setStorage           保存缓存（sessionStorage）
 * getStorage           读取缓存（sessionStorage）
 * removeStorage        删除缓存（sessionStorage）
 * clearStorage         清空缓存（sessionStorage）
 * setLocalStorage      保存本地存储（localStorage）
 * getLocalStorage      读取本地存储（localStorage）
 * removeLocalStorage   删除本地存储（localStorage）
 * clearLocalStorage    清空本地存储（localStorage）
 * --------------------
 * toFloat              转换浮点数
 * numberFormat         格式化数字
 * arrayUnique          数组去重
 * getRandomNumber      生成随机整数
 * getRandomString      生成随机字符串
 * replaceEnter         替换换行
 * replaceQuot          替换引号
 * replaceHtml          替换 HTML 标签
 * --------------------
 * tipShow              显示 Tip
 * tipHide              隐藏 Tip
 * tipToggle            显示/隐藏 Tip
 * loadingShow          显示 Loading
 * loadingHide          隐藏 Loading
 * loadingToggle        显示/隐藏 Loading
 * panelShow            显示面板
 * panelHide            隐藏面板
 * panelToggle          显示/隐藏面板
 * --------------------
 * initTabBar           初始化 TabBar
 * buildTabBar          构建 TabBar
 * initFilterTool       初始化 FilterTool
 * buildFilterTool      构建 FilterTool
 * --------------------
 * scrollTo             滚动到位置
 * createUrlHash        创建 Hash URL
 * getFormData          获取表单提交的数据
 * getPageHtml          生成分页代码
 * compressPicture      压缩图片
 * --------------------
 * formAjax             表单 AJAX 提交
 * smsSend              发送短信验证码
 */
(function(window, undefined) {
  var app = function() {
    return this.init.apply(this,arguments);
  };

  // 初始化
  app.prototype.init = function(options) {
    var self = this;
    var defaults = {
      prefix: ''    // 本地缓存命名前缀
    };
    self.option = $.extend({}, defaults, options);

    self.dom = {};

    self.dom.loading = document.createElement('div');
    self.dom.loading.setAttribute('id', 'app_loading');

    self.dom.tip = document.createElement('div');
    self.dom.tip.setAttribute('id', 'app_tip');
    self.dom.tip.addEventListener('click', self.tipHide.bind(self));

    self.panelCount = 0;
    self.dom.scroll = null;

    document.addEventListener('DOMContentLoaded', function() {
      self.dom.body = document.body;
      // if (self.isElement(document.getElementById('wrap'))) {
      //   self.dom.wrap = document.getElementById('wrap');
      // };
    });

    self.getDom = function(el) {
      var dom;

      if (self.isJquery(el) || self.isZepto(el)) {
        return el;
      };

      if (self.isElement(el)) {
        dom = $(el);
      } else if (self.isString(el) && el.length) {
        dom = $('#'+el);
      };

      return dom;
    };
  };

  /**
   * 检测是否是 iOS 系统
   * @returns {boolean}
   */
  app.prototype.isIos = function() {
    var ua = navigator.userAgent.toLowerCase();
    return /(iphone|ipad|ipod|ios)/i.test(ua);
  };

  /**
   * 检测是否是 DOM 元素
   * @returns {boolean}
   */
  app.prototype.isElement = function(o) {
    if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
      return true;
    } else {
      return (o && o.nodeType && o.nodeType === 1) ? true : false;
    };
  };

  /**
   * 检测是否是 jQuery 对象
   * @returns {boolean}
   */
  app.prototype.isJquery = function(o) {
    return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
  };

  /**
   * 检测是否是 Zepto 对象
   * @returns {boolean}
   */
  app.prototype.isZepto = function(o) {
    return (o && o.length && (typeof Zepto === 'function' || typeof Zepto === 'object') && Zepto.zepto.isZ(o)) ? true : false;
  };
  
  /**
   * 检测是否是 String 字符串
   * @returns {boolean}
   */
  app.prototype.isString = function(value) {
    return typeof value === 'string';
  };
  
  /**
   * 检测是否是 Number 数字
   * @returns {boolean}
   */
  app.prototype.isNumber = function(value) {
    return (typeof value === 'number' && isFinite(value)) ? true : false;
  };
  
  /**
   * 检测是否是 Boolean 布尔值
   * @returns {boolean}
   */
  app.prototype.isBoolean = function(value) {
    return typeof value === 'boolean';
  };
  
  /**
   * 检测是否是 Function 函数
   * @returns {boolean}
   */
  app.prototype.isFunction = function(value) {
    return typeof value === 'function';
  };
  
  /**
   * 检测是否是 Array 数组
   * @returns {boolean}
   */
  app.prototype.isArray = function(value) {
    if (typeof Array.isArray === 'function') { 
      return Array.isArray(value);
    } else { 
      return Object.prototype.toString.call(value) === '[object Array]';
    };
  };

  /**
   * 检测是否是 Null
   * @returns {boolean}
   */
  app.prototype.isNull = function(value) {
    return Object.prototype.toString.call(value) === '[object Null]';
  };

  /**
   * 检测是否是 Undefined
   * @returns {boolean}
   */
  app.prototype.isUndefined = function(value) {
    return Object.prototype.toString.call(value) === '[object Undefined]';
  };

  /**
   * 检测是否是 Object
   * @returns {boolean}
   */
  app.prototype.isObject = function(value) {
    if (typeof value !== 'object' || value.nodeType || value !== null && value !== undefined && value === value.window) {
      return false;
    };

    if (value.constructor &&
      !Object.prototype.hasOwnProperty.call(value.constructor.prototype, 'isPrototypeOf')) {
      return false;
    };

    return true;
  };

  /**
   * 检测是否是 Date 日期
   * @returns {boolean}
   */
  app.prototype.isDate = function(value) {
    return value instanceof Date || Object.prototype.toString.call(value) === '[object Date]';
  };

  /**
   * 检测是否是 RegExp 正则表达式
   * @returns {boolean}
   */
  app.prototype.isRegExp = function(value) {
    return value instanceof RegExp || Object.prototype.toString.call(value) === '[object RegExp]';
  };

  /**
   * 检测是否是 Error 错误
   * @returns {boolean}
   */
  app.prototype.isError = function(value) {
    return value instanceof Error;
  };

  /**
   * 检测是否是 JSON
   * @returns {boolean}
   */
  app.prototype.isJson = function(value) {
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    };
    return true;
  };

  /**
   * 判断是否为闰年
   * @returns {boolean}
   */
  app.prototype.isLeapYear = function(year) {
    if (!this.isNumber(year)) {
      return false;
    };

    return !(year % (year % 100 ? 4 : 400));
  };

  /**
   * 检测元素是否不可见
   * @returns {boolean}
   */
  app.prototype.isHidden = function(o) {
    if (this.isElement(o)) {
      var style = window.getComputedStyle(o);
      return (style.getPropertyValue('display') === 'none' || style.getPropertyValue('visibility') === 'hidden' || style.getPropertyValue('opacity') == 0 || (style.getPropertyValue('width') == 0 && style.getPropertyValue('height') == 0)) ? true : false;
    } else {
      return true;
    };
  };

  /**
   * 检测元素是否可见
   * @returns {boolean}
   */
  app.prototype.isVisible = function(o) {
    return !this.isHidden(o);
  };

  // 保存缓存（sessionStorage）
  app.prototype.setStorage = function(name,data) {
    if (!name || !name.length) {
      return;
    };

    name = this.option.prefix + name;
    sessionStorage.setItem(name, JSON.stringify(data));
  };

  // 读取缓存（sessionStorage）
  app.prototype.getStorage = function(name) {
    if (!name || !name.length) {
      return null;
    };

    name = this.option.prefix + name;

    if (!sessionStorage.getItem(name)) {
      return null;
    };

    return JSON.parse(sessionStorage.getItem(name));
  };

  // 删除缓存（sessionStorage）
  app.prototype.removeStorage = function(name) {
    if (!name || !name.length) {
      return;
    };

    name = this.option.prefix + name;

    if (!sessionStorage.getItem(name)) {
      return;
    };

    sessionStorage.removeItem(name);
  };

  // 清空缓存（sessionStorage）
  app.prototype.clearStorage = function() {
    var storage = sessionStorage;
    var _prelength = this.option.prefix.length;

    for (var i = 0, j = 0, l = storage.length; i < l; i++) {
      if (storage.key(j).slice(0,_prelength) === this.option.prefix) {
        storage.removeItem(storage.key(j));
      } else {
        j++;
      };
    };
  };

  // 保存本地存储（localStorage）
  app.prototype.setLocalStorage = function(name,data) {
    if (!name || !name.length) {
      return;
    };

    name = this.option.prefix + name;
    
    localStorage.setItem(name, JSON.stringify(data));
  };

  // 读取本地存储（localStorage）
  app.prototype.getLocalStorage = function(name) {
    if (!name || !name.length) {
      return null;
    };

    name = this.option.prefix + name;

    if (!localStorage.getItem(name)) {
      return null;
    };

    try {
      return JSON.parse(localStorage.getItem(name));
    } catch(e) {
      return null;
    };
  };

  // 删除本地存储（localStorage）
  app.prototype.removeLocalStorage = function(name) {
    if (!name || !name.length) {
      return;
    };

    name = this.option.prefix + name;

    if (!localStorage.getItem(name)) {
      return;
    };
    
    localStorage.removeItem(name);
  };

  // 清空本地存储（localStorage）
  app.prototype.clearLocalStorage = function() {
    var storage = localStorage;
    var _prelength = this.option.prefix.length;

    for (var i = 0, j = 0, l = storage.length; i < l; i++) {
      if (storage.key(j).slice(0,_prelength) === this.option.prefix) {
        storage.removeItem(storage.key(j));
      } else {
        j++;
      };
    };
  };

  /**
   * 转换浮点数
   * @param {number} value
   * @param {integer} [decimals] - 保留小数点位数
   * @returns {number}
   */
  app.prototype.toFloat = function(value, decimals) {
    if (!this.isNumber(decimals)) {
      decimals = 0;
    };

    return Math.round(Math.round(value * Math.pow(10, decimals + 1)) / 10) / Math.pow(10, decimals);
  };

  /**
   * 格式化数字
   * @param {number} value
   * @param {integer} [decimals] - 保留小数点位数
   * @param {string} [decimalpoint] - 小数点的字符串
   * @param {string} [separator] - 千位分隔符的字符串
   * @returns {string}
   */
  app.prototype.numberFormat = function(value, decimals, mustKeepZero, decimalpoint, separator) {
    if (!this.isNumber(decimals)) {decimals = 0};
    if (mustKeepZero !== true) {mustKeepZero = false};
    if (!this.isString(decimalpoint)) {decimalpoint = '.'};
    if (!this.isString(separator)) {separator = ','};

    value = this.toFloat(value, decimals);
    value = value.toFixed(decimals);

    if (decimals > 0) {
      var sp = value.split('.');
      var a = sp[0];
      var b = sp[1];

      sp[0] = sp[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      value = sp.join('.');

    } else {
      value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    };

    value = value.replace(/[\.\,]/g, function(key, index, val) {
      if (key === '.') {
        return decimalpoint;

      } else if (key === ',') {
        return separator;
      };
    });

    if (!mustKeepZero) {
      value = value.replace(/(\.[1-9]+)0+$/, '$1');
      value = value.replace(/\.0+$/, '');
    };

    return value;
  };

  /**
   * 数组去重
   * @param array {array}
   * @returns {array}
   */
  app.prototype.arrayUnique = function(array) {
    if (!this.isArray(array)) {
      return array;
    };

    var newArray=[];
    var provisionalTable = {};

    for (var i = 0, item; (item= array[i]) != null; i++) {
      if (!provisionalTable[item]) {
        newArray.push(item);
        provisionalTable[item] = true;
      }
    }

    return newArray;
  };

  /**
   * 生成随机整数
   * @param {integer} min - 最小值
   * @param {integer} min - 最大值
   * @returns {integer}
   */
  app.prototype.getRandomNumber = function(min, max) {
    min = isFinite(min) ? parseInt(min, 10) : 0;
    max = isFinite(max) ? parseInt(max, 10) : 0;

    if (max < min) {
      max = min;
    };

    return Math.round(Math.random() * (max - min) + min);
  };

  /**
   * 生成随机字符串
   * @param {integer} length - 字符串长度
   * @param {string} [string] - 字符范围
   * @returns {string}
   */
  app.prototype.getRandomString = function(length, string) {
    length = this.isNumber(length) ? parseInt(length, 10) : 0;
    string = (typeof string === 'string' && string.length) ? string : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    return Array.apply(0, Array(length)).map(function () {
      return string.charAt(Math.floor(Math.random() * string.length));
    }).join('');
  };
  
  /**
   * 替换换行
   * @param {string} string
   * @returns {string}
   */
  app.prototype.replaceEnter = function(string) {
    if (!this.isString(string)) {
      return string;
    };

    string = string.replace(/\r\n/g, '<br>');
    string = string.replace(/\r|\n/g, '<br>');

    return string;
  };

  /**
   * 替换引号
   * @param {string} string
   * @param {boolean} [decode] - 解码
   * @returns {string}
   */
  app.prototype.replaceQuot = function(string, decode) {
    if (!this.isString(string)) {
      return string;
    };

    if (decode === true) {
      string = string.replace(/&#34;/g, '"');
      string = string.replace(/&#39;/g, '\'');
    } else {
      string = string.replace(/"/g, '&#34;');
      string = string.replace(/'/g, '&#39;');
    };

    return string;
  };
  
  /**
   * 替换 HTML 标签
   * @param {string} string
   * @param {boolean} [decode] - 解码
   * @returns {string}
   */
  app.prototype.replaceHtml = function(string, decode) {
    if (!this.isString(string)) {
      return string;
    };

    string = string.trim();

    if (decode === true) {
      string = string.replace(/&#34;/g, '"');
      string = string.replace(/&#39;/g, '\'');
      string = string.replace(/&#60;/g, '<');
    } else {
      string = string.replace(/"/g, '&#34;');
      string = string.replace(/'/g, '&#39;');
      string = string.replace(/</g, '&#60;');
    };

    return string;
  };

  /**
   * 显示 Tip
   * @param {string} baseclass: 自定义 class
   */
  app.prototype.tipShow = function(baseclass) {
    var self = this;

    if (typeof baseclass === 'string' && baseclass.length) {
      self.dom.tip.setAttribute('class', baseclass);
    } else {
      self.dom.tip.removeAttribute('class');
    };

    self.dom.body.appendChild(self.dom.tip);
  };

  // 隐藏 Tip
  app.prototype.tipHide = function() {
    if (this.dom.body.contains(this.dom.tip)) {
      this.dom.body.removeChild(this.dom.tip);
    };
  };


  // 显示/隐藏 Tip
  app.prototype.tipToggle = function(baseclass) {
    if (this.isVisible(this.dom.tip)) {
      this.tipHide();
    } else {
      this.tipShow(baseclass);
    };
  };

  /**
   * 显示 Loading
   * @param {object} [options] - 选项
   * @param {string} options.text - 提示文字
   * @param {boolean} options.mask - 是否使用遮罩
   */
  app.prototype.loadingShow = function(options) {
    var self = this;

    if (typeof options === 'string' && options.length) {
      options = {
        text: options
      };
    };

    options = $.extend({
      text: '',
      mask: true
    }, options);

    if (typeof options.text === 'string' && options.text.length) {
      self.dom.loading.setAttribute('title', options.text);
    } else {
      self.dom.loading.removeAttribute('title');
    };

    if (options.mask === false) {
      self.dom.loading.classList.add('notmask');
    } else {
      self.dom.loading.classList.remove('notmask');
    };

    self.dom.body.appendChild(self.dom.loading);
  };

  // 隐藏 Loading
  app.prototype.loadingHide = function() {
    if (this.dom.body.contains(this.dom.loading)) {
      this.dom.body.removeChild(this.dom.loading);
    };
  };

  // 显示/隐藏 Loading
  app.prototype.loadingToggle = function(options) {
    if (this.isVisible(this.dom.loading)) {
      this.loadingHide();
    } else {
      this.loadingShow(text);
    };
  };

  /**
   * 显示面板
   * @param {element|string} el - DOM 元素或 ID
   * @param {object} [options] - 选项
   * @param {string} options.lock - 是否锁定背景
   * @param {boolean} options.blur - 是否使用模糊背景
   */
  app.prototype.panelShow = function(el, options) {
    var self = this;

    options = $.extend({
      lock: true,
      blur: false
    }, options);

    if (typeof el === 'string' && el.length) {
      el = document.getElementById(el);
    };

    if (self.isElement(el)) {
      el.classList.remove('out');

      if (!el.classList.contains('in')) {
        self.panelCount++;
        el.classList.add('in');
      };

      if (options.lock) {
        self.dom.body.classList.add('lock');
      };
      if (options.blur) {
        self.dom.body.classList.add('blur');
      };
    };
  };

  /**
   * 隐藏面板
   * @param {element|string} el - DOM 元素或 ID
   */
  app.prototype.panelHide = function(el) {
    var self = this;

    if (typeof el === 'string' && el.length) {
      el = document.getElementById(el);
    };

    if (this.isElement(el)) {
      el.classList.remove('in');

      if (!el.classList.contains('out')) {
        self.panelCount--;
        el.classList.add('out');
      };
    };

    if (self.panelCount < 0) {
      self.panelCount = 0;
    };

    if (self.panelCount <= 0) {
      self.dom.body.classList.remove('lock');
      self.dom.body.classList.remove('blur');
    };
  };

  // 显示/隐藏面板
  app.prototype.panelToggle = function(el, options) {
    if (typeof el === 'string' && el.length) {
      el = document.getElementById(el);
    };

    if (this.isElement(el)) {
      if (el.classList.contains('in')) {
        this.panelHide(el);
      } else {
        this.panelShow(el, options);
      };
    };
  };


  /**
   * 初始化 TabBar
   * @param {element|string} el - DOM 元素或 ID
   * @param {object} [data] - 配置项
   * @param {object} [target] - 当前选中项
   * @returns {ZeptoDom}
   */
  app.prototype.initTabBar = function(el, data, target) {
    var self = this;
    var domBar = self.getDom(el);

    if (!domBar) {
      return;
    };

    domBar.on('click', 'a', function(event) {
      var _this = this;
      var _rel = _this.rel;

      if (_rel === 'sub') {
        event.preventDefault();
        _parent = _this.parentNode;

        if (_parent.classList.contains('hover')) {
          _parent.classList.remove('hover');
        } else {
          _parent.classList.add('hover');
        };
      };
    });

    if (self.isObject(data)) {
      self.buildTabBar(domBar, data, target);
    };

    return domBar;
  };


  /**
   * 构建 TabBar
   * @param {element|string} el - DOM 元素或 ID
   * @param {object} data - 配置项
   * @param {object} [target] - 当前选中项
   * @returns {element}
   */
  app.prototype.buildTabBar = function(el, data, target) {
    var self = this;
    var domBar = self.getDom(el);

    if (!domBar) {
      return;
    };

    if (typeof target !== 'string' && domBar.data('target')) {
      target = domBar.data('target');
    };

    var render = template.compile(GLOBAL.template.footerNav);
    var html = render({
      data: data,
      target: target
    });

    domBar.html(html);

    return domBar;
  };


  /**
   * 初始化 FilterTool
   * @param {element|string} el - DOM 元素或 ID
   * @param {object} [data] - 配置项
   * @returns {element}
   */
  app.prototype.initFilterTool = function(el, data) {
    var self = this;
    var domTool = self.getDom(el);

    if (!domTool) {
      return;
    };

    domTool.on('click', 'a', function(event) {
      var _this = this;
      var _rel = _this.rel;
      var _rev = _this.rev;
      var _a = $(_this);

      if (_rel === 'close') {
        event.preventDefault();
        domTool.removeClass('hover');
        domTool.find('dl.col').removeClass('hover');

      } else if (_rel) {
        event.preventDefault();
        var _title = _a.data('title');
        var _dl = _a.closest('dl.col');

        if (!_rev || typeof _title !== 'string' || !_title.length) {
          _title = _dl.children('dt').data('title');
        };

        _dl.children('dt').html(_title);
        _dl.find('a').removeClass('n');
        _a.addClass('n').siblings('dl').removeClass('hover');

        domTool.removeClass('hover');
        domTool.find('dl.col').removeClass('hover');
      };
    });

    domTool.on('click', 'dt', function() {
      var _dl = $(this).closest('dl');

      if (_dl.hasClass('col')) {
        if (_dl.hasClass('hover')) {
          domTool.removeClass('hover');
        } else {
          domTool.addClass('hover');
        };

        _dl.toggleClass('hover').siblings('dl').removeClass('hover');

      } else if (_dl.hasClass('row')) {
        if (!_dl.hasClass('hover')) {
          _dl.addClass('hover').siblings('dl').removeClass('hover');
        };
      };
    });

    if (self.isObject(data)) {
      self.buildFilterTool(domTool, data);
    };

    return domTool;
  };


  /**
   * 构建 FilterTool
   * @param {element|string} el - DOM 元素或 ID
   * @param {object} data - 配置项
   */
  app.prototype.buildFilterTool = function(el, data) {
    var self = this;
    var domTool = self.getDom(el);

    if (!domTool) {
      return;
    };

    var render = template.compile(GLOBAL.template.filterTool);
    var html = render({
      data: data
    });

    domTool.html(html);

    return domTool;
  };

  /**
   * 滚动到位置
   * @param {object} [options]
   * @param {integer} options.x - 横向坐标（未支持）
   * @param {integer} options.y - 纵向坐标
   */
  app.prototype.scrollTo = function(options) {
    options = $.extend({
      x: 0,
      y: 0
    }, options);

    if (!this.isIos()) {
      window.scrollTo({
        top: options.y,
        behavior: 'smooth'
      });
    } else {
      if (document.scrollingElement && typeof document.scrollingElement.scrollTop === 'number') {
        document.scrollingElement.scrollTop = options.y;
      } else if (document.documentElement && typeof document.documentElement.scrollTop === 'number') {
        document.documentElement.scrollTop = options.y;
      } else if (document.body && typeof document.body.scrollTop === 'number') {
        document.body.scrollTop = options.y;
      };
    };
  };

  /**
   * 创建 Hash URL
   * @param {object} querys - 提交参数
   * @param {array} [keys] - 参数范围
   * @param {boolean} [isPush] - 是否插入新历史记录
   *
   * @example
   * createUrlHash({a:1,b:2,c:3}) => !#a=1&b=2&c=3
   * createUrlHash({a:1,b:2,c:3},[]) => !#
   * createUrlHash({a:1,b:2,c:3},['a','c']) => !#a=1&c=3
   */
  app.prototype.createUrlHash = function(querys, keys, isPush) {
    var data = {};
    var values = [];
    var hash = '#';

    if (Array.isArray(keys)) {
      for (var x in querys) {
        if (keys.indexOf(x) >= 0 && querys[x]) {
          querys[x] = String(querys[x]);
          if (querys[x].length) {
            data[x] = querys[x];
            values.push(x + '=' + querys[x]);
          };
        };
      };
    } else {
      for (var x in querys) {
        querys[x] = String(querys[x]);
        if (querys[x].length) {
          data[x] = querys[x];
          values.push(x + '=' + querys[x]);
        };
      };
    };

    if (values.length) {
      hash += '!' + values.join('&');
    };

    if (isPush === true) {
      history.pushState(data, document.title, hash);
    } else {
      history.replaceState(data, document.title, hash);
    };
  };

  /**
   * 获取表单提交的数据
   * @param {element} form - 表单元素
   * @returns {object}
   */
  app.prototype.getFormData = function(form) {
    var self = this;

    if (!self.isJquery(form) && !self.isZepto(form)) {
      if (self.isElement(form)) {
        form = $(form);
      } else {
        return;
      };
    };

    var dataArray = form.serializeArray();
    var dataObject = {};
    var _tempValue;

    for (var i = 0, l = dataArray.length; i < l; i++) {
      if (dataArray[i].name in dataObject) {
        if (!Array.isArray(dataObject[dataArray[i].name])) {
          _tempValue = dataObject[dataArray[i].name];
          dataObject[dataArray[i].name] = [];
          dataObject[dataArray[i].name].push(_tempValue);
        };
        dataObject[dataArray[i].name].push(dataArray[i].value);

      } else {
        dataObject[dataArray[i].name] = dataArray[i].value;
      };
    };

    return dataObject;
  };

  /**
   * 生成分页代码
   * @param {object} options - 选项
   * @param {object} options.page - 当前页码
   * @param {object} options.pageCount - 总页数
   * @param {object} options.url - 链接地址
   * @param {object} options.rel - 非跳转方式使用关键词
   * @param {object} options.code - 分页结构
   * @param {object} options.numberLength - 数字页码长度
   * @returns {string}
   */
  app.prototype.getPageHtml = function(options) {
    var html = '';

    options = $.extend({
      code: '{{count}}{{cur}}{{first}}{{last}}{{number}}{{prev}}{{next}}',
      numberLength: 9
    }, options);

    if (!this.isNumber(options.page) || !this.isNumber(options.pageCount || options.page < 1 || options.pageCount < 1)) {
      return html;
    };

    var config = {
      count: '<span>共 ' + options.pageCount + ' 页</span>',
      cur: '<span>第 ' + options.page + ' 页</span>',
      number: '',
      prev: '',
      next: '',
      first: '',
      last: ''
    };

    if (options.pageCount > 1) {
      if (typeof options.url === 'string') {
        config.prev = '<a href="' + options.url + (options.page - 1) + '">上一页</a>';
        config.next = '<a href="' + options.url + (options.page + 1) + '">下一页</a>';
        config.first = '<a href="' + options.url + '1">首页</a>';
        config.last = '<a href="' + options.url + options.pageCount + '">末页</a>';

      } else if (typeof options.rel === 'string') {
        config.prev = '<a href="javascript://" rel="' + options.rel + '" rev="' + (options.page - 1) + '">上一页</a>';
        config.next = '<a href="javascript://" rel="' + options.rel + '" rev="' + (options.page + 1) + '">下一页</a>';
        config.first = '<a href="javascript://" rel="' + options.rel + '" rev="' + '1">首页</a>';
        config.last = '<a href="javascript://" rel="' + options.rel + '" rev="' + options.pageCount + '">末页</a>';
      };

      if (options.page === 1) {
        config.prev = '';
        config.first = '';
      } else if (options.page === options.pageCount) {
        config.next = '';
        config.last = '';
      };

      var pageMin = 1;
      var pageMax = 1;

      // 小于定义页数
      if (options.pageCount <= options.numberLength) {
        pageMin = 1;
        pageMax = options.pageCount;
      
      // 大于定义页数，前面部分
      } else if (options.page <= Math.floor(options.numberLength / 2)) {
        pageMin = 1;
        pageMax = options.numberLength;

      // 大于定义页数，后面部分
      } else if (options.pageCount - options.page < Math.floor(options.numberLength / 2)) {
        pageMin = options.pageCount - options.numberLength + 1;
        pageMax = options.pageCount;

      // 大于定义页数，中间部分
      } else {
        pageMin = options.page - Math.floor(options.numberLength / 2);
        pageMax = options.page + Math.floor(options.numberLength / 2);
      };

      if (pageMin < 1) {
        pageMin = 1;
      };

      if (pageMax > options.pageCount) {
        pageMax = options.pageCount;
      };

      for (var i = pageMin; i <= pageMax; i++) {
        if (i === options.page) {
          config.number += '<strong>' + i + '</strong>';
        } else {
          if (typeof options.url === 'string') {
            config.number += '<a href="' + options.url + i + '">' + i + '</a>';
          } else if (typeof options.rel === 'string') {
            config.number += '<a href="javascript://" rel="' + options.rel + '" rev="' + i + '">' + i + '</a>';
          };
        };
      };
    };

    html = options.code;

    for (var x in config) {
      html = html.replace('{{'+x+'}}', config[x]);
    };

    return html;
  };

  /**
   * 压缩图片
   * @param {element} img - img 元素或 Canvas 元素
   * @param {object} [options] - 选项
   * @returns {array}
   */
  /*
  app.prototype.compressPicture = function(img, options) {
    options = $.extend({}, {
      width: 0,               // 宽度
      height: 0,              // 高度
      background: '#ffffff',  // 背景色
      rotate: 0,              // 旋转角度
      quality: 0.8,           // 压缩质量
      zoom: 0,                // 缩放类型（0: 取最小; 1: 取最大; 2: 缩放到设置的尺寸）
      fileType: 'jpeg'        // 文件类型
    }, options);

    var _sImg = {};
    var _oImg = {
      width: img.width,
      height: img.height
    };

    if (options.rotate === 90 || options.rotate === 270) {
      _oImg = {
        width: img.height,
        height: img.width
      };
    };

    // 未设置尺寸时，使用原图尺寸
    if (!options.width && !options.height) {
      options.width = img.width;
      options.height = img.height;
    };

    if (options.zoom === 2) {
      _sImg.width = options.width > 0 ? options.width : img.width;
      _sImg.height = options.height > 0 ? options.height : img.height;

    } else {
      // 计算两种缩放尺寸
      var _sizeForWidth = {};
      var _sizeForHeight = {};

      if (options.width > 0 && options.height > 0) {
        if (options.width > img.width && options.zoom === 1) {
          _sizeForWidth.width = options.width;
        } else {
          _sizeForWidth.width = img.width > options.width ? options.width : img.width;
        };
        _sizeForWidth.height = Math.round(_sizeForWidth.width * (img.height / img.width));

        if (options.height > img.height && options.zoom === 1) {
          _sizeForHeight.height = options.height;
        } else {
          _sizeForHeight.height = img.height > options.height ? options.height : img.height;
        };
        _sizeForHeight.width = Math.round(_sizeForHeight.height * (img.width / img.height));

        if (_sizeForWidth.width <= options.width && _sizeForWidth.height <= options.height) {
          _sImg.width = _sizeForWidth.width;
          _sImg.height = _sizeForWidth.height;
        } else {
          _sImg.width = _sizeForHeight.width;
          _sImg.height = _sizeForHeight.height;
        };

      } else if (options.width >= options.height) {
        if (options.width > img.width && options.zoom === 1) {
          _sImg.width = options.width;
        } else {
          _sImg.width = img.width > options.width ? options.width : img.width;
        };
        _sImg.height = Math.round(_sImg.width * (img.height / img.width));

      } else {
        if (options.height > img.height && options.zoom === 1) {
          _sImg.height = options.height;
        } else {
          _sImg.height = img.height > options.height ? options.height : img.height;
        };
        _sImg.width = Math.round(_sImg.height * (img.width / img.height));

      };

    };

    var _canvas = document.createElement('canvas');
    var _canvasContext = _canvas.getContext('2d');
    _canvas.width = _sImg.width;
    _canvas.height = _sImg.height;
    _canvasContext.fillStyle = options.background;
    _canvasContext.fillRect(0, 0, _sImg.width, _sImg.height);

    // 根据不同角度旋转进行填充
    if (options.rotate === 90 || options.rotate === 270) {
      if (options.rotate === 90) {
        _canvasContext.translate(_sImg.width, 0);
      } else {
        _canvasContext.translate(0, _sImg.height);
      };
      _canvasContext.rotate((Math.PI / 180) * _sImg.rotate);

    } else if (options.rotate === 180) {
      _canvasContext.translate(_sImg.width, _sImg.height);
      _canvasContext.rotate((Math.PI / 180) * _sImg.rotate);
    };

    _canvasContext.drawImage(img, 0, 0, _sImg.width, _sImg.height);
    _canvasContext.restore();

    return _canvas.toDataURL('image/' + options.fileType, options.quality);
  };
  */

  /**
   * 压缩图片
   * @param {element|file} files - img 元素或 file 文件（单个或数组）
   * @param {object} [options] - 选项
   * @param {string} options.fileType - 文件格式
   * @param {integer} options.maxWidth - 最大宽度
   * @param {integer} options.maxHeight - 最大高度
   * @param {float} options.quality - 图片质量
   * @param {function} [callback] - 完成回调函数
   */
  app.prototype.compressPicture = function(files, options, callback) {
    var _canvas = document.createElement('canvas');
    var result = [];

    if ((Object.prototype.toString.call(files) !== '[object FileList]' && !Array.isArray(files)) || !files.length) {
      files = Array(files);
    };

    options = $.extend({
      fileType: '',
      maxWidth: 0,
      maxHeight: 0,
      quality: 0.8     // 范围: 0-1
    }, options);

    if (!options.maxWidth && !options.maxHeight) {return};

    var compress = function(index) {
      index = (index >= 0) ? index : 0;

      var _file = files[index];
      var _type = options.fileType ? options.fileType : _file.type;

      if (!_type) {
        _type = 'image/jpeg';
      };

      EXIF.getData(_file, function() {
        var _orientation = EXIF.getTag(this, 'Orientation');
        // var _rotate = 0;

        // switch(_orientation) {
        //   case 3:
        //     _rotate = 180;
        //     break
        //   case 6:
        //     _rotate = 90;
        //     break
        //   case 8:
        //     _rotate = 270;
        //     break
        //   default:
        //     _rotate = 0;
        // };

        var _fileImg = new MegaPixImage(_file);

        _fileImg.render(_canvas, {
          maxWidth: options.maxWidth,
          maxHeight: options.maxHeight,
          orientation: _orientation
        });

        // 压缩需要时间，延迟处理
        setTimeout(function() {
          result.push(_canvas.toDataURL(_type, options.quality));

          index++;

          if (index < files.length) {
            compress(index);
          } else {
            complete();
          };
        }, 200);
      });
    };

    var complete = function() {
      if (typeof callback === 'function') {
        callback(result);
      };
    };

    compress();
  };


  /**
   * 表单 Ajax 提交
   * @param {element} form - 表单元素
   * @param {object|function} [options] - 选项
   * @param {string} options.url - 表单提交 URL (默认取 action 的值)
   * @param {string} options.type - 提交类型 (默认取 method 的值)
   * @param {array} options.data - 提交数据 (默认为表单数据)
   * @param {string} options.dataType - 返回类型 (默认为 json)
   * @param {object} options.urlData - 增加 URL 提交的数据
   * @param {array} options.addData - 增加 data 提交的数据
   * @param {function} options.complete - 完成回调函数
   * @param {function} options.success - 成功回调函数
   * @param {function} options.error - 错误回调函数
   *
   * @example 简易方法
   * formAjax({}[, successCallback, errorCallback])
   *
   * @example 接口返回示例
   * {status:'success',message:'text',}
   *
   *
   *
   */
  app.prototype.formAjax = function(form, options, errorCallback) {
    var self = this;

    if (!self.isJquery(form) && !self.isZepto(form)) {
      if (self.isElement(form)) {
        form = $(form);
      } else {
        return;
      };
    };

    var defaults = {
      url: form.attr('action'),
      type: form.attr('method'),
      data: form.serializeArray(),    // 格式: [{name:"key_1",value:"value_1"},{name:"key_2",value:"value_2"}]
      dataType: 'json',
      urlData: undefined,             // 格式: {key_1:value_1,key_2:value_2}
      addData: undefined,             // 格式与 data 相同（仅有 1 个对象时，可直接使用对象类型）
      complete: undefined,            // 提交完成后，成功或失败都执行的回调函数
      success: undefined,             // 提交完成后，返回状态为成功时的回调函数
      error: undefined                // 提交完成后，返回状态为错误时的回调函数
    };

    if (typeof options === 'function') {
      options = {
        success: options
      };
    };

    if (typeof errorCallback === 'function') {
      options.error = errorCallback;
    };

    options = $.extend({}, defaults, options);

    if (options.urlData) {
      options.url += (options.url.indexOf('?') >= 0) ? '&' : '?';
      options.url += $.param(options.urlData);
    };

    if (Array.isArray(options.addData) && options.addData.length) {
      options.data = options.data.concat(options.addData);
    } else if($.isPlainObject(options.addData)) {
      options.data.push(options.addData);
    };

    form.find('button[type="submit"]').prop('disabled', true);

    $.ajax({
      url: options.url, 
      type: options.type,
      data: options.data,
      dataType: options.dataType
    }).always(function() {
      if (typeof options.complete === 'function') {
        options.complete();
      };
    }).done(function(data, textStatus, xhr) {
      form.find('button[type="submit"]').prop('disabled', false);

      if (!data) {
        return;

      } else if (data.status !== 'success' && typeof options.error === 'function') {
        options.error(data);
        return;

      } else if (data.status === 'success' && typeof options.success === 'function') {
        options.success(data);
        return;
      };

      formAjaxFinish(data);

    }).fail(function(xhr, textStatus, errorThrown) {
      form.find('button[type="submit"]').prop('disabled', false);

      $.cxDialog({
        title: '错误',
        info: errorThrown
      });
    });

    // Ajax 完成后的处理方式
    var formAjaxFinish = function(data) {
      if (typeof data.message === 'string' && data.message.length) {
        $.cxDialog({
          title: '提示',
          info: data.message,
          ok: function() {
            formAjaxGoto(data.nextUrl);
          }
        });
      } else {
        formAjaxGoto(data.nextUrl);
      };
    };

    // 返回结果需要跳转
    var formAjaxGoto = function(url) {
      if (typeof url === 'string' && url.length) {
        if (url === 'reload') {
          location.reload();
        } else if (url === 'close') {
          window.close();
        } else {
          location.href = url;
        };
      };
    };
  };


  /**
   * 发送短信
   * @param {element} el - 按钮元素
   *
   * @example 按钮的 data- 参数
   *   second         发送间隔时间（秒）
   *   url            发送短信的接口地址
   *   type           传输方式（get/post）
   *   input          手机号码输入框
   *   captcha        验证码输入框
   *   phone-name     URL 中手机号码的参数名称
   *   captcha-name   URL 中验证码的参数名称
   *   tip-text       正在发送的提示文字
   *   loop-text      倒计时按钮显示的文字
   *   end-text       倒计时结束后显示的文字
   *
   *   例：
   *   <div data-url="your-api.php" data-input="user-phone" data-phone-name="phone">发送短信</div>
   *   <a href="your-api.php" data-input="user-phone" data-phone-name="phone">发送短信</a>
   */
  app.prototype.smsSend = function(options, success, error) {
    var self = this;
    var nowTime = new Date().getTime();
    var inputPhone, inputCaptcha, phoneValue, captchaValue;
    var query = {};

    if (self.isJquery(options) || self.isZepto(options) || self.isElement(options)) {
      options = {
        el: options
      };
    } else {
      options: {}
    };

    if (typeof success === 'function') {
      options.success = success;
    };

    if (typeof error === 'function') {
      options.error = error;
    };

    options = $.extend({
      second: 60,
      type: 'get',
      tipText: '短信正在发送中，请稍等。',
      loopText: '正在发送({{time}})',
      endText: '重新发送'
    }, options);

    if (self.isJquery(options.el) || self.isZepto(options.el)) {
      options.el = options.el[0];
    } else if (!self.isElement(options.el)) {
      return;
    };

    $.extend(options, {
      second: options.el.dataset.second,
      url: options.el.dataset.url,
      type: options.el.dataset.type,
      input: options.el.dataset.input,
      captcha: options.el.dataset.captcha,
      phoneName: options.el.dataset.phoneName,
      captchaName: options.el.dataset.captchaName,
      tipText: options.el.dataset.tipText,
      loopText: options.el.dataset.loopText,
      endText: options.el.dataset.endText
    });

    // 获取发送接口
    if (!options.url && options.el.tagName.toLowerCase() === 'a') {
      options.url = options.el.getAttribute('href');
    };

    if (!options.url) {
      $.cxDialog({
        title: '提示',
        info: '未定义接口'
      });
      return;
    };

    // 已发送提示
    if (options.el.dataset.time > nowTime) {
      $.cxDialog({
        title: '提示',
        info: options.tipText
      });
      return;
    };

    // 如果设置了手机号码输入框，需要输入手机号码
    if (typeof options.input === 'string' && options.input.length) {
      if (!document.getElementById(options.input)) {
        $.cxDialog({
          title: '提示',
          info: '缺少手机号码输入框'
        });
        return;
      };

      inputPhone = document.getElementById(options.input);
      phoneValue = inputPhone.value;

      if (!phoneValue.length || !/^1\d{10}$/.test(phoneValue)) {
        inputPhone.focus();
        return;
      };

      if (typeof options.phoneName === 'string' && options.phoneName.length) {
        query[options.phoneName] = phoneValue;
      } else {
        query[inputPhone.name] = phoneValue;
      };
    };

    // 如果设置了验证码输入框，需要输入验证码
    if (typeof options.captcha === 'string' && options.captcha.length) {
      if (!document.getElementById(options.input)) {
        $.cxDialog({
          title: '提示',
          info: '缺少验证码输入框'
        });
        return;
      };

      inputCaptcha = document.getElementById(options.captcha);
      captchaValue = inputCaptcha.value;

      if (!captchaValue.length) {
        inputCaptcha.focus();
        return;
      };

      if (typeof options.captchaName === 'string' && options.captchaName.length) {
        query[options.captchaName] = captchaValue;
      } else {
        query[inputCaptcha.name] = captchaValue;
      };
    };

    options.el.dataset.time = nowTime + (options.second * 1000);

    // 发送短信倒计时
    var sendLoop = function(options) {
      var nowTime = new Date().getTime();
      var diffTime = parseInt(options.el.dataset.time, 10) - nowTime;

      if (diffTime > 0) {
        options.el.innerHTML = options.loopText.replace('{{time}}', Math.round(diffTime / 1000));
        setTimeout(sendLoop.bind(this, options), 1000);

      } else {
        options.el.dataset.time = 0;
        options.el.innerHTML = options.endText;
      };
    };

    var sendComplete = function(options, data) {
      if (data.status !== 'success') {
        options.el.dataset.time = 0;
        sendLoop(options);

        if (typeof options.error === 'function') {
          options.error.call(options.el);
        } else {
          $.cxDialog({
            title: '提示',
            info: data.message
          });
        };
        return;
      };

      if (typeof options.success === 'function') {
        options.success.call(options.el);
      };
    };

    sendLoop(options);

    $.ajax({
      url: options.url,
      type: options.type,
      data: query,
      dataType: 'json'
    }).done(function(data, textStatus, xhr) {
      sendComplete(options, data);

    }).fail(function(xhr, textStatus, errorThrown) {
      sendComplete(options, {
        message: errorThrown
      });
    });
  };

  window.WebApp = app;
})(window);
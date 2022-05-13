/**
 * webapp.js
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxm
 * @license Released under the MIT license
 */

/**
 * isElement            检测是否是 DOM 元素
 * isJquery             检测是否是 jQuery 对象
 * isZepto              检测是否是 Zepto 对象
 * isString             检测是否是 String 字符串
 * isNumber             检测是否是 Number 数字
 * isBoolean            检测是否是 Boolean 布尔值
 * isFunction           检测是否是 Function 函数
 * isArray              检测是否是 Array 数组
 * isObject             检测是否是 Object 对象
 * isNull               检测是否是 Null
 * isUndefined          检测是否是 Undefined
 * isDate               检测是否是 Date 日期对象
 * isLeapYear           检测是否是闰年
 * isRegExp             检测是否是 RegExp 正则表达式
 * isError              检测是否是 Error 对象
 * isJson               检测是否是 JSON
 * isHidden             检测元素是否不可见
 * isVisible            检测元素是否可见
 * --------------------
 * setStorage           保存缓存 (sessionStorage)
 * getStorage           读取缓存 (sessionStorage)
 * removeStorage        删除缓存 (sessionStorage)
 * clearStorage         清空缓存 (sessionStorage)
 * setLocalStorage      保存本地存储 (localStorage)
 * getLocalStorage      读取本地存储 (localStorage)
 * removeLocalStorage   删除本地存储 (localStorage)
 * clearLocalStorage    清空本地存储 (localStorage)
 * --------------------
 * toFloat              转换浮点数
 * numberFormat         格式化数字
 * arrayUnique          数组去重
 * getArraySubValue     获取数组值
 * getObjectValue       获取对象值
 * getRandomNumber      生成随机整数
 * getRandomString      生成随机字符串
 * replaceEnter         替换换行符
 * replaceQuot          替换引号字符实体
 * replaceHtml          替换 HTML 标签
 * --------------------
 * loadingShow          显示 Loading
 * loadingHide          隐藏 Loading
 * loadingToggle        显示或隐藏 Loading
 * panelShow            显示面板
 * panelHide            隐藏面板
 * panelToggle          显示或隐藏面板
 * --------------------
 * initTabBar           初始化 TabBar
 * buildTabBar          构建 TabBar
 * initFilterTool       初始化 FilterTool
 * buildFilterTool      构建 FilterTool
 * --------------------
 * getFormData          获取表单提交的数据
 * createUrlHash        创建 URL Hash
 * removeUrlHash        删除 URL Hash
 * getPageHtml          生成分页代码
 * compressPicture      压缩图片
 * --------------------
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.WebApp = factory();
  };
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const app = function() {
    return this.init.apply(this, arguments);
  };

  // 初始化
  app.prototype.init = function() {
    const self = this;

    self.options = {
      prefix: '',     // 本地缓存命名前缀
      hashTag: '!'
    };

    self.dom = {};
    self.dom.loading = document.createElement('div');
    self.dom.loading.setAttribute('id', 'app_loading');

    self.panelCount = 0;
  };

  // 设置选项
  app.prototype.setOptions = function(options) {
    Object.assign(this.options, options);
  };

  /**
   * 获取 Dom 元素
   * @param   {element} el
   * @param   {boolean} needJquery 是否需要 jQuery 元素
   * @returns {element}
   */
  app.prototype.getDom = function(el, needJquery) {
    const self = this;
    let dom;

    if (self.isJquery(el) || self.isZepto(el)) {
      return needJquery ? el : el[0];
    };

    if (self.isString(el) && el.length) {
      dom = document.getElementById(el);

    } else if (self.isElement(el)) {
      dom = el;
    };

    if (needJquery && self.isElement(dom)) {
      dom = $(dom);
    };

    return dom;
  };

  app.prototype.closest = function(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector;

    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      } else {
        el = el.parentElement;
      }
    }
    return null;
  };

  // 检测是否是 iOS 系统
  app.prototype.isIos = function() {
    return /(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase());
  };

  // 检测是否是 DOM 元素
  app.prototype.isElement = function(o) {
    if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
      return true;
    } else {
      return (o && o.nodeType && o.nodeType === 1) ? true : false;
    };
  };

  // 检测是否是 jQuery 对象
  app.prototype.isJquery = function(o) {
    return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
  };

  // 检测是否是 Zepto 对象
  app.prototype.isZepto = function(o) {
    return (o && o.length && (typeof Zepto === 'function' || typeof Zepto === 'object') && Zepto.zepto.isZ(o)) ? true : false;
  };
  
  // 检测是否是 String 字符串
  app.prototype.isString = function(value) {
    return typeof value === 'string';
  };
  
  // 检测是否是 Number 数字
  app.prototype.isNumber = function(value) {
    return (typeof value === 'number' && isFinite(value)) ? true : false;
  };
  
  // 检测是否是 Boolean 布尔值
  app.prototype.isBoolean = function(value) {
    return typeof value === 'boolean';
  };
  
  // 检测是否是 Function 函数
  app.prototype.isFunction = function(value) {
    return typeof value === 'function';
  };
  
  // 检测是否是 Array 数组
  app.prototype.isArray = function(value) {
    if (typeof Array.isArray === 'function') { 
      return Array.isArray(value);
    } else {
      return Object.prototype.toString.call(value) === '[object Array]';
    };
  };

  // 检测是否是 Object
  app.prototype.isObject = function(value) {
    if (value === undefined || value === null || Object.prototype.toString.call(value) !== '[object Object]') {
      return false;
    };

    if (value.constructor && !Object.prototype.hasOwnProperty.call(value.constructor.prototype, 'isPrototypeOf')) {
      return false;
    };

    return true;
  };

  // 检测是否是 Null
  app.prototype.isNull = function(value) {
    return Object.prototype.toString.call(value) === '[object Null]';
  };

  // 检测是否是 Undefined
  app.prototype.isUndefined = function(value) {
    return Object.prototype.toString.call(value) === '[object Undefined]';
  };

  // 检测是否是 Date 日期
  app.prototype.isDate = function(value) {
    return value instanceof Date || Object.prototype.toString.call(value) === '[object Date]';
  };

  // 检测是否是闰年
  app.prototype.isLeapYear = function(year) {
    if (!this.isNumber(year)) {
      return false;
    };

    return !(year % (year % 100 ? 4 : 400));
  };

  // 检测是否是 RegExp 正则表达式
  app.prototype.isRegExp = function(value) {
    return value instanceof RegExp || Object.prototype.toString.call(value) === '[object RegExp]';
  };

  // 检测是否是 Error 错误
  app.prototype.isError = function(value) {
    return value instanceof Error;
  };

  // 检测是否是 JSON
  app.prototype.isJson = function(value) {
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    };
    return true;
  };

  // 检测元素是否不可见
  app.prototype.isHidden = function(o) {
    if (this.isElement(o)) {
      const style = window.getComputedStyle(o);
      return (style.getPropertyValue('display') === 'none' || style.getPropertyValue('visibility') === 'hidden' || style.getPropertyValue('opacity') == 0 || (style.getPropertyValue('width') == 0 && style.getPropertyValue('height') == 0)) ? true : false;
    } else {
      return true;
    };
  };

  // 检测元素是否可见
  app.prototype.isVisible = function(o) {
    return !this.isHidden(o);
  };

  // 保存缓存 (sessionStorage)
  app.prototype.setStorage = function(name, data) {
    if (!this.isString(name) || !name.length) {
      return;
    };

    sessionStorage.setItem(this.options.prefix + name, JSON.stringify(data));
  };

  // 读取缓存 (sessionStorage)
  app.prototype.getStorage = function(name) {
    if (!this.isString(name) || !name.length) {
      return null;
    };

    let data = sessionStorage.getItem(this.options.prefix + name);

    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    };
  };

  // 删除缓存 (sessionStorage)
  app.prototype.removeStorage = function(name) {
    if (!this.isString(name) || !name.length) {
      return;
    };

    sessionStorage.removeItem(this.options.prefix + name);
  };

  // 清空缓存 (sessionStorage)
  app.prototype.clearStorage = function() {
    const storage = sessionStorage;
    const preLength = this.options.prefix.length;

    for (let x in storage) {
      if (x.slice(0, preLength) === this.options.prefix) {
        storage.removeItem(x);
      };
    };
  };

  // 保存本地存储 (localStorage)
  app.prototype.setLocalStorage = function(name, data) {
    if (!this.isString(name) || !name.length) {
      return;
    };

    localStorage.setItem(this.options.prefix + name, JSON.stringify(data));
  };

  // 读取本地存储 (localStorage)
  app.prototype.getLocalStorage = function(name) {
    if (!this.isString(name) || !name.length) {
      return null;
    };

    let data = localStorage.getItem(this.options.prefix + name);

    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    };
  };

  // 删除本地存储 (localStorage)
  app.prototype.removeLocalStorage = function(name) {
    if (!this.isString(name) || !name.length) {
      return;
    };

    localStorage.removeItem(this.options.prefix + name);
  };

  // 清空本地存储 (localStorage)
  app.prototype.clearLocalStorage = function() {
    const storage = localStorage;
    const preLength = this.options.prefix.length;

    for (let x in storage) {
      if (x.slice(0, preLength) === this.options.prefix) {
        storage.removeItem(x);
      };
    };
  };

  /**
   * 转换浮点数
   * @param   {integer|float|string}  value       数值
   * @param   {integer}               [decimals]  保留小数点位数
   * @returns {integer|float}
   */
  app.prototype.toFloat = function(value, decimals) {
    if (!this.isNumber(value)) {
      value = parseFloat(value, 10);
    };

    if (!this.isNumber(decimals)) {
      decimals = 0;
    };

    return Math.round(Math.round(value * Math.pow(10, decimals + 1)) / 10) / Math.pow(10, decimals);
  };

  /**
   * 格式化数字
   * @param   {integer|float|string}  value                   数值
   * @param   {integer|object}        [options]               保留小数点位数 / 选项
   * @param   {integer}               [options.decimals]      保留小数点位数
   * @param   {boolean}               [options.fillZero]      是否用零补全
   * @param   {string}                [options.decimalPoint]  小数点的字符串
   * @param   {string}                [options.separator]     千位分隔符的字符串
   * @returns {string}
   */
  app.prototype.numberFormat = function(value, options) {
    const self = this;
    const settings = {
      decimals: 0,
      fillZero: false,
      decimalPoint: '.',
      separator: ','
    };

    if (self.isNumber(options)) {
      settings.decimals = options;

    } else if (self.isObject(options)) {
      Object.assign(settings, options);
    };

    value = self.toFloat(value, settings.decimals);
    value = value.toFixed(settings.decimals);

    const sp = value.split('.');

    if (self.isString(settings.separator) && settings.separator.length) {
      sp[0] = sp[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + settings.separator);
    };

    if (settings.decimals > 0 && sp.length > 1) {
      if (!settings.fillZero) {
        sp[1] = sp[1].replace(/0+$/, '');
      };
    };

    if (sp.length > 1 && sp[1].length) {
      value = sp.join(settings.decimalPoint);
    } else {
      value = sp[0];
    };

    return value;
  };

  /**
   * 数组去重
   * @param   {array} array
   * @returns {array}
   */
  app.prototype.arrayUnique = function(array) {
    if (!this.isArray(array)) {
      return array;
    };

    const newArray = [];
    const provisionalTable = {};

    for (let i = 0, item; (item = array[i]) != null; i++) {
      if (!provisionalTable[item]) {
        newArray.push(item);
        provisionalTable[item] = true;
      };
    };

    return newArray;
  };

  /**
   * 获取数组值
   * @param   {object}  options           选项
   * @param   {array}   options.list      用于查找的列表
   * @param   {any}     options.query     需要匹配的值
   * @param   {string}  options.src       用于判断的键名
   * @param   {string}  options.to        用于获取值的键名
   * @param   {any}     [options.value]   默认返回值
   * @returns {any}
   *
   * @example
   * 在 list 中查找 a=1 的项，获取该项中键名为 b 的值
   * getArraySubValue({
   *   list: [{a:1,b:'one'},{a:2,b:'two'}],
   *   query: 1,
   *   src: 'a',
   *   to: 'b'
   * }) 返回 'one'
   */
  app.prototype.getArraySubValue = function(options) {
    let result;

    if (this.isArray(options.list) && options.list.length) {
      for (let x of options.list) {
        if (options.query === x[options.src]) {
          result = x[options.to];
          break;
        };
      };
    };

    return result === undefined ? options.value : result;
  };

  /**
   * 获取对象值
   * @param   {object}  options           选项
   * @param   {string}  options.keys      对象链（使用.分隔）
   * @param   {object}  [options.scope]   查找范围
   * @param   {any}     [options.value]   默认返回值
   * @returns {any}
   *
   * @example
   * getObjectValue({keys:'a.b.c'}) 获取 window.a.b.c 的值
   * getObjectValue({keys:'a.b.c',scope:myObj}) 获取 myObj.a.b.c 的值
   * getObjectValue({keys:'a.b.c',scope:myObj, value: '-'}) 获取 myObj.a.b.c 的值，若不存在则返回 '-'
   */
  app.prototype.getObjectValue = function(options) {
    const self = this;
    let item;

    if (!self.isString(options.keys)) {
      return options.value;
    };

    options.keys = options.keys.split('.');

    if (self.isObject(options.scope)) {
      item = options.scope;
    } else {
      item = window;
    };

    for (let x of options.keys) {
      if (self.isUndefined(item[x])) {
        item = options.value;
        break;
      };

      item = item[x];
    };

    return item;
  };

  /**
   * 生成随机整数
   * @param   {integer} min   最小值
   * @param   {integer} min   最大值
   * @returns {integer}
   */
  app.prototype.getRandomNumber = function(min, max) {
    if (!this.isNumber(min)) {
      min = 0;
    };

    if (!this.isNumber(max)) {
      max = 0;
    };

    if (max < min) {
      max = min;
    };

    return Math.round(Math.random() * (max - min) + min);
  };

  /**
   * 生成随机字符串
   * @param   {integer} length  字符串长度
   * @param   {string}  [scope] 字符范围
   * @returns {string}
   */
  app.prototype.getRandomString = function(length, scope) {
    if (!this.isNumber(length)) {
      length = 0;
    };

    if (!this.isString(scope) || !scope.length) {
      scope = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    };

    return Array.apply(0, Array(length)).map(() => {
      return scope.charAt(Math.floor(Math.random() * scope.length));
    }).join('');
  };
  
  /**
   * 替换换行符
   * @param   {string} string
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
   * 替换引号字符实体
   * @param   {string}  string
   * @param   {boolean} [decode]  解码
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
   * @param   {string}  string
   * @param   {boolean} [decode]  解码
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
   * 显示 Loading
   * @param {string|object} [options]       提示文字 / 选项
   * @param {string}        [options.text]  提示文字
   * @param {boolean}       [options.mask]  是否使用遮罩
   */
  app.prototype.loadingShow = function(options) {
    const self = this;
    const settings = {
      text: '',
      mask: true
    };

    if (self.isString(options)) {
      settings.text = options;

    } else if (self.isObject(options)) {
      Object.assign(settings, options);
    };

    if (self.isString(settings.text) && settings.text.length) {
      self.dom.loading.setAttribute('title', settings.text);
    } else {
      self.dom.loading.removeAttribute('title');
    };

    if (settings.mask) {
      self.dom.loading.classList.remove('notmask');
    } else {
      self.dom.loading.classList.add('notmask');
    };

    document.body.appendChild(self.dom.loading);
  };

  // 隐藏 Loading
  app.prototype.loadingHide = function() {
    const self = this;

    if (document.body.contains(self.dom.loading)) {
      document.body.removeChild(self.dom.loading);
    };
  };

  // 显示或隐藏 Loading
  app.prototype.loadingToggle = function(options) {
    const self = this;

    if (document.body.contains(self.dom.loading)) {
      self.loadingHide();
    } else {
      self.loadingShow(options);
    };
  };

  /**
   * 显示面板
   * @param   {string|element}  el              ID / DOM
   * @param   {object}          [options]       选项
   * @param   {string}          [options.lock]  是否锁定背景
   * @param   {boolean}         [options.blur]  是否模糊背景
   * @returns {element}
   */
  app.prototype.panelShow = function(el, options) {
    const self = this;
    const domPanel = self.getDom(el);

    if (!domPanel) {
      return;
    };

    const settings = Object.assign({
      lock: true,
      blur: false
    }, options);

    domPanel.classList.remove('out');

    if (!domPanel.classList.contains('in')) {
      self.panelCount++;
      domPanel.classList.add('in');
    };

    const classValues = [];

    if (settings.lock) {
      classValues.push('lock');
    };

    if (settings.blur) {
      classValues.push('blur');
    };

    if (classValues.length) {
      document.documentElement.classList.add(...classValues);
    };

    return domPanel;
  };

  /**
   * 隐藏面板
   * @param   {string|element} el   ID / DOM
   * @returns {element}
   */
  app.prototype.panelHide = function(el) {
    const self = this;
    const domPanel = self.getDom(el);

    if (!domPanel) {
      return;
    };

    domPanel.classList.remove('in');

    if (!domPanel.classList.contains('out')) {
      self.panelCount--;
      domPanel.classList.add('out');
    };

    if (self.panelCount < 0) {
      self.panelCount = 0;
    };

    if (self.panelCount <= 0) {
      document.documentElement.classList.remove('lock', 'blur');
    };

    return domPanel;
  };

  // 显示或隐藏面板
  app.prototype.panelToggle = function(el, options) {
    const self = this;
    const domPanel = self.getDom(el);

    if (!domPanel) {
      return;
    };

    if (domPanel.classList.contains('in')) {
      self.panelHide(domPanel);
    } else {
      self.panelShow(domPanel, options);
    };
  };

  /**
   * 初始化 TabBar
   * @param   {string|element}  el        ID / DOM
   * @param   {object}          [data]    配置数据
   * @param   {string}          [target]  选中项
   * @returns {element}
   */
  app.prototype.initTabBar = function(el, data, target) {
    const self = this;
    const domBar = self.getDom(el);

    if (!domBar) {
      return;
    };

    domBar.addEventListener('click', (e) => {
      const el = e.target;
      const nodeName = el.nodeName.toLowerCase();

      if (nodeName === 'a') {
        const rel = el.rel;

        if (rel === 'sub') {
          event.preventDefault();
          const parent = el.parentNode;

          if (parent.classList.contains('hover')) {
            parent.classList.remove('hover');
          } else {
            parent.classList.add('hover');
          };
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
   * @param   {string|element}  el        ID / DOM
   * @param   {object}          [data]    配置数据
   * @param   {string}          [target]  当前选中项
   * @returns {element}
   */
  app.prototype.buildTabBar = function(el, data, target) {
    const self = this;
    const domBar = self.getDom(el);

    if (!domBar) {
      return;
    };

    if (!self.isString(target) && domBar.dataset.target) {
      target = domBar.dataset.target;
    };

    const render = template.compile(GLOBAL.template.footerNav);
    const html = render({
      data: data,
      target: target
    });

    domBar.innerHTML = html;

    return domBar;
  };


  /**
   * 初始化 FilterTool
   * @param   {string|element}  el      ID / DOM
   * @param   {object}          [data]  配置数据
   * @returns {element}
   */
  app.prototype.initFilterTool = function(el, data) {
    const self = this;
    const domTool = self.getDom(el);

    if (!domTool) {
      return;
    };

    domTool.addEventListener('click', (e) => {
      const el = e.target;
      const nodeName = el.nodeName.toLowerCase();

      if (nodeName === 'dt') {
        const domDl = el.parentNode;
        const isHover = domDl.classList.contains('hover');

        if (domDl.classList.contains('col')) {
          for (let x of domDl.parentNode.children) {
            if (x.nodeName.toLowerCase() === 'dl') {
              x.classList.remove('hover');
            };
          };

          if (isHover) {
            domTool.classList.remove('hover');
            domDl.classList.remove('hover');
          } else {
            domTool.classList.add('hover');
            domDl.classList.add('hover');
          };

        } else if (domDl.classList.contains('row')) {
          if (!isHover) {
            for (let x of domDl.parentNode.children) {
              if (x.nodeName.toLowerCase() === 'dl') {
                x.classList.remove('hover');
              };
            };

            if (isHover) {
              domDl.classList.remove('hover');
            } else {
              domDl.classList.add('hover');
            };
          };
        };

      } else if (nodeName === 'a') {
        const rel = el.rel;
        const rev = el.rev;

        if (rel) {
          event.preventDefault();
          domTool.classList.remove('hover');

          for (let x of domTool.querySelectorAll('dl')) {
            if (x.classList.contains('col')) {
              x.classList.remove('hover');
            };
          };

          if (rel !== 'close') {
            const domCol = self.closest(el, 'dl.col');
            let domDt;

            for (let x of domCol.children) {
              if (x.nodeName.toLowerCase() === 'dt') {
                domDt = x;
                break;
              };
            };

            let title = el.dataset.title;

            if (!rev || !self.isString(title) || !title.length) {
              title = domDt.dataset.title;
            };

            domDt.innerHTML = title;

            for (let x of domCol.querySelectorAll('a')) {
              x.classList.remove('n');
            };

            el.classList.add('n');
          };
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
   * @param   {string|element}  el      ID / DOM
   * @param   {object}          [data]  配置数据
   * @returns {element}
   */
  app.prototype.buildFilterTool = function(el, data) {
    const domTool = this.getDom(el);

    if (!domTool) {
      return;
    };

    const render = template.compile(GLOBAL.template.filterTool);
    const html = render({
      data: data
    });

    domTool.innerHTML = html;

    return domTool;
  };

  /**
   * 获取表单提交的数据
   * @param   {element} el  表单元素
   * @returns {object}
   */
  app.prototype.getFormData = function(el) {
    const self = this;
    const domForm = self.getDom(el);

    if (!domForm) {
      return;
    };

    const data = new FormData(domForm);
    const result = {};

    for(let x of data.entries()) {
      const [name, value] = x;

      if (name in result) {
        if (!self.isArray(result[name])) {
          result[name] = [result[name]];
        };
        result[name].push(value);

      } else {
        result[name] = value;
      };
    };

    return result;
  };

  /**
   * 创建 URL Hash
   * @param   {object}    querys     提交参数
   * @param   {array}     [keys]     参数范围
   * @param   {boolean}   [isPush]   是否插入新历史记录
   *
   * @example
   * createUrlHash({a:1,b:2,c:3}) => #!a=1&b=2&c=3
   * createUrlHash({a:1,b:2,c:3}, ['a','c']) => #!a=1&c=3
   * createUrlHash({a:1,b:2,c:3}, []) => #!
   */
  app.prototype.createUrlHash = function(querys, keys, isPush) {
    const self = this;
    const data = {};
    const values = [];
    let hash = '#';

    if (!self.isArray(keys) || !keys.length) {
      keys = Object.getOwnPropertyNames(querys);
    };

    for (let x in querys) {
      if (keys.indexOf(x) >= 0 && querys[x]) {
        let val = String(querys[x]);
        if (val.length) {
          data[x] = val;
          values.push(x + '=' + val);
        };
      };
    };

    if (values.length) {
      hash += self.options.hashTag + values.join('&');
    };

    if (isPush === true) {
      history.pushState(data, document.title, hash);
    } else {
      history.replaceState(data, document.title, hash);
    };
  };

  /**
   * 删除 URL Hash
   * @param   {array}   [keys]     要删除的参数列表
   * @param   {boolean} [isPush]   是否插入新历史记录
   *
   * @example
   * hash: #!a=1&b=2&c=3
   * removeUrlHash() => #!
   * removeUrlHash(['a','b']) => #!c=3
   */
  app.prototype.removeUrlHash = function(keys, isPush) {
    const self = this;
    const hash = location.hash.replace(new RegExp('^#' + self.options.hashTag), '');
    const values = hash.split('&');
    const data = {};

    if (self.isArray(keys) && keys.length) {
      for (let x of values) {
        if (x.indexOf('=')) {
          let name = x.slice(0, x.indexOf('='));

          if (keys.indexOf(name) === -1) {
            data[name] = x.slice(x.indexOf('=') + 1);
          };
        };
      };
    };

    self.createUrlHash(data, [], isPush);
  };

  /**
   * 生成分页代码
   * @param   {object}  options                 选项
   * @param   {integer} options.page            当前页码
   * @param   {integer} options.pageCount       总页数
   * @param   {integer} options.sum             总条数
   * @param   {string}  [options.url]           链接地址
   * @param   {string}  [options.rel]           非跳转方式使用关键词
   * @param   {string}  [options.code]          分页结构
   * @param   {integer} [options.numberLength]  数字页码长度
   * @param   {object}  [options.sizeList]      单页长度数量列表
   * @param   {object}  [options.sizeSet]       单页数量值
   * @param   {object}  [options.language]      语言配置
   * @returns {string}
   */
  app.prototype.getPageHtml = function(options) {
    const self = this;
    const settings = {
      code: '{{count}}{{cur}}{{first}}{{last}}{{number}}{{prev}}{{next}}',
      numberLength: 9,
      language: {
        first: '首页',
        last: '末页',
        prev: '上一页',
        next: '下一页',
        countBefore: '共 ',
        countAfter: ' 页',
        curBefore: '第 ',
        curAfter: ' 页',
        sumBefore: '共 ',
        sumAfter: ' 条',
        selectBefore: '',
        selectAfter: '条/页',
      },
    };
    let html = '';

    for (let x in options) {
      if (self.isArray(options[x])) {
        settings[x] = Array.from(options[x]);

      } else if (self.isObject(options[x])) {
        if (x in settings) {
          Object.assign(settings[x], options[x]);
        } else {
          settings[x] = Object.assign({}, options[x]);
        };
      } else {
        settings[x] = options[x];
      };
    };

    if (!self.isNumber(settings.page) || !self.isNumber(settings.pageCount) || settings.page < 1 || settings.pageCount < 1) {
      return html;
    };

    const config = {
      sum: '<span class="sum">' + settings.language.sumBefore + settings.sum + settings.language.sumAfter + '</span>',
      count: '<span class="count">' + settings.language.countBefore + settings.pageCount + settings.language.countAfter + '</span>',
      cur: '<span class="cur">' + settings.language.curBefore + settings.page + settings.language.curAfter + '</span>',
      sizeSet: '',
      number: '',
      prev: '',
      next: '',
      first: '',
      last: ''
    };

    if (self.isArray(settings.sizeList) && settings.sizeList.length) {
      config.sizeSet = '<select class="select" name="' + settings.rel + '_size">';

      for (let x of settings.sizeList) {
        config.sizeSet += '<option value="' + x + '"';

        if (settings.sizeSet === x) {
          config.sizeSet += ' selected';
        };

        config.sizeSet += '>' + settings.language.selectBefore + x + settings.language.selectAfter + '</option>';
      };

      config.sizeSet += '</select>';
    };

    if (settings.pageCount > 1) {
      if (self.isString(settings.url)) {
        config.prev = '<a href="' + settings.url + (settings.page - 1) + '">' + settings.language.prev + '</a>';
        config.next = '<a href="' + settings.url + (settings.page + 1) + '">' + settings.language.next + '</a>';
        config.first = '<a href="' + settings.url + '1">' + settings.language.first + '</a>';
        config.last = '<a href="' + settings.url + settings.pageCount + '">' + settings.language.last + '</a>';

      } else if (self.isString(settings.rel)) {
        config.prev = '<a href="javascript://" rel="' + settings.rel + '" rev="' + (settings.page - 1) + '">' + settings.language.prev + '</a>';
        config.next = '<a href="javascript://" rel="' + settings.rel + '" rev="' + (settings.page + 1) + '">' + settings.language.next + '</a>';
        config.first = '<a href="javascript://" rel="' + settings.rel + '" rev="' + '1">' + settings.language.first + '</a>';
        config.last = '<a href="javascript://" rel="' + settings.rel + '" rev="' + settings.pageCount + '">' + settings.language.last + '</a>';
      };

      if (settings.page === 1) {
        config.prev = '';
        config.first = '';
      } else if (settings.page === settings.pageCount) {
        config.next = '';
        config.last = '';
      };

      let pageMin = 1;
      let pageMax = 1;

      // 小于定义页数
      if (settings.pageCount <= settings.numberLength) {
        pageMin = 1;
        pageMax = settings.pageCount;
      
      // 大于定义页数，前面部分
      } else if (settings.page <= Math.floor(settings.numberLength / 2)) {
        pageMin = 1;
        pageMax = settings.numberLength;

      // 大于定义页数，后面部分
      } else if (settings.pageCount - settings.page < Math.floor(settings.numberLength / 2)) {
        pageMin = settings.pageCount - settings.numberLength + 1;
        pageMax = settings.pageCount;

      // 大于定义页数，中间部分
      } else {
        pageMin = settings.page - Math.floor(settings.numberLength / 2);
        pageMax = settings.page + Math.floor(settings.numberLength / 2);
      };

      if (pageMin < 1) {
        pageMin = 1;
      };

      if (pageMax > settings.pageCount) {
        pageMax = settings.pageCount;
      };

      for (let i = pageMin; i <= pageMax; i++) {
        if (i === settings.page) {
          config.number += '<strong>' + i + '</strong>';
        } else {
          if (self.isString(settings.url)) {
            config.number += '<a href="' + settings.url + i + '">' + i + '</a>';
          } else if (self.isString(settings.rel)) {
            config.number += '<a href="javascript://" rel="' + settings.rel + '" rev="' + i + '">' + i + '</a>';
          };
        };
      };
    };

    html = settings.code;

    for (let x in config) {
      html = html.replace('{{'+x+'}}', config[x]);
    };

    return html;
  };

  /**
   * 压缩图片
   * @param {file}      files                 input file 元素的 file (单个或数组)
   * @param {object}    [options]             选项
   * @param {integer}   [options.maxWidth]    最大宽度
   * @param {integer}   [options.maxHeight]   最大高度
   * @param {float}     [options.quality]     图片质量 [0-1]
   * @param {string}    [options.fileType]    文件格式
   * @param {function}  [callback]            回调函数
   */
  app.prototype.compressPicture = function(files, options, callback) {
    const self = this;
    const domCanvas = document.createElement('canvas');
    let fileList = [];
    const result = [];

    const settings = Object.assign({
      maxWidth: 0,
      maxHeight: 0,
      quality: 0.8,
      fileType: '',
    }, options);

    if (Object.prototype.toString.call(files) === '[object FileList]') {
      fileList = Array.from(files);
    } else if (Object.prototype.toString.call(files) === '[object File]') {
      fileList.push(files);
    };

    if (!fileList.length) {
      console.warn('[compressPicture] Not File');
      return;
    };;

    const compress = () => {
      const fileData = fileList.shift();
      let fileType = settings.fileType ? settings.fileType : fileData.type;

      if (!fileType) {
        fileType = 'image/jpeg';
      };

      EXIF.getData(fileData, function() {
        const orientation = EXIF.getTag(this, 'Orientation');
        // let rotate = 0;

        // switch(orientation) {
        //   case 3:
        //     rotate = 180;
        //     break
        //   case 6:
        //     rotate = 90;
        //     break
        //   case 8:
        //     rotate = 270;
        //     break
        //   default:
        //     rotate = 0;
        // };

        const fileImg = new MegaPixImage(fileData);

        fileImg.render(domCanvas, {
          maxWidth: settings.maxWidth,
          maxHeight: settings.maxHeight,
          orientation: orientation
        });

        // 压缩需要时间，延迟处理
        setTimeout(() => {
          result.push(domCanvas.toDataURL(fileType, settings.quality));

          if (fileList.length) {
            compress();
          } else {
            complete();
          };
        }, 200);
      });
    };

    const complete = () => {
      if (self.isFunction(callback)) {
        callback(result);
      };
    };

    compress();
  };

  return new app();
}));
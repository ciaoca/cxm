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
 * isCallback           检测是否是 Function 函数
 * isArray              检测是否是 Array 数组
 * isDate               检测是否是 Date 日期
 * isRegExp             检测是否是 RegExp 正则表达式
 * isError              检测是否是 Error 错误
 * isJson               检测是否是 JSON
 * isLeapYear           检测是否是闰年
 * isHidden             检测元素是否不可见
 * isVisible            检测元素是否可见
 * setStorage           保存缓存存储（sessionStorage）
 * getStorage           读取缓存存储（sessionStorage）
 * removeStorage        删除缓存存储（sessionStorage）
 * clearStorage         清空缓存存储（sessionStorage）
 * setLocalStorage      保存缓存存储（localStorage）
 * getLocalStorage      读取缓存存储（localStorage）
 * removeLocalStorage   删除缓存存储（localStorage）
 * clearLocalStorage    清空缓存存储（localStorage）
 * getRandomNumber      生成随机数
 * getRandomString      生成随机字符串
 * replaceEnter         替换换行
 * replaceQuot          替换引号
 * replaceHtml          替换 HTML 标签
 * toFloat              转换浮点数
 * numberFormat         格式化数字
 * arrayUnique          数组去重
 * tipShow              显示 Tip
 * tipHide              隐藏 Tip
 * tipToggle            显示/隐藏 Tip
 * loadingShow          显示 Loading
 * loadingHide          隐藏 Loading
 * loadingToggle        显示/隐藏 Loading
 * panelShow            显示面板
 * panelHide            隐藏面板
 * panelToggle          显示/隐藏面板
 * qrcodeShow           显示二维码
 * qrcodeHide           隐藏二维码
 * qrcodeToggle         显示/隐藏二维码
 * compressPicture      压缩图片
 * getFormData          获取表单提交的数据
 * formAjax             表单 AJAX 提交
 * createUrlHash        创建 Hash URL
 * smsSend              发送短信
 * fixFlex              兼容 flex
 */
(function(window, undefined){
  var app = function(){
    return this.init.apply(this,arguments);
  };

  // 初始化
  app.prototype.init = function(options){
    var self = this;
    var defaults = {
      debug: false,
      timeout: 10000,       // Ajax 请求等待最大时间
      version: '',          // 版本号
      storagePrefix: ''     // 本地缓存命名前缀
    };
    self.option = $.extend({}, defaults, options);

    self.dom = {};

    self.dom.loading = document.createElement('div');
    self.dom.loading.setAttribute('id', 'app_loading');

    self.dom.tip = document.createElement('div');
    self.dom.tip.setAttribute('id', 'app_tip');
    self.dom.tip.addEventListener('click', self.tipHide.bind(self));

    self.dom.qrcode = document.createElement('div');
    self.dom.qrcode.setAttribute('id', 'app_qrcode');
    self.dom.qrcode.addEventListener('click', self.qrcodeHide.bind(self));

    self.panelCount = 0;
    self.scrollTop = 0;
    self.dom.scroll = null;

    if (document.scrollingElement && typeof document.scrollingElement.scrollTop === 'number') {
      self.dom.scroll = document.scrollingElement;
    } else if (document.documentElement && typeof document.documentElement.scrollTop === 'number') {
      self.dom.scroll = document.documentElement;
    } else if (document.body && typeof document.body.scrollTop === 'number') {
      self.dom.scroll = document.body;
    };

    document.addEventListener('DOMContentLoaded', function() {
      self.dom.body = document.body;
      // if (self.isElement(document.getElementById('wrap'))) {
        self.dom.wrap = document.getElementById('wrap');
      // };
    });
  };

  // 调试
  app.prototype.debug = function(o){
    if (this.option.debug && window.console && window.console.log) {
      return console.log.apply(console, arguments);
    };
  };

  // 滚动到位置
  app.prototype.scrollTo = function(pos, time) {
    var self = this;
    var top = 0;
    var num = typeof time === 'number' ? Math.round(time/20) : 0;

    if (!self.dom.scroll) {
      return;
    };

    if (typeof pos === 'number') {
      top = parseInt(pos, 10);
    } else if (self.isElement(pos)) {
      top = pos.getBoundingClientRect().top;
    };

    var loop = function(top, n, max) {
      if (n > 0) {
        n -= 1;
        self.dom.scroll.scrollTop = Math.round(self.dom.scroll.scrollTop * n / max) + top;
        setTimeout(loop.bind(this, top, n, max), 20);
      };
    };

    loop(top, num, num);
  };

  // 保存滚动位置
  app.prototype.saveScrollTop = function() {
    var self = this;
    var top = 0;

    if (self.dom.scroll) {
      top = self.dom.scroll.scrollTop;
    };

    self.scrollTop = top;

    if (self.isElement(self.dom.wrap)) {
      self.dom.wrap.style.top = '-' + top + 'px';
    };
  };

  // 还原滚动位置
  app.prototype.restoreScrollTop = function() {
    var self = this;
    self.dom.scroll.scrollTop = self.scrollTop;

    if (self.isElement(self.dom.wrap)) {
      self.dom.wrap.style.top = '';
    };
  };

  // 检测是否是 DOM 元素
  app.prototype.isElement = function(o){
    if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
      return true;
    } else {
      return (o && o.nodeType && o.nodeType === 1) ? true : false;
    };
  };

  // 检测是否是 jQuery 对象
  app.prototype.isJquery = function(o){
    return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
  };

  // 检测是否是 Zepto 对象
  app.prototype.isZepto = function(o){
    return (o && o.length && (typeof Zepto === 'function' || typeof Zepto === 'object') && Zepto.zepto.isZ(o)) ? true : false;
  };
  
  // 检测是否是 String 字符串
  app.prototype.isString = function(value){
    return typeof value === "string";
  };
  
  // 检测是否是 Number 数字
  app.prototype.isNumber = function(value){
    return (typeof value === "number" && isFinite(value)) ? true : false;
  };
  
  // 检测是否是 Boolean 布尔值
  app.prototype.isBoolean = function(value){
    return typeof value === "boolean";
  };
  
  // 检测是否是 Function 函数
  app.prototype.isCallback = function(value){
    return typeof value === "function";
  };
  
  // 检测是否是 Array 数组
  app.prototype.isArray = function(value){
    if (typeof Array.isArray === "function") { 
      return Array.isArray(value); 
    } else { 
      return Object.prototype.toString.call(value) === "[object Array]"; 
    } 
  };
  
  // 检测是否是 Date 日期
  app.prototype.isDate = function(value){
    return value instanceof Date;
  };
  
  // 检测是否是 RegExp 正则表达式
  app.prototype.isRegExp = function(value){
    return value instanceof RegExp;
  };
  
  // 检测是否是 Error 错误
  app.prototype.isError = function(value){
    return value instanceof Error;
  };
  
  // 检测是否是 JSON
  app.prototype.isJson = function(value){
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    };
    return true;
  };

  // 判断是否为闰年
  app.prototype.isLeapYear = function(year){
    return !(year % (year % 100 ? 4 : 400));
  };

  // 检测元素是否不可见
  app.prototype.isHidden = function(o){
    if (this.isElement(o)) {
      var style = window.getComputedStyle(o);
      return (style.getPropertyValue('display') === 'none' || style.getPropertyValue('visibility') === 'hidden' || style.getPropertyValue('opacity') == 0 || (style.getPropertyValue('width') == 0 && style.getPropertyValue('height') == 0)) ? true : false;
    } else {
      return true;
    };
  };

  // 检测元素是否可见
  app.prototype.isVisible = function(o){
    return !this.isHidden(o);
  };

  // 保存缓存存储（sessionStorage）
  app.prototype.setStorage = function(name,data){
    if (!name || !name.length) {
      return;
    };

    name = this.option.storagePrefix + name;
    sessionStorage.setItem(name, JSON.stringify(data));
  };

  // 读取本地存储（sessionStorage）
  app.prototype.getStorage = function(name){
    if (!name || !name.length) {
      return null;
    };

    name = this.option.storagePrefix + name;

    if (!sessionStorage.getItem(name)) {
      return null;
    };

    return JSON.parse(sessionStorage.getItem(name));
  };

  // 删除本地存储（sessionStorage）
  app.prototype.removeStorage = function(name){
    if (!name || !name.length) {
      return;
    };

    name = this.option.storagePrefix + name;

    if (!sessionStorage.getItem(name)) {
      return;
    };

    sessionStorage.removeItem(name);
  };

  // 清空本地存储（sessionStorage）
  app.prototype.clearStorage = function(){
    var storage = sessionStorage;
    var _prelength = this.option.storagePrefix.length;

    for (var i = 0, j = 0, l = storage.length; i < l; i++) {
      if (storage.key(j).slice(0,_prelength) === this.option.storagePrefix) {
        storage.removeItem(storage.key(j));
      } else {
        j++;
      };
    };
  };

  // 保存缓存存储（localStorage）
  app.prototype.setLocalStorage = function(name,data){
    if (!name || !name.length) {
      return;
    };

    name = this.option.storagePrefix + name;
    
    localStorage.setItem(name, JSON.stringify(data));
  };

  // 读取本地存储（localStorage）
  app.prototype.getLocalStorage = function(name){
    if (!name || !name.length) {
      return null;
    };

    name = this.option.storagePrefix + name;

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
  app.prototype.removeLocalStorage = function(name){
    if (!name || !name.length) {
      return;
    };

    name = this.option.storagePrefix + name;

    if (!localStorage.getItem(name)) {
      return;
    };
    
    localStorage.removeItem(name);
  };

  // 清空本地存储（localStorage）
  app.prototype.clearLocalStorage = function(){
    var storage = localStorage;
    var _prelength = this.option.storagePrefix.length;

    for (var i = 0, j = 0, l = storage.length; i < l; i++) {
      if (storage.key(j).slice(0,_prelength) === this.option.storagePrefix) {
        storage.removeItem(storage.key(j));
      } else {
        j++;
      };
    };
  };

  /**
   * 生成随机数
   * @param string {string}
   * @param min {boolean} 最小值
   * @param min {boolean} 最大值
   * @return {number}
   */
  app.prototype.getRandomNumber = function(min, max){
    min = isFinite(min) ? parseInt(min, 10) : 0;
    max = isFinite(max) ? parseInt(max, 10) : 0;

    if (max < min) {
      max = min;
    };

    return Math.round(Math.random() * (max - min) + min);
  };

  /**
   * 生成随机字符串
   * @param length {boolean} 字符串长度
   * @param string {string} 字符范围
   * @return {string}
   */
  app.prototype.getRandomString = function(length, string){
    length = isFinite(length) ? parseInt(length, 10) : 0;
    string = (typeof string === 'string' && string.length) ? string : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    return Array.apply(0, Array(length)).map(function () {
      return string.charAt(Math.floor(Math.random() * string.length));
    }).join('');
  };
  
  /**
   * 替换换行
   * @param string {string}
   * @return {string}
   */
  app.prototype.replaceEnter = function(string){
    if (!this.isString(string)){
      return string;
    };

    string = string.replace(/\r\n/g, '<br>');
    string = string.replace(/\r|\n/g, '<br>');

    return string;
  };

  /**
   * 替换引号
   * @param string {string}
   * @param decode {boolean} 是否解码
   * @return {string}
   */
  app.prototype.replaceQuot = function(string, decode){
    if (!this.isString(string)){
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
   * @param string {string}
   * @param decode {boolean} 是否解码
   * @return {string}
   */
  app.prototype.replaceHtml = function(string, decode){
    if (!this.isString(string)){
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
   * 转换浮点数
   * @param value {number}
   * @param decimals {int} 保留小数点位数
   * @return {number}
   */
  app.prototype.toFloat = function(value, decimals){
    if (!this.isNumber(decimals)){
      decimals = 0;
    };

    return Math.round(Math.round(value * Math.pow(10, decimals + 1)) / 10) / Math.pow(10, decimals);
  };

  /**
   * 格式化数字
   * @param value {number}
   * @param decimals {int} 保留小数点位数
   * @param decimalpoint {string} 小数点的字符串
   * @param separator {string} 千位分隔符的字符串
   * @return {string}
   */
  app.prototype.numberFormat = function(value, decimals, decimalpoint, separator){
    if (!this.isNumber(decimals)){decimals = 0};
    if (!this.isString(decimalpoint)){decimalpoint = '.'};
    if (!this.isString(separator)){separator = ','};

    value = this.toFloat(value, decimals);
    value = value.toFixed(decimals);
    value = value.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, ('$1,'));
    value = value.replace(/[\.\,]/g, function(key, index, val){
      if (key === '.') {
        return decimalpoint;

      } else if (key === ',') {
        return separator;
      };
    });

    return value;
  };

  /**
   * 数组去重
   * @param array {array}
   * @return {array}
   */
  app.prototype.arrayUnique = function(array){
    if (!this.isArray(array)){
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
   * 显示 Tip
   * @param baseclass {string} 自定义 class
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

  /**
   * 隐藏 Tip
   */
  app.prototype.tipHide = function() {
    if (this.dom.body.contains(this.dom.tip)) {
      this.dom.body.removeChild(this.dom.tip);
    };
  };


  /**
   * 显示/隐藏 Tip
   * @param baseclass {string} 自定义 class
   */
  app.prototype.tipToggle = function(baseclass) {
    if (this.isVisible(this.dom.tip)) {
      this.tipHide();
    } else {
      this.tipShow(baseclass);
    };
  };

  /**
   * 显示 Loading
   * @param options {object} 选项
   */
  app.prototype.loadingShow = function(options) {
    var self = this;

    if (typeof options === 'string' && options.length) {
      options = {
        text: options
      };
    };

    options = $.extend({
      text: '',     // 提示文字
      mask: true   // 背景遮罩
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

  /**
   * 隐藏 Loading
   */
  app.prototype.loadingHide = function() {
    if (this.dom.body.contains(this.dom.loading)) {
      this.dom.body.removeChild(this.dom.loading);
    };
  };

  /**
   * 显示/隐藏 Loading
   * @param text {string} 文字提示
   */
  app.prototype.loadingToggle = function(text) {
    if (this.isVisible(this.dom.loading)) {
      this.loadingHide();
    } else {
      this.loadingShow(text);
    };
  };

  /**
   * 显示面板
   * @param el {string|element} DOM 元素或 ID
   * @param options {object} 选项
   */
  app.prototype.panelShow = function(el, options) {
    var self = this;

    options = $.extend({
      lock: true,     // 锁定背景
      blur: false     // 模糊背景
    }, options);

    if (typeof el === 'string' && el.length) {
      el = document.getElementById(el);
    };

    if (self.isElement(el)) {
      // self.saveScrollTop();
      el.classList.remove('out');
      el.classList.add('in');

      if (options.lock) {
        self.dom.body.classList.add('lock');
      };
      if (options.blur) {
        self.dom.body.classList.add('blur');
      };

      self.panelCount++;
    };
  };

  /**
   * 隐藏面板
   * @param el {string|element} DOM 元素或 ID
   */
  app.prototype.panelHide = function(el) {
    var self = this;

    if (typeof el === 'string' && el.length) {
      el = document.getElementById(el);
    };

    if (this.isElement(el)) {
      el.classList.remove('in');
      el.classList.add('out');
    };

    self.panelCount--;

    if (self.panelCount < 0) {
      self.panelCount = 0;
    };

    if (self.panelCount <= 0) {
      self.dom.body.classList.remove('lock');
      self.dom.body.classList.remove('blur');
      // setTimeout(function(){
        // self.restoreScrollTop();
      // }, 100)
    };
  };

  /**
   * 显示/隐藏面板
   * @param el {string|element} DOM 元素或 ID
   */
  app.prototype.panelToggle = function(el, options) {
    if (typeof el === 'string' && el.length) {
      el = document.getElementById(el);
    };

    if (this.isElement(el)) {
      if (el.classList.contains('out')) {
        this.panelShow(el, options);
      } else {
        this.panelHide(el);
      };
    };
  };

  /**
   * 显示二维码
   * @param options {object} 选项
   */
  app.prototype.qrcodeShow = function(options) {
    var self = this;

    if (typeof options === 'string') {
      options = {
        info: options
      };
    };

    options = $.extend({
      info: undefined,        // {string} 二维码内容
      size: 0,                // {int} 二维码图片尺寸（正方形）
      baseclass: undefined,   // {string} wrap 添加 class
      before: undefined,      // {string} 二维码图像前面添加内容（支持 HTML）
      after: undefined,       // {string} 二维码图像后面添加内容（支持 HTML）
      colorDark: '#000000',   // {string} 暗色值
      colorLight: '#ffffff',  // {string} 亮色值
      quality: 'M'            // {string} 校正标准（L, M, Q, H）
    }, options);

    if (options.size === 0) {
      options.size = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;
      options.size = Math.floor(options.size * 0.7 / 43) * 43;
    };

    var pic = document.createElement('div');
    pic.classList.add('qrcode');
    pic.style.width = options.size + 'px';
    pic.style.height = options.size + 'px';

    var _qrcode = new QRCode(pic, {
      text: options.info,
      width: options.size,
      height: options.size,
      colorDark : options.colorDark,
      colorLight : options.colorLight,
      correctLevel : QRCode.CorrectLevel[options.quality]
    });

    var _html = '<div class="bd"></div>';

    if (typeof options.before === 'string' && options.before.length) {
      _html = '<div class="hd">' + options.before + '</div>' + _html;
    };

    if (typeof options.after === 'string' && options.after.length) {
      _html += '<div class="ft">' + options.after + '</div>';
    };

    _html = '<div class="main">' + _html + '</div>';

    if (typeof options.baseclass === 'string' && options.baseclass.length) {
      self.dom.qrcode.setAttribute('class', options.baseclass);
    };

    self.dom.qrcode.innerHTML = _html;
    self.dom.qrcode.querySelector('.bd').appendChild(pic);
    self.dom.body.appendChild(self.dom.qrcode);
  };

  /**
   * 隐藏二维码
   */
  app.prototype.qrcodeHide = function() {
    if (this.dom.body.contains(this.dom.qrcode)) {
      this.dom.body.removeChild(this.dom.qrcode);
      this.dom.qrcode.innerHTML = '';
    };
  };

  /**
   * 显示/隐藏二维码
   * @param options {object} 选项（与 qrcodeShow 相同）
   */
  app.prototype.qrcodeToggle = function(options) {
    if (this.isVisible(this.dom.qrcode)) {
      this.qrcodeHide();
    } else {
      this.qrcodeShow(options);
    };
  };

  /**
   * 压缩图片
   * @param img {dom} img 元素或 Canvas 元素
   * @param options {object} 选项
   * @return {array}
   */
  /*
  app.prototype.compressPicture = function(img, options){
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
   * @param file {element|file} img 元素或 file 文件（单个或数组）
   * @param options {object} 选项
   * @param callback {function} 压缩完成后的回调函数
   * @return {array}
   */
  app.prototype.compressPicture = function(files, options, callback) {
    var _canvas = document.createElement('canvas');
    var result = [];

    if ((Object.prototype.toString.call(files) !== '[object FileList]' && !Array.isArray(files)) || !files.length) {
      files = Array(files);
    };

    options = $.extend({
      fileType: '',             // 文件格式
      maxWidth: 0,              // 最大宽度
      maxHeight: 0,             // 最大高度
      quality: 0.8              // 图片质量
    }, options);

    if (!options.maxWidth && !options.maxHeight) {return};

    var compress = function(index) {
      index = (index >= 0) ? index : 0;

      var _file = files[index];
      var _type = options.fileType ? options.fileType : _file.type;

      if (!_type) {
        _type = 'image/jpeg';
      };

      EXIF.getData(_file, function(){
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
   * 获取表单提交的数据
   * @param form {element} 表单元素
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
   * 表单 Ajax 提交
   * @param form {element} 表单元素
   * @param options {object|function} 选项
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
      url: form.attr('action'),       // {string} 表单提交 URL
      type: form.attr('method'),      // {string} 提交类型（get|post）
      data: form.serializeArray(),    // {array} 提交数据
      dataType: 'json',               // {string} 返回类型
      urlData: undefined,             // {object} URL 增加提交的数据（get 类型）
      addData: undefined,             // {array} data 之外增加提交的数据
      complete: undefined,            // {function} 提交完成后的回调方法
      success: undefined,             // {function} 提交完成，状态为成功时的回调方法
      error: undefined                // {function} 提交完成，状态为错误时的回调方法
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
    }).done(function(data, textStatus, jqXHR){
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

    }).fail(function(jqXHR, textStatus, errorThrown){
      form.find('button[type="submit"]').prop('disabled', false);

      $.cxDialog({
        title: '错误',
        info: errorThrown
      });

    });
  };

  // formAjax 完成后的处理方式
  var formAjaxFinish = function(data) {
    if (typeof data.message === 'string' && data.message.length) {
      $.cxDialog({
        title: '提示',
        info: data.message,
        ok: function() {
          if (typeof data.nextUrl === 'string' && data.nextUrl.length) {
            if (data.nextUrl === 'reload') {
              location.reload();
            } else if (data.nextUrl === 'close') {
              window.close();
            } else {
              location.href = data.nextUrl;
            };
          };
        }
      });
    } else {
      if (typeof data.nextUrl === 'string' && data.nextUrl.length) {
        if (data.nextUrl === 'reload') {
          location.reload();
        } else if (data.nextUrl === 'close') {
          window.close();
        } else {
          location.href = data.nextUrl;
        };
      };
    };
  };

  /**
   * 创建 Hash URL
   * @param querys {object} 提交参数
   * @param keys {array} 参数范围
   * @param isPush {boolean} 是否插入新历史记录
   */
  app.prototype.createUrlHash = function(querys, keys, isPush) {
    var data = {};
    var values = [];
    var hash = '#';

    if (Array.isArray(keys) && keys.length) {
      for (var x in querys) {
        if (keys.indexOf(x) >= 0 && querys[x]) {
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
   * 发送短信
   * @param el {element} 按钮元素（不限于 a 及 button）
   *
   * 按钮 data- 参数
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
    sendLoop(options);

    $.ajax({
      url: options.url,
      type: options.type,
      data: query,
      dataType: 'json'
    }).done(function(data, textStatus, jqXHR){
      sendComplete(options, data);

    }).fail(function(jqXHR, textStatus, errorThrown){
      sendComplete(options, {
        message: errorThrown
      });
    });
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

  /**
   * 兼容 Flex
   * @param array {array} 参数
   *    name 父元素选择符
   *    tag 子元素选择符
   *
   * example:
   * [
   *   {
   *     name: 'selectorName',
   *     tag: 'selectorName'
   *   }
   * ]
   */
  app.prototype.fixFlex = function(array) {
    // iOS 不需要 fix
    if (/(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase())) {
      return;
    };

    // 如果支持 flex 则不需要 fix
    if (!!((window.CSS && window.CSS.supports))) {
      if (CSS.supports('display', 'flex')) {
        return;
      };
    };

    if (!Array.isArray(array) || !array.length) {
      return;
    };

    var _selector;
    for (var i = 0, l = array.length; i < l; i++) {
      _selector = document.querySelectorAll(array[i].name);
      if (_selector.length) {
        for (var j = 0, k = _selector.length; j < k; j++) {
          _selector[j].classList.add('flex');
          _selector[j].classList.add('flex_' + _selector[j].querySelectorAll(array[i].tag).length);
        };
      };
    };
  };

  window.WebApp = app;
})(window);
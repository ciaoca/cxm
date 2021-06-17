/*!
 * cxUpPicture 1.0
 * http://code.ciaoca.com/
 * E-mail: ciaoca@gmail.com
 * Released under the MIT license
 * Date: 2016-06-07
 * 
 * @param {object} settings 参数设置
 *   maxLength {int} 最多上传数量
 *   maxWidth {int} 最大宽度
 *   maxHeight {int} 最大高度
 *   haveClass {string} 包含文件时的 className
 */
(function(factory){
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(window.jQuery || window.Zepto || window.$);
  };
}(function($){
  $.cxUpPicture = function(){
    var upPicture = {
      dom: {},
      isElement: function(o){
        if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
          return true;
        } else {
          return (o && o.nodeType && o.nodeType === 1) ? true : false;
        };
      },
      isJquery: function(o){
        return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
      },
      isZepto: function(o){
        return (o && o.length && (typeof Zepto === 'function' || typeof Zepto === 'object') && Zepto.zepto.isZ(o)) ? true : false;
      }
    };

    upPicture.init = function(){
      var self = this;
      var _settings;

      // 分配参数
      for (var i = 0, l = arguments.length; i < l; i++) {
        if (self.isJquery(arguments[i]) || self.isZepto(arguments[i])) {
          self.dom.box = arguments[i];
        } else if (self.isElement(arguments[i])) {
          self.dom.box = $(arguments[i]);
        } else if (typeof arguments[i] === 'object') {
          _settings = arguments[i];
        };
      };

      if (!self.dom.box.length || !self.dom.box.find('li').length) {return};

      self.settings = $.extend({}, $.cxUpPicture.defaults, _settings, {
        maxLength: self.dom.box.data('maxLength'),
        maxWidth: self.dom.box.data('maxWidth'),
        maxHeight: self.dom.box.data('maxHeight'),
        haveClass: self.dom.box.data('haveClass')
      });

      self.dom.fileCanvas = document.createElement('canvas');
      self.tmpHtml = self.dom.box.find('li').last()[0].outerHTML;

      self.dom.box.on('click', 'a', function() {
        var _this = this;
        var _rel = _this.rel;
        var _li = $(_this).closest('li')

        if (_rel === 'remove') {
          event.preventDefault();

          // 需要通知服务端删除
          if (typeof _this.dataset.urlDelete === 'string' && _this.dataset.urlDelete.length) {
            _li.css('display', 'none');

            $.ajax({
              url: _this.dataset.urlDelete,
              type: 'GET',
              dataType: 'json'
            }).done(function(data, textStatus, jqXHR) {
              _li.remove();
            }).fail(function(jqXHR, textStatus, errorThrown) {
              _li.css('display', '');
            });

          } else {
            _li.remove();
          };

          self.addFile();
        };
      });

      self.dom.box.on('change', 'input', function() {
        if (this.type === 'file') {
          var _file = this.files[0];
          var _li = $(this).closest('li');

          EXIF.getData(_file, function(){
            var _orientation = EXIF.getTag(this, 'Orientation');
            var _rotate = 0;

            switch(_orientation) {
              case 3:
                _rotate = 180;
                break
              case 6:
                _rotate = 90;
                break
              case 8:
                _rotate = 270;
                break
              default:
                _rotate = 0;
            };

            _fileImg = new MegaPixImage(_file);

            _fileImg.render(self.dom.fileCanvas, {
              maxWidth: self.settings.maxWidth,
              maxHeight: self.settings.maxHeight,
              orientation: _orientation
            });

            // 裁切图片需要少许时间，延时转换图片数据
            setTimeout(function() {
              var _sImgData = self.dom.fileCanvas.toDataURL();

              _li.addClass(self.settings.haveClass).css({
                'backgroundImage': 'url(' + _sImgData + ')'
              });

              if (_li.find('input[type=hidden]').length) {
                _li.find('input[type=hidden]').val(_sImgData);
              };

              self.addFile();
            }, 200);
          });
        };
      });
    };

    upPicture.addFile = function() {
      var self = this;

      if (!self.dom.box.find('li').length || (self.dom.box.find('li').length < self.settings.maxLength && self.dom.box.find('li').last().hasClass(self.settings.haveClass))) {
        self.dom.box.append(self.tmpHtml);
      };
    };

    upPicture.init.apply(upPicture, arguments);
  };

  // 默认值
  $.cxUpPicture.defaults = {
    maxLength: 9,
    maxWidth: 200,
    maxHeight: 200,
    haveClass: 'have'
  };

  $.fn.cxUpPicture = function(settings) {
    this.each(function() {
      $.cxUpPicture(this, settings);
    });
    return this;
  };
}));
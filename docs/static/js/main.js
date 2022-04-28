(function() {
  const thePage = {
    dom: {}
  };

  thePage.init = function() {
    const self = this;

    self.dom.body = $('body');

    self.dom.body.on('click', 'a', function(event) {
      const el = this;
      const rel = el.rel;
      const rev = el.rev;

      if (rel === 'body_bg') {
        event.preventDefault();
        self.dom.body.toggleClass('gray');
      };
    });
  };

  thePage.init();
})();
/*
  doormat - http://jh3y.github.io/doormat
  @license MIT

  jh3y (c) 2015.
 */

(function() {
  var doormat, props;

  props = {
    CLASS: 'doormat',
    PANEL_CLASS: 'doormat__panel',
    CURRENT_CLASS: 'is--current'
  };

  doormat = window.doormat = function(el) {
    var calibratePanels, setNew;
    if (!el) {
      throw Error('doormat: Must define an element');
    }
    doormat = this;
    doormat.el = el;
    doormat.el.className += ' ' + props.CLASS;
    doormat.panels = doormat.el.children;
    calibratePanels = function() {
      var i, panel, sumHeight;
      sumHeight = 0;
      i = 0;
      while (i < doormat.panels.length) {
        panel = doormat.panels[i];
        panel.style.minHeight = window.innerHeight + 'px';
        if (panel.className.indexOf(props.PANEL_CLASS) === -1) {
          panel.className += ' ' + props.PANEL_CLASS;
        }
        panel.DOORMAT_HEIGHT = panel.offsetHeight;
        panel.DOORMAT_POS = sumHeight;
        sumHeight = sumHeight + panel.offsetHeight;
        i++;
      }
      return document.body.style.height = sumHeight + 'px';
    };
    calibratePanels();
    doormat.current = doormat.panels[0];
    doormat.current.className += ' ' + props.CURRENT_CLASS;
    setNew = function(dir) {
      var cur;
      cur = doormat.current;
      cur.className = cur.className.replace(props.CURRENT_CLASS, '');
      cur.style.top = dir === 'next' ? -cur.DOORMAT_HEIGHT + 'px' : 0;
      doormat.current = cur[dir + 'ElementSibling'];
      return doormat.current.className += ' ' + props.CURRENT_CLASS;
    };
    window.onresize = function(e) {
      return calibratePanels();
    };
    return window.onscroll = function(e) {
      var cur;
      cur = doormat.current;
      cur.style.top = -(window.scrollY - cur.DOORMAT_POS) + 'px';
      if (window.scrollY > (cur.DOORMAT_HEIGHT + cur.DOORMAT_POS)) {
        if (cur.nextElementSibling) {
          return setNew('next');
        }
      } else if (window.scrollY < cur.DOORMAT_POS) {
        if (cur.previousElementSibling) {
          return setNew('previous');
        }
      }
    };
  };

}).call(this);

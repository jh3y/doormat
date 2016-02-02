/*
 * doormat - http://jh3y.github.io/doormat
 *
 * @license MIT
 * @author jh3y
 * (c) 2016
 */

(function() {
  var Doormat, props;

  props = {
    CLASS: 'dm',
    CURRENT_CLASS: 'dm__pnl--crnt',
    DELAY: 0,
    NEXT: 'next',
    PREVIOUS: 'previous',
    RESET: 'reset'
  };

  Doormat = window.Doormat = function(delay) {
    var calibratePanels, doormat, el, handleScroll, setNew;
    el = document.querySelector('.' + props.CLASS);
    if (!(this instanceof Doormat)) {
      return new Doormat(delay);
    }
    if (!el) {
      throw Error('Doormat: Must pass an element instance');
    }
    setNew = function(dir) {
      var cur;
      cur = doormat.current;
      cur.className = cur.className.replace(props.CURRENT_CLASS, '');
      cur.style.top = dir === props.NEXT ? -cur.DOORMAT_HEIGHT + 'px' : 0;
      doormat.current = dir === props.RESET ? doormat.panels[0] : cur[dir + 'ElementSibling'];
      return doormat.current.className += ' ' + props.CURRENT_CLASS;
    };
    calibratePanels = function(evt) {
      var i, panel, sumHeight;
      sumHeight = 0;
      i = 0;
      while (i < doormat.panels.length) {
        panel = doormat.panels[i];
        panel.style.display = 'block';
        panel.style.minHeight = window.innerHeight + 'px';
        panel.style.top = '0px';
        panel.DOORMAT_HEIGHT = panel.offsetHeight;
        if ((i + 1) !== doormat.panels.length && props.DELAY !== 0) {
          panel.DOORMAT_HEIGHT = panel.DOORMAT_HEIGHT + (window.innerHeight * (props.DELAY / 100));
        }
        panel.DOORMAT_POS = sumHeight;
        sumHeight = sumHeight + panel.DOORMAT_HEIGHT;
        i++;
      }
      document.body.style.height = sumHeight + 'px';
      if (evt) {
        window.scrollTo(0, 0);
        return setNew(props.RESET);
      }
    };
    handleScroll = function() {
      var cur, scroll;
      cur = doormat.current;
      scroll = window.scrollY || window.pageYOffset;
      cur.style.top = -(scroll - cur.DOORMAT_POS) + 'px';
      if (scroll > (cur.DOORMAT_HEIGHT + cur.DOORMAT_POS)) {
        if (cur.nextElementSibling) {
          return setNew(props.NEXT);
        }
      } else if (scroll < cur.DOORMAT_POS) {
        if (cur.previousElementSibling) {
          return setNew(props.PREVIOUS);
        }
      }
    };
    window.onresize = calibratePanels;
    window.onscroll = handleScroll;
    doormat = this;
    doormat.el = el;
    doormat.panels = doormat.el.children;
    if (delay && typeof delay === 'number') {
      props.DELAY = delay;
    }
    doormat.current = doormat.panels[0];
    doormat.current.className += ' ' + props.CURRENT_CLASS;
    calibratePanels();
    return doormat;
  };

}).call(this);

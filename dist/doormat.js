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
    SCROLLBUFFER: 0,
    SNAPDURATION: 250,
    SNAPTHRESHOLD: 15,
    NEXT: 'next',
    PREVIOUS: 'previous',
    RESET: 'reset'
  };

  Doormat = window.Doormat = function(opts) {
    var calibrate, debounce, doormat, el, handleScroll, handleSnap, inSnapRegion, p, prop, setNew;
    el = document.querySelector('.' + props.CLASS);
    if (!(this instanceof Doormat)) {
      return new Doormat(opts);
    }
    if (!el) {
      throw Error('Doormat: Must pass an element instance');
    }
    setNew = function(dir, SNAP) {
      var cur;
      cur = doormat.current;
      cur.className = cur.className.replace(props.CURRENT_CLASS, '');
      cur.style.top = dir === props.NEXT ? -cur.offsetHeight + 'px' : 0;
      doormat.current = dir === props.RESET ? doormat.panels[0] : cur[dir + 'ElementSibling'];
      return doormat.current.className += ' ' + props.CURRENT_CLASS;
    };
    calibrate = function(evt) {
      var clientHeight, i, panel, sumHeight;
      sumHeight = 0;
      i = 0;
      clientHeight = el.offsetHeight;
      while (i < doormat.panels.length) {
        panel = doormat.panels[i];
        panel.style.display = 'block';
        panel.style.minHeight = clientHeight + 'px';
        panel.style.top = '0px';
        panel.DOORMAT_HEIGHT = panel.offsetHeight;
        if ((i + 1) !== doormat.panels.length && props.SCROLLBUFFER !== 0) {
          panel.DOORMAT_HEIGHT = panel.DOORMAT_HEIGHT + (clientHeight * (props.SCROLLBUFFER / 100));
        }
        panel.DOORMAT_POS = sumHeight;
        sumHeight = sumHeight + panel.DOORMAT_HEIGHT;
        i++;
      }
      props.SNAPTHRESHOLDSIZE = clientHeight * (props.SNAPTHRESHOLD / 100);
      document.body.style.height = sumHeight + 'px';
      if (evt) {
        window.scrollTo(0, 0);
        return setNew(props.RESET);
      }
    };
    debounce = function(func, delay) {
      clearTimeout(func.TIMER);
      func.TIMER = setTimeout(func, delay);
    };
    handleSnap = function() {
      var cur, reset, scroll;
      cur = doormat.current;
      scroll = window.scrollY || window.pageYOffset;
      if (inSnapRegion() && scroll !== cur.DOORMAT_POS) {
        cur.style.transitionProperty = 'top';
        cur.style.transitionDuration = props.SNAPTRANSITIONDURATION;
        reset = function() {
          cur.style.transitionProperty = null;
          cur.style.transitionDuration = null;
          return cur.removeEventListener('transitionend', reset);
        };
        cur.addEventListener('transitionend', reset, false);
        if (doormat.SNAP_BOTTOM) {
          return window.scrollTo(0, cur.DOORMAT_POS + (cur.offsetHeight - el.offsetHeight));
        } else {
          cur.style.top = -cur.offsetHeight + 'px';
          setNew(props.NEXT);
          return window.scrollTo(0, doormat.current.DOORMAT_POS - (doormat.current.DOORMAT_HEIGHT - doormat.current.offsetHeight));
        }
      }
    };
    inSnapRegion = function() {
      var cur, scroll;
      cur = doormat.current;
      scroll = window.scrollY || window.pageYOffset;
      doormat.SNAP_TOP = scroll > ((cur.offsetHeight + cur.DOORMAT_POS) - props.SNAPTHRESHOLDSIZE) && scroll < (cur.DOORMAT_POS + cur.offsetHeight);
      doormat.SNAP_BOTTOM = scroll > ((cur.DOORMAT_POS + cur.offsetHeight) - el.offsetHeight) && scroll < (((cur.DOORMAT_POS + cur.offsetHeight) - el.offsetHeight) + props.SNAPTHRESHOLDSIZE);
      return doormat.SNAP_TOP || doormat.SNAP_BOTTOM;
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
      } else if (inSnapRegion()) {
        return debounce(handleSnap, props.SNAPDURATION);
      }
    };
    if ('onorientationchange' in window) {
      window.onorientationchange = calibrate;
    } else {
      window.onresize = calibrate;
    }
    window.onscroll = handleScroll;
    doormat = this;
    doormat.el = el;
    doormat.panels = doormat.el.children;
    for (prop in opts) {
      p = prop.toUpperCase();
      if (props[p] !== undefined) {
        props[p] = opts[prop];
      }
      props.SNAPTRANSITIONDURATION = (props.SNAPDURATION / 1000) + 's';
    }
    doormat.current = doormat.panels[0];
    doormat.current.className += ' ' + props.CURRENT_CLASS;
    calibrate();
    return doormat;
  };

}).call(this);

/**
  * doormat - http://jh3y.github.io/doormat
  *
  * @license MIT
  * @author jh3y
  * (c) 2016
*/
(function(){
  let PROPS = {
    CLASS        : 'dm',
    CURRENT_CLASS: 'dm-pnl--crnt',
    NEXT         : 'next',
    PREVIOUS     : 'previous',
    RESET        : 'reset',
    ERROR_MSG    : 'Doormat: Must assign root element with class',
    DOWN         : 'D',
    UP           : 'U'
  };
  /* Configurable options */
  const DEFAULTS = {
    debounce: 150,
    snapping: {
      travel   : false,
      viewport : true,
      threshold: 30,
      duration : '.25s'
    }
  };
  const DEBOUNCE = (func, delay) => {
    var inDebounce = undefined;
    return function() {
      var context = this,
        args = arguments;
      clearTimeout(inDebounce);
      return inDebounce = setTimeout(function() {
        return func.apply(context, args);
      }, delay);
    }
  };
  const EXTEND = (a, b) => {
    const result = {};
    for (let prop in a) {
      const label = prop.toUpperCase();
      result[label] = a[prop];
      if (b.hasOwnProperty(prop)) {
        const val = b[prop];
        result[label] = (typeof val === 'object') ? EXTEND(result[label], val) : val;
      }
    }
    return result;
  };
  class Doormat {
    constructor(opts) {
      const doormat = this;
      doormat.el = document.querySelector(`.${PROPS.CLASS}`);
      if (!doormat.el) throw Error(PROPS.ERROR_MSG);
      /* set up event binding */
      if ('onorientationchange' in window) {
        window.onorientationchange = doormat.calibrate.bind(this);
      } else {
        window.onresize = DEBOUNCE(doormat.calibrate.bind(this), 100);
      }
      window.onscroll = doormat.__handleScroll.bind(this);
      /* end event binding */
      doormat.panels = doormat.el.children;
      doormat._OPTS = EXTEND(DEFAULTS, opts);
      /* NOTE important that current panel is defined before calibration */
      doormat.CURRENT = doormat.panels[0];
      doormat.CURRENT.className += ` ${PROPS.CURRENT_CLASS}`
      doormat.calibrate();
    }
    __setPanel(DIR) {
      const doormat = this;
      let current = doormat.CURRENT;
      current.className = current.className.replace(PROPS.CURRENT_CLASS, '').trim();
      current.style.top = (DIR === PROPS.NEXT) ? `-${current.offsetHeight}px` : 0;
      doormat.CURRENT = (DIR === PROPS.RESET) ? doormat.panels[0] : current[`${DIR}ElementSibling`];
      doormat.CURRENT.className += ` ${PROPS.CURRENT_CLASS}`;
    }
    /**
      * calibrates panels so that they are the correct height when viewport
      * size changes
    */
    calibrate(evt) {
      const doormat = this;
      doormat.TRACK_HEIGHT = 0;
      doormat.HEIGHT = ('onorientationchange' in window) ? screen.height : window.innerHeight;
      const panels = doormat.panels;
      for (let i = 0; i < panels.length; i++) {
        const panel = panels[i];
        panel.style.zIndex  = 999 - i;
        panel.style.minHeight = `${doormat.HEIGHT}px`;
        panel.style.display = 'block';
        panel.style.visibility = 'visible';
        panel.HEIGHT = panel.offsetHeight;
        panel.STARTING_POS = doormat.TRACK_HEIGHT;
        doormat.TRACK_HEIGHT = doormat.TRACK_HEIGHT + panel.offsetHeight;
      }
      doormat.SNAP_THRESHOLD = doormat.HEIGHT * (doormat._OPTS.SNAPPING.THRESHOLD / 100);
      document.body.style.height = `${doormat.TRACK_HEIGHT}px`;
      if (evt) {
        window.scrollTo(0, 0);
        doormat.__setPanel(PROPS.RESET);
      }
    }
    /**
      * Determines whether doormat is currently within or surpassed the snap
      * threshold
    */
    inSnapRegion() {
      const doormat   = this;
      const current   = doormat.CURRENT;
      const height    = current.offsetHeight;
      const threshold = doormat.SNAP_THRESHOLD;
      const pS        = doormat._OPTS.SNAPPING;
      const top       = Math.abs(parseInt(current.style.top, 10));
      doormat.SNAP_TOP = false;
      doormat.SNAP_BOTTOM = false;
      /**
        * whether scroll is within the physical top threshold or surpassed it
        * with snap to viewport this is the current creeping in from the top
        * it will snap back out. With travel if we go past dragging it in far
        * shoot to STARTING_POS or (offsetHeight - clientHeight).
      */
      const withinTop  = top < height && top > (height - threshold);
      const beyondTop  = (top < (height - threshold)) && (top > (height - doormat.HEIGHT)) && doormat.SCROLL_DIR === PROPS.UP;
      // console.log(`TOP -- BEYOND: ${beyondTop} WITHIN: ${withinTop}`);
      doormat.SNAP_TOP = (pS.VIEWPORT) ? withinTop : beyondTop;
      /**
        * whether scroll is within the physical bottom threshold or surpassed it
        * with snap to viewport this is when the bottom of the panel snaps back
        * to the bottom edge of the viewport. For snap to travel, surpassing the
        * required threshold will spring the next panel into view.
      */
      const withinBottom = top < ((height - doormat.HEIGHT) + threshold) && top > (height - doormat.HEIGHT);
      const beyondBottom = (top > ((height - doormat.HEIGHT) + threshold)) && doormat.SCROLL_DIR === PROPS.DOWN;
      // console.log(`BOTTOM -- BEYOND: ${beyondBottom} WITHIN: ${withinBottom}`);
      doormat.SNAP_BOTTOM = (pS.VIEWPORT) ? withinBottom : beyondBottom;
      return doormat.SNAP_TOP || doormat.SNAP_BOTTOM;
    }
    __handleScroll(evt) {
      const doormat = this;
      const current = doormat.CURRENT;
      const scroll  = window.scrollY || window.pageYOffset;
      doormat.SCROLL_DIR = (scroll > doormat.SCROLL_LAST) ? PROPS.DOWN : PROPS.UP;
      doormat.SCROLL_LAST = scroll;
      current.style.top  = `${current.STARTING_POS - scroll}px`;
      /**
        * set a new panel if necessary
      */
      if ((scroll > (current.STARTING_POS + current.HEIGHT)) || (scroll === (current.STARTING_POS + current.HEIGHT))) {
        if (current.nextElementSibling) doormat.__setPanel(PROPS.NEXT);
      } else if (scroll < current.STARTING_POS) {
        if (current.previousElementSibling) doormat.__setPanel(PROPS.PREVIOUS);
      }
      /**
        * handle snap behavior
      */
      const pS = doormat._OPTS.SNAPPING;
      if ((pS && (pS.VIEWPORT || pS.TRAVEL)) && doormat.inSnapRegion()) {
        const hs = doormat.__handleSnap;
        clearTimeout(hs.__TIMER);
        hs.__TIMER = setTimeout(hs.bind(doormat), doormat._OPTS.DEBOUNCE);
      }
    }
    __handleSnap() {
      const doormat = this;
      const current = doormat.CURRENT;
      const isViewportSnap = doormat._OPTS.SNAPPING.VIEWPORT;
      const reset   = function () {
        current.style.transitionProperty = null;
        current.style.transitionDuration = null;
      };
      const set = function () {
        current.style.transitionProperty = 'top';
        current.style.transitionDuration = doormat._OPTS.SNAPPING.DURATION;
        current.addEventListener('transitionend', reset);
      };
      const snapOut = function () {
        current.style.top = `-${current.offsetHeight}px`;
        doormat.__setPanel(PROPS.NEXT);
        window.scrollTo(0, doormat.CURRENT.STARTING_POS);
      }
      const snapIn = function () {
        window.scrollTo(0, current.STARTING_POS + (current.offsetHeight - doormat.HEIGHT));
      }
      /**
        * double check we are still in the snap region when the debounced
        * function is invoked.
      */
      if (doormat.inSnapRegion()) {
        set();
        if (doormat.SNAP_TOP) {
          if (isViewportSnap) {
            snapOut();
          } else {
            snapIn();
          }
        } else if (doormat.SNAP_BOTTOM) {
          if (isViewportSnap) {
            snapIn();
          } else {
            snapOut();
          }
        }
      }
    }
  }
  window.Doormat = Doormat;
}());

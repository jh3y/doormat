/*!
  * doormat - http://jh3y.github.io/doormat
  *
  * @license MIT
  * @author jh3y
  * (c) 2017
!*/
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
  * Represent Doormat instance
  * @constructor
  * @param {Object} opts - user defined options for Doormat instance
*/
var Doormat =
// Define the active panel

// Content panels

// Scroll position reference

// Set default options for doormat

// class enums for no class mis-match
function Doormat(opts) {
  _classCallCheck(this, Doormat);

  _initialiseProps.call(this);

  var bind = this.bind,
      calibrate = this.calibrate,
      classes = this.classes,
      active = this.active,
      defaults = this.defaults,
      enums = this.enums,
      errors = this.errors;

  this.options = Object.assign({}, defaults, opts);
  /**
    * Set appropriate classes for first panel and doormat element.
  */
  if (!(this.options.snapMode === enums.travel || this.options.snapMode === enums.viewport)) throw Error(errors.invalidSnap);

  if (!(this.options.mode === enums.inbound || this.options.mode === enums.outbound)) throw Error(errors.invalidMode);
  active.classList.add(classes.active);
  if (this.options.mode === enums.inbound) this.el.classList.add(classes.inbound);
  calibrate();
  bind();
}
/**
  * Request updating the DOM. If actively in an update cycle, then do
  * nothing
  * @return {undefined}
  * @param {function} action - action to be invoked during next frame
*/

// Reference for update state for scroll performance

// Main element

// Set class enums for no string mis-match

/**
  * Bind event listeners for scrolling and viewport resize or orientation
  * change
  * @return {undefined}
*/

/**
  * on scroll update the scroll position reference and request to update
  * the DOM
  * @return {undefined}
*/

/**
  * Handle scrolling behavior setting classes appropriately based on scroll
  * position.
  * @return {undefined}
*/

/**
  * Determine whether active scroll position is within snap region
  * @return {String} region - Returns an enumeration of which region to snap
  * in/from
*/

/**
  * An internal scrolling function for snapping/travelling effects using
  * requestAnimationFrame. Drops the need for $.animate
  * @param {Number} destination - the desired scroll position
  * @param {Number} timeToScroll - duration of scroll in ms
  * @return {undefined}
*/

/**
  * Shorthand for scrolling to a specific panel.
  * @param {number} panelIndex - panel to scroll to
  * @param {number} speed - optional speed in ms
  * @return {undefined}
*/

/**
  * Shorthand for travelling to next panel
  * @return {undefined}
*/

/**
  * Shorthand for travelling to previous panel
  * @return {undefined}
*/

/**
  * Handle snap enumeration and scroll doormat to appropriate panel if
  * necessary.
  * @param {String} region - enumeration of snap region "up/down"
  * @return {undefined}
*/

/**
  * Check for whether a content panel is longer than viewport height.
  * @return {bool} greater - whether panel height is greater than viewport
  * height
*/

/**
  * Reset DOM elements and scroll to top of window. Invoked on viewport
  * changes mitigates the risk of funky glitches that can occur on resizing
  * of content etc.
  * @return {undefined}
*/


/**
  * Sets the doormat behavior style by setting appropriate z-index values
  * and setting up the correct classnaming if necessary
  * @param {number} timestamp - timestamp for requestAnimationFrame invocation
  * Used to determine how calibration was invoked and whether to reset.
  * @return {undefined}
*/
;

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.classes = {
    active: 'dm-panel--active',
    el: 'dm',
    inbound: 'dm--inbound',
    obsolete: 'dm-panel--obsolete' };
  this.enums = {
    inbound: 'inbound',
    outbound: 'outbound',
    travel: 'travel',
    viewport: 'viewport',
    bottom: 'bottom',
    top: 'top',
    up: 'up',
    down: 'down',
    updateEvent: 'doormat:update' };
  this.defaults = {
    snapDebounce: 150,
    scrollDuration: 250,
    snapMode: this.enums.viewport,
    mode: this.enums.outbound,
    snapThreshold: 30
  };
  this.errors = {
    invalidMode: 'Doormat: mode must be either "inbound" or "outbound"',
    invalidSnap: 'Doormat: snapMode must be set to either "viewport" or "travel"' };
  this.scrollPos = 0;
  this.el = document.querySelector('.' + this.classes.el);
  this.panels = this.el.children;
  this.updating = false;
  this.active = this.panels[0];
  this.activeIndex = 1;

  this.requestUpdate = function (action) {
    if (!_this.updating) {
      requestAnimationFrame(action);
      _this.updating = true;
    }
  };

  this.bind = function () {
    var onViewportChange = function onViewportChange() {
      return _this.requestUpdate(_this.calibrate);
    };
    if ('onorientationchange' in window) window.onorientationchange = onViewportChange;else window.onresize = onViewportChange;
    window.onscroll = _this.onScroll;
  };

  this.onScroll = function () {
    var enums = _this.enums,
        scrollPos = _this.scrollPos;

    var newPosition = window.scrollY || window.pageYOffset;
    _this.scrollDir = scrollPos < newPosition ? enums.down : enums.up;
    _this.scrollPos = newPosition;
    _this.requestUpdate(_this.handleScroll);
  };

  this.handleScroll = function () {
    var classes = _this.classes,
        active = _this.active,
        el = _this.el,
        handleSnap = _this.handleSnap,
        inSnapRegion = _this.inSnapRegion,
        enums = _this.enums,
        options = _this.options,
        scrollPos = _this.scrollPos;
    var snapMode = options.snapMode,
        snapDebounce = options.snapDebounce;

    var activeIndex = active.doormatIndex;
    var next = active.nextElementSibling;
    var prev = active.previousElementSibling;
    var isInbound = options.mode === enums.inbound;

    var boundaries = {
      up: isInbound ? next && scrollPos >= next.offsetTop : next && scrollPos >= active.offsetTop + active.offsetHeight,
      down: isInbound ? prev && scrollPos < prev.doormatBoundary : prev && scrollPos < active.offsetTop

      /**
        * Update scroll position reference and determine scroll direction
      */
    };if (boundaries.up) {
      active.classList.remove(classes.active);
      active.classList.add(classes.obsolete);
      next.classList.add(classes.active);
      next.style.top = isInbound ? '0' : next.doormatActiveTop;
      _this.active = next;
    } else if (boundaries.down) {
      active.classList.remove(classes.active);
      active.style.top = isInbound ? active.doormatActiveTop : '0';
      prev.classList.remove(classes.obsolete);
      prev.classList.add(classes.active);
      _this.active = prev;
    }
    if (activeIndex !== _this.active.doormatIndex) {
      var update = new Event(enums.updateEvent, {
        bubbles: true
      });
      _this.activeIndex = _this.active.doormatIndex;
      el.dispatchEvent(update);
    }
    _this.updating = false;

    /**
      * handle snap behavior
    */
    if (snapMode) {
      var snapRegion = inSnapRegion();
      clearTimeout(handleSnap.__TIMER);
      if (snapRegion) _this.handleSnap.__TIMER = setTimeout(function () {
        handleSnap(snapRegion);
      }, snapDebounce);
    }
  };

  this.inSnapRegion = function () {
    var enums = _this.enums,
        active = _this.active,
        options = _this.options,
        scrollPos = _this.scrollPos,
        scrollDir = _this.scrollDir;
    var snapMode = options.snapMode,
        snapThreshold = options.snapThreshold;
    /**
      * Determine whether active position is within the top threshold.
      * Threshold defined as percentage of viewport.
    */

    var startScrollPos = active.startScrollPos,
        offsetHeight = active.offsetHeight;


    var thresholdSize = window.innerHeight * (snapThreshold / 100);

    var withinBottom = void 0,
        withinTop = void 0;

    var bottomBoundary = startScrollPos + offsetHeight;
    var bottomBuffer = bottomBoundary - thresholdSize;
    var topBuffer = startScrollPos + thresholdSize;

    if (snapMode === enums.viewport) {
      withinBottom = scrollPos > bottomBuffer && scrollPos < bottomBoundary;
      withinTop = scrollPos > startScrollPos && scrollPos < topBuffer;
    } else if (snapMode === enums.travel) {
      withinBottom = scrollPos > topBuffer && scrollDir === enums.down;
      withinTop = scrollDir === enums.up && scrollPos < bottomBuffer;
    }

    if (withinBottom || withinTop) return withinBottom ? enums.bottom : enums.top;
  };

  this.scrollTo = function (destination, timeToScroll) {
    var options = _this.options,
        scrollPos = _this.scrollPos;

    var start = performance.now();
    var duration = timeToScroll || options.scrollDuration;
    var startingBlock = scrollPos || window.scrollY || window.pageYOffset;
    var distance = destination - startingBlock;
    var traverse = function traverse() {
      var now = performance.now();
      var time = Math.min(1, (now - start) / duration);
      var timeFn = Math.sin(time * (Math.PI / 2));
      if (window.pageYOffset === destination) return;
      window.scrollTo(0, Math.ceil(timeFn * distance + startingBlock));
      requestAnimationFrame(traverse);
    };
    traverse();
  };

  this.scrollToPanel = function (panelIndex, speed) {
    var panels = _this.panels,
        scrollTo = _this.scrollTo;

    var destinationPanel = panels[panelIndex - 1];
    if (destinationPanel) scrollTo(destinationPanel.startScrollPos, speed);else throw Error('Doormat: No panel available at that index');
  };

  this.next = function () {
    _this.scrollToPanel(_this.active.doormatIndex + 1);
  };

  this.prev = function () {
    _this.scrollToPanel(_this.active.doormatIndex - 1);
  };

  this.handleSnap = function (region) {
    var active = _this.active,
        enums = _this.enums,
        scrollTo = _this.scrollTo;

    var next = active.nextElementSibling;
    if (!_this.scrolling) {
      var nextPanel = region === enums.top ? active : next;
      scrollTo(nextPanel.startScrollPos);
    }
  };

  this.isGreaterThanViewport = function () {
    var panels = _this.panels;

    var greater = false;
    for (var p = 0; p < panels.length; p++) {
      if (panels[p].offsetHeight > window.innerHeight) greater = true;
    }return greater;
  };

  this.reset = function () {
    var classes = _this.classes,
        panels = _this.panels;

    window.scrollTo(0, 0);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = panels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var panel = _step.value;

        panel.classList.remove(classes.obsolete);
        panel.classList.remove(classes.active);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    panels[0].classList.add(classes.active);
  };

  this.calibrate = function (timestamp) {
    var el = _this.el,
        enums = _this.enums,
        panels = _this.panels,
        reset = _this.reset,
        options = _this.options;

    var isOutbound = options.mode === enums.outbound;
    var greater = _this.isGreaterThanViewport();

    var cumulativeHeight = 0;
    var activeHeight = 0;

    for (var i = 0; i < panels.length; i++) {
      var panel = panels[i];
      panel.doormatIndex = i + 1;
      cumulativeHeight += panel.offsetHeight;
      if (i) activeHeight += panels[i - 1].offsetHeight;
      panel.startScrollPos = activeHeight;
      if (greater) panel.doormatActiveTop = activeHeight + 'px';else panel.doormatActiveTop = i + '00vh';
      panel.style.zIndex = isOutbound ? 1000 - i : 1000 - (panels.length - i);
      if (!isOutbound) {
        panel.doormatBoundary = cumulativeHeight;
        panel.style.top = panel.doormatActiveTop;
      }
    }

    _this.cumulativeHeight = cumulativeHeight;
    el.style.height = greater ? cumulativeHeight + 'px' : panels.length + '00vh';
    /**
      * If timestamp, then calibration is being invoked via
      * requestAnimationFrame and therefore we know this is part of a viewport
      * change. Due to issues when viewport size changes and maintaining scroll
      * position, it's simpler to mitigate side effects by resetting the
      * elements.
    */
    if (timestamp) reset();

    _this.updating = false;
  };
};

window.Doormat = Doormat;
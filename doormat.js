;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Main definitions.
 */

require.mains = {};

/**
 * Define a main.
 */

require.main = function(name, path){
  require.mains[name] = path;
};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if ('/' == path.charAt(0)) path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  if (require.mains[path]) {
    paths = [path + '/' + require.mains[path]];
  }

  for (var i = 0, len = paths.length; i < len; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) {
      return path;
    }
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0, len = path.length; i < len; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var root = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(root, path);
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("doormat/index.js", function(exports, require, module){
/*
doormat - http://jh3y.github.io/doormat
Licensed under the MIT license

Jhey Tompkins (c) 2014.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
module.exports = doormat;
function doormat(element, multiple) {
	this.element = element;
	this.multiple = (multiple) ? multiple: false;
	if (this.element) {
		this.setUp();
	}
}
doormat.prototype.setUp = function () {
	var doormat = this;
	(doormat.multiple) ? doormat.element.className += ' doormat-multiple': doormat.element.className += ' doormat';
	if (doormat.multiple && (doormat.element.tagName === 'OL' || doormat.element.tagName === 'UL')) {
		var panels = doormat.element.querySelectorAll('li');
		[].forEach.call(panels, function(panel, index) {
			panel.className += ' doormat-panel';
		});
		panels[0].className += ' current';
		panels[1].className += ' next';
	} else {
		doormat.element.nextElementSibling.className += ' doormat-page-content';
	}
	doormat.bindEvents();
}
doormat.prototype.bindEvents = function () {
	var doormat = this,
		doormatHeight = (doormat.multiple) ? doormat.element.querySelector('.current').offsetHeight + doormat.element.querySelector('.current').offsetTop: doormat.element.offsetHeight,
		iOSDevice = (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)),
		createiOSHeight = function () {
			window.scrollTo(0, 1);
			if (doormat.multiple) {						
				[].forEach.call(doormat.element.querySelectorAll('.doormat-panel'), function (panel, index) {
					panel.style.minHeight = window.innerHeight + 'px';
				});
			} else {
				doormat.element.style.minHeight = window.innerHeight + 'px';
			}
		}
	if (iOSDevice) {
		doormat.element.className += ' iOS';
		createiOSHeight();
		window.onorientationchange = function () {
			createiOSHeight();
		}
		window.onresize = function () {
			createiOSHeight();
		}
	}
	window.onresize = function () {
		if (doormat.multiple) {
			doormatHeight = doormat.element.querySelector('.current').offsetHeight + doormat.element.querySelector('.current').offsetTop;
		} else {
			doormatHeight = doormat.element.offsetHeight;
		}
	}
	if (!doormat.multiple) {
		window.onscroll = function () {
			if (window.scrollY >= doormatHeight) {
				(document.body.className.indexOf('doormat-in-content') === -1) ? document.body.className += ' doormat-in-content': false;
			} else {
				document.body.className = document.body.className.replace('doormat-in-content', '');
			}
		};
	} else if (doormat.multiple) {
		var lastScrollPosition = 0;
		var scrollForward = true;
		window.onscroll = function () {
			var currentDm = doormat.element.querySelector('.current'),
				previousDm = currentDm.previousElementSibling,
				newCurrent = currentDm.nextElementSibling;
			scrollForward = (window.scrollY > lastScrollPosition) ? true: false;
			lastScrollPosition = window.scrollY;
			if ((window.scrollY > doormatHeight) && scrollForward) {
				if(newCurrent.nextElementSibling) {
					currentDm.className = currentDm.className.replace('current', '');
					newCurrent.className = newCurrent.className.replace('next', 'current');
					newCurrent.nextElementSibling.className += ' next';
					window.scrollTo(0, newCurrent.offsetTop + 1);
					doormatHeight = newCurrent.offsetTop + newCurrent.offsetHeight;
				}
			} else if (window.scrollY <= doormat.element.querySelector('.current').offsetTop && !scrollForward) {	
				if (previousDm) {
					currentDm.className = currentDm.className.replace('current', 'next');
					previousDm.className = previousDm.className + ' current';
					newCurrent.className = newCurrent.className.replace('next', '');
					window.scrollTo(0, previousDm.offsetTop + previousDm.offsetHeight);
					doormatHeight = previousDm.offsetTop + previousDm.offsetHeight;
					//detect if using Safari.
					if (navigator.userAgent.match(/Safari/i) && !navigator.userAgent.match(/Chrome/i)) {
						console.log('doormat: try to force repaint in Safari Webkit');
					}
				}
			}
		}
	}
}
});if (typeof exports == "object") {
  module.exports = require("doormat");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("doormat"); });
} else {
  this["doormat"] = require("doormat");
}})();
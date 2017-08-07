'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var controls = document.querySelector('.controls');
  var indicators = document.querySelectorAll('.slide-indicator');
  if ('onorientationchange' in window) screen.orientation.lock('portrait');
  window.newDoormat = new Doormat();
  window.addEventListener('doormat:update', function (e) {
    if (newDoormat.activeIndex > 1) {
      document.body.classList.add('show-controls');
    } else {
      document.body.classList.remove('show-controls');
    }
    indicators.forEach(function (i) {
      return i.classList.remove('slide-indicator--active');
    });
    indicators[newDoormat.activeIndex - 1].classList.add('slide-indicator--active');
  });
  var handleNav = function handleNav(e) {
    if (e.target.tagName === 'BUTTON') {
      newDoormat.scrollToPanel(e.target.getAttribute('data-panel'));
    }
  };
  controls.addEventListener('click', handleNav);
});
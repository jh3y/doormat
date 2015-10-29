doormat = window.doormat = (el) ->
  if el
    @element = el
    @setUp()
  else
    throw Error 'doormat: Must define an element'

doormat::setUp = ->
  doormat = @
  # if (doormat.multiple)
  #   doormat.element.className += ' has--multiple'
  # Think the best thing is to just do default as multiple?
  doormat.element.className += ' doormat'
  doormat.panels  = doormat.element.children
  i = 0
  while i < doormat.panels.length
    doormat.panels[i].className += ' doormat__panel'
    doormat.panels[i].style.minHeight = window.innerHeight + 'px'
    i++
  doormat.panels[0].className += ' is--current'
  doormat.panels[1].className += ' is--next'
  doormat.bindEvents()

doormat::bindEvents = ->
  doormat = @
  doormat.current = doormat.element.querySelector '.is--current'
  doormat.height = doormat.current.offsetHeight + doormat.current.offsetTop
  window.scrollTo 0, 1
  lastScroll = 0
  scrollForward = true
  # Bind some stuff for mobile orientation change here...
  window.onresize = (e) ->
    doormat.height = doormat.current.offsetHeight + doormat.current.offsetTop
  window.onscroll = (e) ->
    current = doormat.element.querySelector '.is--current'
    previous = current.previousElementSibling
    next     = current.nextElementSibling
    scrollY  = window.scrollY or window.pageYOffset
    scrollForward = if scrollY > lastScroll then true else false
    lastScroll = scrollY
    if scrollY > doormat.height and scrollForward
      if next
        current.className = current.className.replace 'is--current', ''
        next.className    = next.className.replace 'is--next', 'is--current'
        next.nextElementSibling.className += ' is--next'
        window.scrollTo 0, next.offsetTop + 1
        doormat.height = next.offsetTop + next.offsetHeight


###
doormat.prototype.bindEvents = function () {
  window.onresize = function () {
    if (doormat.multiple) {
      doormatHeight = doormat.element.querySelector('.current').offsetHeight + doormat.element.querySelector('.current').offsetTop;
    } else {
      doormatHeight = doormat.element.offsetHeight;
    }
  }
  if (!doormat.multiple) {
    window.onscroll = function () {
      var scrollY = (window.scrollY || window.pageYOffset);
      if (scrollY >= doormatHeight) {
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
        newCurrent = currentDm.nextElementSibling,
        scrollY = (window.scrollY || window.pageYOffset);
      scrollForward = (scrollY > lastScrollPosition) ? true: false;
      lastScrollPosition = scrollY;
      if ((scrollY > doormatHeight) && scrollForward) {
        if(newCurrent.nextElementSibling) {
          currentDm.className = currentDm.className.replace('current', '');
          newCurrent.className = newCurrent.className.replace('next', 'current');
          newCurrent.nextElementSibling.className += ' next';
          window.scrollTo(0, newCurrent.offsetTop + 1);
          doormatHeight = newCurrent.offsetTop + newCurrent.offsetHeight;
        }
      } else if (scrollY <= doormat.element.querySelector('.current').offsetTop && !scrollForward) {
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
###

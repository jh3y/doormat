###
# doormat - http://jh3y.github.io/doormat
#
# @license MIT
# @author jh3y
# (c) 2016
###
props =
  CLASS        : 'dm'
  CURRENT_CLASS: 'dm__pnl--crnt'
  DELAY        : 0
  NEXT         : 'next'
  PREVIOUS     : 'previous'
  RESET        : 'reset'

Doormat = window.Doormat = (delay) ->
  el = document.querySelector '.' + props.CLASS
  return new Doormat(delay) unless @ instanceof Doormat
  throw Error 'Doormat: Must pass an element instance' if !el

  # Sets a new current panel to begin scrolling on.
  # This is based on direction but in cases where we resize the window,
  # we can do a RESET.
  setNew = (dir) ->
    cur = doormat.current
    cur.className = cur.className.replace props.CURRENT_CLASS, ''
    cur.style.top = if dir is props.NEXT then  -(cur.DOORMAT_HEIGHT) + 'px' else 0
    doormat.current = if dir is props.RESET then doormat.panels[0] else cur[dir + 'ElementSibling']
    doormat.current.className += ' ' + props.CURRENT_CLASS

  # Calibrates doormat panels by setting minimum height to window
  # innerHeight.
  # More importantly sets document.body height based on a cumulative height
  # of panels. This plays a large part in making the effect possible.
  calibratePanels = (evt) ->
    sumHeight = 0
    i         = 0

    while i < doormat.panels.length
      panel = doormat.panels[i]
      # NOTE:: Required for window resizing behaviour but also so
      # we can use the ~ selector in our CSS to stop content flashing
      panel.style.display   = 'block'
      panel.style.minHeight = window.innerHeight + 'px'
      panel.style.top       = '0px'
      panel.DOORMAT_HEIGHT  = panel.offsetHeight
      if (i + 1) isnt doormat.panels.length and props.DELAY isnt 0
        panel.DOORMAT_HEIGHT = panel.DOORMAT_HEIGHT + (window.innerHeight * (props.DELAY / 100))
      panel.DOORMAT_POS     = sumHeight
      sumHeight = sumHeight + panel.DOORMAT_HEIGHT
      i++

    document.body.style.height = sumHeight + 'px'
    # If triggered by a page resize, we want to reset the scroll.
    # This is to avoid strange paint/scroll effects that might arise
    # if mid-panel scroll and then resizing
    if evt
      window.scrollTo 0, 0
      setNew props.RESET

  handleScroll = ->
    cur = doormat.current
    scroll = window.scrollY or window.pageYOffset
    cur.style.top = -(scroll - cur.DOORMAT_POS) + 'px';
    if scroll > (cur.DOORMAT_HEIGHT + cur.DOORMAT_POS)
      if cur.nextElementSibling
        setNew props.NEXT
    else if scroll < cur.DOORMAT_POS
      if cur.previousElementSibling
        setNew props.PREVIOUS

  # Bind window interaction events
  window.onresize = calibratePanels
  window.onscroll = handleScroll

  # Initialize doormat instance.
  doormat        = @
  doormat.el     = el
  doormat.panels = doormat.el.children

  # If user passes a pixel percent scroll delay, override props.DELAY.
  if delay and typeof delay is 'number'
    props.DELAY = delay

  # NOTE:: Important that current panel is defined before panel calibration.
  doormat.current            = doormat.panels[0]
  doormat.current.className += ' ' + props.CURRENT_CLASS
  calibratePanels()
  doormat

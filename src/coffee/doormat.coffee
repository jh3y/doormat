###
# doormat - http://jh3y.github.io/doormat
#
# @license MIT
# @author jh3y
# (c) 2016
###
props =
  CLASS         : 'dm'
  CURRENT_CLASS : 'dm__pnl--crnt'
  SCROLLBUFFER  : 0
  SNAPDURATION  : 250
  SNAPTHRESHOLD : 15
  NEXT          : 'next'
  PREVIOUS      : 'previous'
  RESET         : 'reset'

Doormat = window.Doormat = (opts) ->
  el = document.querySelector '.' + props.CLASS
  return new Doormat(opts) unless @ instanceof Doormat
  throw Error 'Doormat: Must pass an element instance' if !el

  # Sets a new current panel to begin scrolling on.
  # This is based on direction but in cases where we resize the window,
  # we can do a RESET.
  setNew = (dir, SNAP) ->
    cur = doormat.current
    cur.className = cur.className.replace props.CURRENT_CLASS, ''
    cur.style.top = if dir is props.NEXT then  -(cur.offsetHeight) + 'px' else 0
    doormat.current = if dir is props.RESET then doormat.panels[0] else cur[dir + 'ElementSibling']
    doormat.current.className += ' ' + props.CURRENT_CLASS

  # Calibrates doormat panels by setting minimum height to window
  # innerHeight.
  # More importantly sets document.body height based on a cumulative height
  # of panels. This plays a large part in making the effect possible.
  calibrate = (evt) ->
    sumHeight = 0
    i         = 0

    clientHeight = el.offsetHeight
    while i < doormat.panels.length
      panel = doormat.panels[i]
      # NOTE:: Required for window resizing behaviour but also so
      # we can use the ~ selector in our CSS to stop content flashing
      panel.style.display   = 'block'
      panel.style.minHeight = clientHeight + 'px'
      panel.style.top       = '0px'
      panel.DOORMAT_HEIGHT  = panel.offsetHeight
      if (i + 1) isnt doormat.panels.length and props.SCROLLBUFFER isnt 0
        panel.DOORMAT_HEIGHT = panel.DOORMAT_HEIGHT + (clientHeight * (props.SCROLLBUFFER / 100))
      panel.DOORMAT_POS     = sumHeight
      sumHeight = sumHeight + panel.DOORMAT_HEIGHT
      i++
    props.SNAPTHRESHOLDSIZE = clientHeight * (props.SNAPTHRESHOLD / 100)
    document.body.style.height = sumHeight + 'px'
    # If triggered by a page resize, we want to reset the scroll.
    # This is to avoid strange paint/scroll effects that might arise
    # if mid-panel scroll and then resizing
    if evt
      window.scrollTo 0, 0
      setNew props.RESET

  debounce = (func, delay) ->
    clearTimeout func.TIMER
    func.TIMER = setTimeout func, delay
    return

  handleSnap = ->
    cur = doormat.current
    scroll = window.scrollY or window.pageYOffset
    if inSnapRegion() and scroll isnt cur.DOORMAT_POS
      cur.style.transitionProperty = 'top'
      cur.style.transitionDuration = props.SNAPTRANSITIONDURATION
      reset = ->
        cur.style.transitionProperty = null
        cur.style.transitionDuration = null
        cur.removeEventListener 'transitionend', reset
      cur.addEventListener 'transitionend', reset, false
      if doormat.SNAP_BOTTOM
        window.scrollTo 0, (cur.DOORMAT_POS + (cur.offsetHeight - el.offsetHeight))
      else
        cur.style.top = -(cur.offsetHeight) + 'px'
        setNew props.NEXT
        window.scrollTo 0, doormat.current.DOORMAT_POS - (doormat.current.DOORMAT_HEIGHT - doormat.current.offsetHeight)

  inSnapRegion = ->
    cur = doormat.current
    scroll = window.scrollY or window.pageYOffset
    doormat.SNAP_TOP = scroll > ((cur.offsetHeight + cur.DOORMAT_POS) - props.SNAPTHRESHOLDSIZE) and scroll < (cur.DOORMAT_POS + cur.offsetHeight)
    doormat.SNAP_BOTTOM = scroll > ((cur.DOORMAT_POS + cur.offsetHeight) - el.offsetHeight) and scroll < (((cur.DOORMAT_POS + cur.offsetHeight) - el.offsetHeight) + props.SNAPTHRESHOLDSIZE)
    doormat.SNAP_TOP || doormat.SNAP_BOTTOM

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
    else if inSnapRegion()
      debounce(handleSnap, props.SNAPDURATION)

  # Bind window interaction events
  if ('onorientationchange' of window)
    window.onorientationchange = calibrate
  else
    window.onresize = calibrate
  window.onscroll = handleScroll

  # Initialize doormat instance.
  doormat        = @
  doormat.el     = el
  doormat.panels = doormat.el.children

  for prop of opts
    p = prop.toUpperCase()
    if props[p] isnt `undefined`
      props[p] = opts[prop]
    props.SNAPTRANSITIONDURATION = (props.SNAPDURATION / 1000) + 's'
  # NOTE:: Important that current panel is defined before panel calibration.
  doormat.current            = doormat.panels[0]
  doormat.current.className += ' ' + props.CURRENT_CLASS
  calibrate()
  doormat

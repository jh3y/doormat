###
# doormat - http://jh3y.github.io/doormat
#
# @license MIT
# @author jh3y
# (c) 2016
###
PROPS =
  CLASS         : 'dm'
  CURRENT_CLASS : 'dm__pnl--crnt'
  NEXT          : 'next'
  PREVIOUS      : 'previous'
  RESET         : 'reset'
  ## Configurable via options.
  snapping      :
    travel   : false
    viewport : true
    threshold: 30
    debounce : 150
    duration : 250

Doormat = window.Doormat = (opts) ->
  el = document.querySelector '.' + PROPS.CLASS
  return new Doormat(opts) unless @ instanceof Doormat
  throw Error 'Doormat: Must assign element instance' if !el

  # Sets a new current panel to begin scrolling on.
  # This is based on direction but in cases where we resize the window,
  # we can do a RESET.
  setNew = (dir) ->
    cur = doormat.current
    cur.className = cur.className.replace PROPS.CURRENT_CLASS, ''
    cur.style.top = if dir is PROPS.NEXT then  -(cur.offsetHeight) + 'px' else 0
    doormat.current = if dir is PROPS.RESET then doormat.panels[0] else cur[dir + 'ElementSibling']
    doormat.current.className += ' ' + PROPS.CURRENT_CLASS

  # Calibrates doormat panels by setting minimum height to window
  # innerHeight.
  # More importantly sets document.body height based on a cumulative height
  # of panels. This plays a large part in making the effect possible.
  calibrate = (evt) ->
    sumHeight = 0
    i         = 0

    clientHeight = if ('onorientationchange' of window) then screen.height else window.innerHeight
    doormat.CLIENT_HEIGHT = clientHeight
    while i < doormat.panels.length
      panel = doormat.panels[i]
      # NOTE:: Required for window resizing behaviour but also so
      # we can use the ~ selector in our CSS to stop content flashing
      panel.style.zIndex    = 999 - i
      panel.style.display   = 'block'
      panel.style.minHeight = clientHeight + 'px'
      panel.style.top       = '0px'
      panel.DOORMAT_HEIGHT  = panel.offsetHeight
      panel.DOORMAT_POS     = sumHeight
      sumHeight = sumHeight + panel.DOORMAT_HEIGHT
      i++
    doormat.SNAP_THRESHOLD = clientHeight * (PROPS.SNAPPING.THRESHOLD / 100)
    document.body.style.height = sumHeight + 'px'
    # If triggered by a page resize, we want to reset the scroll.
    # This is to avoid strange paint/scroll effects that might arise
    # if mid-panel scroll and then resizing
    if evt
      window.scrollTo 0, 0
      setNew PROPS.RESET

  debounce = (func, delay) ->
    clearTimeout func.TIMER
    func.TIMER = setTimeout func, delay
    return

  handleSnap = ->
    cur = doormat.current
    scroll = window.scrollY or window.pageYOffset
    snapIn = ->
      window.scrollTo 0, (cur.DOORMAT_POS + (cur.offsetHeight - doormat.CLIENT_HEIGHT))
    snapOut = ->
      cur.style.top = -(cur.offsetHeight) + 'px'
      setNew PROPS.NEXT
      window.scrollTo 0, doormat.current.DOORMAT_POS

    if inSnapRegion() and scroll isnt cur.DOORMAT_POS
      reset = ->
        cur.style.transitionProperty = null
        cur.style.transitionDuration = null
        cur.removeEventListener 'transitionend', reset
      set = ->
        cur.style.transitionProperty = 'top'
        cur.style.transitionDuration = PROPS.SNAPPING.DURATION
        cur.addEventListener 'transitionend', reset, false
      if doormat.SNAP_TOP
        if PROPS.SNAPPING.VIEWPORT
          set()
          snapOut()
        else if PROPS.SNAPPING.TRAVEL and doormat.SCROLL_DIR is 'UP'
          window.scrollTo 0, cur.DOORMAT_POS
      if doormat.SNAP_BOTTOM
        set()
        if PROPS.SNAPPING.VIEWPORT
          snapIn()
        else if PROPS.SNAPPING.TRAVEL and doormat.SCROLL_DIR is 'DOWN'
          snapOut()

  inSnapRegion = ->
    cur = doormat.current
    scroll = window.scrollY or window.pageYOffset
    doormat.SNAP_TOP = false
    doormat.SNAP_BOTTOM = false
    doormat.SNAP_TOP = if PROPS.SNAPPING.VIEWPORT then scroll > ((cur.offsetHeight + cur.DOORMAT_POS) - doormat.SNAP_THRESHOLD) and scroll < (cur.DOORMAT_POS + cur.offsetHeight) else scroll > (cur.DOORMAT_POS + (cur.offsetHeight - doormat.SNAP_THRESHOLD)) and scroll < (cur.DOORMAT_POS + cur.offsetHeight)
    doormat.SNAP_BOTTOM = if PROPS.SNAPPING.VIEWPORT then scroll > ((cur.DOORMAT_POS + cur.offsetHeight) - doormat.CLIENT_HEIGHT) and scroll < (((cur.DOORMAT_POS + cur.offsetHeight) - doormat.CLIENT_HEIGHT) + doormat.SNAP_THRESHOLD) else scroll > (cur.DOORMAT_POS + (cur.offsetHeight - doormat.CLIENT_HEIGHT)) + doormat.SNAP_THRESHOLD
    doormat.SNAP_TOP || doormat.SNAP_BOTTOM

  handleScroll = ->
    cur = doormat.current
    scroll = window.scrollY or window.pageYOffset
    doormat.SCROLL_DIR = if scroll > doormat.SCROLL_LAST then 'DOWN' else 'UP'
    doormat.SCROLL_LAST = scroll
    cur.style.top = (cur.DOORMAT_POS - scroll) + 'px';

    if scroll > (cur.DOORMAT_HEIGHT + cur.DOORMAT_POS)
      if cur.nextElementSibling
        setNew PROPS.NEXT
    else if scroll < cur.DOORMAT_POS
      if cur.previousElementSibling
        setNew PROPS.PREVIOUS
    if PROPS.SNAPPING and (PROPS.SNAPPING.VIEWPORT or PROPS.SNAPPING.TRAVEL) and inSnapRegion()
      debounce(handleSnap, PROPS.SNAPPING.DEBOUNCE)

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

  extend = (a, b) ->
    result = {}
    for prop of a
      result[prop.toUpperCase()] = a[prop]
      if b.hasOwnProperty(prop)
        val = b[prop]
        result[prop.toUpperCase()] = if typeof val is 'object' then extend(result[prop.toUpperCase()], val) else val
    result

  PROPS = extend PROPS, opts
  if PROPS.SNAPPING
    PROPS.SNAPPING.DURATION = (PROPS.SNAPPING.DURATION / 1000) + 's'
  # NOTE:: Important that current panel is defined before panel calibration.
  doormat.current            = doormat.panels[0]
  doormat.current.className += ' ' + PROPS.CURRENT_CLASS
  calibrate()
  doormat

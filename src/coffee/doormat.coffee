###
  doormat - http://jh3y.github.io/doormat
  @license MIT

  jh3y (c) 2015
###
props =
  CLASS        : 'doormat'
  PANEL_CLASS  : 'doormat__panel'
  CURRENT_CLASS: 'is--current'
doormat = window.doormat = (el) ->
  throw Error 'doormat: Must define an element' if !el
  doormat  = @
  doormat.el = el
  doormat.el.className += ' ' + props.CLASS
  doormat.panels = doormat.el.children
  calibratePanels = ->
    sumHeight = 0;
    i = 0
    while i < doormat.panels.length
      panel = doormat.panels[i]
      panel.style.minHeight = window.innerHeight + 'px'
      if panel.className.indexOf(props.PANEL_CLASS) is -1
        panel.className       += ' ' + props.PANEL_CLASS
      panel.DOORMAT_HEIGHT  = panel.offsetHeight
      panel.DOORMAT_POS     = sumHeight
      sumHeight = sumHeight + panel.offsetHeight;
      i++
    document.body.style.height = sumHeight + 'px'
  calibratePanels()
  doormat.current = doormat.panels[0]
  doormat.current.className += ' ' + props.CURRENT_CLASS
  setNew = (dir) ->
    cur = doormat.current
    cur.className = cur.className.replace props.CURRENT_CLASS, ''
    cur.style.top = if dir is 'next' then  -(cur.DOORMAT_HEIGHT) + 'px' else 0
    doormat.current = cur[dir + 'ElementSibling']
    doormat.current.className += ' ' + props.CURRENT_CLASS
  window.onresize = (e) ->
    calibratePanels()
  window.onscroll = (e) ->
    cur = doormat.current
    cur.style.top = -(window.scrollY - cur.DOORMAT_POS) + 'px';
    if window.scrollY > (cur.DOORMAT_HEIGHT + cur.DOORMAT_POS)
      if cur.nextElementSibling
        setNew 'next'
    else if window.scrollY < cur.DOORMAT_POS
      if cur.previousElementSibling
        setNew 'previous'

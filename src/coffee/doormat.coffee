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
  sumHeight = 0;
  i = 0
  while i < doormat.panels.length
    doormat.panels[i].style.minHeight = window.innerHeight + 'px'
    doormat.panels[i].className       += ' ' + props.PANEL_CLASS
    doormat.panels[i].DOORMAT_HEIGHT  = doormat.panels[i].offsetHeight
    doormat.panels[i].DOORMAT_POS     = sumHeight
    sumHeight = sumHeight + doormat.panels[i].offsetHeight;
    i++
  document.body.style.height = sumHeight + 'px'
  doormat.current = doormat.panels[0]
  doormat.current.className += ' ' + props.CURRENT_CLASS
  doormat.lastScroll = 0;
  setNew = (dir) ->
    doormat.current.className = doormat.current.className.replace props.CURRENT_CLASS, ''
    doormat.current.style.top = if dir is 'next' then  -(doormat.current.DOORMAT_HEIGHT) + 'px' else 0
    doormat.current = doormat.current[dir + 'ElementSibling']
    doormat.current.className += ' ' + props.CURRENT_CLASS
  window.onscroll = (e) ->
    doormat.current.style.top = -(window.scrollY - doormat.current.DOORMAT_POS) + 'px';
    if window.scrollY > (doormat.current.DOORMAT_HEIGHT + doormat.current.DOORMAT_POS)
      if doormat.current.nextElementSibling
        setNew 'next'
    else if window.scrollY < doormat.current.DOORMAT_POS
      if doormat.current.previousElementSibling
        setNew 'previous'

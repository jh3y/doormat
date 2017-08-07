document.addEventListener('DOMContentLoaded', () => {
  const controls = document.querySelector('.controls')
  const indicators = document.querySelectorAll('.slide-indicator')
  window.newDoormat = new Doormat()
  window.addEventListener('doormat:update', e => {
    if (newDoormat.activeIndex > 1) {
      document.body.classList.add('show-controls')
    } else {
      document.body.classList.remove('show-controls')
    }
    indicators.forEach(i => i.classList.remove('slide-indicator--active'))
    indicators[newDoormat.activeIndex - 1].classList.add(
      'slide-indicator--active',
    )
  })
  const handleNav = e => {
    if (e.target.tagName === 'BUTTON') {
      newDoormat.scrollToPanel(e.target.getAttribute('data-panel'))
    }
  }
  controls.addEventListener('click', handleNav)
})

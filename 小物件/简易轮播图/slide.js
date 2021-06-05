function Slide(options) {
  this.options = options

  if (!this.options.id) {
    console.error('需要盒子id')
    return
  }

  this.slideBox = document.getElementById(this.options.id)
  this.slideItem = this.slideBox.querySelector('.slide_item')
  this.preBtn = this.slideBox.querySelector('.slide_pre')
  this.nextBtn = this.slideBox.querySelector('.slide_next')
  this.slideDot = this.slideBox.querySelector('.slide_dot')

  this.slideBoxWidth = this.slideBox.offsetWidth
  this.itemLen = this.slideItem.querySelectorAll('li').length
  this.activeIndex = 0
  
  this.init()
}

Slide.prototype.init = function() {
  this.setDot()

  this.preBtn.onclick = () => {
    this.prev()
  }

  this.nextBtn.onclick = () => {
    this.next()
  }
}

Slide.prototype.prev = function() {
  this.activeIndex = this.activeIndex === 0 ? this.itemLen - 1 : this.activeIndex - 1
  this.tab()
}

Slide.prototype.next = function () {
  this.activeIndex = this.activeIndex === this.itemLen - 1 ? 0 : this.activeIndex + 1
  this.tab()
}

Slide.prototype.tab = function() {
  this.slideItem.style.transition = '0.3s'
  this.slideItem.style.transform = 'translateX(' + (-this.activeIndex * this.slideBoxWidth) + 'px)'
  this.setDot()
}

Slide.prototype.setDot = function() {
  let item = this.slideDot.querySelectorAll('li')
  
  for (let i = 0; i < item.length; i++) {
    item[i].className = ''
  }
  item[this.activeIndex].className = 'active'
}


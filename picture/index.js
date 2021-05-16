/*
 * @Author: duiying
 * @CreateDate: Do not edit
 * @LastEditors: duiying
 * @LastEditTime: 2020-06-17 20:38:13
 * @Description: ...
 */ 

const picBox = document.getElementById('picBox')
let imgDom, initClientX, initClientY, clientX, clientY, imgDomW, imgDomH, imgDomX, imgDomY
let resetImgStep = 0

init = () => {
  for(let i = 0; i < 3; i++) {
    picBox.innerHTML = picBox.innerHTML + '<img src="./' + (i + 1) + '.jpg" />'
  }
  
  initImgParams()

  picBox.addEventListener('touchstart', touchstart, false)
  picBox.addEventListener('touchmove', touchmove, false)
  picBox.addEventListener('touchend', touchend, false)
}

initImgParams = () => {
  imgDom = picBox.childNodes[0]
  imgDomW = imgDom.width
  imgDomH = imgDom.height
  imgDomX = imgDom.x - imgDomW / 2
  imgDomY = imgDom.y
}

touchstart = (e) => {
  e = e.touches[0]
  // console.log(e)

  clientX = e.clientX
  clientY = e.clientY
  initClientX = e.clientX
  initClientY = e.clientY
}

touchmove = (e) => {
  e = e.touches[0]
  // console.log(e)

  imgDomX = imgDomX + e.clientX - clientX
  imgDomY = imgDomY + e.clientY - clientY
  clientX = e.clientX
  clientY = e.clientY

  imgDom.style.left = imgDomX + 'px'
  imgDom.style.top = imgDomY + 'px'

  rotate()
}

touchend = (e) => {
  // console.log('touchend')

  imgDom.style.transition = 'all .6s'
  imgDom.style.left = imgDomX - imgDomW * 1.5 + 'px'
  imgDom.style.top = imgDomY + 80 + 'px'
  rotate(10)

  setTimeout(() => {
    resetImg()
  }, 600)
}

rotate = (t = 0) => {
  let w = initClientX - clientX
  let h = clientY - initClientY
  let r = (90 - (180 * (Math.atan(h / w)) / Math.PI)) / 2 + t
  imgDom.style.transform = 'rotate(' + r + 'deg)'
}

resetImg = () => {
  resetImgStep++
  picBox.innerHTML = ''
  for(let i = resetImgStep; i < resetImgStep + 3; i++) {
    picBox.innerHTML = picBox.innerHTML + '<img src="./' + (i + 1) + '.jpg" />'
  }
}

init()

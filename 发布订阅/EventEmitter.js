class EventEmitter {

  constructor() {
    this._events = {}
  }
  
  on(name, fn) {
    if (!this._events[name]) this._events[name] = []
    let cbs = this._events[name]
    if (cbs.indexOf(fn) === -1) {
      this._events[name].push(fn)
    }
  }

  emit(name, ...args) {
    let cbs = this._events[name]
    if (!cbs) return
    
    for (let len = cbs.length, i = len - 1; i >= 0; i--) {
      try {
        cbs[i].apply(this, args)
      } catch (e) {

      }
    }
  }

  off(name, fn) {
    let cbs = this._events[name]
    if (!cbs) return
    
    if (fn == null) {
      this._events[name] = []
      return
    }

    for (let len = cbs.length, i = len - 1; i >= 0; i--) {
      if (cbs[i] === fn) {
        cbs.splice(i, 1)
      }
    }
  }

}

let eventEmitter = new EventEmitter()

// eventEmitter.on('duiying', () => {
//   console.log('此人被上天眷顾')
// })
// eventEmitter.emit('duiying')

// eventEmitter.on('meinv', arr => {
//   console.log(arr)
// })
// eventEmitter.emit('meinv', ['张欢', '张锦娜', '陈泽玲', '刘丹雁'])

eventEmitter.on('haoju', (str1, str2) => {
  console.log(`${str1}，${str2}`)
})
eventEmitter.emit('haoju', '寒冰不能断流水', '枯木也能再逢春')

eventEmitter.off('haoju')
eventEmitter.emit('haoju', '寒冰不能断流水', '枯木也能再逢春')

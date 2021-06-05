window.onload = () => {
  
  const box = document.getElementById('box')

  const handlerItemInput = () => {
    const item = box.children

    for (let i = 0; i < item.length; i++) {
      item[i].ondrop = ev => {
        ev.preventDefault()
        let index = ev.dataTransfer.getData("data-index")
        let start_children = item[index].children[0]
        let end_children = item[i].children[0]
        item[index].replaceChild(end_children, start_children)
        item[i].appendChild(start_children)
        handlerItemInput()
      }

      item[i].ondragover = ev => {
        ev.preventDefault()
      }

      let input = item[i].children[0]

      input.setAttribute('draggable', 'true')

      input.ondragstart = ev => {
        ev.dataTransfer.setData("data-index", i)
      }
    }
  }
  
  handlerItemInput()

}
